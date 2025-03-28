"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import useSWR, { mutate } from "swr";

interface IVerifyOTP {
  showModalVerifyOTP: boolean;
  setShowModalVerifyOTP: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalRegister: React.Dispatch<React.SetStateAction<boolean>>;
  onHide: () => void;
}

export default function VerifyOTP({ showModalVerifyOTP, setShowModalVerifyOTP, setShowModalRegister }: IVerifyOTP) {
  const { data: email } = useSWR("userEmail");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!showModalVerifyOTP) {
      setOtp("");
      setError("");
      setIsSubmitted(false);
    }
  }, [showModalVerifyOTP]);

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);
    setError("");

    if (!otp) {
      setError("Vui lòng nhập mã OTP");
      return;
    }

    if (!email) {
      setError("Lỗi: Không tìm thấy email đã đăng ký!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5062/api/user/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (!res.ok) throw new Error(await res.text());

      alert("Xác thực OTP thành công!");
      mutate("userEmail", null);
      setShowModalVerifyOTP(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Lỗi xác thực OTP");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRegister = () => {
    setShowModalVerifyOTP(false);
    setShowModalRegister(true);
  };

  return showModalVerifyOTP ? (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
      <div className="w-full max-w-[500px] bg-white rounded-3xl p-8 relative">
        <button onClick={handleBackToRegister} className="absolute font-bold top-4 left-4 text-black hover:text-gray-600 text-xl">
          ←
        </button>
        <button onClick={() => setShowModalVerifyOTP(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          ✖
        </button>
        <div className="flex items-center justify-center mb-8">
          <Image src="/logo.png" alt="StrokeAI Logo" width={48} height={48} className="mr-2" />
          <h2 className="!text-[#00BDD6] !font-bold text-2xl">StrokeAI</h2>
        </div>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <p className="text-center text-gray-500 text-sm">{email ? `Email: ${email}` : "Đang tải email..."}</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${
                isSubmitted && error ? "border-red-500" : "border-gray-300"
              } focus:outline-none text-center`}
              placeholder="Nhập mã OTP"
            />
            {isSubmitted && error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            <p className="text-red-500 text-xs mt-1">* Kiểm tra số điện thoại hoặc email của bạn.</p>
          </div>
          <button type="submit" disabled={isLoading} className="w-full mt-2 bg-cyan-500 text-white !rounded-full py-3 text-sm font-medium">
            {isLoading ? "Đang xác thực..." : "Xác nhận"}
          </button>
        </form>
      </div>
    </div>
  ) : null;
}
