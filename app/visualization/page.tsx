"use client";
import { motion } from "framer-motion";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import useSWR from "swr";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { useSidebar } from "@/components/ui/sidebar";
import { Checkbox } from "@/components/ui/checkbox";

function other_theme(theme: string) {
    if (theme == "light") return "dark";
    if (theme == "dark") return "light";
    return "system";
}

export default function Visualization() {
    const [ visualizationSize, setVisualizationSize ] = useState(60);
    const { open, setOpen } = useSidebar();
    const { resolvedTheme: theme } = useTheme();

    const [ visualizationOptions, setVisualizationOptions ] = useState<{
        open: boolean
        useMirror: boolean;
        forceTheme: string | null;
    }>({
        open: false,
        useMirror: false,
        forceTheme: null,
    });

    const [ mapOptions, setMapOptions ] = useState<{
        open: boolean
        useMirror: boolean;
        mapName: string;
    }>({
        open: false,
        useMirror: false,
        mapName: "base",
    });

    const map_link = "https://map.ets2la.com";
    const visualization_link = "https://visualization.ets2la.com?theme=" + (visualizationOptions.forceTheme ? visualizationOptions.forceTheme : theme);
    const map_mirror = "https://map.ets2la.cn"
    const visualization_mirror = "https://visualization.ets2la.cn?theme=" + (visualizationOptions.forceTheme ? visualizationOptions.forceTheme : theme);

    const map = (mapOptions.useMirror ? map_mirror : map_link) + "?mapName=" + mapOptions.mapName;
    const visualization = visualizationOptions.useMirror ? visualization_mirror : visualization_link;

    useEffect(() => {
        setOpen(false);
    }, []);

    return (
        <>
            <motion.div className="flex w-full h-full relative">
                <ResizablePanelGroup direction="horizontal" className="w-full h-full">
                    <ResizablePanel className="h-full relative" defaultSize={60} onResize={(size) => {
                        if(size < 5){
                            setVisualizationOptions({ ...visualizationOptions, open: false });
                        }
                        setVisualizationSize(size);
                    }}>
                        {mapOptions.open && visualizationOptions.open && (
                            <div className="absolute right-0 top-0 bottom-0 w-1 z-10 bg-linear-to-r from-transparent to-[#181818]" />
                        )}
                        {visualizationOptions.open && (
                            <motion.iframe className="w-full h-full" 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                src={visualization}
                            />
                        )}
                        {!visualizationOptions.open && (
                            <div className="w-full h-full items-center flex flex-col gap-4 justify-center font-geist relative">
                                <div className="top-6 left-6 absolute">
                                    <p className="font-semibold pb-1">Visualization</p>
                                    <p className="text-xs text-muted-foreground">This visualization will show the current state of the self driving systems.</p>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Checkbox checked={visualizationOptions.useMirror} onCheckedChange={(e) => {
                                            setVisualizationOptions({ ...visualizationOptions, useMirror: e as boolean });
                                        }} className="size-4"/>
                                        <span className={"text-xs" + (visualizationOptions.useMirror ? "" :" text-muted-foreground")} onClick={() => {
                                            setVisualizationOptions({ ...visualizationOptions, useMirror: !visualizationOptions.useMirror });
                                        }}>Goodnightan Mirror</span>
                                    </div>

                                    { theme ? (
                                        <div className="flex items-center gap-2 pt-2 pb-3">
                                            <Checkbox checked={visualizationOptions.forceTheme === other_theme(theme)} onCheckedChange={(e) => {
                                                setVisualizationOptions({ ...visualizationOptions, forceTheme: visualizationOptions.forceTheme ? null : other_theme(theme) });
                                            }} className="size-4"/>
                                            <span className={"text-xs" + (visualizationOptions.forceTheme === other_theme(theme) ? "" :" text-muted-foreground")} onClick={() => {
                                                setVisualizationOptions({ ...visualizationOptions, forceTheme: visualizationOptions.forceTheme ? null : other_theme(theme)  });
                                            }}>Force {other_theme(theme)} theme</span>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="flex flex-col bottom-6 left-6 absolute gap-2">
                                    <a className="text-xs text-muted-foreground" href={visualization} target="_blank">{visualization}</a>
                                    <Button size={"sm"} variant={"outline"} onClick={() => {
                                        setVisualizationOptions({ ...visualizationOptions, open: true });
                                    }} className="group w-48">
                                        <span className="text-muted-foreground text-xs group-hover:text-foreground transition-all">Load Visualization</span>
                                    </Button>
                                </div>
                            </div>
                        )}
                    </ResizablePanel>
                    <ResizableHandle withHandle className="bg-transparent w-0 opacity-20 hover:opacity-100 z-50 transition-all" />
                    <ResizablePanel className="h-full w-0 relative" defaultSize={40} onResize={(size) => {
                        if(size < 5){
                            setMapOptions({ ...mapOptions, open: false });
                        }
                    }}>
                        {visualizationOptions.open && mapOptions.open && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 z-10 bg-linear-to-l from-transparent to-[#181818]" />
                        )}
                        {mapOptions.open && (
                            <motion.iframe className="w-full h-full" 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.6 }}
                                src={map}
                            />
                        )}
                        {!mapOptions.open && (
                            <div className="border-l w-full h-full items-center flex flex-col gap-4 justify-center font-geist relative">
                                <div className="top-6 left-6 absolute">
                                    <p className="font-semibold pb-1">Map</p>
                                    <p className="text-xs text-muted-foreground">You can see your location and route here.</p>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Checkbox checked={mapOptions.mapName == "promods" } onCheckedChange={(e) => {
                                            setMapOptions({ ...mapOptions, mapName: e as boolean ? "promods" : "base" });
                                        }} />
                                        <p className={"text-xs" + (mapOptions.mapName == "promods" ? "" :" text-muted-foreground")} onClick={() => {
                                            setMapOptions({ ...mapOptions, mapName: mapOptions.mapName == "promods" ? "base" : "promods" });
                                        }}>Promods Support</p>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <Checkbox checked={mapOptions.useMirror} onCheckedChange={(e) => {
                                            setMapOptions({ ...mapOptions, useMirror: e as boolean });
                                        }} />
                                        <p className={"text-xs" + (mapOptions.useMirror ? "" :" text-muted-foreground")} onClick={() => {
                                            setMapOptions({ ...mapOptions, useMirror: !mapOptions.useMirror });
                                        }}>Goodnightan Mirror</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-0 bottom-6 left-6 absolute">
                                    <a className="text-xs text-muted-foreground pb-2" href={map} target="_blank">{map}</a>
                                    <Button variant={"outline"} onClick={() => {
                                        setMapOptions({ ...mapOptions, open: true });
                                    }} className="group w-48"><span className="text-muted-foreground text-xs group-hover:text-foreground transition-all">Load Map</span></Button>
                                </div>
                            </div>
                        )}
                    </ResizablePanel>
                </ResizablePanelGroup>
            
                {/* This div is required to make sure the page is always full height, presumably due to google ads... */}
                <div className="w-full absolute -bottom-16 z-50 text-xs text-center text-muted-foreground font-geist">
                    <Button variant={"secondary"} onClick={() => {
                        window.location.reload();
                        toast.success("Layout fix triggered!");
                    }}>
                        Fix Layout
                    </Button>
                </div>
            </motion.div>
        </>
    )
}
