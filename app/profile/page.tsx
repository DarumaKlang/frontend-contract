"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, Wallet } from 'lucide-react';
import { useAuth, isAdminEmail } from '@/lib/auth-context';

interface SavedContract {
  id: string;
  title: string;
  created_at?: string;
}

interface BillingProfile {
  cardholderName?: string;
  billingEmail?: string;
  billingAddress?: string;
  country?: string;
  taxId?: string;
  preferredPlan?: string;
  stripeCustomerId?: string;
  paymentMethodStatus?: string;
}

interface UserProfile {
  points: number;
  full_name?: string;
  contract_history?: Array<{ title?: string; created_at?: string }>;
  document_links?: Array<{ label?: string; url?: string }>;
  frequent_profile_data?: Record<string, unknown>;
  billing_profile?: BillingProfile;
  onboarding_completed?: boolean;
  subscription_plan?: string;
}

const emptyBillingForm = {
  cardholderName: '',
  billingEmail: '',
  billingAddress: '',
  country: 'Thailand',
  taxId: '',
  preferredPlan: 'starter',
  stripeCustomerId: '',
  paymentMethodStatus: 'pending',
};

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [contracts, setContracts] = useState<SavedContract[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [billingForm, setBillingForm] = useState<BillingProfile>(emptyBillingForm);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      const hasSessionCookie = document.cookie.split(';').some((value) => value.trim().startsWith('frontend_contract_auth='));
      if (!hasSessionCookie) {
        router.replace('/login');
      }
      return;
    }

    const fetchData = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const [contractsRes, profileRes] = await Promise.all([
        fetch('/api/contracts', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (contractsRes.ok) {
        const data = await contractsRes.json();
        setContracts(data.contracts ?? []);
      }

      if (profileRes.ok) {
        const data = await profileRes.json();
        const nextProfile = data.profile ?? null;
        setProfile(nextProfile);
        const storedBilling = (nextProfile?.billing_profile ?? (nextProfile?.frequent_profile_data as Record<string, unknown> | undefined)?.billing_profile ?? {}) as BillingProfile;
        setBillingForm({
          ...emptyBillingForm,
          ...storedBilling,
          preferredPlan: storedBilling.preferredPlan ?? nextProfile?.subscription_plan ?? 'starter',
        });
      }
    };

    fetchData();
  }, [router, user]);

  const saveBillingProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    setSaving(true);
    setMessage('');

    const payload = {
      full_name: profile?.full_name ?? user?.name ?? user?.email,
      onboarding_completed: true,
      subscription_plan: billingForm.preferredPlan ?? 'starter',
      billing_profile: {
        ...billingForm,
        paymentMethodStatus: billingForm.stripeCustomerId ? 'linked' : 'pending',
      },
    };

    const res = await fetch('/api/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      setProfile(data.profile ?? null);
      setMessage('ข้อมูลการชำระเงินถูกบันทึกเรียบร้อยแล้ว');
    } else {
      setMessage('บันทึกข้อมูลไม่สำเร็จ กรุณาลองใหม่');
    }

    setSaving(false);
  };

  if (!user) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">คุณยังไม่ได้เข้าสู่ระบบ</p>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[linear-gradient(135deg,_#f8fafc_0%,_#eef4ff_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <div className="rounded-[30px] border border-white/80 bg-white/70 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-600">โปรไฟล์ของคุณ</p>
              <h1 className="mt-2 text-3xl font-black text-slate-900">จัดการบัญชีและข้อมูลการชำระเงิน</h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                ระบบรองรับการชำระผ่าน Stripe และสามารถบันทึกข้อมูลเรียกเก็บเงินเพื่อให้การสมัครสมาชิกและคำสั่งชำระเป็นไปอย่างเรียบร้อย
              </p>
              {isAdminEmail(user?.email) ? (
                <div className="mt-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                  Admin access enabled
                </div>
              ) : null}
            </div>
            <button onClick={logout} className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800">
              ออกจากระบบ
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-sm text-emerald-700">แต้มสะสม</div>
              <div className="mt-2 text-2xl font-bold text-emerald-900">{profile?.points ?? 0}</div>
            </div>
            <div className="rounded-[24px] border border-sky-200 bg-sky-50 p-4">
              <div className="text-sm text-sky-700">สัญญาที่บันทึก</div>
              <div className="mt-2 text-2xl font-bold text-sky-900">{contracts.length}</div>
            </div>
            <div className="rounded-[24px] border border-amber-200 bg-amber-50 p-4">
              <div className="text-sm text-amber-700">สถานะการสมัคร</div>
              <div className="mt-2 text-xl font-bold text-amber-900">{profile?.onboarding_completed ? 'พร้อมชำระ' : 'ยังไม่เสร็จ'}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[30px] border border-white/80 bg-white/70 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-sky-600" />
              <h2 className="text-xl font-semibold text-slate-900">จัดการบัตร / วิธีชำระ</h2>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              ฟอร์มนี้ใช้สำหรับบันทึกข้อมูลเรียกเก็บเงินและอ้างอิง Stripe ของคุณ โดยจะไม่เก็บเลขบัตรเต็มในฐานข้อมูลของแอป
            </p>

            <form onSubmit={saveBillingProfile} className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">ชื่อผู้ถือบัตร / ผู้ชำระ</span>
                <input value={billingForm.cardholderName ?? ''} onChange={(e) => setBillingForm({ ...billingForm, cardholderName: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">อีเมลสำหรับใบแจ้งหนี้</span>
                <input type="email" value={billingForm.billingEmail ?? ''} onChange={(e) => setBillingForm({ ...billingForm, billingEmail: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                <span className="mb-2 block">ที่อยู่เรียกเก็บเงิน</span>
                <textarea rows={3} value={billingForm.billingAddress ?? ''} onChange={(e) => setBillingForm({ ...billingForm, billingAddress: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  <span className="mb-2 block">ประเทศ</span>
                  <input value={billingForm.country ?? ''} onChange={(e) => setBillingForm({ ...billingForm, country: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  <span className="mb-2 block">เลขผู้เสียภาษี / Tax ID</span>
                  <input value={billingForm.taxId ?? ''} onChange={(e) => setBillingForm({ ...billingForm, taxId: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium text-slate-700">
                  <span className="mb-2 block">แพลนสมัคร</span>
                  <select value={billingForm.preferredPlan ?? 'starter'} onChange={(e) => setBillingForm({ ...billingForm, preferredPlan: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200">
                    <option value="starter">Starter</option>
                    <option value="professional">Professional</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  <span className="mb-2 block">รหัสลูกค้า Stripe (ถ้ามี)</span>
                  <input value={billingForm.stripeCustomerId ?? ''} onChange={(e) => setBillingForm({ ...billingForm, stripeCustomerId: e.target.value })} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200" />
                </label>
              </div>
              <button type="submit" disabled={saving} className="w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-70">
                {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูลชำระเงิน'}
              </button>
              {message ? <p className="rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-700">{message}</p> : null}
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-[30px] border border-white/80 bg-slate-900 p-6 text-white shadow-[0_18px_60px_rgba(15,23,42,0.10)]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-300" />
                <h2 className="text-xl font-semibold">Stripe-ready profile</h2>
              </div>
              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/10 p-4 text-sm leading-7 text-slate-300">
                <p><strong className="text-white">ชื่อ:</strong> {profile?.full_name ?? user.name ?? user.email}</p>
                <p><strong className="text-white">อีเมล:</strong> {user.email}</p>
                <p><strong className="text-white">แพลน:</strong> {billingForm.preferredPlan ?? 'starter'}</p>
                <p><strong className="text-white">สถานะชำระ:</strong> {billingForm.stripeCustomerId ? 'เชื่อม Stripe แล้ว' : 'ยังไม่ได้เชื่อม'}</p>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/80 bg-white/70 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur-2xl">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-600" />
                <h2 className="text-xl font-semibold text-slate-900">สัญญาที่บันทึกไว้</h2>
              </div>
              <div className="mt-4">
                {contracts.length === 0 ? (
                  <p className="text-sm text-slate-600">ยังไม่มีสัญญาที่บันทึกไว้</p>
                ) : (
                  <ul className="space-y-2">
                    {contracts.map((contract) => (
                      <li key={contract.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
                        <div className="font-semibold">{contract.title}</div>
                        <div className="mt-1 text-xs text-slate-500">{contract.created_at ?? 'Saved'}</div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
