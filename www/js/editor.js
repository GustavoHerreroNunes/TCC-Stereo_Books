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

        let crazaosocial = document.getElementById("txtRazaoSocial").value;
        let cnomefantasia = document.getElementById("txtNomeFantasia").value;
        let ccnpj = document.getElementById("txtCNPJ").value;
        let ctelefone = document.getElementById("txtTelefone").value;
        let cemail = document.getElementById("txtEmail").value;
        let csenha = document.getElementById("txtSenha").value;
        

        db.collection("editores").add({
            Razao_Social: crazaosocial,
            Nome_Fantasia: cnomefantasia,
            CNPJ: ccnpj,
            Telefone: ctelefone,
            Email: cemail, 
            Senha: csenha
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            window.location.href = "../estante-editora.html?user=" + docRef.id;
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    }  
};

app.initialize();