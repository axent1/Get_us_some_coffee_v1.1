// globalne promenljive
var sort = 1;
var pozicija_korisnika;
var directionsDisplay;
var directionsService;
var map;
var options;
var markers=[];
var contents = [];
var infowindows = [];
var Index_id = 0;

function Globalna(){
    // Deklaracija API promenljivih
    var client_id,client_secret,base_url,endpoint,url,params,key
    var limit,sortiranje,tip_pretrage,radijus,ll;
    // Deklaracija ostalih promenljivih
    var str; 
    var broj = 0;
    var mesta;
    var cityCircle;
    var infoWindow;

    document.getElementById('about_page').style.display = 'none';
    document.getElementById('initialization').style.display = 'block';
    initMap();

    // iscrtavanje mape.
    function initMap() {
        directionsDisplay = new google.maps.DirectionsRenderer();
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: new google.maps.LatLng(43.321421, 21.895247),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            panControl: false,
            disableDefaultUI: true,
            streetViewControl: false
        });
        directionsDisplay.setMap(map);
        UserPosition();
    }

    // Pozicija korisnika.
    function UserPosition(){
        document.getElementById("display").innerHTML = "";
        infoWindow = new google.maps.InfoWindow;
        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            options = {
                enableHighAccuracy: true,
                timeout: 8000,
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
                title: 'Your current position',
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
            infoWindow.setContent('Your position');
            infoWindow.open(map,marker);
            map.setCenter(pozicija_korisnika);
            setTimeout(function(){
                    infoWindow.close();
                }, 
                '2000'
            );
            setTimeout(function(){
                    infoWindow.close();
                    cityCircle.setMap(null);
                }, 
                '2300'
            );
            google.maps.event.addDomListener(window, 'resize', function() {
                map.setCenter(pozicija_korisnika);
            });
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

    // funkcija koja podnosi greske.
    function handleLocationError(browserHasGeolocation, infoWindow, pozicija_korisnika) {
        infoWindow.setPosition(pozicija_korisnika);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: The Geolocation service failed.' :
            'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
        map.setZoom(2);
        $('#display').append('<br><strong><font color="white">Turn location on for your device</font></strong><br><a href="https://support.google.com/accounts/answer/3467281?hl=en">[CLICK]</a>');
    }

    // inicijalizacija API url adrese 
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
        params = 'll=' + ll + '&query=' + tip_pretrage + '&radius=' + radijus + '&limit=' + limit + '&venuePhotos=1&openNow=1' + sortiranje;
        key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20140626';
        url = base_url + endpoint + params + key;
        GenerateVenues();
    }

    // Generisanje 10 markera u zadatom radijusu po udaljenosti.
    function GenerateVenues(){
        $.get(url, function (result) {
            //$('#display').text(JSON.stringify(url));
            mesta = result.response.groups[0].items;  // groups[0] zato sto su lose napravili json format, pa taj objekat ima nekako 2 niza gde je drugi prazan, a prvi sadrzi informacije
            $('#display').append('<table><tbody><tr class="opisi"><td class="broj">No.</td><td class="slika_td">Picture</td><td>Name</td><td class="distance">Distance</td></tr>');
            for (var i in mesta){
                i++;
                broj = i;
                i--;
                str =  '<tr class="hover_tr" onclick="calcRoute(markers['+i+'].getPosition(),'+i+');" id='+i+'>';
                str += '<td class="broj">' + broj + '</td>';
                str += '<td class="slika_td"><img width="80px" height="80px" src="https://igx.4sqi.net/img/general/300x300' + mesta[i].venue.photos.groups[0].items[0].suffix + '" /></td>';
                str += '<td class="opis_td"><div class="opis_liste">'+mesta[i].venue.name+'</div><a href="#" onclick="DisplayDetails(\'' + mesta[i].venue.id + '\',\''+mesta[i].venue.name+'\',\'' +mesta[i].venue.price.tier+'\',\''+mesta[i].venue.location.distance+'\')"><div class="dugme2">Details</div></a></td>';
                str += '<td class="distance">' + mesta[i].venue.location.distance + '</td>';
                str += '</tr>';
                $('#display table tbody').append(str);
                markers[i] = new google.maps.Marker({
                    position: new google.maps.LatLng(mesta[i].venue.location.lat,mesta[i].venue.location.lng),
                    animation: google.maps.Animation.DROP,
                    title: mesta[i].venue.name,
                    map: map
                });
                markers[i].index = i;
                contents[i] = '<div class="popup_container">'+mesta[i].venue.name+'</div>';

                infowindows[i] = new google.maps.InfoWindow({
                    content: contents[i],
                    maxWidth: 300
                });
                google.maps.event.addListener(markers[i], 'click', function() {
                    calcRoute(markers[this.index].getPosition(),this.index);
                });      
            }
            $('#display').append('</table></tbody>');

            document.getElementById('initialization').style.display = 'none';
            
        });
    }
}

// Funkciji se prosledjuje vrednost po cemu se sortira 1-distanca, 2-cena low, 3-cena medium, 4-cena high, 5-cena very high
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
                        <input type="radio" class="priceradio" id="c-option" name="PriceRadio" checked >
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
        document.getElementById("fs").style.background = null;
        document.getElementById("fs").style.borderBottom = null;
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
    document.getElementById('about_page').style.display = 'none';
    Globalna();
}

// funkcija za iscrtavanje rute izmedju trenutne lokacija i selektovanog cafea
function calcRoute(v1,v2) {
    var start = pozicija_korisnika;
    var end = v1;
    var bounds = new google.maps.LatLngBounds();
    bounds.extend(start);
    bounds.extend(end);
    map.fitBounds(bounds);
    var request = {
        origin: start,
        destination: end,
        travelMode: google.maps.TravelMode.WALKING
    };
    directionsService = new google.maps.DirectionsService()
    directionsService.route(request, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            directionsDisplay.setMap(map);
            for (var i in infowindows){
                infowindows[i].close();
            }
            infowindows[v2].open(map,markers[v2]);
            document.getElementById(Index_id).style.background = null;
            document.getElementById(Index_id).style.height = null;
            document.getElementById(v2).style.background = '#37b95f';
            document.getElementById(v2).style.height = '140px';
            Index_id = v2;
        } else {
            alert("Directions Request from " + start.toUrlValue(6) + " to " + end.toUrlValue(6) + " failed: " + status);
        }
    });
}