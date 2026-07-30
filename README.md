# Boutique Digitale — Showcase E-commerce (Next.js + Cloudflare)

Site vitrine premium sans paiement en ligne : catalogue de produits, fiche produit avec CTA WhatsApp, et dashboard admin pour gérer le catalogue et suivre l'engagement.

## Stack
- Next.js 14 (App Router), déployé sur Cloudflare Workers via `@opennextjs/cloudflare` (l'adaptateur recommandé par Cloudflare ; `@cloudflare/next-on-pages` est déprécié)
- Tailwind CSS
- Cloudflare D1 (SQL) + Cloudflare R2 (images)

## Structure du projet
```
src/
  app/
    page.tsx                    Accueil
    products/page.tsx           Catalogue (recherche + filtres + grille)
    products/[productId]/       Fiche produit + CTA WhatsApp + produits similaires
    admin/page.tsx               Dashboard (protégé par middleware)
    admin/login/page.tsx         Connexion admin
    api/products/                CRUD produits
    api/upload/                  Upload d'image vers R2 (validé)
    api/images/[key]/            Proxy R2 (le bucket n'est jamais exposé)
    api/analytics/                Tracking visites/clics + résumé admin
    api/auth/                     Login/logout (cookie de session signé)
  middleware.ts                  Protège /admin
  lib/db.ts                      Accès D1 (requêtes préparées uniquement)
  lib/auth.ts                    Signature/vérification du token de session
  components/                    UI réutilisable
schema.sql                       Schéma D1 (products, analytics_events)
wrangler.toml                    Config Cloudflare Pages/D1/R2
```

## Mise en route

1. `npm install`
2. Créer la base D1 : `wrangler d1 create ecommerce_showcase_db`, copier l'ID retourné dans `wrangler.toml`.
3. Appliquer le schéma : `wrangler d1 execute ecommerce_showcase_db --file=schema.sql`
4. Créer le bucket R2 : `wrangler r2 bucket create ecommerce-showcase-images`
5. Copier `.env.example` en `.env.local` pour le dev local, et définir `ADMIN_PASSWORD`, `ADMIN_SECRET` (une longue chaîne aléatoire), et `WHATSAPP_PHONE_NUMBER` (format international sans `+`).
6. Dev local : `npm run dev` (les bindings D1/R2 réels ne sont disponibles qu'en preview/déploiement Cloudflare, via `npm run preview`).
7. Déploiement : `npm run deploy` (construit avec `@opennextjs/cloudflare` puis déploie sur Cloudflare Workers).

## Sécurité implémentée

- **Route `/admin`** : protégée par `middleware.ts`, qui vérifie un cookie de session (`HttpOnly`, `Secure`, `SameSite=Strict`) signé par HMAC-SHA256 (`lib/auth.ts`). Aucun mot de passe en clair côté client. Le token expire après 12h.
- **Alternative recommandée en production** : activer **Cloudflare Access** (Zero Trust) devant `/admin/*` — il gère l'authentification (email OTP, SSO) au niveau du réseau Cloudflare, avant même que la requête n'atteigne l'application. Étapes : Cloudflare Dashboard → Zero Trust → Access → Applications → ajouter une application "Self-hosted" sur le domaine `/admin*`, définir une politique (ex : email autorisé), puis désactiver le middleware applicatif si Access est utilisé seul.
- **Injections SQL** : toutes les requêtes D1 utilisent des paramètres liés (`?` + `.bind()`), jamais de concaténation de chaînes.
- **Upload R2** : validation stricte du type MIME (`png`/`jpeg`/`webp` uniquement) et de la taille (max 2 Mo) côté serveur avant écriture. Les images sont servies via un proxy (`/api/images/[key]`) : le bucket R2 n'est jamais exposé directement.
- **Rate limiting** : limite basique par IP sur le login (5 tentatives/min) et sur l'upload (10/min), pour limiter le brute-force et l'épuisement du quota R2.
- **En-têtes de sécurité (CSP, X-Frame-Options, etc.)** : à définir dans le Cloudflare Dashboard → Rules → Transform Rules (ou via un `_headers` file à la racine de `public/`), car Cloudflare Pages applique ces en-têtes au niveau du edge, avant Next.js.

## Notes
- Le compteur "visites" est enregistré à chaque affichage de fiche produit. Pour des statistiques de visiteurs uniques plus fines, activer **Cloudflare Web Analytics** (script gratuit, sans cookie) en plus de ce compteur.
- Le numéro WhatsApp est configuré via la variable d'environnement `WHATSAPP_PHONE_NUMBER`.
