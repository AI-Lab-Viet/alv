terraform {
  required_version = ">= 1.5"
  required_providers {
    google = { source = "hashicorp/google", version = "~> 6.0" }
  }
  # bucket passed at init: terraform init -backend-config="bucket=<state-bucket>"
  backend "gcs" { prefix = "alv" }
}

provider "google" {
  project = var.project_id
  region  = var.region
  zone    = var.zone
}

data "google_project" "this" {}

locals {
  domain = var.domain != "" ? var.domain : "${google_compute_address.vm.address}.sslip.io"
}

resource "google_project_service" "apis" {
  for_each = toset([
    "compute.googleapis.com",
    "artifactregistry.googleapis.com",
    "iam.googleapis.com",
    "iamcredentials.googleapis.com",
    "sts.googleapis.com",
    "iap.googleapis.com",
    "oslogin.googleapis.com",
  ])
  service            = each.value
  disable_on_destroy = false
}

# ---------- Registry ----------

resource "google_artifact_registry_repository" "alv" {
  repository_id = "alv"
  format        = "DOCKER"
  location      = var.region

  cleanup_policies {
    id     = "keep-recent"
    action = "KEEP"
    most_recent_versions { keep_count = 10 }
  }
  cleanup_policies {
    id     = "delete-old"
    action = "DELETE"
    condition { older_than = "604800s" }
  }

  depends_on = [google_project_service.apis]
}

# ---------- VM (Container-Optimized OS) ----------

resource "google_service_account" "vm" {
  account_id   = "alv-vm"
  display_name = "ALV VM"
}

resource "google_artifact_registry_repository_iam_member" "vm_pull" {
  repository = google_artifact_registry_repository.alv.name
  location   = var.region
  role       = "roles/artifactregistry.reader"
  member     = "serviceAccount:${google_service_account.vm.email}"
}

resource "google_project_iam_member" "vm" {
  for_each = toset(["roles/logging.logWriter", "roles/monitoring.metricWriter"])
  project  = var.project_id
  role     = each.value
  member   = "serviceAccount:${google_service_account.vm.email}"
}

resource "google_compute_address" "vm" {
  name       = "alv-ip"
  depends_on = [google_project_service.apis]
}

resource "google_compute_firewall" "web" {
  name          = "alv-allow-web"
  network       = "default"
  source_ranges = ["0.0.0.0/0"]
  target_tags   = ["alv"]
  allow {
    protocol = "tcp"
    ports    = ["80", "443"]
  }
  allow {
    protocol = "udp"
    ports    = ["443"]
  }
}

# SSH only through IAP (used by GitHub Actions to deploy)
resource "google_compute_firewall" "iap_ssh" {
  name          = "alv-allow-iap-ssh"
  network       = "default"
  source_ranges = ["35.235.240.0/20"]
  target_tags   = ["alv"]
  allow {
    protocol = "tcp"
    ports    = ["22"]
  }
}

resource "google_compute_instance" "vm" {
  name         = "alv"
  machine_type = var.machine_type
  tags         = ["alv"]

  boot_disk {
    initialize_params {
      image = "cos-cloud/cos-stable"
      size  = var.disk_size_gb
      type  = "pd-balanced"
    }
  }

  network_interface {
    network = "default"
    access_config { nat_ip = google_compute_address.vm.address }
  }

  metadata = {
    enable-oslogin         = "TRUE"
    google-logging-enabled = "true"
  }

  service_account {
    email  = google_service_account.vm.email
    scopes = ["cloud-platform"]
  }

  # COS updates itself in place; a newer image in the family must not recreate the VM
  lifecycle { ignore_changes = [boot_disk[0].initialize_params[0].image] }

  allow_stopping_for_update = true
  depends_on                = [google_project_service.apis]
}

# ---------- GitHub Actions (Workload Identity Federation, no keys) ----------

resource "google_service_account" "deployer" {
  account_id   = "alv-deployer"
  display_name = "ALV GitHub Actions deployer"
}

resource "google_artifact_registry_repository_iam_member" "deployer_push" {
  repository = google_artifact_registry_repository.alv.name
  location   = var.region
  role       = "roles/artifactregistry.writer"
  member     = "serviceAccount:${google_service_account.deployer.email}"
}

resource "google_project_iam_member" "deployer" {
  for_each = toset([
    "roles/compute.viewer",
    "roles/compute.osAdminLogin",
    "roles/iap.tunnelResourceAccessor",
  ])
  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.deployer.email}"
}

# required to SSH into a VM that runs as another service account
resource "google_service_account_iam_member" "deployer_act_as_vm" {
  service_account_id = google_service_account.vm.name
  role               = "roles/iam.serviceAccountUser"
  member             = "serviceAccount:${google_service_account.deployer.email}"
}

resource "google_iam_workload_identity_pool" "github" {
  workload_identity_pool_id = "github"
  depends_on                = [google_project_service.apis]
}

resource "google_iam_workload_identity_pool_provider" "github" {
  workload_identity_pool_id          = google_iam_workload_identity_pool.github.workload_identity_pool_id
  workload_identity_pool_provider_id = "github"
  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
  }
  attribute_condition = "assertion.repository == '${var.github_repo}' && assertion.ref == 'refs/heads/main'"
  oidc { issuer_uri = "https://token.actions.githubusercontent.com" }
}

resource "google_service_account_iam_member" "deployer_wif" {
  service_account_id = google_service_account.deployer.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.github.name}/attribute.repository/${var.github_repo}"
}
