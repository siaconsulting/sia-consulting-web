# SIA Consulting — système de mouvement V3

Le mouvement est une partie du système visuel, pas une couche d’animation uniforme. Chaque scène a une intention, un déclencheur, un état final stable, une adaptation mobile et une version `prefers-reduced-motion`.

## Références et transfert

Ces liens ont servi à identifier des patterns — pas à reprendre leur art direction. Les pages d’inspiration sont des index de motifs ; le prototype n’affirme pas qu’un effet leur a été copié au pixel près.

| Référence | Motif à étudier | Application possible à SIA | À ne pas transposer |
|---|---|---|---|
| [Bright Biotech — Interactive scrolling story (Awwwards)](https://www.awwwards.com/inspiration/team-interactive-scrolling-story-bright-biotech) | récit où sections, équipe et transitions forment une séquence | continuité entre message, expertises et preuve | raconter une histoire de marque non fournie ou transformer le site en microsite de campagne |
| [Charles Leclerc — homepage scroll (Awwwards)](https://www.awwwards.com/inspiration/homepage-scroll-charles-leclerc) | changements de scène, médias et navigation inhabituelle | traiter le passage hero → contenu comme une vraie transition | vidéo hero, expérience de fan ou contrôle de scroll particulier |
| [Vincent & Dussault — scroll gallery (Awwwards)](https://www.awwwards.com/inspiration/scroll-gallery-https-vincentetdussault-com) | galerie révélée au scroll, adaptation desktop/mobile | masque d’image éditorial et version mobile dédiée | composition de portfolio de construction / véhicule |
| [Cyd Stumpel — page transition (Awwwards)](https://www.awwwards.com/inspiration/default-page-transition-cyd-stumpel-portfolio-2025) | transition de page comme couture entre états | réserver les transitions aux changements de chapitre | transition couvrant systématiquement chaque navigation ; la page n’a pas permis une inspection live complète pendant cette recherche |
| [Invisible North (Awwwards)](https://www.awwwards.com/sites/invisible-north) | typographie scrollée, galerie hero, transitions de grille | faire porter une transition par la typographie et l’identité | rythme de portfolio d’agence ou animation de chargement |
| [Sélection Business & Corporate (Awwwards)](https://www.awwwards.com/websites/business-corporate/?page=141) | spectre des conventions corporate, du contenu dense à l’interactif | garder les repères B2B tout en choisissant peu de scènes animées | courir après une récompense ou multiplier les effets de catalogue |
| [À propos — Kearney](https://www.kearney.com/about) | architecture claire d’une page institutionnelle et progression du récit | garder les contenus et chemins de confiance lisibles sous la direction visuelle | reprendre chiffres, promesses, claims ou structure de texte de Kearney |
| [Collection Finance — Godly](https://godly.website/websites/finance) | découverte de sites de finance et services financiers | comparer le niveau d’expressivité à des publics qui attendent confiance et clarté | traiter une collection de références comme une validation qualitative uniforme |
| [Icam INOX — Godly](https://godly.website/website/icam-inox-863) | référence industrielle taguée grande typographie, image ample, transitions/scroll | faire dialoguer l’échelle des titres et un changement de scène | reprendre bento/layout industriel ou ajouter une grande photo simplement pour remplir le hero |
| [Nonymous — Godly](https://godly.website/website/nonymous-399) | typographie ample et scroll dans un site d’agence | observer comment la typographie peut porter une séquence | curseur custom, noir-et-blanc d’agence ou navigation inhabituelle |
| [SiteInspire — Business & Finance](https://www.siteinspire.com/websites/category/business-and-finance/page/2) | catalogue de références du secteur, dont conseil et finance | vérifier les conventions B2B et la clarté attendue | prendre le minimalisme institutionnel comme limite de l’ambition |
| [Overlock — Google Fonts source](https://github.com/google/fonts/tree/main/ofl/overlock) et [fiche famille/fontsource](https://fontsource.org/fonts/overlock/about) | coupes, fichiers et licence | voix typographique de marque, coupes réelles | simuler des graisses absentes |

La recherche a été volontairement filtrée par fonction et secteur, et non par popularité seule. Certaines pages d’inspiration exposent principalement des vignettes/descriptions ; elles ne sont pas utilisées comme preuve d’interaction exacte non vérifiée. Aucune référence n’est présentée comme benchmark visuel directement équivalent à un cabinet de conseil.

## Scènes et contrat de mouvement

| Scène | État initial → transition → état final | Mobile | Reduced motion |
|---|---|---|---|
| Header | bord fin et navigation sur le hero → fond clair lors du scroll → navigation fixe lisible | menu tactile plein panneau ; liens et CTA restent dans l’ordre clavier | fond/état fixe instantané ; aucune animation de déplacement |
| Hero | titre déjà présent dans le DOM, mots masqués sous leur ligne → trois révélations décalées et plans géométriques construits → titre entièrement lisible | titre ajusté, panneaux simplifiés et composition non collante sur petit écran | toutes les lignes visibles immédiatement ; pas de sticky, nudge ni morphing |
| Hero → intro | dernier plan reste en arrière-plan → court déplacement/recadrage relatif au scroll normal → surface claire avec intro stable | déplacement réduit et distance de scroll courte | aucun effet de parallaxe ou de clip |
| Introduction | titre coupé hors cadre, note masquée → clip et translation d’une seule entrée → texte complet | clip conservé à petite amplitude | contenu immédiatement visible |
| Expertises | une ligne sélectionnée, aperçu correspondant → action utilisateur met à jour le numéro, titre, texte et géométrie → état sélectionné stable | même contrôle par tap ; panneau dans le flux, non sticky | changement d’état immédiat sans transition |
| Publications | composition de couverture masquée → reveal du masque et lignes de titre pendant entrée viewport → couverture/texte lisibles | masque moins profond, aucun sticky ; ordre DOM conservé | couverture et titres visibles au chargement |
| Étude de cas | contexte sélectionné, quatre étapes dans le flux → l’étape au centre de lecture met à jour un champ visuel → récit intégralement disponible | pas de sticky, étapes visibles en liste ; signal visuel décoratif | ne pas dépendre d’IntersectionObserver pour révéler les étapes |
| Footer | scène finale recadrée sous le contenu → révélation du plan de fond et du mot-symbole → composition fixe, liens utilisables | titre redimensionné, aucun débordement, coordonnées puis nav/légal | clip retiré, géométrie immobile, footer intégralement visible |

## Interactions et accessibilité

- Les mouvements non sollicités se concentrent à l’entrée et à quelques seuils de scène.
- L’index d’expertises est une série de vrais boutons ; pointeur, focus clavier et toucher appellent la même mise à jour. L’état est communiqué avec `aria-pressed`.
- Le menu est un bouton nommé avec `aria-expanded` et `aria-controls`, se ferme par Escape, sélection d’un lien et retour à la largeur desktop. Le skip link précède le header.
- Aucun texte essentiel ne dépend d’un survol, d’une animation ou d’une image.
- `prefers-reduced-motion: reduce` annule les transitions, les clips et les déplacements ; le script révèle le contenu sans attendre les observers. Cette préférence doit rester respectée si l’utilisateur la change à chaud.
- Les liens et contrôles ont des cibles d’au moins 44px de hauteur et un focus visible. Garder les états focus aussi soignés que hover.

## Implémentation et budget

Le prototype utilise CSS et JavaScript natif, sans GSAP, Motion, canvas ou WebGL. Cela garde l’expérience autonome et permet de tester la grammaire avant de décider d’une dépendance de production.

- Scroll progress : un seul `requestAnimationFrame` regroupe la lecture des dimensions et l’écriture d’une variable CSS ; ne pas animer des propriétés de layout. Les rangées de formation n’animent que le fond et la flèche, pas le padding.
- Apparitions : `IntersectionObserver`, arrêt après la première révélation ; contenu complet dans le DOM.
- Expertise : changement à l’action, plutôt qu’un polling ou une animation liée au curseur.
- Étude de cas : observer les étapes, sans boucle continue.
- Footer : clip-path d’entrée puis décor statique ; la géométrie ne dérive pas en continu. Le repère de scroll du hero ne bouge que trois fois au chargement, puis reste fixe.
- Les transitions de `clip-path` peuvent solliciter le paint. Dans une implémentation finale, mesurer sur mobile réel ; si nécessaire remplacer par masque simple ou translation optimisée sans compromettre le sens.
- Le prototype charge les fonts à distance. Les polices bloquées ou lentes doivent laisser le système utilisable avec les fallbacks ; production devra auto-héberger les fichiers retenus.

## Points à vérifier avant intégration

1. Tester réellement le mode système reduced-motion et son changement pendant la session. Le navigateur disponible ici n’émule pas cette préférence système.
2. Vérifier la lisibilité des surfaces/couleurs exactes avec contrast checker et les vrais contenus.
3. Vérifier l’expérience du menu et du scroll sur iOS/Android, notamment la barre d’adresse dynamique et `svh`.
4. Profiler les clips et l’effet sticky sur appareil milieu de gamme.
5. Réexaminer toute durée après ajout des vrais titres : la longueur du contenu peut rendre une chorégraphie trop lente.
