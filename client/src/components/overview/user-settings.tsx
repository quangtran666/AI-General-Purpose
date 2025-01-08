"use client"

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import React from "react";
import {useSession, signOut} from "next-auth/react";
import {Button} from "@/components/ui/button";

function UserSettings() {
    const {data: session, status} = useSession()

    const getUserAbbreviation = () => {
        if (status !== "authenticated") return;

        return session?.user?.name?.split(" ").map(c => c[0]).join("");
    }
    
    return (
        status === "authenticated" && (
            <Dialog>
                <DialogTrigger asChild>
                    <button className="flex items-center gap-4 mt-2 w-full">
                        <Avatar>
                            <AvatarFallback>{getUserAbbreviation()}</AvatarFallback>
                        </Avatar>
                        <h2>{session?.user?.name}</h2>
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>My Account</DialogTitle>
                        <div className="flex items-center justify-between">
                            <p>{session?.user?.email ?? "Unknown"}</p>
                            <Button className="text-white" onClick={() => signOut()}>Sign out</Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        )
    )
}

export default UserSettings; 