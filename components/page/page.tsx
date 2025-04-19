import { Skeleton } from "@/components/ui/skeleton"
import useSWR, { mutate } from "swr"
import { PluginFunctionCall, EnablePlugin } from "@/apis/backend"
import { Separator } from "../ui/separator"
import { Input } from "../ui/input"
import { GetSettingsJSON, SetSettingByKey, SetSettingByKeys } from "@/apis/settings"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import {
	TooltipProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "@/components/ui/tooltip"
import { Toggle } from "@/components/ui/toggle"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { toast } from "sonner"
import { useEffect } from "react"
import { Slider } from "../ui/slider"
import { useState } from "react"
import { translate } from "@/apis/translation"
import React, { Component } from 'react';
import { SkeletonItem } from "@/components/page/skeleton_item"
import {
	Check,
	X
} from "lucide-react"
import { Checkbox } from "../ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "../ui/progress"
import Markdown from "react-markdown"
import { AnimatePresence, motion } from "framer-motion"
// @ts-expect-error
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-expect-error
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useWebSocketPages } from "@/apis/ui_sockets"


export function ETS2LAPage({ url, data, enabled, className }: { url: string, data: any, enabled?: boolean, className?: string }) {
	const { send } = useWebSocketPages()

	if(enabled == undefined){
		enabled = true
	}

	const ParseClassname = (default_classname: string, data_classname: string) => {
		if (data_classname == undefined) {
			data_classname = default_classname
		}
		data_classname = data_classname.replace("default", default_classname);
		const classname = data_classname ? data_classname : default_classname;
		return classname
	}

	const TextRenderer = (data: any) => {
		const classname = ParseClassname("text-sm", data.style.classname);
		const style = data.style ? data.style : {};
		return <p className={classname} style={style} key={data.key}>{translate(data.text)}</p>
	}

	const ContainerRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};
		const children = data.children ? data.children : [];
		const result: any[] = PageRenderer(children);
		return <div className={classname} style={style} key={data.key}>{result}</div>
	}

	const SpaceRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};
		return <div className={classname} style={style} key={data.key}></div>
	}

	const LinkRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};
		return <a className={classname} style={style} href={data.url}>{data.text}</a>
	}

	const ButtonRenderer = (data: any) => {
		const classname = ParseClassname("bg-input/10 text-foreground border hover:bg-input/30", data.style.classname);
		const style = data.style ? data.style : {};
		const children = data.children ? data.children : [];
		const result: any[] = PageRenderer(children);
		return <Button className={classname} style={style} key={data.key} 
		onClick={() => {
			send({
				type: "function",
				data: {
					url: url,
					target: data.action,
					args: []
				}
		})}}>
			{result}
		</Button>
	}

    // @ts-ignore
	const PageRenderer = (data: any) => {
		if (!Array.isArray(data)) {
			data = [data]
		}
		const result: any[] = [];
		for (const item of data) {
			const key = Object.keys(item)[0];
			const key_data = item[key];
			
			if (key == "text") {
				result.push(TextRenderer(key_data));
			}
			if (key == "container") {
				result.push(ContainerRenderer(key_data));
			}
			if (key == "space") {
				result.push(SpaceRenderer(key_data));
			}
			if (key == "link") {
				result.push(LinkRenderer(key_data));
			}
			if (key == "button") {
				result.push(ButtonRenderer(key_data));
			}
		};

		return result;
	};

	return (
		<TooltipProvider delayDuration={0}>
			<div className={"text-left flex flex-col w-full gap-6 relative font-geist " + className}>
				{PageRenderer(data)}
				<div className="h-12"></div>
			</div>
		</TooltipProvider>
	)
}
