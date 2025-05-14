'use client';

import { useState, useEffect } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface Warning {
  warningId: number;
  userId: number;
  patientName: string;
  description: string;
  createdAt: string;
  formattedTimestamp: string;
  isActive: boolean;
}

interface WarningDetail {
  warningId: number;
  userId: number;
  patientName: string;
  description: string;
  createdAt: string;
  formattedTimestamp: string;
  isActive: boolean;
}



export default function WarningManagement() {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [selectedWarning, setSelectedWarning] = useState<WarningDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(parsedUser.token);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchWarnings();
    }
  }, [token]);

  const fetchWarnings = async () => {
    try {
      const response = await fetch('http://localhost:5062/api/Warning', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setWarnings(data.warnings);
    } catch (error) {
      console.error('Error fetching warnings:', error);
      setWarnings([]);
    }
  };

  const handleViewDetail = async (warningId: number) => {
    try {
      const response = await fetch(`http://localhost:5062/api/Warning/${warningId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setSelectedWarning(data);
      setShowModal(true);
    } catch (error) {
      console.error('Error fetching warning detail:', error);
    }
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Quản lý cảnh báo / Warning Management</h1>
      
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên bệnh nhân / Patient Name</th>
            <th>Mô tả / Description</th>
            <th>Thời gian / Time</th>
            <th>Trạng thái / Status</th>
            <th>Thao tác / Actions</th>
          </tr>
        </thead>
        <tbody>
          {warnings.map((warning) => (
            <tr key={warning.warningId}>
              <td>{warning.warningId}</td>
              <td>{warning.patientName}</td>
              <td>{warning.description}</td>
              <td>{warning.formattedTimestamp}</td>
              <td>
                <span className={`badge ${warning.isActive ? 'bg-success' : 'bg-danger'}`}>
                  {warning.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td>
                <Button 
                  variant="outline-primary"
                  onClick={() => handleViewDetail(warning.warningId)}
                >
                  Xem chi tiết / View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết cảnh báo / Warning Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWarning && (
            <div className="container">
              <div className="row mb-2">
                <div className="col-4 fw-bold">ID:</div>
                <div className="col-8">{selectedWarning.warningId}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold">Tên bệnh nhân / Patient Name:</div>
                <div className="col-8">{selectedWarning.patientName}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold">Mô tả / Description:</div>
                <div className="col-8">{selectedWarning.description}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold">Thời gian / Time:</div>
                <div className="col-8">{selectedWarning.formattedTimestamp}</div>
              </div>
              <div className="row mb-2">
                <div className="col-4 fw-bold">Trạng thái / Status:</div>
                <div className="col-8">
                  <span className={`badge ${selectedWarning.isActive ? 'bg-success' : 'bg-danger'}`}>
                    {selectedWarning.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng / Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
