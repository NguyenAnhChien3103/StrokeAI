"use client";
import React from 'react';
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart ,  Tooltip as RechartsTooltip,  } from "recharts"
import { CartesianGrid, XAxis , ResponsiveContainer , } from "recharts"
import { Container } from 'react-bootstrap';
import { Bar, BarChart } from "recharts"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/chart"

const thresholds = {
  "Huyết áp": { warning: 120, alert: 140 },
  "Mạch đập": { warning: 80, alert: 100 },
  "Nhiệt độ": { warning: 37.5, alert: 39 },
  "SP02": { warning: 95, alert: 90 }, 
  "PH": { warning: 7.2, alert: 6.8 }, 
} as const;

const rawData = [
  { metric: "Huyết áp", rawValue: 130 },
  { metric: "Mạch đập", rawValue: 105 },
  { metric: "Nhiệt độ", rawValue: 38.5 },
  { metric: "SP02", rawValue: 92 },
  { metric: "PH", rawValue: 7.0 },
];

const radiusChartData = [{ safe: 65, risk: 35 }];

function normalizeData() {
  return rawData.map(({ metric, rawValue }) => {
    const threshold = thresholds[metric as keyof typeof thresholds];
    let value = 50; 

    if (metric === "PH") {
      if (rawValue <= 7.0) value = 90;
      else if (rawValue <= 7.4) value = 70;
    } else if (threshold) {
      if (metric === "SP02") {
        if (rawValue <= threshold.alert) {
          value = 90;
        } else if (rawValue <= threshold.warning) {
          value = 70;
        }
      } else {
        if (rawValue >= threshold.alert) {
          value = 90;
        } else if (rawValue >= threshold.warning) {
          value = 70;
        }
      }
    }

    return { metric, rawValue, value };
  });
}

console.log(normalizeData());

type DotProps = {
  cx?: number;
  cy?: number;
  stroke?: string;
  payload?: {
    metric: keyof typeof thresholds;
    value: number;
    rawValue: number;
  };
  value?: number;
  index?: number;
};



const barChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]


