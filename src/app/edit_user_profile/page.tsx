"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import API_ENDPOINTS from "../utils/apiConfig";

interface ProfileEditProps {
  showModalEditProfile: boolean;
  setShowModalEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalVerifyOTP: React.Dispatch<React.SetStateAction<boolean>>;
  onHide: () => void;
  setNewEmail: React.Dispatch<React.SetStateAction<string>>;
  setNewPhone: React.Dispatch<React.SetStateAction<string>>;
}

interface User {
  userId: number;
  username: string;
  role: string;
  patientName: string;
  dateOfBirth: string | null;
  email: string;
  gender: boolean;
  phone: string;
  token: string;
}


const ProfileEdit = ({ showModalEditProfile, 
  setShowModalEditProfile, 
  }: ProfileEditProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [patientName, setPatientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("Nam");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (showModalEditProfile) {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setPatientName(parsedUser.patientName || "");
        setDateOfBirth(parsedUser.dateOfBirth ? parsedUser.dateOfBirth.split("T")[0] : "");
        setGender(parsedUser.gender ? "Nam" : "Nữ");
      }
    }
  }, [showModalEditProfile]);

  useEffect(() => {
    const user = sessionStorage.getItem("user");
    if (!user) {
      window.location.href = "/404";
    }
  }, []);
    

  const handleSave = async () => {
    if (!user) {
      alert("Lỗi xác thực, vui lòng đăng nhập lại.");
      return;
    }
  
    const hasBasicInfoChanged = 
      patientName !== user.patientName ||
      dateOfBirth !== (user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "") ||
      (gender === "Nam") !== user.gender;
  
    if (!hasBasicInfoChanged) {
      alert("Không có thay đổi nào để cập nhật.");
      return;
    }
  
    setLoading(true);
  
    try {
      const updateResponse = await fetch(API_ENDPOINTS.updateBasicInfo, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          patientName,
          dateOfBirth,
          gender: gender === "Nam",
          email: user.email,
          phone: user.phone,
        }),
      });
  
      if (updateResponse.status === 401) {
        alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        sessionStorage.removeItem("user");
        return;
      }
  
      if (!updateResponse.ok) {
        const data = await updateResponse.json();
        throw new Error(data.message || "Lỗi cập nhật thông tin");
      }
  
      const updatedUser = {
        ...user,
        patientName,
        dateOfBirth,
        gender: gender === "Nam"
      };
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Cập nhật thông tin thành công!");
      window.location.href = "/profile_information";
  
    } catch (error) {
      alert(error instanceof Error ? error.message : "Lỗi hệ thống, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };
  

  if (!showModalEditProfile || !user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
      <div className="w-full max-w-[500px] bg-white rounded-3xl p-8 relative shadow-lg">
        <button
          onClick={() => {
            setShowModalEditProfile(false);  
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          ✖
        </button>

        <div className="flex items-center justify-center mb-8">
          <Image src="/logo.png" alt="StrokeAI Logo" width={48} height={48} className="mr-2" />
          <h2 className="!text-[#00BDD6] !font-bold text-2xl">StrokeAI</h2>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-500">Họ và tên</label>
            <input 
              type="text" 
              className="bg-[#F8FBFF] border border-gray-300 rounded-xl px-4 py-2 text-sm" 
              value={patientName} 
              onChange={(e) => setPatientName(e.target.value)} 
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-500">Giới tính</label>
            <select className="bg-[#F8FBFF] border border-gray-300 rounded-xl px-4 py-2 text-sm" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500">Ngày sinh</label>
            <input type="date" className="bg-[#F8FBFF] border border-gray-300 rounded-xl px-4 py-2 text-sm" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button onClick={handleSave} disabled={loading} className="bg-cyan-500 text-white !rounded-full !px-6 !py-3 text-sm font-medium disabled:opacity-50">
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
