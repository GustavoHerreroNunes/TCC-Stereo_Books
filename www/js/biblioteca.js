//Classe que representa a tela de biblioteca
var biblioteca = {

    //Id do usuário logado
    userId: '',

    //Número de divs de livros carregadas
    buscarId: 0,

    //Categorias favoritadas pelo leitor
    categorias_leitor: {
        num: null,
        names: [],
    },

    initialize: function() {
        console.info("Iniciando...");
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        console.info("Device Ready");

        biblioteca.getUserId();

        biblioteca.buscarCategoriasLeitor();

        var intervalIdBuscar = null;
        intervalIdBuscar = setInterval( () => {
            console.log("[buscarId]", biblioteca.buscarId);
            
            if(biblioteca.buscarId > biblioteca.categorias_leitor.num){

                biblioteca.initializeCarousel();
                clearInterval(intervalIdBuscar);
            }
        }
        ,10);
    },

    //Método para coletar id do usuário
    getUserId: function(){
        //Captando parâmetro user da url
        var string_url = window.location.href;
        var url = new URL(string_url);
        biblioteca.userId = url.searchParams.get("user");
    },

    //Método que busca as categorias cadastradas como preferias pelo leitor e cria as divs necessárias
    buscarCategoriasLeitor: function() {
        console.log("Busca de categorias iniciada");
        var db = firebase.firestore();
        var leitorRef = db.collection("leitores").doc(biblioteca.userId);

        leitorRef.get().then((doc) => {
            if (doc.exists) {
                biblioteca.categorias_leitor.num = 0;
                doc.data().categorias_favoritas.forEach((categoria) => {
                    biblioteca.categorias_leitor.names[biblioteca.categorias_leitor.num] = categoria;
                    biblioteca.categorias_leitor.num++;

                    document.getElementById("carouselBooks").innerHTML += "<div class='container'>"
                                                                                + "<h5>" + categoria + "</h5>"
                                                                                + "<div class='row'>"
                                                                                    + "<div class='owl-carousel owl-theme' id='carousel" + categoria + "'>"
                                                                                    + "</div>"
                                                                                + "</div>"
                                                                        + "</div>";
                });
                biblioteca.fillCarousel();
            } else {
                console.log("Usuário não cadastrado");
                window.location.href = "index.html";
            }
        }).catch((error) => {
            console.log("Erro ao buscar categorias do usuário: " + error);
        });
    },
    
    //Método que apresenta todos os livros que se enquadram nas categorias favoritas
    fillCarousel: function(){
        console.log("Preenchimento dos carrosséis");
        biblioteca.categorias_leitor.names.forEach((categoriaName) => {
            biblioteca.buscarLivros("carouselRecomendado", categoriaName, "recomendado");
            biblioteca.buscarLivros("carousel"+categoriaName, categoriaName, "all");
        })
    },

    //Método que busca e apresenta os livros do app em uma div
    buscarLivros: function(divId, categoriaName, typeSearch){
        console.log("Busca de livros iniciada");
        var booksToSearch = (typeSearch == "recomendado") ? 2 : "all";
        var booksSearched = 0;

        var db = firebase.firestore();
        var collCadastros = db.collection('livros');
        
        collCadastros.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.data().categoria.forEach((categ) => {
                    if(booksToSearch == "all"){
                        if(categ == categoriaName){
                            let rowContent = 
                                             "<div class='item'>" +
                                             "  <a href='#modalTeste' data-bs-toggle='modal' data-bs-target='#modalTeste'><img src='" + doc.data().capa + "' style='max-width: 200px;' ></a>" +
                                             "</div>";
                            
                            document.getElementById(divId).innerHTML += rowContent;
                        }
                    }else{
                        if(categ == categoriaName && booksSearched < booksToSearch){
                            booksSearched++;
                            let rowContent = 
                                             "<div class='item'>" +
                                             "  <a href='#modalTeste' data-bs-toggle='modal' data-bs-target='#modalTeste'><img src='" + doc.data().capa + "' style='max-width: 200px;' ></a>" +
                                             "</div>";
                            
                            document.getElementById(divId).innerHTML += rowContent;
                        }
                    }
                });
                
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