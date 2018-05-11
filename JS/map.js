// 1-initmap
function initMap() {

    // 1.1- déclarer la fonction initMap + centrer sur paris
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom_initmap,
        center: centrage_intimap
    });

    // 1.2- construire les resto à partir de la lecture données json
    genererRestaurantJSON();

    // 1.3- construire un resto en cliquant sur la carte 
    google.maps.event.addListener(map, 'click', function (point) {

        // geocoder
        var geocoder = new google.maps.Geocoder;
        lat = point.latLng.lat();
        lng = point.latLng.lng();
        var latlng = new google.maps.LatLng(lat, lng);
        geocoder.geocode({
            'latLng': latlng
        }, function checkpoint(results) {
            adresse = results[0].formatted_address;
        }); // fin geocoder

        // initialization modal
        $('#modal1').modal();
        before: $('#modal1').modal('open'); // fin modal

    }); /// fin 1.3 //

    // 1.4- créer restaurant à partir de la géoloc de l'internaute
    alert("Pour profiter de toutes les fonctionnalités du site, souhaitez-vous être géolocalisé(e) ?");

    navigator.geolocation.getCurrentPosition(function (position) {

        map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
        var marker2 = new google.maps.Marker({
            map: map,
            position: map.getCenter(),
            icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
        });
        genererRestoPlaces();

    });
    //fin 1.4   

    //1.5 - création restaurant avec event déplacement de la souris
    map.addListener('dragend', function () {
        genererRestoPlaces();
    });
    // fin 1.5                              
};
// fin 1 initmap,


// 2- binder bouton "validez" pour création resto lorsque clic sur la carte
$('input[name="validez"]').on('click', function () {
    $('#modal1').modal('close'); // fermeture modal
    var restoName = $('input[name="nom_restau"]').val(); // je stocke valeur restoName
    $('input[name="nom_restau"]').val(""); // effacer contenu de l'input restoName
    creerRestaurant(lat, lng, restoName, adresse, "vide");
});
//fin 2
