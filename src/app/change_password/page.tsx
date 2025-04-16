"use client";
import { useState } from "react";
import { Container } from "react-bootstrap";

export default function ChangePassword() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChangePassword = async () => {
    setSubmitted(true);
    setErrors({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });

    const userData = sessionStorage.getItem("user");
    if (!userData) {
      setErrors((prev) => ({ ...prev, oldPassword: "Người dùng chưa đăng nhập" }));
      return;
    }
    
    const user = JSON.parse(userData);
    if (!user.token) {
      setErrors((prev) => ({ ...prev, oldPassword: "Phiên đăng nhập không hợp lệ" }));
      return;
    }

    let hasError = false;
    if (!oldPassword) {
      setErrors((prev) => ({ ...prev, oldPassword: "Vui lòng nhập mật khẩu cũ" }));
      hasError = true;
    }
    if (!newPassword) {
      setErrors((prev) => ({ ...prev, newPassword: "Vui lòng nhập mật khẩu mới" }));
      hasError = true;
    }
    if (!confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Vui lòng xác nhận mật khẩu mới" }));
      hasError = true;
    }
    if (newPassword !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Mật khẩu xác nhận không khớp" }));
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5062/api/User/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          CurrentPassword: oldPassword,
          NewPassword: newPassword
        })
      });
      
      if (!response.ok) {
        const textData = await response.text();
        if (textData.includes("Current password is incorrect")) {
          setErrors((prev) => ({ ...prev, oldPassword: "Mật khẩu cũ không đúng" }));
          return;
        }
        if (textData.includes("new password must be different")) {
          setErrors((prev) => ({ ...prev, newPassword: "Mật khẩu mới phải khác mật khẩu cũ" }));
          return;
        }
        throw new Error(textData);
      }

      alert("Đổi mật khẩu thành công!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSubmitted(false);
    } catch (error) {
      console.error("Change password error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="max-w-md mx-auto px-4 py-5 flex justify-center items-center flex-col">
    <div className="w-5xl">
      <p className="text-2xl !font-bold text-cyan-500 mb-6">Thay Đổi Mật Khẩu</p>
      <div className="space-y-5">
        {[
          { label: "Mật khẩu cũ", value: oldPassword, setValue: setOldPassword, show: showOldPassword, setShow: setShowOldPassword, error: error.oldPassword },
          { label: "Mật khẩu mới", value: newPassword, setValue: setNewPassword, show: showNewPassword, setShow: setShowNewPassword, error: error.newPassword },
          { label: "Xác nhận mật khẩu mới", value: confirmPassword, setValue: setConfirmPassword, show: showConfirmPassword, setShow: setShowConfirmPassword, error: error.confirmPassword }
        ].map((field, index) => (
          <div key={index} className="space-y-1">
            <div className="relative">
              <input
                type={field.show ? "text" : "password"}
                placeholder={field.label}
                className={`w-full px-4 py-2 border rounded-xl ${submitted && field.error ? "border-red-500" : ""}`}
                value={field.value}
                onChange={(e) => field.setValue(e.target.value)}
              />
              <button
                type="button"
                onClick={() => field.setShow(!field.show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {field.show ? (
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
            </div>
            {submitted && field.error && (
              <p className="text-red-500 text-sm">{field.error}</p>
            )}
          </div>
        ))}
        
        <div className=" !flex justify-end">
        <button
          onClick={handleChangePassword}
          disabled={loading}
          className="bg-cyan-500 text-white px-10 py-2 !rounded-full disabled:opacity-50 mt-4"
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </button>
        </div>
      </div>
    </div>
  </Container>
  );
}
