import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useGetDocuments} from "@/services/document/useGetDocuments";
import {useGetFolders} from "@/services/folder/useGetFolders";
import {Folder} from "@/services/folder/folder-service";
import {Documents} from "@/services/document/document-service";

export const useGetDocumentsAndFolders = () => {
    const { isLoading: loadingDocuments } = useGetDocuments();
    const { isLoading: loadingFolders } = useGetFolders();
    const queryClient = useQueryClient();
    
    const query = useQuery({
        queryKey: ['documentsandfolders'],
        queryFn: async () => {
            // That ugly code is a workaround for the issue with stale data
            const documents = queryClient.getQueryState(["documents"])?.data?.data as Documents[];
            const folders = queryClient.getQueryState(["folders"])?.data?.data as Folder[];
            const groupByFolderIdResult = groupByFolderId(folders, documents);
            return groupByFolderIdResult;
        },
        staleTime: Infinity,
        enabled: !loadingDocuments && !loadingFolders,
    })
    
    return {
        groupResult: query.data,
        isLoading: query.isLoading,
        isError: query.isError,
    }
}

export type SimplifiedDocument = {
    documentId: number;
    documentName: string;
}

export type FolderGroup = {
    folderId?: number;
    folderName?: string;
    folderDescription?: string;
    documents: SimplifiedDocument[];
}

export type GroupResult = {
    noFolder: FolderGroup;
    [key: number]: FolderGroup;
}

const groupByFolderId = (folders: Folder[] | undefined, documents: Documents[] | undefined) => {
    const result: GroupResult = {
        noFolder: {
            documents: []
        }
    }
    
    if (!folders || !documents) {
        throw new Error("Folders or documents are not provided");
    }
    
    folders?.forEach(folder => {
        result[folder.folderId] = {
            folderId: folder.folderId,
            folderName: folder.folderName,
            folderDescription: folder.folderDescription,
            documents: []
        }
    })
    
    documents?.forEach(document => {
        if (document.folderId === null) {
            result.noFolder.documents.push({
                documentId: document.documentId,
                documentName: document.documentName
            })
        } else {
            result[document.folderId].documents.push({
                documentId: document.documentId,
                documentName: document.documentName
            })
        }
    })
    
    return result;
}