"use client";
import { useState } from "react";

interface IRegister {
  showModalRegister: boolean;
  setShowModalRegister: React.Dispatch<React.SetStateAction<boolean>>;
  onHide: () => void;
}

export default function Register(props: IRegister) {
  const { showModalRegister, setShowModalRegister } = props;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Full Name:", fullName);
    console.log("Email:", email);
    console.log("Phone:", phone);
    console.log("Password:", password);
    console.log("Confirm Password:", confirmPassword);
    console.log("Date of Birth:", dob);
    console.log("Gender:", gender);
    console.log("Agree to Terms:", agreeTerms);
  };

  const handleForgotPassword = () => {
    alert("Chức năng quên mật khẩu đang được phát triển!");
  };

  const handleLogin = () => {
    setShowModalRegister(false);
    alert("Chuyển sang form đăng nhập!");
  };

  if (!showModalRegister) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="relative w-full max-w-md bg-gray-50 rounded-lg shadow-lg px-8 py-10">
        <button
          onClick={() => setShowModalRegister(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>

        <div className="flex flex-col items-center mb-8">
          <span className="text-2xl font-bold text-[#00BCD4]">Đăng ký tài khoản StrokeAI</span>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="block w-full rounded-lg bg-white px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]"
              placeholder="Họ và tên"
              required
            />
          </div>

          <div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg bg-white px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]"
              placeholder="Email"
              required
            />
          </div>

          <div>
            <input
              type="tel"
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full rounded-lg bg-white px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]"
              placeholder="Số điện thoại"
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

          <div>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full rounded-lg bg-white px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]"
              placeholder="Xác nhận mật khẩu"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="date"
                id="dob"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="block w-full rounded-lg bg-white px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]"
                required
              />
            </div>

            <div>
              <select
                id="gender"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="block w-full rounded-lg bg-white px-4 py-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00BCD4]"
                required
              >
                <option value="">Giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 text-[#00BCD4] rounded focus:ring-[#00BCD4]"
              required
            />
            <label htmlFor="agreeTerms" className="ml-2 text-sm text-gray-600">
              Tôi xác nhận rằng tôi đã đọc, chấp thuận và đồng ý với Điều khoản sử dụng và Chính sách bảo mật của StrokeAI
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold hover:opacity-90"
          >
            Đăng ký
          </button>
        </form>

        <div className="text-center mt-6 text-sm">
          <button
            onClick={handleForgotPassword}
            className="font-semibold text-[#00BCD4] hover:text-[#008B9E]"
          >
            Quên mật khẩu?
          </button>{" "}
          |{" "}
          <button
            onClick={handleLogin}
            className="font-semibold text-[#00BCD4] hover:text-[#008B9E]"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}