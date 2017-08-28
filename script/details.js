var ukljucen = 0;
var currentSlide = 0;
var slideInterval = setInterval(nextSlide,2000);
    
function nextSlide(){
    if(ukljucen==1){ 
        var slides = document.querySelectorAll('#slides .slide');        
        slides[currentSlide].className = 'slide';
        currentSlide = (currentSlide+1)%slides.length;
        slides[currentSlide].className = 'slide showing';
    }
}

function DisplayDetails(id,name,price,distance,tips){
    var slide;

    var id = id;
    var name = name;
    var price = price;
    var distance = distance;
    var tips = tips;

    var client_id1 = 'OZZ0YQOCRCTTEEHRG3HL0IWMKTAJ0KCRPU1WS3O5WVINZI3K';
    var client_secret1 = 'Z11HIZTIKBNALPZXJNFRPAF3XR0U3IJEYYHWIO4SJHY43SNG';
    var base_url1 = 'https://api.foursquare.com/v2/';
    var endpoint1 = 'venues/'+id+'/photos?';

    var params1 = 'limit=10';
    var key1 = '&client_id=' + client_id1 + '&client_secret=' + client_secret1 + '&v=' + '20140626';
    var url1 = base_url1 + endpoint1 + params1 + key1;

    document.getElementById('details_page').style.display = 'block';
    ukljucen = 1;

    PreuzmiSlike();

    function PreuzmiSlike(){
        $.get(url1, function (result) {    
            var slide = result.response.photos.items; 
            $('#details_page').append('<ul id="slides">');
            for (var i in slide){
                if(i==0){
                    $('#details_page ul').append('<li class="slide showing"><img width="100%;" height="400px;" src="https://igx.4sqi.net/img/general/width960'+slide[i].suffix+'"></li>');
                }else{
                    $('#details_page ul').append('<li class="slide"><img width="100%;" height="400px;" src="https://igx.4sqi.net/img/general/width960'+slide[i].suffix+'"></li>');
                }
            }
            $('#details_page').append('</ul>');
            $('#details_page').append('<div class="ict_details">');
                $('#details_page').append('<span>Name:'+name+'</span>');
                $('#details_page').append('<span>Price:'+price+'</span>');
                $('#details_page').append('<span>Price:'+distance+'</span>');
                $('#details_page').append('<span>Tips:'+tips+'</span>');
                $('#details_page').append('<span>Tips:'+tips+'</span>');
            $('#details_page').append('</div>');
            //document.getElementById('initialization').style.display = 'none';
            //
        });
    }
}