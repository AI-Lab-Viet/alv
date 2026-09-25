output "ip" { value = google_compute_address.vm.address }

output "urls" {
  value = {
    web  = "https://${local.domain}"
    api  = "https://api.${local.domain}"
    hanh = "https://hanh.${local.domain}"
  }
}

# Set as GitHub Actions repository variables (see infra/README.md)
output "github_variables" {
  value = {
    GCP_PROJECT_ID = var.project_id
    GCP_REGION     = var.region
    GCP_ZONE       = var.zone
    VM_NAME        = google_compute_instance.vm.name
    WIF_PROVIDER   = google_iam_workload_identity_pool_provider.github.name
    DEPLOYER_SA    = google_service_account.deployer.email
    DOMAIN         = local.domain
  }
}
