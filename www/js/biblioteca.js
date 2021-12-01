//Classe que representa a tela de biblioteca
var biblioteca = {

    buscarId: 0,

    initialize: function() {
        console.info("Iniciando...");
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        console.info("Device Ready");

        biblioteca.buscar("itemDestaque");
        biblioteca.buscar("itemRecomendado");
        biblioteca.buscar("itemFantasia");

        var intervalIdBuscar = null;
        intervalIdBuscar = setInterval( () => {
            console.log("[buscarId]", biblioteca.buscarId);
            
            if(biblioteca.buscarId == 3){

                biblioteca.initializeCarousel();
                clearInterval(intervalIdBuscar);
            }
        }
        ,10);
    },

    //Método que busca e apresenta os livros do app em uma div
    buscar: function(divId){
        console.log("Busca Iniciada");
        var db = firebase.firestore();
        var collCadastros = db.collection('livros');
        
        collCadastros.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let rowContent = 
                                 "<div class='item'>" +
                                 "  <a href='#modalTeste' data-bs-toggle='modal' data-bs-target='#modalTeste'><img src='" + doc.data().capa + "' style='max-width: 200px;' ></a>" +
                                 "</div>";
                
                document.getElementById(divId).innerHTML += rowContent;
            })
            biblioteca.buscarId++;
        })
        .catch((error) => {
            console.log("Erro ao consultar documento: " + error);
        })
    },

    //Método que inicializa os carroséis 
    initializeCarousel: function(){
        $('.owl-carousel').owlCarousel({
            loop:true,
            margin:10,
            responsiveClass:true,
            responsive:{
                0:{
                    items:4,
                    nav:true
                },
                600:{
                    items:7,
                    nav:false
                },
                1000:{
                    items:10,
                    nav:true,
                    loop:false
                }
            }
        });
    }
 }
 
 biblioteca.initialize();