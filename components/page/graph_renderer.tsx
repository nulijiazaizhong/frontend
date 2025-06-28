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

    const x_key = data.x_key ? data.x_key : "x";
    const y_key = data.y_key ? data.y_key : "y";

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
                    <XAxis dataKey={x_key} hide={true} />
                    <YAxis dataKey={y_key} hide={true} />
                    <Area
                        type="natural"
                        dataKey={y_key}
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
                    <XAxis dataKey={x_key} hide={true} />
                    <YAxis dataKey={y_key} hide={true} />
                    <Line
                        type="natural"
                        dataKey={y_key}
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
                    <XAxis dataKey={x_key} hide={true} />
                    <YAxis dataKey={y_key} hide={true} />
                    <Bar
                        type="natural"
                        dataKey={y_key}
                        fill="url(#fill)"
                        isAnimationActive={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                </BarChart>
            </ChartContainer>
        )
    }
}