import UserList from './UserList';
import { User } from '../manager_user/types';
import API_ENDPOINTS from '../utils/apiConfig';

interface AdminRoleViewProps {
  users: User[];
  token: string | null;
  onSuccess: () => void;
  mode: 'add' | 'remove';
}

export default function AdminRoleView({ users, token, onSuccess, mode }: AdminRoleViewProps) {
  const handleAdminAction = async (userId: string) => {
    try {
      const endpoint = mode === 'add' 
        ? API_ENDPOINTS.addAdminRole
        : API_ENDPOINTS.removeAdmin(userId);
      
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: mode === 'add' ? JSON.stringify({ userId: parseInt(userId) }) : undefined
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      await response.text(); 
      alert(mode === 'add' 
        ? "Đã thêm quyền Admin cho người dùng."
        : "Đã gỡ quyền Admin khỏi người dùng.");
      onSuccess();
    } catch (error) {
      console.error(`Lỗi khi ${mode === 'add' ? 'thêm' : 'gỡ'} quyền Admin:`, error);
      alert(`Đã xảy ra lỗi: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <UserList
      users={users}
      onAction={handleAdminAction}
      actionButton={{
        variant: mode === 'add' ? "info" : "warning",
        label: mode === 'add' ? "Thêm Admin" : "Gỡ Admin"
      }}
    />
  );
} 