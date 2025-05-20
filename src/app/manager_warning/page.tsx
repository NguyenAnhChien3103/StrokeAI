'use client';

import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { FaCheckCircle, FaSearch } from 'react-icons/fa';
import { TriangleAlert } from 'lucide-react';

interface Warning {
  warningId: number;
  description: string;
  createdAt: string;
  formattedTimestamp: string;
}

const ManagerWarning = () => {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(parsedUser.token);
      }
    }
  }, []);

  const fetchWarnings = async () => {
    try {
      setLoading(true);
      const url = 'http://localhost:5062/api/Warning/my-warnings';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setWarnings([]);
        return;
      }

      const data = await response.json();
      setWarnings(data.warnings);
    } catch {
      setWarnings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchWarnings();
    }
  }, [token]);

  const getWarningIcon = () => {
    return <TriangleAlert className="text-red-500 text-lg" />;
  };

  const filteredWarnings = warnings.filter(warning =>
    warning.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className="max-w-lg mx-auto !px-20 py-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-2xl !font-bold text-cyan-500 mb-6">Quản lý cảnh báo</p>
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            {filteredWarnings.length} cảnh báo
          </span>
        </div>
      </div>

      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400 text-sm" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
          placeholder="Tìm kiếm cảnh báo..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : filteredWarnings.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <FaCheckCircle className="text-green-500 text-3xl mx-auto mb-2" />
          <p className="text-gray-600 text-sm">Không có cảnh báo nào</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredWarnings.map((warning) => (
            <div
              key={warning.warningId}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border-l-4 border-red-500"
            >
              <div className="p-2.5">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mr-2 mt-0.5">
                    {getWarningIcon()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="text-sm font-semibold text-red-700">
                        {warning.description.split('(')[0].trim()}
                      </h5>
                      <span className="text-xs text-gray-500 ml-2">
                        {warning.formattedTimestamp}
                      </span>
                    </div>
                    <p className="text-gray-600 text-xs leading-normal">
                      {warning.description.includes('(') ? 
                        warning.description.split('(')[1].replace(')', '') : 
                        warning.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
};

export default ManagerWarning;
