'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Download, RefreshCw, AlertCircle } from 'lucide-react';
import type { ContractTemplate, ContractType } from '@/lib/types/template';

export default function TemplatePreviewPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [template, setTemplate] = useState<ContractTemplate | null>(null);
  const [previewHtml, setPreviewHtml] = useState('');
  const [sampleData, setSampleData] = useState<Record<string, any>>({});

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setAuthToken(token);
    if (token) {
      fetchTemplateAndPreview(token);
    }
  }, [templateId]);

  async function fetchTemplateAndPreview(token: string) {
    setLoading(true);
    setError('');

    try {
      // Fetch template
      const res = await fetch(`/api/admin/templates/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to load template');
        return;
      }

      const data = await res.json();
      const tmpl = data.template;
      setTemplate(tmpl);

      // Generate sample data
      const sample = SAMPLE_DATA[tmpl.contract_type as ContractType];
      setSampleData(sample);

      // Generate preview
      await generatePreview(token, tmpl.template_html, tmpl.template_css, sample);
    } catch (err: any) {
      setError(err.message || 'Failed to load template');
    } finally {
      setLoading(false);
    }
  }

  async function generatePreview(
    token: string,
    html: string,
    css: string | null,
    data: Record<string, any>
  ) {
    try {
      const res = await fetch('/api/admin/templates/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          template_html: html,
          template_css: css,
          sample_data: data,
        }),
      });

      if (res.ok) {
        const previewData = await res.json();
        setPreviewHtml(previewData.rendered);
      } else {
        const previewData = await res.json();
        setError(previewData.error || 'Preview generation failed');
      }
    } catch (err: any) {
      setError(err.message || 'Preview generation failed');
    }
  }

  function handleRefresh() {
    if (authToken && template) {
      generatePreview(authToken, template.template_html, template.template_css, sampleData);
    }
  }

  function handleDownload() {
    if (!previewHtml || !template) return;

    const blob = new Blob([previewHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}_preview.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-slate-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Preview: {template?.name}</h1>
                <p className="text-sm text-slate-600">
                  v{template?.version} • {template?.contract_type} • {template?.language.toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium transition"
              >
                <RefreshCw size={18} />
                รีเฟรช
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium transition"
              >
                <Download size={18} />
                ดาวน์โหลด HTML
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                พิมพ์
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 print:p-0">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3 print:hidden">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Preview Container */}
        <div className="bg-white rounded-lg shadow-lg border border-slate-200 p-8 print:shadow-none print:border-none">
          {previewHtml ? (
            <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p>ไม่สามารถสร้าง preview ได้</p>
            </div>
          )}
        </div>

        {/* Sample Data Display */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-slate-200 p-6 print:hidden">
          <h2 className="font-semibold text-slate-900 mb-3">ข้อมูลตัวอย่างที่ใช้</h2>
          <pre className="bg-slate-50 p-4 rounded-lg text-xs overflow-x-auto">
            {JSON.stringify(sampleData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
}

// Sample data for each contract type
const SAMPLE_DATA: Record<ContractType, Record<string, any>> = {
  lease: {
    title: 'สัญญาเช่าคอนโดมิเนียม',
    state: 'กรุงเทพมหานคร',
    contractDate: new Date().toISOString(),
    sellerName: 'นายสมชาย ใจดี',
    sellerIdCard: '1-1234-56789-12-3',
    sellerAddress: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    sellerPhone: '02-123-4567',
    buyerName: 'นางสมหญิง สบายดี',
    buyerIdCard: '2-9876-54321-09-8',
    buyerAddress: '456 ถนนพระราม 4 แขวงพระโขนง เขตคลองเตย กรุงเทพฯ 10110',
    buyerPhone: '02-987-6543',
    propertyType: 'คอนโดมิเนียม',
    propertyAddress: 'ห้อง 1234 อาคาร B ชั้น 12 คอนโดมิเนียม ABC ถนนสุขุมวิท',
    monthlyRent: 15000,
    depositAmount: 30000,
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
  },
  'vehicle-sale': {
    title: 'สัญญาซื้อขายรถยนต์',
    state: 'กรุงเทพมหานคร',
    contractDate: new Date().toISOString(),
    sellerName: 'นายสมชาย ใจดี',
    sellerIdCard: '1-1234-56789-12-3',
    sellerAddress: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    buyerName: 'นางสมหญิง สบายดี',
    buyerIdCard: '2-9876-54321-09-8',
    buyerAddress: '456 ถนนพระราม 4 แขวงพระโขนง เขตคลองเตย กรุงเทพฯ 10110',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Camry',
    vehicleYear: 2020,
    vehicleColor: 'ขาว',
    vehiclePlate: 'กข 1234',
    vehicleChassisNumber: 'ABC123456789',
    vehicleEngineNumber: 'ENG987654321',
    salePrice: 800000,
    depositAmount: 100000,
  },
  'property-sale': {
    title: 'สัญญาซื้อขายอสังหาริมทรัพย์',
    state: 'กรุงเทพมหานคร',
    contractDate: new Date().toISOString(),
    sellerName: 'นายสมชาย ใจดี',
    sellerIdCard: '1-1234-56789-12-3',
    sellerAddress: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    buyerName: 'นางสมหญิง สบายดี',
    buyerIdCard: '2-9876-54321-09-8',
    buyerAddress: '456 ถนนพระราม 4 แขวงพระโขนง เขตคลองเตย กรุงเทพฯ 10110',
    propertyType: 'บ้านเดี่ยว',
    propertyAddress: '789 หมู่บ้านมณีรินทร์ ซอยรามคำแหง 99 แขวงหัวหมาก เขตบางกะปิ กรุงเทพฯ 10240',
    landDeedNumber: 'น.ส.3ก เลขที่ 12345',
    landArea: '100 ตารางวา',
    houseArea: '200 ตารางเมตร',
    salePrice: 8500000,
    depositAmount: 850000,
    transferDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  employment: {
    title: 'สัญญาจ้างงาน',
    state: 'กรุงเทพมหานคร',
    contractDate: new Date().toISOString(),
    employerName: 'บริษัท ABC จำกัด',
    employerAddress: '999 อาคารสาธร ถนนสาทร เขตสาทร กรุงเทพฯ 10120',
    employerTaxId: '0105123456789',
    employeeName: 'นายสมชาย ใจดี',
    employeeIdCard: '1-1234-56789-12-3',
    employeeAddress: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    position: 'Software Engineer',
    department: 'วิศวกรรมซอฟต์แวร์',
    salary: 50000,
    startDate: new Date().toISOString(),
    probationPeriod: 119,
    workingHours: '09:00 - 18:00 น.',
    workingDays: 'จันทร์-ศุกร์',
  },
  testament: {
    title: 'พินัยกรรม',
    state: 'กรุงเทพมหานคร',
    contractDate: new Date().toISOString(),
    testatorName: 'นายสมชาย ใจดี',
    testatorIdCard: '1-1234-56789-12-3',
    testatorAddress: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    beneficiary1Name: 'นางสมหญิง ใจดี',
    beneficiary1Relation: 'ภรรยา',
    beneficiary1Share: 50,
    beneficiary2Name: 'นายสมศักดิ์ ใจดี',
    beneficiary2Relation: 'บุตร',
    beneficiary2Share: 30,
    beneficiary3Name: 'นางสาวสมสุข ใจดี',
    beneficiary3Relation: 'บุตร',
    beneficiary3Share: 20,
    executorName: 'นายสมหวัง ซื่อสัตย์',
    executorIdCard: '5-5555-55555-55-5',
    witness1Name: 'นายพยาน คนที่หนึ่ง',
    witness1IdCard: '6-6666-66666-66-6',
    witness2Name: 'นางสาวพยาน คนที่สอง',
    witness2IdCard: '7-7777-77777-77-7',
  },
};
