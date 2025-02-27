import { ETS2LAPage } from "@/components/page/page";
import { GetPage } from "@/apis/backend";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Loader from "../loader";

export default function RenderPage({ url, className }: { url: string, className?: string }) {
    const [refreshInterval, setRefreshInterval] = useState(1000); 
    const [showTooLong, setShowTooLong] = useState(false);
    const {data: page} = useSWR("page " + url, () => GetPage(url), { refreshInterval: refreshInterval });

    useEffect(() => {
        if (page && page[1] && "refresh_rate" in page[1]) {
            setRefreshInterval(page[1]["refresh_rate"] * 1000);
            console.log("Set refresh interval to " + page[1]["refresh_rate"] + " seconds");
        }
    }, [page]);

    useEffect(() => {
        setTimeout(() => {
            setShowTooLong(true);
        }, 3000);
    }, []);

    if (!page) return (
        <motion.div className="w-full h-full flex flex-col items-center justify-center gap-2 font-geist" layout>
            <Loader className={"opacity-50"} />
            <p className="text-muted-foreground text-xs text-center">
                Fetching page...
                {showTooLong && 
                    <motion.p className="text-muted-foreground text-xs" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 15 }} transition={{ duration: 0.4}}>
                        This page might not exist, or it has an error loading.
                    </motion.p>
                }
            </p>
        </motion.div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
        >
            <ETS2LAPage plugin={page[0]["settings"]} data={page} enabled={true} className={className} />
        </motion.div>
    );
}