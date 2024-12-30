import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { PanelRightOpen } from "lucide-react";
import React from "react";

function HideSiderBarButton() {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger>
          <PanelRightOpen />
        </TooltipTrigger>
        <TooltipContent sideOffset={10} >
          <p className="bg-collapse_nav_tooltip p-3 rounded-xl">Hide Side</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default HideSiderBarButton;
