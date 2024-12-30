import React from "react";
import { Button } from "../ui/button";
import { FolderOpen, Plus } from "lucide-react";

function UtilButtons() {
  return (
    <>
      <Button className="bg-leftnav text-white border-1 border-slate-500 p-5">
        <span>
          <Plus />
        </span>
        New Chat
      </Button>
      <Button className="bg-leftnav text-white border-1 border-slate-500 p-5">
        <span>
          <FolderOpen />
        </span>
        New Folder
      </Button>
    </>
  );
}

export default UtilButtons;
