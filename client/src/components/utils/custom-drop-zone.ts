import {useToast} from "@/hooks/use-toast";
import {DropEvent, FileRejection, useDropzone} from "react-dropzone";

interface CustomDropZoneProps {
    maxFiles: number,
} 

function useCustomDropZone ({maxFiles} : CustomDropZoneProps) {
    const {toast} = useToast();

    const onDrop = (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        acceptedFiles.forEach((file: File) => {
            const reader = new FileReader();

            reader.onabort = () => console.log("file reading was aborted");
            reader.onerror = () => console.log("file reading has failed");
            reader.onload = () => {
                const binaryStr = reader.result;
                console.log(binaryStr);
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

    const {getRootProps, getInputProps, isDragActive} = useDropzone(
        {
            onDrop,
            accept: {
                "application/pdf": [".pdf"],
            },
            maxFiles: maxFiles,
        });
    
    return {
        getRootProps,
        getInputProps,
        isDragActive
    }
}

export default useCustomDropZone;