"use client"
import { useEffect, useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { translate } from "@/apis/translation";
import ValueDialog from "./value-dialog";
import { ip } from "@/apis/backend";

interface AskMessage {
    ask: {
        text: string;
        options: string[];
        description: string;
    };
}

interface DialogMessage {
    dialog: {
        json: string;
    };
}

interface NavigateMessage {
    navigate: {
        url: string;
        reason?: string;
        sender: string;
    };
}

interface ToastMessage {
    type: 'error' | 'success' | 'info' | 'warning' | string;
    text: string;
}

type WebSocketMessage = AskMessage | DialogMessage | NavigateMessage | ToastMessage;

export function Popups() {
    const [dialogState, setDialogState] = useState({
        isOpen: false,
        title: { __html: "" },
        options: [] as string[],
        description: "",
    });
    
    const [valueDialogState, setValueDialogState] = useState({
        isOpen: false,
        json: "",
    });
    
    // Dialog return value
    const [returnValue, setReturnValue] = useState<any>(null);
    const returnValueRef = useRef<any>(null);
    
    const socketRef = useRef<WebSocket | null>(null);
    
    const router = useRouter();

    useEffect(() => {
        returnValueRef.current = returnValue;
    }, [returnValue]);

    const handleWebSocketMessage = useCallback((event: MessageEvent) => {
        try {
            const messageData = event.data;
            const message = JSON.parse(messageData) as WebSocketMessage;

            if ('ask' in message) {
                if (dialogState.isOpen) {
                    return; // Prevent multiple dialogs from opening
                }
                setDialogState({
                    isOpen: true,
                    title: { __html: `<div>${message.ask.text}</div>` },
                    options: message.ask.options,
                    description: message.ask.description,
                });
            } 

            else if ('dialog' in message) {
                setValueDialogState({
                    isOpen: true,
                    json: message.dialog.json,
                });
                setReturnValue(null);
                
                // Poll for return value
                const checkReturnValue = setInterval(() => {
                    if (returnValueRef.current !== null) {
                        if (socketRef.current?.readyState === WebSocket.OPEN) {
                            socketRef.current.send(JSON.stringify(returnValueRef.current));
                        }
                        setReturnValue(null);
                        clearInterval(checkReturnValue);
                    }
                }, 200);
            } 

            else if ('navigate' in message) {
                if (dialogState.isOpen) {
                    return; // Prevent multiple navigation requests from interrupting each other
                }
                const { url, reason, sender } = message.navigate;
                console.log(`Navigation request from ${sender} to ${url} with reason: ${reason || 'No reason provided'}`);
                setDialogState({
                    isOpen: true,
                    title: { __html: `<p>Navigation Request</p>` },
                    options: ["Allow", "Deny"],
                    description: `${sender} wants to navigate you to: ${url}${reason ? `\n"${reason}"` : ''}`,
                });
            } 

            else if ('type' in message && 'text' in message) {
                const { type, text } = message;
                
                switch (type) {
                    case 'error': toast.error(text); break;
                    case 'success': toast.success(text); break;
                    case 'info': toast.info(text); break;
                    case 'warning': toast.warning(text); break;
                    default: toast(text);
                }
            }
        } catch (error) {
            console.error("Error handling WebSocket message:", error);
        }
    }, []);

    useEffect(() => {
        if (ip !== "localhost") {
            toast.error("This device cannot connect to the websocket. You won't get notifications.");
            return;
        }

        const ws = new WebSocket(`ws://${ip}:37521`);
        socketRef.current = ws;

        ws.addEventListener("open", () => {
            toast.success(translate("frontend.immediate.connected"));
        });

        ws.addEventListener("message", handleWebSocketMessage);
        
        ws.addEventListener("close", () => {
            toast.error(translate("frontend.immediate.disconnected"));
        });
        
        ws.addEventListener("error", (event) => {
            console.error("WebSocket error observed:", event);
        });

        // Cleanup on unmount
        return () => {
            if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.close();
            }
            socketRef.current = null;
        };
    }, [handleWebSocketMessage]);

    // Handle dialog response
    const handleDialogResponse = (option: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            
            // Special case for navigation
            if (dialogState.title.__html.includes("Navigation Request") && option === "Allow") {
                // Extract URL from description (this is quite ugly)
                const urlMatch = dialogState.description.match(/navigate you to: ([^\n"]+)/);
                if (urlMatch && urlMatch[1]) {
                    router.push(`/page?url=${urlMatch[1]}`);
                }
            }
            else {
                socketRef.current.send(JSON.stringify({ response: option }));
            }
        }

        setDialogState(prev => ({ ...prev, isOpen: false })); 
    };

    const handleValueDialogResponse = useCallback((value: any) => {
        setValueDialogState(prev => ({ ...prev, isOpen: false }));
        setReturnValue(value);
    }, []);

    return (
        <div className="absolute gap-2 flex">
            <Dialog open={dialogState.isOpen} onOpenChange={(open) => 
                !open && setDialogState(prev => ({ ...prev, isOpen: false }))
            }>
                <DialogContent className="bg-sidebarbg font-geist">
                    <DialogHeader>
                        <DialogTitle>
                            <div dangerouslySetInnerHTML={dialogState.title} />
                        </DialogTitle>
                    </DialogHeader>
                    <DialogDescription style={{ whiteSpace: "pre-wrap" }}>
                        {dialogState.description}
                    </DialogDescription>
                    <div className="flex gap-2">
                        {dialogState.options.map((option, index) => (
                            <Button 
                                key={index} 
                                variant="outline" 
                                onClick={() => handleDialogResponse(option)}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

            <ValueDialog 
                open={valueDialogState.isOpen} 
                onClose={handleValueDialogResponse} 
                json={valueDialogState.json} 
            />
        </div>
    );
}