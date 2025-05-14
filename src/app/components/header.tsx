"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, LogOut, UserIcon, Lock, Users , Heart , Smartphone ,  Bell , MapPin, FileText } from "lucide-react";
import Login from "./login";
import Register from "./register";
import { Button } from "react-bootstrap";
import VerifyOTP from "./verify";
import { FaUserCircle } from "react-icons/fa";
import ResetPasswordOTP from "./verify_reset_password";
import ForgotPassword from "./forgot_password";
import Nofication from "../components/nofication"; 

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const bellTimeoutRef = useRef(null); 


  interface User {
    id: string;
    name: string;
  }

  const [user, setUser] = useState<User | null>(null);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  

  const navItems = [
    { href: "/", label: "Trang Chủ" },
    { href: "https://www.prudential.com.vn/vi/blog-nhip-song-khoe/dot-quy-tre-hoa-va-nguy-co-cho-ca-mot-the-he/", label: "Bài Viết" },
    { href: "/first_aid_instructions", label: "Hướng dẫn sơ cứu" }, 
    { href: "https://www.happymoveonline.vn/content/8097/c%C3%A1c-s%E1%BB%91-%C4%91i%E1%BB%87n-tho%E1%BA%A1i-kh%E1%BA%A9n-c%E1%BA%A5p-m%C3%A0-b%E1%BA%A1n-n%C3%AAn-ghi-nh%E1%BB%9B#:~:text=%2D%20112%20l%C3%A0%20%C4%91%E1%BA%A7u%20s%E1%BB%91%20y%C3%AAu,c%E1%BA%A5p%20c%E1%BB%A9u%20v%E1%BB%81%20y%20t%E1%BA%BF.", label: "Liên Hệ Cứu Hộ Khẩn Cấp" }
  ];

  const handleProfile = () => {
    router.push("/profile_information");
  };

  const handleManageDevices = () => {
    router.push("/devices");
  }

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
    setShowUserDropdown(true);
    setShowBellDropdown(false); 
  };
  
  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setShowUserDropdown(false), 500);
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("devices");
    setUser(null);
    setShowUserDropdown(false);
    router.push("/");
  };
  
  const handleBellMouseEnter = () => {
    if (bellTimeoutRef.current) clearTimeout(bellTimeoutRef.current);
    setShowBellDropdown(true);
    setShowUserDropdown(false); 
  };
  
  const handleBellMouseLeave = () => {
    bellTimeoutRef.current = setTimeout(() => setShowBellDropdown(false), 100);
  };
  

  const handleInviteFamily = () => {
     router.push("/invite");
  };

  const handleHealthStats = () => {
    router.push("/user_dashboard");
  }
  

  const handleChangePassword = () => {
    router.push('/change_password');
  };


  const handleManagePatients = () => {
    router.push('/admin_dashboard'); 
  };

  const  handleViewLocation = () => {
    router.push('/me_location');
  }

  const handleCaseHistory = () => {
    router.push('/case_history');
  };

  const handleUserManagement = () => {
    router.push('/manager_user');
  }

  useEffect(() => {
    const userSession = sessionStorage.getItem("user");
    if (userSession) {
      try {
        const user = JSON.parse(userSession);
        const roles = user.roles || [];
        setIsAdmin(roles.includes("admin"));
        setIsDoctor(roles.includes("doctor"));
      } catch (error) {
        console.error("Lỗi parse session:", error);
      }
    }
  }, []);
  
  

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
              className={`text-black !no-underline font-bold ${
                pathname === item.href ? "font-semibold !text-cyan-500" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <>
  <div className="hidden md:flex space-x-4">
    {user ? (
      <>
        <div
          className="relative z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <button className="py-2 text-black font-semibold transition flex items-center">
            <FaUserCircle className="text-gray-500 text-2xl mr-2" />
            <span >{patientName},</span>
          </button>

          {showUserDropdown && (
            <div className="absolute left-1/2 top-full transform -translate-x-1/2 mt-1 bg-white shadow-md rounded-lg py-2 min-w-max">
              <button className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100" onClick={handleProfile}>
                <UserIcon size={18} className="mr-2" />
                Thông tin cá nhân
              </button>
                <button className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100" onClick={handleViewLocation}>
                  <MapPin size={18} className="mr-2" />
                  Xem vị trí bản thân
                </button>
                <button className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100" onClick={handleCaseHistory}>
                  <FileText size={18} className="mr-2" />
                  Xem chỉ số sức khỏe
                </button>
              {isDoctor && (
                <button className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100" onClick={handleManagePatients}>
                  <Users size={18} className="mr-2" />
                  Quản lý bệnh nhân
                </button>
              )}
              {isAdmin &&  (
                <button
                className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100"
                onClick={handleUserManagement}
              >
                <Users size={18} className="mr-2" />
                Quản lý người dùng
              </button>
              )}
              <button className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100" onClick={handleManageDevices}>
                <Smartphone size={18} className="mr-2" />
                Quản lý thiết bị
              </button>
      
              <button className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100" onClick={handleInviteFamily}>
                <Users size={18} className="mr-2" />
                Mời người nhà
              </button>
        
                <button className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100" onClick={handleHealthStats}>
                  <Heart size={18} className="mr-2" />
                  Quản lý hồ sơ sức khỏe
                </button>
              <button className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100" onClick={handleChangePassword}>
                <Lock size={18} className="mr-2" />
                Đổi mật khẩu
              </button>
              <button className="flex items-center w-full text-left px-4 py-2 text-gray-700 font-bold hover:bg-gray-100" onClick={handleLogout}>
                <LogOut size={18} className="mr-2" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        <div
  className="relative z-50"
  onMouseEnter={handleBellMouseEnter}
  onMouseLeave={handleBellMouseLeave}
>
  <button className="px-2 py-2">
    <Bell className="text-gray-500 text-2xl" />
  </button>

  {showBellDropdown && (
    <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-1 bg-white shadow-md rounded-lg py-2 min-w-[350px] max-w-[600px] w-auto z-50">
      <Nofication />
    </div>
  )}
</div>

      </>
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
</>


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
