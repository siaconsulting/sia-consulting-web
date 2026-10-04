# Inventaire des variables de production

Source d’autorité pour la configuration runtime : `.env.production.example`. Les exemples y sont des placeholders uniquement. Les valeurs secrets vivent hors dépôt. `NEXT_PUBLIC_SERVER_URL` est rendu public/intégré au build ; toutes les autres variables de cette liste sont server-side. Les variables `VERCEL_PROJECT_PRODUCTION_URL` et `__NEXT_PRIVATE_ORIGIN` sont des fallbacks détectés dans le code, mais ne sont pas à définir pour le déploiement VPS canonique.

| Variable | Type | Obligatoire | Source / usage |
|---|---|---:|---|
| `NEXT_PUBLIC_SERVER_URL` | Public/build-time | Oui | `https://siaconsulting.fr`, utilisé par URL absolues, canonical/SEO/sitemap, CORS Payload, preview et revalidation. Fixer avant `pnpm build`. |
| `DATABASE_URL` | Secret / infrastructure | Oui | Connexion PostgreSQL Payload et rate limiter ; localhost/private socket recommandé. URL-encoder le mot de passe. |
| `PAYLOAD_SECRET` | Secret serveur | Oui | Auth/tokens Payload et fallback crypto ; secret long aléatoire unique. |
| `REVALIDATION_SECRET` | Secret serveur | Oui | Authentifie le relais signé de revalidation worker → site web. Identique uniquement aux deux services SIA. |
| `PREVIEW_SECRET` | Secret serveur | Oui | Validation de la route d’activation preview, en plus de l’auth Payload ADMIN/EDITOR. Ne pas journaliser l’URL query. |
| `SUBMISSION_RATE_LIMIT_SECRET` | Secret serveur/forms | Oui avant formulaires ouverts | HMAC des identités client pour le rate limiter ; code peut retomber sur `PAYLOAD_SECRET`, mais le secret dédié est exigé par le check de déploiement. |
| `SUBMISSION_TRUSTED_PROXY_IP_HEADER` | Infrastructure/forms | Oui | Doit être `x-real-ip` pour le modèle Nginx livré. Nginx doit l’écraser, app inaccessible directement. |
| `SUBMISSION_PRIVACY_CONSENT_REQUIRED` | Décision métier/config | Oui, choix explicite | `true` ou `false` selon instruction approuvée, pas une décision technique. |
| `SUBMISSION_PRIVACY_NOTICE_VERSION` | Formulaire/config | Si consentement requis | Identifiant/version approuvée et maintenue côté serveur. |
| `SUBMISSION_PRIVACY_NOTICE_TEXT` | Formulaire/config | Si consentement requis | Texte exact approuvé côté serveur ; aucun wording légal n’est créé par le dépôt. |
| `SMTP_HOST` | SMTP serveur | Oui avant réception réelle des formulaires | Hôte donné par la boîte/fournisseur choisi. |
| `SMTP_PORT` | SMTP serveur | Oui avant réception réelle des formulaires | Port numérique confirmé dans le panneau SMTP. |
| `SMTP_SECURE` | SMTP serveur | Oui dans le validateur pack | `true`/`false` confirmé selon transport/port et fournisseur. Payload sait inférer le cas courant du port 465 si absent ; le pack exige une décision explicite. |
| `SMTP_USER` | Secret SMTP | Si authentification requise | Nom d’utilisateur fourni par le fournisseur. Username et password ensemble ou tous deux absents. |
| `SMTP_PASS` | Secret SMTP | Si authentification requise | Mot de passe d’application/boîte, server-only. |
| `SMTP_FROM_ADDRESS` | SMTP/config | Oui avant envoi | Expéditeur validé par le fournisseur, adresse réelle approuvée. |
| `SMTP_FROM_NAME` | SMTP/config | Oui avant envoi | Nom expéditeur approuvé par SIA. |
| `SUBMISSION_NOTIFICATION_TO` | Destination interne | Oui avant réception réelle des formulaires | Adresse d’équipe choisie et validée ; jamais codée dans Git. |
| `CRON_SECRET` | Secret optionnel | Non avec le worker CLI local | Authentification endpoint Payload de déclenchement distant. Ne pas exposer ce endpoint via un cron public pour le modèle retenu. |
| `VERCEL_PROJECT_PRODUCTION_URL` | Fallback plateforme | Non | Référence de compatibilité dans `getURL`/`next.config`; laisser vide sur le VPS. |
| `__NEXT_PRIVATE_ORIGIN` | Interne Next | Non | Fallback interne dev dans `next.config`; ne pas définir en production. |
| `SIA_ENV_FILE` | Outil local facultatif | Non | Surcharge du chemin `.env` pour `scripts/run-with-env.mjs` et le validateur ; ne pas déclarer côté app en production. |
| `NODE_ENV` | Runtime | Oui, `production` | Fixé explicitement dans les unités et `db:migrate:production`; conditionne notamment le `push` Payload (désactivé en production). |
| `HOSTNAME` | Runtime web | `127.0.0.1` | Binding loopback Next ; déjà imposé par unité/arguments de démarrage. |
| `PORT` | Runtime web | `3210` (ou port libre choisi) | Port privé Next, même valeur que le proxy Nginx ; réservé à cette app, jamais ouvert au WAN. |
| `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGSSLMODE` | Infrastructure CLI | Générées si `DATABASE_URL` existe | `scripts/run-with-env.mjs` les dérive en mémoire pour `pg_dump`, afin d’éviter un mot de passe dans les arguments de processus ; ne pas enregistrer à part. |
| `BACKUP_AGE_RECIPIENT` | Infrastructure backup | Oui avant activation backup | Recipient public age, exemple séparé `deploy/backup.env.example`; la clé privée correspondante reste hors VPS et hors Git. |
| `BACKUP_OFFSITE_TARGET` | Infrastructure backup | Oui avant activation backup | Cible rsync SSH vers stockage distinct du VPS, fournie et sécurisée par l’exploitant. |

Secrets à générer manuellement au moment de l’installation, sans les inclure dans une conversation ou un commit :

```sh
openssl rand -base64 48
```

Générer une valeur indépendante par secret (Payload, revalidation, preview, rate limit). Pour `DATABASE_URL`, encoder les caractères spéciaux du mot de passe URL. Ne pas utiliser la sortie de cette commande dans une image, un log, une variable `NEXT_PUBLIC_*` ou ce pack ; la commande est documentée seulement, elle n’a pas été lancée.

Les variables d’environnement Nginx/systemd et leurs valeurs de production sont à renseigner au serveur. Les backups ont leur fichier d’environnement distinct et permissions séparées. Aucune adresse IP, adresse e-mail, clé ou credential réel n’est présent dans les modèles.
