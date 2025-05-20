'use client';

import React, { useEffect, useState } from 'react';
import {  Form, Container, Row, Col, ListGroup, Alert } from 'react-bootstrap';
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
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Không thể lấy danh sách thiết bị');
      const data = await res.json();
      setDevices(data.devices || []);
    } catch {
      setDevices([]);
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
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
      </Row>
    </Container>
  );
}
