"use client";
import useSWR from "swr"
import { GetPlugins } from "@/apis/backend"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import React, { useState } from 'react';
import {
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ETS2LAPage } from "@/components/page/page"
import { translate } from "@/apis/translation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import RenderPage from "@/components/page/render_page"
import { motion } from "framer-motion";
import { ACTIONS, EVENTS, ORIGIN, STATUS, CallBackProps } from 'react-joyride';
import { JoyRideNoSSR } from "@/components/joyride-no-ssr";
import { useEffect } from "react";
import { usePages } from "@/hooks/usePages";

export default function Home() {
    const [selectedPlugin, setSelectedPlugin] = useState("Global")
    const pages = usePages();

    const renderPluginPage = () => {
        if (selectedPlugin === "Global") {
            return <RenderPage url="/settings/global" />;
        } else if (selectedPlugin === "Controls") {
            return <RenderPage url="/settings/controls" />;
        } else if (selectedPlugin === "SDK") {
            return <RenderPage url="/settings/sdk" />;
        } else {
            for (const [key, data] of Object.entries(pages)) {
                // @ts-ignore
                if (data.title === selectedPlugin) {
                    // @ts-ignore
                    return <RenderPage url={data.url} className="h-full" container_classname="h-full" />;
                }
            }
        }
    };

    return (
        <>
            <div className="h-full font-geist rounded-lg bg-background p-4">
                <div className="flex flex-col gap-2 p-5 pt-[10px]">
                    <h2 className="text-lg font-bold">{translate("frontend.settings")}</h2>
                    <Separator className="translate-y-4" />
                </div>
                <div className="h-full pt-0 p-1 overflow-auto">
                    <TooltipProvider>
                        <ResizablePanelGroup direction="horizontal" className="text-center gap-4 pr-4 h-full">
                            <ResizablePanel defaultSize={25}>
                                <ScrollArea className="h-full pt-4 relative" type="hover">
                                    <div className="absolute bottom-0 z-10 right-0 top-0 w-12 bg-linear-to-l from-background pointer-events-none" />
                                    <div className="flex flex-col gap-2 text-start relative">
                                        <div className="flex flex-col gap-2 text-start relative p-0 pb-8" id="static_settings">
                                            <Button key={"Global"} className="items-center justify-start text-sm rounded-r-none" variant={selectedPlugin == "Global" && "secondary" || "ghost"} onClick={() => setSelectedPlugin("Global")}>
                                                {translate("frontend.settings.global")}
                                            </Button>
                                            <Button key={"Controls"} className="items-center justify-start text-sm rounded-r-none" variant={selectedPlugin == "Controls" && "secondary" || "ghost"} onClick={() => setSelectedPlugin("Controls")}>
                                                {translate("frontend.settings.controls")}
                                            </Button>
                                            <Button key={"SDK"} className="items-center justify-start text-sm rounded-r-none" variant={selectedPlugin == "SDK" && "secondary" || "ghost"} onClick={() => setSelectedPlugin("SDK")} id="open_sdk_settings">
                                                SDK
                                            </Button>
                                        </div>
                                        <div className="flex flex-col gap-2 text-start relative p-0" id="plugin_settings">
                                            {pages && Object.entries(pages).map(([key, data]:any, index:number) => (
                                                data && data.url && data.location && data.title && data.location === "settings" ?
                                                <div className="items-center justify-start text-sm" key={key}>
                                                    <Tooltip>
                                                        <TooltipTrigger className="items-center justify-start text-sm w-full">
                                                            <Button className="items-center justify-start text-sm w-full rounded-r-none" 
                                                                variant={selectedPlugin == data.title ? "secondary" : "ghost"} 
                                                                onClick={() => setSelectedPlugin(data.title)}>
                                                                {
                                                                    translate(data.title)
                                                                }
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <div className="flex flex-col gap-2 text-start">
                                                                <p className="text-xs text-start">
                                                                    {
                                                                        translate(data.title)
                                                                    }
                                                                </p>
                                                            </div>
                                                        </TooltipContent>
                                                    </Tooltip> 
                                                </div> : null
                                            ))}
                                        </div>
                                    </div>
                                </ScrollArea>
                            </ResizablePanel>
                            <ResizablePanel defaultSize={75} className="h-full w-full relative">
                                <ScrollArea className="h-full" type="hover">
                                    <div className="h-4" />
                                    <div className="w-[97%]">
                                        {renderPluginPage()}
                                        <div className="h-24" />
                                    </div>
                                </ScrollArea>
                                <div className="absolute h-4 top-0 left-0 right-0 bg-linear-to-b from-background pointer-events-none" />
                            </ResizablePanel>
                        </ResizablePanelGroup>
                    </TooltipProvider>
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-linear-to-t from-background pointer-events-none" />
                </div>
            </div>
        </>
    )
}