import { Code, Copy, Download, Eye, FileText, Lock, Database, Zap } from 'lucide-react';
import { sanitizeHtml } from '@/lib/sanitize';
import type { Language, PreviewFormat, TranslateFn } from './types';

interface ContractPreviewPanelProps {
  appLanguage: Language;
  previewFormat: PreviewFormat;
  setPreviewFormat: (format: PreviewFormat) => void;
  onCopy: () => void;
  onDownload: () => void;
  generatedHtml: string;
  t: TranslateFn;
  isLocked?: boolean;
  isLoggedIn?: boolean;
  hasPaid?: boolean;
  templateMetadata?: {
    source: 'database' | 'fallback';
    templateId?: string;
    version?: number;
  } | null;
  templateWarnings?: string[];
  isAdmin?: boolean;
}

export function ContractPreviewPanel({
  appLanguage,
  previewFormat,
  setPreviewFormat,
  onCopy,
  onDownload,
  generatedHtml,
  t,
  isLocked = false,
  isLoggedIn = false,
  hasPaid = false,
  templateMetadata = null,
  templateWarnings = [],
  isAdmin = false
}: ContractPreviewPanelProps) {
  const getLockMessage = (): string => {
    if (!isLoggedIn) return 'Please log in to access this feature';
    if (!hasPaid) return 'Please complete payment to access this feature';
    return '';
  };
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-between gap-3 rounded-2xl bg-slate-100 p-4 sm:flex-row">
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            onClick={() => setPreviewFormat('rich')}
            className={`flex-1 items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition-all sm:flex-initial ${previewFormat === 'rich' ? 'border-slate-200 bg-white text-slate-800 shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>{t('fmt-btn-preview')}</span>
          </button>
          <button
            onClick={() => setPreviewFormat('code')}
            className={`flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all sm:flex-initial ${previewFormat === 'code' ? 'border border-slate-200 bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Code className="h-3.5 w-3.5" />
            <span>{t('fmt-btn-code')}</span>
          </button>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <button
            onClick={onCopy}
            disabled={isLocked}
            title={getLockMessage()}
            className={`flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white shadow-md transition-all sm:flex-initial ${
              isLocked
                ? 'cursor-not-allowed bg-slate-400 shadow-slate-500/10 opacity-60'
                : 'bg-sky-600 shadow-sky-500/10 hover:bg-sky-700 active:scale-95'
            }`}
          >
            {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{isLocked ? 'Locked' : t('btn-copy')}</span>
          </button>
          <button
            onClick={onDownload}
            disabled={isLocked}
            title={getLockMessage()}
            className={`flex-1 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-all sm:flex-initial ${
              isLocked
                ? 'cursor-not-allowed bg-slate-400 opacity-60'
                : 'bg-slate-900 hover:bg-slate-800 active:scale-95'
            }`}
          >
            {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
            <span>{isLocked ? 'Locked' : t('btn-download')}</span>
          </button>
        </div>
      </div>
      {isLocked && (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="font-semibold">
              {!isLoggedIn && 'Please log in to access download and copy features'}
              {isLoggedIn && !hasPaid && 'Please complete payment to access download and copy features'}
            </span>
          </div>
        </div>
      )}
      {isAdmin && templateMetadata && (
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="text-xs font-semibold uppercase text-slate-600">Developer Mode</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {templateMetadata.source === 'database' ? (
                <>
                  <Database className="h-4 w-4 text-sky-600" />
                  <span className="text-sm font-medium text-slate-700">
                    Template Source: <span className="text-sky-600">Database</span>
                  </span>
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-slate-700">
                    Template Source: <span className="text-amber-600">Fallback</span>
                  </span>
                </>
              )}
            </div>
            {templateMetadata.source === 'database' && templateMetadata.templateId && (
              <div className="ml-6 space-y-1 text-xs text-slate-600">
                <div>
                  <span className="font-semibold">Template ID:</span> {templateMetadata.templateId}
                </div>
                {templateMetadata.version && (
                  <div>
                    <span className="font-semibold">Version:</span> {templateMetadata.version}
                  </div>
                )}
              </div>
            )}
            {templateWarnings.length > 0 && (
              <div className="ml-6 space-y-1">
                <div className="text-xs font-semibold text-amber-700">Warnings:</div>
                <ul className="space-y-1">
                  {templateWarnings.map((warning, idx) => (
                    <li key={idx} className="text-xs text-amber-600 pl-3 before:content-['•'] before:mr-2">
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-inner">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-200/60 px-4 py-2.5">
          <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <FileText className="h-3.5 w-3.5 text-slate-500" />
            <span>lease-agreement.html</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold uppercase text-emerald-600">Ready</span>
          </span>
        </div>
        {previewFormat === 'rich' ? (
          <div className="max-h-[500px] overflow-y-auto border-t bg-white p-6 shadow-sm sm:p-10" dangerouslySetInnerHTML={{ __html: sanitizeHtml(generatedHtml) }} />
        ) : (
          <textarea readOnly value={generatedHtml} className="block h-[500px] w-full resize-none bg-slate-950 p-4 font-mono text-xs text-emerald-400 outline-none" />
        )}
      </div>
    </div>
  );
}
