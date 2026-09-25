variable "project_id" { type = string }

variable "region" {
  type    = string
  default = "asia-southeast1"
}

variable "zone" {
  type    = string
  default = "asia-southeast1-b"
}

variable "machine_type" {
  type    = string
  default = "e2-medium"
}

variable "disk_size_gb" {
  type    = number
  default = 30
}

variable "github_repo" {
  type    = string
  default = "AI-Lab-Viet/alv"
}

variable "domain" {
  type        = string
  default     = ""
  description = "Root domain; needs A records for @, api, hanh -> VM IP. Empty = <ip>.sslip.io"
}
