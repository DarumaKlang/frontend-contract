'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, Eye, ArrowLeft, AlertCircle } from 'lucide-react';
import type { ContractType, TemplateLanguage, TemplateVariable } from '@/lib/types/template';

// Dynamic import Monaco Editor (client-side only)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function NewTemplatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Form state
  const [contractType, setContractType] = useState<ContractType>('lease');
  const [language, setLanguage] = useState<TemplateLanguage>('th');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [templateHtml, setTemplateHtml] = useState(DEFAULT_TEMPLATE_HTML);
  const [templateCss, setTemplateCss] = useState(DEFAULT_TEMPLATE_CSS);
  const [variables, setVariables] = useState<TemplateVariable[]>(DEFAULT_VARIABLES);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  async function handleSave() {
    if (!name.trim()) {
      setError('กรุณาใส่ชื่อ template');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contract_type: contractType,
          language,
          name,
          description,
          template_html: templateHtml,
          template_css: templateCss,
          variables,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/admin/templates/${data.template.id}/edit`);
      } else {
        setError(data.error || 'Failed to create template');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create template');
    } finally {
      setLoading(false);
    }
  }

  async function handlePreview() {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch('/api/admin/templates/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          template_html: templateHtml,
          template_css: templateCss,
          sample_data: SAMPLE_DATA[contractType],
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setPreviewHtml(data.rendered);
        setShowPreview(true);
      } else {
        setError(data.error || 'Preview failed');
      }
    } catch (err: any) {
      setError(err.message || 'Preview failed');
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
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
                <h1 className="text-2xl font-bold text-slate-900">สร้าง Template ใหม่</h1>
                <p className="text-sm text-slate-600">เทมเพลตเอกสารสัญญา</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium transition"
              >
                <Eye size={18} />
                Preview
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50"
              >
                <Save size={18} />
                {loading ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">ข้อมูลพื้นฐาน</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    ชื่อ Template *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="เช่น สัญญาเช่าคอนโดมิเนียม"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    ประเภทสัญญา *
                  </label>
                  <select
                    value={contractType}
                    onChange={(e) => setContractType(e.target.value as ContractType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="lease">สัญญาเช่า</option>
                    <option value="vehicle-sale">ซื้อขายรถยนต์</option>
                    <option value="property-sale">ซื้อขายอสังหาริมทรัพย์</option>
                    <option value="employment">สัญญาจ้างงาน</option>
                    <option value="testament">พินัยกรรม</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    ภาษา *
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as TemplateLanguage)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    <option value="th">ไทย (TH)</option>
                    <option value="en">English (EN)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    คำอธิบาย
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="คำอธิบายเพิ่มเติม..."
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Helper Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 text-sm mb-2">💡 Handlebars Helpers</h3>
              <div className="text-xs text-blue-800 space-y-1">
                <p><code className="bg-blue-100 px-1 py-0.5 rounded">{'{{formatDate date "th"}}'}</code></p>
                <p><code className="bg-blue-100 px-1 py-0.5 rounded">{'{{formatMoney 1000}}'}</code></p>
                <p><code className="bg-blue-100 px-1 py-0.5 rounded">{'{{thaiBahtText 1250}}'}</code></p>
                <p><code className="bg-blue-100 px-1 py-0.5 rounded">{'{{#if value}}...{{/if}}'}</code></p>
              </div>
            </div>
          </div>

          {/* Main Content - Editors */}
          <div className="lg:col-span-2 space-y-6">
            {/* HTML Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h2 className="font-semibold text-slate-900">HTML Template</h2>
                <p className="text-xs text-slate-600 mt-1">ใช้ Handlebars syntax: {'{{variable}}'}</p>
              </div>
              <MonacoEditor
                height="400px"
                language="html"
                value={templateHtml}
                onChange={(value) => setTemplateHtml(value || '')}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  wordWrap: 'on',
                }}
              />
            </div>

            {/* CSS Editor */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                <h2 className="font-semibold text-slate-900">CSS Styles</h2>
                <p className="text-xs text-slate-600 mt-1">สไตล์สำหรับ template (optional)</p>
              </div>
              <MonacoEditor
                height="200px"
                language="css"
                value={templateCss}
                onChange={(value) => setTemplateCss(value || '')}
                theme="vs-light"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto p-6">
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Default templates
const DEFAULT_TEMPLATE_HTML = `<div style="font-family: 'Sarabun', sans-serif; max-width: 800px; margin: 0 auto; padding: 24px;">
  <h1 style="text-align: center; color: #1e40af; margin-bottom: 24px;">
    {{title}}
  </h1>
  
  <p style="line-height: 1.8;">
    สัญญาฉบับนี้ทำขึ้น ณ {{state}} 
    เมื่อวันที่ {{formatDate contractDate "th"}}
  </p>
  
  <h2 style="margin-top: 24px; color: #334155;">ผู้ให้เช่า</h2>
  <p style="line-height: 1.8;">
    ชื่อ: <strong>{{sellerName}}</strong><br>
    ที่อยู่: {{sellerAddress}}
  </p>
  
  <h2 style="margin-top: 24px; color: #334155;">ผู้เช่า</h2>
  <p style="line-height: 1.8;">
    ชื่อ: <strong>{{buyerName}}</strong><br>
    ที่อยู่: {{buyerAddress}}
  </p>
  
  {{#if depositAmount}}
  <p style="margin-top: 24px; padding: 16px; background-color: #f1f5f9; border-left: 4px solid #3b82f6;">
    <strong>ค่ามัดจำ:</strong> {{formatMoney depositAmount}} บาท 
    ({{thaiBahtText depositAmount}})
  </p>
  {{/if}}
</div>`;

const DEFAULT_TEMPLATE_CSS = `h1 {
  font-size: 24px;
  font-weight: bold;
}

h2 {
  font-size: 18px;
  font-weight: 600;
  margin-top: 24px;
}

p {
  line-height: 1.8;
  color: #475569;
}`;

const DEFAULT_VARIABLES: TemplateVariable[] = [
  { name: 'title', type: 'string', description: 'หัวข้อสัญญา', required: true },
  { name: 'state', type: 'string', description: 'สถานที่ทำสัญญา' },
  { name: 'contractDate', type: 'date', description: 'วันที่ทำสัญญา', required: true },
  { name: 'sellerName', type: 'string', description: 'ชื่อผู้ให้เช่า', required: true },
  { name: 'sellerAddress', type: 'string', description: 'ที่อยู่ผู้ให้เช่า' },
  { name: 'buyerName', type: 'string', description: 'ชื่อผู้เช่า', required: true },
  { name: 'buyerAddress', type: 'string', description: 'ที่อยู่ผู้เช่า' },
  { name: 'depositAmount', type: 'number', description: 'ค่ามัดจำ (บาท)' },
];

const SAMPLE_DATA: Record<ContractType, Record<string, any>> = {
  lease: {
    title: 'สัญญาเช่าคอนโดมิเนียม',
    state: 'กรุงเทพมหานคร',
    contractDate: new Date().toISOString(),
    sellerName: 'นายสมชาย ใจดี',
    sellerAddress: '123 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110',
    buyerName: 'นางสมหญิง สบายดี',
    buyerAddress: '456 ถนนพระราม 4 แขวงพระโขนง เขตคลองเตย กรุงเทพฯ 10110',
    depositAmount: 20000,
  },
  'vehicle-sale': {
    title: 'สัญญาซื้อขายรถยนต์',
    state: 'กรุงเทพมหานคร',
    contractDate: new Date().toISOString(),
    sellerName: 'นายสมชาย ใจดี',
    buyerName: 'นางสมหญิง สบายดี',
    depositAmount: 50000,
  },
  'property-sale': {
    title: 'สัญญาซื้อขายอสังหาริมทรัพย์',
    state: 'กรุงเทพมหานคร',
    contractDate: new Date().toISOString(),
    sellerName: 'นายสมชาย ใจดี',
    buyerName: 'นางสมหญิง สบายดี',
    depositAmount: 100000,
  },
  employment: {
    title: 'สัญญาจ้างงาน',
    state: 'กรุงเทพมหานคร',
    contractDate: new Date().toISOString(),
    sellerName: 'บริษัท ABC จำกัด',
    buyerName: 'นายสมชาย ใจดี',
  },
  testament: {
    title: 'พินัยกรรม',
    state: 'กรุงเทพมหานคร',
    contractDate: new Date().toISOString(),
    sellerName: 'นายสมชาย ใจดี',
  },
};
