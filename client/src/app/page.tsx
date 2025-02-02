"use client"

import {ScrollArea} from "@/components/ui/scroll-area";
import {Card} from "@/components/ui/card";
import {Bot} from "lucide-react";
import {useSidebarStore} from "@/stores/sidebarstore";
import ShowSidebarButton from "@/app/chat/documents/[documentId]/_components/show-sidebar-button";
import React from "react";

export default function Home() {
    return (
        <>
            {!useSidebarStore((state) => state.isOpen) && <ShowSidebarButton className={"invisible md:visible"}/>}
            <header className="px-6 py-4 flex flex-col items-center justify-center mt-0 md:mt-4">
                <h1 className="text-xl font-semibold">Chat with your PDF</h1>
                <p className="text-sm text-muted-foreground">Ask questions and get answers from your document</p>
            </header>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                    <Card className="mx-auto max-w-2xl p-6 bg-leftnav">
                        <div className="flex items-start gap-4">
                            <div
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                <Bot className="h-5 w-5 text-primary"/>
                            </div>
                            <div className="space-y-2">
                                <h2 className="font-semibold">Welcome to ChatPDF!</h2>
                                <p className="text-sm text-muted-foreground">
                                    I'm your AI assistant ready to help you understand and analyze your PDF documents.
                                    You can:
                                </p>
                                <ul className="list-inside list-disc text-sm text-muted-foreground">
                                    <li>Ask questions about the content</li>
                                    <li>Request summaries of specific sections</li>
                                    <li>Get explanations of complex topics</li>
                                    <li>Extract key information and insights</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                </div>
            </ScrollArea>
        </>
    )
}
