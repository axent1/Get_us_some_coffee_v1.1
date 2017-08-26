// There are lots of ways to search. See: https://developer.foursquare.com/docs/venues/search
// Try stuff out with the API Exporer: https://developer.foursquare.com/docs/explore
/*
https://api.foursquare.com/v2/venues/search?near=NYU
&oauth_token=3FFPGFHJDBSIFINX045
&v=20140626

*/
var client_id = 'YOUR CLIENT ID HERE';
var client_secret = 'YOUR CLIENT SECRET HERE';
var base_url = 'https://api.foursquare.com/v2/';
var endpoint = 'venues/search?';

var params = 'near=New+York+University'; 
var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20140626';
var url = base_url+endpoint+params+key;

//set up map
var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 16,
      center: new google.maps.LatLng(40.729,-73.996),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

$.get(url, function (result) {
    //$('#msg pre').text(JSON.stringify(url));
    $('#msg pre').text(JSON.stringify(result));
    
    var venues = result.response.venues;
    //printVenues(venues); 
    for (var i in venues){
        var venue = venues[i];       
        // place the a marker on the map
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(venue.location.lat,venue.location.lng),
            map: map
          });
    }});


function printVenues(venuesArr){  
    for (var i in venuesArr){
        var venue = venuesArr[i];
        var str = '<p><strong>' + venue.name + '</strong> ';   
        str += venue.location.lat + ',';
        str += venue.location.lng;
        str += '</p>';
        $('#display').append(str);
    }
}


