#!/bin/bash
# Runs as root on the COS VM (invoked over IAP SSH by .github/workflows/deploy.yml).
# COS has no docker compose, so it runs from the docker:cli image.
set -euo pipefail
cd /var/lib/alv
export DOCKER_CONFIG=/var/lib/alv/.docker

# Log in to Artifact Registry with the VM service account's token
registry=$(sed -n 's/^REGISTRY=//p' .env)
curl -sf -H 'Metadata-Flavor: Google' \
  http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token \
  | sed -E 's/.*"access_token":"([^"]+)".*/\1/' \
  | docker login -u oauth2accesstoken --password-stdin "https://${registry%%/*}"

docker run --rm -v /var/run/docker.sock:/var/run/docker.sock -v "$PWD:$PWD" -w "$PWD" \
  -e DOCKER_CONFIG docker:27-cli compose up -d --pull always --remove-orphans

docker image prune -af
