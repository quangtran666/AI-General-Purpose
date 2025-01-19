import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {MessageCircleMore} from "lucide-react";
import React from "react";
import useCustomDropZone from "@/components/utils/custom-drop-zone";
import {useToast} from "@/hooks/use-toast";
import {DropEvent, FileRejection} from "react-dropzone";
import {Documents} from "@/services/document/document-service";

interface FolderItemsProps {
    folderName: string | null;
    documents: Documents[];
}

function FolderItems({folderName, documents}: FolderItemsProps) {
    const {toast} = useToast();

    const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        acceptedFiles.forEach((file: File) => {
            const reader = new FileReader();

            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = () => {
                const binaryStr = reader.result;
                // console.log(binaryStr);
            };

            reader.readAsArrayBuffer(file);
        });

        fileRejections.forEach((fileRejections: FileRejection) => {
            toast({
                variant: "destructive",
                title: "Error occurred when uploading file",
                description: fileRejections.errors.map(message => message.message).join(" ,").toString()
            })
        })
    }

    const {getRootProps, getInputProps} = useCustomDropZone({maxFiles: 3, onDrop});

    return (
        <>
            <Accordion type="single" collapsible>
                <AccordionItem className="border-b-0" value="item-1">
                    <AccordionTrigger className="bg-zinc-700 p-2 rounded-lg hover:no-underline">
                        {folderName}
                    </AccordionTrigger>
                    <AccordionContent className="mt-1 p-0">
                        <div className="flex flex-col h-full">
                            <Button {...getRootProps()}
                                    className="hover:bg-main_border_color bg-main_border_color border-dashed border-2 text-slate-200">
                                <input {...getInputProps()} />
                                <p>Drop PDFs here</p>
                            </Button>
                        </div>
                        {documents.map((document, index) => (
                            <div className="flex flex-col h-full" key={index}>
                                <Link
                                    href={`/chat/documents/${document.documentId}`}
                                    className="flex gap-2 items-center p-2 hover:bg-zinc-700 transition rounded-lg ml-4"
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