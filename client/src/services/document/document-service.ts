import {axiosInstance} from "@/lib/axios"

export type UploadDocumentParams = {
    file: File,
    folderId: number | null
}

export type QueryDocumentParams = {
    query: string,
}

export type DocumentById = {
    name: string,
    presignedUrl: string,
    folderId: number,
    userId: string,
    messages: MessageById[]
}

export type MessageById = {
    content: string,
    role: string
}

export type QueryResponse = {
    content: string,
    citations: Citation[]
}

export type Citation = {
    description: string,
    pageNumber: number
}

export type Documents = {
    documentId: number,
    documentName: string,
    folderId: number | null,
    folderName: string | null,
    folderDescription: string | null,
}

export type UpdateDocumentParams = {
    documentName: string
}

export const documentService = {
    uploadDocument: async ({file, folderId} : UploadDocumentParams) => {
        const formData = new FormData();
        formData.append("File", file);
        if (folderId) {
            formData.append("FolderId", folderId.toString());
        }
        
        return axiosInstance.post<number>("/documents?", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
    },
    getDocumentById: async (id: number) => {
        return axiosInstance.get<DocumentById>(`/documents/${id}`);
    },
    getDocuments: async () => {
        return axiosInstance.get<Documents[]>(`/documents`);
    },
    queryDocumentById: async (query: string, documentId: number) => {
        return axiosInstance.post<QueryResponse>(`/documents/${documentId}/query`,
            {
                query
            },
            {
                headers: {
                    "Content-Type": "application/json",
                }
            })
    },
    updateDocumentById: async (id: number, {documentName}: UpdateDocumentParams) => {
        return axiosInstance.put(`/documents/${id}`, {
            documentName: documentName
        }, {
            headers: {
                "Content-Type": "application/json",
            }
        });
    },
    deleleDocumentById: async (id: number) => {
        return axiosInstance.delete(`/documents/${id}`);
    }
}