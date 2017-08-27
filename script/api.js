// inicijalizacija API kljuceva
var client_id = 'OZZ0YQOCRCTTEEHRG3HL0IWMKTAJ0KCRPU1WS3O5WVINZI3K';
var client_secret = 'Z11HIZTIKBNALPZXJNFRPAF3XR0U3IJEYYHWIO4SJHY43SNG';

// inicijalizacija API ulr adrese za pretragu 
var base_url = 'https://api.foursquare.com/v2/';
var endpoint = 'venues/explore?';
var params = 'near=Nis, Serbia&query=coffee'; 
var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20140626';
var url = base_url + endpoint + params + key;

// inicijalizacija promenljivih
var str;
var pozicija_korisnika;
var mesta;
var pozicija_markera;
var udaljenost = 1000.0;
var map;
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
        navigator.geolocation.getCurrentPosition(function(position) {

        pozicija_korisnika = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

        infoWindow.setPosition(pozicija_korisnika);
        infoWindow.setContent('Location found.');
        infoWindow.open(map);
        map.setCenter(pozicija_korisnika);
        }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
        });
    } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
    }
}
function handleLocationError(browserHasGeolocation, infoWindow, pozicija_korisnika) {
    infoWindow.setPosition(pozicija_korisnika);
    infoWindow.setContent(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
    }

// Generisanje markera
$.get(url, function (result) {
mesta = result.response.groups[0].items;  

for (var i in mesta){
    mesta[i];
    pozicija_markera = new google.maps.LatLng(mesta[i].venue.location.lat, mesta[i].venue.location.lng);

    if(calcDistance(pozicija_korisnika,pozicija_markera) <= udaljenost){
        str = '<p><strong>' + mesta[i].venue.name + '</strong> '; 
        str += '(jeste)';
        if(mesta[i].venue.hours){
            str += '-----'+ mesta[i].venue.hours.isOpen +'</p>';            
        }
        $('#display').append(str);
        if(mesta[i].venue.hours && mesta[i].venue.hours.isOpen == true){
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(mesta[i].venue.location.lat,mesta[i].venue.location.lng),
            map: map
        });
    }
    }else{
        str = '<p><strong>' + mesta[i].venue.name + '</strong> '; 
        str += '(nije)';
        if(mesta[i].venue.hours.isOpen){
            str += '-----'+ mesta[i].venue.hours.isOpen +'</p>';            
        }
        $('#display').append(str);
    }
}});

// Proverava da li je lokacija u datom radijusu.
function calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1,p2)).toFixed(2);
  }