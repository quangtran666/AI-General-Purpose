"use client"

import React from "react";
import HideSiderBarButton from "./hide-sidebar-btn";
import HeaderSidebar from "./header-sidebar";
import UtilButtons from "./util-buttons";
import LanguagesSelection from "./languages-selection";
import SignInToChat from "./signin-to-chat";
import {useSession} from "next-auth/react";
import UserSettings from "@/components/overview/user-settings";
import FolderItems from "@/components/overview/folder-items";
import SingleItem from "@/components/overview/single-item";
import RenderDocumentsFolders from "@/components/overview/render-documents-folders";
import {useGetDocumentsAndFolders} from "@/services/common/useGetDocumentsAndFolders";

function LeftNav() {
    const {status} = useSession()

    return (
        <div className="w-1/5 h-svh p-4 bg-leftnav text-white flex flex-col ">
            <section>
                <div className="flex items-center justify-between">
                    <HeaderSidebar/>
                    <HideSiderBarButton/>
                </div>
                <div className="flex flex-col gap-2 mt-4">
                    <UtilButtons/>
                </div>
            </section>
            <section className="flex-1 mt-4 overflow-y-auto scrollbar-none space-y-1">
                {status === "unauthenticated"
                    ?
                    <div className="flex flex-col justify-center h-full">
                        <SignInToChat/>
                    </div>
                    :
                    <>
                        <RenderDocumentsFolders />
                    </>
                }
            </section>
            <section>
                <LanguagesSelection/>
                {status === "authenticated" && <UserSettings/>}
            </section>
        </div>
    );
}

export default LeftNav;
