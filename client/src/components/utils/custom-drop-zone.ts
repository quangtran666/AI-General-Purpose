import {useToast} from "@/hooks/use-toast";
import {DropEvent, FileRejection, useDropzone} from "react-dropzone";

interface CustomDropZoneProps {
    maxFiles: number,
    maxSize?: number,
    onDrop: (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => void
} 

function useCustomDropZone ({maxFiles, maxSize = 5 * 1024 * 1024, onDrop} : CustomDropZoneProps) {
    const {getRootProps, getInputProps, isDragActive} = useDropzone(
        {
            onDrop,
            accept: {
                "application/pdf": [".pdf"],
            },
            maxFiles: maxFiles,
            maxSize: maxSize,
        });
    
    return {
        getRootProps,
        getInputProps,
        isDragActive
    }
}

export default useCustomDropZone;