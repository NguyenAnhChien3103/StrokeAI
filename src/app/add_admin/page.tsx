"use client";
import React, { useState } from "react";
import { mutate } from "swr";
import { Container } from "react-bootstrap";
import API_ENDPOINTS from "../utils/apiConfig";

const CreateAdminForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [patientName, setPatientName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<boolean | null>(null); 
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  

  const validateInputs = () => {
    const newErrors: { [key: string]: string } = {};

    if (!username || username.length < 3) {
      newErrors.username = "Username phải có ít nhất 3 ký tự";
    }
    if (!password || password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!patientName || patientName.length < 2) {
      newErrors.patientName = "Họ tên phải có ít nhất 2 ký tự";
    }
    if (!dateOfBirth) {
      newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
    }
    if (gender === null) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }
    if (!phone || !/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = "Số điện thoại phải có 10 chữ số";
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
}; 


const createAdmin = async () => {
  setIsSubmitting(true);
  
  if (!validateInputs()) {
    setIsSubmitting(false);
    return;
  }  


  const dateValue = new Date(dateOfBirth);
  if (isNaN(dateValue.getTime())) {
    setErrors(prev => ({...prev, dateOfBirth: "Ngày sinh không hợp lệ"}));
    setIsSubmitting(false);
    return;
  }

  const data = {
    username,
    password,
    patientName,
    dateOfBirth: dateValue.toISOString(),
    gender,
    phone,
    email,
  };

  
  try {
    const response = await fetch(API_ENDPOINTS.createAdmin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", 
      body: JSON.stringify(data),
    });
  
    const responseText = await response.text();
    
    if (response.status === 401) {
      alert("Bạn không có quyền thực hiện thao tác này. Vui lòng đăng nhập lại.");
      return;
    }

    if (response.status === 403) {
      alert("Bạn không có đủ quyền để tạo tài khoản admin.");
      return;
    }

    if (!response.ok) {
      try {
        const responseData = JSON.parse(responseText);
        if (responseData.message?.includes("already exists")) {
          alert("Username đã tồn tại trong hệ thống!");
        } else {
          throw new Error(responseData.message || "Không thể tạo tài khoản admin");
        }
      } catch {
        throw new Error(responseText || "Không thể tạo tài khoản admin");
      }
      return;
    }

    alert("Tạo tài khoản admin thành công!");
    setUsername("");
    setPassword("");
    setPatientName("");
    setDateOfBirth("");
    setPhone("");
    setEmail("");
    setGender(null);
    setErrors({});
    
    await mutate("adminData");

  } catch (error) {
    alert(error instanceof Error ? 
      `Đã xảy ra lỗi: ${error.message}` : 
      "Đã xảy ra lỗi không xác định"
    );
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Container className="max-w-lg mx-auto !px-20 py-5">
      <h1 className="!font-bold !text-3xl">Tạo tài khoản Admin</h1>
      <div className="mt-6 space-y-4">
      <div className="flex flex-col">
      <label className="text-gray-500">Username</label>
      <input
        type="text"
        className={`border rounded px-3 py-2 w-full ${errors.username ? 'border-red-500' : ''}`}
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
          // Clear error when typing
          if (errors.username) {
            setErrors({ ...errors, username: '' });
          }
        }}
      />
      {errors.username && (
        <div className="text-red-500 text-xs mt-1">{errors.username}</div>
      )}
    </div>
    <div className="flex flex-col">
      <label className="text-gray-500">Email</label>  
      <input
        type="email"
        className={`border rounded px-3 py-2 w-full ${errors.email ? 'border-red-500' : ''}`}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) {
            setErrors({ ...errors, email: '' });
          }
        }}
      />
      {errors.email && (
        <div className="text-red-500 text-xs mt-1">{errors.email}</div>
      )}
    </div>

    <div className="flex flex-col">
  <label className="text-gray-500 mb-1">Password</label>
  
  <div className="relative w-full">
    <input
      type={showPassword ? "text" : "password"}
      className={`border rounded px-3 py-2 w-full pr-10 ${errors.password ? 'border-red-500' : ''}`}
      value={password}
      onChange={(e) => {
        setPassword(e.target.value);
        if (errors.password) {
          setErrors({ ...errors, password: '' });
        }
      }}
    />
    
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
    >
      {showPassword ? (
       <svg
       xmlns="http://www.w3.org/2000/svg"
       fill="none"
       viewBox="0 0 24 24"
       strokeWidth={1.5}
       stroke="currentColor"
       className="w-5 h-5"
     >
       <path
         strokeLinecap="round"
         strokeLinejoin="round"
         d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
       />
     </svg>
   ) : (
     <svg
       xmlns="http://www.w3.org/2000/svg"
       fill="none"
       viewBox="0 0 24 24"
       strokeWidth={1.5}
       stroke="currentColor"
       className="w-5 h-5"
     >
       <path
         strokeLinecap="round"
         strokeLinejoin="round"
         d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
       />
       <path
         strokeLinecap="round"
         strokeLinejoin="round"
         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
       />
     </svg>
      )}
    </button>
  </div>

  {errors.password && (
    <div className="text-red-500 text-xs mt-1">{errors.password}</div>
  )}