const chartConfig = {
  safe: {
    label: "An toàn",
    color: "hsl(var(--green-500))",
  },
  risk: {
    label: "Nguy cơ đột quỵ",
    color: "hsl(var(--red-500))",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig



export default function Dashboard() {
  const radarChartData = normalizeData(); 
  const safe = radiusChartData[0].safe;
  const risk = radiusChartData[0].risk;
  
  return (
   <>
   <Container className='h-full'>
   <div className='flex gap-2 h-full'>
   <div className="w-[40%] h-full">
   <Card className="h-full">
      <CardHeader className="items-center">
        <CardTitle>Radar Chart - Health Metrics</CardTitle>
        <CardDescription>Monitoring health indicators</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart data={radarChartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <RechartsTooltip
              formatter={(_, __, props) => `Raw: ${props.payload.rawValue}`}
              labelFormatter={(label) => `Metric: ${label}`}
            />
            <Radar
              dataKey="value"
              fill="#4f46e5"
              fillOpacity={0.4}
              dot={(props: DotProps) => {
                const { cx, cy, payload, value, index, stroke } = props;
                if (!payload || cx == null || cy == null || value == null) {
                  return (
                    <circle
                      key={`empty-dot-${index}`}
                      cx={0}
                      cy={0}
                      r={0}
                      fill="transparent"
                    />
                  );
                }
                const raw = payload.rawValue;
                const threshold = thresholds[payload.metric];
                let dotFill = "#4f46e5"; 
                let r = 4;

                if (payload.metric === "SP02") {
                  if (raw <= threshold.alert) {
                    dotFill = "red";
                    r = 10;
                  } else if (raw <= threshold.warning) {
                    dotFill = "orange";
                    r = 7;
                  }
                } else {
                  if (raw >= threshold.alert) {
                    dotFill = "red";
                    r = 10;
                  } else if (raw >= threshold.warning) {
                    dotFill = "orange";
                    r = 7;
                  }
                }

                return (
                  <circle
                    key={`dot-${payload.metric}-${index}`}
                    cx={cx}
                    cy={cy}
                    r={r}
                    fill={dotFill}
                    stroke={stroke}
                  />
                );
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
      </CardFooter>
    </Card>
      </div>
      <div className="w-[60%] h-full">
     
      <Card className="flex flex-col">
  <CardHeader className="items-center pb-0">
    <CardTitle>Tình trạng sức khỏe</CardTitle>
    <CardDescription>Theo phần trăm tổng thể</CardDescription>
  </CardHeader>
  <CardContent className="flex flex-1 items-center pb-0">
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square w-full max-w-[400px]"
    >
      <RadialBarChart
        data={radiusChartData}
        innerRadius={80}
        outerRadius={130}
        startAngle={90}
        endAngle={-270}
      >
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) return null;

              const { cx, cy } = viewBox;
              const outerRadius = 130;
              const offset = 30;

              const totalPercent = safe + risk;
              const angleSafeStart = 90;
              const angleSafe = (safe / totalPercent) * 360;
              const angleRisk = (risk / totalPercent) * 360;

              const angleSafeMid = angleSafeStart - angleSafe / 2;
              const angleRiskMid = angleSafeStart - angleSafe - angleRisk / 2;

              const polarToCartesian = (cx, cy, r, angle) => {
                const rad = (Math.PI / 180) * angle;
                return {
                  x: cx + r * Math.cos(rad),
                  y: cy - r * Math.sin(rad),
                };
              };

              const labelSafe = polarToCartesian(cx, cy, outerRadius + offset, angleSafeMid);
              const labelRisk = polarToCartesian(cx, cy, outerRadius + offset, angleRiskMid);

              return (
                <>
                  <text x={cx} y={cy} textAnchor="middle">
                    <tspan
                      x={cx}
                      y={cy - 16}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {totalPercent}%
                    </tspan>
                    <tspan
                      x={cx}
                      y={cy + 4}
                      className="fill-muted-foreground"
                    >
                      Tổng cộng
                    </tspan>
                  </text>

                  <foreignObject
                    x={labelSafe.x - 60}
                    y={labelSafe.y - 10}
                    width={120}
                    height={40}
                  >
                    <div
                      className="rounded-md border border-green-500 bg-white/40 backdrop-blur-sm px-2 py-1 text-xs text-green-700 shadow"
                    >
                      An toàn ({safe}%)
                    </div>
                  </foreignObject>

                  <foreignObject
                    x={labelRisk.x - 60}
                    y={labelRisk.y - 10}
                    width={120}
                    height={40}
                  >
                    <div
                      className="rounded-md border border-red-500 bg-white/40 backdrop-blur-sm px-2 py-1 text-xs text-red-700 shadow"
                    >
                      Nguy cơ ({risk}%)
                    </div>
                  </foreignObject>
                </>
              );
            }}
          />
        </PolarRadiusAxis>

        <RadialBar
          dataKey="safe"
          stackId="a"
          cornerRadius={0}
          fill="#22c55e"
          className="stroke-transparent stroke-2"
        />
        <RadialBar
          dataKey="risk"
          stackId="a"
          cornerRadius={0}
          fill="#ef4444"
          className="stroke-transparent stroke-2"
        />
      </RadialBarChart>
    </ChartContainer>
  </CardContent>
  <CardFooter className="flex-col gap-2 text-sm">
    <div className="flex items-center gap-2 font-medium leading-none">
      Cập nhật mới nhất <TrendingUp className="h-4 w-4" />
    </div>
    <div className="leading-none text-muted-foreground">
      Dữ liệu được tính theo tỷ lệ phần trăm (360°)
    </div>
  </CardFooter>
</Card>

      </div>
    </div>
    <div>
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={barChartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
    </div>
   </Container>
   </>
  );
}
