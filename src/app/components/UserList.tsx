import { Table, Button } from 'react-bootstrap';
import { User } from '../manager_user/types';

interface UserListProps {
  users: User[];
  onAction: (userId: string) => void;
  actionButton: {
    variant: string;
    label: string | ((user: User) => string);
  };
}

export default function UserList({ users, onAction, actionButton }: UserListProps) {
  const getButtonVariant = (user: User) => {
    if (typeof actionButton.label === 'function') {
      const label = actionButton.label(user);
      if (label.includes("Khóa")) return "danger";
      if (label.includes("Mở khóa")) return "success";
    }
    return actionButton.variant;
  };

  return (
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
          <th>Trạng thái</th>
          <th className="text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        {users?.map((user) => (
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
              <span className={`badge ${user.isLocked ? 'bg-danger' : 'bg-success'}`}>
                {user.accountStatus}
              </span>
            </td>
            <td>
              <div className="flex justify-center">
                <Button
                  variant={getButtonVariant(user)}
                  onClick={() => onAction(user.userId)}
                >
                  {typeof actionButton.label === 'function' ? actionButton.label(user) : actionButton.label}
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
} 