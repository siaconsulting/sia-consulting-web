# SIA Consulting — préparation au déploiement VPS

Ce document et les modèles associés préparent le déploiement ; ils ne le réalisent pas. Aucun VPS, DNS, certificat, SMTP, secret ou base distante n’a été configuré par ce travail.

## Architecture retenue

Une seule topologie est retenue pour le premier VPS LWS KVM4 : Node.js LTS + pnpm, PostgreSQL natif limité à la machine, deux unités systemd (Next web et Payload jobs runner), Nginx partagé sur 80/443 et Certbot. Les applications Next écoutent chacune sur une adresse loopback et un port distinct ; Nginx route le domaine vers le port attribué. Les releases sont immuables, tandis que `.env` et `public/media` sont persistants hors releases.

Cette option colle aux commandes et migrations versionnées du dépôt (migration Payload explicite avec `NODE_ENV=production`, puis `pnpm build`, puis `pnpm start`) et permet d’héberger plusieurs applications derrière un Nginx partagé. Une seule méthode d’installation et d’exploitation est documentée pour éviter des workflows divergents.

Le nom de domaine canonique configuré dans le projet est `https://siaconsulting.fr`. `NEXT_PUBLIC_SERVER_URL` étant intégré au build Next, le `.env` final doit être installé avant `pnpm build`. Le fichier exemple est [`.env.production.example`](../.env.production.example).

## Versions et commandes officielles du dépôt

