﻿import {useSession} from "next-auth/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {documentService, QueryDocumentParams} from "@/services/document/document-service";
import {setAuth} from "@/lib/axios";
import {useToast} from "@/hooks/use-toast";

export const useQueryDocumentById = (documentId: number) => {
    const {data: session} = useSession();
    const {toast} = useToast();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async ({query}: QueryDocumentParams) => {
            setAuth(session?.accessToken ?? "");
            return await documentService.queryDocumentById(query, documentId);
        },
        onSuccess: async (data) => {
            await queryClient.invalidateQueries({ queryKey: ["user-profile"]});
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: "Error occurred when querying document",
                description: `Failed to query document, ${error.message}`
            });
        }
    })
    
    return {
        queryDocument: mutation.mutateAsync,
        isQuerying: mutation.isPending,
        isError: mutation.isError,
        isSuccess: mutation.isSuccess
    }
}