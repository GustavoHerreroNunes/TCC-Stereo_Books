var app = {

    //Referência para o bucket do Storage
    storage: firebase.storage(),

    //Array com os arquivos enviados
    filesSended: [],

    //Número de arquivos recebidos no html
    filesHTML: 0,

    //Número de arquivos enviados para o firebase
    filesFirebase: 0,

    //URLs para os arquivos enviados
    urls: {
        capa: null,
        pdf: null
    },

    //Construtor do app
    initialize: function() {
        console.info("Iniciando...");
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    //Quando todas as estruturas cordova tiverem inicializado
    onDeviceReady: function() {
        console.info("Device Ready");
        document.getElementById("btnCadastrar").addEventListener('click', app.cadastrarLivro);
    },

    //Método para fazer todas as operções de cadastro do registro e upload dos arquivos
    cadastrarLivro: function(){
        var bookCapa = document.getElementById("fileCapaLivro");
        var bookPDF = document.getElementById("filePDFLivro");
        
        app.upload(bookCapa, "capa");
        app.upload(bookPDF, "pdf");
        
        var intervalIdUploadFiles = null;
        intervalIdUploadFiles = setInterval( () => {

            if(app.urls.capa != null && app.urls.pdf != null){
                console.log("Arquivos enviados");

                app.cadastrarRegist();

                clearInterval(intervalIdUploadFiles);
            }
        }
        ,10);

    },

    //Cria um objeto file e envia o arquivo para o storage
    upload: function(files, type){
        try{    
            var filesBtnCarregar = files;

            console.log(filesBtnCarregar.files.length);

            app.filesHTML = filesBtnCarregar.files.length;
    
            for(var i = 0; i< app.filesHTML; i++){
                app.filesSended[i] = filesBtnCarregar.files[i];
    
                console.log( (i+1) + "º arquivo: " + app.filesSended[i].name);
            }

        }catch(error){
            console.log("Erro ao criar objeto file: " + error);
        }


        try{
            let registTitulo = document.getElementById("txbTitulo").value;
            let pathTitle = registTitulo.replace(/ /g, "_");

            var refRoot = app.storage.ref().root;
            console.log("Referenciando o root");
    
            var refSounds = refRoot.child('livros/Saraiva/' + pathTitle);
            console.log("Referenciando o \/livros/Saraiva/" + pathTitle);

            app.uploadToFirebase(app.filesSended[app.filesFirebase], refSounds, type);


        }catch(error){
            console.log("Erro enviar arquivos para o Storage: " + error);
        }

    },

     //Envia os arquivos para o firebase
     uploadToFirebase: function(file, refBook, type){
        var refFiel = refBook.child(file.name);
    
        var uploadTask = refFiel.put(file);
        console.log("Antes do UploadTaks");

        uploadTask.on('state_changed',
            function(snapshot){
            console.log("Uploadtask");

                switch(snapshot.state){
                    case 'paused':
                        console.info("Upload pausado");
                        break;
                    case 'running':
                        console.info("Upload rodando");
                        var progress = parseFloat( ((snapshot.bytesTransferred / snapshot.totalBytes) * 100)).toFixed(1);
                        console.info( (app.filesFirebase+1) + "º Upload em " + progress + " %");
                        break;
                }
            },
            function(error){
                switch(error.code){
                    case 'storage/unauthorized':
                        console.info("Usuário não autorizado");
                        break;
                    case 'storage/canceled':
                        console.info("Upload cancelado");
                        break;
                }
            },
            function(){
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                    console.log("Upload concluído!");
                    console.log("URL para download: " + downloadURL);
                    if(type == "capa"){
                        app.urls.capa = downloadURL;
                    }else if(type == "pdf"){
                        app.urls.pdf = downloadURL;
                    }
                });

                app.filesFirebase++;

                //Se tiverem sido enviados menos arquivos para o firebase do que recebidos no HTML
                if(app.filesFirebase < app.filesHTML){
                    app.uploadToFirebase(app.filesSended[app.filesFirebase], refBook);
                }
            }
        );
    },

    //Cadastra um novo registro na tabela 'livros'
    cadastrarRegist: function() {
        let registTitulo = document.getElementById("txbTitulo").value;
        let registSubtitulo = document.getElementById("txbSubtitulo").value;
        let registAutor = document.getElementById("txbAutor").value;
        let registISBN = document.getElementById("txbISBN").value;
        let registNumPages = document.getElementById("txbNumPages").value;
        let registClassIndicativa = document.getElementById("slctClassIndicativa").value;
        let registSinopse = document.getElementById("txbSinopse").value;
        
        var btnCategoria = document.getElementsByName("btnCategoria");
        var registCategoria = [];
        var positionOnArray = 0;
        for(var i = 0; i < btnCategoria.length; i++){
            if(btnCategoria[i].checked){
                registCategoria[positionOnArray] = btnCategoria[i].value;
                positionOnArray++;
            }
        }

        var db = firebase.firestore();

        console.log("Criando registro");
        console.log("[registTitulo]", registTitulo);
        console.log("[registSubtitulo]", registSubtitulo);
        console.log("[registAutor]", registAutor);
        console.log("[registISBN]", registISBN);
        console.log("[registNumPages]", registNumPages);
        console.log("[registClassIndicativa]", registClassIndicativa);
        console.log("[registCategoria]", registCategoria);
        console.log("[app.urls.capa]", app.urls.capa);
        console.log("[app.urls.pdf]", app.urls.pdf);

        db.collection("livros").add({
            titulo: registTitulo,
            subtitulo: registSubtitulo,
            autor: registAutor,
            isbn: registISBN,
            num_pages: registNumPages,
            classificacao_indicativa: registClassIndicativa,
            sinopse: registSinopse,
            categoria: registCategoria,
            capa: app.urls.capa,
            pdf: app.urls.pdf
        })
        .then( (docRef) => {
            alert("Livro cadastrado com sucesso!");
            window.location.href = "uploadSound.html";
        })
        .catch( (error) => {
            alert("Erro ao cadastrar livro");
            console.info("Erro ao cadastrar documento: " + error);
        });
    }
};

app.initialize();