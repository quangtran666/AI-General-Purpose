import React from "react";
import HideSiderBarButton from "./hide-sidebar-btn";
import HeaderSidebar from "./header-sidebar";
import UtilButtons from "./util-buttons";
import LanguagesSelection from "./languages-selection";
import SignInToChat from "./signin-to-chat";

function LeftNav() {
  return (
    <div className="w-1/5 h-svh p-4 bg-leftnav text-white flex flex-col justify-between">
      <section>
        <div className="flex items-center justify-between">
          <HeaderSidebar />
          <HideSiderBarButton />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <UtilButtons />
        </div>
      </section>
      <section>
        <SignInToChat />
      </section>
      <section>
        <LanguagesSelection />
      </section>
    </div>
  );
}

export default LeftNav;
