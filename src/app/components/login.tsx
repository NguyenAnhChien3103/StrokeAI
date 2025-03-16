"use client";
import Image from "next/image";
import { useState } from "react";

interface ILogin {
  showModalLogin: boolean;
  setShowModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
  onHide: () => void;
}

export default function Login(props: ILogin) {
  const { showModalLogin, setShowModalLogin } = props;
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email/Phone:", emailOrPhone);
    console.log("Password:", password);
  };

  const handleForgotPassword = () => {
    alert("Chức năng quên mật khẩu đang được phát triển!");
  };

  const handleSignUp = () => {
    alert("Chức năng đăng ký tài khoản đang được phát triển!");
  };

  if (!showModalLogin) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-md bg-gray-50 rounded-lg shadow-lg px-8 py-10">
        <button
          onClick={() => setShowModalLogin(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex flex-col items-center mb-8">
          <Image src="/logo.png" alt="StrokeAI Logo" width={50} height={50} />
          <span className="text-2xl font-bold text-[#00BCD4] mt-2">StrokeAI</span>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <input
              type="text"
              id="emailOrPhone"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="block w-full rounded-lg bg-white px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]"
              placeholder="Số điện thoại / Email"
              required
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-lg bg-white px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]"
              placeholder="Mật khẩu"
              required
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-[#00BCD4] hover:text-[#008B9E]"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold hover:opacity-90"
          >
            Đăng nhập
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          Bạn chưa có tài khoản?{" "}
          <button
            onClick={handleSignUp}
            className="font-semibold text-[#00BCD4] hover:text-[#008B9E]"
          >
            Đăng ký
          </button>
        </div>
      </div>
    </div>
  );
}