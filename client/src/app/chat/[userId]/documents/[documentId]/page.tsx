"use client";

import dynamic from "next/dynamic";
import React from "react";
import PDFInteracionButtons from "./_components/pdf-interaction-buttons";

const PDFViewer = dynamic(() => import("./_components/pdf-viewer"), {
  ssr: false,
});

function SpecificDocumentChatPage() {
  return (
    <div className="flex">
      <section className="w-1/2 border-r-1 border-r-main_border_color h-svh flex flex-col">
        <div className="mx-6 my-2 flex justify-between items-center">
          <strong className="text-lg text-nowrap">
            Multilayer-perceptron.pdf
          </strong>
          <PDFInteracionButtons />
        </div>
        <div className="overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-white">
          <PDFViewer />
        </div>
      </section>
      <div className="flex-1">Chat</div>
    </div>
  );
}

export default SpecificDocumentChatPage;
