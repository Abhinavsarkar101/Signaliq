import React, { useRef, useState } from 'react';
import {
  BookOpen,
  Download,
  Printer,
  Sparkles,
  Smartphone,
  MessageSquare,
  PhoneCall,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export function DocumentationView() {
  const docRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = async () => {
    if (!docRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(docRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save('SignalIQ_Complete_Product_Documentation.pdf');
    } catch (err) {
      console.error('PDF export failed:', err);
      alert('Failed to generate PDF. You can also use browser Print to PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-slate-800">
      {/* Top Action Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Official Product Documentation</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">SignalIQ Enterprise</h1>
          <p className="text-slate-500 mt-1">Omnichannel Voice of Customer (VoC) & Churn Intelligence Engine</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 font-medium text-slate-700 transition shadow-sm text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Print / View</span>
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-md text-sm disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? 'Generating PDF...' : 'Download PDF Doc'}</span>
          </button>
        </div>
      </div>

      {/* Printable Container */}
      <div ref={docRef} className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 md:p-12 space-y-12 print:shadow-none print:border-none print:p-0">
        
        {/* Cover / Summary Section */}
        <div className="border-b border-slate-200 pb-10">
          <div className="inline-block px-3.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs tracking-wide uppercase mb-4">
            Version 2.5 • Enterprise Edition
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            SignalIQ: Complete Product Documentation & Architecture
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            SignalIQ is an autonomous Voice of Customer (VoC) and Churn Intelligence platform designed for founders, product managers, and customer success teams. By unifying unstructured feedback from Play Store/iOS reviews, support tickets, sales calls, WhatsApp screenshots, and customer surveys, SignalIQ extracts metric-backed pain points, flags urgent churn signals, and automatically populates data-driven roadmap backlogs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mb-3">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Mission</h3>
              <p className="text-sm text-slate-600">Eliminate guesswork in product roadmaps by turning qualitative customer complaints into precise, metric-backed intelligence.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Tech Stack</h3>
              <p className="text-sm text-slate-600">React 19, Vite, Tailwind CSS, Express backend, Supabase PostgreSQL, and Gemini 2.5 Flash AI Engine.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 mb-1">Architecture</h3>
              <p className="text-sm text-slate-600">100% Free-tier optimized with secure server-side API proxying, robust error handling, and automated daily crawler cron.</p>
            </div>
          </div>
        </div>

        {/* Section 1: Context & The Problem */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">1</span>
            <h3 className="text-2xl font-bold text-slate-900">Context & The Problem Statement</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Traditional survey tools (Typeform, SurveyMonkey) suffer from a critical flaw: <strong>low response rates (typically 2% to 5%)</strong>. Meanwhile, real customer frustration is scattered across multiple unorganized silos:
          </p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
            <li className="flex items-start gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>App Store Reviews:</strong> 1-star ratings complaining about bugs that developers discover weeks later.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>Support Tickets:</strong> Repetitive Zendesk/Intercom threads about billing failures or login confusion.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>Sales Calls & Interviews:</strong> Unrecorded Zoom transcripts or scattered notes where prospects state why they won't buy.</span>
            </li>
            <li className="flex items-start gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-sm">
              <span className="text-red-500 font-bold">✕</span>
              <span><strong>WhatsApp Screenshots:</strong> Direct complaints sent by VIP customers to founders via messaging apps.</span>
            </li>
          </ul>
          <p className="text-slate-600 leading-relaxed">
            <strong>SignalIQ Solution:</strong> A unified ingestion engine that aggregates all these disparate channels daily, uses Gemini AI to cluster complaints, attributes exact quotes, flags churn risks, and produces a mathematically weighted roadmap backlog.
          </p>
        </section>

        {/* Section 2: Core Features & How They Work */}
        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">2</span>
            <h3 className="text-2xl font-bold text-slate-900">Core Features & Feature-by-Feature Breakdown</h3>
          </div>

          {/* Feature 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">1. Omnichannel Feedback Ingestion Hub</h4>
              </div>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">Automated & Manual Ingest</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Allows founders and PMs to feed raw data from any source into SignalIQ. Supports App Store / Play Store App ID crawling simulation, CSV support ticket uploads, text transcripts from sales calls, and multimodal OCR ingestion for WhatsApp founder screenshots.
            </p>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h5 className="font-semibold text-slate-900 text-sm mb-2">What each UI section means:</h5>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li>• <strong>Source Type Selector:</strong> Choose between App Store Reviews, Support Tickets, Sales Calls, or WhatsApp Screenshots.</li>
                <li>• <strong>Ingest Console:</strong> Input title and raw feedback content or upload files; instantly saves to Supabase database.</li>
                <li>• <strong>Active Sources Counter:</strong> Displays total ingested records across all channels with sync timestamps.</li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">2. AI-Powered Pain Point Clustering & Metric Extraction</h4>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">Gemini 2.5 Flash AI</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Synthesizes thousands of feedback entries into quantified clusters (e.g. "Onboarding Friction", "Billing Errors", "Performance Lag"). Instead of vague feedback, it outputs hard metrics like <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono text-xs">12 out of 50 reviews mention onboarding confusion</span>.
            </p>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h5 className="font-semibold text-slate-900 text-sm mb-2">What each UI section means:</h5>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li>• <strong>Cluster Severity Bar:</strong> Visual weight showing percentage of users impacted by each specific pain point.</li>
                <li>• <strong>Exact Quote Attribution:</strong> Direct verbatim customer quotes linked to each cluster with source badges (App Store, WhatsApp, etc.).</li>
                <li>• <strong>Sentiment Score:</strong> Automated classification (Critical Frustration, Neutral, Positive).</li>
              </ul>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-600 text-white">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">3. Churn Signal & Risk Flagging</h4>
              </div>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full">Urgent Alert Engine</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Scans all incoming messages and reviews for explicit churn threats ("Cancelling my subscription", "Moving to competitor X", "Worst support ever"). Flags them with high-priority visual warnings so customer success can intervene before churn occurs.
            </p>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h5 className="font-semibold text-slate-900 text-sm mb-2">What each UI section means:</h5>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li>• <strong>Churn Risk Badge:</strong> Highlights accounts or feedback items carrying immediate financial risk.</li>
                <li>• <strong>Revenue Impact Estimator:</strong> Calculates estimated MRR at risk based on customer segment.</li>
              </ul>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-600 text-white">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">4. AI-Recommended Roadmap Backlog & Impact Matrix</h4>
              </div>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">RICE Scoring</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Transforms clustered feedback into an actionable product backlog. Automatically recommends what to build next based on complaint volume, severity, and estimated conversion lift, complete with Impact vs Effort scores.
            </p>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h5 className="font-semibold text-slate-900 text-sm mb-2">What each UI section means:</h5>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li>• <strong>Backlog Item Title:</strong> Clear engineering task (e.g., "Redesign 2FA Setup Step").</li>
                <li>• <strong>Impact / Effort Ratio:</strong> High impact vs low effort prioritization tag for sprint planning.</li>
                <li>• <strong>Evidence Link:</strong> One-click navigation back to the exact customer reviews supporting the feature request.</li>
              </ul>
            </div>
          </div>

          {/* Feature 5 */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                  <Zap className="w-5 h-5" />
                </div>
                <h4 className="text-xl font-bold text-slate-900">5. Automated Daily Crawler & Sync Engine</h4>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">Background Sync</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Simulates automated daily crawling of app stores, support queues, and social mentions. Keeps product insights continuously fresh without requiring manual copy-pasting every week.
            </p>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h5 className="font-semibold text-slate-900 text-sm mb-2">What each UI section means:</h5>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li>• <strong>"Run Daily Crawl Now" Button:</strong> Triggers immediate ingestion of fresh simulated market reviews and support logs.</li>
                <li>• <strong>Last Synced Timestamp:</strong> Real-time confirmation of data freshness.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 3: Case Studies */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">3</span>
            <h3 className="text-2xl font-bold text-slate-900">Real-World Case Studies</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Case Study 1 */}
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">FinTech App ("Kudos")</span>
                <span className="text-xs text-slate-500 font-medium">Metric: 34% Onboarding Recovery</span>
              </div>
              <h4 className="font-bold text-lg text-slate-900">Fixing the Silent KYC Drop-Off</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Kudos was experiencing high drop-offs during account setup. Traditional surveys showed nothing. By connecting Apple App Store reviews and WhatsApp founder feedback into SignalIQ, the AI clustered 18 complaints pointing directly to a freezing camera permission popup on iOS 18.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                "Customer Quote: App freezes instantly when asking for camera access during ID scan on my iPhone 15 Pro." — Source: App Store Review
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md">B2B SaaS ("FlowPay")</span>
                <span className="text-xs text-slate-500 font-medium">Metric: $18k ARR Churn Prevented</span>
              </div>
              <h4 className="font-bold text-lg text-slate-900">Catching Enterprise Churn Signals</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                FlowPay ingested sales call transcripts and Zendesk support tickets into SignalIQ. The churn flagger detected 3 enterprise accounts complaining about missing QuickBooks webhook integrations before they canceled their annual subscriptions.
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 italic">
                "Customer Quote: If we can't sync invoices with QuickBooks by end of month, we're forced to switch to competitor." — Source: Sales Call Transcript
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Architecture & Supabase Integration */}
        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">4</span>
            <h3 className="text-2xl font-bold text-slate-900">Technical Architecture & Supabase Schema</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            SignalIQ runs on a robust, production-grade stack deployed on Render, backed by Supabase PostgreSQL tables:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="font-bold text-slate-900 text-sm">projects</div>
              <div className="text-xs text-slate-500 mt-1">Core workspaces</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="font-bold text-slate-900 text-sm">surveys</div>
              <div className="text-xs text-slate-500 mt-1">Survey configs</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="font-bold text-slate-900 text-sm">responses</div>
              <div className="text-xs text-slate-500 mt-1">Respondent data</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="font-bold text-slate-900 text-sm">campaigns</div>
              <div className="text-xs text-slate-500 mt-1">Email distribution</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="font-bold text-slate-900 text-sm">settings</div>
              <div className="text-xs text-slate-500 mt-1">API keys & configs</div>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Required Environment Variables: <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono">SUPABASE_URL</code> and <code className="bg-slate-100 px-2 py-0.5 rounded text-slate-800 font-mono">SUPABASE_SERVICE_ROLE_KEY</code>.
          </p>
        </section>

        {/* Conclusion Footer */}
        <div className="border-t border-slate-200 pt-8 text-center text-slate-500 text-sm">
          <p>SignalIQ Enterprise Documentation • Built with React, Vite, Express, and Supabase.</p>
          <p className="mt-1">All rights reserved © 2026 SignalIQ Intelligence Systems.</p>
        </div>

      </div>
    </div>
  );
}
