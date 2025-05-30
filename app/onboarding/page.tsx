"use client"

import RenderPage from "@/components/page/render_page";
import { useSidebar } from "@/components/ui/sidebar";
import { useEffect } from "react";

export default function Updater() {
    const { open, setOpen } = useSidebar();
    
    useEffect(() => {
        // Close the sidebar when the component mounts
        setOpen(false);
        console.log(open);
    }, []);
    
    return (
        <div className="w-full h-full overflow-auto">
            <RenderPage url="/onboarding" className="max-w-full w-full" />
        </div>
    )
}