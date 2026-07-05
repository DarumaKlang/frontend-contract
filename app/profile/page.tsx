"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';

interface SavedContract {
  id: string;
  title: string;
  created_at?: string;
}

export default function Profile() {
  const { user, logout } = useAuth();
  const [contracts, setContracts] = useState<SavedContract[]>([]);

  useEffect(() => {
    const fetchContracts = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const res = await fetch('/api/contracts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setContracts(data.contracts ?? []);
      }
    };

    fetchContracts();
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
