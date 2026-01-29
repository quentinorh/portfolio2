# Portfolio Next.js (migration depuis Rails/Heroku)

Version Next.js + Prisma du portfolio, alimentée par la même base PostgreSQL que l’app Rails (après restauration du dump Heroku).

## Démarrage rapide

1. **Récupérer la base Heroku** (voir [MIGRATION.md](./MIGRATION.md)) :
   ```bash
   ./scripts/heroku-dump.sh NOM_APP_HEROKU
   ```

2. **Créer une base PostgreSQL** (locale ou Neon/Supabase) et **restaurer le dump** :
   ```bash
   DATABASE_URL="postgresql://user:pass@localhost:5432/portfolio_next" ./scripts/restore-db.sh backup-XXXX.dump
   ```

3. **Configurer et lancer** :
   ```bash
   cp .env.example .env
   # Éditer .env : DATABASE_URL et optionnellement NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
   npm install
   npm run dev
   ```

Ouvre [http://localhost:3000](http://localhost:3000).

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de dev |
| `npm run build` | Build production |
| `npm run db:studio` | Interface Prisma Studio (tables + données) |
| `npm run db:pull` | Régénérer `prisma/schema.prisma` à partir de la BDD |

## Migration complète

Toutes les étapes détaillées (dump Heroku, restauration, Cloudinary, déploiement) sont dans **[MIGRATION.md](./MIGRATION.md)**.
