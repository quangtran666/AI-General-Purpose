import React from "react";
import Image from "next/image";
import Link from "next/link";

function HeaderSidebar() {
  return (
    <div className="flex items-center justify-center gap-2">
        <Link href={"/"}>
            <Image
                src={"/rocket.png"}
                alt="logo"
                width={40}
                height={40}
            />
        </Link>
      <span className="text-2xl">
        Chat<span className="font-bold">PDF</span>
      </span>
    </div>
  );
}

export default HeaderSidebar;
