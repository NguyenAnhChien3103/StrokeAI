'use client'

import { useEffect, useState } from 'react'
import { Container } from 'react-bootstrap'
import Image from 'next/image'
import { Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import API_ENDPOINTS from '../utils/apiConfig';


export default function ShareDocument() {
  const [invitationCode, setInvitationCode] = useState('')
  const [createMessage, setCreateMessage] = useState('')
  const [inputCode, setInputCode] = useState('')
  const [joinMessage, setJoinMessage] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [relationships, setRelationships] = useState([])
  const router = useRouter()

  const handleViewDetails = (id: string) => {
    router.push(`/map?id=${id}`);
  }
  
  
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
    if (!token) return

    const fetchInvitationCode = async () => {
      try {
        const storedUser = sessionStorage.getItem('user')
        const parsedUser = storedUser ? JSON.parse(storedUser) : null
        const userId = parsedUser?.userId

        if (!userId) return

        const res = await fetch(API_ENDPOINTS.createInvitation(userId), {
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
        console.error('Lỗi khi tạo mã mời:', err)
        setCreateMessage('Lỗi máy chủ.')
      }
    }

    const fetchRelationships = async () => {
      try {
        const storedUser = sessionStorage.getItem('user')
        const parsedUser = storedUser ? JSON.parse(storedUser) : null
        const userId = parsedUser?.userId

        const res = await fetch(API_ENDPOINTS.getRelationship(userId), {
          headers: {
            Authorization: `Bearer ${parsedUser?.token}`
          }
        })

        const data = await res.json()
        if (res.ok) {
          setRelationships(data)
        } else {
          console.error(data.message || 'Không thể lấy danh sách người thân.')
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người thân:', error)
      }
    }

    fetchInvitationCode()
    fetchRelationships()
  }, [token])

  const handleJoinWithCode = async () => {
    if (!inputCode) return

    try {
      const storedUser = sessionStorage.getItem('user')
      const parsedUser = storedUser ? JSON.parse(storedUser) : null
      const userId = parsedUser?.userId

      const res = await fetch(API_ENDPOINTS.useInvitation, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${parsedUser?.token}`
        },
        body: JSON.stringify({ code: inputCode, userId })
      })

      const contentType = res.headers.get('content-type')

      if (contentType && contentType.includes('application/json')) {
        const data = await res.json()
        setJoinMessage(data.message || (res.ok ? 'Đã tham gia chia sẻ thành công.' : 'Không thể tham gia bằng mã mời này.'))
      } else {
        const text = await res.text()
        setJoinMessage(text)
      }
    } catch (err) {
      console.error('Error:', err)
      setJoinMessage('Lỗi khi tham gia chia sẻ.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const storedUser = sessionStorage.getItem('user')
      const parsedUser = storedUser ? JSON.parse(storedUser) : null

      const res = await fetch(API_ENDPOINTS.deleteRelationship(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${parsedUser?.token}`
        }
      })

      const data = await res.text()

      if (res.ok) {
        alert('Đã xóa người thân thành công.')
        const newList = relationships.filter((r: { relationshipId: string | number }) => r.relationshipId !== id);
        setRelationships(newList)
      } else {
        alert(data || 'Không thể xóa người thân.')
      }
    } catch (err) {
      console.error('Lỗi khi xóa người thân:', err)
      alert('Lỗi máy chủ.')
    }
  }

  return (
    <Container className="max-w-lg mx-auto !px-20 py-5">
      <div>
        <p className="text-2xl !font-bold text-cyan-500 mb-6">Chia sẻ thông tin với người thân</p>
        <p className="text-sm text-gray-500">Bất kỳ ai có liên kết đều có thể xem thông tin về bệnh án này</p>

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

        <div className="pb-5 mt-4">
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
          <p className="text-lg font-semibold text-gray-700">Danh sách người thân đã chia sẻ:</p>

          {relationships.length === 0 ? (
  <p className="text-sm text-gray-500">Hiện chưa có người thân nào.</p>
) : (
  relationships.map((relation) => (
    <div key={relation.relationshipId} className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Image
          src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
          alt="Avatar"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <div className="font-medium">{relation.nameInviter || 'Chưa có tên'}</div>
          <div className="text-sm text-gray-500">{relation.emailInviter || 'Chưa có email'}</div>
        </div>
      </div>
  
      <div className="col-span-3 flex gap-2">
        <Button
          variant="info"
          className='text-white'
          onClick={() => handleViewDetails(relation.inviterId)}
        >
          Xem vị trí
        </Button>
        <Button
          variant="danger"
          onClick={() => handleDelete(relation.relationshipId)}
        >
          Xóa
        </Button>
      </div>
    </div>
  )))
}

        </div>
      </div>
    </Container>
  )
}
