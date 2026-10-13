
#!/usr/bin/env bash
set -Eeuo pipefail

IMAGE_TAG="${1:?Usage: deploy.sh <full-commit-sha>}"

if [[ ! "$IMAGE_TAG" =~ ^[0-9a-f]{40}$ ]]; then
  echo "ERROR: IMAGE_TAG must be a full 40-character Git SHA"
  exit 1
fi

cd /home/ubuntu/my-portfolio

export IMAGE_TAG

COMPOSE=(
  docker compose
  --env-file .env.production
  -f docker-compose.prod.yml
  -f docker-compose.cd.yml
)

echo "Deploying commit: $IMAGE_TAG"

# Validate configuration without printing secrets
"${COMPOSE[@]}" config --quiet

# Pull all three images
"${COMPOSE[@]}" pull api cms web

# Recreate containers using the selected images
"${COMPOSE[@]}" up -d --no-build --no-deps api cms web

# Show container status
"${COMPOSE[@]}" ps

echo "Deploy commands completed for $IMAGE_TAG"
