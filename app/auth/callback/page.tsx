"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseClient } from '@/lib/supabase';
import { isAdminEmail } from '@/lib/auth-context';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      router.replace('/login');
      return;
    }

    const completeAuth = async () => {
      try {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(window.location.href);
        if (exchangeError && !exchangeError.message?.toLowerCase().includes('no code')) {
          setErrorMessage(exchangeError.message);
          return;
        }

        let sessionData = null;
        let sessionError = null;
        for (let attempt = 0; attempt < 3; attempt += 1) {
          const result = await supabase.auth.getSession();
          sessionData = result.data;
          sessionError = result.error;
          if (sessionData?.session) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        if (sessionError) {
          setErrorMessage(sessionError.message);
          return;
        }

        if (sessionData?.session) {
          const session = sessionData.session;
          const normalizedEmail = session.user.email ?? '';
          const user = {
            id: session.user.id,
            email: normalizedEmail,
            role: isAdminEmail(normalizedEmail) ? 'admin' as const : 'user' as const,
            name: session.user.user_metadata?.full_name ?? session.user.email ?? undefined,
          };
          localStorage.setItem('auth_user', JSON.stringify(user));
          localStorage.setItem('auth_token', session.access_token);
          document.cookie = `frontend_contract_auth=${encodeURIComponent(JSON.stringify({ authenticated: true, email: normalizedEmail, role: user.role, name: user.name ?? null }))}; path=/; max-age=604800; SameSite=Lax`;
          router.replace('/profile');
          return;
        }

        setErrorMessage('No active session was created. Please try again.');
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Google sign-in failed');
      }
    };

    void completeAuth();
  }, [router]);

  return (
    <section className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-lg font-semibold text-slate-800">Finishing sign-in…</p>
        {errorMessage ? <p className="mt-3 text-sm text-red-600">{errorMessage}</p> : null}
      </div>
    </section>
  );
}
