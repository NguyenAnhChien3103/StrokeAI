"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import useSWRMutation from "swr/mutation";
import Link from "next/link";

interface IRegister {
  showModalRegister: boolean;
  setShowModalRegister: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalLogin: React.Dispatch<React.SetStateAction<boolean>>;
  setShowModalVerifyOTP : React.Dispatch<React.SetStateAction<boolean>>;
  onHide: () => void;
}

const registerFetcher = async (
  url: string,
  { arg }: { 
    arg: { 
      Username: string;
      Password: string;
      Email: string;
      PatientName: string;
      DateOfBirth: string;
      Gender: boolean;
      Phone: string;
    } 
  }
) => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json"
      },
      body: JSON.stringify(arg),
    });

    let data;
    const textData = await res.text();
    try {
      data = JSON.parse(textData);
    } catch {
      data = textData;
    }

    if (!res.ok) {
      if (typeof data === 'string') {
        throw new Error(data);
      }
      if (data && typeof data === 'object') {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat();
          throw new Error(errorMessages.join('. '));
        }
        throw new Error(data.message || data.title || "Đăng ký thất bại");
      }
      throw new Error("Đăng ký thất bại");
    }

    return data;
  } catch (error: unknown) {
    console.error('Lỗi đăng kí :', error);
    throw error instanceof Error ? error : new Error("Đăng ký thất bại");
  }
};

