import {Menu} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger} from "@/components/ui/sheet";
import LeftNav from "./overview/left-nav";
import Image from "next/image";

export function MobileNav() {
    
    return (
        <Sheet>
            <SheetTrigger asChild>
                <div className="flex items-center justify-between">
                    <Button variant="ghost" className="md:hidden">
                        <Menu className="h-5 w-5 scale-150"/>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Image
                            src="/rocket.png"
                            alt="logo"
                            width={40}
                            height={40}
                        />
                        <span className="font-medium">CHAT<b>PDF</b></span>
                    </div>
                    <div className=""></div>
                </div>
            </SheetTrigger>
            <SheetContent side="left" className="w-full p-0">
                <SheetHeader>
                    <SheetTitle className="hidden"></SheetTitle>
                </SheetHeader>
                <LeftNav className="w-full p-0 bg-background"/>
            </SheetContent>
        </Sheet>
    );
} 