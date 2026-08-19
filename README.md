# Sous réserve

Les sept jours à venir : ce qu'on vise, ce qu'on a réservé.

Beaucoup d'activités se réservent dans une fenêtre étroite — piscine communale,
salle d'escalade, yoga, atelier, cours de langue. L'application du prestataire
notifie l'ouverture des inscriptions et affiche un créneau à la fois ; le calendrier
personnel, lui, ne reçoit que ce qui est confirmé. Entre les deux, l'intention
n'existe nulle part.

C'est la seule raison d'être de cette page. Ce n'est pas un agenda : les intentions
ne sont pas des rendez-vous, elles n'ont ni la même durée de vie, ni le même statut,
ni le même moment d'usage.

Fichier unique, stockage local, aucune dépendance, aucun serveur.

## Fonctionnement

On définit d'abord ses **activités** : un nom, une durée, un emoji facultatif. Elles
se configurent dans la section « Mes activités » et servent ensuite partout.

Une fenêtre glissante de sept jours à partir d'aujourd'hui. Chaque créneau posé
porte une activité, une heure de début et un statut. La durée n'est jamais saisie
au cas par cas : elle est lue depuis l'activité, donc la corriger met à jour tous
les créneaux déjà posés.

Deux statuts : **à réserver** (terracotta) et **réservé** (bleu). Un appui sur la
pastille bascule de l'un à l'autre, le `×` retire la ligne. Pas de formulaire de
modification pour un créneau : il est plus rapide d'effacer et de reposer.

Un encart « À réserver » apparaît sous l'aperçu quand il reste des créneaux non
réservés aujourd'hui ou demain. Le reste du temps il n'existe pas. C'est ce qui
donne une raison d'ouvrir l'appli plutôt que de la consulter par curiosité.

L'heure proposée à l'ajout est la dernière saisie, pas une valeur fixe : l'appli
s'aligne sur les habitudes de chacun au lieu de les présumer.

Les jours passés sont effacés, sans historique. La purge tourne au chargement et à
chaque retour sur l'onglet.

## Saisie en liste, affichage en grille

Décision structurante, à ne pas défaire par réflexe.

Les créneaux peuvent commencer à n'importe quel quart d'heure et durer de 15 à 180
minutes. Une grille de saisie devrait donc descendre au quart d'heure : sur une
amplitude de 6h à 23h, cela ferait soixante-huit lignes sur sept colonnes, avec des
créneaux occupant plusieurs cases. Illisible sur téléphone et pénible à remplir.

D'où la séparation : on saisit dans une liste, précisément ; on regarde une grille
d'affichage, où chaque créneau est un bloc positionné proportionnellement à son
heure et dimensionné à sa durée. Comme aucune case n'est à toucher, la précision au
quart d'heure ne coûte rien en lisibilité.

L'aperçu ne distingue pas les activités — pas de couleur, pas d'emoji. La couleur y
sert au statut, et un emoji lisible ne tiendrait pas dans un bloc de seize pixels de
haut. La liste juste en dessous nomme chaque créneau ; l'aperçu sert à voir le
rythme de la semaine et ce qui reste à réserver.

Les blocs conservent leur hauteur exacte, sans marge décorative : l'espace visible
entre deux blocs est du temps réel.

## Cadrage automatique

L'axe vertical se règle sur le contenu réel de la semaine, arrondi à la demi-heure,
avec une marge de trente minutes de part et d'autre. Sur une amplitude fixe, des
créneaux groupés se tasseraient dans une bande étroite et le reste de la hauteur
resterait vide.

Plancher de deux heures : sans lui, une semaine à un seul créneau donnerait une
amplitude de 45 minutes où le bloc occuperait tout et ne dirait plus rien.

L'axe horaire passe au pas de deux heures dès que l'amplitude dépasse six heures,
sinon les libellés se chevauchent.

## Ordre des activités

Rangement manuel, par deux flèches dans « Mes activités ». Cet ordre est celui de la
feuille d'ajout, où l'on passe le plus de temps.

Pas de tri automatique par fréquence : la liste bougerait sous le doigt, et
l'instabilité coûterait plus que le gain. Pas de tri alphabétique non plus, stable
mais arbitraire. L'ordre appartient à qui se sert de l'appli, et se règle une fois.

## Suppression d'une activité

Refusée tant que des créneaux de la semaine l'utilisent, avec un message qui
l'explique dans la feuille d'édition. C'est ce qui garantit qu'une référence ne peut
jamais pointer dans le vide, et donc qu'on peut se permettre de lire la durée depuis
l'activité plutôt que de la recopier dans chaque créneau.

Les créneaux passés étant purgés, il suffit d'attendre ou de retirer les lignes
concernées.

## Stockage

Trois clés :

```
sousreserve.activites      [ { id, nom, emo, min } ]
sousreserve.items          [ { id, date, type, deb, statut } ]
sousreserve.derniereheure  entier, minutes depuis minuit
```

`date` en `AAAA-MM-JJ`, `deb` en minutes depuis minuit, `type` renvoie à l'`id`
d'une activité. L'ordre du tableau `activites` est l'ordre d'affichage, il n'est
jamais retrié. Le préfixe compte : toutes les apps de `azertida.github.io`
partagent la même origine et le même quota.

Pas d'export ni d'import, délibérément : la semaine s'efface d'elle-même, il n'y a
rien qui mérite d'être sauvegardé. Seule la liste des activités est durable, et elle
se recrée en quelques appuis.

## PWA

L'installation est sans danger : rien n'arrive de l'extérieur, donc la séparation
entre le stockage de la PWA installée et celui du navigateur n'a pas de
conséquence.

Une seule précaution : **installer avant de saisir**. Ce qui aurait été rempli dans
l'onglet du navigateur ne suivrait pas dans l'application installée.

Le service worker sert la page en réseau d'abord et les icônes en cache d'abord :
l'app se met à jour toute seule au chargement suivant, sans notification. Pour
forcer un renouvellement complet, incrémenter `CACHE` dans `service-worker.js`.

## Fichiers

```
index.html
manifest.json
service-worker.js
icon-180.png            apple-touch-icon (fichier externe obligatoire, pas de base64)
icon-192.png
icon-512.png
icon-512-maskable.png
```

## Ce qui n'y est pas, et pourquoi

Pas de récupération automatique des plannings : chaque prestataire a son système,
souvent fermé. La saisie reste manuelle, et c'est justement ce qui fait que
l'intention existe ici et nulle part ailleurs.

Pas de statut « raté ». Garder trace d'un créneau manqué n'aide à rien.

Pas de contrôle sur les heures déjà écoulées. Une erreur de saisie se voit
immédiatement, se corrige d'un appui, et ne survit pas à minuit ; le garde-fou
coûterait plus qu'il ne rapporte.

Pas de partage, pas de synchronisation, pas de compte. Outil strictement personnel.

## Licence

CC0.
