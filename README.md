# Portfolio Next.js (migration depuis Rails/Heroku)

Version Next.js + Prisma du portfolio, alimentée par la même base PostgreSQL que l’app Rails (après restauration du dump Heroku).

## Démarrage rapide (local)

### 1. Démarrer PostgreSQL (Docker)

Le projet utilise PostgreSQL 17 via Docker sur le port **5433**.

```bash
# Démarrer le conteneur (doit exister au préalable)
docker start portfolio-pg17

# Vérifier qu'il tourne
docker ps | grep portfolio-pg17
```

Si le conteneur n'existe pas, le créer :

```bash
docker run -d \
  --name portfolio-pg17 \
  -e POSTGRES_USER=quentin \
  -e POSTGRES_DB=portfolio_next \
  -e POSTGRES_HOST_AUTH_METHOD=trust \
  -p 5433:5432 \
  postgres:17
```

### 2. Configurer et lancer

```bash
cp .env.example .env
# Vérifier que DATABASE_URL pointe sur le port 5433 :
# DATABASE_URL="postgresql://quentin@localhost:5433/portfolio_next?schema=public"

npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Restauration depuis Heroku

1. **Récupérer la base Heroku** (voir [MIGRATION.md](./MIGRATION.md)) :
   ```bash
   ./scripts/heroku-dump.sh NOM_APP_HEROKU
   ```

2. **Restaurer le dump** dans le conteneur Docker :
   ```bash
   docker exec -i portfolio-pg17 pg_restore -U quentin -d portfolio_next < backup-XXXX.dump
   ```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de dev |
| `npm run build` | Build production |
| `npm run db:studio` | Interface Prisma Studio (tables + données) |
| `npm run db:pull` | Régénérer `prisma/schema.prisma` à partir de la BDD |

## Variables Heroku (production)

### Requises pour Next.js

| Variable | Usage |
|---------|-------|
| `DATABASE_URL` | Ajoutée automatiquement par Heroku Postgres |
| `AUTH_SECRET` | NextAuth (sessions) |
| `NEXTAUTH_URL` | URL de l'app (ex: `https://votre-app.herokuapp.com`) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Affichage des images |
| `CLOUDINARY_URL` | Upload admin (format: `cloudinary://key:secret@cloud_name`) |

### Optionnelles

| Variable | Usage |
|---------|-------|
| `NEXT_PUBLIC_CLOUDINARY_FOLDER` | Dossier Cloudinary (défaut: `production`) |

### À supprimer (héritage Rails)

Ces variables ne sont plus utilisées par cette app Next.js :

- `EMAIL_PASSWORD`, `EMAIL_USERNAME`
- `RACK_ENV`, `RAILS_ENV`, `RAILS_LOG_TO_STDOUT`, `RAILS_SERVE_STATIC_FILES`
- `SECRET_KEY_BASE`
- `S3_ACCESS_KEY`, `S3_BUCKET_NAME`, `S3_REGION`, `S3_SECRET_KEY` (sauf si sitemap S3 réactivé)
- `DATABASE_PRISMA_URL` (si présente : Prisma utilise `DATABASE_URL`)

`LANG` peut rester (variable système courante).

## Migration complète

Toutes les étapes détaillées (dump Heroku, restauration, Cloudinary, déploiement) sont dans **[MIGRATION.md](./MIGRATION.md)**.
