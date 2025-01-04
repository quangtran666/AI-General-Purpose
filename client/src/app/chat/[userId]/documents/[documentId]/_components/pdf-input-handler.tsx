import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import React from "react";

function PDFInputHandler() {
  return (
    <>
      <Input placeholder="Ask any question..." />
      <Button>
        <Send className="text-white" />
      </Button>
    </>
  );
}

export default PDFInputHandler;
