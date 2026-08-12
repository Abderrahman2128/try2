#!/bin/bash

set -e

REPO_NAME=$1
PROJECT_DIR="/var/www/$REPO_NAME"
BACKUP_DIR="/var/www/backups"
TIMESTAMP=$(date +%F-%H-%M-%S)

if [ -z "$REPO_NAME" ]; then
  echo "Error: No repository name provided to deploy.sh!"
  exit 1
fi

echo "Starting Deployment Process..."

git config --global --add safe.directory "$PROJECT_DIR"
mkdir -p "$BACKUP_DIR"

# 1. Create a backup of the current state
echo "Creating backup..."
rsync -a --exclude='venv' --exclude='.git' --exclude='node_modules' "$PROJECT_DIR/" "$BACKUP_DIR/${REPO_NAME}-backup-$TIMESTAMP/"

# 2. Pull latest changes from main
cd "$PROJECT_DIR"
echo "Pulling latest code from GitHub..."
git stash
git pull origin main

# 3. Install dependencies
echo "Installing dependencies..."
npm install --production

# 4. Build step (if your project requires compilation)
if npm run | grep -q "build"; then
    echo "Building application..."
    npm run build
fi

# 5. Update Docker containers (zero-downtime)
if command -v docker &> /dev/null; then
    echo "Updating Docker containers..."
    docker compose up -d --build
fi

# 6. Reload PM2 services
if command -v pm2 &> /dev/null && [ -f "ecosystem.config.js" ]; then
    echo "Reloading PM2..."
    pm2 reload all --update-env || pm2 start ecosystem.config.js
else
    echo "Skipping PM2 (no ecosystem.config.js found)..."
fi

# 7. Reload Nginx to apply any routing changes
if command -v nginx &> /dev/null; then
    echo "Reloading Nginx..."
    sudo systemctl reload nginx
fi

echo "Deployment completed successfully!"
