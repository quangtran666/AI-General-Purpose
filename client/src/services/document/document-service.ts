import { axiosInstance } from "@/lib/axios"

export type UploadDocumentParams = {
    file: File,
    folderId: number | null
}

export const documentService = {
    uploadDocument: async ({file, folderId} : UploadDocumentParams) => {
        const formData = new FormData();
        formData.append("File", file);
        
        return axiosInstance.post<number>("/documents", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
    }
}