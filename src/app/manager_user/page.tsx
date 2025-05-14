"use client";
import useSWR, { mutate } from "swr";
import { useState, useEffect } from 'react';
import API_ENDPOINTS from "../utils/apiConfig";
import { User } from './types';
import { useRouter } from 'next/navigation';
import UserList from '../components/UserList';
import ToggleAccountStatusView from '../components/ToggleAccountStatusView';
import RoleManagementView from '../components/RoleManagementView';

type ViewMode = 'user' | 'role' | 'healthProfile';

export default function UserManagement() {
  const [searchTerm] = useState("");
  const [genderFilter] = useState<string>("all");
  const [roleFilter] = useState<string>("all");
  const [token, setToken] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('user');
  const [roleType, setRoleType] = useState<'admin' | 'doctor'>('admin');
  const router = useRouter();

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

  const { data: users, error, isLoading } = useSWR<User[]>(
    token ? API_ENDPOINTS.getUsers : null,
    token ? fetcher : null,
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      refreshInterval: 0,
      dedupingInterval: 2000,
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

  const handleViewHealthProfile = (userId: string | number) => {
    router.push(`/doctor_manager_user_information/${userId}`);
  };

  if (error) return <div className="text-center !py-60 text-xl font-bold">Bạn không đủ quyền hạn để truy cập vào hệ thống quản lý người dùng. Vui lòng đăng nhập lại bằng tài khoản admin</div>;
  if (isLoading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
  </div>;
  if (!users) return <div>Không có dữ liệu</div>;

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        <div className="w-1/5">
          <div className="flex flex-col gap-4">
            <button
              className={`px-3 py-2 rounded-lg font-bold ${viewMode === 'user' ? 'text-cyan-500 border-2 border-cyan-500' : 'text-gray-700 hover:text-cyan-500'}`}
              onClick={() => setViewMode('user')}
            >
              Quản lý người dùng
            </button>
            <div className="flex flex-col gap-2">
              <button
                className={`px-3 py-2 rounded-lg font-bold ${viewMode === 'role' ? 'text-cyan-500 border-2 border-cyan-500' : 'text-gray-700 hover:text-cyan-500'}`}
                onClick={() => {
                  setViewMode('role');
                  setRoleType('admin'); // Set default role type when clicking role management
                }}
              >
                Quản lý quyền truy cập
              </button>
              {viewMode === 'role' && (
                <div className="flex flex-col gap-2 pl-4 mt-2">
                  <button
                    className={`px-3 py-2 rounded-lg font-bold ${roleType === 'admin' ? 'text-red-500 border-2 border-red-500' : 'text-gray-700 hover:text-red-500'}`}
                    onClick={() => setRoleType('admin')}
                  >
                    Quản lý role Admin
                  </button>
                  <button
                    className={`px-3 py-2 rounded-lg font-bold ${roleType === 'doctor' ? 'text-red-500 border-2 border-red-500' : 'text-gray-700 hover:text-red-500'}`}
                    onClick={() => setRoleType('doctor')}
                  >
                    Quản lý role Doctor
                  </button>
                </div>
              )}
            </div>
            <button
              className={`px-3 py-2 rounded-lg font-bold ${viewMode === 'healthProfile' ? 'text-cyan-500 border-2 border-cyan-500' : 'text-gray-700 hover:text-cyan-500'}`}
              onClick={() => setViewMode('healthProfile')}
            >
              Quản lý hồ sơ sức khỏe
            </button>
          </div>
        </div>

        <div className="w-4/5">
          {viewMode === 'user' && (
            <ToggleAccountStatusView
              users={filteredUsers}
              token={token}
              onSuccess={() => {
                mutate(API_ENDPOINTS.getUsers);
              }}
            />
          )}
          {viewMode === 'role' && (
            <div className="flex flex-col gap-4">
              <RoleManagementView
                users={filteredUsers}
                token={token}
                onSuccess={() => {
                  mutate(API_ENDPOINTS.getUsers);
                }}
                roleType={roleType}
              />
            </div>
          )}
          {viewMode === 'healthProfile' && (
            <UserList
              users={filteredUsers}
              onAction={handleViewHealthProfile}
              actionButton={{
                variant: "info",
                label: "Xem hồ sơ sức khỏe"
              }}
            />
          )}
        </div>
      </div>

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
