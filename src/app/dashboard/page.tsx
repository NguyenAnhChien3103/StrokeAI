"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import { Bar, BarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/chart"
const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 500 },
  { month: "April", desktop: 500 },
  { month: "May", desktop: 500   },
  { month: "June", desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig



export default function DashBoard() {
  return (
<>
<Card className="w-250 h-100">
      <CardHeader className="items-center">
        <CardTitle>Radar Chart - Dots</CardTitle>
        <CardDescription>
          Showing total visitors for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="flex items-center gap-2 leading-none text-muted-foreground">
          January - June 2024
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
           data={chartData}
           margin={{
             top: 20,
             left: 12,
             right: 12,
           }}
         >
           <CartesianGrid vertical={false} />
           <XAxis
             dataKey="month"
             tickLine={false}
             axisLine={false}
             tickMargin={8}
             tickFormatter={(value) => value.slice(0, 3)}
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
</>
  )
}
