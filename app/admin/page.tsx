// app/admin/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

type User = {
  id: string;
  email?: string;
  name?: string;
  active?: boolean;
  role?: string;
};

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [revenue, setRevenue] = useState<any>(null);
  const [loadingRevenue, setLoadingRevenue] = useState(false);
  const [message, setMessage] = useState('');
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('auth_token');
    setAuthToken(token);

    if (!token) {
      setMessage('Admin access requires signing in. Please log in with an admin account.');
      return;
    }

    fetchUsers(token);
    fetchRevenue(token);
  }, []);

  async function fetchUsers(token: string) {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || 'Failed to load users');
        return;
      }
      setUsers(data?.users || []);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load users');
    } finally {
      setLoadingUsers(false);
    }
  }

  async function patchUser(id: string, patch: Record<string, any>) {
    if (!authToken) {
      setMessage('Unable to update user without admin authorization.');
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(patch),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Updated user');
        fetchUsers(authToken);
      } else {
        setMessage(data?.error || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to update user');
    }
  }

  async function deleteUser(id: string) {
    if (!authToken) {
      setMessage('Unable to delete user without admin authorization.');
      return;
    }

    if (!confirm('Delete this user?')) return;
    try {
      const res = await fetch(`/api/admin/users/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('User deleted');
        fetchUsers(authToken);
      } else {
        setMessage(data?.error || 'Delete failed');
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to delete user');
    }
  }

  async function fetchRevenue(tokenOrDays: string | number, days = 30) {
    const token = typeof tokenOrDays === 'string' ? tokenOrDays : authToken;
    if (typeof tokenOrDays === 'number') {
      days = tokenOrDays;
    }

    if (!token) {
      setMessage('Unable to load revenue without admin authorization.');
      return;
    }

    setLoadingRevenue(true);
    try {
      const res = await fetch(`/api/admin/revenue?days=${days}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) setRevenue(data);
      else setMessage(data?.error || 'Failed to fetch revenue');
    } catch (err) {
      console.error(err);
      setMessage('Failed to load revenue');
    } finally {
      setLoadingRevenue(false);
    }
  }

  function exportCsv(rev: any) {
    // Build CSV rows from revenue object – this is simple because backend stores totals only.
    const rows = [
      ['days', 'count', 'total', 'currency'],
      [String(rev.days), String(rev.count), String(rev.total), String(rev.currency)],
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue_${rev.days}d.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const RevenueChart = dynamic(() => import('./components/RevenueChart').then(m => m.RevenueChart), { ssr: false });

  return (
    <main className="mx-auto min-h-screen px-6 py-10 text-slate-900 max-w-6xl">
      <h1 className="text-2xl font-bold mb-4">Admin Console</h1>

      {message && <div className="mb-4 rounded-md bg-amber-50 p-3 text-amber-800">{message}</div>}

      {/* Quick Actions */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/admin/templates'}
            className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-200 rounded-lg hover:border-blue-500 hover:shadow-md transition"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-slate-900">จัดการ Templates</h3>
              <p className="text-sm text-slate-600 mt-1">แก้ไขเทมเพลตเอกสารสัญญา</p>
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/admin'}
            className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-200 rounded-lg hover:border-green-500 hover:shadow-md transition"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-slate-900">จัดการผู้ใช้</h3>
              <p className="text-sm text-slate-600 mt-1">เพิ่ม แก้ไข ลบผู้ใช้</p>
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/admin'}
            className="flex flex-col items-center gap-3 p-6 bg-white border border-slate-200 rounded-lg hover:border-purple-500 hover:shadow-md transition"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-slate-900">รายงานรายได้</h3>
              <p className="text-sm text-slate-600 mt-1">ดูสถิติและรายได้</p>
            </div>
          </button>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">Help & Manual</h2>
        <p className="mt-2 text-slate-700">คู่มือสั้น ๆ สำหรับผู้ดูแลระบบ (ข้อมูลเชิงเทคนิคและขั้นตอนการขยายฟีเจอร์)</p>
        <details className="mt-3 prose">
          <summary className="cursor-pointer font-semibold">เปิดคู่มือ</summary>
          <div>
            <p>หน้า admin เดิมเป็นคู่มือเชิงเทคนิค — ใช้เพื่อดูว่าฟีเจอร์ต่าง ๆ ถูกเก็บไว้ที่ใด</p>
            <ul>
              <li>แก้แบบฟอร์มใน <code>app/components/contract-generator/</code></li>
              <li>จัดการ Stripe ใน <code>app/api/create-checkout-session/route.ts</code></li>
              <li>การยืนยันการชำระเงินระยะยาวควรใช้ Webhook</li>
            </ul>
          </div>
        </details>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold">User Management</h2>
        <div className="mt-3 rounded-md border bg-white p-4">
          {loadingUsers ? (
            <div>Loading users...</div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-slate-600">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-t">
                    <td className="py-2 text-sm">{u.name || '—'}</td>
                    <td className="text-sm">{u.email || '—'}</td>
                    <td className="text-sm">{u.role || 'user'}</td>
                    <td className="text-sm">{u.active ? 'Yes' : 'No'}</td>
                    <td className="text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => patchUser(u.id, { active: !u.active })}
                          className="rounded px-2 py-1 bg-sky-600 text-white text-xs"
                        >
                          {u.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => patchUser(u.id, { role: u.role === 'admin' ? 'user' : 'admin' })}
                          className="rounded px-2 py-1 bg-emerald-600 text-white text-xs"
                        >
                          {u.role === 'admin' ? 'Demote' : 'Promote'}
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="rounded px-2 py-1 bg-rose-600 text-white text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Revenue Summary</h2>
        <div className="mt-3 rounded-md border bg-white p-4">
          <div className="flex items-center gap-3">
            <button onClick={() => fetchRevenue(7)} className="px-3 py-1 rounded bg-slate-100">7d</button>
            <button onClick={() => fetchRevenue(30)} className="px-3 py-1 rounded bg-slate-100">30d</button>
            <button onClick={() => fetchRevenue(90)} className="px-3 py-1 rounded bg-slate-100">90d</button>
          </div>
          <div className="mt-4">
            {loadingRevenue ? (
              <div>Loading revenue…</div>
            ) : revenue ? (
              <div>
                <div className="text-sm text-slate-600">Range: last {revenue.days} days</div>
                <div className="mt-2 text-2xl font-bold">
                  {revenue.count} payments — {(revenue.total / 100).toFixed(2)} {revenue.currency?.toUpperCase()}
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => exportCsv(revenue)}
                    className="rounded bg-slate-800 px-3 py-1 text-white text-sm"
                  >
                    Export CSV
                  </button>
                </div>
                <div className="mt-4">
                  <RevenueChart data={revenue} />
                </div>
              </div>
            ) : (
              <div>No data</div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
