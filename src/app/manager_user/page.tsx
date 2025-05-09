"use client";
import useSWR from "swr";
import { useState, useEffect } from 'react';
import API_ENDPOINTS from "../utils/apiConfig";
import { User } from './types';
import AdminRoleView from '../components/AdminRoleView';
import DoctorRoleView from '../components/DoctorRoleView';
import ToggleAccountStatusView from '../components/ToggleAccountStatusView';

type ViewMode = 'toggleStatus' | 'addAdmin' | 'removeAdmin' | 'addDoctor' | 'removeDoctor';

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [token, setToken] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('toggleStatus');

  const removeAccents = (str: string) => {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(parsedUser.token);
      }
    }
  }, []);

  const fetcher = async (url: string) => {
    if (!token) throw new Error("Token chưa sẵn sàng");

    const res = await fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Lỗi xác thực hoặc lỗi server");

    const json = await res.json();
    const users = json?.users || [];

    return users.map((user) => ({
      ...user,
      roles: user.roles || [],
      is_active: user.is_active ?? 1,
      isActive: user.is_active === 1,
      status: user.is_active === 1 ? "Hoạt động" : "Đã khóa"
    }));
  };

  const { data: users, error, isLoading, mutate } = useSWR<User[]>(
    token ? API_ENDPOINTS.getUsers : null,
    token ? fetcher : null,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      onSuccess: (data) => {
        console.log('Data fetched successfully:', data);
      },
      onError: (err) => {
        console.error('Error fetching data:', err);
      }
    }
  );

  const filteredUsers = Array.isArray(users)
    ? users.filter(user => {
        const searchTermNoAccent = removeAccents(searchTerm.toLowerCase());
        const matchesSearch = searchTerm === "" ||
          removeAccents(user.username.toLowerCase()).includes(searchTermNoAccent) ||
          removeAccents(user.patientName.toLowerCase()).includes(searchTermNoAccent) ||
          user.phone.includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesGender = genderFilter === "all" ||
          (genderFilter === "male" && Number(user.gender) === 0) ||
          (genderFilter === "female" && Number(user.gender) === 1);

        const matchesRole = roleFilter === "all" || user.roles.includes(roleFilter);

        return matchesSearch && matchesGender && matchesRole;
      })
    : [];

  const renderView = () => {
    switch (viewMode) {
      case 'toggleStatus':
        return <ToggleAccountStatusView users={filteredUsers} token={token} onSuccess={() => mutate()} />;
      case 'addAdmin':
        return <AdminRoleView users={filteredUsers} token={token} onSuccess={() => mutate()} mode="add" />;
      case 'removeAdmin':
        return <AdminRoleView users={filteredUsers} token={token} onSuccess={() => mutate()} mode="remove" />;
      case 'addDoctor':
        return <DoctorRoleView users={filteredUsers} token={token} onSuccess={() => mutate()} mode="add" />;
      case 'removeDoctor':
        return <DoctorRoleView users={filteredUsers} token={token} onSuccess={() => mutate()} mode="remove" />;
      default:
        return null;
    }
  };

  if (error) return <div className="text-center !py-60 text-xl font-bold">Bạn không đủ quyền hạn để truy cập vào hệ thống quản lý người dùng. Vui lòng đăng nhập lại bằng tài khoản admin</div>;
  if (isLoading) return <div>Đang tải...</div>;
  if (!users) return <div>Không có dữ liệu</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <p className="text-2xl !font-bold text-cyan-500 mb-6">Quản Lý Người Dùng</p>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên đăng nhập, tên bệnh nhân, số điện thoại hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="w-full sm:w-48">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">Tất cả giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        <div className="w-full sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setViewMode('toggleStatus')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'toggleStatus'
              ? 'bg-red-500 text-white !rounded'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 !rounded'
          }`}
        >
          Khóa/Mở khóa tài khoản
        </button>
        <button
          onClick={() => setViewMode('addAdmin')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'addAdmin'
              ? 'bg-blue-500 text-white !rounded'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 !rounded'
          }`}
        >
          Thêm Admin
        </button>
        <button
          onClick={() => setViewMode('removeAdmin')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'removeAdmin'
              ? 'bg-yellow-500 text-white !rounded'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 !rounded'
          }`}
        >
          Gỡ Admin
        </button>
        <button
          onClick={() => setViewMode('addDoctor')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'addDoctor'
              ? 'bg-green-500 text-white !rounded'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 !rounded'
          }`}
        >
          Thêm Doctor
        </button>
        <button
          onClick={() => setViewMode('removeDoctor')}
          className={`px-4 py-2 rounded-lg ${
            viewMode === 'removeDoctor'
              ? 'bg-red-500 text-white !rounded'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 !rounded'
          }`}
        >
          Gỡ Doctor
        </button>
      </div>

      {renderView()}

      <style jsx global>{`
        .user-details-modal .modal-content {
          border: none;
          border-radius: 1rem;
          overflow: hidden;
        }
        .user-details-modal .modal-header {
          padding: 1.5rem;
        }
        .user-details-modal .modal-header .close {
          color: white;
          opacity: 0.8;
          text-shadow: none;
          font-size: 1.5rem;
          padding: 0.5rem;
          margin: -0.5rem -0.5rem -0.5rem auto;
        }
        .user-details-modal .modal-header .close:hover {
          opacity: 1;
        }
        .user-details-modal .modal-body {
          padding: 2rem;
        }
        .user-details-modal .modal-footer {
          padding: 1.5rem 2rem;
        }

        /* Custom table styles */
        table {
          font-size: 0.9rem;
        }
        th, td {
          padding: 0.5rem !important;
          vertical-align: middle !important;
        }
        th {
          font-size: 0.85rem;
          font-weight: 600;
        }
        td {
          font-size: 0.85rem;
        }
        .table > :not(caption) > * > * {
          padding: 0.5rem;
        }
      `}</style>
    </div>
  );
}
