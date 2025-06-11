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

	const BadgeRenderer = (data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};
		const children = data.children ? data.children : [];
		const result: any[] = PageRenderer(children);
		return <Badge variant={data.variant} className={classname} style={style} key={data.key}>{result}</Badge>
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
		return <a className={classname} style={style} href={data.url} target="_blank" key={data.key}>{translate(data.text)}</a>
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

	const TooltipRenderer = (data: any, tooltip_data: any) => {
		const classname = ParseClassname("", data.style.classname);
		const style = data.style ? data.style : {};

		const tooltip_children = data.children ? data.children : [];
		const tooltip_result: any[] = PageRenderer(tooltip_children);

		const content_classname = ParseClassname("bg-sidebarbg border font-geist", tooltip_data.style.classname);
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
		const dir = data.direction ? data.direction : "horizontal";
		
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

	const SpinnerRenderer = (data: any) => {
		return <div className="animate-spin w-max h-max text-gray-500">
			{PageRenderer(data.children)}
		</div>
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
