"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface SavedContract {
  id: string;
  title: string;
  created_at?: string;
}

interface UserProfile {
  points: number;
  contract_history?: Array<{ title?: string; created_at?: string }>;
  document_links?: Array<{ label?: string; url?: string }>;
  frequent_profile_data?: Record<string, unknown>;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [contracts, setContracts] = useState<SavedContract[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
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
        setProfile(data.profile ?? null);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">คุณยังไม่ได้เข้าสู่ระบบ</p>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-r from-emerald-100 to-emerald-200 p-8">
      <div className="w-full max-w-3xl rounded-xl bg-white/30 backdrop-blur-lg p-8 shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">โปรไฟล์ของคุณ</h1>
        <p className="mb-2 text-gray-700">อีเมล: <span className="font-medium">{user.email}</span></p>
        <p className="mb-4 text-gray-700">บทบาท: <span className="font-medium">{user.role}</span></p>

        <div className="mb-6 grid gap-4 rounded-lg bg-white/70 p-4 text-left md:grid-cols-3">
          <div className="rounded border border-emerald-200 bg-emerald-50 p-3">
            <div className="text-sm text-emerald-700">แต้มสะสม</div>
            <div className="text-2xl font-bold text-emerald-900">{profile?.points ?? 0}</div>
          </div>
          <div className="rounded border border-sky-200 bg-sky-50 p-3">
            <div className="text-sm text-sky-700">สัญญาที่บันทึก</div>
            <div className="text-2xl font-bold text-sky-900">{contracts.length}</div>
          </div>
          <div className="rounded border border-amber-200 bg-amber-50 p-3">
            <div className="text-sm text-amber-700">ลิงก์เอกสาร</div>
            <div className="text-2xl font-bold text-amber-900">{profile?.document_links?.length ?? 0}</div>
          </div>
        </div>

        <div className="mb-6 rounded-lg bg-white/70 p-4 text-left">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">สัญญาที่บันทึกไว้</h2>
            <button
              onClick={async () => {
                const token = localStorage.getItem('auth_token');
                if (!token) return;
                const res = await fetch('/api/seed', {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                  const next = await fetch('/api/contracts', {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  const data = await next.json();
                  setContracts(data.contracts ?? []);
                }
              }}
              className="rounded bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Seed demo contract
            </button>
          </div>
          {contracts.length === 0 ? (
            <p className="text-gray-600">ยังไม่มีสัญญาที่บันทึกไว้</p>
          ) : (
            <ul className="space-y-2">
              {contracts.map((contract) => (
                <li key={contract.id} className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-gray-700">
                  <div className="font-medium">{contract.title}</div>
                  <div className="text-sm text-gray-500">{contract.created_at ?? 'Saved'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-6 rounded-lg bg-white/70 p-4 text-left">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">ประวัติการพิมพ์สัญญา</h2>
          {(profile?.contract_history?.length ?? 0) > 0 ? (
            <ul className="space-y-2">
              {profile?.contract_history?.map((item, index) => (
                <li key={`${item.title ?? 'history'}-${index}`} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-gray-700">
                  <div className="font-medium">{item.title ?? 'Unnamed contract'}</div>
                  <div className="text-sm text-gray-500">{item.created_at ?? 'Saved'}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">ยังไม่มีประวัติการพิมพ์</p>
          )}
        </div>

        <div className="mb-6 rounded-lg bg-white/70 p-4 text-left">
          <h2 className="mb-3 text-xl font-semibold text-gray-800">ข้อมูลที่ใช้บ่อย</h2>
          {profile && Object.keys(profile.frequent_profile_data ?? {}).length > 0 ? (
            <ul className="space-y-2">
              {Object.entries(profile.frequent_profile_data ?? {}).map(([key, value]) => (
                <li key={key} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-gray-700">
                  <div className="font-medium">{key}</div>
                  <div className="text-sm text-gray-500">{String(value)}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">ยังไม่มีข้อมูลที่ใช้บ่อย</p>
          )}
        </div>

        <button
          onClick={logout}
          className="rounded bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
        >
          ออกจากระบบ
        </button>
      </div>
    </section>
  );
}
