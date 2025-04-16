"use client"
import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import Image from 'next/image'

const users = [
  { name: 'Olivia Martin', email: 'm@example.com', avatar: '/avatar1.png', permission: 'Can edit' },
  { name: 'Isabella Nguyen', email: 'b@example.com', avatar: '/avatar2.png', permission: 'Can view' },
  { name: 'Sofia Davis', email: 'p@example.com', avatar: '/avatar3.png', permission: 'Can view' }
]

const permissions = ['Can view', 'Can edit']

export default function ShareDocument() {
  const [userPermissions, setUserPermissions] = useState(users)
  const [invitationCode, setInvitationCode] = useState('')
  const [createMessage, setCreateMessage] = useState('')
  const [inputCode, setInputCode] = useState('')
  const [joinMessage, setJoinMessage] = useState('')
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setToken(parsedUser.token)
      }
    }
  }, [])

  useEffect(() => {
    const fetchInvitationCode = async () => {
      try {
        const res = await fetch('http://localhost:5062/api/Invition/create-invitation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (res.ok) {
          setInvitationCode(data.code)
          setCreateMessage(data.message || 'Mã mời đã được tạo thành công.')
        } else {
          setCreateMessage(data.message || 'Không thể tạo mã mời.')
        }
      } catch (err) {
        console.error('Lỗi khi tạo mã mời:', err);
        setCreateMessage('Lỗi máy chủ.');
      }
    }

    if (token) {
      fetchInvitationCode()
    }
  }, [token])

  const handlePermissionChange = (index: number, newPermission: string) => {
    const updated = [...userPermissions]
    updated[index].permission = newPermission
    setUserPermissions(updated)
  }

  const handleJoinWithCode = async () => {
    if (!inputCode) return;
  
    try {
      const res = await fetch('http://localhost:5062/api/Invition/use-invitation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code: inputCode })
      });
  
      const contentType = res.headers.get('content-type');
  
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (res.ok) {
          setJoinMessage(data.message || 'Đã tham gia chia sẻ thành công.');
        } else {
          setJoinMessage(data.message || 'Không thể tham gia bằng mã mời này.');
        }
      } else {
        const text = await res.text();
        setJoinMessage(text);
      }
    } catch (err) {
      console.error('Error:', err);
      setJoinMessage('Lỗi khi tham gia chia sẻ.');
    }
  };
  
  
  return (
    <Container className='max-w-lg mx-auto !px-20 py-5'>
      <div>
        <p className="text-2xl !font-bold text-cyan-500 mb-6">Chia sẻ thông tin với người thân</p>
        <p className="text-sm text-gray-500">
          Bất kỳ ai có liên kết đều có thể xem thông tin về bệnh án này
        </p>

        <div className="flex flex-col space-y-2">
          <label className="text-sm text-gray-700">Mã mời của bạn:</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={invitationCode}
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <button
              className="bg-black text-white px-4 py-2 rounded text-sm whitespace-nowrap transition-all duration-150 transform active:scale-95 hover:bg-gray-800"
              onClick={() => navigator.clipboard.writeText(invitationCode)}
            >
              Copy mã mời
            </button>
          </div>
          {createMessage && (
            <p className="text-green-600 text-sm">{createMessage}</p>
          )}
        </div>

        <div>
          <label className="text-sm text-gray-700 mb-1 block">Nhập mã mời của người khác:</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              placeholder="Nhập mã mời..."
              className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <button
              onClick={handleJoinWithCode}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Tham gia
            </button>
          </div>
          {joinMessage && (
            <p className="text-green-600 text-sm mt-1">{joinMessage}</p>
          )}
        </div>

        <div className="border-t pt-4 space-y-4">
          {userPermissions.map((user, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
                  alt="Avatar"
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                </div>
              </div>
              <select
                value={user.permission}
                onChange={(e) => handlePermissionChange(index, e.target.value)}
                className="border rounded px-2 py-1 text-sm"
              >
                {permissions.map((perm) => (
                  <option key={perm} value={perm}>
                    {perm}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
