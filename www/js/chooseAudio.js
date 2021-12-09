app = {

    var: {
        count: 1,
        countForm: 1,
        bookId: '',
    },

    //Construtor do app
    initialize: function() {
        console.info("Iniciando...");
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    //Quando todas as estruturas cordova tiverem inicializado
    onDeviceReady: function() {
        console.info("Device Ready");
        app.showData();
        document.getElementById("btnAddNewForm").addEventListener("click", () => (app.createNewForm()));
        document.getElementById("btnSend").addEventListener("click", () => (app.createSubcollection()));
    },

    showData: function() {
        var db = firebase.firestore();
        
        var docRef = db.collection("audios");
    
        docRef.orderBy("titulo").get().then(querySnapshot => {
            querySnapshot.forEach(function (doc) {

                
                const dados = doc.data();
                const key = doc.id;
            
                const title = dados.titulo;
                const creator = dados.creator;
            
                console.log("Key: " + key + " | Title: " + title + " | Creator: " + creator);
        
                let options = "<option value='" + key + "'>" + title + " - " + creator;

                let select = document.getElementById("chooseAudio" + app.var.count);
                select.innerHTML += options;
            })
            .catch(function (err) {
                console.log("Error getting documents: " + err);
            });
        });
    },

    createNewForm: function() {
        app.var.count += 1;

        html = '<div class="form-group">\
            <div class="card-body border border-white-50 rounded mb-2">\
                <div class="" id="form' + app.var.count + '">\
                        <label for="chooseAudio' + app.var.count + '" class="ps-0 pt-3 fs-6 text-secondary form-label">Audios disponiveis:<span class="text-danger">*</span></label>\
                        <select name="chooseudio' + app.var.count + '" id="chooseAudio' + app.var.count + '" class="chooseAudio form-control">\
                            <option selected disabled>Selecione o audio desejado</option>\
                        </select>\
                        <label for="inputPage' + app.var.count + '"class="ps-0 pt-3 fs-6 text-secondary form-label">Em qual página o audio será iniciado:<span class="text-danger">*</span></label>\
                        <input type="number" value="0" min="0" name="inputPage' + app.var.count + '" id="inputPage' + app.var.count + '" placeholder="Número da Página" class="inputPage form-control">\
                    </div>\
                </div>\
            </div>';
        var form = document.getElementById("frmChooseAudio");
        form.innerHTML += html;
        app.showData();
    },

    getBookId: function() {
        var string_url = window.location.href;
        var url = new URL(string_url);
        app.var.bookId = url.searchParams.get("livro");
        console.log("BookId: " + app.var.bookId);
    },

    createSubcollection: function() {
        app.getBookId();

        var db = firebase.firestore();

        var docLivro = db.collection("livros").doc(app.var.bookId).collection("playlist");

        for(app.var.countForm; app.var.countForm<=app.var.count; app.var.countForm++) {
            var audioSelected = document.getElementById("chooseAudio" + app.var.countForm).value;
            var page = document.getElementById("inputPage" + app.var.countForm).value;
            
            console.log("Audio Selected: " + audioSelected + " | Page:" + page);
            
            var docPlaylist = docLivro.doc("play" + app.var.countForm);
    
            docPlaylist.set({
                audio_id: audioSelected,
                pagina: page
            }).
            then((doc) => {
                console.log("Sucesso ao criar subcollection!");
            })
            .catch((err) => {
                console.log("Erro ao criar subcollection: " + err);
            });
        }
    }
};

app.initialize();