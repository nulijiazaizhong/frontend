import { ParseClassname } from "./page";
import { useState, useEffect } from "react";

import { XAxis, YAxis, CartesianGrid } from "recharts"
import { Area, AreaChart } from "recharts"
import { Line, LineChart } from "recharts"
import { Bar, BarChart } from "recharts"
import { Pie, PieChart } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartLegend,
    ChartLegendContent
} from "@/components/ui/chart"

export function GraphRenderer({ data, url, send }: any) {
    const classname = ParseClassname("h-full w-full", data.style.classname);
    const style = data.style ? data.style : {};

    const graph_data = data.data ? data.data : [];
    const graph_config = data.config ? data.config satisfies ChartConfig : {} satisfies ChartConfig;
    const type = data.type ? data.type : "area";

    const x = data.x ? data.x : {};
    const y = data.y ? data.y : {};

    if (type === "area") {
        return (
            <ChartContainer config={graph_config} className={classname} style={style}>
                <AreaChart data={graph_data}>
                    <defs>
                        <linearGradient id={"fill"} x1="0" y1="0" x2="0" y2="1">
                            <stop
                            offset="5%"
                            stopColor="#255579"
                            stopOpacity={0.9}
                            />
                            <stop
                            offset="95%"
                            stopColor="#255579"
                            stopOpacity={0.2}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid horizontal={true} vertical={false} />
                    <XAxis dataKey={x.data_key} hide={x.hide} domain={[x.min, x.max]} />
                    <YAxis dataKey={y.data_key} hide={y.hide} domain={[y.min, y.max]} />
                    <Area
                        type="natural"
                        dataKey={y.data_key}
                        fill="url(#fill)"
                        isAnimationActive={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                </AreaChart>
            </ChartContainer>
        )
    }

    if (type === "line") {
        return (
            <ChartContainer config={graph_config} className={classname} style={style}>
                <LineChart data={graph_data}>
                    <CartesianGrid horizontal={true} vertical={false} />
                    <XAxis dataKey={x.data_key} hide={x.hide} domain={[x.min, x.max]} />
                    <YAxis dataKey={y.data_key} hide={y.hide} domain={[y.min, y.max]} />
                    <Line
                        type="natural"
                        dataKey={y.data_key}
                        isAnimationActive={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                </LineChart>
            </ChartContainer>
        )
    }
    if (type === "bar") {
        return (
            <ChartContainer config={graph_config} className={classname} style={style}>
                <BarChart data={graph_data}>
                    <defs>
                        <linearGradient id={"fill"} x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor="#255579"
                                stopOpacity={0.9}
                            />
                            <stop
                                offset="95%"
                                stopColor="#255579"
                                stopOpacity={0.2}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid horizontal={true} vertical={false} />
                    <XAxis dataKey={x.data_key} hide={x.hide} domain={[x.min, x.max]} />
                    <YAxis dataKey={y.data_key} hide={y.hide} domain={[y.min, y.max]} />
                    <Bar
                        type="natural"
                        dataKey={y.data_key}
                        fill="url(#fill)"
                        isAnimationActive={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
            </ChartContainer>
        )
    }
}