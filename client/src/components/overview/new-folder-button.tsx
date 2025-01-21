import React, {useState} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import {Button} from "../ui/button";
import {CloudUpload, FolderOpen} from "lucide-react";
import {Input} from "../ui/input";
import {useCreateFolder} from "@/services/folder/useCreateFolder";
import {GroupResult} from "@/services/common/useGetDocumentsAndFolders";
import {QueryObserverResult, RefetchOptions} from "@tanstack/query-core";


function NewFolderButton() {
    const {createFolder, isCreating} = useCreateFolder();
    const [folderName, setFolderName] = useState("");
    const [folderDescription, setFolderDescription] = useState("");
    const [open, setOpen] = useState(false);

    const handleCreateFolder = async () => {
        setOpen(false);
        await createFolder({
            name: folderName,
            description: folderDescription
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger disabled={isCreating} asChild>
                <Button className="bg-leftnav text-white border-1 border-slate-500 p-5">
                    {isCreating ? (
                        <>
                            <div className="animate-bounce flex gap-2 items-center">
                                <CloudUpload />
                                <span>Creating folder...</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <span>
                                <FolderOpen/>
                            </span>
                            <span>New Folder</span>
                        </>
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="my-2">Create your folder</DialogTitle>
                    <div className="border-1 p-3 rounded-lg text-sm text-gray-300">
                        Use Folders to
                        <div className="list-disc ml-4">
                            <div>- Organize your files</div>
                            <div>- Chat with multiple files at the same time</div>
                        </div>
                    </div>
                </DialogHeader>
                <Input
                    placeholder="Folder name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                />
                <Input
                    placeholder="Folder description"
                    value={folderDescription}
                    onChange={(e) => setFolderDescription(e.target.value)}
                />
                <Button
                    onClick={handleCreateFolder}
                    className="text-white"
                >Create</Button>
            </DialogContent>
        </Dialog>
    );
}

export default NewFolderButton;
