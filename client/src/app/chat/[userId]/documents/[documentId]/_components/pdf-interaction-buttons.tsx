import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Crop, RotateCcw, Search, ZoomIn, ZoomOut } from "lucide-react";
import React from "react";

function PDFInteracionButtons() {
  return (
    <div className="flex justify-between items-center space-x-2">
      <div className="flex justify-between items-center border-1 border-slate-400 rounded-lg">
        <Button variant="ghost" size="tiny">
          <ZoomOut className="text-main_app_black" />
        </Button>
        <Button variant="ghost" size="tiny">
          <RotateCcw className="text-main_app_black" />
        </Button>
        <Button variant="ghost" size="tiny">
          <ZoomIn className="text-main_app_black" />
        </Button>
      </div>
      <div className="flex justify-between items-center space-x-1">
        <Input
          value={1}
          className="outline-none border-0 focus:ring-slate-400 bg-slate-200 w-10 h-7"
        />
        <span>/</span>
        <span>10</span>
      </div>
      <div className="">
        <Crop className="text-main_app_black scale-90" />
      </div>
      <div className="">
        <Search className="text-main_app_black scale-90" />
      </div>
    </div>
  );
}

export default PDFInteracionButtons;
