import {Plus} from "lucide-react";
import {Button} from "@/components/ui/button";
import React from "react";
import useCustomDropZone from "@/components/utils/custom-drop-zone";
import {useDocumentUpload} from "@/services/document/useDocumentUpload";
import Spinner from "@/components/small-components/spinner";

function NewChat() {
    const {handleDrop, isUploading} = useDocumentUpload();
    const {getRootProps, getInputProps} = useCustomDropZone({maxFiles: 1, onDrop: handleDrop});

    return (
        <Button {...getRootProps()} className="bg-leftnav text-white border-1 border-slate-500 p-5">
            <input
                {...getInputProps()}
                disabled={isUploading}
            />
            {isUploading
                ? <Spinner/>
                : <>
                    <span>
                        <Plus/>
                    </span>
                        New Chat
                  </>
            }
        </Button>
    )
}

export default NewChat;