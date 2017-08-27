    var client_id = 'OZZ0YQOCRCTTEEHRG3HL0IWMKTAJ0KCRPU1WS3O5WVINZI3K';
    var client_secret = 'Z11HIZTIKBNALPZXJNFRPAF3XR0U3IJEYYHWIO4SJHY43SNG';
    var base_url = 'https://api.foursquare.com/v2/';
    var endpoint = 'venues/explore?';

    var params = 'near=Nis, Serbia&query=coffee'; 
    var key = '&client_id=' + client_id + '&client_secret=' + client_secret + '&v=' + '20140626';
    var url = base_url + endpoint + params + key;
    var map;
    var mesto;
    //set up map
    function initMap() {
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: new google.maps.LatLng(43.321421, 21.895247),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
    }
    //generate markers
    $.get(url, function (result) {
        //$('#msg pre').text(JSON.stringify(result));
        var mesta = result.response.groups[0].items;  
        for (var i in mesta){
            mesto = mesta[i];
            var str = '<p><strong>' + mesto.venue.name + '</strong> '; 
            str += '</p>';
            $('#display').append(str);

            // place the a marker on the map
            marker = new google.maps.Marker({
                position: new google.maps.LatLng(mesto.venue.location.lat,mesto.venue.location.lng),
                map: map
            });
        }});
