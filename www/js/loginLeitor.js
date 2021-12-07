var login = {

    

    initialize: function() {
        console.info("Iniciando...");
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        console.info("Device Ready");
        document.getElementById("btnLogin").addEventListener("click",login.buscar); 
    },

    //Método que busca e apresenta os livros do app em uma div
    buscar: function(){

        console.log("Busca Iniciada");
        var Email = document.getElementById('txtEmail').value;
        var Senha = document.getElementById('txtSenha').value;
        var docId = null;

        var db = firebase.firestore();
        var collCadastros = db.collection('leitores');
        
        collCadastros.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(Email == doc.data().Email && Senha == doc.data().Senha) {
                    docId = doc.id;
                }
                
            });
            if(docId != null) {
                alert('Leitor logado');
                window.location.href = "../biblioteca.html?user=" + docId;
            }else {
                alert('Email ou Senha inválidos')
            }
            
        })
        .catch((error) => {
            console.log("Erro ao realizar o login: " + error);
        })
    },
 }
 
 login.initialize();