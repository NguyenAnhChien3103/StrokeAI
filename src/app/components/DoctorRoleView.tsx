import UserList from './UserList';
import { User } from '../manager_user/types';
import API_ENDPOINTS from '../utils/apiConfig';

interface DoctorRoleViewProps {
  users: User[];
  token: string | null;
  onSuccess: () => void;
  mode: 'add' | 'remove';
}

export default function DoctorRoleView({ users, token, onSuccess, mode }: DoctorRoleViewProps) {
  const handleDoctorAction = async (userId: string) => {
    try {
      const endpoint = mode === 'add'
        ? API_ENDPOINTS.addDoctorRole(userId)
        : API_ENDPOINTS.removeDoctorRole(userId);

      const response = await fetch(endpoint, {
        method: mode === 'add' ? "POST" : "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: mode === 'add' ? JSON.stringify({ userId }) : undefined
      });

      if (response.ok) {
        alert(mode === 'add'
          ? "Đã thêm quyền Doctor cho người dùng."
          : "Đã gỡ quyền Doctor khỏi người dùng.");
        onSuccess();
      } else {
        const errorText = await response.text();
        alert(`Không thể ${mode === 'add' ? 'thêm' : 'gỡ'} quyền Doctor: ${errorText}`);
      }
    } catch (error) {
      console.error(`Lỗi khi ${mode === 'add' ? 'thêm' : 'gỡ'} quyền Doctor:`, error);
      alert(`Đã xảy ra lỗi khi ${mode === 'add' ? 'thêm' : 'gỡ'} quyền Doctor.`);
    }
  };

  return (
    <UserList
      users={users}
      onAction={handleDoctorAction}
      actionButton={{
        variant: mode === 'add' ? "success" : "danger",
        label: mode === 'add' ? "Thêm Doctor" : "Gỡ Doctor"
      }}
    />
  );
} 