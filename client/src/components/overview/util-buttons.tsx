import React from "react";
import NewFolderButton from "./new-folder-button";
import NewChat from "@/components/overview/new-chat";

function UtilButtons() {
    return (
        <>
            <NewChat />
            <NewFolderButton/>
        </>
    );
}

export default UtilButtons;
