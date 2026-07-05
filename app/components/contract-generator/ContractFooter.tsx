import { FileSignature } from 'lucide-react';
import type { TranslateFn } from './types';

interface ContractFooterProps {
  t: TranslateFn;
}

export function ContractFooter({ t }: ContractFooterProps) {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <FileSignature className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-900">
              © 2026 LegaliDraft. <span className="block text-xs font-normal text-slate-400 md:inline">{t('footer-copy')}</span>
            </p>
          </div>
          <div className="flex space-x-6 text-xs font-medium text-slate-500">
            <a href="#" className="transition-colors hover:text-sky-600">{t('footer-home')}</a>
            <a href="#" className="transition-colors hover:text-sky-600">{t('footer-tc')}</a>
            <a href="#" className="transition-colors hover:text-sky-600">{t('footer-privacy')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
