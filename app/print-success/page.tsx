'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function PrintSuccessPage() {
  const [updated, setUpdated] = useState(false);
  const [isThai, setIsThai] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedLanguage = window.localStorage.getItem('appLanguage');
    const thai = savedLanguage === 'th';
    setIsThai(thai);
    window.localStorage.setItem('paid', 'true');
    window.localStorage.setItem('paymentStatus', 'success');
    setUpdated(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-xl">
        <div className="mb-6 rounded-3xl bg-emerald-600 px-5 py-4 text-white shadow-sm">
          <h1 className="text-2xl font-bold">{isThai ? 'ชำระเงินสำเร็จ' : 'Payment Successful'}</h1>
          <p className="mt-2 text-sm text-emerald-100">
            {isThai
              ? 'ขอบคุณ คุณได้ชำระเงินเรียบร้อยแล้ว'
              : 'Thank you, your payment was completed successfully.'}
          </p>
        </div>
        <div className="space-y-4 text-slate-700">
          <p>
            {isThai
              ? 'หน้านี้ได้บันทึกสถานะการชำระเงินไว้ในเครื่อง หากคุณกลับไปที่หน้าสร้างสัญญา ฟีเจอร์ดาวน์โหลดและคัดลอกจะพร้อมใช้งาน'
              : 'This page has recorded your paid status locally so the contract download and copy features can be unlocked.'}
          </p>
          <p className="text-sm text-slate-500">
            {isThai
              ? 'ถ้าไม่เห็นการปลดล็อกหลังกลับมา โปรดรีเฟรชหน้าสร้างสัญญา'
              : 'If you do not see unlocked access after returning, refresh the contract page.'}
          </p>
          <p className="text-sm text-slate-500">
            {isThai ? 'บันทึกสถานะการชำระเงิน: ' : 'Paid status saved: '}
            <strong>{updated ? (isThai ? 'ใช่' : 'Yes') : (isThai ? 'กำลังบันทึก...' : 'Saving...')}</strong>
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/contract-generator"
            className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {isThai ? 'กลับไปหน้าสร้างสัญญา' : 'Return to contract generator'}
          </Link>
          <Link
            href="/"
            className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
