var app = {

    userId: '',

    initialize: function() {
        console.log("Iniciando....");
        document.addEventListener('deviceready', app.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {
        console.log("Device Ready");
        document.getElementById("btnAvancar").addEventListener("click",app.inserir);
        app.getUserId();
        app.carregar();
    },

    //Método para coletar id do usuário
    getUserId: function(){
        //Captando parâmetro user da url
        var string_url = window.location.href;
        var url = new URL(string_url);
        app.userId = url.searchParams.get("user");
    },

    carregar: function(){
        var db = firebase.firestore();
        
        var collectionCategorias = db.collection('categorias');
        
        var categoriasAdicionadas = 0;
        var rowId = 1;
        var categorias = [
            { id: 0, nome: '', icon: { normal: '', hover: '' } }
        ];
        document.getElementById("categorias").innerHTML = "<div class='row gap-4' id='row." + rowId + "'> </div></br>";
        
        collectionCategorias.get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                categorias.push({ id: 0, nome: '', icon: { normal: '', hover: '' } });
                
                categorias[categoriasAdicionadas].id = doc.id;
                categorias[categoriasAdicionadas].nome = doc.data().nome;
                categorias[categoriasAdicionadas].icon = {
                    normal: doc.data().icon,
                    hover: doc.data().icon_hover
                }

                document.getElementById("row."+rowId).innerHTML += "<div class='col' id='col." + categorias[categoriasAdicionadas].id + "'>"
                                                                    + "<input type='checkbox' class='btn-check' name='btnCategoria' value='" + categorias[categoriasAdicionadas].nome + "' id='" + categorias[categoriasAdicionadas].id + "' autocomplete='off'>"
                                                                    + "<label class='btn btn-outline-primary' for='" + categorias[categoriasAdicionadas].id + "'>"
                                                                        + "<img class='d-grid gap-2 col-10 mx-auto' src='" + categorias[categoriasAdicionadas].icon.normal + "' alt='Stereo Books Logo' />"
                                                                        + categorias[categoriasAdicionadas].nome
                                                                    + "</label>"
                                                                + "</div>";

                categoriasAdicionadas++;
                if((categoriasAdicionadas % 6) == 0){
                    rowId++;
                    document.getElementById("categorias").innerHTML += "<div class='row gap-4' id='row." + rowId + "'></div>";
                }

            });

            console.log('[categorias]', categorias);

            categorias.forEach((categoria) => {
                var nextIcon = categoria.icon.hover;

                document.getElementById(categoria.id).addEventListener("click", function(){
                    console.log("col." + categoria.id + " clicado");
                    document.getElementById("col."+categoria.id).children[1].children[0].src=nextIcon;
                    if(nextIcon == categoria.icon.hover){
                        nextIcon = categoria.icon.normal;
                    }else{
                        nextIcon = categoria.icon.hover;
                    }
                });
            })
        })
        .catch((error) => {
            console.log("Erro ao consultar documento: " + error);
        })
    }, 
    
    inserir: function(){
        console.log("Cadastrando Categorias");

        var db = firebase.firestore();

        var btnCategoria = document.getElementsByName("btnCategoria");
        var registCategoria = [];
        var positionOnArray = 0;
        for(var i = 0; i < btnCategoria.length; i++){
            if(btnCategoria[i].checked){
                registCategoria[positionOnArray] = btnCategoria[i].value;
                positionOnArray++;
            }
        }
        var leitores = db.collection("leitores").doc(app.userId);

        return leitores.update({
            categorias_favoritas: registCategoria
        })
        .then(() => {
            console.log("Document successfully updated!");
            window.location.href = "../biblioteca.html?user=" + app.userId;
        })
        .catch((error) => {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });
    }
};

app.initialize();