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
        var logged = 0;

        var db = firebase.firestore();
        var collCadastros = db.collection('autores');
        
        collCadastros.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                if(Email == doc.data().Email && Senha == doc.data().Senha) {
                    logged++;
                }
                
            });
            if(logged == 1) {
                alert('Autor logado');
                window.location.href = "../biblioteca.html";
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