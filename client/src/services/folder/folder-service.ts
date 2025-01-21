import {axiosInstance} from "@/lib/axios";

export type CreateFolderParams = {
    name: string,
    description: string
}

export type UpdateFolderParams = {
    folderName: string,
    folderDescription: string
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
    },
    deleteFolderById: async (id: number) => {
        return axiosInstance.delete(`/folders/${id}`)
    },
    updateFolderById: async (id: number, folder: UpdateFolderParams) => {
        return axiosInstance.put(`/folders/${id}`,
            {
                FolderName: folder.folderName,
                FolderDescription: folder.folderDescription
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
    }
}