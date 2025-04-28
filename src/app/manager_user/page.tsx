"use client";
import useSWR from "swr";
import { Table} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useEffect } from 'react';
import Button from "react-bootstrap/Button";
import API_ENDPOINTS from "../utils/apiConfig";


interface User {
  userId: string;
  username: string;
  roles: string[];
  patientName: string;  
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  token: string;
}

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [token, setToken] = useState<string | null>(null); 

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

    const fetcher = (url: string) => {
      if (!token) return Promise.reject(new Error("Token chưa sẵn sàng"));
      return fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }).then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi xác thực hoặc lỗi server");
        }
        return res.json();
      });
    };
    

    const { data: users, error, isLoading } = useSWR<User[]>(
      token ? API_ENDPOINTS.getUsers : null,
      token ? fetcher : null,
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
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

  const handleAddAdmin = async (userId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.addAdminRole(userId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ userId }) 
      });
  
      if (response.ok) {
        alert("Đã thêm quyền Admin cho người dùng.");
        window.location.reload();
      } else {
        const errorText = await response.text();
        alert("Không thể thêm quyền Admin: " + errorText);
      }
    } catch (error) {
      console.error("Lỗi khi thêm quyền Admin:", error);
      alert("Đã xảy ra lỗi khi thêm quyền Admin.");
    }
  };
   

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.removeAdmin(userId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
  
      if (response.ok) {
        alert("Đã gỡ quyền Admin khỏi người dùng.");
        window.location.reload();
      } else {
        const errorText = await response.text();
        alert("Không thể gỡ quyền Admin. " + errorText);
      }
    } catch (error) {
      console.error("Lỗi khi gỡ quyền Admin:", error);
      alert("Đã xảy ra lỗi khi gỡ quyền Admin.");
    }
  };
  

  
  

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        const response = await fetch(API_ENDPOINTS.deleteUser(userId), {
          method: "DELETE",
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.ok) {
          const currentUser = sessionStorage.getItem("user");
          if (currentUser) {
            const parsedUser = JSON.parse(currentUser);
            if (parsedUser.userId === userId) {
              // Nếu xóa chính mình
              alert("Tài khoản của bạn đã bị xóa. Hệ thống sẽ đăng xuất...");
              sessionStorage.clear();
              window.location.href = "/"; 
              return;
            }
          }
  
          alert("Người dùng đã được xóa thành công.");
          window.location.reload();
        } else {
          alert("Không thể xóa người dùng. Vui lòng thử lại sau.");
        }
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        alert("Đã xảy ra lỗi khi xóa người dùng.");
      }
    }
  };
  

  

  if (error) return <div className="text-center !py-60 text-xl font-bold">Bạn không đủ quyền hạn để truy cập vào hệ thống quản lý người dùng . Vui lòng đăng nhập lại bằng tài khoản admin</div>;
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

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên đăng nhập</th>
                <th>Vai trò</th>
                <th>Tên bệnh nhân</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.username}</td>
                  <td>{user.roles.join(", ")}</td>  
                  <td>{user.patientName}</td>
                  <td>{new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                  <td>{Number(user.gender) === 0 ? "Nam" : "Nữ"}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>

                  <td>
  <div className="flex flex-wrap gap-2">
    <Button
      variant="danger"
      onClick={() => handleDeleteUser(user.userId)}
    >
      Xóa tài khoản
    </Button>

      <Button
        onClick={() => handleRemoveAdmin(user.userId)}
        variant="warning"
      >
        Gỡ Admin
      </Button>
      <Button
        onClick={() => handleAddAdmin(user.userId)}
        variant="info" 
      >
        Thêm Admin
      </Button>
  </div>
</td>

                </tr>
              ))}
            </tbody>
          </Table>

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
        </>
      )}
    </div>
  );
}