</div>


    <div className="flex flex-col">
    <label className="text-gray-500">Họ và tên</label>
    <input
      type="text"
      className={`border rounded px-3 py-2 w-full ${errors.patientName ? 'border-red-500' : ''}`}
      value={patientName}
      onChange={(e) => {
      setPatientName(e.target.value);
      if (errors.patientName) {
        setErrors({ ...errors, patientName: '' });
      }
    }}
  />
  {errors.patientName && (
    <div className="text-red-500 text-xs mt-1">{errors.patientName}</div>
  )}
</div>
        <div className="flex flex-col">
  <label className="text-gray-500">Ngày sinh</label>
  <input
    type="date"
    className={`border rounded px-3 py-2 w-full ${errors.dateOfBirth ? 'border-red-500' : ''}`}
    value={dateOfBirth}
    onChange={(e) => {
      setDateOfBirth(e.target.value);
      if (errors.dateOfBirth) {
        setErrors({ ...errors, dateOfBirth: '' });
      }
    }}
  />
  {errors.dateOfBirth && (
    <div className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</div>
  )}
</div>
<div className="flex flex-col">
  <label className="text-gray-500">Giới tính <span className="text-red-500">*</span></label>
  <select
    value={gender === null ? "" : gender.toString()}
    onChange={(e) => {
      const value = e.target.value;
      if (value === "") {
        setGender(null);
      } else {
        setGender(value === "true");
      }
      if (errors.gender) {
        setErrors({ ...errors, gender: '' });
      }
    }}
    className={`border rounded px-3 py-2 w-full ${errors.gender ? 'border-red-500' : ''}`}
    required
  >
    <option value="" hidden>Giới tính</option>
    <option value="true">Nam</option>
    <option value="false">Nữ</option>
  </select>
  {errors.gender && (
    <div className="text-red-500 text-xs mt-1">{errors.gender}</div>
  )}
</div>
<div className="flex flex-col">
  <label className="text-gray-500">Số điện thoại</label>
  <input
    type="text"
    className={`border rounded px-3 py-2 w-full ${errors.phone ? 'border-red-500' : ''}`}
    value={phone}
    onChange={(e) => {
      setPhone(e.target.value);
      if (errors.phone) {
        setErrors({ ...errors, phone: '' });
      }
    }}
  />
  {errors.phone && (
    <div className="text-red-500 text-xs mt-1">{errors.phone}</div>
  )}
</div>
        <div className="mt-6 flex justify-end items-ends">
        <button
  onClick={createAdmin}
  disabled={isSubmitting}
  className={`bg-cyan-500 px-10 text-white !rounded-full py-3 text-sm font-medium
    ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
>
  {isSubmitting ? "Đang tạo..." : "Tạo tài khoản Admin"}
</button>
        </div>
      </div>
    </Container>
  );
};
export default CreateAdminForm;
