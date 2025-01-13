import {useToast} from "@/hooks/use-toast";
import {DropEvent, FileRejection, useDropzone} from "react-dropzone";

interface CustomDropZoneProps {
    maxFiles: number,
    onDrop: (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => void
} 

function useCustomDropZone ({maxFiles, onDrop} : CustomDropZoneProps) {
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