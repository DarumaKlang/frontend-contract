import { FileSignature, Sparkles } from 'lucide-react';
import type { Language, TranslateFn } from './types';

interface ContractHeaderProps {
  appLanguage: Language;
  setAppLanguage: (language: Language) => void;
  onQuickFill: () => void;
  t: TranslateFn;
}

export function ContractHeader({ appLanguage, setAppLanguage, onQuickFill, t }: ContractHeaderProps) {
  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3">
          <div className="rounded-xl bg-sky-600 p-2.5 text-white shadow-md shadow-sky-500/20">
            <FileSignature className="h-6 w-6" />
          </div>
          <div>
            <span className="flex items-center gap-1.5 text-xl font-extrabold tracking-tight text-slate-900">
              Legali<span className="text-sky-600">Draft</span>
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wide text-slate-400">Lease Agreement Generator</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="flex items-center rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setAppLanguage('th')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${appLanguage === 'th' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              TH (ไทย)
            </button>
            <button
              onClick={() => setAppLanguage('en')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${appLanguage === 'en' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              EN (English)
            </button>
          </div>
          <button
            onClick={onQuickFill}
            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:bg-slate-800 active:scale-95"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>{t('btn-quick-fill')}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
