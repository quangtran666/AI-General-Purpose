import {useSession} from "next-auth/react";
import {useToast} from "@/hooks/use-toast";
import {useMutation} from "@tanstack/react-query";
import {setAuth} from "@/lib/axios";
import {documentService, UploadDocumentParams} from "@/services/document/document-service";
import {DropEvent, FileRejection} from "react-dropzone";
import {useRouter} from "next/navigation";

export const useDocumentUpload = () => {
    const {data: session} = useSession();
    const {toast} = useToast();
    const router = useRouter();

    const mutation = useMutation({
        mutationFn: async ({file, folderId}: UploadDocumentParams) => {
            setAuth(session?.accessToken ?? "");
            return documentService.uploadDocument({file, folderId});
        },
        onSuccess: (data) => {
            router.push(`/chat/documents/${data.data}`)
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Error occurred when uploading file",
                description: "Failed to upload file"
            })
        }
    })

    const handleDrop = (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
        acceptedFiles.forEach( (file) => {
           mutation.mutate({file, folderId: null});
        })

        fileRejections.forEach((fileRejection: FileRejection) => {
            toast({
                variant: "destructive",
                title: "Error occurred when uploading file",
                description: fileRejection.errors.map(message => message.message).join(" ,").toString()
            })
        })
    }

    return {
        handleDrop,
        isUploading: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess
    }
}