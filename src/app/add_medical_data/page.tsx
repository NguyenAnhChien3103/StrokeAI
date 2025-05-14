'use client';

import { useState } from 'react';
import { Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default function AddMedicalData() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('00:00');

  const [formData, setFormData] = useState({
    Series: '',
    SystolicPressure: '',
    DiastolicPressure: '',
    Temperature: '',
    BloodPh: '',
    Spo2Information: '',
    HeartRate: '',
  });

  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = i * 2;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const [hours, minutes] = selectedTime.split(':');
    const dateTime = new Date(selectedDate);
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const hour = String(dateTime.getHours()).padStart(2, '0');
    const minute = String(dateTime.getMinutes()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}T${hour}:${minute}:00Z`;

    const requestData = {
      Series: formData.Series,
      SystolicPressure: parseInt(formData.SystolicPressure),
      DiastolicPressure: parseInt(formData.DiastolicPressure),
      Temperature: parseFloat(formData.Temperature),
      BloodPh: parseFloat(formData.BloodPh),
      RecordedAt: formattedDate,
      Spo2Information: parseInt(formData.Spo2Information),
      HeartRate: parseInt(formData.HeartRate)
    };

    try {
      const response = await fetch('http://localhost:5062/api/UserMedicalDatas/medicaldata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert("Thêm dữ liệu thành công!");
      } else {
        const errorText = await response.text();
        console.error("Lỗi phản hồi:", errorText);
        alert("Có lỗi xảy ra!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi:", error);
      alert("Gửi thất bại!");
    }
  };

  return (
    <Container className="max-w-lg mx-auto !px-20 py-5">
      <div>
        <p className="text-2xl !font-bold text-cyan-500 mb-6">Thêm Dữ Liệu Y Tế</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Series Thiết Bị
                </label>
                <input
                  type="text"
                  name="Series"
                  value={formData.Series}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Huyết Áp Tâm Thu (mmHg)
                </label>
                <input
                  type="number"
                  name="SystolicPressure"
                  value={formData.SystolicPressure}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Huyết Áp Tâm Trương (mmHg)
                </label>
                <input
                  type="number"
                  name="DiastolicPressure"
                  value={formData.DiastolicPressure}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhiệt Độ (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="Temperature"
                  value={formData.Temperature}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ pH Máu
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="BloodPh"
                  value={formData.BloodPh}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  SpO2 (%)
                </label>
                <input
                  type="number"
                  name="Spo2Information"
                  value={formData.Spo2Information}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhịp Tim (bpm)
                </label>
                <input
                  type="number"
                  name="HeartRate"
                  value={formData.HeartRate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày Ghi Nhận
                  </label>
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date) => setSelectedDate(date)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    dateFormat="dd/MM/yyyy"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giờ Ghi Nhận
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white !rounded-full font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Thêm Dữ Liệu
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
