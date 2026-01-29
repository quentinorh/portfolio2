# Déployer Next.js sur le **même** projet Heroku (quentino-io)

Tu n’as **pas besoin de créer une nouvelle base** sur Heroku : l’app `quentino-io` a déjà un Postgres attaché. Next.js utilisera la **même** base que l’ancien site Rails.

## 1. Base de données : rien à créer

- La base PostgreSQL est déjà liée à l’app Heroku.
- La variable `DATABASE_URL` est déjà définie sur l’app (tu peux vérifier avec `heroku config -a quentino-io`).
- Au déploiement, Next.js lira cette variable et se connectera à la même base.

Tu peux éventuellement faire un dump (comme tu l’as fait) pour avoir une copie de secours ou pour tester en local ; pour la prod sur Heroku, on réutilise directement cette base.

---

## 2. Passer l’app Heroku de Rails à Next.js

L’idée : garder la même app Heroku, mais qu’elle exécute Next.js au lieu de Rails.

### Option A : Déployer depuis le dossier `portfolio-next` (recommandé)

1. **Dans le repo `portfolio-next`** (ou le dossier où est ton code Next.js) :

   ```bash
   cd /home/quentin/code/quentinorh/portfolio-next
   git init   # si pas déjà un repo git
   git add .
   git commit -m "Next.js portfolio"
   ```

2. **Associer le remote Heroku à l’app existante** :

   ```bash
   heroku git:remote -a quentino-io
   ```

   Si tu as déjà un remote `heroku` qui pointe ailleurs, supprime-le puis refais :
   `git remote remove heroku` puis `heroku git:remote -a quentino-io`.

3. **Utiliser le buildpack Next.js** (au lieu de Ruby) :

   ```bash
   heroku buildpacks:set https://github.com/mars/heroku-nextjs.git -a quentino-io
   ```

4. **Variables d’environnement**  
   `DATABASE_URL` est déjà définie par l’add-on Postgres.  
   Si tu utilises Cloudinary pour les images, ajoute (avec tes vraies valeurs) :

   ```bash
   heroku config:set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=ton_cloud_name -a quentino-io
   ```

5. **Déployer** :

   ```bash
   git push heroku main
   ```

   (Ou `git push heroku master` si ta branche par défaut s’appelle `master`.)

Après le déploiement, l’app `quentino-io` sert Next.js et utilise **la même base PostgreSQL** que avant.

### Option B : Garder le repo actuel (portfolio2) et y ajouter Next.js

Si tu préfères un seul repo avec à la fois l’ancien code Rails et le nouveau Next.js :

- Tu peux mettre le code Next.js dans un sous-dossier (ex. `frontend/` ou `next/`).
- Sur Heroku, tu configures le **buildpack** et la **racine du projet** (ou le sous-dossier) selon la doc du buildpack (certains buildpacks permettent de définir un sous-dossier).  
  Pour rester simple, **Option A** (repo dédié `portfolio-next`) est plus directe.

---

## 3. Vérifications après déploiement

- Ouvre `https://quentino-io.herokuapp.com` (ou l’URL de ton app).
- Vérifie que les projets s’affichent (données de la même base).
- Si les images ne s’affichent pas, vérifie `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` (et éventuellement les autres variables Cloudinary si tu les utilises côté serveur).

---

## 4. Résumé des commandes (même projet Heroku)

| Étape | Commande |
|-------|----------|
| Remote Heroku (app existante) | `heroku git:remote -a quentino-io` |
| Buildpack Next.js | `heroku buildpacks:set https://github.com/mars/heroku-nextjs.git -a quentino-io` |
| Cloudinary (optionnel) | `heroku config:set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx -a quentino-io` |
| Déployer | `git push heroku main` |

La base PostgreSQL existante sur Heroku est réutilisée ; inutile d’en créer une nouvelle.
