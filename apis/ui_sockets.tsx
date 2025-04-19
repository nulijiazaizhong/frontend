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
  const activeSubscriptions = useRef<Set<string>>(new Set());

  useEffect(() => {
    const ws = new WebSocket(`ws://${ip}:37523`);
    socket.current = ws;

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

    return () => {
      ws.close();
    };
  }, [ip]);

  const subscribe = useCallback((url: string) => {
    if (socket.current) {
      if (!activeSubscriptions.current.has(url)) {
        activeSubscriptions.current.add(url);
      }
      if (socket.current.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify({ type: "subscribe", url }));
      }
    }

    // Return an unsubscribe function
    return () => {
      if (socket.current && activeSubscriptions.current.has(url)) {
        activeSubscriptions.current.delete(url);
        if (socket.current?.readyState === WebSocket.OPEN) {
          socket.current.send(JSON.stringify({ type: "unsubscribe", url }));
        }
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
