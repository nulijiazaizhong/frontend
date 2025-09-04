import { ParseClassname } from "./page";
import { useState, useEffect } from "react";
import { Checkbox } from "../ui/checkbox";
import { set } from "react-hook-form";

export function CheckboxRenderer({ data, url, send }: any) {
	const classname = ParseClassname("", data.style?.classname);
	const style = data.style ?? {};
	const changed = data.changed ?? null;
	const default_value = data.default ?? false;

	const [checked, setChecked] = useState(default_value);
	const [update, setUpdate] = useState(false);

	useEffect(() => {
		if (changed != null && update) {
			send({
				type: "function",
				data: {
					url,
					target: changed,
					args: [checked]
				}
			});
		}
		setUpdate(false);
	}, [update]);

	useEffect(() => {
		setChecked(default_value);
	}, [default_value]);

	return (
		<Checkbox
			className={classname}
			style={style}
			checked={checked}
			onCheckedChange={(checked) => {
				setChecked(checked);
				setUpdate(true);
			}}
		/>
	);
}
