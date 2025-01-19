import {useSession} from "next-auth/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {CreateFolderParams, folderService} from "@/services/folder/folder-service";
import {setAuth} from "@/lib/axios";

export const useCreateFolder = () => {
    const { data: session } = useSession();
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: async (folder: CreateFolderParams) => {
            setAuth(session?.accessToken ?? "");
            return await  folderService.createFolder(folder);
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({queryKey: ["folders"]});
            await queryClient.invalidateQueries({queryKey: ["documents"]});
            await queryClient.invalidateQueries({queryKey: ["documentsandfolders"]});
        },
        onError: (error) => {
            console.error(error);
        }
    })
    
    return {
        createFolder: mutation.mutateAsync,
        isCreating: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess
    }
}