import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Smartphone,
  MessageSquare,
  PhoneCall,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Users,
  Mail,
  Lock,
  User,
  Globe,
  Star,
  ChevronRight,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

interface LandingPageViewProps {
  onEnterApp: () => void;
  onOpenDocs: () => void;
}

export function LandingPageView({ onEnterApp, onOpenDocs }: LandingPageViewProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsAuthModalOpen(false);
    onEnterApp();
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage) return;
    setContactSubmitted(true);
    setTimeout(() => {
      setContactMessage('');
      setContactName('');
      setContactEmail('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white">
                Signal<span className="text-indigo-400">IQ</span>
              </span>
              <span className="ml-2 px-2 py-0.5 text-[10px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-md">
                V2.5
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#usecases" className="hover:text-white transition">Use Cases</a>
            <a href="#about" className="hover:text-white transition">About Us</a>
            <a href="#contact" className="hover:text-white transition">Contact</a>
            <button onClick={onOpenDocs} className="hover:text-white transition">Documentation</button>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5 text-sm"
            >
              Get Started Free
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-800 border-b border-slate-700 px-6 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white">Features</a>
            <a href="#usecases" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white">Use Cases</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white">About Us</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-white">Contact</a>
            <button onClick={() => { setMobileMenuOpen(false); onOpenDocs(); }} className="block text-slate-300 hover:text-white">Documentation</button>
            <div className="pt-3 border-t border-slate-700 flex flex-col space-y-2">
              <button
                onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full py-2 text-center text-sm font-semibold text-slate-300 bg-slate-700 rounded-lg"
              >
                Sign In
              </button>
              <button
                onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); setMobileMenuOpen(false); }}
                className="w-full py-2.5 text-center text-sm font-semibold text-white bg-indigo-600 rounded-lg"
              >
                Get Started Free
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1]">
            Turn Customer Chaos Into <span className="bg-gradient-to-r from-indigo-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent">Metric-Backed Product Roadmaps</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Stop guessing what to build. SignalIQ automatically aggregates Play Store reviews, support tickets, sales calls, and WhatsApp screenshots into quantified pain points, churn signals, and precise feature backlogs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Start Free Evaluation</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-base border border-slate-700 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Launch Live Workspace</span>
            </button>
          </div>

          {/* Hero Preview Card */}
          <div className="mt-16 max-w-5xl mx-auto bg-slate-800/70 border border-slate-700/80 rounded-3xl p-6 shadow-2xl backdrop-blur-xl text-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-700 mb-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-400 font-mono ml-2">signaliq-workspace.app/intelligence</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 text-xs font-semibold rounded-md border border-emerald-800">
                Live AI Sync Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Top Pain Point Cluster</span>
                <h4 className="text-lg font-bold text-white">Onboarding Camera KYC Freeze</h4>
                <p className="text-sm text-slate-400">12 out of 50 reviews mention app freezing during ID verification step on iOS 18.</p>
                <div className="pt-2 text-xs font-mono text-emerald-400 font-semibold bg-emerald-950/60 p-2 rounded-lg">
                  Impact: 34% Drop-Off Reduction
                </div>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Churn Risk Alert</span>
                <h4 className="text-lg font-bold text-white">Enterprise QuickBooks Sync</h4>
                <p className="text-sm text-slate-400">3 key accounts threatened cancellation over missing webhook invoice sync.</p>
                <div className="pt-2 text-xs font-mono text-amber-400 font-semibold bg-amber-950/60 p-2 rounded-lg">
                  ARR at Risk: $18,400
                </div>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-2xl border border-slate-700 space-y-2">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Recommended Roadmap</span>
                <h4 className="text-lg font-bold text-white">Redesign 2FA Setup Flow</h4>
                <p className="text-sm text-slate-400">High complaint volume + low engineering effort = Top sprint priority.</p>
                <div className="pt-2 text-xs font-mono text-purple-400 font-semibold bg-purple-950/60 p-2 rounded-lg">
                  Priority Score: 9.4 / 10
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Built for Omnichannel Customer Intelligence
          </h2>
          <p className="text-slate-400 text-lg">
            Traditional surveys capture 3% of your users. SignalIQ captures 100% of your real feedback across every channel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-8 space-y-4 hover:border-indigo-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">App Store & Play Store Crawlers</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Automatically pull 1-star and 2-star store reviews daily to catch breaking bugs before they crater your ratings.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-8 space-y-4 hover:border-indigo-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">WhatsApp & Founder Note OCR</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Upload screenshots of direct messages from VIP customers sent to founders; multimodal AI extracts and clusters complaints instantly.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-8 space-y-4 hover:border-indigo-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Urgent Churn Signal Flags</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Scan support queues and sales call transcripts for explicit cancellation threats and trigger high-priority customer success interventions.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-8 space-y-4 hover:border-indigo-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Metric-Backed AI Clustering</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transform thousands of messy text rows into precise metrics like "18 out of 40 tickets complained about KYC delay."
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-8 space-y-4 hover:border-indigo-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-sky-600/20 text-sky-400 flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Impact-Weighted Roadmap Backlog</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Generate sprint-ready backlog items prioritized by user complaint volume, severity, and estimated conversion lift.
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/80 rounded-3xl p-8 space-y-4 hover:border-indigo-500 transition">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Automated Daily Crawler Cron</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Run continuous background syncs to ensure your product team starts every morning with freshly updated feedback insights.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="usecases" className="py-24 bg-slate-950/80 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Tailored For Every Product Stakeholder
            </h2>
            <p className="text-slate-400 text-lg">
              See how founders, product managers, and customer success teams use SignalIQ.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
              <div className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Early-Stage Founders</div>
              <h3 className="text-2xl font-bold text-white">Never Miss a Critical Bug</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                When you're wearing 10 hats, you don't have time to read 500 support tickets. SignalIQ summarizes what's broken and what to fix first so you can protect retention.
              </p>
              <ul className="space-y-2 text-sm text-slate-300 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> WhatsApp screenshot OCR ingest</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Daily founder briefing summaries</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Product Managers</div>
              <h3 className="text-2xl font-bold text-white">Data-Driven Sprint Backlogs</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Justify every roadmap decision to stakeholders with hard metric backing. Link any backlog item directly to verifiable customer quotes and revenue impact.
              </p>
              <ul className="space-y-2 text-sm text-slate-300 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> RICE impact/effort scoring</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Exact quote source citations</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">Customer Success</div>
              <h3 className="text-2xl font-bold text-white">Prevent Enterprise Churn</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Catch frustration spikes and explicit cancellation threats across support queues and sales calls before renewal deadlines approach.
              </p>
              <ul className="space-y-2 text-sm text-slate-300 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Automated churn risk flagging</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> MRR at risk estimation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-block px-3.5 py-1 rounded-full bg-indigo-950 text-indigo-400 text-xs font-semibold tracking-wide uppercase border border-indigo-800">
              About SignalIQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              We Built SignalIQ Because Product Feedback is Broken
            </h2>
            <p className="text-slate-400 leading-relaxed">
              For too long, product teams have relied on sluggish surveys and intuition-driven roadmaps. We created SignalIQ to bridge the gap between messy qualitative feedback and rigorous quantitative product intelligence.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Powered by modern AI models and lightning-fast Supabase persistence, SignalIQ runs entirely on optimized free tiers, empowering teams of any size to listen closer to their users.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-4">
              <div>
                <div className="text-3xl font-extrabold text-indigo-400">100%</div>
                <div className="text-sm text-slate-400 mt-1">Free-Tier Optimized</div>
              </div>
              <div>
                <div className="text-3xl font-extrabold text-emerald-400">24/7</div>
                <div className="text-sm text-slate-400 mt-1">Automated Crawler Sync</div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-bold text-white">Why Product Leaders Choose SignalIQ</h3>
            <div className="space-y-4 text-sm text-slate-300">
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">No More Missing Data</strong>
                  <span>Unify Play Store reviews, WhatsApp chats, and support tickets into one single source of truth.</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Verifiable Evidence</strong>
                  <span>Every insight cites its exact source and customer verbatim quote. No hallucinated feedback.</span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Instant Setup</strong>
                  <span>Get your first omnichannel intelligence workspace running in under 60 seconds.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section id="contact" className="py-24 bg-slate-950/80 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Get in Touch With Our Team</h2>
            <p className="text-slate-400">Have questions about enterprise deployment or custom connectors? Send us a message.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl">
            {contactSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-800">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                <p className="text-slate-400 max-w-md mx-auto">Thank you for reaching out. A SignalIQ product specialist will respond to your inquiry within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase">Your Name</label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Sarah Jenkins"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase">Work Email</label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="sarah@company.com"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Tell us about your feedback intelligence needs..."
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-lg shadow-indigo-600/30 transition cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-800 py-12 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-lg">SignalIQ</span>
          </div>
          <p>SignalIQ &copy; {new Date().getFullYear()} &mdash; Omnichannel Voice of Customer & Churn Intelligence Engine.</p>
          <div className="flex items-center justify-center space-x-6 text-xs">
            <a href="#features" className="hover:text-slate-400">Features</a>
            <a href="#usecases" className="hover:text-slate-400">Use Cases</a>
            <a href="#about" className="hover:text-slate-400">About Us</a>
            <button onClick={onOpenDocs} className="hover:text-slate-400">Documentation</button>
          </div>
        </div>
      </footer>

      {/* Auth / Sign In Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-8 space-y-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-600/30">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">
                {authMode === 'login' ? 'Sign In to SignalIQ' : 'Create Your Free Account'}
              </h3>
              <p className="text-xs text-slate-400">
                {authMode === 'login' ? 'Enter your credentials to access your workspaces' : 'Get started instantly with 100% free-tier access'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase">Work Email</label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                {authMode === 'login' ? 'Sign In to Workspace' : 'Create Account & Launch'}
              </button>

              <div className="text-center pt-2">
                {authMode === 'login' ? (
                  <p className="text-xs text-slate-400">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-indigo-400 font-semibold hover:underline"
                    >
                      Sign up free
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className="text-indigo-400 font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
