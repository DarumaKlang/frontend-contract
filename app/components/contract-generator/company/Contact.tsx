'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Scale, 
  ArrowLeft, 
  MessageSquare, 
  Mail, 
  Building2, 
  MapPin, 
  Phone, 
  Clock, 
  ChevronDown, 
  CheckCircle, 
  ArrowUp,
  Send,
  Sparkles
} from 'lucide-react';

// Subject options for the combobox
const SUBJECT_OPTIONS = [
  { id: 'demo', label: 'Request a Demo' },
  { id: 'sales', label: 'Enterprise Pricing' },
  { id: 'support', label: 'Technical Support' },
  { id: 'general', label: 'General Inquiry' }
];

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Monitor scroll height to toggle Back to Top button
  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate successful form submission
    setShowToast(true);
    
    // Reset form states
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    
    // Auto hide toast notification
    setTimeout(() => {
      setShowToast(false);
    }, 4500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900 flex flex-col justify-between">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <a className="flex items-center gap-3 group" href="#home">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 p-[1px] flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm">
              <div className="bg-white w-full h-full rounded-[11px] flex items-center justify-center">
                <Scale className="h-5 w-5 text-emerald-500" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              Contract Generator
            </span>
          </a>
          
          {/* Back Button */}
          <a href="#back">
            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all hover:bg-slate-100 active:scale-95 h-9 rounded-lg px-4 gap-2 border border-slate-200 text-slate-600">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow">
        <section className="relative overflow-hidden py-16 lg:py-20 border-b border-slate-200/50 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50">
          {/* Decorative glowing background elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
            <div className="absolute top-[-20%] left-[10%] w-[400px] h-[400px] bg-emerald-200/20 rounded-full blur-[120px]"></div>
            <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-cyan-200/20 rounded-full blur-[100px]"></div>
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10 mb-4 animate-pulse">
                <Sparkles className="h-3.5 w-3.5" />
                24/7 AI Assistance
              </span>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">Touch</span>
              </h1>
              <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
                Have a question about Contract Generator? Our team of legal tech experts is ready to assist you.
              </p>
            </div>
          </div>
        </section>

        {}
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-3">
              
              {/* Contact Form Container (Left Span 2) */}
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xl shadow-slate-100/50 relative overflow-hidden">
                  {/* Decorative premium bar */}
                  <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-emerald-400 to-cyan-500"></div>
                  
                  <div className="mb-8 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shadow-sm">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-950">Send us a message</h2>
                      <p className="text-sm text-slate-500 mt-0.5">Fill out the form below and we will get back to you.</p>
                    </div>
                  </div>

                  <form onSubmit={handleFormSubmit} className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      {/* Full Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="name">Full Name</label>
                        <input 
                          type="text" 
                          id="name" 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                          placeholder="Jane Smith" 
                        />
                      </div>
                      {/* Email */}
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700" htmlFor="email">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                          placeholder="jane@lawfirm.com" 
                        />
                      </div>
                    </div>

                    {}
                    {/* Subject Select Combobox */}
                    <div className="space-y-2 relative" ref={dropdownRef}>
                      <label className="text-sm font-semibold text-slate-700">Subject</label>
                      <div className="relative">
                        <button 
                          type="button" 
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          className="w-full flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                        >
                          <span className={subject ? "text-slate-900 font-medium" : "text-slate-400"}>
                            {subject ? SUBJECT_OPTIONS.find(o => o.id === subject)?.label : "Select a topic"}
                          </span>
                          <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {/* Options List */}
                        {isDropdownOpen && (
                          <div className="absolute left-0 z-50 mt-2 w-full origin-top-right rounded-xl border border-slate-200 bg-white shadow-2xl p-1.5 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-150">
                            {SUBJECT_OPTIONS.map((option) => (
                              <button 
                                key={option.id}
                                type="button" 
                                onClick={() => {
                                  setSubject(option.id);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2.5 text-sm rounded-lg transition-colors flex items-center justify-between ${
                                  subject === option.id 
                                    ? 'bg-emerald-50 text-emerald-700 font-semibold' 
                                    : 'hover:bg-slate-50 text-slate-600 hover:text-slate-900'
                                }`}
                              >
                                {option.label}
                                {subject === option.id && <CheckCircle className="h-4 w-4 text-emerald-600" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message Box */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700" htmlFor="message">Message</label>
                      <textarea 
                        id="message" 
                        required 
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all resize-none"
                        placeholder="Tell us how we can help you..."
                      ></textarea>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-bold py-4 active:scale-[0.99] transition-all shadow-md shadow-emerald-500/10 text-base cursor-pointer"
                    >
                      <Send className="h-5 w-5" />
                      Send Message
                    </button>
                  </form>
                </div>
              </div>

              {}
              {/* Sidebar Information Cards (Right Span 1) */}
              <div className="space-y-6">
                
                {/* Contact Information Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-100/50 relative overflow-hidden">
                  <h3 className="font-bold text-slate-950 text-lg mb-6 pb-2 border-b border-slate-100">Contact Information</h3>
                  
                  <div className="space-y-5">
                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email</p>
                        <a href="mailto:contact@legaldraft.pro" className="text-sm font-semibold text-slate-800 hover:text-cyan-600 transition-colors">
                          contact@legaldraft.pro
                        </a>
                      </div>
                    </div>

                    {/* Company */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Company</p>
                        <p className="text-sm font-semibold text-slate-800">Contract Generator Inc.</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Office Location</p>
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                          254 Chapman Rd Ste 208, Newark, DE 19702, USA
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Support</p>
                        <a href="tel:+14085481119" className="text-sm font-semibold text-slate-800 hover:text-orange-500 transition-colors">
                          +1 408-548-1119
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Time Alert Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-100/50 p-6">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2 mb-2 text-sm">
                    <Clock className="h-4 w-4 text-emerald-600" />
                    Response Standards
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    We value your time. Our technical staff and legal solutions consultants aim to answer all written inquiries within 24 business hours.
                  </p>
                </div>

                {/* CTA Promotion Card */}
                <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-50/50 to-cyan-50/30 p-6 relative overflow-hidden group shadow-md">
                  <div className="absolute -right-8 -top-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                  <h3 className="font-bold text-slate-900 mb-2 text-base">Ready to build contracts?</h3>
                  <p className="text-sm text-slate-500 mb-5 leading-relaxed font-normal">
                    Skip the inquiry form and try Contract Generator risk-free for 14 days. No credit card required.
                  </p>
                  <a href="#trial">
                    <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 transition-all text-sm shadow-md cursor-pointer">
                      Start Free Trial
                    </button>
                  </a>
                </div>

              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <p>© 2026 Contract Generator. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-slate-600 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-6 z-50 animate-in fade-in slide-in-from-top-10 duration-300">
          <div className="flex items-center gap-3 bg-white border border-emerald-500/30 text-slate-800 px-5 py-4 rounded-2xl shadow-2xl ring-1 ring-slate-100">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">Message Received!</p>
              <p className="text-xs text-slate-500 mt-0.5">Thank you for reaching out. We will respond shortly.</p>
            </div>
          </div>
        </div>
      )}

      {/* Back to Top Float Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white/90 shadow-xl backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer text-emerald-600 hover:text-emerald-700 hover:bg-white ${
          showBackToTop ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-5 w-5" />
      </button>

    </div>
  );
}