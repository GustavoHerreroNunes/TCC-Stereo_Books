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
                const viewport = page.getViewport({ scale: 0.8 });
                leitor.player.witdh = viewport.witdh;
                leitor.player.height = viewport.height;

                //Redenrizando a página
                const context = leitor.player.getContext("2d");
                const renderTask = page.render({
                    canvasContext: context,
                    viewport
                });

                return renderTask.promise;
            });
    }
}

leitor.initialize();