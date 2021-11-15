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
        doc: null,
        num_pages: 0,
        page_marked: 1,
        page_atual: 1,
        pages_rendered: false
    },

    initialize: function(){
        console.info("Iniciando...");
        document.addEventListener('deviceready', leitor.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function(){
        console.info("Device Ready");
        leitor.pdfJS.GlobalWorkerOptions.workerSrc = "../node_modules/pdfjs-dist/build/pdf.worker.js";
        leitor.initializeBook();
        
        var bookOkIntervalId = null;
        bookOkIntervalId = setInterval( function(){
            if(leitor.book.pages_rendered){
                console.log("Livro pronto para a leitura");
                         
                //Eventos para trocar de página
                document.getElementById("btnPreviousPage").addEventListener('click', () => {
                    leitor.changePage("previous");
                });
                document.getElementById("btnNextPage").addEventListener('click', () => {
                    leitor.changePage("next");
                });

                clearInterval(bookOkIntervalId);
            }
        }
        ,10);
    },

    //Método que carrega o livro no player
    initializeBook: function(){
        const loadingTask = leitor.pdfJS.getDocument(leitor.book.path);

        loadingTask.promise
            .then( function(doc){
                leitor.book.num_pages = doc.numPages;

                console.log("Número de páginas: " + leitor.book.num_pages);

                leitor.book.doc = doc;

                leitor.renderPage(leitor.book.page_marked);
            })
            .catch( function(error){
                console.error("Erro ao carregar livro: " + error);
            })
    },

    //Método que renderiza a página do livro indicada no parâmetro
    renderPage: function(pageToRender){
        leitor.book.pages_rendered = false;
        
        return leitor.book.doc.getPage(pageToRender)
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

                renderTask.promise
                    .then( function(){
                        leitor.book.pages_rendered = true;
                        leitor.book.page_atual = pageToRender;
                    })
            });
    },

    //Método que troca de página na direção indicada no parâmetro (next ou previous)
    changePage: function(direction){
        var page_to_change = null;

        if(leitor.book.pages_rendered){
            switch(direction){
                case 'next':
                    page_to_change = (leitor.book.page_atual != leitor.book.num_pages) ? (leitor.book.page_atual + 1) : leitor.book.page_atual;
                    break;
                case 'previous':
                    page_to_change = (leitor.book.page_atual != 1) ? (leitor.book.page_atual - 1) : leitor.book.page_atual;
                    break;
                default:
                    console.error("Direção para troca de página não reconhecida");
                    return;
            }

            leitor.renderPage(page_to_change);
        }
    }
}

leitor.initialize();