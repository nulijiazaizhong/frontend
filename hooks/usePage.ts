import { useEffect } from "react";
import { useWebSocketPages } from "../apis/ui_sockets";

export function usePage(url: string) {
  const { pages, subscribe } = useWebSocketPages();

  useEffect(() => {
    const unsubscribe = subscribe(url);
    return () => {
      unsubscribe();
    };
  }, [url, subscribe]);

  return pages[url];
}