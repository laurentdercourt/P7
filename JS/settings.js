// variable globale map
var map;

// création tableau pour stocker les markers
var tabMarker = [];

// variable globale  issue du geocoder
var adresse;

// variable globale moyenne des restaurants
var moyenneEtoiles;


////////// ---------------------------------- ///////////////

//niveau de zoom de la carte
var zoom_initmap = 13;

// centrage intiial de la carte
var centrage_intimap = {
    lat: 48.856614,
    lng: 2.3522219000000177
};

// paramétrage des étoiles
var espace_etoiles = '3px'; // espace 
var taille_etoiles = '10px'; // taille 
var couleur_etoiles = "#E9646A" // couleur

// paramétrage informations affichées selon localisation de l'internaute
var rayon = 2500; // rayon souhaité pour définir le cercle de recherche autour de l'internaute (en mètres)
var type_commerce = ['restaurant']; // type de commerce à afficher, lien pour les différents types utilisables : https://developers.google.com/places/supported_types?hl=fr
