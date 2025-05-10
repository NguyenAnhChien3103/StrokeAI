"use client";
import React from 'react';
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart   } from "recharts"
import { CartesianGrid, XAxis, YAxis , ResponsiveContainer} from "recharts"
import { Container } from 'react-bootstrap';
import { Bar, BarChart } from "recharts"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"
import { useEffect, useState } from "react";
import { format, subDays } from 'date-fns';
import API_ENDPOINTS from '../../utils/apiConfig';
import { useParams } from 'next/navigation';

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
} from "../../components/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/chart"

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

interface AverageChartData {
  date: string;
  averageTemperature?: number;
  averageSpO2?: number;
  averageHeartRate?: number;
  averageBloodPh?: number;
  averageSystolicPressure?: number;
  averageDiastolicPressure?: number;
}

interface NightDayEntry {
  date: string;
  allDayAverage?: AverageChartData;
  dailyAverage?: AverageChartData;
  nightlyAverage?: AverageChartData;
}

interface Device {
  id: string;
  deviceId: string;
}

interface ChartData {
  metric: string;
  value: number;
}

export default function FamilyDashboard() {
  const [token, setToken] = useState("");
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [averageAllDayChartData, setAverageAllDayChartData] = useState<ChartData[]>([]);
  const [dailyChartData, setDailyRadarChartData] = useState<ChartData[]>([]);
  const [barChartData, setBarChartData] = useState<ChartData[]>([]);
  const today = new Date()
  const [noDataMessage, setNoDataMessage] = useState("");
  const [nightDayData, setNightDayData] = useState<NightDayEntry[]>([]);
  const [allDayChartData, setAllDayChartData] = useState<AverageChartData[]>([]);
  const [dayChartData, setDayChartData] = useState<AverageChartData[]>([]);
  const [nightChartData, setNightChartData] = useState<AverageChartData[]>([]);
  const [mode, setMode] = useState<'allDay' | 'splitDayNight'>('allDay');
  const [radiusChartData, setRadiusChartData] = useState<{safe: number; risk: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams();
  const userId = id;


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
        if (data && Array.isArray(data)) {
          setDevices(data);
          sessionStorage.setItem("devices", JSON.stringify(data));
          console.log("Thiết bị từ API:", data);
        } else {
          setDevices([]);
        }

        setError(null);
      } catch (error) {
        console.error("Lỗi khi gọi API thiết bị:", error);
        setError("Không thể lấy thiết bị");
        setDevices([]);
      }
    };

    fetchDevices();
  }, [token, userId]);
  

  useEffect(() => {
    if (!token || !devices || devices.length === 0 || !selectedDate) return;
  
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
          throw new Error(`Lỗi khi gọi API: ${await response.text()}`);
        }
  
        const textData = await response.text();
        if (textData) {
          const data = JSON.parse(textData);
          const medicalData = data || [];
  
          setDailyRadarChartData(medicalData);
          setNoDataMessage(medicalData.length === 0 ? "Không có dữ liệu vào ngày này." : "");
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
  

  useEffect(() => {
    if (!dailyChartData.length && noDataMessage) {
      const fixedHours = Array.from({ length: 12 }, (_, i) => {
        const hour = String(i * 2).padStart(2, '0');
        return `${hour}:00`;
      });
  
      const emptyData = fixedHours.map((hour) => ({
        time: hour,
        heartRate: null,
        spo2Information: null,
        systolicPressure: null,
        diastolicPressure: null,
        temperature: null,
        bloodPh: null,
      }));
  
      setBarChartData(emptyData);
      return;
    }
  
    const fixedHours = Array.from({ length: 12 }, (_, i) => {
      const hour = String(i * 2).padStart(2, '0');
      return `${hour}:00`;
    });
  
    const formattedData = dailyChartData.map(item => ({
      time: format(new Date(item.recordedAt), 'HH:00'),
      heartRate: item.heartRate,
      spo2Information: item.spo2Information,
      systolicPressure: item.systolicPressure,
      diastolicPressure: item.diastolicPressure,
      temperature: item.temperature,
      bloodPh: item.bloodPh,
    }));
  
    const fullData = fixedHours.map(hour => {
      const matched = formattedData.find(item => item.time === hour);
      return matched || {
        time: hour,
        heartRate: null,
        spo2Information: null,
        systolicPressure: null,
        diastolicPressure: null,
        temperature: null,
        bloodPh: null,
      };
    });
  
    setBarChartData(fullData);
  }, [dailyChartData, noDataMessage]);
  
  useEffect(() => {
    if (!token || devices.length === 0) return;
  
    const deviceId = devices[0]?.deviceId;
    if (!deviceId) return;
  
    const fetchDataByDate = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.getAverageDailyNightLast14Days(deviceId), {
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
          const averageAll14Day = data?.averageAll14Day;
  
          if (!averageAll14Day) {
            setAverageAllDayChartData([]);
            setNoDataMessage("Không có dữ liệu");
          } else {
            const formatted = [
              { metric: "Nhịp tim", value: averageAll14Day.heartRate },
              { metric: "SP02", value: averageAll14Day.spO2 },
              { metric: "Huyết áp tâm thu", value: averageAll14Day.systolicPressure },
              { metric: "Huyết áp tâm trương", value: averageAll14Day.diastolicPressure },
              { metric: "Nhiệt độ", value: averageAll14Day.temperature },
              { metric: "Độ pH máu", value: averageAll14Day.bloodPh },
            ];
            setAverageAllDayChartData(formatted);
            setNoDataMessage("");
          }
        } else {
          setAverageAllDayChartData([]);
          setNoDataMessage("Không có dữ liệu");
        }
      } catch {
        setAverageAllDayChartData([]);
        setNoDataMessage("Đã xảy ra lỗi khi tải dữ liệu.");
      }
    };
  
    fetchDataByDate();
  }, [devices, token]);

  
  useEffect(() => {
    if (!token || devices.length === 0) return;
    const deviceId = devices[0].deviceId;
    if (!deviceId) return;
  
    const fetchNightDayData = async () => {
      try {
        const res = await fetch(
          API_ENDPOINTS.getAverageDailyNightLast14Days(deviceId),
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        if (!res.ok) {
          const err = await res.text();
          throw new Error(`API error: ${err}`);
        }
  
        const data = await res.json();

        console.log(data.result);
  
        if (!data || !data.result || data.result.length === 0) {
          setNightDayData([]);
          setNoDataMessage('Không có dữ liệu trong 14 ngày gần nhất.');
        } else {
          const resultData = data.result.map(item => ({
            date: item.date,
            allDayAverage: item.allDayAverage,
            dailyAverage: item.dailyAverage,
            nightlyAverage: item.nightlyAverage,
          }));
  
          setNightDayData(resultData);
          setNoDataMessage('');
        }
      } catch (e) {
        console.error(e);
        setNightDayData([]);
        setNoDataMessage('Đã xảy ra lỗi khi tải dữ liệu.');
      }
    };
  
    fetchNightDayData();
  }, [devices, token]);
  

  useEffect(() => {
    if (!Array.isArray(nightDayData) || nightDayData.length === 0) return;
  
    const transformData = (
      key: 'allDayAverage' | 'dailyAverage' | 'nightlyAverage'
    ) =>
      nightDayData.map((item: any) => {
        const avg = item[key] || {};
        return {
          date: item.date,
          averageTemperature: avg.averageTemperature ?? null,
          averageSpO2: avg.averageSpO2 ?? null,
          averageHeartRate: avg.averageHeartRate ?? null,
          averageBloodPh: avg.averageBloodPh ?? null,
          averageSystolicPressure: avg.averageSystolicPressure ?? null,
          averageDiastolicPressure: avg.averageDiastolicPressure ?? null,
        };
      });
  
    setAllDayChartData(transformData('allDayAverage'));
    setDayChartData(transformData('dailyAverage'));
    setNightChartData(transformData('nightlyAverage'));
  }, [nightDayData]);
  
  
  
  useEffect(() => {
    const fetchStrokeRiskData = async () => {
      if (!token || !userId) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(API_ENDPOINTS.getPercentIndicatorIsTrue(userId), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu nguy cơ đột quỵ");
        }

        const data = await response.json();
        const risk = data.percent || 0;
        const safe = 100 - risk;

        setRadiusChartData([{ safe: safe, risk: risk }]);
      } catch {
        setError("Có lỗi khi tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStrokeRiskData();
  }, [token, userId]);

  const safe = radiusChartData.length > 0 ? radiusChartData[0].safe : 0;
  const risk = radiusChartData.length > 0 ? radiusChartData[0].risk : 0;;
  
  return (
   <>
   {error ? (
    <p className='text-center !text-red-500 py-60 text-2xl'>Không tìm thấy thiết bị</p>
  ) : (
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
          <RadarChart data={averageAllDayChartData} >
          <PolarAngleAxis dataKey="metric"/>
            <PolarGrid radialLines={true} />
            <Radar
              dataKey="value"
              fill={getFillColor(averageAllDayChartData[0]?.value, averageAllDayChartData[0]?.metric)}
              fillOpacity={0.6}
              dot={{
                r: getDotSize(averageAllDayChartData[0]?.value, averageAllDayChartData[0]?.metric), 
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-5">
        {averageAllDayChartData.map((item, index) => (
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
        {isLoading ? (
          <div>Đang tải dữ liệu...</div> 
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div> 
        ) : radiusChartData.length === 0 ? (
          <div>Chưa có dữ liệu để hiển thị.</div> 
        ) : (
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
                          width={150}
                          height={40}
                        >
                          <div
                            className="rounded-md border border-red-500 bg-white/40 backdrop-blur-sm px-2 py-1 text-xs text-red-700 shadow"
                          >
                            Nguy cơ đột quỵ ({risk}%)
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
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Cập nhật mới nhất <TrendingUp className="h-4 w-4" />
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

    
<div className="shadow-lg rounded-2xl border border-gray-300 bg-gray-50 p-10 space-y-6 mt-4">
  <div className="w-full">
    <p className='font-bold'>Biểu đồ hiển thị dữ liệu sức khỏe 14 ngày</p>
    <div className="mb-4">
      <button
        onClick={() => setMode('allDay')}
        disabled={mode === 'allDay'}
        style={{
          background: mode === 'allDay' ? '#f0f0f0' : 'white',
          padding: '8px 16px',
          border: '1px solid #ddd',
          cursor: mode === 'allDay' ? 'not-allowed' : 'pointer',
        }}
      >
        Trung bình cả ngày
      </button>
      <button
        onClick={() => setMode('splitDayNight')}
        disabled={mode === 'splitDayNight'}
        style={{
          marginLeft: 8,
          background: mode === 'splitDayNight' ? '#f0f0f0' : 'white',
          padding: '8px 16px',
          border: '1px solid #ddd',
          cursor: mode === 'splitDayNight' ? 'not-allowed' : 'pointer',
        }}
      >
        Ngày & Đêm
      </button>
    </div>
  </div>

  <div className="flex flex-wrap gap-4 w-full">
  <div className="w-full md:w-[49%]">
  <Card>
  <CardHeader>
    <CardTitle>Biểu đồ nhịp tim, dữ liệu được hiển thị theo đơn vị bpm :</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={
            mode === "allDay"
              ? allDayChartData
              : dayChartData.map(day => {
                  const nightMatch = nightChartData.find(n => n.date === day.date);
                  return {
                    ...day,
                    nightBPM: nightMatch?.averageHeartRate ?? null,
                  };
                })
          }
          margin={{ top: 20, bottom: 20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            reversed={true}
            tickFormatter={(tick) => format(new Date(tick), "dd")}
          />
          <YAxis
            domain={['dataMin', 'dataMax']}
            tickFormatter={(value: number) => `${value.toFixed(2)} BPM`}
          />
          <ChartTooltip
            cursor={false}
            formatter={(value: number | string) => Number(value).toFixed(2)}
            content={<ChartTooltipContent />}
          />

          {mode === "allDay" ? (
            <Bar
              dataKey="averageHeartRate"
              name="Trung bình cả ngày"
              fill="var(--color-desktop)"
              radius={4}
              label={{
                position: "top",
                fill: '#333', 
                fontSize: 12,
                formatter: (value) => value.toFixed(2),
              }}
            />
          ) : (
            <>
              <Bar
                dataKey="averageHeartRate"
                name="Ban ngày"
                fill="#C2203BFF"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
              <Bar
                dataKey="nightBPM"
                name="Ban đêm"
                fill="#1E241BFF"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>


    </div>

    <div className="w-full md:w-[49%]">
    <Card>
  <CardHeader>
    <CardTitle>Độ bão hòa oxy (%)</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={
            mode === "allDay"
              ? allDayChartData
              : dayChartData.map((day, index) => ({
                  ...day,
                  nightSpO2: nightChartData[index]?.averageSpO2 ?? 0,
                }))
          }
          margin={{ top: 20, bottom: 20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            reversed={true}
            tickFormatter={(tick) => format(new Date(tick), "dd")}
          />
<YAxis
  domain={['dataMin', 'dataMax']}
  tickFormatter={(value: number) => `${value.toFixed(2)} %`}
/>
<ChartTooltip
  cursor={false}
  formatter={(value: number | string) => Number(value).toFixed(2)}
  content={<ChartTooltipContent />}
/>


          {mode === "allDay" ? (
            <Bar
              dataKey="averageSpO2"
              name="Trung bình cả ngày"
              fill="var(--color-desktop)"
              radius={4}
              label={{
                position: "top",
                fill: '#333', 
                fontSize: 12,
                formatter: (value) => value.toFixed(2),
              }}
            />
          ) : (
            <>
              <Bar
                dataKey="averageSpO2"
                name="Ban ngày"
                fill="#60A5FA"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
              <Bar
                dataKey="nightSpO2"
                name="Ban đêm"
                fill="#4ADE80"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>

    </div>

    <div className="w-full md:w-[49%]">
    <Card>
  <CardHeader>
    <CardTitle>Biểu đồ huyết áp tâm thu (mmHg)</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={
            mode === "allDay"
              ? allDayChartData
              : dayChartData.map((day, index) => ({
                  ...day,
                  nightSystolicPressure:
                    nightChartData[index]?.averageSystolicPressure ?? 0,
                }))
          }
          margin={{ top: 20, bottom: 20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            reversed={true}
            tickFormatter={(tick) => format(new Date(tick), "dd")}
          />
<YAxis
  domain={['dataMin', 'dataMax']}
  tickFormatter={(value: number) => `${value.toFixed(2)} mmHg`}
/>
<ChartTooltip
  cursor={false}
  formatter={(value: number | string) => Number(value).toFixed(2)}
  content={<ChartTooltipContent />}
/>


          {mode === "allDay" ? (
            <Bar
              dataKey="averageSystolicPressure"
              name="Trung bình cả ngày"
              fill="var(--color-desktop)"
              radius={4}
              label={{
                position: "top",
                fill: '#333', 
                fontSize: 12,
                formatter: (value) => value.toFixed(2),
              }}
            />
          ) : (
            <>
              <Bar
                dataKey="averageSystolicPressure"
                name="Ban ngày"
                fill="#60A5FA"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
              <Bar
                dataKey="nightSystolicPressure"
                name="Ban đêm"
                fill="#4ADE80"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>

    </div>

    <div className="w-full md:w-[49%]">
    <Card>
  <CardHeader>
    <CardTitle>Biểu đồ huyết áp tâm trương (mmHg)</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={
            mode === "allDay"
              ? allDayChartData
              : dayChartData.map((day, index) => ({
                  ...day,
                  nightDiastolicPressure:
                    nightChartData[index]?.averageDiastolicPressure ?? 0,
                }))
          }
          margin={{ top: 20, bottom: 20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            reversed={true}
            tickFormatter={(tick) => format(new Date(tick), "dd")}
          />
<YAxis
  domain={['dataMin', 'dataMax']}
  tickFormatter={(value: number) => `${value.toFixed(2)} mmHg`}
/>
<ChartTooltip
  cursor={false}
  formatter={(value: number | string) => Number(value).toFixed(2)}
  content={<ChartTooltipContent />}
/>

          {mode === "allDay" ? (
            <Bar
              dataKey="averageDiastolicPressure"
              name="Trung bình cả ngày"
              fill="var(--color-desktop)"
              radius={4}
              label={{
                position: "top",
                fill: '#333', 
                fontSize: 12,
                formatter: (value) => value.toFixed(2),
              }}
            />
          ) : (
            <>
              <Bar
                dataKey="averageDiastolicPressure"
                name="Ban ngày"
                fill="#60A5FA"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
              <Bar
                dataKey="nightDiastolicPressure"
                name="Ban đêm"
                fill="#4ADE80"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>

    </div>

    <div className="w-full md:w-[49%]">
    <Card>
  <CardHeader>
    <CardTitle>Biểu đồ nhiệt độ (°C)</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={
            mode === "allDay"
              ? allDayChartData
              : dayChartData.map((day, index) => ({
                  ...day,
                  nightTemperature:
                    nightChartData[index]?.averageTemperature ?? 0,
                }))
          }
          margin={{ top: 20, bottom: 20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            reversed={true}
            tickFormatter={(tick) => format(new Date(tick), "dd")}
          />
<YAxis
  domain={['dataMin', 'dataMax']}
  tickFormatter={(value: number) => `${value.toFixed(2)} °C`}
/>
<ChartTooltip
  cursor={false}
  formatter={(value: number | string) => Number(value).toFixed(2)}
  content={<ChartTooltipContent />}
/>

          {mode === "allDay" ? (
            <Bar
              dataKey="averageTemperature"
              name="Trung bình cả ngày"
              fill="var(--color-desktop)"
              radius={4}
              label={{
                position: "top",
                fill: '#333', 
                fontSize: 12,
                formatter: (value) => value.toFixed(2),
              }}
            />
          ) : (
            <>
              <Bar
                dataKey="averageTemperature"
                name="Ban ngày"
                fill="#60A5FA"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
              <Bar
                dataKey="nightTemperature"
                name="Ban đêm"
                fill="#4ADE80"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>

    </div>

    <div className="w-full md:w-[49%]">
    <Card>
  <CardHeader>
    <CardTitle>Biểu đồ độ pH</CardTitle>
  </CardHeader>
  <CardContent>
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={
            mode === "allDay"
              ? allDayChartData
              : dayChartData.map((day, index) => ({
                  ...day,
                  nightPH: nightChartData[index]?.averageBloodPh ?? 0,
                }))
          }
          margin={{ top: 20, bottom: 20 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12 }}
            reversed={true}
            tickFormatter={(tick) => format(new Date(tick), "dd")}
          />
<YAxis
  domain={['dataMin', 'dataMax']}
  tickFormatter={(value: number) => `${value.toFixed(2)} pH`}
/>
<ChartTooltip
  cursor={false}
  formatter={(value: number | string) => Number(value).toFixed(2)}
  content={<ChartTooltipContent />}
/>

          {mode === "allDay" ? (
            <Bar
              dataKey="averageBloodPh"
              name="Trung bình cả ngày"
              fill="var(--color-desktop)"
              radius={4}
              label={{
                position: "top",
                fill: '#333', 
                fontSize: 12,
                formatter: (value) => value.toFixed(2),
              }}
            />
          ) : (
            <>
              <Bar
                dataKey="averageBloodPh"
                name="Ban ngày"
                fill="#60A5FA"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
              <Bar
                dataKey="averageBloodPh"
                name="Ban đêm"
                fill="#4ADE80"
                radius={[4, 4, 0, 0]}
                label={{
                  position: "top",
                  formatter: (value) => value.toFixed(2),
                }}
              />
            </>
          )}
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  </CardContent>
</Card>
    </div>
  </div>
</div>
   </Container>
   )}
   </>
  );
}
