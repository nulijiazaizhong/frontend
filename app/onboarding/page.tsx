"use client"

import RenderPage from "@/components/page/render_page";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import { usePage } from "@/hooks/usePage";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export default function Updater() {
    const { setTheme } = useTheme();
    const { open, setOpen } = useSidebar();
    const [ pageNumber, setPageNumber ] = useState(0);
    const [ totalPages, setTotalPages ] = useState(1);
    const page = usePage("/onboarding");
    
    useEffect(() => {
        setOpen(false);
    }, []);

    useEffect(() => {
        if(!page) return;
        try
        {
            const number = parseInt(page[1].container.children[0].container.children[0].button.children[0].text.text.split(" ")[0]);
            const total = parseInt(page[1].container.children[0].container.children[0].button.children[0].text.text.split(" ")[2]);
            setPageNumber(number);
            setTotalPages(total);
            if (number != 0 && total != 0 && number >= total) {
                localStorage.setItem("hasDoneOnboarding", "true");
            }
        }
        catch (error) {}
    }, [page]);
    
    if (pageNumber == 1 && open) {
        // The user skipped the onboarding
        localStorage.setItem("hasDoneOnboarding", "true");
    }

    return (
        <div className="w-full h-full overflow-auto">
            { pageNumber === 1 && (
                <DropdownMenu>
                    <DropdownMenuTrigger className="absolute right-2 bottom-2 z-50">
                        <Button variant="outline" size="icon">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background font-geist">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
            <RenderPage url="/onboarding" className="max-w-full w-full" container_classname="overflow-y-hidden" />
        </div>
    )
}