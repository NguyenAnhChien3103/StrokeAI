"use client";
import React, { useState, useEffect } from "react";
import useSWRMutation from "swr/mutation";
import Image from "next/image";
import API_ENDPOINTS from "../utils/apiConfig";

const resetPasswordFetcher = async (
  url: string,
  { arg }: { arg: { email: string; otp: string; newPassword: string } }
) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arg),
    });

    const textData = await res.text();

    if (!res.ok) {
      throw new Error(textData);
    }

    return textData;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Đặt lại mật khẩu thất bại");
  }
};

interface IResetPasswordOTP {
  showModalResetPasswordOTP: boolean;
  setShowModalResetPasswordOTP: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
  email: string;
}

export default function ResetPasswordOTP({
  showModalResetPasswordOTP,
  setShowModalResetPasswordOTP,
  setShowModalForgotPassword,
  email,
}: IResetPasswordOTP) {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) alert(error);
  }, [error]);

  useEffect(() => {
    if (!showModalResetPasswordOTP) {
      setOtp("");
      setNewPassword("");
      setError("");
      setShowPassword(false); 
    }
  }, [showModalResetPasswordOTP]);

  const { trigger: triggerResetPassword } = useSWRMutation(
    API_ENDPOINTS.resetPassword,
    resetPasswordFetcher
  );

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
  
    if (!otp || !newPassword) {
      setError("Vui lòng nhập mã OTP và mật khẩu mới");
      return;
    }
  
    setIsLoading(true);
    try {
      await triggerResetPassword({ email, otp, newPassword });
      alert("Đặt lại mật khẩu thành công! Vui lòng thử đăng nhập lại.");
      setShowModalResetPasswordOTP(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message === "Invalid or expired OTP." 
          ? "Mã OTP không hợp lệ hoặc đã hết hạn"
          : "Lỗi đặt lại mật khẩu");
      } else {
        setError("Lỗi đặt lại mật khẩu");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return showModalResetPasswordOTP ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
      <div className="w-full max-w-[500px] bg-white rounded-3xl p-8 relative shadow-lg">
        <div className="flex justify-between items-center">
          <button
            onClick={() => {
              setShowModalResetPasswordOTP(false);
              setShowModalForgotPassword(true);
            }}
            className="text-gray-500 hover:text-gray-600 text-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>

          <button
            onClick={() => setShowModalResetPasswordOTP(false)}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✖
          </button>
        </div>

        <div className="flex items-center justify-center mb-8">
          <Image src="/logo.png" alt="Logo" width={48} height={48} className="mr-2" />
          <h2 className="!text-[#00BDD6] !font-bold text-2xl">StrokeAI</h2>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-500">Mã OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="bg-[#F8FBFF] border border-gray-300 rounded-xl px-4 py-3 text-sm"
              placeholder="Nhập mã OTP"
            />
          </div>

          <div className="flex flex-col relative">
  <label className="text-gray-500">Mật khẩu mới</label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
      className="bg-[#F8FBFF] border border-gray-300 rounded-xl px-4 py-3 text-sm pr-12 w-full"
      placeholder="Nhập mật khẩu mới"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
</div>


          {error && <div className="text-red-500 text-sm">{error}</div>}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-cyan-500 text-white !rounded-full py-3 text-sm font-medium ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? "Đang xử lý..." : "Xác nhận & Đặt lại mật khẩu"}
          </button>
        </form>
      </div>
    </div>
  ) : null;
}
