import {usePDFStore} from "@/stores/pdfstore";
import React, {memo} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {DocumentCallback} from "react-pdf/dist/esm/shared/types.js";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {useGetDocumentById} from "@/services/document/useGetDocumentById";
import Spinner from "@/components/small-components/spinner";

if (typeof Promise.withResolvers === "undefined") {
    if (window)
        // @ts-expect-error This does not exist outside of polyfill which this is doing
        window.Promise.withResolvers = function () {
            let resolve, reject;
            const promise = new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            });
            return {promise, resolve, reject};
        };
}

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/legacy/build/pdf.worker.min.mjs",
    import.meta.url
).toString();

interface PDFViewerProps {
    documentId: string;
    setPageRef: (index: number, ref: (HTMLDivElement | null)) => void,
    presignedUrl: string | undefined
}

const PDFViewer = memo(function PDFViewer({documentId, setPageRef, presignedUrl}: PDFViewerProps) {
    const {getZoomLevel, setPdfNumPages, getPdfNumPages} = usePDFStore();

    const OnDocumentLoadSuccess = async ({numPages}: DocumentCallback) => {
        setPdfNumPages(documentId, numPages);
    };

    return (
        <Document
            file={presignedUrl}
            onLoadSuccess={OnDocumentLoadSuccess}
            loading={<Spinner />}
        >
            <div className="flex flex-col items-center">
                {Array.from(new Array(getPdfNumPages(documentId)), (el, index) => (
                    <div
                        ref={el => setPageRef(index, el)}
                        key={`page_${index + 1}`}
                    >
                        <Page
                            pageNumber={index + 1}
                            className="mb-2"
                            scale={getZoomLevel(documentId)}
                            loading="Loading page..."
                            renderTextLayer={true}
                            renderAnnotationLayer={true}
                        />
                    </div>
                ))}
            </div>
        </Document>
    );
});

export default PDFViewer;
