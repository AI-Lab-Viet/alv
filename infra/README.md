# Triển khai lên GCP

```
push main ──► GitHub Actions ──► build 3 image (api, hanh, web) ──► Artifact Registry
                      └──► IAP SSH vào VM COS ──► docker compose up (caddy, web, api, worker, hanh, redis)
```

- VM: Container-Optimized OS, IP tĩnh, chỉ mở 80/443; SSH chỉ qua IAP.
- GitHub → GCP qua Workload Identity Federation (không có key JSON), chỉ repo `AI-Lab-Viet/alv`, nhánh `main`.
- Caddy tự cấp HTTPS. Không có domain thì dùng `<ip>.sslip.io`.
  - `https://<domain>` → web · `https://api.<domain>` → `api/` · `https://hanh.<domain>` → `Hành Module/`

## 1. Hạ tầng (làm một lần)

```bash
gcloud auth application-default login
gcloud storage buckets create gs://<project-id>-tfstate --location=asia-southeast1   # lưu state

cd infra
terraform init -backend-config="bucket=<project-id>-tfstate"
terraform apply -var project_id=<project-id>        # thêm -var domain=example.com nếu có domain
```

Có domain riêng thì tạo bản ghi A cho `@`, `api`, `hanh` trỏ về `terraform output ip`.

## 2. Cấu hình GitHub

Variables (lấy từ output của Terraform):

```bash
terraform output -json github_variables \
  | jq -r 'to_entries[] | "gh variable set \(.key) --body \(.value)"' | sh
```

Secrets:

```bash
gh secret set GEMINI_API_KEY
gh secret set SUPABASE_URL
gh secret set SUPABASE_KEY        # key dùng cho api/
gh secret set SUPABASE_ANON_KEY   # dùng cho Hành Module và web
```

Khi deploy, các secret này được ghi vào `/var/lib/alv/.env` (quyền 600) trên VM và truyền vào container backend.
`SUPABASE_URL` và `SUPABASE_ANON_KEY` cũng được nhúng vào bản build của web (`NEXT_PUBLIC_*`).
Các biến còn lại (Redis, URL backend) đã cố định trong `deploy/docker-compose.yml` và workflow.

## 3. Deploy

Tự động khi push lên `main` (bỏ qua các thay đổi chỉ ở `*.md`, `infra/`, `assets/`). Chạy tay: Actions → *Build & Deploy* → *Run workflow*.

Đổi secret thì cần chạy lại workflow để nạp giá trị mới.

Rollback: mở lần chạy cũ của workflow → *Re-run all jobs*.

## Vận hành

```bash
gcloud compute ssh alv --zone asia-southeast1-b --tunnel-through-iap
sudo docker ps
sudo docker logs -f alv-api-1
```
