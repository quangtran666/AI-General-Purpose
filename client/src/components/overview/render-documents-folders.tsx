import FolderItems from "@/components/overview/folder-items";
import SingleItem from "@/components/overview/single-item";
import React from "react";
import {useGetDocuments} from "@/services/document/useGetDocuments";
import {groupBy} from "lodash";

const renderDocumentsFolders = () => {
    const {data, isLoading} = useGetDocuments();

    const filterData = groupBy(data, "folderId");

    console.log(filterData);

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
                            Object.keys(filterData).map((key, indexKey) => {
                                return (key !== 'null') ? (
                                    <FolderItems
                                        key={indexKey}
                                        folderName={filterData[key][0].folderName}
                                        documents={filterData[key]}
                                    />
                                ) : (
                                    filterData[key].map((item, indexItem) => {
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
