import React from "react";
import Image from "next/image";
import {SendHorizontal} from "lucide-react";
import {usePDFStore} from "@/stores/pdfstore";

interface PDFMessagesRendererProps {
    scrollToPage: (pageNumber: number) => void;
    documentId: string;
}

// Todo: Refactor this component to use the new design system
function PDFMessagesRenderer({scrollToPage, documentId}: PDFMessagesRendererProps) {
    const {getMessages} = usePDFStore();
    
    return (
        <div className="w-full px-4">
            {getMessages(documentId).map((chat, index) => (
                <div
                    key={index}
                    className={`flex items-start gap-2 my-3 w-full ${
                        chat.role === "USER" ? "justify-end" : "justify-start"
                    }`}
                >
                    {chat.role === "AI" && (
                        <Image
                            src={"/rocket.png"}
                            alt="logo"
                            width={38}
                            height={38}
                            className="flex-shrink-0 object-contain"
                        />
                    )}
                    <div
                        className={`text-sm font-normal space-y-1 ${
                            chat.role === "USER"
                                ? "text-right py-3 px-4 bg-sky-100 rounded-lg max-w-[80%]"
                                : "text-left max-w-[80%]"
                        }`}
                    >
                        <div className="break-words " dangerouslySetInnerHTML={{__html: chat.content}} />
                        {chat.role === "AI" && <p>Trích trong trang: </p>}
                        {chat.role === "AI" &&  
                            chat.citations?.length > 0 &&
                            chat.citations.map((citation, index) => (
                                <div
                                    key={`citation_${index}`}
                                    className="flex items-start gap-2"
                                >
                                    <button 
                                        className="flex-shrink-0" 
                                        onClick={() => scrollToPage(citation.pageNumber - 1)}
                                    >
                                        <SendHorizontal className="w-4 text-sky-500"/>
                                    </button>
                                    <p className="break-words">{citation.description}</p>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default PDFMessagesRenderer;
