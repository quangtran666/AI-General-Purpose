"use client";

import dynamic from "next/dynamic";
import React, {use, useCallback, useState} from "react";
import PDFInteracionButtons from "./_components/pdf-interaction-buttons";
import {usePDFStore} from "@/stores/pdfstore";
import PDFMessagesRenderer from "./_components/pdf-messages-renderer";
import PDFInputHandler from "./_components/pdf-input-handler";
import {useGetDocumentById} from "@/services/document/useGetDocumentById";

const PDFViewer = dynamic(() => import("./_components/pdf-viewer"), {
    ssr: false,
});

function SpecificDocumentChatPage({
                                      params,
                                  }: {
    params: Promise<{ documentId: string }>;
}) {
    const {setCurrentPage, getPdfNumPages} = usePDFStore();
    const [pageRefs, setPageRefs] = useState<(HTMLDivElement | null)[]>([]);
    const {documentId} = use(params);
    const {data} = useGetDocumentById(Number(documentId));

    const setPageRef = useCallback(
        (index: number, ref: HTMLDivElement | null) => {
            setPageRefs((prev) => {
                const newRefs = [...prev];
                newRefs[index] = ref;
                return newRefs;
            });
        },
        []
    );

    // Scroll to certain page then set the current page
    const scrollToPage = useCallback(
        (pageNumber: number) => {
            if (pageNumber < 0 || pageNumber > getPdfNumPages(documentId)) return;

            const pageRef = pageRefs[pageNumber];
            pageRef?.scrollIntoView({behavior: "smooth"});
            setCurrentPage(documentId, pageNumber);
        },
        [documentId, getPdfNumPages, pageRefs, setCurrentPage]
    );

    return (
        <div className="flex">
            <section className="w-1/2 border-r-1 border-r-main_border_color h-svh flex flex-col">
                <div className="mx-6 my-2 flex justify-between items-center">
                    <strong className="text-lg text-nowrap truncate">
                        {data?.name}
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
                        presignedUrl={data?.presignedUrl}
                    />
                </div>
            </section>
            <section className="ml-4 flex-1 h-svh flex flex-col">
                <div className="my-2 flex justify-between items-center">
                    <strong className="text-lg text-nowrap">Chat</strong>
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-white">
                    <PDFMessagesRenderer scrollToPage={scrollToPage}/>
                </div>
                <div className="flex items-center gap-2 mb-2 mr-4">
                    <PDFInputHandler documentId={documentId}/>
                </div>
            </section>
        </div>
    );
}

export default SpecificDocumentChatPage;
