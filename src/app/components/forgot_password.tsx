"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import useSWRMutation from "swr/mutation";

interface ForgotPasswordResponse {
  message: string;
}

const forgotPasswordFetcher = async (url: string, { arg }: { arg: { Email: string } }) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  const textData = await response.text();
  
  if (!response.ok) {
    throw new Error(textData || "Có lỗi xảy ra khi gửi yêu cầu");
  }
  try {
    return JSON.parse(textData);
  } catch {
    return { message: textData };
  }
};


interface IForgotPassword {
  showModalForgotPassword: boolean;
  setShowModalForgotPassword: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalResetPasswordOTP: React.Dispatch<React.SetStateAction<boolean>>;
  setEmailForReset: (email: string) => void;
  onHide?: () => void;
}


export default function ForgotPassword({
  showModalForgotPassword,
  setShowModalForgotPassword,
  setShowModalLogin,
  setShowModalResetPasswordOTP,
  setEmailForReset,
}: IForgotPassword) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { trigger, isMutating } = useSWRMutation<ForgotPasswordResponse, Error, string, { Email: string }>(
    "http://localhost:5062/api/User/forgot-password",
    forgotPasswordFetcher
  );

  useEffect(() => {
    if (!showModalForgotPassword) {
      setEmail("");
      setEmailError("");
      setForgotPasswordError("");
      setIsSubmitted(false);
    }
  }, [showModalForgotPassword]);

  const handleBack = () => {
    setShowModalForgotPassword(false);
    setShowModalLogin(true);
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setEmailError("");
    setForgotPasswordError("");

    if (!email.trim()) {
      setEmailError("Vui lòng nhập email hợp lệ");
      return;
    }

    try {
      const result = await trigger({ Email: email });
      alert(result.message);
      setEmailForReset(email); 
      setShowModalForgotPassword(false);
      setShowModalResetPasswordOTP(true);
    } catch (error) {
      setForgotPasswordError(
        error instanceof Error ? error.message : "Đặt lại mật khẩu thất bại"
      );
    }
  };

  return showModalForgotPassword ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
      <div className="w-full max-w-[500px] bg-white rounded-3xl p-8 relative">
        <button onClick={handleBack} className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </button>
        <button onClick={() => setShowModalForgotPassword(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✖</button>
        <div className="flex items-center justify-center mb-8">
          <Image src="/logo.png" alt="StrokeAI Logo" width={48} height={48} className="mr-2" />
          <h2 className="!text-[#00BDD6] !font-bold text-2xl">StrokeAI</h2>
        </div>
        <form onSubmit={handleForgotPassword} className="space-y-4">
          <div className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${isSubmitted && emailError ? "border-red-500" : "border-transparent"} focus:outline-none`}
              placeholder="Email"
            />
            {isSubmitted && emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
          </div>
          {forgotPasswordError && <div className="text-red-500 text-sm text-center">{forgotPasswordError}</div>}
          <button type="submit" disabled={isMutating} className={`w-full bg-cyan-500 text-white !rounded-full py-3 text-sm font-medium ${isMutating ? "opacity-50 cursor-not-allowed" : ""}`}>
            {isMutating ? "Đang gửi yêu cầu..." : "Gửi yêu cầu đặt lại mật khẩu"}
          </button>
        </form>
        <div className="text-center mt-6 text-sm text-gray-500">
          <button>Bạn nhớ mật khẩu? </button>
          <button onClick={handleBack} className="text-[#00BDD6] pl-1 font-medium hover:underline">Đăng nhập</button>
        </div>
      </div>
    </div>
  ) : null;
}
