import Link from "next/link";
import {MessageCircleMore} from "lucide-react";
import React from "react";

function SingleItem() {
    return (
        <>
            <div className="flex flex-col h-full">
                <Link href={"/"}
                      className="flex gap-2 items-center p-2 hover:bg-zinc-700 transition rounded-lg">
                    <MessageCircleMore className="w-5"/>
                    <p className="text-sm">Multilayer-perceptron.pdf</p>
                </Link>
            </div>
        </>
    )
}

export default SingleItem