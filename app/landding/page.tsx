"use client";

import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function Landding() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-100 to-white dark:from-gray-900 dark:to-black p-8">
      <h1 className="mb-4 text-5xl font-extrabold text-indigo-800 dark:text-indigo-200">
        Next‑Fontend
      </h1>
      <p className="mb-8 text-xl text-gray-700 dark:text-gray-300">
        ตัวอย่าง UI สวยงามพร้อมระบบ Auth เบื้องต้น
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="rounded bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-700"
        >
          เข้าสู่ระบบ
        </Link>
        <Link
          href="/register"
          className="rounded bg-gray-600 px-6 py-3 text-white hover:bg-gray-700"
        >
          สมัครสมาชิก
        </Link>
      </div>
    </section>
  );
}
