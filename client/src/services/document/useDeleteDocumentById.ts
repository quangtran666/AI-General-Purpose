import {useSession} from "next-auth/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {documentService} from "@/services/document/document-service";
import {setAuth} from "@/lib/axios";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

export const useDeleteDocumentById = (id: number) => {
    const { data: session } = useSession();
    const { toast } = useToast();
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: async () => {
            setAuth(session?.accessToken ?? "");
            return await documentService.deleleDocumentById(id);
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ["folders"]});
            await queryClient.invalidateQueries({queryKey: ["documents"]});
            await queryClient.invalidateQueries({queryKey: ["documentsandfolders"]});
            
            toast({
                variant: "default",
                title: "Sucessfully deleted document",
            })
            
            router.replace("/")
        },
        onError: error => {
            toast({
                variant: "destructive",
                title: "Error occurred when delete document",
                description: `Failed to delete document, ${error.message}`
            });
        }
    })
    
    return {
        deleteDocumentById: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    }
}