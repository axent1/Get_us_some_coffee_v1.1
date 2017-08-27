// Deklaracija API promenljivih
var client_id,client_secret,base_url,endpoint,url,params,key
var limit,sortiranje,tip_pretrage,radijus,ll;
var sort = 1;
// Deklaracija ostalih promenljivih
var str;
var pozicija_korisnika;
var mesta;
var map;
var options;
var infoWindow;

// Pozicija korisnika i iscrtavanje mape.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: new google.maps.LatLng(43.321421, 21.895247),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        streetViewControl: true
    });
    infoWindow = new google.maps.InfoWindow;
    // Try HTML5 geolocation.
    if (navigator.geolocation) {
        options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition(function(position) {
        pozicija_korisnika = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(pozicija_korisnika.lat,pozicija_korisnika.lng),
            animation: google.maps.Animation.BOUNCE,
            icon: '../images/user_marker.png',
            title: 'Tvoja trenutna pozicija',
            map: map
        });
        infoWindow.setPosition(pozicija_korisnika);
        infoWindow.setContent('Tvoja Lokacija');
        infoWindow.open(map);
        map.setCenter(pozicija_korisnika);
        InitApiUrl();
        }, 
        function() {
            handleLocationError(true, infoWindow, map.getCenter());
        },
        options
    );
    } else {
            // Browser doesn't support Geolocation
            handleLocationError(false, infoWindow, map.getCenter());
    }
}

// funkcija koja podnosi greske
function handleLocationError(browserHasGeolocation, infoWindow, pozicija_korisnika) {
    infoWindow.setPosition(pozicija_korisnika);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
}

function InitApiUrl(){
    // inicijalizacija API endpointa i kljuceva
    client_id = 'OZZ0YQOCRCTTEEHRG3HL0IWMKTAJ0KCRPU1WS3O5WVINZI3K';
    client_secret = 'Z11HIZTIKBNALPZXJNFRPAF3XR0U3IJEYYHWIO4SJHY43SNG';
    base_url = 'https://api.foursquare.com/v2/';
    endpoint = 'venues/explore?';

    // inicijalizacija API pretrage
    limit = 10;

    if(sort == 1){
        sortiranje = '&sortByDistance=1';
    }else{
        sortiranje = '';
    }

    tip_pretrage = 'coffee';
    radijus = 1000.0;
    ll = pozicija_korisnika.lat+', '+pozicija_korisnika.lng;

    // inicijalizacija parametra za API, url adrese i kljuca; 
    params = 'll=' + ll + '&query=' + tip_pretrage + '&radius=' + radijus + '&limit=' + limit + '&openNow=1' + sortiranje;
    key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20140626';
    url = base_url + endpoint + params + key;
    GenerateVenues();
}

// Generisanje 10 markera u zadatom radijusu po udaljenosti.
function GenerateVenues(){
    $.get(url, function (result) {
        mesta = result.response.groups[0].items;  
        for (var i in mesta){
            str = '<p><strong>' + mesta[i].venue.name + '</strong> '; // zameni sa javascript a ne Jquery (i vidi isto za url ako umes)
            str += '(jeste)';
            $('#display').append(str);
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(mesta[i].venue.location.lat,mesta[i].venue.location.lng),
                animation: google.maps.Animation.DROP,
                map: map
            });
        }
    });
}
function SortirajPo(value)
{   
    sort = value;
    document.getElementById("display").innerHTML = "";
    initMap();
}
// Proverava da li je lokacija u datom radijusu.
function calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1,p2)).toFixed(2);
}