- Node.js 24 LTS recommandé, à maintenir sur le dernier correctif disponible. Next.js 16.3.6, Payload 3.90.2 et sharp 0.35.4 exigent Node 20.9 ou supérieur ; le projet déclare désormais ce minimum. Node 24 satisfait cette exigence, et sharp fournit un binaire natif pour les plateformes Linux glibc courantes. Le build local valide l’application, mais pas le binaire Linux du futur VPS. Voir les [exigences Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16), [Payload](https://payloadcms.com/docs/getting-started/installation), [sharp](https://sharp.pixelplumbing.com/install/) et le [calendrier Node.js](https://nodejs.org/en/about/previous-releases).
- pnpm `11.25.0` est la version unique épinglée dans `package.json`; le lockfile est au format 9. Activer Corepack, qui lit le champ `packageManager`, puis exécuter uniquement `pnpm install --frozen-lockfile`. Ne pas installer une autre version globale en parallèle.
- Ubuntu Server LTS supporté par LWS ; relever et valider précisément sa version avant exécution des modèles.
- PostgreSQL : utiliser une version encore supportée par le projet PostgreSQL et le paquet Ubuntu choisi ; le dépôt ne justifie pas d’imposer une version majeure distante sans vérifier l’image/OS LWS.
- Nginx fourni par l’OS ; exécuter `nginx -t` avant chaque reload. Les syntaxes TLS/HTTP2 peuvent varier selon sa version.

Scripts opérationnels utiles : `pnpm db:migrate:production` et `pnpm db:migrate:status:production` (fixent explicitement `NODE_ENV=production`, donc Payload `push` reste désactivé), `pnpm build`, `pnpm start`, `pnpm jobs:run`, `pnpm production:check-env`, et `pnpm production:check-forms` avant l’ouverture des formulaires. Il n’y a pas de script de seed de contenu requis au démarrage. `pnpm install --frozen-lockfile` reproduit les dépendances. `scripts/deploy-production.sh` orchestre une release après préparation manuelle du serveur.

## Préparation du VPS et isolation multi-apps

Créer un compte de déploiement sans privilèges d’application, un compte runtime `sia-app`, un compte `sia-backup`, et le groupe `sia-runtime`. Limiter le sudo du compte de déploiement aux redémarrages des deux unités SIA, pas à un shell root général. Installer Node 24, Corepack/pnpm 11.25, PostgreSQL, Nginx, Certbot, `age`, `rsync`, `tar`, `curl` et les outils de compilation nécessaires aux dépendances natives (notamment sharp si aucun binaire précompilé compatible n’est disponible).

Le compte deploy doit pouvoir lire `.env` (le validateur, la migration et le build en ont besoin) via le groupe runtime, mais ne doit pas pouvoir le modifier. Il écrit dans `releases/` et gère le pointeur `current`. Cette capacité de lecture fait du compte deploy un compte privilégié ; limiter son accès SSH et ses opérateurs. Le rôle PostgreSQL dédié possède la base et son schéma pour les migrations/runtime ; le pré-provisionnement évite de lui accorder `CREATEDB`. Il ne doit être ni superuser ni `CREATEROLE`. Ne pas utiliser le superuser PostgreSQL avec Next.

Arborescence proposée :

```text
/srv/apps/sia-consulting-web/
  repository/                 checkout Git propre, clé deploy en lecture seule
  releases/<commit-sha>/      release extraite de origin/main
  current -> releases/<sha>   pointeur atomique de la release active
  shared/.env                 secrets et configuration runtime, hors Git
  shared/media/               fichiers Payload publics, persistance requise
/srv/backups/sia-consulting-web/  archives chiffrées temporaires locales
/etc/sia-consulting-web/backup.env
```

Pour chaque autre application sur le même VPS, attribuer un utilisateur/groupe dédiés, un port loopback distinct, des unités et répertoires distincts, une base et un rôle PostgreSQL séparés, un vhost Nginx distinct, un fichier de secrets distinct et un jeu de sauvegardes séparé. Ne pas exposer les ports Next ou PostgreSQL dans le pare-feu public. Ne pas présumer de la RAM, du CPU ou du disque du plan KVM4 : vérifier le plan exact dans le compte LWS, réserver la mémoire à PostgreSQL + Next + worker + OS, surveiller la pression mémoire et disque, et ne considérer le swap que comme une marge de sécurité, jamais comme de la RAM équivalente.

Configurer PostgreSQL pour écouter uniquement en local/socket privé. Créer une base vide `sia_consulting` et un rôle applicatif dédié, droits minimum nécessaires au runtime/migrations. Conserver les identifiants uniquement dans `shared/.env`. Installer le dépôt sous `repository/` avec une clé de déploiement Git à portée lecture seule. Le script refuse un checkout sale et ne fait ni reset ni clean.

Créer `shared/media` avec écriture limitée au runtime. Le dossier est servi publiquement par l’application : ce n’est pas un stockage de pièces jointes privées. Il doit être conservé lors du déploiement, sauvegardé avec ses sous-répertoires, et restauré avec les propriétaires/droits adaptés. Ne pas placer les uploads mutables dans une release.

## Environnement et secrets

Copier l’exemple vers `/srv/apps/sia-consulting-web/shared/.env`, remplacer chaque placeholder hors Git et appliquer des droits restrictifs (`root:sia-runtime`, lecture groupe uniquement, par exemple mode 0640). Les valeurs contenant espaces, `#` ou caractères shell doivent être entourées de guillemets compatibles dotenv et systemd ; garder la notice légale sur une ligne avec retours représentés explicitement si le service le permet, ou configurer une version compacte validée. Ne jamais afficher le fichier dans les logs ni l’ajouter à Git.

Secrets à générer indépendamment à l’installation : `PAYLOAD_SECRET`, `REVALIDATION_SECRET`, `PREVIEW_SECRET`, `SUBMISSION_RATE_LIMIT_SECRET` (au moins 32 octets aléatoires chacun). `DATABASE_URL` doit utiliser le rôle dédié et localhost. `NEXT_PUBLIC_SERVER_URL` doit être exactement l’origine canonique HTTPS finale avant le build. `SUBMISSION_TRUSTED_PROXY_IP_HEADER=x-real-ip` correspond au modèle Nginx fourni : Nginx écrase ce header et l’app n’écoute que sur loopback. `CRON_SECRET` n’est utile que si des jobs sont déclenchés par endpoint externe ; le modèle recommandé utilise le worker CLI local.

Le validateur `node scripts/check-production-env.mjs` vérifie le runtime essentiel sans imprimer de valeurs ; les champs SMTP peuvent rester absents si le site est d’abord déployé sans ouverture de formulaires. `node scripts/check-production-env.mjs --forms-ready` (alias `pnpm production:check-forms`) exige trusted proxy, rate-limit secret, choix consentement, SMTP/destinataire et notice/version serveur lorsqu’un consentement est requis. Leur texte et leur obligation doivent être décidés/validés par SIA et son conseil ; ce dépôt ne fournit pas d’avis juridique.

### Formulaires et SMTP

L’application utilise l’adaptateur Nodemailer générique ; aucune marque de fournisseur n’est imposée. Renseigner `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM_ADDRESS`, `SMTP_FROM_NAME`, ainsi que `SMTP_USER` et `SMTP_PASS` ensemble ou tous deux vides si le serveur autorise un relais authentifié autrement. `SUBMISSION_NOTIFICATION_TO` reçoit les notifications internes. Confirmer les valeurs exactes, TLS, l’expéditeur vérifié et la politique de relais dans le panneau du fournisseur choisi. Ne pas inventer d’adresse. Tester le chemin avec une demande contrôlée avant ouverture publique.

L’enregistrement d’une demande en base est la source de succès utilisateur ; une panne SMTP ne supprime pas la demande, et les jobs sont retentés selon leur politique bornée. Cela ne garantit pas exactement une livraison SMTP : un crash après acceptation SMTP mais avant validation locale peut produire un doublon. Le runner `sia-worker.service` est un processus distinct et persistant.

| Option SMTP à évaluer | Conditions avant choix |
|---|---|
| SMTP de la souscription LWS existante | Vérifier que le plan fournit le relais sortant, ses limites et TLS ; ne modifier aucun MX ni la souscription mail. |
| SMTP de la boîte SIA hébergée chez LWS | Utiliser les paramètres et identifiants du panneau LWS ; confirmer que l’envoi applicatif est autorisé et que l’expéditeur est la boîte validée. |
| Autre service SMTP générique | Choix séparé du code ; si SPF/DKIM exigent des TXT, coordonner ces seules modifications avec LWS sans supprimer les MX/réception. |

Le code reste Nodemailer/provider-neutral ; aucune de ces options n’est sélectionnée ou configurée dans ce pack.

### Identité proxy / rate limiting

Le service n’accepte pas une adresse IP du navigateur. Il consomme uniquement le header configuré. Le serveur Next doit rester lié à `127.0.0.1:3210`; le pare-feu ne publie pas ce port. Le Nginx du modèle fixe `X-Real-IP` à `$remote_addr`, source de confiance pour le rate limiter PostgreSQL partagé.

Si Cloudflare ou un autre proxy CDN est activé ultérieurement, ne faites pas confiance directement à son header client : configurer la liste officielle d’IP proxy dans la directive real-IP de Nginx, refuser les accès directs au VPS, faire normaliser `$remote_addr`, puis seulement transmettre `X-Real-IP`. Retester les soumissions et le rate limiting. La souscription LWS mail existante ne doit pas être modifiée par ce déploiement web.

## DNS et TLS — à faire uniquement lors de la phase de mise en ligne

| Type DNS | Action web future | Règle mail |
|---|---|---|
| A | Apex `siaconsulting.fr` vers `<VPS_IPV4>` confirmée par LWS | Sans effet sur MX si seul cet enregistrement web est modifié. |
| CNAME ou A | `www` vers l’apex ou le même VPS, selon les enregistrements existants | Ne jamais remplacer les entrées mail. |
| AAAA | Seulement après validation IPv6 complète | Ne pas publier par anticipation. |
| MX | Aucune modification | Conserver strictement les MX LWS existants. |
| TXT | Aucune modification nécessaire pour le seul site web | Préserver SPF, DKIM, DMARC et autres TXT LWS. Ajouter un TXT SMTP seulement après validation écrite du fournisseur mail choisi. |

Cela garde séparés le routage web et la réception/envoi des boîtes existantes. La TTL web peut être ramenée vers 300 s 24–48 h avant bascule si LWS le permet, puis remontée après stabilité.

1. Relever l’IPv4 publique réelle du VPS. Ajouter/modifier seulement l’enregistrement A de `siaconsulting.fr` et le `www` (CNAME vers l’apex ou A selon la configuration DNS existante). Réduire préalablement le TTL à environ 300 s si possible, attendre la propagation et confirmer les réponses depuis plusieurs résolveurs.
2. Ne toucher à aucun MX, SPF, DKIM, DMARC ou TXT lié au mail LWS. Ne publier un AAAA que si IPv6 est configuré de bout en bout (VPS, Nginx, firewall, accès).
3. Ouvrir uniquement SSH restreint, TCP 80 et 443. Garder 5432 et 3210 fermés au public.
4. Créer le webroot (`sudo install -d -o root -g root -m 0755 /var/www/letsencrypt`), installer le vhost [`siaconsulting-http-bootstrap.conf`](../deploy/nginx/siaconsulting-http-bootstrap.conf) et [`sia-log-format.conf`](../deploy/nginx/sia-log-format.conf), vérifier `nginx -t`, puis recharger Nginx. Ce bootstrap dessert provisoirement HTTP tout en fournissant le chemin ACME.
5. Émettre le certificat seulement après propagation DNS avec le webroot :

```sh
sudo certbot certonly --webroot --webroot-path /var/www/letsencrypt \
  -d siaconsulting.fr -d www.siaconsulting.fr \
  --email <EMAIL_ADMIN_CHOISI_PAR_SIA> --agree-tos --no-eff-email
```

L’adresse doit être fournie par le propriétaire, jamais inventée. Suivre le guide [Certbot Nginx officiel](https://certbot.eff.org/instructions?os=ubuntufocal&ws=nginx), adapté à l’Ubuntu réellement installé. Remplacer le bootstrap par [`siaconsulting-https.conf`](../deploy/nginx/siaconsulting-https.conf), vérifier `nginx -t`, recharger, puis exécuter `sudo certbot renew --dry-run` et vérifier le timer systemd Certbot.

Le vhost force `www` vers l’apex et configure les en-têtes de sécurité usuels sans CSP ni HSTS initial. Tester Payload Admin, preview, images et formulaires sous HTTPS. Après validation effective du certificat et du renouvellement HTTPS, décider séparément si HSTS doit être activé ; ne pas l’activer pendant le bootstrap. Si IPv6 n’est pas disponible sur l’OS, retirer les directives `listen [::]` avant le test. Vérifier la compatibilité syntaxique HTTP/2 et TLS avec le Nginx installé via `nginx -t`.

Le format d’access log journalise le chemin `$uri`, jamais `$request`, `$request_uri`, `$args` ni Referer, car l’URL de preview contient un token de query. Les error logs peuvent contenir des éléments de requête dans certains diagnostics : accès root/admin uniquement, permissions restrictives et rotation/rétention courte. Vérifier réellement les deux types de logs pendant les tests preview. La politique Referrer est `no-referrer`. Une politique CSP doit d’abord être testée en `Report-Only`, notamment avec l’admin Payload, preview, images et éventuels outils d’analytics ; elle n’est pas improvisée dans ce pack.

## Installation initiale et déploiements

1. Préparer les comptes, PostgreSQL, rôle/base vides, dossiers, permissions, clé Git, `.env` final et unités Nginx/systemd. Installer les unités depuis `deploy/systemd/`, adapter le chemin pnpm si `/usr/bin/env pnpm` n’est pas disponible dans le PATH systemd, puis `daemon-reload`. L’utilisateur deploy doit pouvoir redémarrer et vérifier seulement les unités SIA nécessaires. N’activer les unités qu’après le premier build.
2. Lancer le premier déploiement depuis le compte deploy : `bash /srv/apps/sia-consulting-web/repository/scripts/deploy-production.sh`. Le script fixe `NODE_ENV=production`, fetch `origin/main`, archive un commit immuable, installe les dépendances gelées, valide `.env`, puis charge explicitement ce fichier partagé pour `pnpm db:migrate:production` et `pnpm build`. Le CLI Payload et Next ont aussi leur chargeur natif `.env`; aucune variable n’est supposée venir de systemd pendant ces deux étapes. `NEXT_PUBLIC_SERVER_URL` est donc présente au build. Payload `push` reste désactivé. Ensuite le script bascule `current`, redémarre web/worker et vérifie leur état ainsi que `http://127.0.0.1:3210/`.
3. Le build ne lance pas de migration. Aucune migration n’a été exécutée dans cette phase. Pour chaque release, migration avant build ; examiner le statut et les migrations versionnées dans le pipeline. La première création d’ADMIN passe par l’initialisation Payload sur une base vide ; créer le premier compte une seule fois avec l’adresse fournie par le propriétaire, vérifier ADMIN et activer MFA au niveau de l’exploitation si disponible. Le mécanisme d’installation attribue ADMIN au premier compte ; protéger l’accès initial pendant cette étape.
4. Installer/activer les services systemd et Nginx, vérifier les journaux et exécuter le smoke-test plus bas. Les ports dans les modèles (3210) sont réservés à cette application ; choisir un port différent pour toute autre app.

Le script garde le code précédent et remet son pointeur si build/démarrage/smoke échoue ; lors du tout premier déploiement, il n’existe pas encore de release précédente à réactiver. Le service redémarre brièvement à chaque release, ce n’est pas un rolling deploy sans interruption. Les releases ne sont pas supprimées automatiquement : surveiller le disque et retirer manuellement une ancienne release seulement après vérification de `current`, du fallback conservé et des fichiers ciblés. **La base n’est jamais rollback automatiquement.** N’effectuer un rollback applicatif que si le schéma après migration reste compatible avec l’ancien code. Pour une restauration DB, restaurer une sauvegarde vers une base distincte, tester, puis planifier explicitement le basculement ; ne pas écraser la DB live par défaut.

Historique de migrations inspecté : `20261003_024456_initial_schema` porte la baseline Payload/SIA et `20261003_030000_submission_rate_limits` le schéma technique du rate limiter. Ce pack ne les modifie pas et n’exécute aucune d’elles.

Workflow futur de schéma : modifier la config Payload, développer avec le `push` local existant sur sandbox, générer les types, tests, `pnpm db:migrate:create <nom>`, inspecter SQL/`down`, appliquer sur une base jetable vide, puis committer le schéma et la migration ensemble. En production : `pnpm db:migrate:production` explicite avant le build/la nouvelle release. Ne jamais exécuter migration et `push` contre la même base live ; ne pas activer `prodMigrations` au démarrage. Le projet a choisi une migration explicite pour rendre le changement de schéma visible, ordonné et auditable.

### Commandes du premier déploiement (à exécuter plus tard, pas dans cette phase)

Après création manuelle des comptes, base, permissions, secrets, configuration Nginx HTTP, clone Git et unités adaptées :

```sh
sudo install -d -o sia-deploy -g sia-runtime -m 0750 /srv/apps/sia-consulting-web
sudo install -d -o sia-deploy -g sia-runtime -m 0750 /srv/apps/sia-consulting-web/repository
sudo install -d -o sia-deploy -g sia-runtime -m 0750 /srv/apps/sia-consulting-web/releases
sudo install -d -o sia-app -g sia-runtime -m 2770 /srv/apps/sia-consulting-web/shared/media
sudo install -d -o root -g sia-runtime -m 0750 /srv/apps/sia-consulting-web/shared
sudo install -o root -g sia-runtime -m 0640 <CHEMIN_ENV_SECURISE> /srv/apps/sia-consulting-web/shared/.env
git clone --branch main --single-branch <GIT_REMOTE_URL> /srv/apps/sia-consulting-web/repository
sudo install -m 0644 deploy/systemd/sia-web.service /etc/systemd/system/sia-web.service
sudo install -m 0644 deploy/systemd/sia-worker.service /etc/systemd/system/sia-worker.service
sudo systemctl daemon-reload
cd /srv/apps/sia-consulting-web/repository
bash scripts/deploy-production.sh
sudo systemctl enable sia-web.service sia-worker.service
sudo nginx -t && sudo systemctl reload nginx
```

Adapter propriétaires/groupes pour les comptes réellement créés et relire les cibles avant exécution. `<CHEMIN_ENV_SECURISE>` et `<GIT_REMOTE_URL>` sont des entrées futures, pas des chemins disponibles. Installer le vhost final/TLS seulement après émission du certificat. `pnpm db:migrate:production` est lancé par le script avant `pnpm build`; le build ne migre pas. Créer ensuite le premier ADMIN en session d’installation contrôlée dans Payload et vérifier son rôle.

## Worker, sauvegardes et restauration

Le web et le runner Payload tournent dans des unités séparées. `sia-worker.service` utilise le CLI `pnpm jobs:run`; il n’expose aucun endpoint de cron supplémentaire. Vérifier `systemctl status`, `journalctl -u sia-worker.service`, les jobs failed/retries dans Payload Admin et la fraîcheur des jobs après déploiement.

Les unités de sauvegarde sont des modèles seulement. Avant activation, créer `sia-backup` (membre lecture du groupe `sia-runtime`), `/etc/sia-consulting-web/backup.env` (mode 0600), le répertoire backup et les utilitaires PostgreSQL client compatibles avec la version serveur, un identifiant age dédié et sa clé publique, une destination hors VPS chiffrée/contrôlée, clé SSH sortante restrictive, et tester l’accès. Le secret age privé ne va jamais sur le VPS : le garder hors ligne dans un emplacement distinct de la sauvegarde.

Le compte `sia-backup` doit posséder/écrire `/srv/backups/sia-consulting-web`. L’unité fournit `HOME=/var/lib/sia-backup` via `StateDirectory`; placer la configuration/clé SSH sortante restreinte sous ce répertoire (permissions 0700/0600) et `known_hosts` validé, car `ProtectHome=true` masque les home directories classiques. La copie hors site n’est pas automatiquement purgée par le script ; choisir une rétention hors site (recommandation initiale : au moins 30 jours), un quota et une procédure de pruning sur un dossier SIA exclusivement dédié avant activation. La rétention locale gérée par le script est de 14 jours.

`scripts/backup-production.sh` produit chaque jour un dump PostgreSQL custom `pg_dump -Fc` puis chiffre le flux avec age, archive/chiffre `shared/media`, copie les deux archives vers la cible distante rsync, et ne garde que 14 jours localement. Le format custom PostgreSQL permet la restauration sélective avec `pg_restore` ; voir la documentation officielle [pg_dump](https://www.postgresql.org/docs/19/app-pgdump.html) et [pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html). age chiffre vers une clé publique dédiée et se déchiffre uniquement avec l’identité correspondante ([documentation officielle age](https://github.com/FiloSottile/age)). Le timer fourni est quotidien à 02:20 UTC avec délai aléatoire ; ne l’activer qu’après un test manuel et la validation offsite.

Restaurer d’abord dans une base vide distincte : arrêter web/worker uniquement si l’on prépare ensuite un basculement planifié ; déchiffrer le dump vers `pg_restore` sans `--clean`/`--drop`, restaurer le contenu média dans un répertoire isolé, vérifier cohérence et propriétaires/groupe `sia-runtime`, puis démarrer une instance de validation contre cette base et ce dossier isolés. Ne jamais tester sur la seule base live. Un basculement de restauration nécessite une fenêtre de maintenance explicite, l’arrêt des deux services, la mise en place DB/media cohérente, puis redémarrage et smoke. Tester périodiquement ; une sauvegarde non restaurée n’est pas une preuve de reprise. Les logs de sauvegarde ne doivent contenir ni URI DB ni données de demande.

Exemple de procédure manuelle, uniquement sur une cible de restauration explicitement vide et distincte :

```sh
age --decrypt --identity <AGE_PRIVATE_IDENTITY_OFFLINE> <BACKUP_FILE>.postgres.dump.age \
  | pg_restore --no-owner --no-acl --dbname="<RESTORE_DATABASE_URL>"
age --decrypt --identity <AGE_PRIVATE_IDENTITY_OFFLINE> <BACKUP_FILE>.media.tar.gz.age \
  | tar -xz -C <ISOLATED_MEDIA_RESTORE_DIRECTORY>
```

Ne pas mettre une identité privée réelle dans le shell history ou le VPS. En pratique, déchiffrer depuis une machine d’administration contrôlée et transmettre les données vers la cible de restauration. Les options `--clean` et `--drop` sont volontairement absentes.

## Smoke-test de mise en ligne

Après le build et avant ouverture publique, le script `BASE_URL=https://siaconsulting.fr bash scripts/smoke-production.sh` vérifie en GET les routes principales, admin, sitemap, robots et un vrai 404. Il ne soumet aucun formulaire. Vérifier également TLS/certificat et redirection www → apex ; `/_next/static`, Media public, canonical/OG HTTPS sans `localhost`, sitemap sans drafts/recherche/formulaires, robots et noindex transactionnel, admin/login, preview autorisée + sortie preview, liens principaux, absence d’erreurs console serveur/navigateur.

Avant d’ouvrir les formulaires : finaliser notice/version avec validation légale, configurer consentement, trusted proxy, rate-limit secret, SMTP et destinataire ; tester les trois formulaires avec données de test identifiables, persistance privée, notification, honeypot, doublon/idempotence et limite ; contrôler que ni les access logs ni les erreurs ne contiennent preview token ou PII. Vérifier que le runner traite jobs et retries. Aucun de ces tests de production n’a été exécuté dans cette phase.

## Contenu éditorial avant ouverture

Le CMS ne doit pas être rempli par ce pack. Checklist des contenus à fournir et publier dans Payload :

- **Globals** : `site-settings` (nom légal/public, logo master non rogné, favicon validé, image OG par défaut, SEO global, réseaux officiels), `header` (navigation et CTA), `footer` (navigation/légal), `contact-information` (uniquement coordonnées publiques exactes), `home-settings` (hero validé, intro, sélections publiées, CTA final), `about-settings` (récit institutionnel réel ; mission/vision/valeurs seulement si approuvées).
- **Métier** : expertises avec résumé/corps/SEO ; secteurs ; formations avec durée/format/programme/prérequis vérifiés, sans dates de sessions inventées ; études de cas avec niveau nommé/anonyme correct, résultats et métriques prouvés ; références avec type exact (pas toutes qualifiées de clients), logos autorisés.
- **Éditorial et équipe** : publications avec titre, type, date éditoriale, contenu et auteurs autorisés ; ressources avec description, fichier public relu et métadonnées ; membres avec nom/fonction/bio publics et portraits autorisés ; aucun contact privé.
- **Médias** : vérifier droits, dimensions, crop, poids, attributs alt pour médias informatifs et alt vide pour décoratifs. Les fichiers ressources sont publics au niveau URL, même quand une landing page existe.
- **Contrôle de publication** : rechercher brouillons/scheduled, liens entre contenus dépubliés, pages sans sections essentielles, OG, canonical et rendu des longues valeurs. Vérifier que chaque page facultative a contenu réel avant publication.

### Readiness CMS par Global/collection

« Obligatoire » ci-dessous signifie nécessaire à une page publiable/utile, pas que chaque champ Payload est techniquement marqué required. Les champs exacts restent ceux des configurations Payload. Quand un élément facultatif manque, le frontend masque la section plutôt que d’afficher un faux contenu.

| Type | Obligatoire avant lancement | Recommandé | Facultatif et effet s’il manque |
|---|---|---|---|
| `site-settings` | Nom affiché cohérent ; logo maître approuvé ou fallback textuel accepté | Raison sociale, SEO titre/description par défaut, favicon et image OG réelles | Réseaux, logo alternatif clair, copyright spécifique : éléments correspondants absents/neutralisés |
| `contact-information` | Au moins un canal réellement joignable pour le contact SIA avant ouverture publique | E-mail général, téléphone et adresse uniquement si publics | 2e téléphone, complément, BP, région, horaires, carte : seuls ces détails disparaissent |
| `header` | Liens de navigation et destination CTA vérifiés | Libellés et ordre définitifs | CTA secondaire éventuel : retiré |
| `footer` | Liens légaux applicables vérifiés avant lancement | Colonnes de navigation, contact/réseaux | Coordonnées/réseaux masqués si désactivés ou absents |
| `home-settings` | Hero crédible (titre/description réelle) et CTA principal cohérent | Introduction, sélections publiées ordonnées : services, secteurs, trainings, refs, publications, case studies, resources ; CTA final | Chiffres clés uniquement s’ils sont prouvés ; sections sans sélection disparaissent. Globals peu remplis = Hero puis Footer, visuellement court mais pas erreur technique |
| `about-settings` | Récit institutionnel principal réel avant de promouvoir `/a-propos` | Introduction/hero, contenu body, SEO spécifique si validé | Mission, vision, valeurs, image, CTA : sections absentes |
| `services` | Titre, résumé et body réels ; slug stable ; contenu effectivement publié | Introduction, bénéfices/livrables utiles, secteurs liés publiés, SEO et média | Image/relations/benefits/deliverables : composants correspondants masqués |
| `sectors` | Titre, résumé, body réels et publiés | Intro, image, expertises/formations liées cohérentes | Relations/média : zones associées omises |
| `trainings` | Titre, résumé, code/catalogue si prévu, contenu de formation, durée/format réels | Objectifs, audience, prérequis/programme, services/secteurs pertinents, SEO | Lieu/image/relations/prérequis selon modèle : non affichés ; aucune date/session inventée |
| `publications` | Titre, résumé, type, corps et date éditoriale lorsque définie par politique de publication | Cover réelle, auteur(s) publiés, topics et relations, SEO | Auteur/image/date/topics : métadonnées correspondantes omises |
| `case-studies` | Titre/résumé, contexte, enjeu, approche, résultat ; disclosure choisi avec référence publiée autorisée ou libellé anonyme neutre | Services/secteurs, cover, métriques prouvées | Métriques et image facultatives ; si anonyme, aucune donnée de Reference révélée nulle part |
| `team-members` | Nom et contenu profil professionnel/public réels | Fonction, bio, portrait autorisé, services, publications liées | Portrait/relations/liens publics facultatifs, masqués s’ils manquent |
| `references` | Nom et type exact (client/partenaire/institution selon choix CMS) | Logo approuvé, secteur, description, ordre/featured, website public | Logo/description/site : rendu textuel respectueux, aucune page détail V1 |
| `resources` | Titre, type, description et fichier public relu/disponible | Cover, SEO, relations services/secteurs | Image/relations/date/poids peuvent manquer ; fichier reste public, jamais « protégé » |

Les champs Payload explicitement requis et les publications bloquées par validation (ex. fichier de Resource, champs d’une Study) doivent passer leurs validations de collection avant le go-live. L’état de cette base locale n’a pas été utilisé pour publier ou corriger du contenu pendant cette phase.

Homepage V3 : renseigner `home-settings.hero.title`, `description` et CTA réel ; `introduction`; selections ordonnées ; `keyFigures` seulement vérifiables ; `finalCTA`. Les sections sans contenu sont conditionnelles. `/a-propos` provient uniquement de `about-settings.hero`, `body`, puis mission/vision/values/cta facultatifs.

## Configuration à obtenir du propriétaire

### Obligatoire avant déploiement public

- accès compte LWS et version exacte du VPS/Ubuntu, IPv4 (et décision IPv6) ; validation ressources/stockage ; utilisateur SSH sécurisé ; choix du port 3210 ou port libre attribué ; accès Git deploy read-only ; domaine canonique et confirmation DNS;
- base/role PostgreSQL créés et `DATABASE_URL`, `PAYLOAD_SECRET`, `REVALIDATION_SECRET`, `PREVIEW_SECRET`, `SUBMISSION_RATE_LIMIT_SECRET` uniques ; URL finale exacte `NEXT_PUBLIC_SERVER_URL` ; proxy/headers confirmés ; stockage persistant `/shared/media` et backups ;
- choix legal owner/admin e-mail pour Certbot (ne pas inscrire avant instruction); comptes/permissions de service ; configuration SMTP confirmée si les demandes sont ouvertes à la mise en ligne.

### Obligatoire avant ouverture des formulaires

- consentement requis ou non décidé par le propriétaire/conseil ; texte/version légaux approuvés si requis ; serveur proxy `X-Real-IP` vérifié ; paramètres SMTP serveur et expéditeur vérifié ; destinataire de notification interne ; test des jobs et procédures de suivi des échecs ; honeypot/rate limit testé en production contrôlée.

### Obligatoire avant qu’une stratégie de reprise soit considérée opérationnelle

- destinataire public age, identité privée conservée hors ligne, serveur/stockage hors site, clé SSH et cible rsync ; test de restauration à blanc et procédure d’escalade.

Les gabarits Nginx doivent aussi être adaptés à la version réellement installée et passer `nginx -t`; les unités doivent passer `systemd-analyze verify`. Ce sont des étapes du futur VPS, non des services vérifiés dans le poste actuel.

### Contenu éditorial avant lancement public

Logo master, favicon, image OG, globals et contenus listés ci-dessus approuvés/publiés. Aucun contenu fictif n’est fourni ici.

## Artefacts fournis et limites

- `deploy/nginx/` : journalisation sans query, bootstrap ACME, vhost TLS final (à adapter à OS/DNS/certificat).
- `deploy/systemd/` : web, worker, service/timer de backup (modèles à installer après adaptation des chemins/permissions).
- `scripts/deploy-production.sh`, `scripts/check-production-env.mjs`, `scripts/run-with-env.mjs`, `scripts/backup-production.sh`.
- `.env.production.example`, `deploy/backup.env.example`.

Le test de ce pack ne crée aucune DB, migration, clé, certificat ni ressource distante. Les commandes Nginx/systemd/Certbot ne peuvent être validées qu’une fois la version OS choisie ; les exemples sont des modèles et doivent passer `nginx -t`, `systemd-analyze verify` et une répétition staging avant activation réelle.

### Compression, cookies, CORS et diagnostics

Next.js reste sur sa compression HTTP par défaut ; ne pas ajouter une seconde compression globale Nginx sans vérifier `Content-Encoding`. Brotli n’est pas supposé installé. `client_max_body_size 50m` autorise les uploads d’admin raisonnables ; aligner la limite avec la politique Media. Timeouts proxy : 5 s connect / 60 s lecture-écriture, sans masquer la lenteur. CORS Payload est construit depuis `getServerSideURL()` et doit rester sur la seule origine HTTPS canonique, jamais `*`.

Aucun override cookie spécifique n’a été trouvé dans la config Payload. Vérifier les cookies de session sous HTTPS derrière Nginx (`Secure`, `SameSite`, Path/domain) avec la version installée ; ne modifier que si un défaut est observé. `X-Frame-Options: SAMEORIGIN` conserve l’admin sur son origine. Pas de CSP active : la tester d’abord en `Report-Only` avec admin, preview, images et outils réellement chargés.

Diagnostics à exécuter ultérieurement sur le VPS :

```sh
systemctl status sia-web.service sia-worker.service postgresql nginx
journalctl -u sia-web.service -u sia-worker.service --since '30 minutes ago'
df -h
du -sh /srv/apps/sia-consulting-web/releases/* /srv/apps/sia-consulting-web/shared/media /srv/backups/sia-consulting-web
free -h
ss -lntp
sudo -u postgres pg_isready
```

Ne pas copier dans un ticket public des logs contenant des PII ou des query strings.

## CI/CD et exploitation simple

Pour V1, préférer le déploiement manuel assisté par `scripts/deploy-production.sh` depuis un opérateur autorisé : moins de credentials persistants et plus facile à diagnostiquer. GitHub Actions pourra automatiser ensuite, mais exigerait une clé/credential VPS et des protections d’environnement/review ; il n’est pas nécessaire pour lancer le site.

Web et worker écrivent dans journald via systemd. Nginx utilise les logs dédiés fournis ; PostgreSQL garde sa politique du paquet OS. Activer/vérifier la rotation OS de `/var/log/nginx/sia-*.log`, limites journald (`SystemMaxUse`/rétention) et logs PostgreSQL ; aucun log formulaire ne doit contenir de PII. Monitoring sans SaaS requis : état/restart units, `pg_isready`, disque/RAM/CPU, taux de jobs failed, date du dernier backup et présence des deux archives chiffrées hors site. Le plan KVM4 exact n’a pas été supposé ; évaluer les mesures de `free -h`, `df -h` et charge sous trafic avant de poser des limites. Un petit swap peut être une marge contre un pic mémoire, mais ne remplace pas la RAM et n’est pas activé ici.
