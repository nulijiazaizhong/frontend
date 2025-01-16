"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react";
import { translate, currentLanguage } from "@/apis/translation";
import { Button } from "./ui/button";

export function Disclaimer({ closed_callback }: { closed_callback: () => void }) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>

            </DialogTrigger>
            <DialogContent className="font-geist">
                <DialogHeader>
                    <DialogTitle>{translate("frontend.disclaimer.title")}</DialogTitle>
                </DialogHeader>
                <p className="text-muted-foreground">{translate("frontend.disclaimer.description.line1")}</p>
                <p className="text-muted-foreground">{translate("frontend.disclaimer.description.line2")}</p>
                <Button variant={"outline"} onClick={
                    () => {
                        setIsOpen(false);
                        closed_callback();
                    }
                }>
                    {translate("frontend.disclaimer.ok")}
                </Button>
            </DialogContent>
        </Dialog>
    )
}