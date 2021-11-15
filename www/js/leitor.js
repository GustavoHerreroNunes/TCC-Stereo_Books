//Classe com as funcionalidades do player de livros
var leitor = {

    //Objeto que representa a bilioteca "PDF.js"
    pdfJS: pdfjsLib,

    //Elemento HTML que representa o player de livro
    player: document.getElementById("playerBook"),

    //Objeto que representa o livro selecionado
    book: {
        title: "O Pequeno Príncipe",
        sub_title: "",
        author: "Antoine de Saint-Exupéry",
        editora_name: "",
        path: "pdf/o_pequeno_principe.pdf",
        num_pages: 0,
    },

    initialize: function(){
        console.info("Iniciando...");
        document.addEventListener('deviceready', leitor.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function(){
        console.info("Device Ready");
        leitor.pdfJS.GlobalWorkerOptions.workerSrc = "../node_modules/pdfjs-dist/build/pdf.worker.js";
        leitor.initializeBook();
    },

    //Método que carrega o livro no player
    initializeBook: function(){
        const loadingTask = leitor.pdfJS.getDocument(leitor.book.path);

        loadingTask.promise
            .then( function(doc){
                leitor.book.num_pages = doc.numPages;
                leitor.renderPage(doc, 1);
            })
            .catch( function(error){
                console.error("Erro ao carregar livro: " + error);
            })
    },

    //Método que renderiza a página do livro
    renderPage: function(doc, pageToRender){
        
        return doc.getPage(pageToRender)
            .then( function(page){
                
                //Definindo as dimensões do player
                var scale = 10;
                var viewport = page.getViewport({ scale: scale, });
                // Support HiDPI-screens.
                var outputScale = window.devicePixelRatio || 1;

                var context = leitor.player.getContext('2d');

                leitor.player.width = Math.floor(viewport.width * outputScale);
                leitor.player.height = Math.floor(viewport.height * outputScale);
                // leitor.player.style.width = Math.floor(viewport.width) + "px";
                // leitor.player.style.height =  Math.floor(viewport.height) + "px";
                leitor.player.style.width = "100%";
                leitor.player.style.height =  "100%";

                var transform = outputScale !== 1
                ? [outputScale, 0, 0, outputScale, 0, 0]
                : null;

                var renderContext = {
                canvasContext: context,
                transform: transform,
                viewport: viewport
                };
                
                var renderTask = page.render(renderContext);
            });
    }
}

leitor.initialize();