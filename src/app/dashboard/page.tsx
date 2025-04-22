"use client";
import React from 'react';
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart ,  Tooltip as RechartsTooltip,  } from "recharts"
import { CartesianGrid, XAxis, YAxis , ResponsiveContainer , } from "recharts"
import { Container } from 'react-bootstrap';
import { Bar, BarChart } from "recharts"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { useEffect, useState } from "react";
import { format, subDays } from 'date-fns';

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
  const safe = radiusChartData[0].safe;
  const risk = radiusChartData[0].risk;
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [devices, setDevices] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [radarChartData, setRadarChartData] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const today = new Date()


  const last14Days: { label: string; date: Date }[] = Array.from({ length: 14 }, (_, i) => {
    const day = subDays(today, i);
    const label = format(day, "dd/MM/yyyy");
    const labelText = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") ? "Hôm nay" : label;
    return { label: labelText, date: day };
  });
  

  const extraButtons = [
    { label: "14 ngày" },
    { label: "sáng 14 ngày" },
    { label: "đêm 14 ngày" },
  ];

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(parsedUser.token);
      setUserId(parsedUser.userId);
    }
  }, []);
 
  useEffect(() => {
    const fetchDevices = async () => {
      if (!token || !userId) return;
      try {
        const response = await fetch(`http://localhost:5062/api/Devices/get-devices/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Không thể lấy thiết bị");
        }

        const data = await response.json();
        setDevices(data);
        sessionStorage.setItem("devices", JSON.stringify(data));
        console.log("Thiết bị:", data);
      } catch (error) {
        console.error("Lỗi khi gọi API thiết bị:", error);
      }
    };
    fetchDevices();
  }, [token, userId]);


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedDevices = sessionStorage.getItem("devices");
      if (storedDevices) {
        const parsedDevices = JSON.parse(storedDevices);
        setDevices(parsedDevices.deviceId); 
      }
    }
  }, []);

  useEffect(() => {
    const storedDevices = sessionStorage.getItem("devices");
    if (storedDevices) {
      try {
        const parsedDevices = JSON.parse(storedDevices);
        setDevices(parsedDevices);
      } catch (error) {
        console.error("Lỗi khi đọc devices từ session:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (!token || devices.length === 0 || !selectedDate) return;
  
    const deviceId = devices[0]?.deviceId;
    if (!deviceId) return;
  
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
  
    const fetchDataByDate = async () => {
      try {
        const response = await fetch(`http://localhost:5062/api/UserMedicalDatas/daily/${formattedDate}/${deviceId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            'Accept': "application/json",
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Lỗi khi gọi API: ${errorData}`);
        }
  
        const textData = await response.text();
        if (textData) {
          const data = JSON.parse(textData);
          setRadarChartData(data);
        } else {
          console.warn("Dữ liệu phản hồi trống.");
        }
      } catch (error) {
        console.error("Lỗi khi fetch data theo ngày:", error);
      }
    };
  
    fetchDataByDate();
  }, [selectedDate, devices, token]);

  
  const handleButtonClick = (date: Date) => {
    setSelectedDate(date);
  };

  
  interface ChartData {
    time: string;
    heartRate: number;
    spo2Information: number;
    systolicPressure: number;
    diastolicPressure: number;
    temperature: number;
    bloodPh: number;
  }
  
  useEffect(() => {
    if (!radarChartData.length) return;
    
    const formatted: ChartData[] = radarChartData.map(item => ({
      time: format(new Date(item.recordedAt), 'HH:mm'),
      heartRate: item.heartRate,
      spo2Information: item.spo2Information,
      systolicPressure: item.systolicPressure,
      diastolicPressure: item.diastolicPressure,
      temperature: item.temperature,
      bloodPh: item.bloodPh,
    }));
    
    setBarChartData(formatted);
  }, [radarChartData]);
  

  return (
   <>
   <Container className='h-full mb-5'>
   <div className="flex flex-col items-start gap-4 p-4">
  <div className="mb-4">
    <p>
      <strong>Ngày đã chọn:</strong> 
      {selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime()) 
        ? format(selectedDate, 'dd/MM/yyyy') 
        : 'Chưa chọn ngày'}
    </p>
  </div>

  <div className="flex flex-wrap gap-2">
    {last14Days.map((item, index) => (
      <button
        key={index}
        onClick={() => handleButtonClick(item.date)}
        className={`bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded 
          ${selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime()) && format(selectedDate, 'yyyy-MM-dd') === format(item.date, 'yyyy-MM-dd') ? 'border-4 border-green-700' : ''}`}
      >
        {item.label}
      </button>
    ))}

{extraButtons.map((item, index) => (
  <button
    key={`extra-${index}`}
    onClick={() => handleButtonClick(today)}
    className="bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-2 rounded"
  >
    {item.label}
  </button>
))}
  </div>
</div>
   <div className='flex gap-2 h-full'>
   <div className="w-[40%] h-full">
   <Card className="h-full">
      <CardHeader className="items-center">
        <CardTitle>Biều đồ Char Data</CardTitle>
        <CardDescription>Hiển thị các chỉ số sức khỏe quan trọng về đột quỵ</CardDescription>
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
    <CardDescription>Theo phần trăm nguy cơ</CardDescription>
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

    <div className="flex flex-wrap gap-4">
  <div className="w-full md:w-[48%]">
  <Card>
  <CardHeader>
    <CardTitle>Biểu đồ nhịp tim, dữ liệu được hiển thị theo đơn vị bpm :</CardTitle>
    <CardDescription>
      Thời gian thống kê : {format(new Date(), 'dd/MM/yyyy')}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}>
        <CartesianGrid vertical={false} />
        
        <XAxis
  dataKey="time"
  tickLine={false}
  tickMargin={10}
  axisLine={false}
  tickFormatter={(value) => {
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? '' : format(date, 'HH:mm');
    } catch  {
      console.error("Lỗi khi định dạng trục X:", value);
      return '';
    }
  }}
/>

        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} BPM`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="heartRate" name="bpm" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
  </div>
  <div className="w-full md:w-[48%]">
  <Card>
  <CardHeader>
    <CardTitle>Độ bão hòa Oxi trong máu, dữ liệu được hiển thị theo đơn vị % :</CardTitle>
    <CardDescription>
      Thời gian thống kê : {format(new Date(), 'dd/MM/yyyy')}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}>
        <CartesianGrid vertical={false} />
        
        <XAxis
  dataKey="time"
  tickLine={false}
  tickMargin={10}
  axisLine={false}
  tickFormatter={(value) => {
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? '' : format(date, 'HH:mm');
    } catch  {
      console.error("Lỗi khi định dạng trục X:", value);
      return '';
    }
  }}
/>

        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} %`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="spo2Information" name="%" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card> 
  </div>
  <div className="w-full md:w-[48%]">
  <Card>
  <CardHeader>
    <CardTitle>Biểu đồ huyết áp tâm thu , dữ liệu được hiển thị theo đơn vị mmHg :</CardTitle>
    <CardDescription>
      Thời gian thống kê : {format(new Date(), 'dd/MM/yyyy')}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}>
        <CartesianGrid vertical={false} />
        
        <XAxis
  dataKey="time"
  tickLine={false}
  tickMargin={10}
  axisLine={false}
  tickFormatter={(value) => {
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? '' : format(date, 'HH:mm');
    } catch  {
      console.error("Lỗi khi định dạng trục X:", value);
      return '';
    }
  }}
/>

        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} mmHg`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="systolicPressure" name="mmHg" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
  </div>
  <div className="w-full md:w-[48%]">
  <Card>
  <CardHeader>
    <CardTitle>Biểu đồ áp suất tâm trương , dữ liệu được hiển thị theo đơn vị mmHg :</CardTitle>
    <CardDescription>
      Thời gian thống kê : {format(new Date(), 'dd/MM/yyyy')}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}>
        <CartesianGrid vertical={false} />
        
        <XAxis
  dataKey="time"
  tickLine={false}
  tickMargin={10}
  axisLine={false}
  tickFormatter={(value) => {
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? '' : format(date, 'HH:mm');
    } catch  {
      console.error("Lỗi khi định dạng trục X:", value);
      return '';
    }
  }}
