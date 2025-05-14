import UserList from './UserList';
import { User } from '../manager_user/types';
import API_ENDPOINTS from '../utils/apiConfig';

interface RoleManagementViewProps {
  users: User[];
  token: string | null;
  onSuccess: () => void;
  roleType: 'admin' | 'doctor';
}

export default function RoleManagementView({ users, token, onSuccess, roleType }: RoleManagementViewProps) {
  const handleRoleAction = async (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (!user) return;

    const hasRole = user.roles.includes(roleType);
    const actionText = hasRole ? "gỡ" : "thêm";
    
    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} quyền ${roleType === 'admin' ? 'Admin' : 'Doctor'} cho người dùng này?`)) {
      try {
        let endpoint = '';
        let method = 'POST';
        let body = { userId: parseInt(userId) };

        if (roleType === 'admin') {
          endpoint = hasRole 
            ? API_ENDPOINTS.removeAdmin(userId)
            : API_ENDPOINTS.addAdminRole;
        } else {
          endpoint = hasRole
            ? API_ENDPOINTS.removeDoctorRole(userId)
            : API_ENDPOINTS.addDoctorRole(userId);
          method = hasRole ? 'DELETE' : 'POST';
          body = hasRole ? undefined : { userId: parseInt(userId) };
        }

        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          ...(body && { body: JSON.stringify(body) })
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(errorData);
        }

        await response.text();
        alert(`Đã ${actionText} quyền ${roleType === 'admin' ? 'Admin' : 'Doctor'} ${hasRole ? 'khỏi' : 'cho'} người dùng.`);
        onSuccess();  
      } catch (error) {
        console.error(`Lỗi khi ${actionText} quyền ${roleType === 'admin' ? 'Admin' : 'Doctor'}:`, error);
        alert(`Đã xảy ra lỗi: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  return (
    <UserList
      users={users}
      onAction={handleRoleAction}
      actionButton={{
        variant: (user: User) => user.roles.includes(roleType) ? "danger" : "success",
        label: (user: User) => user.roles.includes(roleType) 
          ? `Gỡ ${roleType === 'admin' ? 'Admin' : 'Doctor'}`
          : `Thêm ${roleType === 'admin' ? 'Admin' : 'Doctor'}`
      }}
    />
  );
} 