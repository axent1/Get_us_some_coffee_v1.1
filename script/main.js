// Deklaracija API promenljivih
var client_id,client_secret,base_url,endpoint,url,params,key
var limit,sortiranje,tip_pretrage,radijus,ll;
var sort = 1;
// Deklaracija ostalih promenljivih
var str;
var zoom; 
var pozicija_korisnika;
var mesta;
var cityCircle;
var map;
var options;
var infoWindow;

// Pozicija korisnika i iscrtavanje mape.
function initMap() {
    zoom = 15;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: zoom,
        center: new google.maps.LatLng(43.321421, 21.895247),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: false,
        streetViewControl: true
    });
    UserPosition();
}
function UserPosition(){
    document.getElementById("display").innerHTML = "";
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
        cityCircle = new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.5,
            strokeWeight: 1,
            fillColor: '#FF0000',
            fillOpacity: 0.15,
            map: map,
            center: pozicija_korisnika,
            radius: 1000.0
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
    }else if(sort == 2){
        sortiranje = '&price=1';
    }else if(sort == 3){
        sortiranje = '&price=1';
    }else if(sort == 4){
        sortiranje = '&price=2';
    }else if(sort == 5){
        sortiranje = '&price=3';
    }else if(sort == 6){
        sortiranje = '&price=4';
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
        mesta = result.response.groups[0].items;  // groups[0] zato sto su lose napravili json format, pa taj objekat ima nekako 2 niza gde je drugi prazan, a prvi sadrzi informacije
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
    if(value == 2){
        document.getElementById("filterID").innerHTML = `
            <div class="text_filtera">
            <span >Use filter option to search by coffee price</span><br><br>
            <label class="labela" for="Sortiraj">Price by:</label>
            <div class="container">
                <ul>
                    <li>
                        <input type="radio" class="priceradio" id="c-option" name="PriceRadio">
                        <label for="c-option">Cheap</label>
                        <div class="check"></div>
                    </li>
                    <li>
                        <input type="radio" class="priceradio" id="m-option" name="PriceRadio">
                        <label for="m-option">Moderate</label>
                        <div class="check"><div class="inside"></div></div>
                    </li>
                    <li>
                        <input type="radio" class="priceradio" id="e-option" name="PriceRadio">
                        <label for="e-option">Expensive</label>
                        <div class="check"><div class="inside"></div></div>
                    </li>
                    <li>
                        <input type="radio" class="priceradio" id="v-option" name="PriceRadio">
                        <label for="v-option">Very Expensive</label>
                        <div class="check"><div class="inside"></div></div>
                     </li>
                </ul>
            </div>
            <a href="javascript:void(0);" onclick="ApplyFilter()"><div class="dugme2">Apply</div></a>
            <a href="javascript:void(0);" onclick="CloseFilter()"><div class="dugme">Close [X]</div></a>
            </div>
        `;
    }else{
        document.getElementById("filterID").style.display = "none";
        document.getElementById("filterID").innerHTML = `
        <div class="text_filtera"><span >You can use filter option to search by distance or coffee price</span><br><br>
         <label class="labela" for="Sortiraj">Sort by:</label>
         <select class="klasa_select" id ="Sortiraj" name="Sortiraj" onmousedown="this.value='';" onchange="SortirajPo(this.value);">
             <option value='1' selected="Distance">Distance</option>
             <option value='2'>Price</option>
         </select>
         <a href="javascript:void(0);" onclick="CloseFilter()"><div class="dugme">Close [X]</div></a>
         </div>
        `;
    }
    sort = value;
    initMap();
}
// Proverava da li je lokacija u datom radijusu.
function calcDistance(p1, p2) {
    return (google.maps.geometry.spherical.computeDistanceBetween(p1,p2)).toFixed(2);
}