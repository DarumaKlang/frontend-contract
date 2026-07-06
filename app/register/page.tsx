"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [billingEmail, setBillingEmail] = useState('');
  const [country, setCountry] = useState('Thailand');
  const [taxId, setTaxId] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [plan, setPlan] = useState('starter');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { signUpWithSupabase } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const result = await signUpWithSupabase(email, password);
    if (result.ok) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await fetch('/api/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            full_name: fullName || email,
            onboarding_completed: true,
            subscription_plan: plan,
            billing_profile: {
              cardholderName,
              billingEmail: billingEmail || email,
              billingAddress,
              country,
              taxId,
              preferredPlan: plan,
              paymentMethodStatus: cardholderName ? 'pending' : 'not-configured',
            },
          }),
        });
      }
      router.push('/profile');
    } else {
      setError(result.error || 'Registration failed');
    }
    setSubmitting(false);
  };

  return (
    <section className="min-h-screen bg-[linear-gradient(135deg,_#fdf2f8_0%,_#f5f3ff_50%,_#eff6ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-[28px] border border-white/70 bg-white/70 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">สมัครสมาชิค</p>
          <h2 className="mt-2 text-3xl font-black text-slate-900">สร้างบัญชีและตั้งค่าข้อมูลการชำระเงิน</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            เราใช้ Stripe สำหรับการรับชำระและจะเก็บข้อมูลทางการเงินในรูปแบบที่ปลอดภัย โดยไม่เก็บข้อมูลบัตรแบบเต็มในเว็บนี้
          </p>
        </div>

        {error && <p className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5 rounded-[24px] border border-slate-200 bg-slate-50/80 p-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">ชื่อ-นามสกุล</span>
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">ชื่อบริษัท / องค์กร</span>
                <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">อีเมล</span>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">เบอร์โทร</span>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-700">
              <span className="mb-2 block">รหัสผ่าน</span>
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
            </label>
          </div>

          <div className="space-y-5 rounded-[24px] border border-slate-200 bg-slate-900 p-5 text-white">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">ข้อมูลทางการเงิน</p>
              <h3 className="mt-2 text-xl font-semibold">ตั้งค่าการชำระผ่าน Stripe</h3>
            </div>

            <label className="block text-sm font-medium text-slate-200">
              <span className="mb-2 block">ชื่อผู้ถือบัตร / ชื่อผู้ชำระ</span>
              <input value={cardholderName} onChange={(e) => setCardholderName(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-400/40" />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              <span className="mb-2 block">อีเมลสำหรับใบแจ้งหนี้</span>
              <input type="email" value={billingEmail} onChange={(e) => setBillingEmail(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-400/40" />
            </label>

            <label className="block text-sm font-medium text-slate-200">
              <span className="mb-2 block">ที่อยู่เรียกเก็บเงิน</span>
              <textarea value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)} rows={3} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-400/40" />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium text-slate-200">
                <span className="mb-2 block">ประเทศ</span>
                <input value={country} onChange={(e) => setCountry(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-400/40" />
              </label>
              <label className="block text-sm font-medium text-slate-200">
                <span className="mb-2 block">เลขผู้เสียภาษี / Tax ID</span>
                <input value={taxId} onChange={(e) => setTaxId(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-400/40" />
              </label>
            </div>

            <label className="block text-sm font-medium text-slate-200">
              <span className="mb-2 block">แพลนสมัคร</span>
              <select value={plan} onChange={(e) => setPlan(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2.5 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-400/40">
                <option value="starter">Starter</option>
                <option value="professional">Professional</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </label>

            <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-sky-500 px-4 py-3 font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-70">
              {submitting ? 'กำลังสร้างบัญชี...' : 'สมัครสมาชิกและบันทึกข้อมูลชำระเงิน'}
            </button>
            <p className="text-xs leading-6 text-slate-400">
              ข้อมูลบัตรจะถูกจัดการผ่าน Stripe โดยเราจะเก็บเฉพาะข้อมูลอ้างอิงและข้อมูลเรียกเก็บเงินเท่านั้น
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}
