import React, {useEffect, useState} from "react";
import Image from "next/image";
import {SendHorizontal} from "lucide-react";
import {Citation, Document} from "@/services/document/document-service";
import html from 'remark-html';
import {remark} from "remark";
import matter from "gray-matter";

interface PDFMessagesRendererProps {
    scrollToPage: (pageNumber: number) => void;
    document: Document | undefined;
}

interface MessageUser {
    content: string;
    role: "USER";
}

interface MessageAI {
    content: string;
    citations: Citation[];
    role: "AI";
}

// Todo: 
function PDFMessagesRenderer({scrollToPage, document}: PDFMessagesRendererProps) {
    const [chatContents, setChatContents] = useState<(MessageUser | MessageAI)[]>([]);
    
    useEffect(() => {
        const processMessages = async () => {
            if (!document?.messages) return;
            
            const processedMessages = await Promise.all(document?.messages.map(async (message) => {
                if (message.role === "AI") {
                    const parsedContent = JSON.parse(message.content);
                    const matterResult = matter(parsedContent.Content);
                    const processedContent = await remark()
                        .use(html)
                        .process(matterResult.content);

                    return {
                        content: processedContent.toString(),
                        role: "AI",
                        citations: parsedContent.Citations.map((citation: any) => {
                            return {
                                description: citation.Description,
                                pageNumber: citation.PageNumber,
                            };
                        }),
                    } as MessageAI;
                }
                else {
                    return { content: message.content, role: "USER" } as MessageUser;
                }
            }));
            
            setChatContents(processedMessages);
        }
        
        processMessages();
    }, [])
    
    return (
        <>
            {chatContents?.map((chat, index) => (
                <div
                    key={index}
                    className={`flex items-start gap-2 my-3 ${
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
                        className={`text-sm font-normal mr-3 space-y-1 ${
                            chat.role === "USER"
                                ? "text-right py-3 px-2 bg-sky-100 rounded-lg"
                                : "text-left"
                        }`}
                    >
                        <div dangerouslySetInnerHTML={{__html: chat.content}} />
                        {chat.role === "AI" && <p>Trích trong trang: </p>}
                        {chat.role === "AI" &&  
                            chat.citations?.length > 0 &&
                            chat.citations.map((citation, index) => (
                                <div
                                    key={`citation_${index}`}
                                    className="flex items-start gap-2"
                                >
                                    <button onClick={() => scrollToPage(citation.pageNumber - 1)}>
                                        <SendHorizontal className="w-4 text-sky-500"/>
                                    </button>
                                    <p>{citation.description}</p>
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </>
    );
}

export default PDFMessagesRenderer;
