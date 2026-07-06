"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();
  const { signInWithSupabase, signInWithGoogle, signInWithMagicLink } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStatus('');
    const result = await signInWithSupabase(email, password);
    if (result.ok) {
      router.push('/profile');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setStatus('');
    const result = await signInWithGoogle();
    if (!result.ok) {
      setError(result.error || 'Google sign-in failed');
    }
  };

  const handleMagicLink = async () => {
    setError('');
    setStatus('');
    const result = await signInWithMagicLink(email);
    if (result.ok) {
      setStatus(result.message || 'Magic link sent');
    } else {
      setError(result.error || 'Magic link failed');
    }
  };

  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
      >
        <h2 className="mb-6 text-2xl font-bold text-center text-slate-900">เข้าสู่ระบบ</h2>
        {error && <p className="mb-4 text-center text-red-600">{error}</p>}
        {status && <p className="mb-4 text-center text-green-700">{status}</p>}
        <label className="block text-sm font-medium text-gray-700">อีเมล</label>
        <input
          type="email"
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
        <label className="block text-sm font-medium text-gray-700">รหัสผ่าน</label>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-800 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
        />
        <button
          type="submit"
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-800"
        >
          Login
        </button>

        <div className="mt-4 space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Sign in with Google
          </button>
          <button
            type="button"
            onClick={handleMagicLink}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Send magic link
          </button>
        </div>

        <p className="mt-4 text-center text-gray-700">
          ยังไม่มีบัญชี?{' '}
          <a href="/register" className="text-slate-700 underline">
            สมัครใหม่
          </a>
        </p>
      </form>
    </section>
  );
}
