'use client';

import { useState } from 'react';

export default function PrivacyPolicy() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          
          {/* Logo Brand Link */}
          <a href="/" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                <path d="M12 18V6" />
                <path d="M8 10L12 6L16 10" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
              Contract Generator
            </span>
          </a>

          {/* Nav Controls and Theme Button */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-5 text-sm font-medium">
              <a href="#privacy" className="text-slate-900 dark:text-white font-semibold transition-colors">Privacy</a>
              <a href="/terms-of-service" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
              <a href="/cookies" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Cookies</a>
            </div>
            
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all text-slate-600 dark:text-slate-300"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m2.828 0l-.707-.707m12.728-12.728l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              )}
            </button>

            <a href="/" className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                <path d="m12 19-7-7 7-7" />
                <path d="M19 12H5" />
              </svg>
              <span className="hidden sm:inline">Back to Home</span>
            </a>
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <article className="bg-white dark:bg-slate-900/60 p-6 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
          
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Privacy Policy</h1>
                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">Last updated: July 6, 2026</p>
              </div>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              This Privacy Policy explains how Contract Generator collects, uses, and protects your personal information when you use our platform.
            </p>
          </div>

          <section id="privacy" className="scroll-mt-24 mb-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-cyan-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              1. Information We Collect
            </h2>
            <div className="space-y-4 text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              <p><strong>Account Information:</strong> Email, name, and profile details when you register.</p>
              <p><strong>Contract Data:</strong> Content you create within the generator (stored securely).</p>
              <p><strong>Usage Data:</strong> Page views, features used, and time spent (via analytics).</p>
              <p><strong>Device Information:</strong> Browser type, IP address, and operating system.</p>
            </div>
          </section>

          <section className="scroll-mt-24 mb-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-cyan-500">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              2. How We Use Your Information
            </h2>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              <li>✓ Provide and improve the Contract Generator service</li>
              <li>✓ Send account and security notifications</li>
              <li>✓ Analyze service usage to enhance features</li>
              <li>✓ Comply with legal obligations</li>
              <li>✓ Prevent fraud and unauthorized access</li>
            </ul>
          </section>

          <section className="scroll-mt-24 mb-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-cyan-500">
                <path d="M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10" />
                <path d="M12 6v6l4 2" />
              </svg>
              3. Data Retention
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              We retain your information as long as your account is active. You can request deletion of your data at any time by contacting our privacy team.
            </p>
          </section>

          <section className="scroll-mt-24 mb-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-cyan-500">
                <path d="M12 2v20M2 12h20" />
              </svg>
              4. Your Rights
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mb-3">Depending on your location, you may have the right to:</p>
            <ul className="space-y-2 text-slate-500 dark:text-slate-400 text-sm sm:text-base">
              <li>• Access your personal data</li>
              <li>• Request correction of inaccurate data</li>
              <li>• Request deletion of your data</li>
              <li>• Opt-out of promotional communications</li>
            </ul>
          </section>

          <section className="scroll-mt-24 mb-12">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-cyan-500">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              5. Contact Us
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mb-6">
              For privacy inquiries, contact:
            </p>
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 dark:from-cyan-500/10 dark:to-emerald-500/10 border border-cyan-500/20">
              <div className="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-cyan-600 dark:text-cyan-400 shrink-0">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mb-0.5">Privacy &amp; Data Inquiries</p>
                  <a href="mailto:privacy@contract-generator.com" className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium">privacy@contract-generator.com</a>
                </div>
              </div>
            </div>
          </section>

          {/* Related Policies Block */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-3">
              <a className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-colors text-sm font-medium text-slate-800 dark:text-slate-200" href="/cookies">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-cyan-500">
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                </svg>
                Cookie Policy
              </a>
              <a className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-colors text-sm font-medium text-slate-800 dark:text-slate-200" href="/terms-of-service">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-cyan-500">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Terms of Service
              </a>
            </div>
          </div>

        </article>
      </main>

      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950/40 py-8 transition-colors duration-300 mt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#privacy">Privacy Policy</a>
              <span className="text-slate-200 dark:text-slate-800">•</span>
              <a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="/terms-of-service">Terms of Service</a>
            </div>
            <div>
              <span>© 2026 Contract Generator. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
