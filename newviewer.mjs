if (!pdfjsLib.getDocument || !pdfjsViewer.PDFViewer) {
  // eslint-disable-next-line no-alert
  alert("pdfjs not loaded!");
}
pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.mjs";

const DEFAULT_URL = "/test.pdf";

const ENABLE_XFA = true;
const container = document.getElementById("viewerContainer");

const eventBus = new pdfjsViewer.EventBus();

const pdfLinkService = new pdfjsViewer.PDFLinkService({
  eventBus,
});

const pdfFindController = new pdfjsViewer.PDFFindController({
  eventBus,
  linkService: pdfLinkService,
});

globalThis.eventBus = eventBus;

const pdfViewer = new pdfjsViewer.PDFViewer({
  container,
  eventBus,
  linkService: pdfLinkService,
  findController: pdfFindController,
});
pdfLinkService.setViewer(pdfViewer);

eventBus.on("pagesinit", function () {
  pdfViewer.currentScaleValue = "page-height";
});

const btn = document.querySelector("#search");
btn.addEventListener("click", function () {
  const sel = document.getSelection().toString().trim();
  const ctnt = pdfFindController._pageContents.join("");

  if (ctnt.includes(sel)) {
    eventBus.dispatch("find", { type: "", query: inpt.value });
  } else {
    console.log("Not found");
  }
});
const btn2 = document.querySelector("#search2");
const inpt = document.querySelector("#input");
btn2.addEventListener("click", function () {
  eventBus.dispatch("find", { type: "", query: inpt.value });
});

const loadingTask = pdfjsLib.getDocument({
  url: DEFAULT_URL,
  enableXfa: ENABLE_XFA,
});

const pdfDocument = await loadingTask.promise;
pdfViewer.setDocument(pdfDocument);
pdfLinkService.setDocument(pdfDocument, null);
pdfFindController.setDocument(pdfDocument);

globalThis.pdfFindController = pdfFindController;
