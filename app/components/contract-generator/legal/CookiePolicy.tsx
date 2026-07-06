'use client';

import { useState, useEffect } from 'react';

export default function CookiePolicy() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prefFunctional, setPrefFunctional] = useState(true);
  const [prefAnalytics, setPrefAnalytics] = useState(true);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Read theme preference from storage - default to light theme
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }

    // Read user cookie choices
    const savedFunc = localStorage.getItem('cookie_pref_functional');
    if (savedFunc !== null) setPrefFunctional(savedFunc === 'true');

    const savedAnalytic = localStorage.getItem('cookie_pref_analytics');
    if (savedAnalytic !== null) setPrefAnalytics(savedAnalytic === 'true');
  }, []);

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

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie_pref_functional', String(prefFunctional));
    localStorage.setItem('cookie_pref_analytics', String(prefAnalytics));
    setIsModalOpen(false);
    setTimeout(() => {
      triggerToast();
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          
          {/* Logo Brand Link */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-black text-lg shadow-sm group-hover:scale-105 transition-transform">
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                <path d="M12 18V6" />
                <path d="M8 10L12 6L16 10" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white transition-colors">
              LegaliDraft<span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">.com</span>
            </span>
          </a>

          {/* Nav Controls and Theme Button */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden sm:flex items-center gap-5 text-sm font-medium">
              <a href="#privacy" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Privacy</a>
              <a href="#terms" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Terms</a>
              <a href="#" className="text-slate-900 dark:text-white font-semibold transition-colors">Cookies</a>
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

            <a href="#" className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
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
          
          {/* Header Description Header block */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                  <path d="M8.5 8.5v.01" />
                  <path d="M16 15.5v.01" />
                  <path d="M12 12v.01" />
                  <path d="M11 17v.01" />
                  <path d="M7 14v.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Cookie Policy</h1>
                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">Last updated: January 21, 2026</p>
              </div>
            </div>
            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
              This Cookie Policy explains how LegaliDraft.com uses cookies and similar technologies to provide, improve, and protect our AI-powered legal drafting platform.
            </p>
          </div>

          {/* Table of Contents Navigation Index */}
          <nav className="mb-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 transition-colors">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Table of Contents</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a href="#what-are-cookies" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-1 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500"><path d="m9 18 6-6-6-6" /></svg>
                <span>1. What Are Cookies?</span>
              </a>
              <a href="#types-of-cookies" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-1 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500"><path d="m9 18 6-6-6-6" /></svg>
                <span>2. Types of Cookies We Use</span>
              </a>
              <a href="#cookie-table" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-1 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500"><path d="m9 18 6-6-6-6" /></svg>
                <span>3. Specific Cookies</span>
              </a>
              <a href="#managing-cookies" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-1 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500"><path d="m9 18 6-6-6-6" /></svg>
                <span>4. Managing Your Preferences</span>
              </a>
              <a href="#third-party" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-1 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500"><path d="m9 18 6-6-6-6" /></svg>
                <span>5. Third-Party Cookies</span>
              </a>
              <a href="#changes" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-1 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500"><path d="m9 18 6-6-6-6" /></svg>
                <span>6. Updates to This Policy</span>
              </a>
              <a href="#contact" className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors py-1 group">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-500"><path d="m9 18 6-6-6-6" /></svg>
                <span>7. Contact Us</span>
              </a>
            </div>
          </nav>

          {}
          <section id="what-are-cookies" className="scroll-mt-24 mb-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-cyan-500">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5v.01" />
                <path d="M16 15.5v.01" />
                <path d="M12 12v.01" />
                <path d="M11 17v.01" />
                <path d="M7 14v.01" />
              </svg>
              1. What Are Cookies?
            </h2>
            <div className="space-y-4 text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              <p>Cookies are small text files that are stored on your device (computer, tablet, or phone) when you visit a website. They help the website remember your preferences and understand how you interact with the service.</p>
              <p>We use cookies and similar technologies (such as local storage and session storage) to:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>Keep you signed in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our platform</li>
                <li>Improve our features and user experience</li>
                <li>Ensure security of your account</li>
              </ul>
            </div>
          </section>

          {}
          <section id="types-of-cookies" className="scroll-mt-24 mb-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-cyan-500">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              2. Types of Cookies We Use
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
              {/* Essential */}
              <div className="p-5 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-emerald-600 dark:text-emerald-500">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  </svg>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Essential Cookies</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Required for the platform to function. These cannot be disabled.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500"><strong>Examples:</strong> Login sessions, security tokens, CSRF protection</p>
              </div>

              {/* Functional */}
              <div className="p-5 rounded-xl bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-blue-600 dark:text-blue-500">
                    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Functional Cookies</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Remember your preferences and settings for a better experience.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500"><strong>Examples:</strong> Theme preference, sidebar state, language settings</p>
              </div>

              {/* Analytics */}
              <div className="p-5 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 text-amber-600 dark:text-amber-500">
                    <path d="M3 3v16a2 2 0 0 0 2 2h16" />
                    <path d="M18 17V9" />
                    <path d="M13 17V5" />
                    <path d="M8 17v-3" />
                  </svg>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Analytics Cookies</h3>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Help us understand how users interact with our platform.</p>
                <p className="text-xs text-slate-400 dark:text-slate-500"><strong>Examples:</strong> Page views, feature usage, performance metrics</p>
              </div>

              {/* Preference Center Trigger */}
              <div className="p-5 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-cyan-600 dark:text-cyan-400">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M3 20h18L12 4z" />
                    </svg>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Preference Center</h3>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">Configure and view active cookies directly on your device.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 text-left transition-colors flex items-center gap-1.5 mt-2">
                  Open Preferences 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* No Marketing Notice */}
            <div className="my-6 p-4 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
              <p className="text-sm text-slate-600 dark:text-slate-300 flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-emerald-600 dark:text-emerald-500 shrink-0 mt-0.5">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                </svg>
                <span><strong>No Marketing Cookies:</strong> LegaliDraft.com does not use advertising or marketing cookies. We do not track you across other websites or sell your data to advertisers.</span>
              </p>
            </div>
          </section>

          {}
          <section id="cookie-table" className="scroll-mt-24 mb-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 text-cyan-500">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5v.01" />
                <path d="M16 15.5v.01" />
                <path d="M12 12v.01" />
                <path d="M11 17v.01" />
                <path d="M7 14v.01" />
              </svg>
              3. Specific Cookies We Use
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm sm:text-base">Here is a detailed list of cookies used on LegaliDraft.com:</p>
            
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-3.5 font-semibold">Cookie Name</th>
                    <th className="p-3.5 font-semibold">Type</th>
                    <th className="p-3.5 font-semibold">Purpose</th>
                    <th className="p-3.5 font-semibold">Duration</th>
                    <th className="p-3.5 font-semibold">Provider</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-500 dark:text-slate-400">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5"><code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-800 dark:text-slate-200 font-mono">legalidraft_session</code></td>
                    <td className="p-3.5"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">Essential</span></td>
                    <td className="p-3.5 text-xs sm:text-sm">Maintains your login session securely</td>
                    <td className="p-3.5 text-xs sm:text-sm whitespace-nowrap">30 days</td>
                    <td className="p-3.5 text-xs sm:text-sm">LegaliDraft.com</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5"><code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-800 dark:text-slate-200 font-mono">legalidraft_csrf</code></td>
                    <td className="p-3.5"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">Essential</span></td>
                    <td className="p-3.5 text-xs sm:text-sm">Protects against cross-site request forgery attacks</td>
                    <td className="p-3.5 text-xs sm:text-sm">Session</td>
                    <td className="p-3.5 text-xs sm:text-sm">LegaliDraft.com</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5"><code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-800 dark:text-slate-200 font-mono">legalidraft_prefs</code></td>
                    <td className="p-3.5"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20">Functional</span></td>
                    <td className="p-3.5 text-xs sm:text-sm">Stores your UI preferences (theme, sidebar state)</td>
                    <td className="p-3.5 text-xs sm:text-sm">1 year</td>
                    <td className="p-3.5 text-xs sm:text-sm">LegaliDraft.com</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5"><code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-800 dark:text-slate-200 font-mono">_vercel_analytics</code></td>
                    <td className="p-3.5"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">Analytics</span></td>
                    <td className="p-3.5 text-xs sm:text-sm">Measures website performance and usage patterns</td>
                    <td className="p-3.5 text-xs sm:text-sm">1 year</td>
                    <td className="p-3.5 text-xs sm:text-sm">Vercel</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="p-3.5"><code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-800 dark:text-slate-200 font-mono">stripe_*</code></td>
                    <td className="p-3.5"><span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">Essential</span></td>
                    <td className="p-3.5 text-xs sm:text-sm">Enables secure payment processing</td>
                    <td className="p-3.5 text-xs sm:text-sm">Session</td>
                    <td className="p-3.5 text-xs sm:text-sm">Stripe</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {}
          <section id="managing-cookies" className="scroll-mt-24 mb-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-cyan-500">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              4. Managing Your Preferences
            </h2>
            <div className="space-y-4 text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200">Browser Settings</h3>
              <p>Most web browsers allow you to control cookies through their settings. You can:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li>View what cookies are stored on your device</li>
                <li>Delete specific cookies or all cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Block all third-party cookies</li>
              </ul>
              <p>Note that blocking essential cookies will prevent you from using LegaliDraft.com, as they are required for authentication and security.</p>
              
              <h3 className="text-md font-semibold text-slate-800 dark:text-slate-200 mt-6">Browser-Specific Instructions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
                <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-center text-sm font-medium">Chrome</a>
                <a href="https://support.mozilla.org/en-US/kb/cookies" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-center text-sm font-medium">Firefox</a>
                <a href="https://support.apple.com/guide/safari/manage-cookies" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-center text-sm font-medium">Safari</a>
                <a href="https://support.microsoft.com/en-us/microsoft-edge/cookies" target="_blank" rel="noopener noreferrer" className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-center text-sm font-medium">Edge</a>
              </div>
            </div>
          </section>

          {}
          <section id="third-party" className="scroll-mt-24 mb-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 text-cyan-500">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5v.01" />
                <path d="M16 15.5v.01" />
                <path d="M12 12v.01" />
                <path d="M11 17v.01" />
                <path d="M7 14v.01" />
              </svg>
              5. Third-Party Cookies
            </h2>
            <div className="space-y-4 text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              <p>Some cookies are placed by third-party services that appear on our platform:</p>
              <ul className="list-disc list-inside space-y-2 pl-2">
                <li><strong>Vercel Analytics:</strong> Helps us understand platform performance (<a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline">Privacy Policy</a>)</li>
                <li><strong>Stripe:</strong> Processes payments securely (<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline">Privacy Policy</a>)</li>
              </ul>
              <p>We carefully select partners who share our commitment to privacy and security.</p>
            </div>
          </section>

          <section id="changes" className="scroll-mt-24 mb-10">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 text-cyan-500">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5v.01" />
                <path d="M16 15.5v.01" />
                <path d="M12 12v.01" />
                <path d="M11 17v.01" />
                <path d="M7 14v.01" />
              </svg>
              6. Updates to This Policy
            </h2>
            <div className="space-y-4 text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              <p>We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. We will post the updated policy on this page with a new &quot;Last Updated&quot; date.</p>
              <p>For significant changes, we will notify you via email or an in-app message.</p>
            </div>
          </section>

          {}
          <section id="contact" className="scroll-mt-24 mb-6">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-900 dark:text-white mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-5 w-5 text-cyan-500">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              7. Contact Us
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base mb-6">If you have questions about our use of cookies or this policy, please contact us:</p>
            
            <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 dark:from-cyan-500/10 dark:to-emerald-500/10 border border-cyan-500/20">
              <div className="flex items-start gap-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-6 w-6 text-cyan-600 dark:text-cyan-400 shrink-0">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100 mb-0.5">Privacy &amp; Cookie Inquiries</p>
                  <a href="mailto:privacy@legalidraft.com" className="text-cyan-600 dark:text-cyan-400 hover:underline font-medium">privacy@legalidraft.com</a>
                </div>
              </div>
            </div>
          </section>

          {/* Related Policies Block */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Related Policies</h3>
            <div className="flex flex-wrap gap-3">
              <a className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-colors text-sm font-medium text-slate-800 dark:text-slate-200" href="#privacy">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 text-cyan-500">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                </svg>
                Privacy Policy
              </a>
              <a className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/30 dark:hover:border-cyan-500/30 transition-colors text-sm font-medium text-slate-800 dark:text-slate-200" href="#terms">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="h-4 w-4 text-cyan-500">
                  <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                Terms of Service
              </a>
            </div>
          </div>

        </article>
      </main>

      {}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 transition-transform">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <h3 className="font-bold text-slate-900 dark:text-white text-lg">Cookie Preferences</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Manage how your browser handles tracking on LegaliDraft.com. Some required options cannot be disabled.</p>
            
            <div className="space-y-4">
              {/* Necessary */}
              <div className="flex items-start justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Strictly Necessary Cookies</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Essential for platform login, CSRF protection, and basic service functions.</p>
                </div>
                <span className="text-xs text-emerald-600 dark:text-emerald-500 font-bold uppercase select-none shrink-0 mt-1">Always Active</span>
              </div>

              {/* Functional */}
              <div className="flex items-start justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Functional Cookies</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Used for UI personalization like saving theme state and layout configurations.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
                  <input 
                    type="checkbox" 
                    checked={prefFunctional} 
                    onChange={(e) => setPrefFunctional(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              {/* Analytics */}
              <div className="flex items-start justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-sm text-slate-800 dark:text-slate-200">Analytics Cookies</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Helps us aggregate page view metrics and monitor service performance.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
                  <input 
                    type="checkbox" 
                    checked={prefAnalytics} 
                    onChange={(e) => setPrefAnalytics(e.target.checked)} 
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-slate-200 dark:bg-slate-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
              <button onClick={() => setIsModalOpen(false)} className="text-sm font-medium px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-950 transition-all">
                Cancel
              </button>
              <button onClick={savePreferences} className="text-sm font-bold px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-md hover:opacity-90 transition-all">
                Save Choices
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700/50 dark:border-slate-200/50 transition-all duration-300 max-w-sm animate-bounce">
          <div className="p-1 rounded-full bg-emerald-500/15 text-emerald-500 shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm font-semibold">Preferences successfully updated!</span>
        </div>
      )}

      {/* Footer Area */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-100/40 dark:bg-slate-950/40 py-8 transition-colors duration-300 mt-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#privacy">Privacy Policy</a>
              <span className="text-slate-200 dark:text-slate-800">•</span>
              <a className="hover:text-slate-900 dark:hover:text-white transition-colors" href="#terms">Terms of Service</a>
            </div>
            <div>
              <span>© 2026 LegaliDraft.com. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}