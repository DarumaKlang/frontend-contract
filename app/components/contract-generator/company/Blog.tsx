'use client';

import { useState, useEffect } from 'react';
import { sanitizeArticleHtml } from '@/lib/sanitize';
import { 
  Scale, 
  ArrowLeft, 
  Sparkles, 
  User, 
  Calendar, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Send, 
  Check, 
  X, 
  ArrowUp 
} from 'lucide-react';

// โครงสร้างประเภทของบทความ
interface Article {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  readtime: string;
  excerpt: string;
  content: string;
  badgeColor: string;
}

// ฐานข้อมูลบทความสำหรับการแสดงผล
const articlesDb: Record<string, Article> = {
  featured: {
    id: "featured",
    title: "How AI is Transforming Legal Document Drafting in 2026",
    category: "AI & Legal Tech",
    author: "Tiffany Williams",
    date: "January 15, 2026",
    readtime: "8 min read",
    excerpt: "Explore how modern AI assistants are helping attorneys draft contracts, briefs, and legal documents faster than ever—while maintaining the absolute precision that legal work demands. Learn how machine intelligence merges with attorney supervision.",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    content: `
      <p class="text-lg text-slate-700 font-medium mb-6">In 2026, the intersection of legal practice and artificial intelligence has matured beyond simple templates. Today's AI assistants acts as a companion that understands nuance, jurisdictional differences, and semantic intents.</p>
      
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-3">1. Precision-Driven Contextual Awareness</h3>
      <p class="text-slate-600 mb-4">Unlike early language models, current AI drafting tools are coupled with secure vector databases of verified legal precedents. When an attorney starts typing a proprietary joint venture agreement, the model cross-references dynamic state laws in real-time to generate compliant, battle-tested clauses.</p>
      
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-3">2. Human-in-the-Loop Paradigm</h3>
      <p class="text-slate-600 mb-4">AI does not replace counsel; it optimizes workflow. Security controls ensure every generated proposal must undergo explicit validation from legal teams. This division of labor allows attorneys to dedicate energy to strategic negotiations and client interfaces, leaving structural drafting to precise model operations.</p>
      
      <blockquote class="border-l-4 border-emerald-500 bg-emerald-50/50 p-4 rounded-r-xl my-6 italic text-slate-700 font-medium">
        "Drafting a complex commercial lease used to take hours of manual copy-pasting and risk evaluation. With customized AI assistance, we can generate a reliable framework in five minutes, turning legal services into a rapid consulting venture."
      </blockquote>
      
      <h3 class="text-xl font-bold text-slate-900 mt-8 mb-3">3. Looking Forward</h3>
      <p class="text-slate-600 mb-4">As language model algorithms expand security and computational speeds, the compliance assurance of draft agreements will happen natively inside the interface. Firms adopting these models now are gaining exponential speed advantages.</p>
    `
  },
  art1: {
    id: "art1",
    title: "5 Ways to Speed Up Contract Review",
    category: "Best Practices",
    author: "Jonathan Pierce",
    date: "January 12, 2026",
    readtime: "5 min read",
    excerpt: "Learn practical techniques for reviewing contracts more efficiently without sacrificing compliance or accuracy.",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    content: `
      <p class="text-lg text-slate-700 font-medium mb-6">Contract evaluation doesn't have to drag. Use these automated steps to review documents rapidly without overlooking hidden liabilities.</p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-2">1. Use Predefined Custom Playbooks</h3>
      <p class="text-slate-600 mb-4">Create a static blueprint of non-negotiable standards (e.g., specific indemnity caps or dispute locations) and upload them to your automated review system to instantly flag non-conforming clauses.</p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-2">2. Semantic Comparison</h3>
      <p class="text-slate-600 mb-4">Look for logical shifts, not just structural word matching. Often, differing vocabulary covers identical intents—or conversely, minor synonyms mask major alterations.</p>
    `
  },
  art2: {
    id: "art2",
    title: "LegaliDraft.pro: January 2026 Product Update",
    category: "Product Updates",
    author: "Product Team",
    date: "January 8, 2026",
    readtime: "3 min read",
    excerpt: "Introducing smart clause suggestions, real-time cooperative redlining, and streamlined team access control.",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    content: `
      <p class="text-lg text-slate-700 font-medium mb-6">Our first launch of 2026 brings powerful collaborative tools designed for modern legal ecosystems.</p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-2">Key Features</h3>
      <ul class="list-disc pl-5 space-y-2 text-slate-600">
        <li><strong>AI Smart-Clause Suggestion:</strong> Automatic inline auto-completion based on contract history and global templates.</li>
        <li><strong>Integrated Redlining Suite:</strong> Interactive collaborative environments with version logs.</li>
        <li><strong>Access Management:</strong> Advanced role-based security settings for internal and external counsel.</li>
      </ul>
    `
  },
  art3: {
    id: "art3",
    title: "The Future of Legal Practice: 2026 Trends",
    category: "Industry News",
    author: "Sarah Jenkins",
    date: "January 5, 2026",
    readtime: "6 min read",
    excerpt: "From AI agents to decentralized secure firms, here are the core patterns currently reshaping the legal workspace.",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    content: `
      <p class="text-lg text-slate-700 font-medium mb-6">A deep look into the technological developments driving client interactions and operation architectures in modern law.</p>
      <p class="text-slate-600 mb-4">With cloud secure legal spaces and remote consultation becoming standard, local borders are shrinking. Law firms are scaling rapidly by utilizing cloud resources and semantic analytics pipelines.</p>
      <p class="text-slate-600 mb-4">Attorneys who embrace these workflow accelerations can offer highly competitive fixed-rate counseling instead of complex, friction-heavy hourly billings.</p>
    `
  },
  art4: {
    id: "art4",
    title: "Security Best Practices for Law Firms",
    category: "Best Practices",
    author: "Marcus Vance",
    date: "December 28, 2025",
    readtime: "7 min read",
    excerpt: "Essential cloud cybersecurity and data containment measures every modern firm needs to keep client dossiers safe.",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    content: `
      <p class="text-lg text-slate-700 font-medium mb-6">Client data breaches pose immense reputational and legal risks. Fortify your perimeter with these standards.</p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-2">1. Multi-factor Authentication & Zero-Trust</h3>
      <p class="text-slate-600 mb-4">Never trust automated devices without verified credentials. Segment sensitive active folders with strict permissions and robust role checks.</p>
      <h3 class="text-xl font-bold text-slate-900 mt-6 mb-2">2. Secure Document Archiving</h3>
      <p class="text-slate-600 mb-4">Use end-to-end encrypted repositories that monitor modifications with permanent compliance logging to guard against unauthorized access or structural change.</p>
    `
  },
  art5: {
    id: "art5",
    title: "Understanding AI Clause Analysis",
    category: "AI & Legal Tech",
    author: "Dr. Eleanor Vance",
    date: "December 20, 2025",
    readtime: "4 min read",
    excerpt: "How LegaliDraft.pro analyzes contract clauses semantically to point out pitfalls and potential legal liabilities.",
    badgeColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
    content: `
      <p class="text-lg text-slate-700 font-medium mb-6">A technical overview of the computational logic powering semantic parsing pipelines.</p>
      <p class="text-slate-600 mb-4">By transforming raw legal text fragments into vector matrices, machine learning engines identify high-risk commitments or conflicting clauses that simple keyword searches would easily miss.</p>
      <p class="text-slate-600 mb-4">This enables transactional attorneys to preemptively review contract hazards and reduce total draft cycle time significantly.</p>
    `
  },
  art6: {
    id: "art6",
    title: "Why Document Version Control Matters",
    category: "Best Practices",
    author: "LegaliDraft Security",
    date: "December 15, 2025",
    readtime: "5 min read",
    excerpt: "Maintaining full audit logs of agreements avoids discrepancies and protects against accidental overwrites.",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    content: `
      <p class="text-lg text-slate-700 font-medium mb-6">The hidden danger of untracked changes during corporate merger agreements and general acquisitions.</p>
      <p class="text-slate-600 mb-4">Explicit version histories ensure every modification and negotiation loop has verifiable proof of consent, avoiding disputes before they enter courtroom proceedings.</p>
    `
  }
};

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [emailInput, setEmailInput] = useState<string>("");
  const [showToast, setShowToast] = useState<boolean>(false);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);

  // ตรวจจับตำแหน่ง Scroll เพื่อแสดง/ซ่อนปุ่ม Back to Top
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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailInput("");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }
  };

  // ดึงรายการบทความตามหมวดหมู่ที่เลือก (ไม่รวม Featured)
  const filteredArticles = Object.values(articlesDb).filter(article => {
    if (article.id === 'featured') return false; // ข้ามบทความแนะนำเพื่อไม่ให้ซ้ำ
    return activeCategory === "All" || article.category === activeCategory;
  });

  // ใช้แสดงผลบทความแนะนำเฉพาะเมื่ออยู่หน้าแรก (All) หรือหมวดหมู่ AI & Legal Tech
  const shouldShowFeatured = activeCategory === "All" || activeCategory === "AI & Legal Tech";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-500/20 selection:text-emerald-950">
      
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a className="flex items-center gap-3 group" href="#home" onClick={() => setActiveCategory("All")}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 p-[1.5px] transition-all group-hover:scale-105 shadow-sm">
              <div className="flex items-center justify-center w-full h-full bg-white rounded-[11px]">
                <Scale className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              LegaliDraft<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">.pro</span>
            </span>
          </a>
          
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg transition-all">
            <ArrowLeft className="h-4 w-4" />
            Back to Platform
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-100 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,182,212,0.04),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_30%,rgba(16,182,212,0.03),transparent_50%)]"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
              <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
              Insights & Updates
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-slate-900">
              The LegaliDraft.pro <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-cyan-600">Blog</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 max-w-xl mx-auto">
              Insights on AI, legal tech, and building a smarter, safer, and faster law practice.
            </p>
          </div>
        </div>
      </section>

      {}
      {/* Category Filter Bar */}
      <section className="border-b border-slate-200/60 bg-white/70 py-4 sticky top-16 z-30 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {["All", "AI & Legal Tech", "Product Updates", "Best Practices", "Industry News"].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 border ${
                  activeCategory === category
                    ? "bg-slate-900 border-slate-900 text-white shadow-sm"
                    : "bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 border-slate-200/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        
        {}
        {/* Featured Article Section */}
        {shouldShowFeatured && (
          <div className="mb-16">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-12 hover:border-slate-300 transition-all duration-300 shadow-sm hover:shadow-md">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-100/10 rounded-full blur-3xl pointer-events-none"></div>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Featured Article
              </span>
              
              <h2 className="mt-4 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl leading-tight">
                {articlesDb.featured.title}
              </h2>
              <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
                {articlesDb.featured.excerpt}
              </p>
              
              <div className="mt-6 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs sm:text-sm text-slate-500">
                <span className="flex items-center gap-1.5 font-medium text-slate-700">
                  <User className="h-4 w-4 text-emerald-600" /> {articlesDb.featured.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" /> {articlesDb.featured.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> {articlesDb.featured.readtime}
                </span>
              </div>
              
              <button 
                onClick={() => setSelectedArticle(articlesDb.featured)}
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-600/10 hover:opacity-95 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                Read Full Article
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {}
        {/* Latest Articles Header */}
        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="text-emerald-600 h-6 w-6" />
            Latest Insights
          </h3>
          <span className="text-sm font-medium text-slate-500">
            Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <article 
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group relative rounded-2xl border border-slate-200/80 bg-white p-6 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-semibold border ${article.badgeColor}`}>
                    {article.category}
                  </span>
                  <h4 className="mt-4 text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors duration-200">
                    {article.title}
                  </h4>
                  <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {article.readtime}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-500">No articles found in this category.</p>
          </div>
        )}
      </main>

      {}
      {/* Stay Updated Newsletter Form */}
      <section className="relative overflow-hidden py-20 border-t border-slate-200 bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,182,212,0.03),transparent_70%)]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Stay Updated</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Get the latest insights on AI advancements, smart contract models, and platform updates delivered straight to your inbox.
          </p>
          
          <form onSubmit={handleSubscribe} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input 
              required 
              type="email" 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your professional email" 
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all" 
            />
            <button 
              type="submit" 
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-95 text-white font-bold px-6 py-3 shadow-md shadow-emerald-600/10 transition-all duration-200 hover:scale-[1.01]"
            >
              Subscribe
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm text-slate-500">© 2026 LegaliDraft.pro. All rights reserved. Precision-built legal drafting solutions.</p>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        onClick={scrollToTop} 
        className={`fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-emerald-600 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-emerald-500/30 ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-6 w-6" />
      </button>

      {/* Article Interactive Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
          <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
            {/* Modal backdrop */}
            <div 
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
              onClick={() => setSelectedArticle(null)}
            ></div>

            {/* Modal Content Frame */}
            <div className="relative transform overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-3xl lg:max-w-4xl">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedArticle(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-900 bg-slate-100 p-2 rounded-lg border border-slate-200 hover:border-slate-300 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Modal Body */}
              <div className="px-6 py-8 sm:p-10 max-h-[85vh] overflow-y-auto">
                <span className={`inline-block rounded-lg px-3 py-1 text-xs font-semibold border ${selectedArticle.badgeColor}`}>
                  {selectedArticle.category}
                </span>
                
                <h1 className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight">
                  {selectedArticle.title}
                </h1>
                
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 border-b border-slate-100 pb-6">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700">
                    <User className="w-4 h-4 text-emerald-600" /> {selectedArticle.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> {selectedArticle.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> {selectedArticle.readtime}
                  </span>
                </div>

                {/* Inner Content */}
                <div 
                  className="mt-6 text-slate-600 space-y-4 leading-relaxed text-sm sm:text-base prose prose-slate max-w-none"
                  dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(selectedArticle.content) }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      <div 
        className={`fixed top-20 right-6 z-50 transform transition-all duration-300 flex items-center gap-3 bg-white border border-emerald-500/30 px-6 py-4 rounded-xl shadow-xl ${
          showToast ? 'translate-x-0 opacity-100' : 'translate-x-72 opacity-0'
        }`}
      >
        <div className="bg-emerald-50 p-2 rounded-lg text-emerald-600">
          <Check className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">Subscription Successful</p>
          <p className="text-xs text-slate-500 mt-0.5">Thank you for joining our newsletter!</p>
        </div>
      </div>

    </div>
  );
}