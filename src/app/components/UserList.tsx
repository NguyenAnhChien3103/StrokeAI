import { Table, Button } from 'react-bootstrap';
import { User } from '../manager_user/types';

interface UserListProps {
  users: User[];
  onAction: (userId: string) => void;
  actionButton: {
    variant: string | ((user: User) => string);
    label: string | ((user: User) => string);
  };
}

export default function UserList({ users, onAction, actionButton }: UserListProps) {
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
          {users?.map((user) => (
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
                {Number(user.gender) === 0 ? "Nam" : "Nữ"}
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
  );
} 