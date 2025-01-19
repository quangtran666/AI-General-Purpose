import {axiosInstance} from "@/lib/axios";

export type CreateFolderParams = {
    name: string,
    description: string
}

export type Folder = {
    folderId: number,
    folderName: string,
    folderDescription: string
}

export const folderService = {
    createFolder: async (folder: CreateFolderParams) => {
        return axiosInstance.post<number>(`/folders`,
            {
                Name: folder.name,
                Description: folder.description
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    },
    getFolders: async () => {
        return axiosInstance.get<Folder[]>(`/folders`)
    }
}