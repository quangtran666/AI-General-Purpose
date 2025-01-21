"use client";

import dynamic from "next/dynamic";
import React, {use} from "react";
import PDFInteracionButtons from "./_components/pdf-interaction-buttons";
import PDFMessagesRenderer from "./_components/pdf-messages-renderer";
import PDFInputHandler from "./_components/pdf-input-handler";
import {useGetDocumentById} from "@/services/document/useGetDocumentById";
import Spinner from "@/components/small-components/spinner";
import {usePDFNavigation} from "@/app/chat/documents/[documentId]/_hooks/usePDFNavigation";
import {useMessagesProcessAndScroll} from "@/app/chat/documents/[documentId]/_hooks/useMessagesProcessAndScroll";
import PdfOperations from "@/app/chat/documents/[documentId]/_components/pdf-operations";

const PDFViewer = dynamic(() => import("./_components/pdf-viewer"), {
    ssr: false,
});

function SpecificDocumentChatPage({params}: { params: Promise<{ documentId: string }> }) {
    const {documentId} = use(params);
    const {data, isLoading} = useGetDocumentById(Number(documentId));
    const {scrollToPage, setPageRef} = usePDFNavigation(documentId);
    const {anchorEndMessages} = useMessagesProcessAndScroll(documentId, isLoading, data);

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
                    <PdfOperations 
                        documentId={documentId}
                    />
                </div>
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-white">
                    {isLoading ? <Spinner/> : <PDFMessagesRenderer
                        documentId={documentId}
                        scrollToPage={scrollToPage}
                    />}
                    <div ref={anchorEndMessages}></div>
                </div>
                <div className="flex items-center gap-2 mb-2 mr-4">
                    <PDFInputHandler
                        documentId={documentId}
                    />
                </div>
            </section>
        </div>
    );
}

export default SpecificDocumentChatPage;
