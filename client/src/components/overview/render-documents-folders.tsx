import FolderItems from "@/components/overview/folder-items";
import SingleItem from "@/components/overview/single-item";
import React from "react";
import {useGetDocumentsAndFolders} from "@/services/common/useGetDocumentsAndFolders";

const renderDocumentsFolders = () => {
    const { groupResult, isLoading } = useGetDocumentsAndFolders();
    
    return (
        <>
            {isLoading
                ?
                <div className="flex flex-col justify-center h-full">
                    <p>Loading...</p>
                </div>
                :
                <>
                    <div className="space-y-1">
                        {
                            groupResult && Object.keys(groupResult).map((key, indexKey) => {
                                return (key !== "noFolder") ? (
                                    <FolderItems
                                        key={indexKey}
                                        folderGroup={groupResult[Number(key)]}
                                    />
                                ) : (
                                    groupResult[key].documents.map((item, indexItem) => {
                                        return <SingleItem
                                            key={indexItem}
                                            document={item}
                                        />
                                    })
                                )
                            })
                        }
                    </div>
                </>
            }
        </>
    )
}

export default renderDocumentsFolders;
