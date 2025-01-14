import { axiosInstance } from "@/lib/axios"

export type UploadDocumentParams = {
    file: File,
    folderId: number | null
}

export type Document = {
    name: string,
    presignedUrl: string,
    folderId: number,
    userId: string
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
    }
}