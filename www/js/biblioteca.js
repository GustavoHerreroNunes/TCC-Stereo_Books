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
                try{
                    document.querySelectorAll(".item").forEach((element) => {
                        console.log("Adicionando evento ao elemnto: " + element);
                        element.addEventListener("click", () => {
                            biblioteca.changeModalInfos(element);
                        });
                    });

                    document.getElementById("btnVerMais").addEventListener("click", biblioteca.verMais);
                    document.getElementById("btnAdquirir").addEventListener("click", biblioteca.adquirirLivro);

                }catch(error){
                    console.log("Erro ao adicionar evento: " + error);
                }

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
                                             "<div class='item' data-book-id='" + doc.id + "'>" +
                                             "  <a href='#modalTeste' data-bs-toggle='modal' data-bs-target='#modalTeste'><img src='" + doc.data().capa + "' style='max-width: 200px;' ></a>" +
                                             "</div>";
                            
                            document.getElementById(divId).innerHTML += rowContent;
                        }
                    }else{
                        if(categ == categoriaName && booksSearched < booksToSearch){
                            booksSearched++;
                            let rowContent = 
                                             "<div class='item' data-book-id='" + doc.id + "'>" +
                                             "  <a href='#modalTeste' data-bs-toggle='modal' data-bs-target='#modalTeste'><img src='" + doc.data().capa + "' style='max-width: 200px;' ></a>" +
                                             "</div>";
                            
                            document.getElementById(divId).innerHTML += rowContent;
                        }
                    }
                });
                
            })
            biblioteca.buscarId++;
            console.log("Alô?");
        })
        .catch((error) => {
            console.log("Erro ao consultar documento: " + error);
        })
    },

    //Método que altera as informações do modal de acordo com o livro
    changeModalInfos: function(element){
        console.log("Mudando modal");
        var bookId = element.getAttribute("data-book-id");

        var db = firebase.firestore();
        var bookRef = db.collection("livros").doc(bookId);

        bookRef.get().then((doc) => {
            if (doc.exists) {
                document.getElementById("pontos").style.display="inline";
                document.getElementById("btnVerMais").innerHTML= "Ver mais";
                document.getElementById("txtVerMais").style.display= "none";

                var titulo = doc.data().titulo,
                    subtitulo = doc.data().subtitulo,
                    sinopse = doc.data().sinopse,
                    autor = doc.data().autor,
                    capa = doc.data().capa,
                    url = doc.data().pdf,
                    id = doc.id;
                
                document.getElementById("card-titulo").innerHTML = titulo;
                document.getElementById("card-subtitulo").innerHTML = subtitulo;
                document.getElementById("card-autor").innerHTML = autor;
                document.getElementById("card-capa").setAttribute("src", capa);
                if(sinopse.length > 180){
                    var firstPart = sinopse.substr(0, 180);
                    var secondPart = sinopse.substr(180);
                    document.getElementById("card-sinopse").innerHTML = firstPart;
                    document.getElementById("txtVerMais").innerHTML = secondPart;
                }else{
                    document.getElementById("card-sinopse").innerHTML = sinopse;
                }
                document.frmBookData.txbBookId.value = id;
                document.frmBookData.txbBookUrl.value = url;
                biblioteca.generateDownloadURL(url);
                // document.getElementById("linkToDownload").href = url;
                // document.getElementById("imgToDownload").src = url;

            } else {
                console.log("Livro não cadastrado");
                window.location.href = window.location.href;
            }
        }).catch((error) => {
            console.log("Erro ao buscar categorias do usuário: " + error);
        });
    },

    generateDownloadURL: function(url){
        var storage = firebase.storage();

        storage.refFromURL(url).getDownloadURL().then(function(urlToDownload) {          
            // Or inserted into an <img> element:
            document.getElementById("imgToDownload").src = urlToDownload;

          }).catch(function(error) {
            // Handle any errors
          });
    },

    //Método para o botão de ver mais
    verMais: function(){
        var ponto= document.getElementById("pontos");
           var btn= document.getElementById("btnVerMais");
           var texto= document.getElementById("txtVerMais");

           if(ponto.style.display=== "none"){
              ponto.style.display="inline";
              btn.innerHTML= "Ver mais";
              texto.style.display= "none";
           }
           else{
              ponto.style.display="none";
              btn.innerHTML= "Ver menos";
              texto.style.display= "inline"
           }
    },

    //Método que faz os procedimentos para a aquisição do livro
    adquirirLivro: function(){
        var url = document.frmBookData.txbBookUrl,
            id = document.frmBookData.txbBookId;
        // var intervalIdDownload = null;
        // intervalIdDownload = setInterval( () => {
        //     console.log("[buscarId]", biblioteca.buscarId);
            
        //     if(biblioteca.buscarId > biblioteca.categorias_leitor.num){

        //         try{
        //             document.querySelectorAll(".item").forEach((element) => {
        //                 console.log("Adicionando evento ao elemnto: " + element);
        //                 element.addEventListener("click", () => {
        //                     biblioteca.changeModalInfos(element);
        //                 });
        //             });

        //             document.getElementById("btnVerMais").addEventListener("click", biblioteca.verMais);
        //             document.getElementById("btnAdquirir").addEventListener("click", biblioteca.adquirirLivro);

        //         }catch(error){
        //             console.log("Erro ao adicionar evento: " + error);
        //         }

        //         biblioteca.initializeCarousel();
        //         clearInterval(intervalIdBuscar);
        //     }
        // });
        
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