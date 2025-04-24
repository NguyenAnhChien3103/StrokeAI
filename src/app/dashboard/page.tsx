"use client";
import React from 'react';
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart   } from "recharts"
import { CartesianGrid, XAxis, YAxis , ResponsiveContainer , } from "recharts"
import { Container } from 'react-bootstrap';
import { Bar, BarChart } from "recharts"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { useEffect, useState } from "react";
import { format, subDays } from 'date-fns';
import API_ENDPOINTS from '../utils/apiConfig';
import {
  HeartPulse,
  Thermometer,
  Droplets,
  Gauge,
  FlaskConical,
} from "lucide-react"

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

const getFillColor = (value: number, metric: string): string => {
  if (metric === "Nhịp tim" || metric === "SP02") {
    if (value < thresholds[metric].warningLow[0]) {
      return "#FF0000";
    } else if (value < thresholds[metric].safe[0]) {
      return "#FFCC00";
    } else {
      return "#0DA72EFF";
    }
  } else if (metric === "Huyết áp tâm thu" || metric === "Huyết áp tâm trương") {
    if (value < thresholds[metric].warningLow[0] || value > thresholds[metric].warningHigh[1]) {
      return "#FF0000";
    } else {
      return "#0DA72EFF";
    }
  } else {
    return "#0DA72EFF";
  }
};

const getDotSize = (value: number, metric: string): number => {
  if (metric === "Nhịp tim" || metric === "SP02") {
    if (value < thresholds[metric].warningLow[0]) {
      return 8;
    } else if (value < thresholds[metric].safe[0]) {
      return 6;
    } else {
      return 4;
    }
  } else if (metric === "Huyết áp tâm thu" || metric === "Huyết áp tâm trương") {
    if (value < thresholds[metric].warningLow[0] || value > thresholds[metric].warningHigh[1]) {
      return 8;
    } else {
      return 4;
    }
  } else {
    return 4;
  }
};


const thresholds = {
  "Nhịp tim": {
    safe: [60, 100],
    warningLow: [50, 59], 
    warningHigh: [101, 110], 
    dangerLow: [0, 49],
    dangerHigh: [111, 200], 
  },
  "SP02": {
    safe: [95, 100],
    warningLow: [90, 94], 
    warningHigh: [100, 101],
    dangerLow: [0, 89],
    dangerHigh: [102, 110], 
  },
  "Huyết áp tâm thu": {
    safe: [90, 120],
    warningLow: [80, 89],
    warningHigh: [121, 180],
    dangerLow: [0, 79],
    dangerHigh: [181, 300], 
  },
  "Huyết áp tâm trương": {
    safe: [60, 80],
    warningLow: [50, 59],
    warningHigh: [81, 90],
    dangerLow: [0, 49],
    dangerHigh: [91, 150],
  },
  "Nhiệt độ": {
    safe: [36.5, 37.5],
    warningLow: [36, 36.4],
    warningHigh: [37.6, 38],
    dangerLow: [0, 35.9],
    dangerHigh: [38.1, 40],
  },
  "Độ pH máu": {
    safe: [7.35, 7.45],
    warningLow: [7.3, 7.34],
    warningHigh: [7.46, 7.5],
    dangerLow: [0, 7.29],
    dangerHigh: [7.51, 14],
  },
};


