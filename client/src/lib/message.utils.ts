import {MessageAI} from "@/stores/pdfstore";
import {MessageById, QueryResponse} from "@/services/document/document-service";
import matter from "gray-matter";
import {remark} from "remark";
import html from "remark-html";

export const parseAIMessageAndConvertToHtml = async (message: MessageById) : Promise<MessageAI> => {
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
        })
    }
}

export const convertQueryResponseToHtml = async (queryResponse: QueryResponse) : Promise<MessageAI> => {
    const matterResult = matter(queryResponse.content);
    const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
    
    return {
        content: processedContent.toString(),
        role: "AI",
        citations: queryResponse.citations
    }
}