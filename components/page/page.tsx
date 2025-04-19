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
import { SliderComponent } from "@/components/page/slider"


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
		return <a className={classname} style={style} href={data.url} target="_blank" key={data.key}>{translate(data.text)}</a>
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

	const MarkdownRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};

		return (
			<Markdown
				components={{
				// @ts-expect-error
				code({node, inline, className, children, ...props}) {
					const hasLineBreaks = String(children).includes('\n');
					const match = /language-(\w+)/.exec(className || '');
					const lang = match ? match[1] : 'json';
					
					// For inline code (no line breaks)
					if (!hasLineBreaks) {
						return (
						<code
							className="rounded-md bg-accent p-1 font-geist-mono text-xs"
							{...props}
						>
							{children}
						</code>
						);
					}
				
					// For code blocks (has line breaks)
					return (
						<SyntaxHighlighter
						language={lang}
						style={vscDarkPlus}
						customStyle={{
							margin: ('0 0'),
							padding: '1rem',
							borderRadius: '0.5rem',
							fontSize: '0.75rem',
							fontFamily: 'var(--font-geist-mono)'
						}}
						>
						{String(children).replace(/\n$/, '')}
						</SyntaxHighlighter>
					);
				},
				// Custom renderer for images
				img({node, ...props}) {
					return (
						<img
						{...props}
						className="rounded-md"
						/>
					);
				},
			}} className={classname}>
				{data.text}
			</Markdown>
		);
	}

	const TooltipRenderer = (data: any, tooltip_data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};

		const tooltip_children = data.children ? data.children : [];
		const tooltip_result: any[] = PageRenderer(tooltip_children);

		const content_classname = ParseClassname("", tooltip_data.style.classname);
		const content_style = tooltip_data.style ? tooltip_data.style : {};

		const content_children = tooltip_data.children ? tooltip_data.children : [];
		const content_result: any[] = PageRenderer(content_children);

		return (
			<Tooltip>
				<TooltipTrigger className={classname} style={style}>
					{tooltip_result}
				</TooltipTrigger>
				<TooltipContent className={content_classname} style={content_style}>
					{content_result}
				</TooltipContent>
			</Tooltip>
		)
	}

	const SeparatorRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};
		const dir = data.style.dir ? data.style.dir : "horizontal";
		
		return <Separator className={classname} style={style} key={data.key} orientation={dir}></Separator>
	}

	const TabRenderer = (data: any) => {
		const classname = ParseClassname("w-full bg-transparent p-0", data.style.classname);
		const style = data.style ? data.style : {};
		const changed = data.changed ? data.changed : null;
		const children = data.children ? data.children : [];
		
		return (
			<Tabs className="w-full" defaultValue={data.children[0].tab.name} onValueChange={(value) => {
				if (changed) {
					send({
						type: "function",
						data: {
							url: url,
							target: changed,
							args: [value]
						}
					})
				}
			}}>
				<TabsList className={classname} style={style}>
					{children.map((tab: any, index: number) => (
						<TabsTrigger key={index} value={tab.tab.name} className={ParseClassname("", tab.tab.trigger_style.classname)} style={tab.tab.trigger_style}>{translate(tab.tab.name)}</TabsTrigger>
					))}
				</TabsList>

				{children.map((tab: any, index: number) => (
					<TabsContent key={index} value={tab.tab.name} className={ParseClassname("pt-4", tab.tab.container_style.classname)} style={tab.tab.container_style}>
						{PageRenderer(tab.tab.children)}
					</TabsContent>
				))}

			</Tabs>
		)
	}

	const SliderRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		data.style.classname = classname
		return <SliderComponent key={data.id} url={url} data={data} send={send}></SliderComponent>
	}

    // @ts-ignore
	const PageRenderer = (data: any) => {
		if (!Array.isArray(data)) {
			data = [data]
		}
		const result: any[] = [];
		const tooltip_content: any = {};
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
			if (key == "markdown") {
				result.push(MarkdownRenderer(key_data));
			}
			if (key == "tooltip_content") {
				tooltip_content[key_data.id] = key_data;
			}
			if (key == "tooltip") {
				result.push(
					TooltipRenderer(key_data, tooltip_content[key_data.content])
				);
			}
			if (key == "separator") {
				result.push(SeparatorRenderer(key_data));
			}
			if (key == "tabs") {
				result.push(TabRenderer(key_data));
			}
			if (key == "slider") {
				result.push(SliderRenderer(key_data));
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
