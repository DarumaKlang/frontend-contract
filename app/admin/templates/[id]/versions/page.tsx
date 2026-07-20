'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import type { ContractTemplate } from '@/lib/types/template';
import { TemplateVersionComparison } from '@/app/components/admin/template-version-comparison';

export default function TemplateVersionsPage() {
  const router = useRouter();
  const params = useParams();
  const templateId = params.id as string;

  const [template, setTemplate] = useState<ContractTemplate | null>(null);
  const [versions, setVersions] = useState<ContractTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rollbackInProgress, setRollbackInProgress] = useState(false);
  const [rollbackSuccess, setRollbackSuccess] = useState(false);
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    setAuthToken(token);
    if (token) {
      fetchTemplate(token);
    }
  }, []);

  async function fetchTemplate(token: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/templates/${templateId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setTemplate(data.template);
        await fetchVersions(data.template.contract_type, data.template.language, token);
      } else {
        setError('Failed to fetch template');
      }
    } catch (err) {
      setError('Failed to fetch template');
      console.error('Fetch template error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchVersions(
    contractType: string,
    language: string,
    token: string
  ) {
    try {
      const params = new URLSearchParams({
        contract_type: contractType,
        language: language,
      });

      const res = await fetch(`/api/admin/templates/versions?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setVersions(data.versions || []);
      }
    } catch (err) {
      console.error('Fetch versions error:', err);
    }
  }

  async function handleRollback(versionId: string) {
    if (
      !confirm(
        'Are you sure you want to activate this version? The current active version will be deactivated.'
      )
    ) {
      return;
    }

    if (!authToken) {
      setError('Not authenticated');
      return;
    }

    setRollbackInProgress(true);
    setRollbackSuccess(false);

    try {
      const res = await fetch(`/api/admin/templates/${versionId}/publish`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deactivate_previous: true }),
      });

      if (res.ok) {
        setRollbackSuccess(true);
        // Refresh templates
        if (template && authToken) {
          await fetchVersions(template.contract_type, template.language, authToken);
          await fetchTemplate(authToken);
        }
        setTimeout(() => setRollbackSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to activate version');
      }
    } catch (err) {
      setError('Failed to activate version');
      console.error('Rollback error:', err);
    } finally {
      setRollbackInProgress(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Loading versions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
            <p className="text-slate-600 mb-4">Template not found</p>
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Go back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-100 rounded-lg transition"
              >
                <ArrowLeft size={24} className="text-slate-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{template.name}</h1>
                <p className="text-slate-600 mt-1">Version Management & Comparison</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Success Message */}
        {rollbackSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-semibold text-green-900">Success</h3>
              <p className="text-green-700 text-sm mt-1">Version activated successfully</p>
            </div>
          </div>
        )}

        {/* Template Info */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-slate-500">Contract Type</p>
              <p className="font-semibold text-slate-900 mt-1">{template.contract_type}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Language</p>
              <p className="font-semibold text-slate-900 mt-1 uppercase">{template.language}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Current Version</p>
              <p className="font-semibold text-slate-900 mt-1">v{template.version}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Status</p>
              <p className="font-semibold text-slate-900 mt-1">
                {template.is_active ? (
                  <span className="text-green-600">Active</span>
                ) : template.is_draft ? (
                  <span className="text-amber-600">Draft</span>
                ) : (
                  <span className="text-slate-600">Inactive</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Version Comparison Component */}
        <TemplateVersionComparison
          versions={versions}
          currentVersion={template}
        />

        {/* Rollback Actions */}
        {versions.length > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mt-8">
            <h3 className="font-semibold text-slate-900 mb-4">Activate Version</h3>
            <p className="text-slate-600 mb-4 text-sm">
              Click on a version below and use the "Compare" button to activate it. 
              The currently active version will be deactivated automatically.
            </p>
            <div className="space-y-2">
              {versions
                .filter((v) => !v.is_active)
                .slice(0, 5)
                .map((version) => (
                  <div
                    key={version.id}
                    className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                  >
                    <div>
                      <span className="font-mono font-semibold text-slate-900">
                        v{version.version}
                      </span>
                      <span className="text-slate-500 ml-2">
                        • Updated {new Date(version.updated_at).toLocaleDateString('th-TH')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRollback(version.id)}
                      disabled={rollbackInProgress}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white text-sm font-medium rounded-lg transition"
                    >
                      {rollbackInProgress ? 'Activating...' : 'Activate'}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
