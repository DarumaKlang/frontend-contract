'use client';

import { useState, useEffect } from 'react';

interface Toast {
  show: boolean;
  message: string;
}

export default function About() {
  const [toast, setToast] = useState<Toast>({ show: false, message: '' });
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [isHoveredStat, setIsHoveredStat] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-teal-500/10 selection:text-teal-600">
      
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a 
            className="flex items-center gap-3 group" 
            href="#home" 
            onClick={(e) => { 
              e.preventDefault(); 
              triggerToast('Already on About page.'); 
            }}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#00C897] to-[#06b6d4] flex items-center justify-center shadow-md shadow-teal-500/10 group-hover:scale-105 transition-transform duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M14.5 17.5 3 6V3h3l11.5 11.5"></path>
                <path d="M13 19a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1Z"></path>
                <path d="M19 9a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v2a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1Z"></path>
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Contract Generator
            </span>
          </a>
          
          <button 
            onClick={() => triggerToast('Redirecting to Home/Dashboard...')} 
            className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all hover:bg-slate-100 text-slate-600 hover:text-slate-950 h-9 rounded-lg px-4 gap-2 border border-slate-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="m12 19-7-7 7-7"></path>
              <path d="M19 12H5"></path>
            </svg>
            Back
          </button>
        </div>
      </nav>

      <section className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/60">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,200,151,0.06),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(6,182,212,0.04),transparent_40%)]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/50 mb-6 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#00C897] animate-pulse"></span>
              Our Mission
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-950">
              Making Legal Work <span className="bg-gradient-to-r from-[#00C897] to-[#06b6d4] bg-clip-text text-transparent">Smarter</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-600 sm:text-xl max-w-2xl mx-auto">
              We're on a mission to empower legal professionals with AI that understands the law, respects your expertise, and helps you deliver better outcomes for your clients.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Why We Built Contract Generator
              </h2>
              <div className="mt-6 space-y-6 text-slate-600 leading-relaxed text-base">
                <p>
                  After years of watching lawyers spend countless hours on repetitive drafting tasks, we knew there had to be a better way. The legal industry was ripe for transformation, but existing tools either didn't understand legal language or treated AI as a replacement rather than an assistant.
                </p>
                <p>
                  Contract Generator was born from a simple belief: <strong className="text-slate-900 font-semibold">AI should amplify human expertise, not replace it.</strong> We built a platform that understands the nuances of legal writing, respects the attorney-client relationship, and gives professionals the tools to work smarter—not harder.
                </p>
                <p>
                  Today, we're proud to serve forward-thinking law firms who share our vision of a more efficient, accessible legal system.
                </p>
              </div>
            </div>
            
            <div 
              className="relative group cursor-pointer"
              onMouseEnter={() => setIsHoveredStat(true)}
              onMouseLeave={() => setIsHoveredStat(false)}
            >
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#00C897] to-[#06b6d4] opacity-10 blur-xl group-hover:opacity-20 transition duration-500"></div>
              <div className="relative aspect-square rounded-3xl border border-slate-200/80 bg-slate-50/50 p-8 flex flex-col justify-center items-center shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#00C897] to-[#06b6d4] text-white shadow-lg shadow-teal-500/20 transform transition-transform duration-500 ${isHoveredStat ? 'scale-110 rotate-12' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-zap">
                      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
                    </svg>
                  </div>
                  <div className="text-6xl font-extrabold text-slate-900 tracking-tight">5+</div>
                  <div className="mt-3 text-lg font-bold text-slate-800">Hours saved per attorney, per week</div>
                  <p className="mt-2 text-sm text-slate-500 max-w-xs leading-relaxed">
                    Enabling lawyers to focus on high-value strategic consulting instead of manual document editing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-y border-slate-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Our Values</h2>
            <p className="mt-4 text-lg text-slate-500">The principles that guide everything we build.</p>
          </div>
          
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Value 1: Trust First */}
            <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 hover:shadow-md hover:border-slate-300 transition-all duration-300">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">Trust First</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                Attorney-client privilege is sacred. We built security into our foundation, not as an afterthought.
              </p>
            </div>

            {/* Value 2: AI That Augments */}
            <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 hover:shadow-md hover:border-slate-300 transition-all duration-300">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"></path>
                  <path d="M20 3v4"></path>
                  <path d="M22 5h-4"></path>
                  <path d="M4 17v2"></path>
                  <path d="M5 18H3"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">AI That Augments</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                Our AI enhances your expertise, never replaces it. You stay in control of every single word.
              </p>
            </div>

            {/* Value 3: Precision Matters */}
            <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 hover:shadow-md hover:border-slate-300 transition-all duration-300">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-lime-500 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                  <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path>
                  <path d="M7 21h10"></path>
                  <path d="M12 3v18"></path>
                  <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">Precision Matters</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                In legal work, details are everything. We obsess over accuracy so you can practice with utmost confidence.
              </p>
            </div>

            {/* Value 4: Human-Centric */}
            <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 hover:shadow-md hover:border-slate-300 transition-all duration-300">
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                </svg>
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">Human-Centric</h3>
              <p className="text-sm leading-relaxed text-slate-500">
                Technology should serve people, not the other way around. We design for how lawyers actually work.
              </p>
            </div>

          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Meet the Team</h2>
            <p className="mt-4 text-lg text-slate-500">The visionaries behind Contract Generator.</p>
          </div>
          
          <div className="mt-16 flex justify-center">
            <div className="max-w-sm w-full rounded-2xl border border-slate-200/80 bg-slate-50/40 p-8 text-center hover:shadow-md hover:border-slate-300 transition-all duration-300">
              {/* Professional Avatar with dynamic background pulse */}
              <div className="relative mx-auto mb-6 h-28 w-28 rounded-full overflow-hidden border-2 border-[#00C897]/50 p-1 bg-white">
                <img 
                  alt="Tiffany Williams" 
                  className="h-full w-full rounded-full object-cover" 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Tiffany Williams</h3>
              <p className="mt-1 text-sm font-semibold text-teal-600">Founder &amp; CEO</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Former legal tech consultant with 10+ years building software for law firms. Passionate about making legal services more accessible and efficient through strategic AI integration.
              </p>
              
              <div className="mt-6 flex justify-center gap-3">
                <button 
                  onClick={() => triggerToast('Opening LinkedIn Profile...')}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-slate-100/80 hover:border-blue-200 transition-all"
                  aria-label="LinkedIn profile"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden py-24 border-t border-slate-200 bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,200,151,0.06),transparent_60%)]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200/60 bg-teal-500/10 px-4 py-1.5 text-sm font-semibold text-teal-700 mb-6 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            Join the movement
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900">
            Ready to transform your practice?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Join hundreds of attorneys who are already drafting smarter with Contract Generator.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => triggerToast('Starting your Free Trial...')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold h-11 rounded-lg px-8 bg-gradient-to-r from-[#00C897] to-[#06b6d4] hover:opacity-90 text-white shadow-md shadow-teal-500/10 transition-all transform hover:-translate-y-0.5"
            >
              Start Free Trial
            </button>
            <button 
              onClick={() => triggerToast('Contacting Sales Team...')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold h-11 rounded-lg px-8 border border-slate-200 hover:border-slate-300 hover:bg-slate-100 text-slate-700 hover:text-slate-900 bg-white transition-all transform hover:-translate-y-0.5 shadow-sm"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>© 2026 Contract Generator. All rights reserved.</p>
        </div>
      </footer>

      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:border-teal-400 focus:outline-none ${
          showScrollTop ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-90 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#00C897]">
          <path d="m18 15-6-6-6 6"></path>
        </svg>
      </button>

      <div 
        className={`fixed bottom-8 left-8 z-50 flex items-center gap-3 bg-slate-900 text-white py-3 px-5 rounded-xl shadow-xl transition-all duration-300 transform ${
          toast.show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <div className="h-2 w-2 rounded-full bg-[#00C897] animate-ping" />
        <span className="text-sm font-medium">{toast.message}</span>
      </div>

    </div>
  );
}