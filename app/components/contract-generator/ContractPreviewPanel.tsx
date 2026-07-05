import { Code, Copy, Download, Eye, FileText } from 'lucide-react';
import type { Language, PreviewFormat, TranslateFn } from './types';

interface ContractPreviewPanelProps {
  appLanguage: Language;
  previewFormat: PreviewFormat;
  setPreviewFormat: (format: PreviewFormat) => void;
  onCopy: () => void;
  onDownload: () => void;
  generatedHtml: string;
  t: TranslateFn;
}

export function ContractPreviewPanel({
  appLanguage,
  previewFormat,
  setPreviewFormat,
  onCopy,
  onDownload,
  generatedHtml,
  t
}: ContractPreviewPanelProps) {
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
            className="flex-1 items-center justify-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-sky-500/10 transition-all hover:bg-sky-700 active:scale-95 sm:flex-initial"
          >
            <Copy className="h-3.5 w-3.5" />
            <span>{t('btn-copy')}</span>
          </button>
          <button
            onClick={onDownload}
            className="flex-1 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-slate-800 active:scale-95 sm:flex-initial"
          >
            <Download className="h-3.5 w-3.5" />
            <span>{t('btn-download')}</span>
          </button>
        </div>
      </div>
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
          <div className="max-h-[500px] overflow-y-auto border-t bg-white p-6 shadow-sm sm:p-10" dangerouslySetInnerHTML={{ __html: generatedHtml }} />
        ) : (
          <textarea readOnly value={generatedHtml} className="block h-[500px] w-full resize-none bg-slate-950 p-4 font-mono text-xs text-emerald-400 outline-none" />
        )}
      </div>
    </div>
  );
}