export default function Register(props: IRegister) {
  const { showModalRegister, setShowModalRegister, setShowModalLogin } = props;
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({
    userName: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dob: "",
    gender: "",
    agreeToTerms: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!showModalRegister) {
      setFullName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setDob("");
      setGender("");
      setAgreeToTerms(false);
      setShowPassword(false);
      setShowConfirmPassword(false);
      setErrors({
        userName: "",
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        dob: "",
        gender: "",
        agreeToTerms: ""
      });
      setIsSubmitted(false);
    }
  }, [showModalRegister]);

  const { trigger, isMutating } = useSWRMutation(
    "http://localhost:5062/api/User/register",
    registerFetcher
  );

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitted(true);

  const newErrors = {
    userName: "",
    fullName: "",
    email: "",
    phone: "",
    password: "", 
    confirmPassword: "",
    dob: "",
    gender: "",
    agreeToTerms: ""
  };

  if (!userName) newErrors.userName = "Vui lòng nhập User Name";
  if (!fullName) newErrors.fullName = "Vui lòng nhập họ và tên";
  if (!email) {
    newErrors.email = "Vui lòng nhập email";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = "Email không hợp lệ";
  }
  if (!phone) {
    newErrors.phone = "Vui lòng nhập số điện thoại";
  } else if (!/^[0-9]{10}$/.test(phone)) {
    newErrors.phone = "Số điện thoại không hợp lệ";
  }
  if (!password) {
    newErrors.password = "Vui lòng nhập mật khẩu";
  } else if (password.length < 6) {
    newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
  }
  if (!confirmPassword) {
    newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
  } else if (confirmPassword !== password) {
    newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
  }
  if (!dob) newErrors.dob = "Vui lòng chọn ngày sinh";
  if (!gender) newErrors.gender = "Vui lòng chọn giới tính";
  if (!agreeToTerms) newErrors.agreeToTerms = "Vui lòng đồng ý với điều khoản sử dụng";

  setErrors(newErrors);

  if (!Object.values(newErrors).some((error) => error !== "")) {
    try {
      const registerData = {
        Username: userName,
        Password: password,
        Email: email,
        PatientName: fullName,
        DateOfBirth: new Date(dob).toISOString(),
        Gender: gender === 'male',
        Phone: phone,
      };
      
      await trigger(registerData);
      sessionStorage.setItem("registerData", JSON.stringify({
        ...registerData,
        credentials: {
          email: email,
          username: userName,
          phone: phone,
        },
        Password: password
      }));

      alert("Vui lòng kiểm tra email để lấy mã OTP!");
      setShowModalRegister(false);
      props.setShowModalVerifyOTP(true);
      
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Đăng ký thất bại");
      }
    }
  }
};

  if (!showModalRegister) return null;


  const handleClose = () => {
    setShowModalRegister(false);
  };

  const handleLogin = () => {
    setShowModalRegister(false);
    setShowModalLogin(true);
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/25 z-50">
      <div className="w-full max-w-[600px] bg-white rounded-3xl p-8 relative">
        <button
          onClick={() => handleClose()}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex items-center justify-center mb-6">
          <Image src="/logo.png" alt="StrokeAI Logo" width={48} height={48} className="mr-2" />
          <h2 className="!text-[#00BDD6] !font-bold text-2xl">StrokeAI</h2>
        </div>
        <p className="text-sm text-gray-500 mb-6 text-center max-w-[400px] mx-auto">
          Một tài khoản StrokeAI là tất cả những gì bạn cần để truy cập tất cả các dịch vụ StrokeAI.
        </p>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
          <div>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${isSubmitted && errors.fullName ? 'border-red-500' : 'border-transparent'} focus:outline-none placeholder:text-gray-400`}
                placeholder="User Name"
                required
              />
              {isSubmitted && errors.userName && (
                <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${isSubmitted && errors.fullName ? 'border-red-500' : 'border-transparent'} focus:outline-none placeholder:text-gray-400`}
                placeholder="Họ và tên"
                required
              />
              {isSubmitted && errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>
          </div>
           
          <div className="grid grid-cols-2 gap-6">
          <div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${isSubmitted && errors.fullName ? 'border-red-500' : 'border-transparent'} focus:outline-none placeholder:text-gray-400`}
                placeholder="Phone Number"
                required
              />
              {isSubmitted && errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${isSubmitted && errors.fullName ? 'border-red-500' : 'border-transparent'} focus:outline-none placeholder:text-gray-400`}
                placeholder="Email"
                required
              />
              {isSubmitted && errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        

          <div className="grid grid-cols-2 gap-6">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${isSubmitted && errors.password ? 'border-red-500' : 'border-transparent'} focus:outline-none pr-10 placeholder:text-gray-400`}
                placeholder="Mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              {isSubmitted && errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${isSubmitted && errors.confirmPassword ? 'border-red-500' : 'border-transparent'} focus:outline-none pr-10 placeholder:text-gray-400`}
                placeholder="Xác nhận mật khẩu"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
              {isSubmitted && errors.confirmPassword && (
                <div className="text-red-500 text-xs mt-1">{errors.confirmPassword}</div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${isSubmitted && errors.dob ? 'border-red-500' : 'border-transparent'} focus:outline-none text-gray-400`}
                required
              />
              {isSubmitted && errors.dob && (
                <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
              )}
            </div>

            <div>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={`w-full bg-[#F8FBFF] rounded-xl px-4 py-3 text-sm border ${isSubmitted && errors.gender ? 'border-red-500' : 'border-transparent'} focus:outline-none appearance-none text-gray-400 ${!gender ? 'text-gray-400' : 'text-gray-900'}`}
                required
                data-placeholder="Giới tính"
              >
                <option value="" disabled className="hidden">Giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
              {isSubmitted && errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>
          </div>

          <div className="text-xs text-gray-500 leading-relaxed">
  <label className="flex items-start">
    <input
      type="checkbox"
      checked={agreeToTerms}
      onChange={(e) => setAgreeToTerms(e.target.checked)}
      className={`h-4 w-4 rounded border ${isSubmitted && errors.agreeToTerms ? 'border-red-500' : 'border-gray-300'} text-[#00BDD6] focus:ring-[#00BDD6]`}
      required
    />
    <span className="ml-2">
      Tôi xác nhận rằng tôi đã đọc, chấp thuận và đồng ý với{" "}
      <Link
  href="/terms_of_service"
  className="text-[#00BDD6] hover:underline"
  onClick={() => setShowModalRegister(false)}
>
  Điều khoản sử dụng
</Link>
{" "}
      và{" "}
  <Link 
    href="/privacy_policy" 
    className="text-[#00BDD6] hover:underline pr-1"
    onClick={() => setShowModalRegister(false)}
  >
    Chính sách bảo mật 
  </Link>

      của StrokeAI.
    </span>
  </label>

  {isSubmitted && errors.agreeToTerms && (
    <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
  )}
</div>


          <button
            type="submit"
            className="w-full bg-[#00BDD6] text-white !rounded-full py-3 text-sm font-medium hover:bg-[#00a8bf] transition-colors mt-4"
            disabled={isMutating}
          >
           {isMutating ? "Đang đăng ký..." : "Đăng Ký"}
          </button>
        </form>

        <div className="text-center mt-4 text-sm text-gray-500">
          <span>Bạn đã có tài khoản? </span>
          <button
            onClick={handleLogin}
            className="text-[#00BDD6] font-medium hover:underline"
          >
            Đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}