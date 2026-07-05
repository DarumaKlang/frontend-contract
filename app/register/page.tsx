"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { signUpWithSupabase } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await signUpWithSupabase(email, password);
    if (result.ok) {
      router.push('/profile');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-r from-pink-500 to-rose-600">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white/30 backdrop-blur-lg p-8 shadow-lg"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-gray-800">สมัครสมาชิก</h2>
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
          className="w-full rounded bg-pink-600 px-4 py-2 font-semibold text-white hover:bg-pink-700"
        >
          Register
        </button>
        <p className="mt-4 text-center text-gray-700">
          มีบัญชีอยู่แล้ว?{' '}
          <a href="/login" className="text-pink-800 underline">เข้าสู่ระบบ</a>
        </p>
      </form>
    </section>
  );
}
