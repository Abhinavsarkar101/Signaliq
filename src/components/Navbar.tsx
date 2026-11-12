import React, { useState, useRef, useEffect } from 'react';
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
  ChevronDown,
  Filter,
  Eye,
  Sliders,
  FileSpreadsheet,
  Inbox,
  Sparkles,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentView: 'dashboard' | 'projects' | 'workspace' | 'surveys' | 'reports' | 'settings' | 'feedback' | 'submissions' | 'documentation' | 'landing';
  setCurrentView: (view: 'dashboard' | 'projects' | 'workspace' | 'surveys' | 'reports' | 'settings' | 'feedback' | 'submissions' | 'documentation' | 'landing') => void;
  onNewProject: () => void;
  activeProjectName?: string;
  hasActiveProject: boolean;
  onLogout: () => void;
  userProfile?: Record<string, string>;
  isFullPlatformMode?: boolean;
  onToggleFullPlatformMode?: () => void;
  onOpenOnboardingModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onNewProject,
  activeProjectName,
  hasActiveProject,
  onLogout,
  userProfile = {},
  isFullPlatformMode = false,
  onToggleFullPlatformMode,
  onOpenOnboardingModal,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const role = userProfile.role || 'Product Manager / Designer';
  const isFounder = role.toLowerCase().includes('founder') || role.toLowerCase().includes('executive');
  const isPM = role.toLowerCase().includes('product');
  const isCS = role.toLowerCase().includes('success') || role.toLowerCase().includes('support');
  const isResearcher = role.toLowerCase().includes('research') || role.toLowerCase().includes('analyst');

  // Define which links are directly visible in Focused Mode
  const getFocusedVisibleViews = () => {
    if (isFounder) {
      return ['dashboard', 'projects', 'reports', 'documentation'];
    }
    if (isCS) {
      return ['dashboard', 'feedback', 'surveys', 'submissions'];
    }
    if (isResearcher) {
      return ['dashboard', 'projects', 'feedback', 'surveys', 'reports'];
    }
    // Default Product Manager
    return ['dashboard', 'projects', 'feedback', 'reports'];
  };

  const focusedVisibleViews = getFocusedVisibleViews();

  // All possible navigation tools
  const allNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layers },
    { id: 'projects', label: 'Research Projects', icon: FolderKanban },
    { id: 'feedback', label: 'Customer Feedback', icon: FileSpreadsheet },
    { id: 'surveys', label: 'Surveys', icon: BarChart3 },
    { id: 'submissions', label: 'Submissions', icon: Inbox },
    { id: 'reports', label: 'Insights & Reports', icon: FileText },
    { id: 'documentation', label: 'Docs', icon: FileText },
  ];

  // Visible links in navbar
  const visibleNavItems = isFullPlatformMode
    ? allNavItems
    : allNavItems.filter((item) => focusedVisibleViews.includes(item.id));

  // Hidden links relegated to "More Tools" dropdown in focused mode
  const moreNavItems = isFullPlatformMode
    ? []
    : allNavItems.filter((item) => !focusedVisibleViews.includes(item.id));

  const roleShortName = isFounder
    ? 'Founder'
    : isCS
    ? 'Customer Success'
    : isResearcher
    ? 'Researcher'
    : 'Product Mgr';

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-6 lg:space-x-8">
            <button
              onClick={() => setCurrentView('dashboard')}
              className="flex items-center space-x-2.5 sm:space-x-3 text-left focus:outline-hidden group cursor-pointer"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-100 dark:shadow-none group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                    Signal<span className="text-indigo-600 dark:text-indigo-400">IQ</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[9px] sm:text-[10px] font-semibold tracking-wide bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800 rounded-md">
                    BETA
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                  Customer Intelligence
                </p>
              </div>
            </button>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {visibleNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    currentView === item.id
                      ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              {/* Active Workspace Link if Project Open */}
              {hasActiveProject && (
                <button
                  onClick={() => setCurrentView('workspace')}
                  className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer flex items-center space-x-1.5 ${
                    currentView === 'workspace'
                      ? 'text-indigo-700 dark:text-indigo-300 bg-indigo-50/80 dark:bg-indigo-950/60 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>
                    Workspace:{' '}
                    <span className="font-semibold text-slate-800 dark:text-slate-200 max-w-[110px] truncate inline-block align-bottom">
                      {activeProjectName}
                    </span>
                  </span>
                </button>
              )}

              {/* "More Tools ▾" dropdown in Focused Mode */}
              {!isFullPlatformMode && moreNavItems.length > 0 && (
                <div className="relative" ref={moreMenuRef}>
                  <button
                    onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                    className="px-2.5 py-2 text-xs sm:text-sm font-semibold rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center space-x-1 cursor-pointer"
                  >
                    <span>More Tools</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold">
                      +{moreNavItems.length}
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMoreMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isMoreMenuOpen && (
                    <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Additional Modules
                      </div>
                      {moreNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setCurrentView(item.id as any);
                              setIsMoreMenuOpen(false);
                            }}
                            className={`w-full px-3.5 py-2 text-left text-xs font-medium flex items-center space-x-2.5 transition cursor-pointer ${
                              currentView === item.id
                                ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-semibold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <Icon className="w-4 h-4 text-slate-400" />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                      <div className="mt-1 pt-1.5 border-t border-slate-100 dark:border-slate-800 px-3">
                        <button
                          onClick={() => {
                            if (onToggleFullPlatformMode) onToggleFullPlatformMode();
                            setIsMoreMenuOpen(false);
                          }}
                          className="w-full text-left text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline py-1"
                        >
                          Show all tools in main bar &rarr;
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Persona Customization Badge / Modal Trigger */}
            <button
              onClick={onOpenOnboardingModal}
              className="hidden lg:inline-flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition cursor-pointer"
              title="Click to customize your role & goals questionnaire"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Persona: {roleShortName}</span>
            </button>

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

            {/* Settings */}
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

            {/* Logout */}
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 rounded-lg text-rose-500 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-100 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors cursor-pointer flex items-center justify-center"
            >
              <LogOut className="w-5 h-5" />
            </button>

            {/* New Project Button */}
            <button
              onClick={onNewProject}
              className="inline-flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs shadow-indigo-200 dark:shadow-none transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Study</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
