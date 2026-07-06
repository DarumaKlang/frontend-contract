'use client';
import { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { ArrowLeft, ArrowRight, Lock, PartyPopper, Scale } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { ContractFooter } from './components/contract-generator/ContractFooter';
import { ContractHeader } from './components/contract-generator/ContractHeader';
import { ContractPreviewPanel } from './components/contract-generator/ContractPreviewPanel';
import { ContractSidebar } from './components/contract-generator/ContractSidebar';
import { ContractStepContent } from './components/contract-generator/ContractStepContent';
import { ContractToastStack } from './components/contract-generator/ContractToastStack';
import { useWizard } from './components/contract-generator/hooks/useWizard';

export default function PageNew() {
  const { user } = useAuth();
  const {
    appLanguage,
    setAppLanguage,
    currentStep,
    previewFormat,
    setPreviewFormat,
    toasts,
    formData,
    handleFormChange,
    handleNext,
    handlePrev,
    handleGoToStep,
    handleQuickFill,
    handleCopy,
    handleDownload,
    t,
    getGeneratedHtml,
    contractType,
    setContractType,
  } = useWizard();

  const generatedHtml = getGeneratedHtml();

  const [hasPaid, setHasPaid] = useState<boolean>(false);
  const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

  // Check if user can access download/copy features
  const isLoggedIn = !!user;
  const canAccessFeatures = isLoggedIn && hasPaid;

  useEffect(() => {
    // Disable right‑click context menu
    const blockContext = (e: MouseEvent) => e.preventDefault();
    document.addEventListener('contextmenu', blockContext);
    // Check payment flag from localStorage
    if (localStorage.getItem('paid') === 'true') {
      setHasPaid(true);
    }
    return () => {
      document.removeEventListener('contextmenu', blockContext);
    };
  }, []);

  const handlePay = async () => {
    if (!stripePromise) {
      alert('Stripe is not configured. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.');
      return;
    }

    const res = await fetch('/api/create-checkout-session', { method: 'POST' });
    const data = await res.json();
    if (!res.ok) {
      alert(data?.error || 'Failed to create checkout session.');
      return;
    }

    const stripe = await stripePromise as any;
    if (stripe && data.sessionId) {
      await stripe.redirectToCheckout({ sessionId: data.sessionId });
    } else {
      alert('Stripe checkout could not be initialized.');
    }
  };

  const handlePrint = () => {
    if (hasPaid) {
      window.print();
    } else {
      alert('Please complete payment before printing.');
    }
  };

  const handleSecureCopy = () => {
    if (!isLoggedIn) {
      alert('Please log in to copy the contract.');
      return;
    }
    if (!hasPaid) {
      alert('Please complete payment to copy the contract.');
      return;
    }
    handleCopy();
  };

  const handleSecureDownload = () => {
    if (!isLoggedIn) {
      alert('Please log in to download the contract.');
      return;
    }
    if (!hasPaid) {
      alert('Please complete payment to download the contract.');
      return;
    }
    handleDownload();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      <ContractToastStack toasts={toasts} />
      <ContractHeader appLanguage={appLanguage} setAppLanguage={setAppLanguage} onQuickFill={handleQuickFill} t={t} contractType={contractType} setContractType={setContractType} />

      <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="mb-3 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-sky-700">
            {t('badge-main')}
          </span>
          <h1 className="mb-3 text-3xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            {t('heading-main')}
          </h1>
          <p className="text-base text-slate-500 sm:text-lg">{t('subheading-main')}</p>
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <ContractSidebar currentStep={currentStep} onGoToStep={handleGoToStep} t={t} />

          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 bg-slate-950 p-6 text-white sm:flex-row sm:items-center sm:p-8">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold sm:text-xl">
                    <span className="rounded-md bg-sky-600 px-2 py-0.5 text-xs font-semibold">
                      {appLanguage === 'th' ? `ขั้นตอน ${currentStep}` : `Step ${currentStep}`}
                    </span>
                    <span>{t(`step${currentStep}-header-title`)}</span>
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">{t(`step${currentStep}-header-desc`)}</p>
                </div>
                <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-1.5">
                  <Scale className="h-4 w-4 text-sky-400" />
                  <span className="text-xs font-bold text-slate-200">
                    {appLanguage === 'th' ? 'สัญญาแพ่ง' : 'Civil Contract Draft'}
                  </span>
                </div>
              </div>

              <ContractStepContent
                currentStep={currentStep}
                appLanguage={appLanguage}
                formData={formData}
                onFormChange={handleFormChange}
                t={t}
                contractType={contractType}
                formatMoney={(amount) =>
                  new Intl.NumberFormat(appLanguage === 'th' ? 'th-TH' : 'en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format(amount)
                }
              />

              {currentStep === 4 && (
                <div className="p-6 sm:p-8">
                  <ContractPreviewPanel
                    appLanguage={appLanguage}
                    previewFormat={previewFormat}
                    setPreviewFormat={setPreviewFormat}
                    onCopy={handleSecureCopy}
                    onDownload={handleSecureDownload}
                    generatedHtml={generatedHtml}
                    t={t}
                    isLocked={!canAccessFeatures}
                    isLoggedIn={isLoggedIn}
                    hasPaid={hasPaid}
                  />
                </div>
              )}

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
                <button
                  onClick={handlePrev}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-600 transition-all ${currentStep === 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-slate-50'}`}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t('btn-prev')}</span>
                </button>
                <div className="flex items-center gap-2">
                  {currentStep < 4 ? (
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-sky-700"
                    >
                      <span>{t('btn-next')}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : hasPaid ? (
                    <button
                      onClick={handlePrint}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-700"
                    >
                      <span>Print</span>
                    </button>
                  ) : (
                    <button
                      onClick={handlePay}
                      className="flex items-center gap-1.5 rounded-xl bg-sky-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-sky-700"
                    >
                      <span>Pay to Print</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ContractFooter t={t} />
    </div>
  );
}
