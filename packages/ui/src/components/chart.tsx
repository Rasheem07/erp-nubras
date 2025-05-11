"use client"

import * as React from "react"

interface ChartConfig {
  [key: string]: {
    label: string
    color: string
  }
}

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config?: ChartConfig
}

export function ChartContainer({ config = {}, className, children, ...props }: ChartContainerProps) {
  // Create CSS variables for each color in the config
  const style = React.useMemo(() => {
    if (!config || Object.keys(config).length === 0) {
      return {
        "--color-chart-1": "hsl(var(--primary))",
        "--color-chart-2": "hsl(var(--muted-foreground))",
        "--color-chart-3": "hsl(var(--accent))",
      } as React.CSSProperties
    }

    return Object.entries(config).reduce(
      (acc, [key, value]) => {
        (acc as Record<string, string>)[`--color-${key}`] = value.color
        return acc
      },
      {
        "--color-chart-1": "hsl(var(--primary))",
        "--color-chart-2": "hsl(var(--muted-foreground))",
        "--color-chart-3": "hsl(var(--accent))",
      } as React.CSSProperties,
    )
  }, [config])

  return (
    <div className={className} style={style} {...props}>
      {children}
    </div>
  )
}

interface ChartTooltipProps extends React.ComponentPropsWithoutRef<"div"> {}

export function ChartTooltip({ className, ...props }: ChartTooltipProps) {
  return <div className={className} {...props} />
}

interface ChartTooltipContentProps extends React.ComponentPropsWithoutRef<"div"> {
  payload?: Array<{ name?: string; value?: number; payload?: Record<string, any> }>
  label?: string
  active?: boolean
}

export function ChartTooltipContent({ payload, label, active, ...props }: ChartTooltipContentProps) {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm" {...props}>
      <div className="grid grid-cols-2 gap-2">
        <div className="font-medium">{label}</div>
        <div className="font-medium">Value</div>
        {payload.map((entry) => (
          <React.Fragment key={entry.name}>
            <div className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: entry.payload?.color || "hsl(var(--primary))",
                }}
              />
              <span>{entry.name}</span>
            </div>
            <div>{entry.value}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

interface ChartLegendProps extends React.ComponentPropsWithoutRef<"div"> {}

export function ChartLegend({ className, ...props }: ChartLegendProps) {
  return <div className={className} {...props} />
}

interface ChartLegendContentProps extends React.ComponentPropsWithoutRef<"div"> {}

export function ChartLegendContent({ className, ...props }: ChartLegendContentProps) {
  return <div className={className} {...props} />
}

interface ChartStyleProps extends React.ComponentPropsWithoutRef<"style"> {}

export function ChartStyle({ className, ...props }: ChartStyleProps) {
  return <style {...props} />
}

interface ChartProps extends React.ComponentPropsWithoutRef<"div"> {
  type: string
  data: any
  options: any
}

export function Chart({ type, data, options, className, ...props }: ChartProps) {
  return <div className={className} {...props} />
}
