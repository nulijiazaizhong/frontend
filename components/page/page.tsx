import { Separator } from "../ui/separator"
import {
	TooltipProvider,
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from "@/components/ui/tooltip"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import { translate } from "@/apis/translation"
import React, { Component } from 'react';
import {
	Check,
	X,
	ChevronsUpDown
} from "lucide-react"
import * as Icons from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Markdown from "react-markdown"
import { AnimatePresence, motion } from "framer-motion"
// @ts-expect-error
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-expect-error
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useWebSocketPages } from "@/apis/ui_sockets"
import { SliderComponent } from "@/components/page/slider"

import { InputRenderer } from "./input_renderer"
import { ComboboxRenderer } from "./combobox_renderer"
import { CheckboxRenderer } from "./checkbox_renderer"
import { GraphRenderer } from "./graph_renderer"
import Page from "@/app/page/page"

export function ParseClassname(default_classname: string, data_classname: string) {
	if (data_classname == undefined) {
		data_classname = default_classname
	}
	data_classname = data_classname.replace("default", default_classname);
	const classname = data_classname ? data_classname : default_classname;
	return classname
}

export function ETS2LAPage({ url, data, enabled, className }: { url: string, data: any, enabled?: boolean, className?: string }) {
	const { send } = useWebSocketPages()

	if(enabled == undefined){
		enabled = true
	}

	const TextRenderer = (data: any) => {
		const classname = ParseClassname("text-sm", data.style.classname);
		const style = data.style ? data.style : {};
		return <p className={classname} style={style} key={data.key}>{translate(data.text)}</p>
	}

	const TextAreaRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const placeholder = data.placeholder ? data.placeholder : "";
		const changed_callback = data.changed ? data.changed : null;
		const style = data.style ? data.style : {};
		const disabled = data.disabled ? data.disabled : false;

		return <Textarea className={classname} style={style} key={data.id} placeholder={placeholder} disabled={disabled} onChange={(e) => {
			send({
				type: "function",
				data: {
					url: url,
					target: changed_callback,
					args: [e.target.value]
				}
			})
		}}/>
	}

	const BadgeRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};
		const children = data.children ? data.children : [];
		const result: any[] = PageRenderer(children);
		return <Badge variant={data.variant} className={classname} style={style} key={data.id}>{result}</Badge>
	}

	const ContainerRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};
		const children = data.children ? data.children : [];
		const result: any[] = PageRenderer(children);
		return <div className={classname} style={style} key={data.key} onClick={() => {
			if (data.pressed)
			{
				send({
					type: "function",
					data: {
						url: url,
						target: data.pressed,
						args: []
					}
				})
			}
		}}>{result}</div>
	}

	const SpaceRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};
		return <div className={classname} style={style} key={data.key}></div>
	}

	const LinkRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};

		const protocol = data.url ? data.url.split("://")[0] : "";
		const root = data.url ? data.url.split("://")[1].split("/")[0] : "";
		const path = data.url ? data.url.split("://")[1].split("/").slice(1).join("/") : "";

		const isHTTP = protocol.toLowerCase() === "http";
		const isETS2LA = root.toLowerCase().split(".").slice(-2, -1)[0] === "ets2la";
		const isDonation = root.toLowerCase() === "patreon.com" || root.toLowerCase() === "ko-fi.com";

		const officialDonationUrls = [
			"https://ko-fi.com/tumppi066",
		]
		const isOfficialDonation = officialDonationUrls.includes(data.url.toLowerCase());

		return (
			<Tooltip>
				<TooltipTrigger className={classname} style={style}>
					<a className={classname} style={style} href={data.url} target="_blank" key={data.key}>{translate(data.text)}</a>
				</TooltipTrigger>
				<TooltipContent>
					<div className="flex">
						<a href={data.url} target="_blank" className="text-xs text-muted-foreground">{protocol}{"://"}</a>
						<a href={data.url} target="_blank" className="text-xs">{root}</a>
						<a href={data.url} target="_blank" className="text-xs text-muted-foreground">{"/"}{path}</a>
					</div>
					{isDonation && !isOfficialDonation
						? <>
							<Separator className="mt-2 mb-2" />
							<p className="text-xs text-muted-foreground mt-2">{"This donation won't directly support ETS2LA."}<br />Donating to plugin developers is encouraged.</p>
						</>
						: isOfficialDonation ?
							<>
								<Separator className="mt-2 mb-2" />
								<p className="text-xs text-muted-foreground mt-2">This is an official donation link for ETS2LA.</p>
							</>
						: null
					}
					{isETS2LA
						? <>
							<Separator className="mt-2 mb-2" />
							<p className="text-xs text-muted-foreground">This is an official ETS2LA link</p>
						</>
						: null
					}
					{isHTTP 
						? <>
							<Separator className="mt-2 mb-2" />
							<p className="text-xs text-muted-foreground">Warning: This link is HTTP, the connection is not secure.<br />Do not send passwords or sensitive information.</p> 
						</>
						: null
					}
				</TooltipContent>
			</Tooltip>
		)
	}
	
	const AlertRenderer = (data: any) => {
		const classname = ParseClassname("border rounded-md p-4 bg-input/10", data.style.classname);
		const style = data.style ? data.style : {};
		const children = data.children ? data.children : [];
		const result: any[] = PageRenderer(children);
		return <div className={classname} style={style} key={data.id}>
			{result}
		</div>
	}

	const IconRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};
		const icon_name = data.icon ?? "circle-help";
		const words = icon_name.split("-");
		// @ts-expect-error
		const name = words[0].charAt(0).toUpperCase() + words[0].slice(1) + words.slice(1).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("");

		// Get icon component by name (fallback to X if not found)
		const LucideIcon = Icons[name as keyof typeof Icons] ?? Icons.CircleHelp;
	  
		// @ts-expect-error
		return <LucideIcon className={classname} style={style} />;
	};

	const ButtonRenderer = (data: any) => {
		const type = data.type ? data.type : "default";

		const default_classname = type != "link" ? "bg-input/10 text-foreground border hover:bg-input/30" : "p-0 h-4";
		const classname = ParseClassname(default_classname, data.style.classname);
		const style = data.style ? data.style : {};
		const enabled = data.enabled;

		const children = data.children ? data.children : [];
		const result: any[] = PageRenderer(children);
		
		const name: string = data.name ? data.name : "";
		
		return <Button className={classname} style={style} key={data.key} variant={type} disabled={!enabled}
		onClick={() => {
			send({
				type: "function",
				data: {
					url: url,
					target: data.action,
					args: name ? [name] : []
				}
		})}}>
			{result}
		</Button>
	}

	const MarkdownRenderer = (data: any) => {
		const classname = ParseClassname("whitespace-normal w-full", data.style.classname);
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

	const TooltipRenderer = (data: any) => {
		const trigger_classname = ParseClassname("", data.trigger.style.classname);
		const trigger_style = data.trigger.style ? data.trigger.style : {};

		const content_classname = ParseClassname("", data.content.style.classname);
		const content_style = data.content.style ? data.content.style : {};

		const trigger_children = data.trigger.children ? data.trigger.children : [];
		const trigger: any[] = PageRenderer(trigger_children);

		const content_children = data.content.children ? data.content.children : [];
		const content = PageRenderer(content_children);

		const side = data.side ? data.side : "top";

		return (
			<Tooltip>
				<TooltipTrigger className={trigger_classname} style={trigger_style}>
					{trigger}
				</TooltipTrigger>
				<TooltipContent className={content_classname} style={content_style} side={side}>
					{content}
				</TooltipContent>
			</Tooltip>
		)
	}

	const SeparatorRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};
		const dir = data.direction ? data.direction : "horizontal";
		
		return <Separator className={classname} style={style} key={data.key} orientation={dir}></Separator>
	}

	const TabRenderer = (data: any) => {
		const classname = ParseClassname("w-full bg-transparent p-0", data.style.classname);
		const style = data.style ? data.style : {};
		const changed = data.changed ? data.changed : null;
		const children = data.children ? data.children : [];
		
		// Force remounting of tabs when children change with this key
		const tabKey = `tabs-${url}-${JSON.stringify(data.children.map((c: any) => c.tab.name))}`;
		const defaultValue = children.length > 0 ? children[0].tab.name : "";
		
		return (
			<Tabs 
				className="w-full" 
				defaultValue={defaultValue} 
				key={tabKey}
				onValueChange={(value) => {
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
				}}
			>
				<TabsList className={classname} style={style}>
					{children.map((tab: any, index: number) => (
						<TabsTrigger 
							key={index} 
							value={tab.tab.name} 
							className={ParseClassname("", tab.tab.trigger_style.classname)} 
							style={tab.tab.trigger_style}
						>
							{translate(tab.tab.name)}
						</TabsTrigger>
					))}
				</TabsList>
	
				{children.map((tab: any, index: number) => (
					<TabsContent 
						key={index} 
						value={tab.tab.name} 
						className={ParseClassname("pt-4", tab.tab.container_style.classname)} 
						style={tab.tab.container_style}
					>
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

	const SpinnerRenderer = (data: any) => {
		return <div className="animate-spin w-max h-max text-gray-500">
			{PageRenderer(data.children)}
		</div>
	}

	const ImageRenderer = (data: any) => {
		const classname = ParseClassname("w-max h-max max-w-full max-h-full", data.style.classname);
		const style = data.style ? data.style : {};
		const url = data.url ? data.url : "";
		const base64 = data.base64 ? data.base64 : "";
		const alt = data.alt ? data.alt : "Image";

		if (!url && !base64) {
			return <p className="text-red-500">No image URL or base64 provided</p>;
		}

		if (url) {
			return <img className={classname} style={style} key={data.key} src={url} alt={alt} />;
		}

		if (base64) {
			return <img className={classname} style={style} key={data.key} src={`data:image/png;base64,${base64}`} alt={alt} />;
		}

		return <p className="text-red-500" key={data.key}>Invalid image data</p>;
	}

	const YoutubeRenderer = (data: any) => {
		const classname = ParseClassname("w-full h-full", data.style.classname);
		const style = data.style ? data.style : {};
		const videoId = data.video_id ? data.video_id : "";
		if (!videoId) {
			return <p className="text-red-500">No video ID provided</p>;
		}
		return (
			<div className={classname} style={style} key={data.key}>
				<iframe
					width="100%"
					height="100%"
					src={`https://www.youtube.com/embed/${videoId}`}
					frameBorder="0"
					allowFullScreen
				></iframe>
			</div>
		);
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
			
			try {
				if (key == "text") {
					result.push(TextRenderer(key_data));
				}
				if (key == "badge") {
					result.push(BadgeRenderer(key_data));
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
				if (key == "textarea") {
					result.push(TextAreaRenderer(key_data));
				}
				if (key == "markdown") {
					result.push(MarkdownRenderer(key_data));
				}
				if (key == "tooltip") {
					result.push(
						TooltipRenderer(key_data)
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
				if (key == "combobox") {
					result.push(
						<ComboboxRenderer data={key_data} url={url} send={send} key={key_data.key} />
					)
				}
				if (key == "alert") {
					result.push(AlertRenderer(key_data));
				}
				if (key == "icon") {
					result.push(IconRenderer(key_data));
				}
				if (key == "checkbox") {
					result.push(
						<CheckboxRenderer data={key_data} url={url} send={send} key={key_data.key} />
					)
				}
				if (key == "input") {
					result.push(
						<InputRenderer data={key_data} url={url} send={send} key={key_data.key} />
					)
				}
				if (key == "spinner") {
					result.push(SpinnerRenderer(key_data));
				}
				if (key == "graph") {
					result.push(
						<GraphRenderer data={key_data} url={url} send={send} key={key_data.key} />
					)
				}
				if (key == "image") {
					result.push(ImageRenderer(key_data));
				}
				if (key == "youtube") {
					result.push(YoutubeRenderer(key_data));
				}

			} catch (error) {
				result.push(
					<p className="text-red-500" key={key_data.key + "-error"}>Error rendering {key}: {error instanceof Error ? error.message : String(error)}</p>
				)
			}
		};

		return result;
	};

	return (
		<TooltipProvider delayDuration={0}>
			<div className={"text-left flex flex-col w-full gap-6 relative font-geist h-full " + className}>
				{PageRenderer(data)}
			</div>
		</TooltipProvider>
	)
}
