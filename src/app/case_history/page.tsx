"use client";
import React, { useEffect, useState } from 'react';
import { Card, Container } from 'react-bootstrap';
import { CheckCircle2, XCircle } from "lucide-react";
import API_ENDPOINTS from '../utils/apiConfig';
import { useRouter } from 'next/navigation';

interface ClinicalIndicator {
  clinicalIndicatorID: number;
  userID: number;
  isActived: boolean;
  recordedAt: string;
  dauDau: boolean;
  teMatChi: boolean;
  chongMat: boolean;
  khoNoi: boolean;
  matTriNhoTamThoi: boolean;
  luLan: boolean;
  giamThiLuc: boolean;
  matThangCan: boolean;
  buonNon: boolean;
  khoNuot: boolean;
  reportCount: number;
}

interface MolecularIndicator {
  molecularIndicatorID: number;
  userID: number;
  isActived: boolean;
  recordedAt: string;
  miR_30e_5p: boolean;
  miR_16_5p: boolean;
  miR_140_3p: boolean;
  miR_320d: boolean;
  miR_320p: boolean;
  miR_20a_5p: boolean;
  miR_26b_5p: boolean;
  miR_19b_5p: boolean;
  miR_874_5p: boolean;
  miR_451a: boolean;
  reportCount: number;
}

interface SubclinicalIndicator {
  subclinicalIndicatorID: number;
  userID: number;
  isActived: boolean;
  recordedAt: string;
  s100B: boolean;
  mmP9: boolean;
  gfap: boolean;
  rbP4: boolean;
  nT_proBNP: boolean;
  sRAGE: boolean;
  d_dimer: boolean;
  lipids: boolean;
  protein: boolean;
  vonWillebrand: boolean;
  reportCount: number;
}

interface HealthIndicators {
  clinical: ClinicalIndicator;
  molecular: MolecularIndicator;
  subclinical: SubclinicalIndicator;
}

const IndicatorItem = ({ label, value }: { label: string; value: boolean }) => (
  <div className="flex items-center justify-between py-2 border-b">
    <span className="text-sm font-medium">{label}</span>
    {value ? (
      <CheckCircle2 className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    )}
  </div>
);

const NoDataMessage = () => (
  <div className="text-center py-4 text-gray-500">
    Không có dữ liệu chỉ số này
  </div>
);

