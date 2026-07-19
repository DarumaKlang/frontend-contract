'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Save, Eye, ArrowLeft, AlertCircle, Trash2, CheckCircle, History } from 'lucide-react';
import type { ContractTemplate, TemplateVariable, ContractType, TemplateLanguage } from '@/lib/types/template';

// Dynamic import Monaco Editor (client-side only)
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

export default function EditTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Template data
  const [template, setTemplate] = useState<ContractTemplate | null>(null);
  
  // Form state
  const [contractType, setContractType] = useState<ContractType>('lease');
  const [language, setLanguage] = useState<TemplateLanguage>('th');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [templateHtml, setTemplateHtml] = useState('');
  const [templateCss, setTemplateCss] = useState('');
  const [variables, setVariables] = useState<TemplateVariable[]>([]);
  const [isDraft, setIsDraft] = useState(true);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setAuthToken(token);
    if (token) {
      fetchTemplate(token);
    }
  }, [templateId]);

  async function fetchTemplate(token: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/templates/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        const tmpl = data.template;
        setTemplate(tmpl);
        setContractType(tmpl.contract_type);
        setLanguage(tmpl.language);
        setName(tmpl.name);
        setDescription(tmpl.description || '');
        setTemplateHtml(tmpl.template_html);
        setTemplateCss(tmpl.template_css || '');
        setVariables(tmpl.variables || []);
        setIsDraft(tmpl.is_draft);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to load template');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load template');
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(saveAsDraft = true) {
    if (!name.trim()) {
      setError('กรุณาใส่ชื่อ template');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name,
          description,
          template_html: templateHtml,
          template_css: templateCss,
          variables,
          is_draft: saveAsDraft,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setTemplate(data.template);
        setIsDraft(data.template.is_draft);
        alert('บันทึกสำเร็จ');
      } else {
        setError(data.error || 'Failed to save template');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!confirm('เผยแพร่ template นี้? ระบบจะปิดการใช้งาน template เวอร์ชันเก่า (ถ้ามี)')) return;

    try {
      const res = await fetch(`/api/admin/templates/${templateId}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ deactivate_previous: true }),
      });

      const data = await res.json();

      if (res.ok) {
        setTemplate(data.template);
        setIsDraft(false);
        alert('เผยแพร่สำเร็จ - template นี้จะถูกใช้งานทันที');
      } else {
        setError(data.error || 'Failed to publish template');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to publish template');
    }
  }

  async function handleUnpublish() {
    if (!confirm('ยกเลิกการเผยแพร่ template นี้?')) return;

    try {
      const res = await fetch(`/api/admin/templates/${templateId}/publish`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setTemplate(data.template);
        alert('ยกเลิกการเผยแพร่สำเร็จ');
      } else {
        setError(data.error || 'Failed to unpublish template');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to unpublish template');
    }
  }

  async function handleDelete() {
    if (template?.is_active) {
      alert('ไม่สามารถลบ template ที่กำลัง active อยู่ได้ กรุณายกเลิกการเผยแพร่ก่อน');
      return;
    }

    if (!confirm(`ลบ template "${name}" ถาวร? การกระทำนี้ไม่สามารถย้อนกลับได้`)) return;

    try {
      const res = await fetch(`/api/admin/templates/${templateId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        alert('ลบสำเร็จ');
        router.push('/admin/templates');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to delete template');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete template');
    }
  }

  async function handlePreview() {
    try {
      const res = await fetch('/api/admin/templates/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
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
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-slate-900">แก้ไข Template</h1>
                  {template?.is_active && (
                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      <CheckCircle size={12} />
                      Active
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600">v{template?.version} • แก้ไขล่าสุด: {template ? new Date(template.updated_at).toLocaleString('th-TH') : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push(`/admin/templates/${templateId}/preview`)}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium transition"
              >
                <Eye size={18} />
                Preview
              </button>
              <button
                onClick={handlePreview}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium transition"
              >
                <Eye size={18} />
                Quick Preview
              </button>
              <button
                onClick={() => handleSave(true)}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg font-medium transition disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'กำลังบันทึก...' : 'บันทึก Draft'}
              </button>
              {template?.is_active ? (
                <button
                  onClick={handleUnpublish}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  ยกเลิกการเผยแพร่
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  <CheckCircle size={18} />
                  เผยแพร่
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={template?.is_active}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                title={template?.is_active ? 'ยกเลิกการเผยแพร่ก่อนลบ' : 'ลบ template'}
              >
                <Trash2 size={18} />
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
                    ประเภทสัญญา
                  </label>
                  <select
                    value={contractType}
                    disabled
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  >
                    <option value="lease">สัญญาเช่า</option>
                    <option value="vehicle-sale">ซื้อขายรถยนต์</option>
                    <option value="property-sale">ซื้อขายอสังหาริมทรัพย์</option>
                    <option value="employment">สัญญาจ้างงาน</option>
                    <option value="testament">พินัยกรรม</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">ประเภทไม่สามารถเปลี่ยนแปลงได้</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    ภาษา
                  </label>
                  <select
                    value={language}
                    disabled
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 cursor-not-allowed"
                  >
                    <option value="th">ไทย (TH)</option>
                    <option value="en">English (EN)</option>
                  </select>
                  <p className="text-xs text-slate-500 mt-1">ภาษาไม่สามารถเปลี่ยนแปลงได้</p>
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

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="font-semibold text-slate-900 mb-4">การจัดการ</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/api/admin/templates/${templateId}/revisions`)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-lg text-sm font-medium transition"
                >
                  <History size={16} />
                  ดูประวัติการแก้ไข
                </button>
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

// Sample data for preview
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
