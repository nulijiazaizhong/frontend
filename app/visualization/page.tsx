"use client";
import { motion } from "framer-motion";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Visualization() {
    const [ isVisualizationOpen, setIsVisualizationOpen ] = useState(false);
    const [ isMapOpen, setIsMapOpen ] = useState(false);


    return (
        <motion.div className="flex w-full h-full">
            <ResizablePanelGroup direction="horizontal" className="w-full h-full">
                <ResizablePanel className="h-full" defaultSize={40}>
                    {isVisualizationOpen && (
                        <motion.iframe className="w-full h-full" 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            src="https://visualization.ets2la.com/"
                        />
                    )}
                    {!isVisualizationOpen && (
                        <div className="border w-full h-full rounded-l-xl items-center flex flex-col gap-4 justify-center border-r-0 font-geist">
                            <Button variant={"outline"} onClick={() => setIsVisualizationOpen(true)}>Load Visualization</Button>
                            <div className="flex flex-col gap-2 items-center">
                                <p className="text-xs text-muted-foreground font-geist-mono">
                                    RAM Usage: ~400mb
                                </p>
                                <p className="text-xs text-muted-foreground text-center">
                                    Please note that loading might take a minute the first time. <br />
                                    The visualization will update once the game is unpaused.
                                </p>
                            </div>
                        </div>
                    )}
                </ResizablePanel>
                <ResizableHandle withHandle className="bg-transparent" />
                <ResizablePanel className="h-full w-0" defaultSize={60}>
                    {isMapOpen && (
                        <motion.iframe className="w-full h-full invert hue-rotate-180 saturate-[0.8] brightness-[0.83] contrast-[1.3]" 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            src="https://truckermudgeon.github.io/navigator"
                        />
                    )}
                    {!isMapOpen && (
                        <div className="border w-full h-full rounded-r-xl items-center flex flex-col gap-4 justify-center font-geist">
                            <Button variant={"outline"} onClick={() => setIsMapOpen(true)}>Load Map</Button>
                            <div className="flex flex-col gap-2 items-center">
                                <p className="text-xs text-muted-foreground font-geist-mono">
                                    RAM Usage: ~200mb
                                </p>
                            </div>
                        </div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </motion.div>
    )
}