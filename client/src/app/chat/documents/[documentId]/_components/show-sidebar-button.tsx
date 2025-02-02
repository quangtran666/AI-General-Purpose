import React from "react";
import {Button} from "@/components/ui/button";
import {PanelLeftOpen} from "lucide-react";
import {useSidebarStore} from "@/stores/sidebarstore";

interface ShowSidebarButtonProps {
    className?: string;
}

function ShowSidebarButton({className}: ShowSidebarButtonProps) {
    const toggle = useSidebarStore((state) => state.toggle);

    return (
        <Button
            variant="ghost"
            size="tiny"
            onClick={toggle}
            className={className}
        >
            <PanelLeftOpen className="h-4 w-4 scale-125"/>
        </Button>
    )
}

export default ShowSidebarButton;