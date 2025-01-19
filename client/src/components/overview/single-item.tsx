import Link from "next/link";
import {MessageCircleMore} from "lucide-react";
import React from "react";
import {Documents} from "@/services/document/document-service";
import {SimplifiedDocument} from "@/services/common/useGetDocumentsAndFolders";
import {useParams} from "next/navigation";

interface SingleItemProps {
    document: SimplifiedDocument;
}

function SingleItem({ document } : SingleItemProps) {
    const {documentId} = useParams();
    
    return (
        <>
            <div className="flex flex-col h-full">
                <Link href={`/chat/documents/${document.documentId}`}
                      className={`flex gap-2 items-center p-2 hover:bg-zinc-700 transition rounded-lg
                                ${documentId && Number(documentId) === document.documentId ? 'bg-zinc-700' : ''}
                      `}>
                    <MessageCircleMore className="w-5"/>
                    <p className="text-sm">{document.documentName}</p>
                </Link>
            </div>
        </>
    )
}

export default SingleItem