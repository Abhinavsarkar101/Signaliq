import React from 'react';
import {
  ShieldCheck,
  Database,
  Cpu,
  Mail,
  Info,
  RefreshCw,
  CheckCircle2,
  Sun,
  Moon,
  Palette,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const SettingsView: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Platform Settings & Architecture
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Transparency into SignalIQ data persistence, AI integration, theme preferences, and external services.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
        {/* Appearance & Dark Mode Preference */}
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-3 text-indigo-700 dark:text-indigo-400">
            <Palette className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Interface Appearance</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            Choose your preferred color theme. Your selection is automatically saved to your browser and synchronized across the Home screen and workspace.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                !isDark
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-400 text-indigo-700 dark:text-indigo-300 shadow-xs ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Light Mode</span>
              {!isDark && <span className="ml-1 text-[10px] text-indigo-600 font-semibold">(Active)</span>}
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
                isDark
                  ? 'bg-indigo-950/80 border-indigo-500 text-indigo-200 shadow-xs ring-2 ring-indigo-500/20'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>Dark Mode</span>
              {isDark && <span className="ml-1 text-[10px] text-indigo-400 font-semibold">(Active)</span>}
            </button>
          </div>
        </div>

        {/* Persistence Section */}
        <div className="p-6 space-y-3">
          <div className="flex items-center space-x-3 text-indigo-700 dark:text-indigo-400">
            <Database className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Data Persistence</h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            All research projects, objectives, uploaded evidence metadata, Gemini analysis findings, generated surveys, and submitted responses are stored persistently in the server file database at{' '}
            <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 font-mono text-[11px] rounded-sm text-slate-800 dark:text-slate-200">
              ./data/db.json
            </code>.
          </p>
          <div className="flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-2 rounded-lg border border-emerald-200/60 dark:border-emerald-800 w-fit">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Server File Persistence: Active & Synced</span>
          </div>
        </div>

        {/* AI Model & Security */}
        <div className="p-6 space-y-3">
          <div className="flex items-center space-x-3 text-indigo-700 dark:text-indigo-400">
            <Cpu className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Gemini AI Model & API Key Isolation
            </h3>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            SignalIQ utilizes <strong className="text-slate-800 dark:text-slate-200">gemini-3.8-flash</strong> using the official{' '}
            <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 font-mono text-[11px] rounded-sm text-slate-800 dark:text-slate-200">
              @google/genai
            </code>{' '}
            SDK. All AI calls are securely proxied through server-side endpoints (
            <code className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 font-mono text-[11px] rounded-sm text-slate-800 dark:text-slate-200">
              /api/ai/*
            </code>
            ). No API keys or secrets are ever bundled or exposed in client browser code.
          </p>
          <div className="flex items-center space-x-2 text-xs text-emerald-700 dark:text-emerald-300 font-semibold bg-emerald-50 dark:bg-emerald-950/60 px-3 py-2 rounded-lg border border-emerald-200/60 dark:border-emerald-800 w-fit">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Strict Server-Side Proxying Enforced</span>
          </div>
        </div>

        {/* Integration Status Table */}
        <div className="p-6 space-y-3">
          <div className="flex items-center space-x-3 text-indigo-700 dark:text-indigo-400">
            <Mail className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">External Integrations Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="p-2.5 border-b border-slate-200 dark:border-slate-800">Integration</th>
                  <th className="p-2.5 border-b border-slate-200 dark:border-slate-800">Status</th>
                  <th className="p-2.5 border-b border-slate-200 dark:border-slate-800">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                <tr>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">Google Gemini API</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold rounded-sm text-[10px]">
                      Connected
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">
                    Structured briefs, theme extraction, sufficiency evaluation
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">Google Apps Script MailApp</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 font-bold rounded-sm text-[10px]">
                      Configurable
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">
                    Free Gmail bulk distribution via Web App URL with quota monitoring & simulation mode
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-slate-900 dark:text-white">Live Meeting Transcriber</td>
                  <td className="p-2.5">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-bold rounded-sm text-[10px]">
                      Ready (Manual)
                    </span>
                  </td>
                  <td className="p-2.5 text-slate-500 dark:text-slate-400">
                    Paste transcript / upload file supported in current MVP
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
