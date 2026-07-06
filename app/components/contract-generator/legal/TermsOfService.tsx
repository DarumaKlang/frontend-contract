'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, ArrowLeft, Moon, Sun } from 'lucide-react';

export default function TermsOfService() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('color-theme') as 'light' | 'dark' | null;
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('color-theme', newTheme);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors duration-200">
      
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6">
          <a className="flex items-center gap-3 group" href="/">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
              Contract-Generator<span className="bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text text-transparent">.com</span>
            </span>
          </a>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <a className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="/privacy-policy">Privacy</a>
              <a className="text-slate-900 dark:text-white font-semibold transition-colors" href="#terms">Terms</a>
              <a className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="/cookies">Cookies</a>
            </div>
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:ring-2 hover:ring-slate-200 dark:hover:ring-slate-700 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </button>

            <a className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors" href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <article className="space-y-8">
          
          {/* Hero Title Block */}
          <div className="mb-12">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/10">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">Terms of Service</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Last updated: January 21, 2026</p>
              </div>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              Welcome to Contract-Generator.com. These Terms of Service govern your access to and use of our AI-powered legal drafting platform. By using our service, you agree to be bound by these terms.
            </p>
          </div>

          {/* Table of Contents */}
          <nav className="mb-12 p-6 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="h-4 w-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Table of Contents
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {[
                { id: 'acceptance', label: '1. Acceptance of Terms' },
                { id: 'description', label: '2. Description of Service' },
                { id: 'accounts', label: '3. User Accounts' },
                { id: 'content-ownership', label: '4. Content Ownership & License' },
                { id: 'acceptable-use', label: '5. Acceptable Use' },
                { id: 'intellectual-property', label: '6. Intellectual Property' },
                { id: 'payment', label: '7. Payment & Subscriptions' },
                { id: 'disclaimers', label: '8. Disclaimers' },
                { id: 'limitation', label: '9. Limitation of Liability' },
                { id: 'indemnification', label: '10. Indemnification' },
                { id: 'termination', label: '11. Termination' },
                { id: 'governing-law', label: '12. Governing Law' },
                { id: 'changes', label: '13. Changes to Terms' },
                { id: 'contact', label: '14. Contact Us' },
              ].map(({ id, label }) => (
                <a key={id} href={`#${id}`} className="flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-500 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors py-1 group">
                  <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                  <span>{label}</span>
                </a>
              ))}
            </div>
          </nav>

          {/* Content Sections - Limited to key sections for brevity */}
          <div className="space-y-16">
            
            <section id="acceptance" className="scroll-mt-24 space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v4a2 2 0 0 0 2 2h4" />
                </svg>
                1. Acceptance of Terms
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">By accessing or using Contract-Generator.com ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Service.</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                <li>You must be at least 18 years old to use this Service.</li>
                <li>If using on behalf of an organization, you represent that you have authority to bind that organization.</li>
                <li>You must be a legal professional or working under the supervision of one.</li>
              </ul>
            </section>

            <section id="description" className="scroll-mt-24 space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v4a2 2 0 0 0 2 2h4" />
                </svg>
                2. Description of Service
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Contract-Generator.com provides an AI-powered platform for legal document drafting, redlining, and analysis. Our Service includes:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                <li><strong>AI-Assisted Drafting:</strong> Generate and edit legal documents with AI assistance.</li>
                <li><strong>Smart Redlining:</strong> Compare document versions and track changes automatically.</li>
                <li><strong>Clause Analysis:</strong> Analyze clauses for potential liabilities and suggest alternatives.</li>
                <li><strong>Template Library:</strong> Access pre-drafted legal templates developed by experienced legal counsels.</li>
                <li><strong>Team Collaboration:</strong> Collaborate with team members or clients in real-time.</li>
              </ul>
              
              <div className="my-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-3">
                  <svg className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17h.01" />
                  </svg>
                  <span><strong>Disclaimer:</strong> Contract-Generator.com is a diagnostic tool for licensed legal professionals. AI-generated content must be reviewed and approved by a qualified attorney before usage.</span>
                </p>
              </div>
            </section>

            <section id="accounts" className="scroll-mt-24 space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                </svg>
                3. User Accounts
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">To use the Service, you must register and secure a workspace account. You agree to:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                <li>Provide accurate, current, and complete registration information.</li>
                <li>Maintain the security and confidentiality of your credentials.</li>
                <li>Notify our support team immediately of unauthorized access.</li>
                <li>Accept responsibility for all account activities.</li>
              </ul>
            </section>

            <section id="payment" className="scroll-mt-24 space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 10h20" />
                </svg>
                7. Payment & Subscriptions
              </h2>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-4">Pricing</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">Subscription plans are displayed on our website. Existing users receive 30-day notice before price changes.</p>
              
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-4">Billing</h3>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                <li>Subscriptions are charged monthly or annually.</li>
                <li>Payments processed via Stripe's encrypted gateways.</li>
                <li>Auto-renewal unless canceled before the billing cycle ends.</li>
              </ul>
              
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mt-4">Refunds</h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">14-day free trial available. After trial, fees are non-refundable unless required by law. Manage subscriptions in Workspace Settings.</p>
            </section>

            <section id="disclaimers" className="scroll-mt-24 space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17h.01" />
                </svg>
                8. Disclaimers
              </h2>
              <p className="text-slate-600 dark:text-slate-300 font-medium">THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND:</p>
              <ul className="list-disc pl-6 space-y-2 text-slate-600 dark:text-slate-300">
                <li>No warranties of merchantability or fitness for purpose.</li>
                <li>No guarantees of accuracy or statutory compliance of AI output.</li>
                <li>No guarantee of uninterrupted service.</li>
              </ul>
            </section>

            <section id="limitation" className="scroll-mt-24 space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v18" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
                </svg>
                9. Limitation of Liability
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">TO THE MAXIMUM EXTENT ALLOWED BY LAW, WE ARE NOT LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES INCLUDING THOSE FROM ATTORNEY ERRORS, ADVERSE DECISIONS, OR DATA CORRUPTION.</p>
              <p className="text-slate-600 dark:text-slate-300">Our total liability is limited to what you paid for the Service in the 12 months preceding any claim.</p>
            </section>

            <section id="contact" className="scroll-mt-24 space-y-4">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                <svg className="h-5 w-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v4a2 2 0 0 0 2 2h4" />
                </svg>
                14. Contact Us
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">For questions about these Terms, contact:</p>
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                <p className="flex items-center gap-3">
                  <strong className="w-20 text-slate-900 dark:text-white">Email:</strong> 
                  <a href="mailto:support@contract-generator.com" className="text-emerald-500 hover:underline">support@contract-generator.com</a>
                </p>
                <p className="flex items-start gap-3">
                  <strong className="w-20 text-slate-900 dark:text-white shrink-0">Address:</strong> 
                  <span>Contract-Generator.com, Inc.<br/>San Francisco, CA, United States</span>
                </p>
              </div>
            </section>

          </div>

        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 mt-20 py-8">
        <div className="mx-auto max-w-4xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <p>&copy; 2026 Contract-Generator.com. All rights reserved.</p>
          <div className="flex gap-4">
            <a className="hover:text-slate-800 dark:hover:text-white transition-colors" href="/privacy-policy">Privacy Policy</a>
            <a className="hover:text-slate-800 dark:hover:text-white transition-colors" href="/terms-of-service">Terms of Service</a>
            <a className="hover:text-slate-800 dark:hover:text-white transition-colors" href="/cookies">Cookie Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
