'use client'

import dynamic from 'next/dynamic';
import React from 'react'

const PDFViewer = dynamic(
  () => import('./_components/pdf-viewer'),
  { ssr: false}
)

function SpecificDocumentChatPage() {

  return (
    <div className="flex">
      <section className="border-r-1 border-r-main_border_color">
        <div className="">Above</div>
        <div className="overflow-y-auto h-svh">
          <PDFViewer />
        </div>
      </section>
      <div className="">Chat</div>
    </div>
  )
}

export default SpecificDocumentChatPage