import React from 'react';
import {
  Layers,
  Plus,
  BarChart3,
  FolderKanban,
  FileText,
  CheckCircle2,
  Settings as SettingsIcon,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentView: 'dashboard' | 'projects' | 'workspace' | 'surveys' | 'reports' | 'settings' | 'feedback' | 'submissions' | 'documentation' | 'landing';
  setCurrentView: (view: 'dashboard' | 'projects' | 'workspace' | 'surveys' | 'reports' | 'settings' | 'feedback' | 'submissions' | 'documentation' | 'landing') => void;
  onNewProject: () => void;
  activeProjectName?: string;
  hasActiveProject: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onNewProject,
  activeProjectName,
  hasActiveProject,
  onLogout,
}) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center space-x-3 text-left focus:outline-hidden group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                    Signal<span className="text-indigo-600 dark:text-indigo-400">IQ</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 rounded-md">
                    BETA
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  Customer Feedback Intelligence
                </p>
              </div>
            </button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <button
                onClick={() => setCurrentView('landing')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentView === 'landing'
                    ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentView === 'dashboard'
                    ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('projects')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentView === 'projects'
                    ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Research Projects
              </button>
              {hasActiveProject && (
                <button
                  onClick={() => setCurrentView('workspace')}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    currentView === 'workspace'
                      ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>
                    Workspace:{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[130px] truncate inline-block align-bottom">
                      {activeProjectName}
                    </span>
                  </span>
                </button>
              )}
              <button
                onClick={() => setCurrentView('surveys')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentView === 'surveys'
                    ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Surveys
              </button>
              <button
                onClick={() => setCurrentView('reports')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                  currentView === 'reports'
                    ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                Insights & Reports
              </button>
              <button
                onClick={() => setCurrentView('documentation')}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center space-x-1 ${
                  currentView === 'documentation'
                    ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <FileText className="w-4 h-4 text-indigo-500 inline mr-1" />
                <span>Docs</span>
              </button>
            </nav>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme"
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-center"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            <button
              onClick={() => setCurrentView('settings')}
              title="Platform Settings"
              className={`p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ${
                currentView === 'settings'
                  ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400'
                  : ''
              }`}
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-lg text-rose-500 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-100 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer flex items-center justify-center"
            >
              <LogOut className="w-5 h-5" />
            </button>

            <button
              onClick={onNewProject}
              className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-indigo-200 dark:shadow-none transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Research Project</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
