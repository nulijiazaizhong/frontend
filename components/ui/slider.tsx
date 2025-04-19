"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import * as SliderPrimitive from "@radix-ui/react-slider"
import * as React from "react"
import { cn } from "@/lib/utils"

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  suffix = "",
  onValueChange,
  onValueCommit,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  suffix?: string,
  onValueChange?: (value: number[]) => void
}) {
  const [draggingIndex, setDraggingIndex] = React.useState<number | null>(null);
  const [_values, setValues] = React.useState<number[]>(
    Array.isArray(value)
      ? value
      : Array.isArray(defaultValue)
        ? defaultValue
        : [min, max]
  );

  // @ts-expect-error
  const [inputValue, setInputValue] = React.useState(String(_values[draggingIndex]));

  React.useEffect(() => {
    // @ts-expect-error
    setInputValue(String(_values[draggingIndex]));
  // @ts-expect-error
  }, [_values[draggingIndex]]);

  const handleCommit = () => {
    const parsed = parseFloat(inputValue);
    if (!isNaN(parsed) && parsed >= min && parsed <= max) {
      const newValues = [..._values];
      // @ts-expect-error
      newValues[draggingIndex] = parsed;
      setValues(newValues);
      onValueChange?.(newValues);
      onValueCommit?.(newValues);
    } else {
      // @ts-expect-error
      setInputValue(String(_values[draggingIndex])); // Revert on invalid
    }
  };

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value ?? _values}
      min={min}
      max={max}
      onPointerLeave={() => setDraggingIndex(null)}
      className={cn(
        "relative flex w-full touch-none items-center select-none data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
        className
      )}
      onValueChange={(val) => {
        setValues(val);
        onValueChange?.(val);
      }}
      onValueCommit={(val) => {
        onValueCommit?.(val);
      }}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          "bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className="bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
        />
      </SliderPrimitive.Track>

      {Array.from({ length: _values.length }, (_, index) => (
        <Tooltip key={index} open={draggingIndex === index}>
          <TooltipTrigger asChild>
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              className="border-primary bg-background ring-ring/50 block size-3.5 hover:size-4 active:size-3 shrink-0 rounded-full border shadow-sm transition-all duration-100 hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
              onPointerOver={() => setDraggingIndex(index)}
              onPointerDown={() => setDraggingIndex(index)}
              onPointerUp={() => setDraggingIndex(null)}
            />
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="text-xs bg-background border text-foreground font-geist font-light p-1"
          >
            <input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
                  e.stopPropagation();
                }

                if (e.key === "Enter") {
                  handleCommit();
                } else if (e.key === "Escape") {
                  setInputValue(String(_values[index])) // revert
                }
              }}
              className="w-8 text-center bg-transparent focus:outline-none"
              onBlur={handleCommit}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            />
            {suffix && <span className="ml-1">{suffix}</span>}
          </TooltipContent>
        </Tooltip>
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
