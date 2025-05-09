'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import API_ENDPOINTS from '../../../app/utils/apiConfig';
import { Container } from 'react-bootstrap';

export default function Admin_Health_Check() {
  const router = useRouter();
  const params = useParams();
  const idRaw = params.id;
  const [token, setToken] = useState("");

  const [molecularData, setMolecularData] = useState({
    MiR_30e_5p: false,
    MiR_16_5p: false,
    MiR_140_3p: false,
    MiR_320d: false,
    MiR_320p: false,
    MiR_20a_5p: false,
    MiR_26b_5p: false,
    MiR_19b_5p: false,
    MiR_874_5p: false,
    MiR_451a: false,
  });

  const [subclinicalData, setSubclinicalData] = useState({
    D_dimer: false,
    GFAP: false,
    Lipids: false,
    MMP9: false,
    NT_proBNP: false,
    Protein: false,
    RBP4: false,
    S100B: false,
    sRAGE: false,
    VonWillebrand: false,
  });

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setToken(parsedUser.token);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, group: string) => {
    const { name, checked } = e.target;
    if (group === 'molecularData') {
      setMolecularData((prev) => ({ ...prev, [name]: checked }));
    } else if (group === 'subclinicalData') {
      setSubclinicalData((prev) => ({ ...prev, [name]: checked }));
    }
  };

  const handleCheckboxClick = (key: string, group: string) => {
    if (group === 'molecularData') {
      setMolecularData((prev) => ({ ...prev, [key]: !prev[key] }));
    } else if (group === 'subclinicalData') {
      setSubclinicalData((prev) => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault();

    const molecularIndicatorData = {
      UserID: parseInt(idRaw as string),
      RecordedAt: new Date().toISOString(),
      IsActived: true,
      MiR_30e_5p: molecularData.MiR_30e_5p || false,
      MiR_16_5p: molecularData.MiR_16_5p || false,
      MiR_140_3p: molecularData.MiR_140_3p || false,
      MiR_320d: molecularData.MiR_320d || false,
      MiR_320p: molecularData.MiR_320p || false,
      MiR_20a_5p: molecularData.MiR_20a_5p || false,
      MiR_26b_5p: molecularData.MiR_26b_5p || false,
      MiR_19b_5p: molecularData.MiR_19b_5p || false,
      MiR_874_5p: molecularData.MiR_874_5p || false,
      MiR_451a: molecularData.MiR_451a || false
    };

    const subclinicalIndicatorData = {
      UserID: parseInt(idRaw as string),
      RecordedAt: new Date().toISOString(),
      IsActived: true,
      D_dimer: subclinicalData.D_dimer || false,
      GFAP: subclinicalData.GFAP || false,
      Lipids: subclinicalData.Lipids || false,
      MMP9: subclinicalData.MMP9 || false,
      NT_proBNP: subclinicalData.NT_proBNP || false,
      Protein: subclinicalData.Protein || false,
      RBP4: subclinicalData.RBP4 || false,
      S100B: subclinicalData.S100B || false,
      sRAGE: subclinicalData.sRAGE || false,
      VonWillebrand: subclinicalData.VonWillebrand || false
    };

    try {
      // Gửi dữ liệu phân tử
      console.log('Sending molecular data:', molecularIndicatorData);
      const molecularResponse = await fetch(API_ENDPOINTS.addMolecularIndicator, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(molecularIndicatorData),
      });
      const molecularResult = await molecularResponse.json();
      console.log('Molecular Response:', molecularResult);

      console.log('Sending subclinical data:', subclinicalIndicatorData);
      const subclinicalResponse = await fetch(API_ENDPOINTS.addSubclinicalIndicator, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(subclinicalIndicatorData),
      });
      const subclinicalResult = await subclinicalResponse.json();
      console.log('Subclinical Response:', subclinicalResult);

      if (molecularResponse.ok && subclinicalResponse.ok) {
        alert("Gửi tất cả chỉ số thành công!");
        router.push(`/doctor_manager_user_information/${idRaw}`);
      } else {
        console.error("Lỗi phản hồi:", {
          molecular: molecularResult,
          subclinical: subclinicalResult
        });
        alert("Có lỗi xảy ra khi gửi dữ liệu!");
      }
    } catch (error) {
      console.error("Lỗi khi gửi:", error);
      alert("Gửi thất bại!");
    }
  };

  return (
    <Container className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-2">
        <div className="rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-2xl !font-bold text-blue-500">Sinh học phân tử</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ["MiR_30e_5p", "MiR-30e-5p"],
              ["MiR_16_5p", "MiR-16-5p"],
              ["MiR_140_3p", "MiR-140-3p"],
              ["MiR_320d", "MiR-320d"],
              ["MiR_320p", "MiR-320p"],
              ["MiR_20a_5p", "MiR-20a-5p"],
              ["MiR_26b_5p", "MiR-26b-5p"],
              ["MiR_19b_5p", "MiR-19b-5p"],
              ["MiR_874_5p", "MiR-874-5p"],
              ["MiR_451a", "MiR-451a"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 shadow-sm cursor-pointer"
                onClick={() => handleCheckboxClick(key, 'molecularData')}
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={molecularData[key as keyof typeof molecularData]}
                  onChange={(e) => handleChange(e, 'molecularData')}
                  className="h-5 w-5 accent-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-base font-medium leading-5 ml-3" style={{ userSelect: 'none' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className=" rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-2xl !font-bold text-purple-500">Chỉ số cận lâm sàng</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ["D_dimer", "D-dimer"],
              ["GFAP", "GFAP"],
              ["Lipids", "Lipids"],
              ["MMP9", "MMP9"],
              ["NT_proBNP", "NT-proBNP"],
              ["Protein", "Protein"],
              ["RBP4", "RBP4"],
              ["S100B", "S100B"],
              ["sRAGE", "sRAGE"],
              ["VonWillebrand", "Von Willebrand"],
            ].map(([key, label]) => (
              <div
                key={key}
                className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 shadow-sm cursor-pointer"
                onClick={() => handleCheckboxClick(key, 'subclinicalData')}
              >
                <input
                  type="checkbox"
                  name={key}
                  checked={subclinicalData[key as keyof typeof subclinicalData]}
                  onChange={(e) => handleChange(e, 'subclinicalData')}
                  className="h-5 w-5 accent-purple-600 rounded border-gray-300 focus:ring-purple-500"
                />
                <span className="text-gray-700 text-base font-medium leading-5 ml-3" style={{ userSelect: 'none' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            onClick={handleSubmitAll}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white !rounded-full font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Gửi Tất Cả Chỉ Số
          </button>
        </div>
      </div>
    </Container>
  );
}
