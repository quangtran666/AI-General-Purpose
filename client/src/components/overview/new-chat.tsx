import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";
import useCustomDropZone from "@/components/utils/custom-drop-zone";

function NewChat() {
    const {getRootProps, getInputProps} = useCustomDropZone({maxFiles: 1});
    
    return (
        <Button {...getRootProps()} className="bg-leftnav text-white border-1 border-slate-500 p-5">
            <input
                {...getInputProps()}
            />
            <span>
                    <Plus/>
                </span>
            New Chat
        </Button>
    )
}

export default NewChat;