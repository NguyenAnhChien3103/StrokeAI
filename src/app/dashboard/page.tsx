"use client";
import React from 'react';
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart ,  Tooltip as RechartsTooltip,  } from "recharts"
import { CartesianGrid, LabelList, Line, LineChart, XAxis , YAxis , ResponsiveContainer , } from "recharts"
import { Container } from 'react-bootstrap';
import { Bar, BarChart } from "recharts"


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

const lineChartData = [
  { time: "00:00", desktop: 12, mobile: 5 },
  { time: "02:00", desktop: 18, mobile: 8 },
  { time: "04:00", desktop: 9, mobile: 4 },
  { time: "06:00", desktop: 23, mobile: 12 },
  { time: "08:00", desktop: 45, mobile: 30 },
  { time: "10:00", desktop: 50, mobile: 35 },
  { time: "12:00", desktop: 60, mobile: 40 },
  { time: "14:00", desktop: 55, mobile: 38 },
  { time: "16:00", desktop: 48, mobile: 25 },
  { time: "18:00", desktop: 70, mobile: 45 },
  { time: "20:00", desktop: 40, mobile: 28 },
  { time: "22:00", desktop: 30, mobile: 18 },
];

const mutilpleLineChartData = [
  { time: "00:00", heartRate: 76, oxygen: 97, temperature: 36.5, respiratoryRate: 18, bloodPressure: 118 },
  { time: "04:00", heartRate: 74, oxygen: 98, temperature: 36.4, respiratoryRate: 17, bloodPressure: 117 },
  { time: "08:00", heartRate: 79, oxygen: 96, temperature: 36.6, respiratoryRate: 18, bloodPressure: 120 },
  { time: "12:00", heartRate: 84, oxygen: 95, temperature: 37.0, respiratoryRate: 20, bloodPressure: 125 },
  { time: "16:00", heartRate: 81, oxygen: 97, temperature: 36.8, respiratoryRate: 19, bloodPressure: 121 },
  { time: "20:00", heartRate: 77, oxygen: 98, temperature: 36.6, respiratoryRate: 17, bloodPressure: 119 },
];




const barChartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]


const chartConfig = {
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
        <div className="flex items-center gap-2 font-medium leading-none">
          Health status analysis <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Data visualization by metric level
        </div>
      </CardFooter>
    </Card>
      </div>
      <div className="w-[60%] h-full">
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
    </div>
    <div className='h-full w-full'>
    <Card >
      <CardHeader>
        <CardTitle>Line Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={lineChartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />

            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}`} 
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-desktop)",
              }}
              activeDot={{
                r: 6,
              }}
            >
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Line>
          </LineChart>
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

    <Card>
  <CardHeader>
    <CardTitle>Line Chart - Label</CardTitle>
    <CardDescription>January - June 2024</CardDescription>
  </CardHeader>

  <CardContent>
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={mutilpleLineChartData}
        margin={{
          top: 20,
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <YAxis
  tickLine={false}
  axisLine={false}
  tickMargin={10}
  ticks={[30, 60, 90, 120, 150, 180]}
  tickFormatter={(value) => `${value}`}
/>

        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="line" />}
        />

        <Line
          dataKey="heartRate"
          type="natural"
          stroke="red"
          strokeWidth={2}
          dot={{ fill: "red" }}
          activeDot={{ r: 6 }}
        >
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
        </Line>

        <Line
          dataKey="oxygen"
          type="natural"
          stroke="blue"
          strokeWidth={2}
          dot={{ fill: "blue" }}
          activeDot={{ r: 6 }}
        >
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
        </Line>

        <Line
          dataKey="temperature"
          type="natural"
          stroke="orange"
          strokeWidth={2}
          dot={{ fill: "orange" }}
          activeDot={{ r: 6 }}
        >
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
        </Line>

        <Line
          dataKey="respiratoryRate"
          type="natural"
          stroke="green"
          strokeWidth={2}
          dot={{ fill: "green" }}
          activeDot={{ r: 6 }}
        >
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
        </Line>

        <Line
          dataKey="bloodPressure"
          type="natural"
          stroke="purple"
          strokeWidth={2}
          dot={{ fill: "purple" }}
          activeDot={{ r: 6 }}
        >
          <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
        </Line>

      </LineChart>
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

    <Card>
      <CardHeader>
        <CardTitle>Line Chart - Multiple</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={lineChartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => `${value}`} 
            />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="desktop"
              type="monotone"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="mobile"
              type="monotone"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Showing total visitors for the last 6 months
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
    </div>
   </Container>
   </>
  );
}
