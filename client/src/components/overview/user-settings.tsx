"use client"

import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Avatar, AvatarFallback} from "@/components/ui/avatar";
import React from "react";
import {signOut} from "next-auth/react";
import {Button} from "@/components/ui/button";
import {useGetUserProfile} from "@/services/user/useGetUserProfile";
import {Progress} from "@/components/ui/progress";
import {formatDate} from "@/lib/date.utils";

function UserSettings() {
    const { userInfo, isLoading } = useGetUserProfile();

    const getUserAbbreviation = () => {
        return userInfo?.fullName?.split(" ").map(c => c[0]).join("");
    }
    
    return (
        !isLoading && (
            <Dialog>
                <DialogTrigger asChild>
                    <button className="flex items-center gap-4 mt-2 w-full">
                        <Avatar>
                            <AvatarFallback>{getUserAbbreviation()}</AvatarFallback>
                        </Avatar>
                        <h2 className="truncate">{userInfo?.fullName}</h2>
                    </button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>My Account</DialogTitle>
                        <div className="flex items-center justify-between">
                            <p>{userInfo?.fullName ?? "Unknown"}</p>
                            <Button className="text-white" onClick={() => signOut()}>Sign out</Button>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">Subscription Usage</p>
                            <div className="text-sm text-muted-foreground">
                                <span>Remaining: {userInfo?.subscription.remainingUsage} uses</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">Start Date</p>
                            <div className="text-sm text-muted-foreground">
                                <span>{formatDate(userInfo?.subscription.startDate!)}</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">End date</p>
                            <div className="text-sm text-muted-foreground">
                                <span>{formatDate(userInfo?.subscription.endDate!)}</span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        )
    )
}

export default UserSettings; 