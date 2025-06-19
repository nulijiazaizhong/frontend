import { ParseClassname } from "./page";
import { useState } from "react";
import { Input } from "../ui/input";

export function InputRenderer({ data, url, send }: any) {
	const classname = ParseClassname("", data.style?.classname);
	const style = data.style ?? {};
	const changed = data.changed ?? null;
	const type = data.type ?? "text";
	const default_value = data.default ?? "";

	const [value, setValue] = useState("");

	return (
		<Input
			className={classname}
			style={style}
			value={value}
			type={type}
			placeholder={default_value}
			onChange={(e) => {
				if (type === "number") {
					// @ts-ignore
					setValue(e.target.valueAsNumber);
				} else {
					setValue(e.target.value);
				}
			}}
			onKeyDown={(e) => {
				if (e.key === "Enter" && changed) {
					send({
						type: "function",
						data: {
							url,
							target: changed,
							args: [value]
						}
					});
				}
			}}
			onBlur={() => {
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
			}}
		/>
	);
}
