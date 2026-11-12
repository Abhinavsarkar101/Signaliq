import React, { useState } from 'react';
import { Project } from '../types';
import { SAMPLE_DATASETS, SampleDataset } from '../lib/sampleData';
import {
  Plus,
  BarChart3,
  FileSpreadsheet,
  CheckCircle2,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Layers,
  Clock,
  Compass,
  Sliders,
  Target,
  Users,
  TrendingDown,
  TrendingUp,
  FileText,
  Inbox,
  Settings,
  ChevronDown,
  Eye,
  EyeOff,
  Filter,
} from 'lucide-react';

interface DashboardProps {
  projects: Project[];
  stats: {
    totalProjects: number;
    completedProjects: number;
    totalSurveys: number;
    totalResponses: number;
    totalFeedbackRecords: number;
  };
  onNewProject: () => void;
  onOpenProject: (project: Project) => void;
  onLoadScenario: (scenario: SampleDataset) => void;
  onNavigate?: (view: 'projects' | 'surveys' | 'feedback' | 'submissions' | 'reports' | 'settings' | 'workspace') => void;
  userProfile?: Record<string, string>;
  isFullPlatformMode?: boolean;
  onToggleFullPlatformMode?: () => void;
  onOpenOnboardingModal?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  stats,
  onNewProject,
  onOpenProject,
  onLoadScenario,
  onNavigate,
  userProfile = {},
  isFullPlatformMode = false,
  onToggleFullPlatformMode,
  onOpenOnboardingModal,
}) => {
  const userRole = userProfile.role || 'Product Manager / Designer';
  const userGoal = userProfile.goal || 'Feature Prioritization & Product Roadmap';
  const userEvidence = userProfile.dataSource || 'Multi-Channel Combined Datasets';
  const userFocus = userProfile.primaryFocus || 'AI Feedback Synthesis & Pain Point Clustering';

  // Role detection helpers
  const isFounder = userRole.toLowerCase().includes('founder') || userRole.toLowerCase().includes('executive');
  const isPM = userRole.toLowerCase().includes('product');
  const isCS = userRole.toLowerCase().includes('success') || userRole.toLowerCase().includes('support');
  const isResearcher = userRole.toLowerCase().includes('research') || userRole.toLowerCase().includes('analyst');

  // Goal detection helpers
  const isChurnGoal = userGoal.toLowerCase().includes('churn');
  const isOnboardingGoal = userGoal.toLowerCase().includes('onboarding');
  const isFeatureGoal = userGoal.toLowerCase().includes('feature');
  const isSentimentGoal = userGoal.toLowerCase().includes('sentiment') || userGoal.toLowerCase().includes('csat');

  // Tailored Hero Content
  const getHeroContent = () => {
    if (isFounder || isChurnGoal) {
      return {
        badge: 'Executive Churn Telemetry',
        titlePrefix: 'High-conviction intelligence to',
        highlight: 'stop churn and protect revenue',
        description:
          'Automated decision briefs, retention risk drivers, and customer friction patterns synthesized directly from your customer feedback.',
        ctaText: 'Start Churn Investigation',
        recommendedScenarios: ['checkout_drop', 'interview_transcript'],
      };
    }
    if (isCS || isSentimentGoal) {
      return {
        badge: 'Customer Voice & CSAT Health',
        titlePrefix: 'Transform noisy customer tickets into',
        highlight: 'preventative customer success',
        description:
          'Monitor satisfaction drift, detect recurring ticket friction, and deploy targeted follow-up surveys to save at-risk accounts.',
        ctaText: 'Ingest Support Tickets',
        recommendedScenarios: ['onboard_tickets', 'checkout_drop'],
      };
    }
    if (isResearcher) {
      return {
        badge: 'Empirical Research Triangulation',
        titlePrefix: 'Evidence-based synthesis with',
        highlight: 'statistically sound data sufficiency',
        description:
          'Triangulate qualitative interview transcripts, support logs, and survey ratings with citation-backed quotes and gap diagnostics.',
        ctaText: 'Create Research Project',
        recommendedScenarios: ['interview_transcript', 'onboard_tickets'],
      };
    }
    // Default Product Manager
    return {
      badge: 'Product Discovery & Roadmap Validation',
      titlePrefix: 'Back your product decisions with',
      highlight: 'traceable user pain point evidence',
      description:
        'Cluster user feature demands, identify workflow hesitation, and validate problem statements before writing code.',
      ctaText: 'Create Research Project',
      recommendedScenarios: ['onboard_tickets', 'interview_transcript'],
    };
  };

  const hero = getHeroContent();

  // Curated scenarios matching the user's role and goal
  const curatedScenarios = SAMPLE_DATASETS.map((s) => ({
    ...s,
    isRecommended: hero.recommendedScenarios.includes(s.id),
  })).sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors duration-200">
      {/* ========================================================================= */}
      {/* PERSONA CUSTOMIZATION BANNER (Answers From Questionnaire)                */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center space-x-3.5 flex-wrap gap-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Active Workspace Persona:
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                {userRole}
              </span>
              <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">&bull;</span>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                Goal: <strong className="text-slate-900 dark:text-white font-semibold">{userGoal}</strong>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {isFullPlatformMode
                ? 'Showing all platform modules & tools. Toggle to Focused Mode for a streamlined role view.'
                : 'Dashboard and navigation are streamlined for your role. Other tools are accessible below.'}
            </p>
          </div>
        </div>

        {/* View Mode Controls & Re-take Questionnaire */}
        <div className="flex items-center space-x-2 self-start lg:self-center flex-wrap gap-y-2">
          {/* Toggle between Focused Mode and All Features */}
          <button
            onClick={onToggleFullPlatformMode}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
              isFullPlatformMode
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-300 dark:border-slate-700'
                : 'bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-800'
            }`}
            title="Toggle between Role-Tailored Focused View and Complete Platform View"
          >
            {isFullPlatformMode ? (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Full Platform View (All Tools)</span>
              </>
            ) : (
              <>
                <Filter className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>Focused Role View Active</span>
              </>
            )}
          </button>

          {/* Re-take / Edit Questionnaire Button */}
          <button
            onClick={onOpenOnboardingModal}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition cursor-pointer"
            title="Update your role, goal, or data source questions to adapt the dashboard"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize Persona & Goals</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HERO WELCOME BANNER (Dynamically Tailored to Role & Goal)                 */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{hero.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {hero.titlePrefix}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-sky-300 to-indigo-200">
              {hero.highlight}
            </span>
            .
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {hero.description}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onNewProject}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>{hero.ctaText}</span>
            </button>
            <span className="text-xs text-slate-400">
              or run a curated test scenario below.
            </span>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* ========================================================================= */}
      {/* TAILORED KPIS / METRICS CARDS                                             */}
      {/* ========================================================================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {isFullPlatformMode ? 'Comprehensive Platform Telemetry' : `Tailored Telemetry for ${userRole}`}
            </span>
            {!isFullPlatformMode && (
              <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                Role-Focused
              </span>
            )}
          </div>
          {onToggleFullPlatformMode && (
            <button
              onClick={onToggleFullPlatformMode}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              {isFullPlatformMode ? '← Switch to Focused KPIs' : 'View all 4 platform metrics →'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Primary Research Projects */}
          <div
            onClick={() => onNavigate?.('projects')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onNavigate?.('projects');
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            title="Click to view all research studies"
          >
            <div>
              <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wide group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {isFounder ? 'Strategic Studies' : isPM ? 'Hypothesis Studies' : 'Research Projects'}
                </span>
                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {stats.totalProjects}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  ({stats.completedProjects} analyzed)
                </span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                {isFounder ? 'Active boardroom studies' : 'Live projects in workspace'}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              <span>View studies</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* KPI 2: Customer Feedback & Friction Signals */}
          <div
            onClick={() => onNavigate?.('feedback')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onNavigate?.('feedback');
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            title="Click to explore all customer feedback records and sources"
          >
            <div>
              <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wide group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {isChurnGoal ? 'At-Risk Feedback' : isCS ? 'Support Tickets' : 'Customer Feedback'}
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {stats.totalFeedbackRecords}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">records</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">
                {isCS ? 'Ingested customer conversations' : 'Traceable feedback processed'}
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <span>Explore {stats.totalFeedbackRecords} records</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* KPI 3: Surveys or Executive Reports depending on persona */}
          {isFounder ? (
            <div
              onClick={() => onNavigate?.('reports')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onNavigate?.('reports');
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              title="Click to view executive reports and briefs"
            >
              <div>
                <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wide group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    Executive Reports
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-purple-50 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {stats.completedProjects}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">ready</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Decision-ready presentations</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-purple-600 dark:text-purple-400">
                <span>Open reports</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ) : (
            <div
              onClick={() => onNavigate?.('surveys')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onNavigate?.('surveys');
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-sky-400 dark:hover:border-sky-500 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              title="Click to view and manage targeted surveys"
            >
              <div>
                <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                  <span className="text-xs font-semibold uppercase tracking-wide group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    Targeted Surveys
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                    {stats.totalSurveys}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">campaigns</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Closing critical data gaps</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-sky-600 dark:text-sky-400">
                <span>Manage surveys</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          )}

          {/* KPI 4: Actual Submissions */}
          <div
            onClick={() => onNavigate?.('submissions')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onNavigate?.('submissions');
            }}
            className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
            title="Click to explore actual survey submissions and respondent answers"
          >
            <div>
              <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wide group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  Actual Submissions
                </span>
                <div className="w-7 h-7 rounded-lg bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-2 flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                  {stats.totalResponses}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">responses</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Stored respondent inputs</p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-teal-600 dark:text-teal-400">
              <span>View {stats.totalResponses} submissions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CURATED TEST SCENARIOS (Highlighted by Relevance to Goal)                 */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Recommended Test Scenarios
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pre-loaded scenarios prioritized for your goal:{' '}
              <strong className="text-indigo-600 dark:text-indigo-400">{userGoal}</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {curatedScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`bg-white dark:bg-slate-900 rounded-2xl border p-5 flex flex-col justify-between transition-all hover:shadow-md group relative ${
                scenario.isRecommended
                  ? 'border-indigo-400 dark:border-indigo-600 ring-1 ring-indigo-400/30'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {scenario.isRecommended && (
                <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wide shadow-xs">
                  ★ Recommended
                </div>
              )}

              <div className="space-y-2.5">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm inline-block ${
                    scenario.expectedOutcome === 'A_SUFFICIENT'
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                      : scenario.expectedOutcome === 'B_PARTIALLY_SUFFICIENT'
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                      : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {scenario.scenario}
                </span>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {scenario.title}
                </h3>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onLoadScenario(scenario)}
                  className={`w-full py-2 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer ${
                    scenario.isRecommended
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      : 'bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  <span>Launch Scenario</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* "EXPLORE OTHER OPTIONS / FEATURES" SECTION (Always Accessible!)            */}
      {/* ========================================================================= */}
      <div className="p-6 bg-slate-50/80 dark:bg-slate-900/60 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
                Explore All Platform Features & Modules
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              You are currently viewing role-filtered recommendations. Click any module below to explore other tools:
            </p>
          </div>

          <button
            onClick={onToggleFullPlatformMode}
            className="self-start sm:self-center px-3.5 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-100/70 dark:bg-indigo-950/80 hover:bg-indigo-200 dark:hover:bg-indigo-900 rounded-xl transition cursor-pointer"
          >
            {isFullPlatformMode ? 'Switch to Focused Mode' : 'Enable Full Platform Mode'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
          {/* Module 1: Targeted Surveys */}
          <div
            onClick={() => onNavigate?.('surveys')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 transition cursor-pointer group shadow-2xs hover:shadow-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <BarChart3 className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
              Targeted Survey Builder
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Generate gap-closing micro-surveys and share live public links.
            </p>
            <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-2.5 inline-flex items-center space-x-1">
              <span>Open Surveys</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Module 2: Feedback Explorer */}
          <div
            onClick={() => onNavigate?.('feedback')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 transition cursor-pointer group shadow-2xs hover:shadow-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
              Customer Feedback Hub
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Search and filter across {stats.totalFeedbackRecords} ingested tickets and quotes.
            </p>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-2.5 inline-flex items-center space-x-1">
              <span>Explore Feedback</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Module 3: Submissions Explorer */}
          <div
            onClick={() => onNavigate?.('submissions')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-400 dark:hover:border-teal-500 transition cursor-pointer group shadow-2xs hover:shadow-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <Inbox className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400">
              Live Submissions Hub
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Track real-time respondent answers and telemetry ({stats.totalResponses} logged).
            </p>
            <span className="text-[11px] font-bold text-teal-600 dark:text-teal-400 mt-2.5 inline-flex items-center space-x-1">
              <span>View Submissions</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>

          {/* Module 4: Executive Reports */}
          <div
            onClick={() => onNavigate?.('reports')}
            className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-500 transition cursor-pointer group shadow-2xs hover:shadow-xs"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-2.5 group-hover:scale-105 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
              Executive Reports Library
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              Actionable recommendations, boardroom slides, and PDF report exports.
            </p>
            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 mt-2.5 inline-flex items-center space-x-1">
              <span>Open Reports</span>
              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RECENTLY ACCESSED PROJECTS LIST                                           */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Research Projects</h2>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Sorted by last activity</span>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0, 6).map((project) => {
              const outcome = project.analysis?.sufficiencyAssessment?.outcome;
              return (
                <div
                  key={project.id}
                  onClick={() => onOpenProject(project)}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-sm">
                        {project.category}
                      </span>

                      {outcome && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-sm ${
                            outcome === 'A_SUFFICIENT'
                              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                              : outcome === 'B_PARTIALLY_SUFFICIENT'
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                              : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {outcome === 'A_SUFFICIENT'
                            ? 'Sufficient'
                            : outcome === 'B_PARTIALLY_SUFFICIENT'
                            ? 'Knowledge Gap'
                            : 'Insufficient'}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        "{project.objective}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400">
                      <div>
                        <span className="text-slate-400 dark:text-slate-500">Sources: </span>
                        <strong className="text-slate-700 dark:text-slate-300">{project.sources?.length || 0}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 dark:text-slate-500">Status: </span>
                        <strong className="text-slate-700 dark:text-slate-300 capitalize">
                          {project.status.replace('_', ' ')}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>Open Research Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No research projects yet.</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Create your first project to begin analysing customer feedback.
            </p>
            <button
              onClick={onNewProject}
              className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              + Create Research Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
