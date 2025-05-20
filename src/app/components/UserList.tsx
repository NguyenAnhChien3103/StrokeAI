import { Table, Button } from 'react-bootstrap';
import { User } from '../manager_user/types';
import { useState } from 'react';

interface UserListProps {
  users: User[];
  onAction: (userId: string) => void;
  actionButton: {
    variant: string | ((user: User) => string);
    label: string | ((user: User) => string);
  };
}

export default function UserList({ users, onAction, actionButton }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  const removeAccents = (str: string) => {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const filteredUsers = users.filter(user => {
    const searchTermNoAccent = removeAccents(searchTerm.toLowerCase());
    const matchesSearch = searchTerm === "" ||
      removeAccents(user.username.toLowerCase()).includes(searchTermNoAccent) ||
      removeAccents(user.patientName.toLowerCase()).includes(searchTermNoAccent) ||
      user.phone.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesGender = genderFilter === "all" ||
      (genderFilter === "male" && Number(user.gender) === 1) ||
      (genderFilter === "female" && Number(user.gender) === 0);

    const matchesRole = roleFilter === "all" || user.roles.includes(roleFilter);

    return matchesSearch && matchesGender && matchesRole;
  });

  const getButtonVariant = (user: User) => {
    if (typeof actionButton.variant === 'function') {
      return actionButton.variant(user);
    }
    if (typeof actionButton.label === 'function') {
      const label = actionButton.label(user);
      if (label.includes("Khóa")) return "danger";
      if (label.includes("Mở khóa")) return "success";
    }
    return actionButton.variant;
  };

  return (
    <div>
      <div className="mb-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, username, số điện thoại..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Tất cả</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
          </div>

          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Tất cả</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table striped bordered hover responsive className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên đăng nhập</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên bệnh nhân</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày sinh</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giới tính</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số điện thoại</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.map((user) => (
              <tr key={user.userId} className="hover:bg-gray-50">
                <td className="px-2 py-0.5 whitespace-nowrap text-xs text-gray-900">{user.username}</td>
                <td className="px-2 py-0.5 whitespace-nowrap text-xs text-gray-900">
                  {user.roles.map(role => (
                    <span key={role} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1">
                      {role}
                    </span>
                  ))}
                </td>
                <td className="px-2 py-0.5 whitespace-nowrap text-xs text-gray-900">{user.patientName}</td>
                <td className="px-2 py-0.5 whitespace-nowrap text-xs text-gray-900">
                  {new Date(user.dateOfBirth).toLocaleDateString('vi-VN')}
                </td>
                <td className="px-2 py-0.5 whitespace-nowrap text-xs text-gray-900">
                  {Number(user.gender) === 1 ? "Nam" : "Nữ"}
                </td>
                <td className="px-2 py-0.5 whitespace-nowrap text-xs text-gray-900">{user.phone}</td>
                <td className="px-2 py-0.5 whitespace-nowrap text-xs text-gray-900">{user.email}</td>
                <td className="px-2 py-0.5 whitespace-nowrap text-xs">
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium ${
                    user.isLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {user.accountStatus}
                  </span>
                </td>
                <td className="px-2 py-0.5 text-center">
                  <Button
                    variant={getButtonVariant(user)}
                    onClick={() => onAction(user.userId)}
                    className="px-1 py-0.5 text-[8px] whitespace-nowrap"
                    size="sm"
                  >
                    {typeof actionButton.label === 'function' ? actionButton.label(user) : actionButton.label}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
} 