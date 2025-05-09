import UserList from './UserList';
import { User } from '../manager_user/types';
import API_ENDPOINTS from '../utils/apiConfig';

interface UserActionViewProps {
  users: User[];
  token: string | null;
  onSuccess: () => void;
  actionType: 'delete' | 'addAdmin' | 'removeAdmin' | 'addDoctor' | 'removeDoctor';
}

export default function UserActionView({ users, token, onSuccess, actionType }: UserActionViewProps) {
  const handleUserAction = async (userId: string) => {
    try {
      let endpoint = '';
      let method = 'POST';
      let body = { userId };
      let successMessage = '';
      let errorMessage = '';

      switch (actionType) {
        case 'delete':
          if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
            return;
          }
          endpoint = API_ENDPOINTS.deleteUser(userId);
          method = 'DELETE';
          body = undefined;
          successMessage = "Người dùng đã được xóa thành công.";
          errorMessage = "Không thể xóa người dùng. Vui lòng thử lại sau.";

          // Kiểm tra nếu đang xóa chính tài khoản của mình
          const currentUser = sessionStorage.getItem("user");
          if (currentUser) {
            const parsedUser = JSON.parse(currentUser);
            if (parsedUser.userId === userId) {
              alert("Tài khoản của bạn đã bị xóa. Hệ thống sẽ đăng xuất...");
              sessionStorage.clear();
              window.location.href = "/";
              return;
            }
          }
          break;

        case 'addAdmin':
          endpoint = API_ENDPOINTS.addAdminRole(userId);
          successMessage = "Đã thêm quyền Admin cho người dùng.";
          errorMessage = "Không thể thêm quyền Admin";
          break;

        case 'removeAdmin':
          endpoint = API_ENDPOINTS.removeAdmin(userId);
          successMessage = "Đã gỡ quyền Admin khỏi người dùng.";
          errorMessage = "Không thể gỡ quyền Admin";
          break;

        case 'addDoctor':
          endpoint = API_ENDPOINTS.addDoctorRole(userId);
          successMessage = "Đã thêm quyền Doctor cho người dùng.";
          errorMessage = "Không thể thêm quyền Doctor";
          break;

        case 'removeDoctor':
          endpoint = API_ENDPOINTS.removeDoctorRole(userId);
          method = 'DELETE';
          body = undefined;
          successMessage = "Đã gỡ quyền Doctor khỏi người dùng.";
          errorMessage = "Không thể gỡ quyền Doctor";
          break;
      }

      const response = await fetch(endpoint, {
        method,
        mode: 'cors',
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`
        },
        ...(body && { body: JSON.stringify(body) })
      });

      if (response.ok) {
        alert(successMessage);
        onSuccess();
      } else {
        const errorText = await response.text();
        alert(`${errorMessage}: ${errorText}`);
      }
    } catch (error) {
      console.error(`Lỗi khi thực hiện thao tác ${actionType}:`, error);
      alert(`Đã xảy ra lỗi khi thực hiện thao tác.`);
    }
  };

  const getButtonConfig = () => {
    switch (actionType) {
      case 'delete':
        return { variant: "danger", label: "Xóa tài khoản" };
      case 'addAdmin':
        return { variant: "info", label: "Thêm Admin" };
      case 'removeAdmin':
        return { variant: "warning", label: "Gỡ Admin" };
      case 'addDoctor':
        return { variant: "success", label: "Thêm Doctor" };
      case 'removeDoctor':
        return { variant: "danger", label: "Gỡ Doctor" };
      default:
        return { variant: "primary", label: "Thao tác" };
    }
  };

  return (
    <UserList
      users={users}
      onAction={handleUserAction}
      actionButton={getButtonConfig()}
    />
  );
} 