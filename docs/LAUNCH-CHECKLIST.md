# Checklist de lancement — SIA Consulting

Cette checklist est un plan, pas la preuve qu’un élément est déjà configuré. Cocher seulement après vérification humaine et conserver une trace de validation.

## Code

- [ ] Branche/release validée et arbre Git propre.
- [ ] `pnpm install --frozen-lockfile` passe avec pnpm 11.25.0.
- [ ] typecheck, lint, intégration, E2E complet et build production verts.
- [ ] `pnpm db:migrate:status` confirme l’état attendu sur l’environnement cible après migration explicite.
- [ ] Aucun secret ou `.env` inclus dans Git, logs ou bundle client.
- [ ] Déploiement/retour code répété en staging ; compatibilité rollback DB examinée séparément.

## VPS / accès

- [ ] Version OS et ressources exactes du VPS LWS vérifiées ; espace disque/RAM disponibles.
- [ ] Comptes séparés deploy, runtime, backup et groupe de permissions créés ; aucun service en root.
- [ ] SSH par clé ; login root/password examiné et durci ; accès de secours conservé.
- [ ] Pare-feu : SSH selon besoin, 80/443 ; 5432 et port 3210 non accessibles publiquement.
- [ ] Nginx partagé, port loopback réservé SIA, unités systemd installées et vérifiées.
- [ ] Rotation des journaux et accès restreint contrôlés.

## Database

- [ ] DB `sia_consulting` fraîche, rôle dédié, mot de passe unique, écoute locale.
- [ ] Aucune fixture locale copiée ; migrations versionnées depuis une base vide validées.
- [ ] Premier ADMIN créé par le flux Payload, adresse choisie par SIA, privilèges ADMIN vérifiés.
- [ ] Connexion PostgreSQL non exposée au WAN.

## Content / médias

- [ ] `site-settings` renseigné : nom officiel, logo maître autorisé, favicon réel, OG par défaut et SEO.
- [ ] `header`, `footer`, `contact-information` renseignés avec navigation, légal et coordonnées vérifiées.
- [ ] `home-settings` rempli avec Hero/intro/CTA et sélections réelles publiées ; aucune donnée fictive.
- [ ] `about-settings` rempli avec récit réel et uniquement mission/vision/valeurs approuvées.
- [ ] Services, secteurs, formations, publications, études de cas, équipe, références et ressources relus/publiés.
- [ ] Études anonymisées revérifiées ; ressources et fichiers Media compris comme publics.
- [ ] Droits d’utilisation, alt, dimensions, poids, crops et liens externes contrôlés.
- [ ] `/srv/apps/sia-consulting-web/shared/media` persiste après release et est sauvegardé.

## Email / forms

- [ ] Boîtes LWS existantes testées ; aucun changement mail demandé ou appliqué par la migration web.
- [ ] Paramètres SMTP choisis depuis le panneau de l’émetteur, expéditeur validé et destinataire interne confirmé.
- [ ] `SUBMISSION_TRUSTED_PROXY_IP_HEADER=x-real-ip`, proxy et port privé testés.
- [ ] Secret de rate limit dédié aléatoire configuré.
- [ ] Décision de consentement et texte/version approuvés par le responsable juridique ; configurés si requis.
- [ ] Tester en envoi contrôlé contact, demande service et formation : persistance, job, réception, idempotence, honeypot et rate limit.
- [ ] Aucun upload privé n’est présenté aux formulaires ; pas de pièces jointes V1.

## DNS / TLS

- [ ] IPv4 du VPS confirmée ; décision AAAA fondée sur IPv6 réellement opérationnel.
- [ ] TTL web abaissé avant bascule si possible.
- [ ] A de l’apex et www configuré selon plan approuvé.
- [ ] MX, SPF, DKIM, DMARC, TXT mail et abonnement LWS restent intacts.
- [ ] DNS propagé avant émission du certificat apex + www.
- [ ] Certificat et redirection `www` → apex vérifiés ; `certbot renew --dry-run` réussi ; timer actif.
- [ ] `NEXT_PUBLIC_SERVER_URL=https://siaconsulting.fr` installé avant le build de release.
- [ ] `BASE_URL=https://siaconsulting.fr bash scripts/smoke-production.sh` passe ; aucune demande de formulaire n’est soumise par ce smoke test.

## SEO / public

- [ ] Canonicals/OG utilisent HTTPS canonique et aucune URL localhost.
- [ ] Sitemap contient seulement routes publiques indexables, contenus publiés.
- [ ] Recherche et routes transactionnelles noindex et hors sitemap.
- [ ] Robots, 404, admin, preview autorisée/sortie preview, redirects et liens publics testés.
- [ ] Structured data, si présente, contient uniquement des faits réels et ne révèle aucun case study anonymous.
- [ ] Favicon/logo par défaut vérifiés ; aucun asset Payload/demo ou PNG prototype rogné.

## Jobs / backups / monitoring

- [ ] Un seul `sia-worker.service` actif ; jobs notification et scheduled publishing testés ; failed jobs surveillés.
- [ ] `pg_dump -Fc` + médias chiffrés age copiés hors VPS ; timer et rétention vérifiés.
- [ ] Identité privée age conservée hors ligne, séparée de la destination de sauvegarde.
- [ ] Restauration testée vers une DB et un dossier isolés ; résultats documentés.
- [ ] Vérifier périodiquement RAM, CPU, `df -h`, taille DB/media/logs/releases/backups et espace distant.
- [ ] Alerte opérationnelle minimale définie (état systemd, disque, DB, worker, sauvegarde).

## Smoke tests avant ouverture

- [ ] `/`, `/expertises`, `/publications`, `/contact`, `/recherche`, `/admin` répondent comme attendu.
- [ ] `/sitemap.xml`, `/robots.txt`, 404, assets et Media fonctionnent sous HTTPS.
- [ ] Formulaires testés seulement après configuration et autorisation ; IDs/résultats nettoyés selon procédure.
- [ ] Console navigateur, journaux web/worker/Nginx/DB sans erreurs répétées, PII ou token preview.
- [ ] Vérifier desktop/mobile, clavier, reduced-motion, focus et zoom/reflow avant communication publique.

## Go-live

- [ ] Propriétaire métier, technique et juridique donnent leur accord explicite.
- [ ] Sauvegarde initiale et rollback code disponible ; décision DB comprise séparément.
- [ ] Basculer uniquement enregistrements DNS web convenus ; ne pas toucher aux enregistrements mail.
- [ ] Refaire les smoke tests depuis un réseau externe et surveiller logs/jobs/backup après ouverture.
