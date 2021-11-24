var app = {

    //Referência para o bucket do Storage
    storage: firebase.storage(),

    //Array com os arquivos enviados
    filesSended: [],

    //Número de arquivos recebidos no html
    filesHTML: 0,

    //Número de arquivos enviados para o firebase
    filesFirebase: 0,

    //Construtor do app
    initialize: function(){
        console.info("Iniciando...");
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    //Quando todas as estruturas cordova tiverem inicializado
    onDeviceReady: function(){
        console.info("Device Ready");
        document.getElementById("btnUpload").addEventListener('click', app.upload);
    },

    //Envia os arquivos para o firebase
    uploadToFirebase: function(file, refSounds){
        var refFiel = refSounds.child(file.name);
    
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
                });

                app.filesFirebase++;

                //Se tiverem sido enviados menos arquivos para o firebase do que recebidos no HTML
                if(app.filesFirebase < app.filesHTML){
                    app.uploadToFirebase(app.filesSended[app.filesFirebase], refSounds);
                }
            }
        );
    },

    //Cria um objeto file e envia o arquivo para o storage
    upload: function(){
        try{    
            var filesBtnCarregar = document.getElementById("btnCarregar");

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
            var refRoot = app.storage.ref().root;
            console.log("Referenciando o root");
    
            var refSounds = refRoot.child('sounds');
            console.log("Referenciando o \/sounds");

            app.uploadToFirebase(app.filesSended[app.filesFirebase], refSounds);


        }catch(error){
            console.log("Erro enviar arquivos para o Storage: " + error);
        }

    }
}

app.initialize();