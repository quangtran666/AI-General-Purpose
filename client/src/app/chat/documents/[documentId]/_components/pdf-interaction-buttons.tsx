import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePDFStore } from "@/stores/pdfstore";
import { Crop, RotateCcw, Search, ZoomIn, ZoomOut } from "lucide-react";
import React, { useCallback } from "react";

interface PDFInteracionButtonsProps {
  documentId: string;
  scrollToPage: (pageNumber: number) => void;
}

function PDFInteracionButtons({
  documentId,
  scrollToPage,
}: PDFInteracionButtonsProps) {
  const {
    getZoomLevel,
    setZoomLevel,
    resetZoomLevel,
    getCurrentPage,
    getPdfNumPages,
  } = usePDFStore();

  const zoomLevel = getZoomLevel(documentId);

  const handleZoomLevel = useCallback(
    (type: "in" | "out") => {
      const delta = type === "in" ? 0.1 : -0.1;
      setZoomLevel(documentId, zoomLevel + delta);
    },
    [documentId, setZoomLevel, zoomLevel]
  );

  const handleResetZoomLevel = useCallback(() => {
    resetZoomLevel(documentId);
  }, [documentId, resetZoomLevel]);

  return (
    <div className="flex justify-between items-center space-x-2">
      <div className="flex justify-between items-center border-1 border-slate-400 rounded-lg">
        <Button
          onClick={() => handleZoomLevel("out")}
          variant="ghost"
          size="tiny"
        >
          <ZoomOut className="text-main_app_black" />
        </Button>
        <Button onClick={handleResetZoomLevel} variant="ghost" size="tiny">
          <RotateCcw className="text-main_app_black" />
        </Button>
        <Button
          onClick={() => handleZoomLevel("in")}
          variant="ghost"
          size="tiny"
        >
          <ZoomIn className="text-main_app_black" />
        </Button>
      </div>
      <div className="flex justify-between items-center space-x-1">
        <Input
          value={getCurrentPage(documentId)}
          onChange={(e) => scrollToPage(Number(e.target.value))}
          className="outline-none border-0 focus:ring-slate-400 bg-slate-200 w-10 h-7"
        />
        <span>/</span>
        <span>{getPdfNumPages(documentId)}</span>
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
