import React from "react";
import HideSiderBarButton from "./hide-sidebar-btn";
import HeaderSidebar from "./header-sidebar";
import UtilButtons from "./util-buttons";
import LanguagesSelection from "./languages-selection";
import SignInToChat from "./signin-to-chat";
import Link from "next/link";
import { MessageCircleMore } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

function LeftNav() {
  return (
    <div className="w-1/5 h-svh p-4 bg-leftnav text-white flex flex-col ">
      <section>
        <div className="flex items-center justify-between">
          <HeaderSidebar />
          <HideSiderBarButton />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <UtilButtons />
        </div>
      </section>
      <section className="flex-1 mt-4 overflow-y-auto scrollbar-none">
        {/* <div className="flex flex-col justify-center h-full">
          <SignInToChat />
        </div> */}
        {/* Cái này để chia mấy cái trong cùng một folder */}
        <Accordion type="single" collapsible>
          <AccordionItem className="border-b-0" value="item-1">
            <AccordionTrigger className="bg-zinc-700 p-2 rounded-lg hover:no-underline">
              Folder 1
            </AccordionTrigger>
            <AccordionContent className="mt-1 p-0">
              <div className="flex flex-col h-full">
                <Link
                  href={"/"}
                  className="flex gap-2 items-center p-2 hover:bg-zinc-700 transition rounded-lg ml-4"
                >
                  <MessageCircleMore className="w-5" />
                  <p className="text-sm">Multilayer-perceptron.pdf</p>
                </Link>
              </div>
              <div className="flex flex-col h-full">
                <Link
                  href={"/"}
                  className="flex gap-2 items-center p-2 hover:bg-zinc-700 transition rounded-lg ml-4"
                >
                  <MessageCircleMore className="w-5" />
                  <p className="text-sm">Multilayer-perceptron.pdf</p>
                </Link>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {/* Cái này thì là một cái bài viết bình thường */}
        <div className="flex flex-col h-full">
          <Link href={"/"} className="flex gap-2 items-center p-2 hover:bg-zinc-700 transition rounded-lg">
            <MessageCircleMore className="w-5"/>
            <p className="text-sm">Multilayer-perceptron.pdf</p>
          </Link>
        </div>
      </section>
      <section>
        <LanguagesSelection />
      </section>
    </div>
  );
}

export default LeftNav;
