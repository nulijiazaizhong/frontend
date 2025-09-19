"use client"  // Make sure this is a client-side component

import { useSearchParams } from "next/navigation"
import RenderPage from "@/components/page/render_page"

export default function Page() {
    const searchParams = useSearchParams()
    const path = searchParams.get("url") || "/"  // Default to "/" if no URL is provided

    // If we are getting a settings page but we are not in the settings
    // then we want to render it inside a padded container.
    // This will make sure that manually opened settings pages are 
    // rendered at least somewhat nicely.
    if (!window.location.origin.includes("settings") && path.startsWith("/settings")) {
        return <div className="w-full h-full p-16">
            <RenderPage url={path} className="max-w-full w-full" />
        </div>
    }

    // Render the page based on the URL
    return <RenderPage url={path} className="max-w-full w-full" />
}