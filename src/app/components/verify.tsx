"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import useSWRMutation from "swr/mutation";
import API_ENDPOINTS from "../utils/apiConfig";


interface IVerifyOTP {
  showModalVerifyOTP: boolean;
  setShowModalVerifyOTP: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalLogin?: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalEditProfile?: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdatingContact?: boolean;
  newEmail?: string;
  newPhone?: string;
  email?: string;
  password?: string;
  onHide?: () => void;
}

const verifyRegisterOtpFetcher = async (
  url: string,  
  { arg }: { arg: { email: string; otp: string } }
) => {
  try {
    console.log("Sending OTP verification:", arg); 

    const res = await fetch(url, {
      method: "POST", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arg),
    });

    const textData = await res.text();
    console.log("Raw response:", textData); 

    if (!res.ok) {
      throw new Error(textData || "Xác thực OTP thất bại");
    }

    return textData;
  } catch (error: unknown) {
    if (error instanceof Error) {
        console.error("Verify OTP error:", error.message);
    } else {
        console.error("Verify OTP error:", error);
    }
    throw error;
}
};
const verifyUpdateOtpFetcher = async (
  url: string,
  { arg }: { arg: { otp: string; newEmail?: string; newPhone?: string } }
) => {
  try {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (!user.token) {
      throw new Error("Phiên đăng nhập hết hạn");
    }

    console.log("Sending request with token:", user.token);

    const res = await fetch(url, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${user.token}`
      },
      body: JSON.stringify(arg),
    });
    if (res.status === 204) {
      return { success: true };
    }

    const textData = await res.text();
    if (!textData) {
      throw new Error("Không có phản hồi từ server");
    }

    let data;
    try {
      data = JSON.parse(textData);
    } catch {
      data = textData;
    }
    
    if (!res.ok) {
      const errorMessage = typeof data === "string" 
        ? data 
        : data.message || "Xác thực OTP thất bại";
      console.error("Update OTP error details:", {
        status: res.status,
        data: data,
        errorMessage
      });
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: unknown) {
    console.error("Verify Update OTP error:", error);
    throw error instanceof Error ? error : new Error("Xác thực OTP thất bại");
}

};



export default function VerifyOTP({
  showModalVerifyOTP,
  setShowModalVerifyOTP,
  setShowModalRegister,
  isUpdatingContact = false,
  newEmail,
  newPhone,
}: IVerifyOTP) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  useEffect(() => {
    if (!showModalVerifyOTP) {
      setOtp("");
      setError("");
    }
  }, [showModalVerifyOTP]);

  const { trigger: triggerRegister } = useSWRMutation(
    API_ENDPOINTS.verifyRegisterOtp,
    verifyRegisterOtpFetcher
  );

  const { trigger: triggerUpdate } = useSWRMutation(
    API_ENDPOINTS.verifyUpdateOtp,
    verifyUpdateOtpFetcher
  );


  const autoLogin = async (credential: string, password: string) => {
    try {
      const res = await fetch(API_ENDPOINTS.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          Credential: credential, 
          Password: password 
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");
      return data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new Error(error.message || "Đăng nhập thất bại");
      }
      throw new Error("Đăng nhập thất bại");
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    if (!otp) {
      setError("Vui lòng nhập mã OTP");
      return;
    }
  
    setIsLoading(true);
    try {
      if (isUpdatingContact) {
        const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}");
        console.log("Current user data:", currentUser);
  
        const result = await triggerUpdate({
          otp,
          newEmail,
          newPhone
        });
  
        console.log("Update response:", result);
  
        const updatedUser = {
          ...currentUser,
          email: newEmail || currentUser.email,
          phone: newPhone || currentUser.phone
        };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
  
        alert("Cập nhật thông tin thành công!");
        setShowModalVerifyOTP(false);
        window.location.href = "/profile_information";
      } else {
        const registerData = JSON.parse(sessionStorage.getItem("registerData") || "{}");
        console.log("Register data from session:", registerData);
  
        if (!registerData.Email) {
          throw new Error("Không tìm thấy thông tin đăng ký");
        }
  
        await triggerRegister({
          email: registerData.Email,
          otp: otp
        });
  
        try {
          const loginResult = await autoLogin(registerData.Email, registerData.Password);
          console.log("Auto login result:", loginResult);
  
          const userData = {
            UserId: loginResult.data.UserId,
            Username: loginResult.data.Username,
            DateOfBirth: loginResult.data.DateOfBirth,
            Email: loginResult.data.Email,
            Gender: loginResult.data.Gender,
            Phone: loginResult.data.Phone,
            PatientName: loginResult.data.PatientName,
            Roles: loginResult.data.Roles,
            Token: loginResult.data.Token
          };
        
          console.log("Storing user data:", userData);
          sessionStorage.setItem("user", JSON.stringify(loginResult.data));
         sessionStorage.removeItem("registerData");
          
          alert("Đăng ký và đăng nhập thành công!");
          setShowModalVerifyOTP(false);
          window.location.href = "/";
        } catch (loginError) {
          console.error("Auto login failed:", loginError);
          throw new Error("Xác thực thành công nhưng không thể đăng nhập tự động");
        }
      }
    } catch (err: unknown) {
      console.error("Verification error:", err);
      const errorMessage = err instanceof Error ? err.message : "Lỗi xác thực";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return showModalVerifyOTP ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
      <div className="w-full max-w-[500px] bg-white rounded-3xl p-8 relative">
        <button
          onClick={() => {
            setShowModalVerifyOTP(false);
            setShowModalRegister(true);
          }}
          className="absolute font-bold top-4 left-4 text-black hover:text-gray-600 text-xl"
        >
          ←
        </button>
        <button
          onClick={() => setShowModalVerifyOTP(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✖
        </button>
        <div className="flex items-center justify-center mb-8">
          <Image src="/logo.png" alt="StrokeAI Logo" width={48} height={48} className="mr-2" />
          <h2 className="!text-[#00BDD6] !font-bold text-2xl">StrokeAI</h2>
        </div>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border border-gray-300 focus:outline-none text-center"
            placeholder="Nhập mã OTP"
          />
          <button type="submit" disabled={isLoading} className="w-full mt-2 bg-cyan-500 text-white !rounded-full py-3 text-sm font-medium">
            {isLoading ? "Đang xử lý..." : "Xác nhận OTP"}
          </button>
        </form>
      </div>
    </div>
  ) : null;
}