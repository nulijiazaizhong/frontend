import { CloseBackend, MinimizeBackend, SetStayOnTop, SetTransparent, ToggleFullscreen } from "@/apis/backend";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import { useState, useEffect } from "react"
import { toast } from "sonner";
import {GetSettingByKey} from "@/apis/settings";
import { useSidebar } from "./ui/sidebar";

export default function WindowControls() {
    const [lastMousePosition, setLastMousePosition] = useState({ x: 0, y: 0 });
    const [windowPosition, setWindowPosition] = useState({ x: 0, y: 0 });
    const [isMouseInDragArea, setIsMouseInDragArea] = useState(false)
    const [stayOnTop, setStayOnTop] = useState(false);
    const [transparency, setTransparency] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [overlayRef, setOverlayRef] = useState<HTMLDivElement | null>(null);
    const {open, isMobile, openMobile} = useSidebar();

    const sidebar_open = !isMobile ? !open : !openMobile;

    useEffect(() => {
        const initialWindowPosition = { x: window.screenX, y: window.screenY };
        setWindowPosition(initialWindowPosition);
    }, []);

    const handleMouseCallback = (event: MouseEvent) => {
        // Check if the Y position is within 40px from the top
        if (event.clientY <= 40) {
            setIsMouseInDragArea(true)
        } else {
            setIsMouseInDragArea(false)
        }
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseCallback);
        return () => {
            window.removeEventListener('mousemove', handleMouseCallback);
        };
    }, []);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (dragging) {
                const newX = windowPosition.x + (e.screenX - lastMousePosition.x);
                const newY = windowPosition.y + (e.screenY - lastMousePosition.y);
                setWindowPosition({ x: newX, y: newY });
                // @ts-ignore
                window.pywebview._bridge.call('pywebviewMoveWindow', [newX, newY], "move");
                setLastMousePosition({ x: e.screenX, y: e.screenY });
            }
        };

        const handleMouseUp = () => {
            setDragging(false);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        if (dragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [dragging, windowPosition, lastMousePosition]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.target instanceof HTMLElement) {
            e.preventDefault();
            setDragging(true);
            setLastMousePosition({ x: e.screenX, y: e.screenY });
        }
    };

    useEffect(() => {
        GetSettingByKey("global", "stay_on_top", false).then((stayOnTop) => {
            setStayOnTop(stayOnTop)
        })
        GetSettingByKey("global", "transparency", false).then((transparency) => {
            SetTransparent(transparency).then(()=> {
                setTransparency(transparency)
            })
        })
    }, []);

    const collapsedContainerClassName = "flex gap-1 absolute h-6 w-[59px] top-0 right-0 items-center justify-center p-0 z-50 transition-transform opacity-50 hover:opacity-100";
    const containerClassName = "flex gap-1 absolute h-6 w-[59px] rounded-bl-lg top-0 right-0 items-center justify-center p-0 z-50 transition-transform";

    return (
        <>
            <div 
                ref={setOverlayRef}
                className="fixed top-0 left-[80px] right-0 h-[26px] z-30"
                style={{ backgroundColor: 'transparent' }}
                onMouseMove={(e) => {
                    setIsMouseInDragArea(true);
                }}
                onMouseLeave={() => {
                    setIsMouseInDragArea(false);
                }}
                id="slide_area"
            />
            {!sidebar_open && (
                <>
                    <div className="absolute h-4 w-[50px] rounded-bl-lg border-b border-l top-2 right-2 z-40 transition-all pointer-events-none bg-sidebar" />   
                    <div className="absolute h-6 w-[59px] rounded-bl-lg top-0 right-0 z-30 bg-sidebar" />   
                </>
            )}
            <div className={sidebar_open && collapsedContainerClassName || containerClassName} onMouseDown={handleMouseDown} id="window_controls">
                {sidebar_open && (
                    <div className={`absolute right-0 top-0 h-6 flex items-center border pl-2.5 pr-12 transition-all bg-sidebar rounded-bl-lg z-[-10] duration-150 ${isMouseInDragArea ? 'w-96 opacity-100' : 'w-0 opacity-0'}`}>
                        <div
                            className="grow h-1 bg-repeat bg-center text-muted-foreground/30 font-geist-mono text-[12px] text-center"
                            style={{
                                backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
                                backgroundSize: "10px 10px"
                            }}
                        >
                            <p className="bg-sidebar w-16 justify-self-center -my-1.5 pointer-events-none text-xs">
                                move
                            </p>
                        </div>
                    </div>
                )}
                <TooltipProvider>
                    <Tooltip delayDuration={250}>
                        <TooltipTrigger 
                            onClick={(e) => {
                                // Left click
                                const newStayOnTop = !stayOnTop;
                                setStayOnTop(newStayOnTop);
                                SetStayOnTop(newStayOnTop).then(() => {
                                    toast.success(`${newStayOnTop ? "Window is now on top" : "Window is no longer on top"}`)
                                });
                            }}
                            onContextMenu={(e) => {
                                // Right click
                                e.preventDefault();
                                const newTransparency = !transparency;
                                setTransparency(newTransparency);
                                SetTransparent(newTransparency).then(() => {
                                    toast.success(`${newTransparency ? "Window is now transparent" : "Window is no longer transparent"}`)
                                });
                            }}
                            onAuxClick={(e) => {
                                // Middle click
                                if (e.button === 1) {
                                    e.preventDefault();
                                    ToggleFullscreen();
                                }
                            }}
                        >
                            <div className="w-[11px] h-[11px] bg-green-500 rounded-full flex items-center justify-center cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-sidebar border text-foreground font-geist">
                            <p className="text-xs"><span className="font-semibold text-muted-foreground">LMB</span> Stay on top</p>
                            <p className="text-xs"><span className="font-semibold text-muted-foreground">MMB</span> Fullscreen</p>
                            <p className="text-xs"><span className="font-semibold text-muted-foreground">RMB</span> Transparency</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip delayDuration={250}>
                        <TooltipTrigger onClick={() => {
                            MinimizeBackend()
                        }}>
                            <div className="w-[11px] h-[11px] bg-yellow-500 rounded-full flex items-center justify-center cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-sidebar border text-white">
                            <p className="text-xs">Minimize</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip delayDuration={250}>
                        <TooltipTrigger onClick={() => {
                            CloseBackend()
                        }}>
                            <div className="w-[11px] h-[11px] bg-red-500 rounded-full flex items-center justify-center cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-sidebar border text-white">
                            <p className="text-xs">Close</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            {!sidebar_open && (
                <div className="absolute top-0 right-0 left-[80px] h-6 z-40" onMouseDown={handleMouseDown} />
            )}
        </>
    )
}