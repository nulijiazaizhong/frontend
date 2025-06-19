import React, { Component } from "react";
import { Slider } from "@/components/ui/slider";
import { translate } from "@/apis/translation";

interface SliderComponentProps {
    data: {
        id: string;
        default?: number;
        changed?: string;
        min?: number;
        max?: number;
        step?: number;
        style?: any;
        suffix?: string;
        disabled?: boolean;
    };
    send: (message: any) => void;
    url: string;
}

interface SliderComponentState {
    curSliderValue: number;
    tempSliderValue: number | null;
}

export class SliderComponent extends Component<SliderComponentProps, SliderComponentState> {
    constructor(props: SliderComponentProps) {
        super(props);
        const value = props.data.default;
        this.state = {
            curSliderValue: value ? value : 0,
            tempSliderValue: null
        };
    }

    handleValueCommit = (value: number[]) => {
        this.props.send({
            type: "function",
            data: {
                url: this.props.url,
                target: this.props.data.changed,
                args: [value[0]]
            }
        })
    }

    render() {
        const { data } = this.props;
        const { curSliderValue, tempSliderValue } = this.state;
        const value = tempSliderValue ? tempSliderValue : curSliderValue;
        const step = data.step || 1;
        const suffix = data.suffix || "";

        return (
            <Slider suffix={data.suffix} min={data.min} max={data.max} defaultValue={[value]} step={step} onValueCommit={this.handleValueCommit} className={data.style.classname} style={data.style} />
        );
    }
}