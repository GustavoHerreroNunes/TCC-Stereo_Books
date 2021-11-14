var leitor = {

    initialize: function(){
        console.info("Iniciando...");
        document.addEventListener('deviceready', leitor.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function(){
        console.info("Device Ready");

        "use strict";

        if (!pdfjsLib.getDocument || !pdfjsViewer.PDFPageView) {
        // eslint-disable-next-line no-alert
        alert("Please build the pdfjs-dist library using\n  `gulp dist-install`");
        }

        // The workerSrc property shall be specified.
        //
        pdfjsLib.GlobalWorkerOptions.workerSrc =
        "../node_modules/pdfjs-dist/build/pdf.worker.js";

        // Some PDFs need external cmaps.
        //
        const CMAP_URL = "../node_modules/pdfjs-dist/cmaps/";
        const CMAP_PACKED = true;

        const DEFAULT_URL = "pdf/o_pequeno_principe.pdf";
        const PAGE_TO_VIEW = 1;
        const SCALE = 1.0;

        const ENABLE_XFA = true;

        const container = document.getElementById("pageContainer");

        const eventBus = new pdfjsViewer.EventBus();

        // Loading document.
        const loadingTask = pdfjsLib.getDocument({
        url: DEFAULT_URL,
        cMapUrl: CMAP_URL,
        cMapPacked: CMAP_PACKED,
        enableXfa: ENABLE_XFA,
        });
        loadingTask.promise.then(function (pdfDocument) {
            // Document loaded, retrieving the page.
            console.log("Documento carregado");
        return pdfDocument.getPage(PAGE_TO_VIEW).then(function (pdfPage) {
            // Creating the page view with default parameters.
            console.log("Criando o player do livro");
            const pdfPageView = new pdfjsViewer.PDFPageView({
            container,
            id: PAGE_TO_VIEW,
            scale: SCALE,
            defaultViewport: pdfPage.getViewport({ scale: SCALE }),
            eventBus,
            // We can enable text/annotation/xfa/struct-layers, as needed.
            textLayerFactory: !pdfDocument.isPureXfa
                ? new pdfjsViewer.DefaultTextLayerFactory()
                : null,
            annotationLayerFactory: new pdfjsViewer.DefaultAnnotationLayerFactory(),
            xfaLayerFactory: pdfDocument.isPureXfa
                ? new pdfjsViewer.DefaultXfaLayerFactory()
                : null,
            // structTreeLayerFactory: new pdfjsViewer.DefaultStructTreeLayerFactory(),
            });
            // Associate the actual page with the view, and draw it.
            pdfPageView.setPdfPage(pdfPage);
            return pdfPageView.draw();
        });
        });
    }
}

leitor.initialize();