"use client"

import RenderPage from "@/components/page/render_page"

export default function PythonPage({ params }: { params: { slug?: string[] } }) {
    const path = "/" + (params.slug?.join("/") ?? "")
    return <RenderPage url={path} className="max-w-full w-full" />
}