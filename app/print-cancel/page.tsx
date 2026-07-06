'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PrintCancelPage() {
  const [isThai, setIsThai] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedLanguage = window.localStorage.getItem('appLanguage');
    setIsThai(savedLanguage === 'th');
    window.localStorage.setItem('paymentStatus', 'cancel');
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
        <div className="mb-6 rounded-3xl bg-amber-500 px-5 py-4 text-white shadow-sm">
          <h1 className="text-2xl font-bold">{isThai ? 'การชำระเงินถูกยกเลิก' : 'Payment Canceled'}</h1>
          <p className="mt-2 text-sm text-amber-100">
            {isThai
              ? 'การชำระเงินของคุณยังไม่เสร็จสมบูรณ์'
              : 'Your payment was not completed.'}
          </p>
        </div>
        <div className="space-y-4 text-slate-700">
          <p>
            {isThai
              ? 'คุณสามารถลองชำระเงินใหม่หรือกลับไปหน้าสร้างสัญญาเพื่อแก้ไขข้อมูล'
              : 'You can try again or return to the contract generator to continue editing.'}
          </p>
          <p className="text-sm text-slate-500">
            {isThai
              ? 'สถานะการชำระเงินยังไม่ได้บันทึกสำหรับรอบนี้'
              : 'No paid status has been saved for this session.'}
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contract-generator"
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go back to contract generator
          </Link>
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
