 #!/bin/bash

set -e

REPO_NAME=$1
PROJECT_DIR="/var/www/$REPO_NAME"
BACKUP_DIR="/var/www/backups"
TIMESTAMP=$(date +%F-%H-%M-%S)

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

echo "Starting Deployment Process..."

# 1. Create a backup of the current state
echo "Creating backup..."
rsync -a --exclude='node_modules' --exclude='.git' "$PROJECT_DIR/" "$BACKUP_DIR/my-project-backup-$TIMESTAMP/"

# 2. Stash any accidental local changes on the server
echo "Stashing local server changes..."
git stash

# 3. Pull the latest code from the main branch
echo "Pulling latest code from main..."
git pull origin main

# 4. Install dependencies
echo "Installing dependencies..."
npm install --production

# 5. Build step (if your project requires compilation)
if npm run | grep -q "build"; then
    echo "Building application..."
    npm run build
fi

# 6. Update Docker containers (zero-downtime)
if command -v docker &> /dev/null; then
    echo "Updating Docker containers..."
    docker compose up -d --build
fi

# 7. Reload PM2 services (zero-downtime)
if command -v pm2 &> /dev/null; then
    echo "Reloading PM2..."
    pm2 reload all --update-env || pm2 start ecosystem.config.js
fi

# 7. Reload Nginx to apply any routing changes
echo "Reloading Nginx..."
sudo systemctl reload nginx

echo "Deployment completed successfully!" 
