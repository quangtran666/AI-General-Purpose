import {useSession} from "next-auth/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {documentService, UpdateDocumentParams} from "@/services/document/document-service";
import {setAuth} from "@/lib/axios";
import {useToast} from "@/hooks/use-toast";

export const useUpdateDocumentById = (documentId: number) => {
    const { data: session } = useSession();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: async ({id, documentName} : {id: number} & UpdateDocumentParams) => {
            setAuth(session?.accessToken ?? "");
            return await documentService.updateDocumentById(id, {documentName});
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ["folders"]});
            await queryClient.invalidateQueries({queryKey: ["documents"]});
            await queryClient.invalidateQueries({queryKey: ["documentsandfolders"]});
            await queryClient.invalidateQueries({queryKey: ["document", documentId]});

            toast({
                variant: "default",
                title: "Sucessfully updated document",
            })
        },
        onError: error => {
            toast({
                variant: "destructive",
                title: "Error occurred when update document",
                description: `Failed to update document, ${error.message}`
            });
        }
    })
    
    return {
        updateDocumentById: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    }
}