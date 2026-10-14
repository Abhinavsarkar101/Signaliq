import React from 'react';
import { ShieldCheck, Database, Cpu, Mail, Info, RefreshCw, CheckCircle2 } from 'lucide-react';

export const SettingsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Platform Settings & Architecture</h1>
        <p className="text-xs text-slate-500">
          Transparency into SignalIQ data persistence, AI integration, and external services.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs divide-y divide-slate-100">
        {/* Persistence Section */}
        <div className="p-6 space-y-3">
          <div className="flex items-center space-x-3 text-indigo-700">
            <Database className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Data Persistence</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            All research projects, objectives, uploaded evidence metadata, Gemini analysis findings, generated surveys, and submitted responses are stored persistently in the server file database at <code className="px-1.5 py-0.5 bg-slate-100 font-mono text-[11px] rounded-sm text-slate-800">./data/db.json</code>.
          </p>
          <div className="flex items-center space-x-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200/60 w-fit">
            <CheckCircle2 className="w-4 h-4" />
            <span>Server File Persistence: Active & Synced</span>
          </div>
        </div>

        {/* AI Model & Security */}
        <div className="p-6 space-y-3">
          <div className="flex items-center space-x-3 text-indigo-700">
            <Cpu className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">Gemini AI Model & API Key Isolation</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            SignalIQ utilizes <strong className="text-slate-800">gemini-3.8-flash</strong> using the official <code className="px-1.5 py-0.5 bg-slate-100 font-mono text-[11px] rounded-sm text-slate-800">@google/genai</code> SDK.
            All AI calls are securely proxied through server-side endpoints (<code className="px-1.5 py-0.5 bg-slate-100 font-mono text-[11px] rounded-sm text-slate-800">/api/ai/*</code>).
            No API keys or secrets are ever bundled or exposed in client browser code.
          </p>
          <div className="flex items-center space-x-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-200/60 w-fit">
            <ShieldCheck className="w-4 h-4" />
            <span>Strict Server-Side Proxying Enforced</span>
          </div>
        </div>

        {/* Integration Status Table */}
        <div className="p-6 space-y-3">
          <div className="flex items-center space-x-3 text-indigo-700">
            <Mail className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">External Integrations Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200">
              <thead className="bg-slate-50 text-slate-700 font-semibold">
                <tr>
                  <th className="p-2.5 border-b">Integration</th>
                  <th className="p-2.5 border-b">Status</th>
                  <th className="p-2.5 border-b">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Google Gemini API</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded-sm text-[10px]">
                      Connected
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-500">Structured briefs, theme extraction, sufficiency evaluation</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Automated Outbound Email</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold rounded-sm text-[10px]">
                      Not Configured
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-500">Manual shareable URLs supported; no fake delivery claims</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900">Live Meeting Transcriber</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold rounded-sm text-[10px]">
                      Coming Soon
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-500">Paste transcript / upload file supported in current MVP</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
