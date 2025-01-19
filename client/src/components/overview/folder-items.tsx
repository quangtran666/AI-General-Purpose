import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {MessageCircleMore} from "lucide-react";
import React from "react";
import useCustomDropZone from "@/components/utils/custom-drop-zone";
import {useToast} from "@/hooks/use-toast";
import {DropEvent, FileRejection} from "react-dropzone";
import {Documents} from "@/services/document/document-service";
import {FolderGroup} from "@/services/common/useGetDocumentsAndFolders";
import {useDocumentUpload} from "@/services/document/useDocumentUpload";
import {useParams} from "next/navigation";

interface FolderItemsProps {
    folderGroup: FolderGroup;
}

function FolderItems({folderGroup}: FolderItemsProps) {
    const {handleDrop, isUploading} = useDocumentUpload(folderGroup.folderId);
    const {getRootProps, getInputProps} = useCustomDropZone({maxFiles: 1, onDrop: handleDrop});
    const {documentId} = useParams();

    return (
        <>
            <Accordion type="single" collapsible>
                <AccordionItem className="border-b-0" value="item-1">
                    <AccordionTrigger className="bg-zinc-700 p-2 rounded-lg hover:no-underline">
                        {isUploading ?
                            <>
                                <span className="truncate">Uploading to folder {folderGroup.folderName} ...</span>
                            </>
                            : <span>{folderGroup.folderName}</span>
                        }
                    </AccordionTrigger>
                    <AccordionContent className="mt-1 p-0">
                        <div className="flex flex-col h-full">
                            <Button {...getRootProps()}
                                    className="hover:bg-main_border_color bg-main_border_color border-dashed border-2 text-slate-200">
                                <input {...getInputProps()} />
                                <p>Drop PDFs here</p>
                            </Button>
                        </div>
                        {folderGroup.documents.map((document, index) => (
                            <div className="flex flex-col h-full mt-2" key={index}>
                                <Link
                                    href={`/chat/documents/${document.documentId}`}
                                    className={`flex gap-2 items-center p-2 hover:bg-zinc-700 transition rounded-lg ml-4 
                                                ${documentId && Number(documentId) === document.documentId ? 'bg-zinc-700' : ''}
                                    `}
                                >
                                    <MessageCircleMore className="w-5"/>
                                    <p className="text-sm">{document.documentName}</p>
                                </Link>
                            </div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}

export default FolderItems 