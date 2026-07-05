import { Check, ShieldAlert } from 'lucide-react';
import type { TranslateFn } from './types';

interface ContractSidebarProps {
  currentStep: number;
  onGoToStep: (stepNum: number) => void;
  t: TranslateFn;
}

export function ContractSidebar({ currentStep, onGoToStep, t }: ContractSidebarProps) {
  const steps = [
    { num: 1, title: t('step1-nav-title'), desc: t('step1-nav-desc') },
    { num: 2, title: t('step2-nav-title'), desc: t('step2-nav-desc') },
    { num: 3, title: t('step3-nav-title'), desc: t('step3-nav-desc') },
    { num: 4, title: t('step4-nav-title'), desc: t('step4-nav-desc') }
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24 lg:col-span-4">
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-slate-400">{t('nav-steps-title')}</h3>
      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.num}
            onClick={() => onGoToStep(step.num)}
            className={`flex cursor-pointer items-start gap-4 rounded-xl border p-3 transition-all ${currentStep === step.num ? 'border-sky-100 bg-sky-50' : 'border-transparent hover:bg-slate-50'}`}
          >
            <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold ${currentStep > step.num ? 'bg-emerald-500 text-white' : currentStep === step.num ? 'bg-sky-600 text-white shadow-md shadow-sky-500/20' : 'bg-slate-100 text-slate-500'}`}>
              {currentStep > step.num ? <Check className="h-4 w-4" /> : step.num}
            </span>
            <div>
              <p className={`text-sm font-bold ${currentStep === step.num ? 'text-sky-900' : 'text-slate-700'}`}>{step.title}</p>
              <p className={`mt-0.5 text-xs ${currentStep === step.num ? 'text-sky-600' : 'text-slate-400'}`}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 border-t border-slate-100 pt-6">
        <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4">
          <ShieldAlert className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
          <p className="text-xs leading-relaxed text-slate-500">
            <strong className="text-slate-700">{t('disclaimer-title')}</strong> <span>{t('disclaimer-text')}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
