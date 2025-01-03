"use client";

import dynamic from "next/dynamic";
import React, { use, useCallback, useState } from "react";
import PDFInteracionButtons from "./_components/pdf-interaction-buttons";
import { usePDFStore } from "@/stores/pdfstore";

const PDFViewer = dynamic(() => import("./_components/pdf-viewer"), {
  ssr: false,
});

function SpecificDocumentChatPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { setCurrentPage, getPdfNumPages } = usePDFStore();
  const [pageRefs, setPageRefs] = useState<(HTMLDivElement | null)[]>([]);
  const { documentId } = use(params);

  const setPageRef = useCallback((index: number, ref: (HTMLDivElement | null)) => {
    setPageRefs(prev => {
      const newRefs = [...prev];
      newRefs[index] = ref;
      return newRefs;
    })
  }, [])

  const scrollToPage = useCallback((pageNumber: number) => {
    if (pageNumber < 0 || pageNumber > getPdfNumPages(documentId)) return;

    const pageRef = pageRefs[pageNumber];
    pageRef?.scrollIntoView({ behavior: "smooth" });
    setCurrentPage(documentId, pageNumber);
  }, [documentId, getPdfNumPages, pageRefs, setCurrentPage])

  return (
    <div className="flex">
      <section className="w-1/2 border-r-1 border-r-main_border_color h-svh flex flex-col">
        <div className="mx-6 my-2 flex justify-between items-center">
          <strong className="text-lg text-nowrap">
            Multilayer-perceptron.pdf
          </strong>
          <PDFInteracionButtons 
            documentId={documentId}
            scrollToPage={scrollToPage}
          />
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-white">
          <PDFViewer 
            documentId={documentId} 
            setPageRef={setPageRef}
          />
        </div>
      </section>
      <div className="flex-1">Chat</div>
    </div>
  );
}

export default SpecificDocumentChatPage;
