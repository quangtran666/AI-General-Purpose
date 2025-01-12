import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {MessageCircleMore} from "lucide-react";
import React from "react";
import useCustomDropZone from "@/components/utils/custom-drop-zone";

function FolderItems() {
    const {getRootProps, getInputProps} = useCustomDropZone({maxFiles: 3});
    
    return (
        <>
            <Accordion type="single" collapsible>
                <AccordionItem className="border-b-0" value="item-1">
                    <AccordionTrigger className="bg-zinc-700 p-2 rounded-lg hover:no-underline">
                        Folder 1
                    </AccordionTrigger>
                    <AccordionContent className="mt-1 p-0">
                        <div className="flex flex-col h-full">
                            <Button {...getRootProps()} className="hover:bg-main_border_color bg-main_border_color border-dashed border-2 text-slate-200">
                                <input {...getInputProps()} />
                                <p>Drop PDFs here</p>
                            </Button>
                        </div>
                        <div className="flex flex-col h-full">
                            <Link
                                href={"/"}
                                className="flex gap-2 items-center p-2 hover:bg-zinc-700 transition rounded-lg ml-4"
                            >
                                <MessageCircleMore className="w-5"/>
                                <p className="text-sm">Multilayer-perceptron.pdf</p>
                            </Link>
                        </div>
                        <div className="flex flex-col h-full">
                            <Link
                                href={"/"}
                                className="flex gap-2 items-center p-2 hover:bg-zinc-700 transition rounded-lg ml-4"
                            >
                                <MessageCircleMore className="w-5"/>
                                <p className="text-sm">Multilayer-perceptron.pdf</p>
                            </Link>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}

export default FolderItems 