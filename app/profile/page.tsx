"use client";

import { useAuth } from '@/lib/auth-context';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">คุณยังไม่ได้เข้าสู่ระบบ</p>
      </section>
    );
  }

  return (
    <section className="flex min-h-screen items-center justify-center bg-gradient-to-r from-emerald-100 to-emerald-200 p-8">
      <div className="rounded-xl bg-white/30 backdrop-blur-lg p-8 text-center shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">โปรไฟล์ของคุณ</h1>
        <p className="mb-2 text-gray-700">อีเมล: <span className="font-medium">{user.email}</span></p>
        <p className="mb-4 text-gray-700">บทบาท: <span className="font-medium">{user.role}</span></p>
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
