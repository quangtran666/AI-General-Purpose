import { Languages } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

function LanguagesSelection() {
  return (
    <div className="flex items-center gap-2">
      <span>
        <Languages />
      </span>
      <Select>
        <SelectTrigger className="border-slate-500">
          <SelectValue placeholder="EN" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export default LanguagesSelection;
