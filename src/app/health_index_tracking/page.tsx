"use client";
import React, { useEffect } from "react";

const healthData = [
  {
    date: "05/03/2025",
    records: [
      { type: "Huyết áp", value: "105/78 mmHg", time: "19:00", color: "bg-green-500" },
      { type: "Nhịp tim", value: "89bpm", time: "19:00", color: "bg-blue-500" },
      { type: "Huyết áp", value: "103/78 mmHg", time: "17:00", color: "bg-green-500" }
    ]
  },
  {
    date: "04/03/2025",
    records: [
      { type: "Huyết áp", value: "130/78 mmHg", time: "17:00", color: "bg-red-500" },
      { type: "Huyết áp", value: "105/78 mmHg", time: "15:30", color: "bg-green-500" },
      { type: "Nhịp tim", value: "130bpm", time: "12:00", color: "bg-red-500" },
      { type: "Huyết áp", value: "108/78 mmHg", time: "09:30", color: "bg-green-500" }
    ]
  },
  {
    date: "01/03/2025",
    records: [
      { type: "Huyết áp", value: "105/78 mmHg", time: "20:00", color: "bg-green-500" },
      { type: "Nhịp tim", value: "80bpm", time: "19:00", color: "bg-yellow-500" },
      { type: "Huyết áp", value: "135/78 mmHg", time: "12:00", color: "bg-red-500" }
    ]
  }
];

export default function Health_Index_Tracking() {
  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      window.location.href = "/404";
    }
  }, []);
  return (
<div className="min-h-screen mt-2">

      <div className="flex justify-center">
      <div
  className="relative w-[1100px] max-w-6xl h-[400px] bg-cover bg-center"
  style={{
    backgroundImage: "url('https://images.pexels.com/photos/7578803/pexels-photo-7578803.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')"
  }}
>

          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-4">
            <h2 className="text-xl sm:text-xl !font-bold text-white">Theo Dõi Chỉ Số</h2>
            <p className="text-gray-100 mt-2">Cập nhật và giám sát các chỉ số sức khỏe của bạn một cách dễ dàng.</p>
            <div className="max-w-5xl text-white text-left mt-4">
  <p className="mb-4 pr-100">
    Chúng tôi cam kết vì sức khỏe và hạnh phúc của bạn. Hãy khám phá trang web của chúng tôi ngay hôm nay
    và tìm hiểu cách chúng tôi có thể hợp tác với bạn trên hành trình hướng đến sức khỏe tốt hơn.
  </p>
  <button className="bg-cyan-500 px-5 py-3 !rounded-full font-semibold hover:bg-cyan-600 transition duration-300">
    Tìm hiểu thêm
  </button>
</div>

          </div>
        </div>
      </div>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-4 mt-4">
          {["Tất cả chỉ số", "Huyết áp", "Đường huyết", "Điện tim", "Nồng độ Oxy", "Nhịp tim"].map((label) => (
            <button
              key={label}
              className="px-4 py-2 bg-cyan-500 !rounded-full text-white shadow-md hover:bg-cyan-600"
            >
              {label}
            </button>
          ))}
        </div>

        {healthData.map((day) => (
          <div key={day.date} className="mb-6">
            <h3 className="font-bold text-lg mb-2">{day.date}</h3>
            {day.records.map((record, idx) => (
              <div key={idx} className="flex items-center bg-gray-100 rounded-lg p-4 mb-2 shadow-sm">
                <div className={`w-2 h-10 rounded-l-lg ${record.color}`}></div>
                <div className="flex-1 px-4">
                  <p className="font-semibold">{record.type}</p>
                  <p className="text-sm text-gray-600">{record.value}</p>
                </div>
                <p className="text-gray-500 text-sm">{record.time}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
