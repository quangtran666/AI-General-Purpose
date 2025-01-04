import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { FolderOpen } from "lucide-react";
import { Input } from "../ui/input";

function NewFolderButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-leftnav text-white border-1 border-slate-500 p-5">
          <span>
            <FolderOpen />
          </span>
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="my-2">Create your folder</DialogTitle>
          <DialogDescription className="border-1 p-3 rounded-lg">
            Use Folders to
            <ul className="list-disc ml-4">
              <li>Organize your files</li>
              <li>Chat with multiple files at the same time</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <Input placeholder="Folder Name" />
        <Button className="text-white">Ok</Button>
      </DialogContent>
    </Dialog>
  );
}

export default NewFolderButton;
