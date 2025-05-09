"use client";

import { useEffect, useState } from 'react';
import { Container, Button } from 'react-bootstrap';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import API_ENDPOINTS from '../utils/apiConfig';
import { QRCodeCanvas } from 'qrcode.react'; 

interface Relationship {
  relationshipId: number;
  inviterId: number;
  relationshipType: string;
  nameInviter?: string;
  emailInviter?: string;
  userId: number;
}

export default function ShareDocument() {
  const [invitationCode, setInvitationCode] = useState<string>('');
  const [createMessage, setCreateMessage] = useState<string>('');
  const [inputCode, setInputCode] = useState<string>('');
  const [joinMessage, setJoinMessage] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [userRole, setUserRole] = useState<string>('');

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(parsedUser.token);
        setUserRole(parsedUser.roles?.[0] || '');
      }
    }
  }, []);

  useEffect(() => {
    if (!token) return;

    const storedUser = sessionStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const userId = parsedUser?.userId;

    const fetchInvitationCode = async () => {
      if (!userId) return;
      try {
        const res = await fetch(API_ENDPOINTS.createInvitation(userId), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setInvitationCode(data.code);
          setCreateMessage(data.message || 'Mã mời đã được tạo thành công.');
        } else {
          setCreateMessage(data.message || 'Không thể tạo mã mời.');
        }
      } catch {
        setCreateMessage('Lỗi máy chủ.');
      }
    };

    const fetchRelationships = async () => {
      if (!userId) return;
      try {
        const res = await fetch(API_ENDPOINTS.getRelationship(userId), {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setRelationships(data);
        } else {
          setRelationships([]);
        }
      } catch {
        setRelationships([]);
      }
    };

    fetchInvitationCode();
    fetchRelationships();
  }, [token]);

  const handleJoinWithCode = async () => {
    if (!inputCode) return;
    try {
      const storedUser = sessionStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const userId = parsedUser?.userId;

      const res = await fetch(API_ENDPOINTS.useInvitation, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${parsedUser?.token}`,
        },
        body: JSON.stringify({ code: inputCode, userId }),
      });
      const contentType = res.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data = await res.json();
        setJoinMessage(data.message || (res.ok ? 'Đã tham gia chia sẻ thành công.' : 'Không thể tham gia bằng mã mời này.'));
      } else {
        const text = await res.text();
        setJoinMessage(text);
      }
    } catch {
      setJoinMessage('Lỗi khi tham gia chia sẻ.');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const storedUser = sessionStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const res = await fetch(API_ENDPOINTS.deleteRelationship(id), {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${parsedUser?.token}` },
      });
      const data = await res.text();
      if (res.ok) {
        setRelationships(prev => prev.filter(r => r.relationshipId !== id));
      } else {
        alert(data || 'Không thể xóa người thân.');
      }
    } catch {
      alert('Lỗi máy chủ.');
    }
  };

  const handleViewDetails = (rel: Relationship) => {
    const storedUser = sessionStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const currentUserId = parsedUser?.userId;

    const targetId = currentUserId === rel.inviterId ? rel.userId : rel.inviterId;
    
    if (targetId) {
      router.push(`/family_location?id=${targetId}`);
    } else {
      alert('Không tìm thấy ID của người dùng');
    }
  };

  const handleFamilyDashBoard = (rel: Relationship) => {
    const storedUser = sessionStorage.getItem('user');
    const parsedUser = storedUser ? JSON.parse(storedUser) : null;
    const currentUserId = parsedUser?.userId;

    const targetId = currentUserId === rel.inviterId ? rel.userId : rel.inviterId;
    
    if (targetId) {
      router.push(`/family_dashboard/${targetId}`);
    } else {
      alert('Không tìm thấy ID của người dùng');
    }
  };

  const mapRelationshipType = (type: string) => {
    switch (type) {
      case 'doctor-patient':
        return 'Bác sĩ - Bệnh nhân';
      case 'family':
        return 'Người thân';
      default:
        return 'Không xác định';
    }
  };
  const filteredRelationships = relationships.filter(rel =>
    filterType === 'all' ? true : rel.relationshipType === filterType
  );

  return (
    <Container className="max-w-lg mx-auto !px-20 py-5">
      <p className="text-2xl !font-bold text-cyan-500 mb-6">Chia sẻ thông tin với người thân</p>
      <p className="text-sm text-gray-500 mb-4">Bất kỳ ai có liên kết đều có thể xem thông tin về bệnh án này</p>

      <div className="mb-6">
  <label className="text-sm text-gray-700">Mã mời của bạn:</label>
  <div className="flex gap-2 mt-1">
    <input
      type="text"
      readOnly
      value={invitationCode}
      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
    />
    <button
      className="bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800"
      onClick={() => invitationCode && navigator.clipboard.writeText(invitationCode)}
    >
      Copy
    </button>
  </div>
  {createMessage && <p className="text-green-600 text-sm mt-1">{createMessage}</p>}

  {invitationCode && (
        <div className="mt-4">
        <QRCodeCanvas value={invitationCode} size={128} />
    </div>
  )}
</div>

<div className="mb-6">
  <label className="text-sm text-gray-700 block mb-1">Nhập mã mời của người khác:</label>
  <div className="flex gap-2">
    <input
      type="text"
      value={inputCode}
      onChange={e => setInputCode(e.target.value)}
      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
      placeholder="Nhập mã mời..."
    />
    <button
      onClick={handleJoinWithCode}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
    >
      Tham gia
    </button>
  </div>

  {joinMessage && <p className="text-green-600 text-sm mt-1">{joinMessage}</p>}
</div>


      <div className="border-t pt-4 space-y-4">
        <p className="text-lg font-semibold text-gray-700">Danh sách người thân đã chia sẻ:</p>

        <div className="mb-4">
          <label className="text-sm font-medium mr-2">Lọc:</label>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value="all">Tất cả</option>
            <option value="doctor-patient">Bác sĩ - Bệnh nhân</option>
            <option value="family">Người thân</option>
          </select>
        </div>

        {filteredRelationships.length === 0 ? (
  <p className="text-sm text-gray-500">Không có mục nào phù hợp.</p>
) : (
  <table className="min-w-full border border-gray-300 mt-4">
  <thead className="bg-gray-100">
    <tr>
      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">Tên người dùng</th>
      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">Email</th>
      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">Mối quan hệ</th>
      <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-gray-300">Hành động</th>
    </tr>
  </thead>
  <tbody className="bg-white">
    {filteredRelationships.map(rel => (
      <tr key={rel.relationshipId} className="hover:bg-gray-50">
        <td className="px-4 py-2 flex items-center gap-3 border border-gray-300">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
            alt="Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="font-medium">{rel.nameInviter || 'Chưa có tên'}</span>
        </td>
        <td className="px-4 py-2 text-sm text-gray-500 border border-gray-300">
          {rel.emailInviter || 'Chưa có email'}
        </td>
        <td className="px-4 py-2 text-sm text-gray-500 italic border border-gray-300">
          {mapRelationshipType(rel.relationshipType)}
        </td>
        <td className="px-4 py-2 border border-gray-300">
          <div className="flex flex-wrap gap-2">
            {!(userRole === 'user' && rel.relationshipType === 'doctor-patient') && (
              <>
                <Button
                  variant="info"
                  className="text-white px-3 py-1 rounded"
                  onClick={() => handleViewDetails(rel)}
                >
                  Xem vị trí
                </Button>
                <Button
                  variant="info"
                  className="text-white px-3 py-1 rounded"
                  onClick={() => handleFamilyDashBoard(rel)}
                >
                  Xem hồ sơ sức khỏe
                </Button>
              </>
            )}
            <Button
              variant="danger"
              className="px-3 py-1 rounded"
              onClick={() => handleDelete(rel.relationshipId)}
            >
              Xóa
            </Button>
          </div>
        </td>
      </tr>
    ))}
  </tbody>
</table>
)}

      </div>
    </Container>
  );
}
