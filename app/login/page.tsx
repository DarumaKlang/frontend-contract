"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      login(email, 'user', data.user ?? null, data.token ?? null);
      router.push('/profile');
    } else {
      setError(data.error || 'Login failed');
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white/30 backdrop-blur-lg p-8 shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">เข้าสู่ระบบ</h2>
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        <label className="block text-sm font-medium text-gray-700">อีเมล</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-4 w-full rounded border bg-white/70 p-2"
        />
        <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-6 w-full rounded border bg-white/70 p-2"
        />
        <button
          type="submit"
          className="w-full rounded bg-indigo-600 px-4 py-2 font-semibold text-white hover:bg-indigo-700"
        >
          Login
        </button>
        <p className="mt-4 text-center text-gray-700">
          ยังไม่มีบัญชี?{' '}
          <a href="/register" className="text-indigo-800 underline">
            สมัครใหม่
          </a>
        </p>
      </form>
    </section>
  );
}
