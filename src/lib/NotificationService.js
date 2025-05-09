class NotificationService {
    constructor(userId) {
        this.userId = userId;
        this.connection = null;
        this.soundEnabled = true;
        this.initialize();
    }

    initialize() {
        if (typeof window !== 'undefined') {
            this.connection = new signalR.HubConnectionBuilder()
                .withUrl("/notificationHub")
                .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
                .configureLogging(signalR.LogLevel.Information)
                .build();

            this.connection.on("ReceiveNotification", (title, message, notificationType) => {
                this.displayNotification(title, message, notificationType);
            });

            this.connection.start()
                .then(() => {
                    console.log("Kết nối SignalR thành công");
                    this.connection.invoke("RegisterForNotifications", this.userId);
                })
                .catch(err => {
                    console.error("Lỗi khi kết nối SignalR:", err);
                    setTimeout(() => this.initialize(), 5000);
                });

            this.connection.onclose(() => {
                console.log("Kết nối SignalR bị đóng");
            });
        }
    }

    displayNotification(title, message, type = 'info') {
        if (typeof document !== 'undefined') {
            const notificationElement = document.createElement("div");
            notificationElement.className = `notification ${type}`;

            const timeString = new Date().toLocaleTimeString('vi-VN', { 
                hour: '2-digit', 
                minute: '2-digit',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });

            notificationElement.innerHTML = `
                <h3>${title}</h3>
                <div class="notification-content">${message}</div>
                <span class="notification-time">${timeString}</span>
                <button class="notification-close">&times;</button>
            `;

            const container = document.getElementById("notifications-container");
            if (container) {
                container.appendChild(notificationElement);
            }

            const closeButton = notificationElement.querySelector('.notification-close');
            closeButton.addEventListener('click', () => {
                notificationElement.remove();
            });

            if (type !== 'warning') {
                setTimeout(() => {
                    if (notificationElement.parentNode) {
                        notificationElement.classList.add('fade-out');
                        setTimeout(() => notificationElement.remove(), 500);
                    }
                }, 60000);
            }
        }
    }

    handleMapLink(notificationElement) {
        if (typeof document !== 'undefined') {
            const mapLinks = notificationElement.querySelectorAll('a[href*="openstreetmap.org"]');
            mapLinks.forEach(link => {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
                link.textContent = 'Xem vị trí trên bản đồ';

                const icon = document.createElement('i');
                icon.className = 'map-icon';
                link.prepend(icon);
            });
        }
    }
}

if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const userId = window.currentUserId || localStorage.getItem('userId');
        if (userId) {
            window.notificationService = new NotificationService(userId);
        } else {
            console.warn("Không tìm thấy ID người dùng, không thể khởi tạo thông báo");
        }
    });
}

export { NotificationService };
