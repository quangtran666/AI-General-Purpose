import Link from "next/link";
import {MessageCircleMore} from "lucide-react";
import React from "react";
import {Documents} from "@/services/document/document-service";

interface SingleItemProps {
    document: Documents;
}

function SingleItem({ document } : SingleItemProps) {
    return (
        <>
            <div className="flex flex-col h-full">
                <Link href={`/chat/documents/${document.documentId}`}
                      className="flex gap-2 items-center p-2 hover:bg-zinc-700 transition rounded-lg">
                    <MessageCircleMore className="w-5"/>
                    <p className="text-sm">{document.documentName}</p>
                </Link>
            </div>
        </>
    )
}

export default SingleItem