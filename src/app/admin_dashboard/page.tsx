"use client";

import { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import { useRouter } from 'next/navigation'; 
import { Button } from "react-bootstrap";
import API_ENDPOINTS from '../utils/apiConfig';

interface CaseHistory {
  caseHistoryId: number;
  patientName: string;
  time: string;
  formattedTime: string;
  statusOfMr: string;
}

interface DashboardData {
  totalPatients: number;
  totalCaseHistories: number;
  highRiskPatients: number;
  newEvaluations: number;
  recentCaseHistories: CaseHistory[];
}

interface Patient {
  userId: number;
  username: string;
  patientName: string;
  dateOfBirth: string; 
  age: number;
  gender: boolean;
  phone: string;
  email: string;
  genderText?: string; 
}

export default function DoctorDashboard()  {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(parsedUser.token);
    }
  }, []);

  const fetchDashboard = async () => {
    if (!token) {
      setError("Token không tồn tại. Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.getDoctorDashboard, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const json = await response.json();
      console.log('API Response:', json);
      
      if (json.success) {
        setDashboardData({
          totalPatients: json.data.totalPatients,
          totalCaseHistories: json.data.totalCaseHistories,
          highRiskPatients: json.data.highRiskPatients,
          newEvaluations: json.data.newEvaluations,
          recentCaseHistories: json.data.recentCaseHistories || []
        });
      } else {
        console.log('API Error:', json);
        setError("Lỗi từ API: " + (json.message || "Không rõ"));
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError("Lỗi khi gọi API: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    if (!token) {
      setError("Token không tồn tại. Vui lòng đăng nhập lại.");
      return;
    }
  
    try {
      const response = await fetch(API_ENDPOINTS.getDoctorPatients, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }

      const json = await response.json();
      console.log('Patients API Response:', json);
      
      if (json.patients) {
        const patients: Patient[] = json.patients.map((patient: Patient) => ({
          ...patient,
          genderText: patient.gender ? "Nam" : "Nữ", 
        }));
        setPatients(patients); 
      } else {
        setError("Lỗi từ API: " + (json.message || "Không rõ"));
      }
    } catch (err) {
      console.error('Patients fetch error:', err);
      setError("Lỗi khi gọi API: " + (err instanceof Error ? err.message : String(err)));
    }
  };
  
  const handleViewDetails = (id: number) => {
    router.push(`/doctor_manager_user_information/${id}`);
  };
  
  useEffect(() => {
    if (token) {
      fetchDashboard();
      fetchPatients();
    }
  }, [token]);

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!dashboardData) return <div>Không có dữ liệu.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <p className="text-2xl !font-bold text-cyan-500 mb-6">Bảng điều khiển Bác sĩ</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <DashboardCard title="Tổng bệnh nhân" value={dashboardData.totalPatients} />
        <DashboardCard title="Tổng hồ sơ" value={dashboardData.totalCaseHistories} />
        <DashboardCard title="Nguy cơ cao" value={dashboardData.highRiskPatients} />
        <DashboardCard title="Đánh giá mới" value={dashboardData.newEvaluations} />
      </div>

      <p className="text-2xl !font-bold text-cyan-500 mb-6 mt-4">Danh sách bệnh nhân của bác sĩ</p>
      {patients.length === 0 ? (
        <p>Không có bệnh nhân nào.</p>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Tên bệnh nhân</th>
              <th>Ngày sinh</th>
              <th>Tuổi</th>
              <th>Giới tính</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.userId}>
                <td>{patient.patientName}</td>
                <td>{new Date(patient.dateOfBirth).toLocaleDateString('en-GB')}</td>
                <td>{patient.age}</td>
                <td>{patient.gender ? "Nam" : "Nữ"}</td>
                <td>{patient.phone}</td>
                <td>{patient.email}</td>
                <td><Button variant="info" onClick={() => handleViewDetails(patient.userId)}>Xem hồ sơ bệnh án</Button></td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white shadow rounded-lg p-4 text-center">
      <div className="text-gray-500 text-sm">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
