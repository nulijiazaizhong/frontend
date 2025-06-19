"use client"  // Make sure this is a client-side component

import { useSearchParams } from "next/navigation"
import RenderPage from "@/components/page/render_page"

export default function Page() {
    const searchParams = useSearchParams()
    const path = searchParams.get("url") || "/"  // Default to "/" if no URL is provided

    // Render the page based on the URL
    return <RenderPage url={path} className="max-w-full w-full" />
}