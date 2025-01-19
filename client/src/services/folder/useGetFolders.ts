import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {setAuth} from "@/lib/axios";
import {folderService} from "@/services/folder/folder-service";

export const useGetFolders = () => {
    const { data: session } = useSession();
    
    const query = useQuery({
        queryKey: ['folders'],
        queryFn: async () => {
            console.log("Fetching folders");
            setAuth(session?.accessToken ?? "");
            return await folderService.getFolders();
        },
        staleTime: Infinity
    })
    
    return {
        folders: query.data?.data,
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        isPending: query.isPending
    }
}