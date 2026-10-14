import React from 'react';
import { Layers, Plus, BarChart3, FolderKanban, FileText, CheckCircle2, Settings as SettingsIcon } from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'projects' | 'workspace' | 'surveys' | 'reports' | 'settings';
  setCurrentView: (view: 'dashboard' | 'projects' | 'workspace' | 'surveys' | 'reports' | 'settings') => void;
  onNewProject: () => void;
  activeProjectName?: string;
  hasActiveProject: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onNewProject,
  activeProjectName,
  hasActiveProject,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center space-x-3 text-left focus:outline-hidden group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900">Signal<span className="text-indigo-600">IQ</span></span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide bg-indigo-50 text-indigo-700 border border-indigo-200/60 rounded-md">BETA</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Customer Feedback Intelligence</p>
              </div>
            </button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'text-indigo-700 bg-indigo-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('projects')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentView === 'projects'
                    ? 'text-indigo-700 bg-indigo-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Research Projects
              </button>
              {hasActiveProject && (
                <button
                  onClick={() => setCurrentView('workspace')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    currentView === 'workspace'
                      ? 'text-indigo-700 bg-indigo-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Workspace: <span className="font-semibold text-slate-800 max-w-[130px] truncate inline-block align-bottom">{activeProjectName}</span></span>
                </button>
              )}
              <button
                onClick={() => setCurrentView('surveys')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentView === 'surveys'
                    ? 'text-indigo-700 bg-indigo-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Surveys
              </button>
              <button
                onClick={() => setCurrentView('reports')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentView === 'reports'
                    ? 'text-indigo-700 bg-indigo-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Insights & Reports
              </button>
            </nav>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setCurrentView('settings')}
              title="Platform Settings"
              className={`p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer ${
                currentView === 'settings' ? 'bg-slate-100 text-indigo-600' : ''
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
            </button>

            <button
              onClick={onNewProject}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs shadow-indigo-200 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Research Project</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
