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
        try{
            leitor.pdfJS.GlobalWorkerOptions.workerSrc = "js/node/pdf.worker.js";
            leitor.initializeBook();
            
            var bookOkIntervalId = null;
            bookOkIntervalId = setInterval( function(){
                if(leitor.book.pages_rendered){
                    document.frmBookState.txbState.value = "read";
                             
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
        }catch(error){
            console.log("Erro ao iniciar app: " + error);
        }
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
                var scale = 1;
                var viewport = page.getViewport({ scale: scale, });
                // Support HiDPI-screens.
                var outputScale = window.devicePixelRatio || 1;

                var context = leitor.player.getContext('2d');

                leitor.player.width = Math.floor(viewport.width * outputScale);
                leitor.player.height = Math.floor(viewport.height * outputScale);
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

                renderTask.promise
                    .then( function(){
                        leitor.book.pages_rendered = true;
                        leitor.book.page_atual = pageToRender;
                        leitor.markPage(pageToRender);
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
    },

    //Método que marca a página em que o usuário está
    markPage(pageNumber){
        leitor.book.page_marked = pageNumber;
    }
}

leitor.initialize();