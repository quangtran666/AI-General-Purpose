"use client";

import {useGetDocumentsAndFolders} from "@/services/common/useGetDocumentsAndFolders";
import React, {use} from "react";
import Spinner from "@/components/small-components/spinner";
import FolderDelete from "@/app/chat/folders/[folderId]/_components/folder-delete";
import FolderUpdate from "@/app/chat/folders/[folderId]/_components/folder-update";
import {useSidebarStore} from "@/stores/sidebarstore";
import ShowSidebarButton from "@/app/chat/documents/[documentId]/_components/show-sidebar-button";

const FolderPage = ({params} : {params: Promise<{folderId : string}>}) => {
    const { groupResult, isLoading } = useGetDocumentsAndFolders();
    const { folderId } = use(params);
    
    if (isLoading || !groupResult) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Spinner/>
            </div>
        )
    }
    
    const folder = groupResult[Number(folderId)];
    
    return (
        <>
            {!useSidebarStore((state) => state.isOpen) && <ShowSidebarButton className={"invisible md:visible ml-2 mt-2"}/>}
            <section className="flex justify-center items-center h-screen">
                <div className="flex flex-col space-y-4 items-center justify-center">
                    <h1 className="text-3xl">{folder.folderName}</h1>
                    <FolderUpdate
                        folderId={folder.folderId!}
                        folderName={folder.folderName!}
                        folderDescription={folder.folderDescription!}
                    />
                    <FolderDelete
                        folderId={folder.folderId!}
                    />
                </div>
            </section>
        </>
        
    );
}

export default FolderPage;