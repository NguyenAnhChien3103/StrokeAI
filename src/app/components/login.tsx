"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import ForgotPassword from "./forgot_password";

interface ILogin {
  showModalLogin: boolean;
  setShowModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalResetPasswordOTP: React.Dispatch<React.SetStateAction<boolean>>;
  setEmailForReset: React.Dispatch<React.SetStateAction<string>>;
  onHide: () => void;
}

const fetcher = async (url: string, { arg }: { arg: { Credential: string; Password: string } }) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    throw new Error("Đăng nhập thất bại");
  }

  return res.json();
};

export default function Login({ 
  showModalLogin, 
  setShowModalLogin, 
  setShowModalRegister,
  setShowModalResetPasswordOTP,
  setEmailForReset,
 }: ILogin) {
  const router = useRouter();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ credential: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [showModalForgotPassword, setShowModalForgotPassword] = useState(false);

  const { trigger, isMutating } = useSWRMutation("http://localhost:5062/api/User/login", fetcher);

  useEffect(() => {
    if (!showModalLogin) {
      setCredential("");
      setPassword("");
      setShowPassword(false);
      setErrors({ credential: "", password: "" });
      setLoginError("");
    }
  }, [showModalLogin]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError("");

    const newErrors = {
      credential: credential ? "" : "Vui lòng nhập email hoặc số điện thoại",
      password: password ? "" : "Vui lòng nhập mật khẩu",
    };

    setErrors(newErrors);

    if (!newErrors.credential && !newErrors.password) {
      try {
        const response = await trigger({ Credential: credential, Password: password });
        sessionStorage.setItem("user", JSON.stringify(response.data));
        setShowModalLogin(false);
        router.push("/dashboard");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } catch (error) {
        setLoginError(error instanceof Error ? error.message : "Đăng nhập thất bại");
      }
    }
  };

  return (
    <>
      {showModalForgotPassword && (
  <ForgotPassword
    showModalForgotPassword={showModalForgotPassword}
    setShowModalForgotPassword={setShowModalForgotPassword}
    setShowModalLogin={setShowModalLogin}
    setShowModalResetPasswordOTP={setShowModalResetPasswordOTP}
    setEmailForReset={setEmailForReset}
    onHide={() => setShowModalForgotPassword(false)}
  />
)}
      {showModalLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
          <div className="w-full max-w-[500px] bg-white rounded-3xl p-8 relative">
            <button onClick={() => setShowModalLogin(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              ✖
            </button>
            <div className="flex items-center justify-center mb-8">
              <Image src="/logo.png" alt="StrokeAI Logo" width={48} height={48} className="mr-2" />
              <h2 className="!text-[#00BDD6] !font-bold text-2xl">StrokeAI</h2>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${errors.credential ? "border-red-500" : "border-transparent"} focus:outline-none`}
                placeholder="Email hoặc số điện thoại"
              />
              {errors.credential && <div className="text-red-500 text-xs mt-1">{errors.credential}</div>}

              <div className="relative mt-3">
  <input
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${
      errors.password ? "border-red-500" : "border-transparent"
    } focus:outline-none`}
    placeholder="Mật khẩu"
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
              <div className="flex items-center justify-end">
              <button type="button" className="text-cyan-600 hover:underline cursor-pointer ml-auto block" onClick={() => {
                setShowModalLogin(false);
                setShowModalForgotPassword(true);
              }}>
                Quên mật khẩu
              </button>
              </div>

              {loginError && <div className="text-red-500 text-sm text-center">{loginError}</div>}

              <button type="submit" disabled={isMutating} className={`w-full bg-cyan-500 text-white !rounded-full py-3 text-sm font-medium ${isMutating ? "opacity-50 cursor-not-allowed" : ""}`}>
                {isMutating ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="text-center mt-6 text-sm text-gray-500">
              <span>Bạn chưa có tài khoản? </span>
              <button onClick={() => { setShowModalRegister(true); setShowModalLogin(false); }} className="text-[#00BDD6] font-medium hover:underline">
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
