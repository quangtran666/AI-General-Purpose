import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {setAuth} from "@/lib/axios";
import {documentService} from "@/services/document/document-service";

export const useGetDocuments = () => {
    const { data: session } = useSession()
    
    const query = useQuery({
        queryKey: ["documents"],
        queryFn: async () => {
            setAuth(session?.accessToken ?? "")
            return await documentService.getDocuments()
        },
        staleTime: Infinity
    })
    
    return {
        data: query.data?.data,
        isLoading: query.isLoading,
        isError: query.isError
    }
}