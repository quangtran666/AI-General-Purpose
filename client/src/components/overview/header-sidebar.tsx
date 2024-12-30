import React from "react";
import Image from "next/image";

function HeaderSidebar() {
  return (
    <div className="flex items-center justify-center gap-2">
      <Image src={"/rocket.png"} alt="logo" width={40} height={40} />
      <span className="text-2xl">
        Chat<span className="font-bold">PDF</span>
      </span>
    </div>
  );
}

export default HeaderSidebar;
