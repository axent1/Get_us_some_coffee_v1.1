// globalne promenljive
var ukljucen = 0;
var currentSlide = 0;
var slideInterval = setInterval(nextSlide,2000);

// funkcija koja vrsi promenu slike na slajderu
function nextSlide(){
    if(ukljucen==1){ 
        var slides = document.querySelectorAll('#slides .slide');        
        slides[currentSlide].className = 'slide';
        currentSlide = (currentSlide+1)%slides.length;
        slides[currentSlide].className = 'slide showing';
    }
}

// funkcija za details stranicu, preuzima parametre i po ID-u trazi 10 slika sa API-a venues/photos
function DisplayDetails(id,name,price,distance,tips){
    var slide;

    var id = id;
    var name = name;
    var price1;
    var distance = distance;
    var tips = tips;

    if(price==1){
        price1 = 'Cheap';
    }else if(price==2){
        price1 = 'Moderate';
    }else if(price==3){
        price1 = 'Expensive';
    }else if(price==4){
        price1 = 'Very Expensive';
    }

    // inicijalizacija API-a
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

    // funkcija za obradu API-a, preuzimanje JSON formata i lepljenje na DIV element slajder i opise
    function PreuzmiSlike(){
        $.get(url1, function (result) {    
            var slide = result.response.photos.items; 
            $('#details_page').append('<br><div class="ict_details"><span>Name:&nbsp;&nbsp;'+name+'</span></div>');
            $('#details_page').append('<div class="ict_details"><span>Price:&nbsp;&nbsp;'+price1+'</span></div>');
            $('#details_page').append('<div class="ict_details"><span>Distance:&nbsp;&nbsp;'+distance+'</span></div>');
            $('#details_page').append('<div class="ict_details"><span>Tips:&nbsp;&nbsp;'+tips+'</span></div>');
            $('#details_page').append('<ul id="slides">');
            for (var i in slide){
                if(i==0){
                    $('#details_page ul').append('<li class="slide showing"><img width="100%;" height="370px;" src="https://igx.4sqi.net/img/general/width960'+slide[i].suffix+'"></li>');
                }else{
                    $('#details_page ul').append('<li class="slide"><img width="100%;" height="370px;" src="https://igx.4sqi.net/img/general/width960'+slide[i].suffix+'"></li>');
                }
            }
            $('#details_page').append('</ul>');
        });
    }
}