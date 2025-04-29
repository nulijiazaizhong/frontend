import { ParseClassname } from "./page";
import { useState } from "react";
import { useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../ui/command";
import { Check, ChevronsUpDown } from "lucide-react";

export function ComboboxRenderer({ data, url, send }: any) {
	const classname = ParseClassname("min-w-max", data.style?.classname);
	const style = data.style ?? {};
	const options = data.options ?? [];
	const changed = data.changed ?? null;
	const side = data.side ?? "bottom";
	const multiple = data.multiple ?? false;
	const disabled = data.disabled ?? false;
	const use_search = !!data.search;
	const search_placeholder = data.search?.placeholder ?? "Search";
	const search_empty = data.search?.empty ?? "No results found";

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState(
		multiple ? (data.default ? [data.default] : []) : (data.default ?? (options[0]?.value ?? ""))
	);

	useEffect(() => {
		if (changed) {
			send({
				type: "function",
				data: {
					url,
					target: changed,
					args: [value]
				}
			});
		}
	}, [value]);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={classname}
					disabled={disabled}
					style={style}
				>
					{multiple ? `${value.length} selected` : value || "Select option..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<AnimatePresence>
				{open && (
					<PopoverContent asChild className="p-0 w-full font-geist" side={side} forceMount>
						<motion.div
							initial={{ opacity: 0, scale: 0.8, y: -12 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.8, y: -12 }}
							transition={{ duration: 0.1, ease: "easeInOut" }}
						>
							<Command className="bg-sidebarbg max-h-64">
								{use_search && (
									<CommandInput placeholder={search_placeholder} className="h-9" />
								)}
								<CommandList>
									<CommandEmpty className="text-muted-foreground text-xs py-3 wrap justify-self-center h-10">
										{search_empty}
									</CommandEmpty>
									<CommandGroup>
										{options.map((option: any) => {
											const optionValue = typeof option === "string" ? option : option?.value;
											const isSelected = multiple
												? value.includes(optionValue)
												: value === optionValue;
											return (
												<CommandItem
													key={optionValue}
													value={optionValue}
													onSelect={(currentValue) => {
														if (multiple) {
															setValue((prev: any) =>
																prev.includes(currentValue)
																	? prev.filter((v: any) => v !== currentValue)
																	: [...prev, currentValue]
															);
														} else {
															setValue(currentValue === value ? "" : currentValue);
															setOpen(false);
														}
													}}
													className="text-foreground"
												>
													{optionValue}
													<Check
														className={`ml-auto h-4 w-4 ${
															isSelected ? "opacity-100" : "opacity-0"
														}`}
													/>
												</CommandItem>
											);
										})}
									</CommandGroup>
								</CommandList>
							</Command>
						</motion.div>
					</PopoverContent>
				)}
			</AnimatePresence>
		</Popover>
	);
}
