var app = {
        
    // Application Constructor

    initialize: function() {
        console.log("Iniciando....");
        document.addEventListener('deviceready', app.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        console.log("");
        document.getElementById("btnCadastro").addEventListener("click",app.inserir);  
    },

    inserir: function(){
        var db = firebase.firestore();

        let cnomeoficial = document.getElementById("txtNomeOficial").value;
        let cpseudonimo = document.getElementById("txtPseudonimo").value;
        let ccpf = document.getElementById("txtCPF").value;
        let ctelefone = document.getElementById("txtTelefone").value;
        let cemail = document.getElementById("txtEmail").value;
        let csenha = document.getElementById("txtSenha").value;
        

        db.collection("autores").add({
            Nome_Oficial: cnomeoficial,
            Pseudonimo: cpseudonimo,
            CPF: ccpf,
            Telefone: ctelefone,
            Email: cemail, 
            Senha: csenha
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            window.location.href = cordova.file.applicationDirectory + "telas-Cadastro/cadastro-Leitor-1.html";
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    }  
};

app.initialize();