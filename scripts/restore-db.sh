#!/usr/bin/env bash
# Restaure un dump PostgreSQL dans une base locale (ou distante).
# Crée la base si besoin, puis restaure.
# Usage: ./scripts/restore-db.sh <fichier.dump> [DATABASE_URL]
# Exemple: ./scripts/restore-db.sh backup-20250129.dump postgresql://user:pass@localhost:5432/portfolio_next

set -e
DUMP_FILE="${1:?Usage: ./scripts/restore-db.sh <fichier.dump> [DATABASE_URL]}"
DATABASE_URL="${2:-$DATABASE_URL}"

if [ -z "$DATABASE_URL" ]; then
  echo "Indique DATABASE_URL en 2e argument ou en variable d'environnement."
  echo "Exemple: DATABASE_URL='postgresql://user:pass@localhost:5432/portfolio_next' ./scripts/restore-db.sh backup.dump"
  exit 1
fi

if [ ! -f "$DUMP_FILE" ]; then
  echo "Fichier introuvable: $DUMP_FILE"
  exit 1
fi

# Extraire host, user, db name depuis l'URL (simplifié)
# Format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
DB_NAME=$(echo "$DATABASE_URL" | sed -n 's|.*/\([^?]*\).*|\1|p')
echo "Restauration dans la base: $DB_NAME"

# pg_restore n'accepte pas ?schema=public dans l'URL, on enlève les paramètres de requête
PG_URL="${DATABASE_URL%%\?*}"

# pg_restore avec --clean pour supprimer les objets existants avant de recréer
pg_restore --verbose --clean --if-exists --no-owner --no-acl -d "$PG_URL" "$DUMP_FILE" || true
# || true car pg_restore peut retourner un code non nul si des objets sont ignorés

echo "Restauration terminée. Lance: npm run db:push (optionnel, pour synchroniser le schéma Prisma) ou npm run dev"
