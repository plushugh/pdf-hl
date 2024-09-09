import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import {
  EventBus,
  PDFFindController,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer.mjs";
import React, { useCallback, useEffect, useRef } from "react";

GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;

interface IProps {
  pdfUrl: string;
  highlightSearch: string;
}

const PDFHL: React.FC<IProps> = ({ pdfUrl, highlightSearch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eventBusInstance, setEventBusInstance] =
    React.useState<EventBus | null>(null);

  // const [pdfViewerInstance, setPDFViewerInstance] =
  // React.useState<PDFViewer | null>(null);

  // const [findControllerInstance, setFindControllerInstance] =
  //   React.useState<PDFFindController | null>(null);

  const loadPDF = useCallback(async () => {
    if (containerRef.current == null) return;
    const eventBus = new EventBus();

    const pdfLinkService = new PDFLinkService({
      eventBus,
    });

    const pdfFindController = new PDFFindController({
      eventBus,
      linkService: pdfLinkService,
    });

    const pdfViewer = new PDFViewer({
      container: containerRef.current,
      eventBus,
      linkService: pdfLinkService,
      findController: pdfFindController,
    });

    pdfLinkService.setViewer(pdfViewer);

    const pdf = await getDocument({ url: pdfUrl }).promise;

    pdfViewer.setDocument(pdf);
    pdfLinkService.setDocument(pdf, null);
    pdfFindController.setDocument(pdf);

    eventBus.on("pagesinit", function () {
      pdfViewer.currentScaleValue = "page-width";

      setTimeout(() => {
        eventBus.dispatch("find", {
          caseSensitive: false,
          highlightAll: true,
          phraseSearch: true,
          query: highlightSearch,
        });
      }, 100); // HACK: only accepts a find event after a delay, maybe pagesinit is not the right event
      // globalThis.EB = eventBus; // DEBUG

      setEventBusInstance(eventBus);
      // setPDFViewerInstance(pdfViewer);
      // setFindControllerInstance(pdfFindController);
    });
  }, [pdfUrl, highlightSearch]);

  useEffect(() => {
    const refCopy = containerRef.current;
    loadPDF();
    // TODO: unmount pdf viewer instance correctly, i.e.remounting in strictmode results in page 1 2 3 1 2 3 being rendered twice
    // HACK: not good
    return () => {
      if (refCopy)
        refCopy.innerHTML = '<div class="pdfViewer" id="viewer"></div>';
    };
  }, [loadPDF]);

  return (
    <>
      <button
        style={{
          zIndex: "1000",
          position: "absolute",
          top: "10px",
          left: "10px",
        }}
        onClick={() => {
          eventBusInstance?.dispatch("find", {
            caseSensitive: false,
            findPrevious: undefined,
            highlightAll: true,
            phraseSearch: true,
            query: highlightSearch,
          });
        }}
      >
        Search
      </button>
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          overflow: "auto",
          width: "100%",
          height: "100%",
        }}
      >
        <div className="pdfViewer" id="viewer"></div>
      </div>
    </>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export default PDFHL;
