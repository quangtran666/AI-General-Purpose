import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";
import {useDeleteFolderById} from "@/services/folder/useDeleteFolderById";

interface FolderDeleteProps {
    folderId: number;
}

const FolderDelete = ({folderId} : FolderDeleteProps) => {
    const [popOverOpen, setPopOverOpen] = useState(false);
    const {deleteFolderById, isLoading} = useDeleteFolderById();
    
    const handleDeleteFolder = async () => {
        setPopOverOpen(false);
        await deleteFolderById(folderId);
    }
    
    return (
        <AlertDialog open={popOverOpen} onOpenChange={setPopOverOpen}>
            <AlertDialogTrigger disabled={isLoading} asChild>
                <Button
                    className="text-white bg-red-500 p-5"
                >
                    Delete Current Folder
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="space-y-2 mr-4">
                <AlertDialogHeader>
                    <AlertDialogTitle className="my-2">Delete current folder</AlertDialogTitle>
                    <div className="border-1 p-3 rounded-lg text-sm text-gray-300">
                        Click button below to delete current folder
                        <div className="list-disc ml-4">
                            <div>- Double check you are sure you want to delete</div>
                            <div>- Once deleted you cannot recover it</div>
                        </div>
                    </div>
                </AlertDialogHeader>
                <Button
                    onClick={handleDeleteFolder}
                    className="text-white w-full bg-red-500"
                > Delete </Button>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default FolderDelete;