"use client";
import { TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import useSWR from "swr";
import { Table, Modal} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';

interface User {
  userId: string;
  username: string;
  role: string;
  patientName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
}

export default function UserManagement() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");

  // Hàm bỏ dấu
  const removeAccents = (str: string) => {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const fetcher = (url: string) => 
    fetch(url, {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then((res) => res.json());

  const { data: users, error, isLoading } = useSWR<User[]>(
    "http://localhost:5062/api/User/users",
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  // Lọc và tìm kiếm dữ liệu
  const filteredUsers = users?.filter(user => {
    const searchTermNoAccent = removeAccents(searchTerm.toLowerCase());
    const matchesSearch = searchTerm === "" || 
      removeAccents(user.username.toLowerCase()).includes(searchTermNoAccent) ||
      removeAccents(user.patientName.toLowerCase()).includes(searchTermNoAccent) ||
      user.phone.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGender = genderFilter === "all" || 
      (genderFilter === "male" && Number(user.gender) === 0) ||
      (genderFilter === "female" && Number(user.gender) === 1);

    return matchesSearch && matchesGender;
  });

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        const response = await fetch(`http://localhost:5062/api/User/user/${userId}`, {
          method: "DELETE",
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });
        
        if (response.ok) {
          window.location.reload();
        } else {
          alert("Không thể xóa người dùng. Vui lòng thử lại sau.");
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Đã xảy ra lỗi khi xóa người dùng.");
      }
    }
  };

  const handleShowDetails = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5062/api/User/user/${userId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setSelectedUser(userData);
        setShowModal(true);
      } else {
        alert("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Đã xảy ra lỗi khi tải thông tin người dùng.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (error) return <div>Lỗi tải dữ liệu: {error.message}</div>;
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
                <th>STT</th>
                <th>Tên đăng nhập</th>
                <th>Vai trò</th>
                <th>Tên bệnh nhân</th>
                <th>Ngày sinh</th>
                <th>Giới tính</th>
                <th>Số điện thoại</th>
                <th>Email</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers?.map((user) => (
                <tr key={user.userId}>
                  <td>{user.userId}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>{user.patientName}</td>
                  <td>{new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                  <td>{Number(user.gender) === 0 ? "Nam" : "Nữ"}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleShowDetails(user.userId)}
                        className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.userId)}
                        className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* User Details Modal */}
          <Modal show={showModal} onHide={handleCloseModal} size="lg" centered className="user-details-modal">
            <Modal.Header closeButton className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 py-3">
              <Modal.Title className="text-lg font-bold flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Chi tiết người dùng
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-6 bg-gray-50">
              {selectedUser && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <h6 className="text-xs font-semibold text-cyan-600 mb-1">Tên đăng nhập</h6>
                      <p className="text-sm text-gray-800 font-medium">{selectedUser.username}</p>
                    </div>
                    <div>
                      <h6 className="text-xs font-semibold text-blue-600 mb-1">Vai trò</h6>
                      <p className="text-sm text-gray-800 font-medium">{selectedUser.role}</p>
                    </div>
                    <div>
                      <h6 className="text-xs font-semibold text-purple-600 mb-1">Tên bệnh nhân</h6>
                      <p className="text-sm text-gray-800 font-medium">{selectedUser.patientName}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h6 className="text-xs font-semibold text-green-600 mb-1">Ngày sinh</h6>
                      <p className="text-sm text-gray-800 font-medium">{new Date(selectedUser.dateOfBirth).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div>
                      <h6 className="text-xs font-semibold text-yellow-600 mb-1">Giới tính</h6>
                      <p className="text-sm text-gray-800 font-medium">{Number(selectedUser.gender) === 0 ? "Nam" : "Nữ"}</p>
                    </div>
                    <div>
                      <h6 className="text-xs font-semibold text-red-600 mb-1">Số điện thoại</h6>
                      <p className="text-sm text-gray-800 font-medium">{selectedUser.phone}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div>
                      <h6 className="text-xs font-semibold text-indigo-600 mb-1">Email</h6>
                      <p className="text-sm text-gray-800 font-medium">{selectedUser.email}</p>
                    </div>
                  </div>
                </div>
              )}
            </Modal.Body>
          </Modal>

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