/>

        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} mmHg`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="diastolicPressure" name="mmHg" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
  </div>
  <div className="w-full md:w-[48%]">
  <Card>
  <CardHeader>
    <CardTitle>Biểu đồ hiển thị nhiệt độ , dữ liệu được hiển thị theo đơn vị °C :</CardTitle>
    <CardDescription>
      Thời gian thống kê : {format(new Date(), 'dd/MM/yyyy')}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}>
        <CartesianGrid vertical={false} />
        
        <XAxis
  dataKey="time"
  tickLine={false}
  tickMargin={10}
  axisLine={false}
  tickFormatter={(value) => {
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? '' : format(date, 'HH:mm');
    } catch  {
      console.error("Lỗi khi định dạng trục X:", value);
      return '';
    }
  }}
/>

        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} °C`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="temperature" name="°C" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
  </div>
  <div className="w-full md:w-[48%]">
  <Card>
  <CardHeader>
    <CardTitle>Biểu đồ hiển thị PH trong máu , dữ liệu được hiển thị theo đơn vị pH :</CardTitle>
    <CardDescription>
       Thời gian thống kê : {format(new Date(), 'dd/MM/yyyy')}
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}>
        <CartesianGrid vertical={false} />
        
        <XAxis
  dataKey="time"
  tickLine={false}
  tickMargin={10}
  axisLine={false}
  tickFormatter={(value) => {
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? '' : format(date, 'HH:mm');
    } catch  {
      console.error("Lỗi khi định dạng trục X:", value);
      return '';
    }
  }}
/>

        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} pH`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="bloodPh" name="pH" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
  </div>
</div>

    </div>
   </Container>
   </>
  );
}
