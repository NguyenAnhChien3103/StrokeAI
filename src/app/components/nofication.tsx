"use client";

import { useEffect, useState } from "react";
import styles from "../components/nofication.module.css";
import { NotificationService } from "@/lib/NotificationService";

declare global {
  interface Window {
    currentUserId?: string;
  }
}

export default function Nofication() {
  const [connectionState, setConnectionState] = useState<string | null>(null);

  useEffect(() => {
    const userId = window.currentUserId || localStorage.getItem('userId');
    if (userId) {
      const notificationService = new NotificationService(userId);
      setConnectionState(notificationService.connection.state);

      notificationService.connection.onclose(() => {
        setConnectionState("closed");
      });
    } else {
      console.warn("Không tìm thấy ID người dùng, không thể khởi tạo thông báo");
    }
  }, []);

  return (
    <div id="notifications-container" className={`${styles.container} px-2 mx-4 my-2`}>
      <div style={{ fontWeight: 'bold', fontSize: '1.2em', marginBottom: '10px' }}>
        ❗ CẢNH BÁO ❗
      </div>

      <div style={{ marginBottom: '10px' }}>
        ⏰ Thời gian phát hiện: 28/04/2025 14:00
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div><strong>📊 CHI TIẾT:</strong></div>
        <div style={{ marginLeft: '20px' }}>• Nhiệt độ: 38.5°C (bình thường: 37 ±0.5°C, <b>Nguy hiểm</b>)</div>
        <div style={{ marginLeft: '20px' }}>• Huyết áp tâm thu: 170 mmHg (bình thường: ≤140, <b>Nguy hiểm</b>)</div>
        <div style={{ marginLeft: '20px' }}>• Nhịp tim: 95 bpm (bình thường: 60–90, <b>Cảnh báo</b>)</div>
        <div style={{ marginLeft: '20px' }}>• SPO2: 93% (bình thường: ≥95%, <b>Cảnh báo</b>)</div>
        <div style={{ marginLeft: '20px' }}>• Độ pH máu: 7.32 (bình thường: 7.4 ±0.05, <b>Cảnh báo</b>)</div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <div><strong>📍 VỊ TRÍ:</strong></div>
        <a
          href="https://www.openstreetmap.org/?mlat=10.823099&mlon=106.62966&zoom=15"
          target="_blank"
          rel="noopener noreferrer"
        >
          Xem bản đồ
        </a>
      </div>

      <div style={{ marginTop: '10px', fontStyle: 'italic' }}>
        ⚠️ Vui lòng kiểm tra sức khỏe hoặc liên hệ với bác sĩ nếu tình trạng kéo dài.
      </div>

      <div> {connectionState}
      </div>
    </div>
  );
}
