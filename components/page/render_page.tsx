import { ETS2LAPage } from "@/components/page/page";
import { GetPage } from "@/apis/backend";
import useSWR from "swr";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function RenderPage({ url, className }: { url: string, className?: string }) {
    const [refreshInterval, setRefreshInterval] = useState(1000); 
    const {data: page} = useSWR("page " + url, () => GetPage(url), { refreshInterval: refreshInterval });

    useEffect(() => {
        if (page && page[1] && "refresh_rate" in page[1]) {
            setRefreshInterval(page[1]["refresh_rate"] * 1000);
            console.log("Set refresh interval to " + page[1]["refresh_rate"] + " seconds");
        }
    }, [page]);

    if (!page) return (
        <div>
            <p className="text-muted-foreground text-xs">The page you are looking for was not found.</p>
        </div>
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