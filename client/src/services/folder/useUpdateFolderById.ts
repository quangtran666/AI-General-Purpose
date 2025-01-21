import {useSession} from "next-auth/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {folderService, UpdateFolderParams} from "@/services/folder/folder-service";
import {useToast} from "@/hooks/use-toast";
import {setAuth} from "@/lib/axios";

export const useUpdateFolderById = () => {
    const { data: session } = useSession();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: async ({id, folderName, folderDescription} : {id: number} & UpdateFolderParams) => {
            setAuth(session?.accessToken ?? "");
            return await folderService.updateFolderById(id, {folderName, folderDescription});               
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ["folders"]});
            await queryClient.invalidateQueries({queryKey: ["documents"]});
            await queryClient.invalidateQueries({queryKey: ["documentsandfolders"]});

            toast({
                variant: "default",
                title: "Sucessfully updated folder",
            })
        },
        onError: error => {
            toast({
                variant: "destructive",
                title: "Error occurred when update folder",
                description: `Failed to update folder, ${error.message}`
            });
        }
    })
    
    return {
        updateFolderById: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    }
}