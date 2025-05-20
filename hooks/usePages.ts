import { useEffect } from "react";
import { GetPages } from "@/apis/backend";
import useSWR from "swr";

export function usePages() {
  const { data: pages, error, isLoading } = useSWR(
    `GetPages`, GetPages, { refreshInterval: 10000 }
  );

  if (error) {
    console.error("Error fetching page:", error);
  }
  
  if (isLoading) {
    return [];
  }

  return pages;
}