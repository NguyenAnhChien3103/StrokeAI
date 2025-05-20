"use client";
import { useState, useEffect } from 'react';
import API_ENDPOINTS from '../../utils/apiConfig';
import { Table, Button, Alert } from 'react-bootstrap';

interface Warning {
  warningId: number;
  userId: number;
  patientName: string;
  description: string;
  createdAt: string;
  formattedTimestamp: string;
  isActive: boolean;
  isLocked: boolean;
}

interface WarningManagementViewProps {
  token: string | null;
}

export default function WarningManagementView({ token }: WarningManagementViewProps) {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [timeFilter, setTimeFilter] = useState<string>("all");
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchWarnings = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.getWarnings, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch warnings');
      }

      const data = await response.json();
      setWarnings(data.warnings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWarning = async (warningId: number) => {
    if (!token) return;

    if (!window.confirm('Bạn có chắc chắn muốn xóa cảnh báo này?')) {
      return;
    }

    try {
      const response = await fetch(`${API_ENDPOINTS.deleteWarning}/${warningId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete warning');
      }

      setSuccessMessage('Xóa cảnh báo thành công!');
      setShowSuccess(true);
      
      window.alert('Xóa cảnh báo thành công!');
      setShowSuccess(false);

      fetchWarnings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const removeAccents = (str: string) => {
    return str.normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const filteredWarnings = warnings.filter(warning => {
    const searchTermNoAccent = removeAccents(searchTerm.toLowerCase());
    const matchesSearch = searchTerm === "" ||
      removeAccents(warning.patientName.toLowerCase()).includes(searchTermNoAccent) ||
      removeAccents(warning.description.toLowerCase()).includes(searchTermNoAccent);

    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "active" && warning.isActive && !warning.isLocked) ||
      (statusFilter === "locked" && warning.isLocked);

    let matchesTime = true;
    if (timeFilter !== "all") {
      const warningDate = new Date(warning.createdAt);
      const today = new Date();
      
      if (timeFilter === "today") {
        matchesTime = warningDate.toDateString() === today.toDateString();
      } else if (timeFilter === "week") {
        const diffTime = Math.abs(today.getTime() - warningDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        matchesTime = diffDays <= 7;
      } else if (timeFilter === "month") {
        matchesTime = warningDate.getMonth() === today.getMonth() && 
                     warningDate.getFullYear() === today.getFullYear();
      }
    }

    return matchesSearch && matchesStatus && matchesTime;
  });

  useEffect(() => {
    fetchWarnings();
  }, [token]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <div>
      {showSuccess && (
        <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible className="mb-4">
          {successMessage}
        </Alert>
      )}

      <div className="mb-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên bệnh nhân, mô tả..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Tất cả</option>
              <option value="active">Active</option>
              <option value="locked">Locked</option>
            </select>
          </div>

          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="all">Tất cả</option>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table striped bordered hover responsive className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bệnh nhân</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
              <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
            </tr> 
          </thead>
          <tbody>
            {filteredWarnings.map((warning) => (
              <tr key={warning.warningId}>
                <td className="px-2 py-0.5 whitespace-nowrap text-xs text-gray-900">{warning.warningId}</td>
                <td className="px-2 py-0.5 whitespace-nowrap text-xs text-gray-900">{warning.patientName}</td>
                <td className="px-2 py-0.5 text-xs text-gray-900">{warning.description}</td>
                <td className="px-2 py-0.5 whitespace-nowrap text-xs text-gray-900">{warning.formattedTimestamp}</td>
                <td className="px-2 py-0.5 whitespace-nowrap">
                  <span className={`inline-flex items-center py-0.5 rounded-full text-xs font-medium w-16 justify-center ${
                    warning.isLocked ? 'bg-red-100 text-red-800' : 
                    warning.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {warning.isLocked ? 'locked' : 
                     warning.isActive ? 'active' : 'inactive'}
                  </span>
                </td>
                <td className="px-2 py-0.5 text-center">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteWarning(warning.warningId)}
                    className='px-3'
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
} 