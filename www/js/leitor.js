var app = {
        
    // Application Constructor

    initialize: function() {
        console.log("Iniciando....");
        document.addEventListener('deviceready', app.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        console.log("Device Ready");
        document.getElementById("btnCadastro").addEventListener("click",app.inserir);  
    },

    inserir: function(){
        var db = firebase.firestore();
        

        let cnome = document.getElementById("txtNome").value;
        let cdatanascimento = document.getElementById("txtDataNascimento").value;
        let cemail = document.getElementById("txtEmail").value;
        let csenha = document.getElementById("txtSenha").value;
       
        

        db.collection("leitores").add({
            Nome: cnome,
            Data_Nascimento: cdatanascimento,
            Email: cemail,
            Senha: csenha
        })
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            var minhaEstanteRef = db.collection("leitores").doc(docRef.id).collection('minha-estante');    

            minhaEstanteRef
                .add({})
                .then(function () {
                    console.log('Minha Estante adicionada');
                    window.location.href = "selecionar-categoria.html?user=" + docRef.id;
                })
                .catch(function (error) {
                    console.error('Erro ao adicionar Minha Estante: ', error);
                });
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });

    }  
};

app.initialize();