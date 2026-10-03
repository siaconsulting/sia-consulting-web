# SIA Consulting — direction V3

## Intention

**Le plan en mouvement.** SIA travaille sur des systèmes complexes ; l’expérience fait évoluer un même champ visuel vers une lecture plus claire, au lieu d’empiler des effets ou des cartes. Le symbole à trois plans du logo inspire les coupes diagonales, les recouvrements et la profondeur, mais ne devient pas un motif répété à chaque section.

Le geste le plus expressif est réservé à l’entrée : trois lignes typographiques Overlock se révèlent l’une après l’autre tandis que trois plans de couleur se décalent légèrement avec le scroll. Le contenu reste lisible immédiatement, sans image obligatoire. Après cette scène, l’interface alterne des moments calmes et quelques interactions fonctionnelles. Pas de scroll hijacking, de WebGL, de curseur personnalisé, de parallax extrême ni de ressort ludique.

## Grammaire de page

```text
┌──────────────────────────────┐
│ Hero : mots + plans SIA      │  message compris avant animation
└──────────────┬───────────────┘
               └── intro calme, diagonale comme seuil
┌──────────────────────────────┐
│ index piloté → scène active  │  expertises, interaction explicite
└──────────────────────────────┘
       secteurs/formations : lecture stable
┌──────────────────────────────┐
│ couverture → titre éditorial│  une seule révélation forte
└──────────────────────────────┘
       récit d’étude de cas, étape par étape
       références disposées selon leur espace optique
┌──────────────────────────────┐
│ footer-signature : scène SIA │  contenu et navigation intégrés
└──────────────────────────────┘
```

Alignement principalement à gauche ; les compositions asymétriques sont réservées aux scènes éditoriales. La mise en page ne doit pas dépendre de longues zones vides pour paraître haut de gamme.

## Couleurs

Les trois tons de marque proviennent de l’analyse du logo fourni. Les deux autres sont des dérivations fonctionnelles de contraste, pas de nouvelles couleurs officielles.

| Token | Valeur | Rôle |
|---|---|---|
| `--ink` | `#071C28` | fond profond, texte sur cyan |
| `--brand` | `#27617E` | bleu principal du logo |
| `--cyan` | `#4D9AAD` | plan lumineux et action |
| `--steel` | `#829CA8` | plan secondaire, ton du logo |
| `--mist` | `#EAF2F5` | surface froide douce |
| `--paper` | `#F8FAFB` | fond clair du prototype |
| `--white` | `#FFFFFF` | contraste et surfaces |
| `--muted` | `#526975` | texte secondaire sur surfaces claires |
| `--focus` | `#0B6688` | anneau de focus visible |

Pas de vert, jaune ou violet ajouté. La marque apparaît en champs de couleur limités ; les surfaces claires laissent respirer les scènes sombres.

Contrastes calculés pour les paires de texte principales du prototype : blanc/brand `6.78:1`, ink/cyan `5.42:1`, ink/steel `6.03:1`, muted/paper `5.52:1`, brand/paper `6.48:1`. Le blanc sur cyan est `3.21:1` : il ne convient pas au texte courant WCAG AA. Les CTA cyan utilisent donc le texte ink ; les petits textes blancs restent sur ink/brand. Cyan sur clair reste un accent graphique, jamais un libellé essentiel.

## Typographie

### Overlock — voix de marque principale

Le prototype charge les coupes réelles `400`, `700`, `900`, ainsi que leurs italiques :

- Black 900 : grandes lignes du hero et titres de scène ;
- Bold 700 : titres secondaires, navigation, boutons et labels courts ;
- Regular 400 : textes courts et descriptions de contrôle ;
- Italique réel 400/700 : accent ponctuel dans une phrase, pas une deuxième voix décorative.

Overlock est expressive, arrondie et reconnaissable : c’est une bonne voix pour la marque, mais ses formes affichage et son rythme ne sont pas idéaux pour de longs paragraphes denses. Ne pas l’imposer aux notices, formulaires ou articles longs au seul nom de la cohérence.

### Source Sans 3 — outil de lecture

La seconde famille est réservée au corps long, aux métadonnées et à l’interface dense. Elle maintient une lecture neutre pendant qu’Overlock porte la personnalité. Aucun faux poids 600 n’est construit pour Overlock. La hiérarchie repose sur les fichiers disponibles, la taille, la casse de phrase et l’espacement.

Les fichiers ne sont pas encore auto-hébergés dans le prototype : Google Fonts est sollicité pour l’exploration. Pour production, vérifier la licence SIL OFL et les artefacts exacts, puis auto-héberger les fichiers nécessaires (formats modernes, sous-ensembles latins pertinents, préchargement limité). Overlock n’est pas une variable font dans la distribution référencée ; éviter le téléchargement d’axes inexistants.

## Layout et rythme

- Conteneur maximal : `1440px`, marges fluides fondées sur les gutters.
- Desktop : scènes éditoriales asymétriques ; liste et scène active pour les expertises ; colonnes limitées aux contenus qui le justifient.
- Mobile : une seule colonne, titre sans débordement, expertise non sticky, études de cas non pilotées par un sticky panel.
- Corps de lecture : mesure cible de 60–75 caractères ; paragraphes alignés à gauche, jamais justifiés.
- Espacement : sections généreuses mais bornées par `clamp()`, marges internes plus serrées pour les états denses.
- Rayon : quasi nul ; les séparateurs et plans géométriques remplacent le langage de cartes arrondies.
- Ombres : absentes ; profondeur par recouvrement, couleur et masque.

## Familles de composants

- Container / section : largeur et rythme communs, aucune variante infinie.
- Action : bouton solide cyan ou contour clair ; libellé d’action explicite.
- Eyebrow : usage parcimonieux, toujours informatif.
- Expertise : contrôle de liste avec état `aria-pressed` et panneau synchronisé.
- Publication : une scène principale asymétrique, pas une grille blog clonée.
- Étude de cas : quatre étapes éditoriales, résultat sans métrique inventée.
- Références : emplacements respectant les ratios et l’espace optique propres à chaque logo.
- Footer-signature : coordonnées, navigation, légal et marque dans une seule composition finale.

## États vides et contenu

Tous les libellés entre crochets sont des placeholders structurels, pas du contenu proposé. Ne pas remplir une scène avec de faux clients, chiffres, auteurs, dates, publications, formations, références ou résultats. Une section réelle sans contenu validé doit pouvoir être absente ou réduite proprement.

Le logo utilisé est la copie inchangée de l’asset transmis. Son fond blanc apparaît dans son lockup ; obtenir le master vectoriel/transparence avant de décider s’il faut un traitement inverse sur fond sombre. Ne pas retoucher le symbole ni recadrer les mentions légales du fichier source sans master approuvé.

## Critères avant production

1. Remplacer les placeholders uniquement par les Globals/collections validés.
2. Vérifier la version master du logo et les variantes adaptées aux fonds.
3. Héberger localement les fontes approuvées.
4. Tester les couleurs réelles sur toutes les combinaisons, notamment le cyan et le texte fin.
5. Conserver un fallback sans image et sans motion.
6. Ne transférer aucun composant du prototype vers les routes de production sans revue dédiée.
