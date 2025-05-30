"use client"
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { ip } from "./backend";
import { set } from "react-hook-form";

type PageMap = { [url: string]: any }

const WSContext = createContext<{
  pages: PageMap;
  subscribe: (url: string) => () => void; // returns unsubscribe function
  send: (message: any) => void; // send message to server
}>({
  pages: {},
  subscribe: () => () => {},
  send: () => {},
});

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [pages, setPages] = useState<PageMap>({});
  const socket = useRef<WebSocket | null>(null);
  const activeSubscriptions = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const ws = new WebSocket(`ws://${ip}:37523`);
    socket.current = ws;
    setPages({}); // Initialize pages state

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const { url, data } = message;

      setPages((prev) => ({
        ...prev,
        [url]: data,
      }));
    };

    ws.onerror = (event) => {
      console.error("WebSocket error observed:", event);
    };

    ws.onopen = () => {
      // @ts-expect-error
      for (const [url] of activeSubscriptions.current.entries()) {
        ws.send(JSON.stringify({ type: "subscribe", url }));
      }
    };    

    return () => {
      ws.close();
    };
  }, [ip]);

  const subscribe = useCallback((url: string) => {
    const currentCount = activeSubscriptions.current.get(url) || 0;
    activeSubscriptions.current.set(url, currentCount + 1);
  
    if (currentCount === 0 && socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type: "subscribe", url }));
    }
  
    // Return an unsubscribe function
    return () => {
      const count = activeSubscriptions.current.get(url) || 0;
      if (count <= 1) {
        activeSubscriptions.current.delete(url);
        if (socket.current?.readyState === WebSocket.OPEN) {
          socket.current.send(JSON.stringify({ type: "unsubscribe", url }));
        }
      } else {
        activeSubscriptions.current.set(url, count - 1);
      }
    };
  }, []);

  const send = useCallback((message: any) => {
    if (socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not open. Cannot send message:", message);
    }
  }, []);  

  return (
    <WSContext.Provider value={{ pages, subscribe, send }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWebSocketPages = () => useContext(WSContext);