export default function CaseHistory() {
  const router = useRouter();
  const [healthIndicators, setHealthIndicators] = useState<HealthIndicators>({
    clinical: {
      clinicalIndicatorID: 0,
      userID: 0,
      isActived: false,
      recordedAt: new Date().toISOString(),
      dauDau: false,
      teMatChi: false,
      chongMat: false,
      khoNoi: false,
      matTriNhoTamThoi: false,
      luLan: false,
      giamThiLuc: false,
      matThangCan: false,
      buonNon: false,
      khoNuot: false,
      reportCount: 0
    },
    molecular: {
      molecularIndicatorID: 0,
      userID: 0,
      isActived: false,
      recordedAt: new Date().toISOString(),
      miR_30e_5p: false,
      miR_16_5p: false,
      miR_140_3p: false,
      miR_320d: false,
      miR_320p: false,
      miR_20a_5p: false,
      miR_26b_5p: false,
      miR_19b_5p: false,
      miR_874_5p: false,
      miR_451a: false,
      reportCount: 0
    },
    subclinical: {
      subclinicalIndicatorID: 0,
      userID: 0,
      isActived: false,
      recordedAt: new Date().toISOString(),
      s100B: false,
      mmP9: false,
      gfap: false,
      rbP4: false,
      nT_proBNP: false,
      sRAGE: false,
      d_dimer: false,
      lipids: false,
      protein: false,
      vonWillebrand: false,
      reportCount: 0
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (!storedUser) {
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        const token = user.token;
        const userId = user.userId;

        if (!token || !userId) {
          setLoading(false);
          return;
        }

        const response = await fetch(API_ENDPOINTS.getHealthProfile, {
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

        const data = await response.json();
        if (data?.healthIndicators) {
          setHealthIndicators({
            clinical: data.healthIndicators.clinical || null,
            molecular: data.healthIndicators.molecular || null,
            subclinical: data.healthIndicators.subclinical || null
          });
        } else {
          setHealthIndicators({
            clinical: null,
            molecular: null,
            subclinical: null
          });
        }
      } catch (err) {
        console.error("Error details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthData();
  }, []);

  if (loading) return <div className="p-4">Đang tải dữ liệu...</div>;

  return (
    <Container className="max-w-lg mx-auto !px-20 py-5">
      <div className="flex justify-between items-center mb-6">
        <p className="text-2xl !font-bold text-cyan-500">Chỉ số sức khỏe</p>
        <button
          onClick={() => router.push('/user_health_check')}
          className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white !rounded-full font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Cập nhật chỉ số
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Header>
            <Card.Title>Chỉ số lâm sàng</Card.Title>
          </Card.Header>
          <Card.Body>
            {healthIndicators.clinical ? (
              <div className="space-y-2">
                <IndicatorItem label="Đau đầu" value={healthIndicators.clinical.dauDau} />
                <IndicatorItem label="Tê mặt chi" value={healthIndicators.clinical.teMatChi} />
                <IndicatorItem label="Chóng mặt" value={healthIndicators.clinical.chongMat} />
                <IndicatorItem label="Khó nói" value={healthIndicators.clinical.khoNoi} />
                <IndicatorItem label="Mất trí nhớ tạm thời" value={healthIndicators.clinical.matTriNhoTamThoi} />
                <IndicatorItem label="Lú lẫn" value={healthIndicators.clinical.luLan} />
                <IndicatorItem label="Giảm thị lực" value={healthIndicators.clinical.giamThiLuc} />
                <IndicatorItem label="Mất thăng bằng" value={healthIndicators.clinical.matThangCan} />
                <IndicatorItem label="Buồn nôn" value={healthIndicators.clinical.buonNon} />
                <IndicatorItem label="Khó nuốt" value={healthIndicators.clinical.khoNuot} />
              </div>
            ) : (
              <NoDataMessage />
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Chỉ số phân tử</Card.Title>
          </Card.Header>
          <Card.Body>
            {healthIndicators.molecular ? (
              <div className="space-y-2">
                <IndicatorItem label="miR-30e-5p" value={healthIndicators.molecular.miR_30e_5p} />
                <IndicatorItem label="miR-16-5p" value={healthIndicators.molecular.miR_16_5p} />
                <IndicatorItem label="miR-140-3p" value={healthIndicators.molecular.miR_140_3p} />
                <IndicatorItem label="miR-320d" value={healthIndicators.molecular.miR_320d} />
                <IndicatorItem label="miR-320p" value={healthIndicators.molecular.miR_320p} />
                <IndicatorItem label="miR-20a-5p" value={healthIndicators.molecular.miR_20a_5p} />
                <IndicatorItem label="miR-26b-5p" value={healthIndicators.molecular.miR_26b_5p} />
                <IndicatorItem label="miR-19b-5p" value={healthIndicators.molecular.miR_19b_5p} />
                <IndicatorItem label="miR-874-5p" value={healthIndicators.molecular.miR_874_5p} />
                <IndicatorItem label="miR-451a" value={healthIndicators.molecular.miR_451a} />
              </div>
            ) : (
              <NoDataMessage />
            )}
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title>Chỉ số cận lâm sàng</Card.Title>
          </Card.Header>
          <Card.Body>
            {healthIndicators.subclinical ? (
              <div className="space-y-2">
                <IndicatorItem label="S100B" value={healthIndicators.subclinical.s100B} />
                <IndicatorItem label="MMP9" value={healthIndicators.subclinical.mmP9} />
                <IndicatorItem label="GFAP" value={healthIndicators.subclinical.gfap} />
                <IndicatorItem label="RBP4" value={healthIndicators.subclinical.rbP4} />
                <IndicatorItem label="NT-proBNP" value={healthIndicators.subclinical.nT_proBNP} />
                <IndicatorItem label="sRAGE" value={healthIndicators.subclinical.sRAGE} />
                <IndicatorItem label="D-dimer" value={healthIndicators.subclinical.d_dimer} />
                <IndicatorItem label="Lipids" value={healthIndicators.subclinical.lipids} />
                <IndicatorItem label="Protein" value={healthIndicators.subclinical.protein} />
                <IndicatorItem label="von Willebrand" value={healthIndicators.subclinical.vonWillebrand} />
              </div>
            ) : (
              <NoDataMessage />
            )}
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}
