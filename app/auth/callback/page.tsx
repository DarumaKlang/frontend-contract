"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      router.replace('/login');
      return;
    }

    const completeAuth = async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href);
      } catch {
        // no-op; continue to session check
      }

      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const session = data.session;
        const user = {
          id: session.user.id,
          email: session.user.email ?? '',
          role: 'user' as const,
          name: session.user.user_metadata?.full_name ?? session.user.email ?? undefined,
        };
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_token', session.access_token);
      }

      router.replace('/profile');
    };

    void completeAuth();
  }, [router]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-slate-100">
      <p className="text-lg text-slate-700">Finishing sign-in…</p>
    </section>
  );
}
