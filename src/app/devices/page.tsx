'use client';

import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Container, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import removeDiacritics from 'remove-diacritics';
import API_ENDPOINTS from '../utils/apiConfig';

type Device = {
  deviceId: number;
  deviceName: string;
  deviceType: string;
  series: string;
  userId: number;
};

export default function DevicesPage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [deviceForm, setDeviceForm] = useState({
    deviceName: '',
    deviceType: '',
    series: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser.userId);
        setToken(parsedUser.token);
      }
    }
  }, []);

  useEffect(() => {
    if (userId !== null) fetchDevices();
  }, [userId]);

  const fetchDevices = async () => {
    if (userId === null || token === null) return;
    try {
      const res = await fetch(API_ENDPOINTS.getDevices(userId), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Không thể lấy danh sách thiết bị');
      const data = await res.json();
      setDevices(data?.$values || []);
    } catch  {
      setErrorMsg('Không thể lấy danh sách thiết bị');
      setDevices([]); 
    }
  };
  
  

  const handleAddDevice = async () => {
    const { deviceName, deviceType, series } = deviceForm;
    if (!deviceName || !deviceType || !series) {
      setErrorMsg('Vui lòng nhập đầy đủ 3 trường.');
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.addDevice, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...deviceForm, userId }),
      });

      if (!res.ok) throw new Error(await res.text());

      setDeviceForm({ deviceName: '', deviceType: '', series: '' });
      setErrorMsg('');
      setShowModal(false);
      fetchDevices();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteDevice = async (deviceId: number) => {
    try {
      const res = await fetch(API_ENDPOINTS.deleteDevice(deviceId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Xoá thất bại');
      fetchDevices();
    } catch (err) {
      console.error(err);
    }
  };

  const normalizeSearchTerm = (term: string) => {
    return removeDiacritics(term).replace(/\s+/g, '').toLowerCase();
  };

  const filteredDevices = devices.filter((device) => {
    const normalizedSearchTerm = normalizeSearchTerm(searchTerm);
    return (
      normalizeSearchTerm(device.deviceName).includes(normalizedSearchTerm) ||
      normalizeSearchTerm(device.deviceType).includes(normalizedSearchTerm) ||
      normalizeSearchTerm(device.series).includes(normalizedSearchTerm)
    );
  });

  return (
    <Container className="max-w-lg mx-auto !px-20 py-5">
      <Row className="mb-4 justify-content-between align-items-center">
        <Col><p className='text-2xl !font-bold text-cyan-500 mb-6'>Quản lý thiết bị</p></Col>
        <Col className="text-end">
          <Button variant="primary"
            className='!bg-cyan-500 text-black'
            onClick={() => setShowModal(true)}>Thêm thiết bị</Button>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên, loại, series"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <Row>
        <Col>
          {filteredDevices.length === 0 ? (
            <Alert variant="info">Không có thiết bị nào.</Alert>
          ) : (
            <ListGroup>
              {filteredDevices.map((device) => (
                <ListGroup.Item
                  key={device.deviceId}
                  className="d-flex justify-content-between align-items-start"
                >
                  <div>
                    <div><strong>Tên:</strong> {device.deviceName}</div>
                    <div><strong>Loại:</strong> {device.deviceType}</div>
                    <div><strong>Series:</strong> {device.series}</div>
                  </div>
                  <div className="d-flex align-items-center px-5" style={{ height: '70px' }}>
                    <Button
                      variant="danger"
                      size="sm"
                      className='px-4 py-2'
                      onClick={() => handleDeleteDevice(device.deviceId)}
                    >
                      Xoá
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setErrorMsg('');
          setDeviceForm({ deviceName: '', deviceType: '', series: '' }); // Reset form here
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm thiết bị mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}

          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên thiết bị</Form.Label>
              <Form.Control
                type="text"
                value={deviceForm.deviceName}
                onChange={(e) => setDeviceForm({ ...deviceForm, deviceName: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại thiết bị</Form.Label>
              <Form.Control
                type="text"
                value={deviceForm.deviceType}
                onChange={(e) => setDeviceForm({ ...deviceForm, deviceType: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Series</Form.Label>
              <Form.Control
                type="text"
                value={deviceForm.series}
                onChange={(e) => setDeviceForm({ ...deviceForm, series: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowModal(false);
            setErrorMsg('');
            setDeviceForm({ deviceName: '', deviceType: '', series: '' }); // Reset form here
          }}>
            Huỷ
          </Button>
          <Button variant="success"
            className='!bg-cyan-500 text-black'
            onClick={handleAddDevice}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
