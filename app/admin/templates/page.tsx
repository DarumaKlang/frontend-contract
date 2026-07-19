'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, Search, Filter, Edit2, Trash2, Eye, CheckCircle, Circle, Clock } from 'lucide-react';
import type { TemplateListItem, ContractType, TemplateLanguage } from '@/lib/types/template';

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<ContractType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft'>('all');
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setAuthToken(token);
    if (token) {
      fetchTemplates(token);
    }
  }, [filterType, filterStatus]);

  async function fetchTemplates(token: string) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterType !== 'all') params.set('contract_type', filterType);
      if (filterStatus === 'active') params.set('is_active', 'true');
      if (filterStatus === 'draft') params.set('is_draft', 'true');

      const res = await fetch(`/api/admin/templates?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteTemplate(id: string, name: string) {
    if (!confirm(`ลบ template "${name}" ใช่หรือไม่?`)) return;
    
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (res.ok) {
        setTemplates(templates.filter(t => t.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete template');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete template');
    }
  }

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const contractTypes: { value: ContractType | 'all'; label: string }[] = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'lease', label: 'สัญญาเช่า' },
    { value: 'vehicle-sale', label: 'ซื้อขายรถยนต์' },
    { value: 'property-sale', label: 'ซื้อขายอสังหาริมทรัพย์' },
    { value: 'employment', label: 'สัญญาจ้างงาน' },
    { value: 'testament', label: 'พินัยกรรม' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Template Management</h1>
              <p className="text-slate-600 mt-1">จัดการเทมเพลตเอกสารสัญญา</p>
            </div>
            <button
              onClick={() => router.push('/admin/templates/new')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
            >
              <Plus size={20} />
              สร้าง Template ใหม่
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="ค้นหา template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              {contractTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="all">สถานะทั้งหมด</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* Templates Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">กำลังโหลด...</p>
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
            <FileText className="mx-auto text-slate-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">ไม่พบ Template</h3>
            <p className="text-slate-500 mb-6">เริ่มต้นโดยการสร้าง template แรกของคุณ</p>
            <button
              onClick={() => router.push('/admin/templates/new')}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              <Plus size={20} />
              สร้าง Template ใหม่
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition overflow-hidden"
              >
                {/* Card Header */}
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900 text-lg flex-1">{template.name}</h3>
                    {template.is_active ? (
                      <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        <CheckCircle size={12} />
                        Active
                      </span>
                    ) : template.is_draft ? (
                      <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                        <Clock size={12} />
                        Draft
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                        <Circle size={12} />
                        Inactive
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {contractTypes.find(t => t.value === template.contract_type)?.label}
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs">v{template.version}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-xs uppercase">{template.language}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <p className="text-sm text-slate-500 mb-4">
                    แก้ไขล่าสุด: {new Date(template.updated_at).toLocaleDateString('th-TH')}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/templates/${template.id}/edit`)}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition"
                    >
                      <Edit2 size={16} />
                      แก้ไข
                    </button>
                    <button
                      onClick={() => router.push(`/admin/templates/${template.id}/preview`)}
                      className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium transition"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => deleteTemplate(template.id, template.name)}
                      className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm font-medium transition"
                      disabled={template.is_active}
                      title={template.is_active ? 'ไม่สามารถลบ template ที่ active อยู่' : 'ลบ template'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
