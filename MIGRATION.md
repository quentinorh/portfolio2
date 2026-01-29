# Migration Rails (Heroku) → Next.js + Prisma

## 1. Récupérer la base Heroku

### Prérequis
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) installé et connecté (`heroku login`)
- Ton app Heroku en ligne

### Dump de la base

```bash
# Remplace NOM_APP_HEROKU par le nom de ton app (ex: portfolio-quentin)
cd portfolio-next
chmod +x scripts/*.sh
./scripts/heroku-dump.sh NOM_APP_HEROKU
```

Cela crée un fichier `backup-YYYYMMDD-HHMM.dump` dans le répertoire courant.

**Alternative sans script** (depuis le dossier de l’app Rails ou n’importe où) :

```bash
heroku pg:backups:capture --app NOM_APP_HEROKU
heroku pg:backups:download --app NOM_APP_HEROKU --output backup.dump
```

---

## 2. Créer une base PostgreSQL pour Next.js

- **En local** : crée une base (ex. `portfolio_next`) avec `createdb portfolio_next` ou via pgAdmin.
- **En ligne** : crée une base sur [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app) ou Vercel Postgres, et récupère l’URL de connexion.

---

## 3. Restaurer le dump dans cette base

```bash
# Avec une URL (remplace par ta vraie URL)
export DATABASE_URL="postgresql://user:password@localhost:5432/portfolio_next"
./scripts/restore-db.sh backup-XXXX.dump

# Ou en une ligne
DATABASE_URL="postgresql://..." ./scripts/restore-db.sh backup-XXXX.dump
```

**Important** : utilise une **copie** de la prod (nouvelle base), pas directement la base Heroku, pour éviter d’écraser la prod.

---

## 4. Configurer Next.js

```bash
cp .env.example .env
# Édite .env et mets ta DATABASE_URL (celle de la base où tu as restauré le dump)
```

---

## 5. Vérifier que Prisma voit les données

```bash
npm install
npm run db:studio
```

Ouvre l’URL affichée : tu dois voir les tables `users`, `posts`, `tags`, `taggings`, `active_storage_blobs`, `active_storage_attachments`, etc. avec les données restaurées.

**Ne pas lancer `prisma migrate`** : la base a déjà le schéma Rails. On utilise `prisma db pull` si tu veux régénérer le `schema.prisma` à partir de la BDD, ou on garde le schéma actuel déjà aligné.

---

## 6. Images (Cloudinary)

En Rails, les photos sont liées via Active Storage (tables `active_storage_attachments` + `active_storage_blobs`). La colonne `key` des blobs contient en général l’identifiant Cloudinary.

Dans Next.js, pour afficher une image :

- Récupérer le `key` du blob attaché au post.
- Construire l’URL Cloudinary : `https://res.cloudinary.com/TON_CLOUD_NAME/image/upload/KEY` ou utiliser le SDK Cloudinary.

Tu peux réutiliser les mêmes variables d’environnement Cloudinary que sur Rails.

---

## 7. Déploiement

- **Vercel** : connecte le repo, définis `DATABASE_URL` (et Cloudinary si besoin) dans les variables d’environnement. La BDD peut rester sur Neon/Supabase/Heroku Postgres.
- **Autres** : même principe : `DATABASE_URL` pointant vers ta base PostgreSQL (copie prod ou nouvelle).

---

## Résumé des commandes

| Étape | Commande |
|-------|----------|
| Dump Heroku | `./scripts/heroku-dump.sh NOM_APP` |
| Restaurer | `DATABASE_URL="..." ./scripts/restore-db.sh backup.dump` |
| Config | `cp .env.example .env` puis éditer `DATABASE_URL` |
| Vérifier | `npm run db:studio` |
| Lancer le site | `npm run dev` |
