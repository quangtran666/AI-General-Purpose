import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";
import useCustomDropZone from "@/components/utils/custom-drop-zone";
import {useToast} from "@/hooks/use-toast";
import {DropEvent, FileRejection} from "react-dropzone";
import {useSession} from "next-auth/react";
import axios from "axios";

function NewChat() {
    const { toast } = useToast();
    const { data: session } = useSession();
    
    const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        acceptedFiles.forEach((file: File) => {
            const formData = new FormData();
            formData.append("File", file);
            
            axios.post("https://localhost:5051/api/documents", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${session?.accessToken}`
                }
            }).then(x => console.log(x.data)).catch(x => console.error(x));
            
            // const reader = new FileReader();
            //
            // reader.onabort = () => console.log("file reading was aborted");
            // reader.onerror = () => console.log("file reading has failed");
            // reader.onload = () => {
            //     const binaryStr = reader.result;
            //     // console.log(binaryStr);
            // };
            //
            // reader.readAsArrayBuffer(file);
        });

        fileRejections.forEach((fileRejections: FileRejection) => {
            toast({
                variant: "destructive",
                title: "Error occurred when uploading file",
                description: fileRejections.errors.map(message => message.message).join(" ,").toString()
            })
        })
    }
    
    const {getRootProps, getInputProps} = useCustomDropZone({maxFiles: 1, onDrop});
    
    return (
        <Button {...getRootProps()} className="bg-leftnav text-white border-1 border-slate-500 p-5">
            <input
                {...getInputProps()}
            />
            <span>
                    <Plus/>
                </span>
            New Chat
        </Button>
    )
}

export default NewChat;