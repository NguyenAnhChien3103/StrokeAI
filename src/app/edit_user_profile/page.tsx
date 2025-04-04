"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface ProfileEditProps {
  showModalEditProfile: boolean;
  setShowModalEditProfile: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalVerifyOTP: React.Dispatch<React.SetStateAction<boolean>>;
  setNewEmail: React.Dispatch<React.SetStateAction<string>>;
  setNewPhone: React.Dispatch<React.SetStateAction<string>>;
  onHide?: () => void;
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

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^0\d{9}$/;
  return phoneRegex.test(phone);
};

const ProfileEdit = ({ showModalEditProfile, 
  setShowModalEditProfile, 
  setShowModalVerifyOTP,
  setNewEmail,
  setNewPhone  }: ProfileEditProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [patientName, setPatientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Nam");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  useEffect(() => {
    if (showModalEditProfile) {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setPatientName(parsedUser.patientName || "");
        setDateOfBirth(parsedUser.dateOfBirth ? parsedUser.dateOfBirth.split("T")[0] : "");
        setEmail(parsedUser.email || "");
        setPhone(parsedUser.phone || "");
        setGender(parsedUser.gender ? "Nam" : "Nữ");
      }
    }
  }, [showModalEditProfile]);
    

  const handleSave = async () => {
    if (!user) {
      alert("Lỗi xác thực, vui lòng đăng nhập lại.");
      return;
    }
  
    let emailErrorMessage = "";
    let phoneErrorMessage = "";
    let hasError = false;
    
    if (!isValidEmail(email)) {
      emailErrorMessage = "Email phải có định dạng '@gmail.com'";
      hasError = true;
    }
    
    if (!isValidPhone(phone)) {
      phoneErrorMessage = "Số điện thoại phải có định dạng đúng 10 số và bắt đầu bằng 0";
      hasError = true;
    }
    
    setEmailError(emailErrorMessage);
    setPhoneError(phoneErrorMessage);
    
    if (hasError) return;
  
    const hasEmailChanged = user.email !== email;
    const hasPhoneChanged = user.phone !== phone;
    const hasBasicInfoChanged = 
      patientName !== user.patientName ||
      dateOfBirth !== (user.dateOfBirth ? user.dateOfBirth.split("T")[0] : "") ||
      (gender === "Nam") !== user.gender;
  
    if (!hasEmailChanged && !hasPhoneChanged && !hasBasicInfoChanged) {
      alert("Không có thay đổi nào để cập nhật.");
      return;
    }
  
    setLoading(true);
  
    try {
      if (hasBasicInfoChanged) {
        const updateResponse = await fetch("http://localhost:5062/api/User/update-basic-info", {
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
          throw new Error(data.message || "Lỗi cập nhật thông tin cơ bản");
        }
  
        const updatedUser = { ...user, patientName, dateOfBirth, gender: gender === "Nam" };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      }
  
      if (hasEmailChanged || hasPhoneChanged) {
        setNewEmail(hasEmailChanged ? email : "");
        setNewPhone(hasPhoneChanged ? phone : "");
  
        const otpResponse = await fetch("http://localhost:5062/api/Otp/send-otp", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}` 
          },
        });
  
        if (!otpResponse.ok) {
          throw new Error("Lỗi khi gửi OTP");
        }
  
        setShowModalEditProfile(false);
        setShowModalVerifyOTP(true);
      } else {
        alert("Cập nhật thông tin thành công!");
        window.location.href = "/profile_information";
      }
  
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
            setEmailError("");
            setPhoneError("");
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
            <label className="text-gray-500">User Name</label>
            <input type="text" className="bg-[#F8FBFF] border border-gray-300 rounded-xl px-4 py-2 text-sm" value={user.username} readOnly />
          </div>

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
            <label className="text-gray-500">Email</label>
            <input 
              type="email" 
              className="bg-[#F8FBFF] border border-gray-300 rounded-xl px-4 py-2 text-sm" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
            />
            {emailError && <div className="text-red-500 text-sm">{emailError}</div>}
          </div>

          <div className="flex flex-col">
            <label className="text-gray-500">Số điện thoại</label>
            <input 
              type="text" 
              className="bg-[#F8FBFF] border border-gray-300 rounded-xl px-4 py-2 text-sm" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
            />
            {phoneError && <div className="text-red-500 text-sm">{phoneError}</div>}
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
