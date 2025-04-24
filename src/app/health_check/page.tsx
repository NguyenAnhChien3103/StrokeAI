'use client';

import { useState, useEffect } from 'react';
import API_ENDPOINTS from '../utils/apiConfig';

export default function Health_Check() {
  const [userId, setUserId] = useState('');
  const [formData, setFormData] = useState({
    DauDau: false,
    TeMatChi: false,
    ChongMat: false,
    KhoNoi: false,
    MatTriNhoTamThoi: false,
    LuLan: false,
    GiamThiLuc: false,
    MatThangCan: false,
    BuonNon: false,
    KhoNuot: false,
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.userId);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullData = {
      ...formData,
      UserID: userId,
      RecordedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(API_ENDPOINTS.addClinicalIndicator, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullData),
      });

      if (response.ok) {
        alert("Gửi thành công!");
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl space-y-4">
        <h1 className="text-2xl font-bold mb-4">Chỉ số lâm sàng</h1>

        <div className="grid grid-cols-2 gap-4">
          {[
            ["DauDau", "Đau đầu"],
            ["TeMatChi", "Tê mặt, chi"],
            ["ChongMat", "Chóng mặt"],
            ["KhoNoi", "Khó nói"],
            ["MatTriNhoTamThoi", "Mất trí nhớ tạm thời"],
            ["LuLan", "Lú lẫn"],
            ["GiamThiLuc", "Giảm thị lực"],
            ["MatThangCan", "Mất thăng cân"],
            ["BuonNon", "Buồn nôn"],
            ["KhoNuot", "Khó nuốt"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                name={key}
                checked={formData[key as keyof typeof formData]}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span>{label}</span>
            </label>
          ))}
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Gửi
        </button>
      </form>
    </div>
  );
}