const radiusChartData = [{ safe: 65, risk: 35 }];


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
  const [averageAllDayChartData , setAverageAllDayRadarChartData] = useState<any[]>([]);
  const [radarChartData , setRadarChartData] = useState<any[]>([]);
  const [dailyChartData, setDailyRadarChartData] = useState<any[]>([]);
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const today = new Date()
  const [noDataMessage, setNoDataMessage] = useState("");



  const last14Days: { label: string; date: Date }[] = Array.from({ length: 14 }, (_, i) => {
    const day = subDays(today, i);
    const label = format(day, "dd/MM/yyyy");
    const labelText = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") ? "Hôm nay" : label;
    return { label: labelText, date: day };
  });

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
        const response = await fetch(API_ENDPOINTS.getDevicesID(userId), {
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
        const response = await fetch(API_ENDPOINTS.getDailyMedicalData(formattedDate, deviceId), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Lỗi khi gọi API: ${errorData}`);
        }
  
        const textData = await response.text();
  
        if (textData) {
          const data = JSON.parse(textData);
          if (!data || (Array.isArray(data) && data.length === 0)) {
            setDailyRadarChartData([]);
            setNoDataMessage("Không có dữ liệu vào ngày này."); 
          } else {
            setDailyRadarChartData(data);
            setNoDataMessage(""); 
          }
        } else {
          setDailyRadarChartData([]);
          setNoDataMessage("Không có dữ liệu vào ngày này."); 
        }
      } catch (error) {
        console.error("Lỗi khi fetch data theo ngày:", error);
        setDailyRadarChartData([]); 
        setNoDataMessage("Đã xảy ra lỗi khi tải dữ liệu.");
      }
    };
  
    fetchDataByDate();
  }, [selectedDate, devices, token]);
  
  

  
  const handleButtonClick = (date: Date) => {
    setSelectedDate(date);
  };

  
  interface DailyChartData {
    time: string;
    heartRate: number;
    spo2Information: number;
    systolicPressure: number;
    diastolicPressure: number;
    temperature: number;
    bloodPh: number;
  }
  
  useEffect(() => {
    if (!dailyChartData.length) return;
    
    const formatted: DailyChartData[] = dailyChartData.map(item => ({
      time: format(new Date(item.recordedAt), 'HH:mm'),
      heartRate: item.heartRate,
      spo2Information: item.spo2Information,
      systolicPressure: item.systolicPressure,
      diastolicPressure: item.diastolicPressure,
      temperature: item.temperature,
      bloodPh: item.bloodPh,
    }));
    
    setBarChartData(formatted);
  }, [dailyChartData]);
  

  useEffect(() => {
    if (!token || devices.length === 0 ) return;
  
    const deviceId = devices[0]?.deviceId;
    if (!deviceId) return;
  
  
    const fetchDataByDate = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.getAverageLast14Days(deviceId), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Lỗi khi gọi API: ${errorData}`);
        }
  
        const textData = await response.text();
  
        if (textData) {
          const data = JSON.parse(textData);
          if (!data || (Array.isArray(data) && data.length === 0)) {
            setAverageAllDayRadarChartData([]);
            setNoDataMessage(""); 
          } else {
            setAverageAllDayRadarChartData(data);
            setNoDataMessage(""); 
          }
        } else {
          setAverageAllDayRadarChartData([]);
          setNoDataMessage("Không có dữ liệu"); 
        }
      } catch  {
        setDailyRadarChartData([]); 
        setNoDataMessage("Đã xảy ra lỗi khi tải dữ liệu.");
      }
    };
  
    fetchDataByDate();
  }, [devices, token]);

  useEffect(() => {
    if (!averageAllDayChartData.length) return;

    const latest = averageAllDayChartData[averageAllDayChartData.length - 1];

    const formatted = [
      { metric: "Nhịp tim", value: latest.averageSpO4 },
      { metric: "SP02", value: latest.averageSpO2 },
      { metric: "Huyết áp tâm thu", value: latest.averageSpO6 },
      { metric: "Huyết áp tâm trương", value: latest.averageSpO5 },
      { metric: "Nhiệt độ", value: latest.averageSpO3 },
      { metric: "Độ pH máu", value: latest.averageSpO3 },
    ];

    setRadarChartData(formatted);
  }, [averageAllDayChartData]);


  return (
   <>
   <Container className='h-full mb-5'>
   <div className='flex gap-2 h-full'>
   <div className="w-[40%] h-full">
   <Card className="w-full">
      <CardHeader className="items-center">
        <CardTitle>Biểu đồ sức khỏe tổng hợp</CardTitle>
        <CardDescription>{noDataMessage || "Hiển thị các chỉ số sức khỏe của người dùng."}</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ResponsiveContainer className="mx-auto aspect-square max-h-[250px]">
          <RadarChart data={radarChartData}>
            <PolarAngleAxis dataKey="metric" />
            <PolarGrid radialLines={true} />
            <Radar
              dataKey="value"
              fill={getFillColor(radarChartData[0]?.value, radarChartData[0]?.metric)}
              fillOpacity={0.6}
              dot={{
                r: getDotSize(radarChartData[0]?.value, radarChartData[0]?.metric), 
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        {radarChartData.map((item, index) => (
          <div key={index} className="flex justify-between w-full items-center">
            <div className="flex items-center gap-2 font-semibold">
              {item.metric === "Nhịp tim" && <HeartPulse className="w-4 h-4 text-red-500" />}
              {item.metric === "SP02" && <Droplets className="w-4 h-4 text-blue-500" />}
              {item.metric === "Huyết áp tâm thu" && <Gauge className="w-4 h-4 text-purple-500" />}
              {item.metric === "Huyết áp tâm trương" && <Gauge className="w-4 h-4 text-purple-500" />}
              {item.metric === "Nhiệt độ" && <Thermometer className="w-4 h-4 text-orange-500" />}
              {item.metric === "Độ pH máu" && <FlaskConical className="w-4 h-4 text-green-500" />}
              <span>{item.metric}</span>
            </div>
            <span className="font-semibold text-right">
              {item.value}{" "}
              {item.metric === "Nhịp tim" ? "bpm" :
               item.metric === "SP02" ? "%" :
               item.metric === "Huyết áp tâm thu" ? "mmHg" :
               item.metric === "Huyết áp tâm trương" ? "mmHg" :
               item.metric === "Nhiệt độ" ? "°C" :
               item.metric === "Độ pH máu" ? "pH" :
               ""}
            </span>
          </div>
        ))}
      </CardFooter>
    </Card>

      </div>
      <div className="w-[60%] h-full">
     
      <Card className="flex flex-col">
  <CardHeader className="items-center pb-0">
    <CardTitle>Dự đoán đột quỵ</CardTitle>
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
    <div className='shadow-lg rounded-2xl border border-gray-300 bg-gray-50 p-10 space-y-6'>
    <div>
  <div className="mb-4">
    <p>
      <strong>Dữ liệu được thống kê vào ngày : </strong> 
      {selectedDate && selectedDate instanceof Date && !isNaN(selectedDate.getTime()) 
        ? format(selectedDate, 'dd/MM/yyyy') 
        : 'Chưa chọn ngày'}
    </p>
  </div>

  <div className="flex flex-wrap gap-x-2 gap-y-4">
  {last14Days.map((item, index) => (
    <button
      key={index}
      onClick={() => handleButtonClick(item.date)}
      className={`flex-1 basis-[calc(100%/7-0.5rem)] bg-cyan-500 hover:bg-cyan-600 text-black px-4 py-3 rounded text-sm
        ${selectedDate &&
        selectedDate instanceof Date &&
        !isNaN(selectedDate.getTime()) &&
        format(selectedDate, 'yyyy-MM-dd') === format(item.date, 'yyyy-MM-dd')
          ? 'border-4 border-green-700'
          : ''}`}
    >
      {item.label}
    </button>
  ))}
</div>

</div>
{dailyChartData.length === 0 ? (
    <p className='text-center text-red-500'>{noDataMessage}</p> 
  ) : (
    <div className="flex flex-wrap gap-4">
  <div className="w-full md:w-[49%]">
  <Card>
  <CardHeader>
    <CardTitle>Biểu đồ nhịp tim, dữ liệu được hiển thị theo đơn vị bpm :</CardTitle>
    <CardDescription>
  Thời gian thống kê : {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Chưa chọn ngày'}
</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}   margin={{ top: 20, bottom: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis
  dataKey="time"
  type="category"
  tickLine={false}
  axisLine={false}
  tickMargin={10}
  tick={{ fontSize: 12 }}
  tickFormatter={(value) => value}  
  interval={0} 
/>




        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} BPM`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="heartRate" name="bpm" fill="var(--color-desktop)" radius={4}   
     label={{
    position: 'top',
    fill: '#333', 
    fontSize: 12,
    formatter: (value) => `${value}`,
  }}/>
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
  </div>
  <div className="w-full md:w-[49%]">
  <Card>
  <CardHeader>
    <CardTitle>Độ bão hòa Oxi trong máu, dữ liệu được hiển thị theo đơn vị % :</CardTitle>
    <CardDescription>
  Thời gian thống kê : {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Chưa chọn ngày'}
</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}   margin={{ top: 20, bottom: 20}}>
        <CartesianGrid vertical={false} />
        
        <XAxis
  dataKey="time"
  type="category"
  tickLine={false}
  axisLine={false}
  tickMargin={10}
  tick={{ fontSize: 12 }}
  tickFormatter={(value) => value}  
  interval={0} 
/>


        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} %`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="spo2Information" name="%" fill="var(--color-desktop)" radius={4} 
         label={{
          position: 'top',
          fill: '#333', 
          fontSize: 12,
          formatter: (value) => `${value}`,
        }}
        />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card> 
  </div>
  <div className="w-full md:w-[49%]">
  <Card>
  <CardHeader>
    <CardTitle>Biểu đồ huyết áp tâm thu , dữ liệu được hiển thị theo đơn vị mmHg :</CardTitle>
    <CardDescription>
  Thời gian thống kê : {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Chưa chọn ngày'}
</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}   margin={{ top: 20,  bottom: 20 }}>
        <CartesianGrid vertical={false} />
        
        <XAxis
  dataKey="time"
  type="category"
  tickLine={false}
  axisLine={false}
  tickMargin={10}
  tick={{ fontSize: 12 }}
  tickFormatter={(value) => value}  
  interval={0} 
/>

        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} mmHg`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="systolicPressure" name="mmHg" fill="var(--color-desktop)" radius={4}   label={{
          position: 'top',
          fill: '#333', 
          fontSize: 12,
          formatter: (value) => `${value}`,
        }} />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
  </div>
  <div className="w-full md:w-[49%]">
  <Card>
  <CardHeader>
    <CardTitle>Biểu đồ áp suất tâm trương , dữ liệu được hiển thị theo đơn vị mmHg :</CardTitle>
    <CardDescription>
  Thời gian thống kê : {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Chưa chọn ngày'}
</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}   margin={{ top: 20,  bottom: 20 }}>
        <CartesianGrid vertical={false} />
        
        <XAxis
  dataKey="time"
  type="category"
  tickLine={false}
  axisLine={false}
  tickMargin={10}
  tick={{ fontSize: 12 }}
  tickFormatter={(value) => value}  
  interval={0} 
/>

        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} mmHg`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="diastolicPressure" name="mmHg" fill="var(--color-desktop)" radius={4}   label={{
          position: 'top',
          fill: '#333', 
          fontSize: 12,
          formatter: (value) => `${value}`,
        }} />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
  </div>
  <div className="w-full md:w-[49%]">
  <Card>
  <CardHeader>
    <CardTitle>Biểu đồ hiển thị nhiệt độ , dữ liệu được hiển thị theo đơn vị °C :</CardTitle>
    <CardDescription>
  Thời gian thống kê : {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Chưa chọn ngày'}
</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}   margin={{ top: 20,  bottom: 20 }}>
        <CartesianGrid vertical={false} />
        
        <XAxis
  dataKey="time"
  type="category"
  tickLine={false}
  axisLine={false}
  tickMargin={10}
  tick={{ fontSize: 12 }}
  tickFormatter={(value) => value}  
  interval={0} 
/>

        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} °C`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="temperature" name="°C" fill="var(--color-desktop)" radius={4}  label={{
          position: 'top',
          fill: '#333', 
          fontSize: 12,
          formatter: (value) => `${value}`,
        }}  />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
  </div>
  <div className="w-full md:w-[49%]">
  <Card>
  <CardHeader>
    <CardTitle>Biểu đồ hiển thị PH trong máu , dữ liệu được hiển thị theo đơn vị pH :</CardTitle>
    <CardDescription>
  Thời gian thống kê : {selectedDate ? format(selectedDate, 'dd/MM/yyyy') : 'Chưa chọn ngày'}
</CardDescription>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={barChartData}   margin={{ top: 20, bottom: 20}}>
        <CartesianGrid vertical={false} />
        
        <XAxis
  dataKey="time"
  type="category"
  tickLine={false}
  axisLine={false}
  tickMargin={10}
  tick={{ fontSize: 12 }}
  tickFormatter={(value) => value}  
  interval={0} 
/>

        <YAxis 
          domain={['auto', 'auto']} 
          tickFormatter={(value) => `${value} pH`}  
        />

        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        
        <Bar dataKey="bloodPh" name="pH" fill="var(--color-desktop)" radius={4}  label={{
          position: 'top',
          fill: '#333', 
          fontSize: 12,
          formatter: (value) => `${value}`,
        }}  />
      </BarChart>
    </ChartContainer>
  </CardContent>
</Card>
  </div>
</div>
  )}
    </div>
   </Container>
   </>
  );
}
