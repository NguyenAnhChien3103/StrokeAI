"use client";

import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import ProfileEdit from "../edit_user_profile/page";
import VerifyOTP from "../components/verify";

interface User {
  userId: number;
  username: string;
  role: string;
  patientName: string;
  dateOfBirth: string | null;
  email: string;
  gender: boolean;
  phone: string;
  token: string;
}

const UserProfile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showModalEditProfile, setShowModalEditProfile] = useState(false);
  const [showModalVerifyOTP, setShowModalVerifyOTP] = useState(false);
  const [newEmail, setNewEmail] = useState(""); 
  const [newPhone, setNewPhone] = useState("");

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.username) {
          setUser(parsedUser);
        }
      }
  
      if (!showModalVerifyOTP) {
        setNewEmail("");
        setNewPhone("");
      }
    } catch (error) {
      console.error("Failed to parse user data from sessionStorage:", error);
    }
  }, [showModalVerifyOTP]);
  

  const handleEdit = () => {
    console.log("Chuyển sang trang sửa thông tin");
    setShowModalEditProfile(true);
  };

  if (!user) {
    return <div className="text-center text-gray-600 text-lg font-medium mt-6">Không tìm thấy thông tin người dùng</div>;
  }

  return (
    <>
       <ProfileEdit
        showModalEditProfile={showModalEditProfile}
        setShowModalEditProfile={setShowModalEditProfile}
        setShowModalVerifyOTP={setShowModalVerifyOTP}
        onHide={() => setShowModalEditProfile(false)}
        setNewEmail={setNewEmail}  
        setNewPhone={setNewPhone}  
      />
         <VerifyOTP
        showModalVerifyOTP={showModalVerifyOTP}
        setShowModalVerifyOTP={setShowModalVerifyOTP}
        setShowModalRegister={() => {}}
        isUpdatingContact={true}
        newEmail={newEmail}
        newPhone={newPhone}
        email={user.email}
      />
      <Container className="max-w-lg mx-auto !px-20 py-5">
        <p className="font-bold !text-3xl">Thông tin người dùng</p>
        <div className="mt-6 space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-500">User Name</label>
            <input type="text" className="border rounded px-3 py-2 w-full" value={user.username} readOnly />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-500">Họ và tên</label>
            <input type="text" className="border rounded px-3 py-2 w-full" value={user.patientName} readOnly />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-500">Email</label>
            <input type="email" className="border rounded px-3 py-2 w-full" value={user.email} readOnly />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-500">Số điện thoại</label>
            <input type="text" className="border rounded px-3 py-2 w-full" value={user.phone} readOnly />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-500">Giới tính</label>
            <input type="text" className="border rounded px-3 py-2 w-full" value={user.gender ? "Nam" : "Nữ"} readOnly />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-500">Ngày sinh</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              value={user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString("vi-VN") : "Thêm thông tin"}
              readOnly
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <div
            className="relative inline-flex items-center justify-start px-5 py-2 bg-cyan-500 text-white font-medium rounded-lg shadow-lg transition duration-300 hover:text-transparent active:translate-x-1 active:translate-y-1 active:shadow-md cursor-pointer"
            onClick={handleEdit}
          >
            Chỉnh sửa thông tin
            <svg className="absolute right-5 w-3 fill-white transition-all duration-300 group-hover:right-1/2" viewBox="0 0 512 512">
              <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z" />
            </svg>
          </div>
        </div>
      </Container>
    </>
  );
};

export default UserProfile;
