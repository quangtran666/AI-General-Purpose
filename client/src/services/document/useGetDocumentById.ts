import {useSession} from "next-auth/react";
import {useQuery} from "@tanstack/react-query";
import {documentService} from "@/services/document/document-service";
import {setAuth} from "@/lib/axios";

export const useGetDocumentById = (id: number) => {
    const {data: session} = useSession();

    const query = useQuery({
        queryKey: ["document", id],
        queryFn: async () => {
            setAuth(session?.accessToken ?? "");
            return await documentService.getDocumentById(id)
        },
        staleTime: Infinity
    });
    
    return {
        isLoading: query.isLoading,
        isError: query.isError,
        data: query.data?.data
    }
}