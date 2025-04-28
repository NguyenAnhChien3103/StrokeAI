'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import API_ENDPOINTS from '../utils/apiConfig';
import { Container } from 'react-bootstrap';

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

  const router = useRouter(); 

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

  const handleCheckboxClick = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      [key]: !prev[key],
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
        router.push('/dashboard');
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
        <form onSubmit={handleSubmit}>
          <p className="text-2xl !font-bold text-cyan-500 mb-6">Chỉ số lâm sàng</p>
          <p>Tích vào những ô có biểu hiện</p>

          <div className="grid grid-cols-3 gap-6 md:gap-8">
            {[
              ["DauDau", "Đau đầu"],
              ["TeMatChi", "Tê mặt, chi"],
              ["ChongMat", "Chóng mặt"],
              ["KhoNoi", "Khó nói"],
              ["MatTriNhoTamThoi", "Mất trí nhớ tạm thời"],
              ["LuLan", "Lú lẫn"],
              ["GiamThiLuc", "Giảm thị lực"],
              ["MatThangCan", "Mất thăng bằng"],
              ["BuonNon", "Buồn nôn"],
              ["KhoNuot", "Khó nuốt"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex items-center space-x-1.5 p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-500 shadow-md cursor-pointer"
                onClick={() => handleCheckboxClick(key)}
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={formData[key as keyof typeof formData]}
                  onChange={(e) => handleChange(e)}
                  className="h-5 w-5 accent-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-base font-medium leading-5 !pl-5" style={{ userSelect: 'none' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>

          <div className="relative mt-8">
            <button
              type="submit"
              className="bg-cyan-500 text-white px-8 py-3 !rounded-full text-lg font-semibold hover:bg-cyan-600 transition-colors shadow-sm hover:shadow-md absolute bottom-0 right-0"
            >
              Gửi Thông Tin
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}
