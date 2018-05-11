
// 1- ajouter un avis sur un resto, ouvre la modal

$(document).on('click', '#avis_bouton', function () {
    $('select').material_select(); // initialize select
    var addAvis = $('input[name="newAvis"]').val(""); // vider la var 

    // initialization modal
    $('#modal2').modal();
    before: $('#modal2').modal('open');

});

// Ajout sur resto existant : new avis + new note + re-calcul de la moyenne note du resto
$('#btn_valide').on('click', function () { // binder événement
    var addAvis = $('input[name="newAvis"]').val(); // stocker avis
    var addNote = $("select[id='taNote']").val(); // stocker note
    $('#modal2').modal('close'); // fermeture modal
    var affichage = $("<div/>").addClass('collapsible-body').html("Nombre d'étoiles : " + "<span class='ta_note'>" + addNote + "</span>" + " - Commentaires : " + addAvis).appendTo("li[class='active']:last"); // ajouts note et avis et stockage dans une variable "affichage" 
    
    $(affichage).show(); // affichage en live du new commentaire
    
    alert("Merci, votre avis et votre note sont enregistrés");

    var i = 0; // mise à 0 variable
    var moyenne = 0; // mise à 0 variable

    // fonction calcul de la moyenne
    $('li.active span[class="ta_note"]').each(function () {
        moyenne = moyenne + Number($(this).html());
        i = i + 1; // incrémentation nbre d'avis
    });

    moyenne = moyenne / i;
    $("li.active input.moyenneEtoiles").val(moyenne);
    $("li.active .rateYo").rateYo("option","rating",moyenne); // rafraichir le nbre étoiles en fondtion de la nouvelle moyenne
});
// fin 1



// 2- Fonction qui génère les restaurants à partir du fichier json 

function genererRestaurantJSON() {

    $.getJSON("restaurant.json", function (data) {
        $.each(data, function (index, restaurant) {
            // pour chaque restaurant de mon tableau data (lui même issu de mon JSON), je créé un restaurant
            creerRestaurant(restaurant.lat, restaurant.long, restaurant.restaurantName, restaurant.address, restaurant.ratings);
            // afficher les infos resto quand click sur marqueur
            marker.addListener('click', function () {
                $('.collapsible').collapsible('open', index);
            });
        });
    });
};

// fin 2

// 3- moteur filtre restaurant

// retire les checks au chargement
$("input").removeAttr('checked');

// fonction click maxi
$('input[name="maxi"]').click(function () {
    var maxi = $(this).val(); // définir la valeur du clic maxi
    if ($('input[name="mini"]').is(":checked")) { // vérifier le clic mini a été fait 
        var mini = ($('input[name="mini"]:checked').val()); //récupérer sa valeur

        // mettre en place le hide ou le show pour chaque resto selon valeur de mini et de maxi
        $("li").each(function (index) {
            note_moyenne = $(this).find(".moyenneEtoiles").val();
            if ((note_moyenne < mini) || (note_moyenne > maxi)) {
                $(this).hide();
                tabMarker[index].setVisible(false);
            } else {
                $(this).show();
                tabMarker[index].setVisible(true);
            }
        });
    }
});

// fonction click mini
$('input[name="mini"]').click(function () {
    var mini = $(this).val(); // définir la valeur du clic mini
    if ($('input[name="maxi"]').is(":checked")) { // vérifier le clic maxi a été fait
        var maxi = ($('input[name="maxi"]:checked').val()); //récupérer sa valeur

        // mettre en place le hide ou le show pour chaque resto selon valeur des clics
        $("li").each(function (index) {
            note_moyenne = $(this).find(".moyenneEtoiles").val();
            if ((note_moyenne < mini) || (note_moyenne > maxi)) {
                $(this).hide();
                tabMarker[index].setVisible(false);
            } else {
                $(this).show();
                tabMarker[index].setVisible(true);
            }

        });
    }

});

//fin 3


//4- fonction création restaurant //

function creerRestaurant(restaurantlat, restaurantlong, restaurantName, restaurantAddress, restaurantratings) {


    // marker
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(restaurantlat, restaurantlong),
        map: map,
        name: name
    });

    // "alimenter" le tableau avec les markers
    tabMarker.push(marker);

    // affichage dans les modals des resto : nom,vignette street view, adresse,etoiles,comment
    var li = $("<li/>").appendTo($("ul"));
    var image = $("<div/>").addClass('collapsible-header').html('<img class="img100" src="https://maps.googleapis.com/maps/api/streetview?size=150x150&location=' + restaurantlat + ',' + restaurantlong + '&fov=90&heading=235&pitch=10&key=AIzaSyCWiF3KUZrx50__8M3cozXlMfLoraKqMu0">').appendTo(li);
    $("<div/>").text(restaurantName).appendTo(image);
    $("<div/>").attr('class', 'rateYo').appendTo(image); // div pour placer les étoiles
    $("<div/>").addClass('collapsible-body').text("Adresse : " + restaurantAddress).appendTo(li);
    $("<div/>").addClass('collapsible-body').insertAfter('li div[class="collapsible-body"]:last');
    $("<a/>").attr('id', 'avis_bouton').addClass("waves-effect waves-light btn").text("Ajoutez autre avis").appendTo('li div[class="collapsible-body"]:last');


    // définit la moyenne étoiles à valeur 0
    
    if (restaurantratings != "vide") {
        moyenneEtoiles = 0;
        $.each(restaurantratings, function (index, avis) { // pour chaque resto, on calcule la moyenne des étoiles
            moyenneEtoiles = moyenneEtoiles + avis.stars;
            $("<div/>").addClass('collapsible-body').html("Nombre d'étoiles : " + "<span class='ta_note'>" + avis.stars + "</span>" + " - Commentaires : " + avis.comment).appendTo(li);
        }); // fin $ each restaurantratings
        moyenneEtoiles = moyenneEtoiles / restaurantratings.length;
    };
    // fin

    $("<input/>").attr('type', 'hidden').addClass('moyenneEtoiles').val(moyenneEtoiles).appendTo(li); // ajout moyenne en caché

    // fonction pour ajouter les étoiles dans la div class="rateYo"
    $(function () {
        $(".rateYo").rateYo({
            rating: moyenneEtoiles,
            readOnly: true,
            spacing: espace_etoiles,
            starWidth: taille_etoiles,
            ratedFill: couleur_etoiles
        });
    });
    // fin

};

// fin 4

// 5 - construire restaurants à proximité de la géolocalisation de l'internaute
function genererRestoPlaces() {

    $('ul').html("");
    
    var request = {
        location: map.getCenter(),
        radius: rayon,
        type: type_commerce
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
};
 function callback(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            for (var i = 0; i < results.length; i++) {
                creerRestaurant(results[i].geometry.location.lat(), results[i].geometry.location.lng(), results[i].name, results[i].vicinity, "vide");
                moyenneEtoiles=results[i].rating;
            };
        };
    };

// fin 5
