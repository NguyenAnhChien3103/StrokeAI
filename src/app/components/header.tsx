"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, UserIcon, Lock } from "lucide-react";
import Login from "./login";
import Register from "./register";
import { Button } from "react-bootstrap";
import VerifyOTP from "./verify";
import { FaUserCircle } from "react-icons/fa";
import ResetPasswordOTP from "./verify_reset_password";
import ForgotPassword from "./forgot_password";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showModalLogin, setShowModalLogin] = useState(false);
  const [showModalRegister, setShowModalRegister] = useState(false);
  const [showModalVerifyOTP, setShowModalVerifyOTP] = useState(false);
  const [patientName, setPatientName] = useState<string>("");
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [emailForReset, setEmailForReset] = useState("");
  const [showModalResetPasswordOTP, setShowModalResetPasswordOTP] = useState(false);
  const [showModalForgotPassword, setShowModalForgotPassword] = useState(false);

  interface User {
    id: string;
    name: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/", label: "Trang Chủ" },
    { href: "/info", label: "Thông Tin" },
    { href: "/services", label: "Dịch Vụ" },
    { href: "/posts", label: "Bài Viết" },
    { href: "/pages", label: "Các Trang" },
    { href: "/contact", label: "Liên Hệ" },
  ];

  const handleProfile = () => {
    router.push("/profile_information");
  };

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user"); 
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log("User data:", userData);
      setPatientName(userData.patientName);
      setUser(userData);
    }
  }, []);
  

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowDropdown(false), 500);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
    if (pathname === "/profile_information" || pathname === "/dashboard") {
      router.push("/");
    }
  };
  

  const handleChangePassword = () => {
    router.push('/change_password');
  };

  return (
    <>

<ForgotPassword 
      showModalForgotPassword={showModalForgotPassword}
      setShowModalForgotPassword={setShowModalForgotPassword}
      setShowModalLogin={setShowModalLogin}
      setShowModalResetPasswordOTP={setShowModalResetPasswordOTP}
      setEmailForReset={setEmailForReset}
    />
      <ResetPasswordOTP
      showModalResetPasswordOTP={showModalResetPasswordOTP}
      setShowModalResetPasswordOTP={setShowModalResetPasswordOTP}
      setShowModalForgotPassword={setShowModalForgotPassword}
      email={emailForReset}
    />
    
    <VerifyOTP
      showModalVerifyOTP={showModalVerifyOTP}
      setShowModalVerifyOTP={setShowModalVerifyOTP}
      setShowModalRegister={setShowModalRegister}
      onHide={() => setShowModalVerifyOTP(false)}
    />

    <Register
      showModalRegister={showModalRegister}
      setShowModalRegister={setShowModalRegister}
      setShowModalLogin={setShowModalLogin}
      setShowModalVerifyOTP={setShowModalVerifyOTP}
      onHide={() => setShowModalRegister(false)}
    />

    <Login
      showModalLogin={showModalLogin}
      setShowModalLogin={setShowModalLogin}
      setShowModalRegister={setShowModalRegister}
      setShowModalResetPasswordOTP={setShowModalResetPasswordOTP}
      setEmailForReset={setEmailForReset}
      onHide={() => setShowModalLogin(false)}
    />
      
      <header className="bg-white shadow-md rounded-full px-6 py-3 flex items-center justify-between w-full max-w-6xl mx-auto mt-4">
        <Link href="/" className="!no-underline">
          <div className="flex items-center space-x-2">
            <Image src="/logo.png" alt="StrokeAI Logo" width={40} height={40} />
            <span className="text-xl font-bold text-cyan-500">StrokeAI</span>
          </div>
        </Link>

        <nav className="flex gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-black !no-underline ${
                pathname === item.href ? "font-semibold !text-cyan-500" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex space-x-4">
          {user ? (
            <div
              className="relative z-50"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="px-4 py-2 text-black font-semibold transition flex">
              <FaUserCircle className="text-gray-500 text-2xl mr-3" />
              <span>{patientName} </span>
              </button>
              {showDropdown && (
                <div className="absolute left-1/2 top-full transform -translate-x-1/2 mt-1 bg-white shadow-md rounded-lg py-2 min-w-max">
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100"
                    onClick={handleProfile}
                  >
                    <UserIcon size={18} className="mr-2" />
                    Thông tin cá nhân
                  </button>
                  <button
                      className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100"
                      onClick={handleChangePassword}
                        >
                     <Lock size={18} className="mr-2" />
                     Đổi mật khẩu
                  </button>
                  <button
                    className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} className="mr-2" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Button
                variant="none"
                className="px-4 py-2 rounded-full text-black hover:bg-cyan-500 hover:text-white transition"
                onClick={() => setShowModalRegister(true)}
              >
                Đăng ký
              </Button>
              <button
                className="px-4 py-2 !rounded-full bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition"
                onClick={() => setShowModalLogin(true)}
              >
                Đăng nhập
              </button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {isOpen && (
          <div className="absolute top-16 left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-4 md:hidden">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 text-gray-600 hover:text-cyan-500 ${
                  pathname === item.href ? "text-cyan-500 font-semibold" : ""
                }`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <button
                className="px-4 py-2 text-gray-700 hover:text-red-500 transition"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            ) : (
              <>
                <button
                  className="px-4 py-2 text-gray-700 hover:text-cyan-500 transition"
                  onClick={() => setShowModalLogin(true)}
                >
                  Đăng nhập
                </button>
                <button
                  className="px-4 py-2 text-gray-700 hover:text-cyan-500 transition"
                  onClick={() => setShowModalRegister(true)}
                >
                  Đăng ký
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
