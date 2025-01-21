import {useSession} from "next-auth/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {setAuth} from "@/lib/axios";
import {folderService} from "@/services/folder/folder-service";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

export const useDeleteFolderById = () => {
    const { data: session } = useSession();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const router = useRouter();
    
    const mutation = useMutation({
        mutationFn: async (id: number) => {
            setAuth(session?.accessToken ?? "");
            return await folderService.deleteFolderById(id);
        },
        onSuccess: async (data) => {
            router.replace("/")
            
            await queryClient.invalidateQueries({queryKey: ["folders"]});
            await queryClient.invalidateQueries({queryKey: ["documents"]});
            await queryClient.invalidateQueries({queryKey: ["documentsandfolders"]});

            toast({
                variant: "default",
                title: "Sucessfully delete folder",
            })
        },
        onError: error => {
            toast({
                variant: "destructive",
                title: "Error occurred when delete folder",
                description: `Failed to delete folder, ${error.message}`
            });
        }
    })
    
    return {
        deleteFolderById: mutation.mutateAsync,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
    }
}