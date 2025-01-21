import React, {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {useUpdateFolderById} from "@/services/folder/useUpdateFolderById";

interface FolderUpdateProps {
    folderId: number;
    folderName: string;
    folderDescription: string;
}

const FolderUpdate = ({folderId, folderName, folderDescription} : FolderUpdateProps) => {
    const [inputFolderName, setInputFolderName] = useState(folderName);
    const [inputFolderDescription, setInputFolderDescription] = useState(folderDescription);
    const [popOverOpen, setPopOverOpen] = useState(false);
    const {updateFolderById, isLoading} = useUpdateFolderById();

    const handleUpdateFolder = async () => {
        setPopOverOpen(false);
        await updateFolderById({id: folderId, folderName: inputFolderName, folderDescription: inputFolderDescription});
    }

    return (
        <Dialog open={popOverOpen} onOpenChange={setPopOverOpen}>
            <DialogTrigger disabled={isLoading} asChild>
                <Button className="bg-leftnav text-white border-1 border-slate-500 p-5">
                    Update Current Folder
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="my-2">Update current folder</DialogTitle>
                </DialogHeader>
                <Input
                    placeholder="Folder name"
                    value={inputFolderName}
                    onChange={(e) => setInputFolderName(e.target.value)}
                />
                <Input
                    placeholder="Folder description"
                    value={inputFolderDescription}
                    onChange={(e) => setInputFolderDescription(e.target.value)}
                />
                <Button
                    onClick={handleUpdateFolder}
                    className="text-white"
                >Update</Button>
            </DialogContent>
        </Dialog>
    )
}

export default FolderUpdate;