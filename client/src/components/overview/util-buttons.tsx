import React from "react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import NewFolderButton from "./new-folder-button";

function UtilButtons() {
  return (
    <>
      <Button className="bg-leftnav text-white border-1 border-slate-500 p-5">
        <span>
          <Plus />
        </span>
        New Chat
      </Button>
      <NewFolderButton />
    </>
  );
}

export default UtilButtons;
