#!/usr/bin/env bash
# Récupère un dump de la base Heroku (à exécuter sur ta machine, avec Heroku CLI installé).
# Usage: ./scripts/heroku-dump.sh [nom_app_heroku]

set -e
APP_NAME="${1:-$(basename "$(git rev-parse --show-toplevel 2>/dev/null)" 2>/dev/null)}"

if [ -z "$APP_NAME" ]; then
  echo "Usage: ./scripts/heroku-dump.sh <nom_app_heroku>"
  echo "Exemple: ./scripts/heroku-dump.sh mon-portfolio-rails"
  exit 1
fi

echo "App Heroku: $APP_NAME"
echo "Création d'une sauvegarde sur Heroku..."
heroku pg:backups:capture --app "$APP_NAME"

echo "Téléchargement du dump..."
heroku pg:backups:download --app "$APP_NAME" --output "./backup-$(date +%Y%m%d-%H%M).dump"

echo "Dump téléchargé dans le répertoire courant (backup-*.dump)."
echo "Ensuite: restaure avec ./scripts/restore-db.sh backup-XXXX.dump"
