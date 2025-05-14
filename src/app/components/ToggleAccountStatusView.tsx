import UserList from './UserList';
import { User } from '../manager_user/types';
import API_ENDPOINTS from '../utils/apiConfig';

interface ToggleAccountStatusViewProps {
  users: User[];
  token: string | null;
  onSuccess: () => void;
}

export default function ToggleAccountStatusView({ users, token, onSuccess }: ToggleAccountStatusViewProps) {
  const handleToggleAccountStatus = async (userId: string) => {
    const user = users.find(u => u.userId === userId);
    if (!user) return;

    const isCurrentlyActive = !user.isLocked;
    const actionText = isCurrentlyActive ? "khóa" : "mở khóa";
    
    if (window.confirm(`Bạn có chắc chắn muốn ${actionText} tài khoản này?`)) {
      try {
        const response = await fetch(API_ENDPOINTS.toggleAccountStatus, {
          method: "POST",
          mode: 'cors',
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            userId: parseInt(userId),
            activate: !isCurrentlyActive
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.message?.includes("admin cuối cùng")) {
            throw new Error("Không thể khóa tài khoản admin cuối cùng. Hãy tạo admin khác trước.");
          }
          throw new Error(errorData.message || "Không thể thực hiện thao tác này");
        }

        const responseData = await response.json();
        console.log('API Response:', responseData);

        // Kiểm tra nếu người dùng hiện tại bị khóa
        const currentUser = sessionStorage.getItem("user");
        if (currentUser) {
          const parsedUser = JSON.parse(currentUser);
          if (parsedUser.userId === userId) {
            alert("Tài khoản của bạn đã bị khóa. Hệ thống sẽ đăng xuất...");
            sessionStorage.clear();
            window.location.href = "/";
            return;
          }
        }

        onSuccess();
        alert(`Đã ${actionText} tài khoản thành công.`);
      } catch (error) {
        console.error(`Lỗi khi ${actionText} tài khoản:`, error);
        alert(error.message);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <UserList
        users={users}
        onAction={handleToggleAccountStatus}
        actionButton={{
          variant: (user: User) => user.isLocked ? "success" : "danger",
          label: (user: User) => user.isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"
        }}
      />
    </div>
  );
} 