import {parseAIMessageAndConvertToHtml} from "@/lib/message.utils";
import {MessageUser, usePDFStore} from "@/stores/pdfstore";
import {useEffect, useRef} from "react";
import {DocumentById} from "@/services/document/document-service";

export const useMessagesProcessAndScroll = (documentId: string, isLoading: boolean, data: DocumentById | undefined) => {
    const anchorEndMessages = useRef<HTMLDivElement>(null);
    const {setMessages, messages} = usePDFStore();
    
    const scrollToEndMessages = () => {
        anchorEndMessages?.current?.scrollIntoView({behavior: "smooth"});
    }

    const processMessages = async () => {
        if (!data?.messages) return;

        const processedMessages = await Promise.all(data?.messages.map(async (message) => {
            if (message.role === "AI") {
                return await parseAIMessageAndConvertToHtml(message);
            } else {
                return {content: message.content.slice(1, -1), role: "USER"} as MessageUser;
            }
        }));

        setMessages(documentId, processedMessages);
    }

    const processMessagesThenScrollToEnd = async () => {
        await processMessages();
        scrollToEndMessages();
    }

    useEffect(() => {
        if (!isLoading) {
            processMessagesThenScrollToEnd();
        }
    }, [isLoading])

    useEffect(() => {
        if (!isLoading) {
            scrollToEndMessages();
        }
    }, [messages]);
    
    return {
        anchorEndMessages
    }
}