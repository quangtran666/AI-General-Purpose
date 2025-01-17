import { axiosInstance } from "@/lib/axios"

export type UploadDocumentParams = {
    file: File,
    folderId: number | null
}

export type QueryDocumentParams = {
    query: string,
}

export type Document = {
    name: string,
    presignedUrl: string,
    folderId: number,
    userId: string,
    messages: Message[]
}

export type Message = {
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

export const documentService = {
    uploadDocument: async ({file, folderId} : UploadDocumentParams) => {
        const formData = new FormData();
        formData.append("File", file);
        
        return axiosInstance.post<number>("/documents?", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
    },
    getDocumentById: async (id: number) => {
        return axiosInstance.get<Document>(`/documents?id=${id}`);
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
    }
}