import React from "react";
import NewFolderButton from "./new-folder-button";
import NewChat from "@/components/overview/new-chat";
import {QueryObserverResult, RefetchOptions} from "@tanstack/query-core";
import {GroupResult} from "@/services/common/useGetDocumentsAndFolders";

function UtilButtons() {
    return (
        <>
            <NewChat />
            <NewFolderButton />
        </>
    );
}

export default UtilButtons;
