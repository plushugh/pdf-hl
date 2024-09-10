import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from "pdfjs-dist";
import "pdfjs-dist/web/pdf_viewer.css";
import {
  EventBus,
  PDFFindController,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer.mjs";
import React, { useCallback, useEffect, useRef } from "react";

// SEE https://github.com/wojtekmaj/react-pdf/tree/main/packages/react-pdf
// GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.mjs`;
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface IProps {
  pdfUrl: string;
  highlightSearch: string;
}

// FIXME: Does not do the search initially
const PDFHL: React.FC<IProps> = ({ pdfUrl, highlightSearch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [eventBusInstance, setEventBusInstance] =
    React.useState<EventBus | null>(null);
  const [pdfDocumentInstance, setPdfDocumentInstance] =
    React.useState<PDFDocumentProxy | null>(null);

  const loadPDFDocument = useCallback(async () => {
    const pdf = await getDocument({ url: pdfUrl }).promise;
    setPdfDocumentInstance(pdf);
    return pdf;
  }, [pdfUrl]);

  useEffect(() => {
    const loadPDF = loadPDFDocument();
    return () => {
      console.info("cleaning up pdf document");
      loadPDF.then((pdf) => {
        pdf.destroy();
      });
    };
  }, [loadPDFDocument]);

  useEffect(() => {
    if (pdfDocumentInstance == null || containerRef.current == null) return;
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

    pdfViewer.setDocument(pdfDocumentInstance);
    pdfLinkService.setDocument(pdfDocumentInstance, null);
    pdfFindController.setDocument(pdfDocumentInstance);

    eventBus.on("pagesinit", function () {
      pdfViewer.currentScaleValue = "page-width";
      setEventBusInstance(eventBus);
    });

    return () => {
      console.info("cleaning up");
      pdfViewer.cleanup();
    };
  }, [pdfDocumentInstance]);

  useEffect(() => {
    eventBusInstance?.dispatch("find", {
      caseSensitive: false,
      findPrevious: undefined,
      highlightAll: true,
      phraseSearch: true,
      query: highlightSearch,
    });
  }, [highlightSearch, eventBusInstance]);

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
      <div>
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
      </div>
    </>
  );
};

// eslint thinks this component name is a constant
// eslint-disable-next-line react-refresh/only-export-components
export default PDFHL;
