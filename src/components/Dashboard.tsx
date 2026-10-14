import React from 'react';
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
  onNavigate?: (view: 'projects' | 'surveys' | 'feedback' | 'submissions') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  stats,
  onNewProject,
  onOpenProject,
  onLoadScenario,
  onNavigate,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 transition-colors duration-200">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Customer Intelligence</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Understand customer problems with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-sky-300">
              evidence-backed confidence
            </span>
            .
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Analyse existing support tickets, reviews, transcripts, and heatmaps. SignalIQ determines whether your existing data is already sufficient, or generates a targeted survey only when knowledge gaps exist.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onNewProject}
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Create Research Project</span>
            </button>
            <span className="text-xs text-slate-400">or explore one of the pre-loaded scenarios below.</span>
          </div>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Live Application Data Metrics (Interactive Clickable KPIs) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Research Projects */}
        <div
          onClick={() => onNavigate?.('projects')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate?.('projects'); }}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          title="Click to view all research projects"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wide group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                Research Projects
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
                ({stats.completedProjects} analysed)
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Live projects in workspace</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
            <span>View projects</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* KPI 2: Customer Feedback */}
        <div
          onClick={() => onNavigate?.('feedback')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate?.('feedback'); }}
          className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between"
          title="Click to explore all customer feedback records and sources"
        >
          <div>
            <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
              <span className="text-xs font-semibold uppercase tracking-wide group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Customer Feedback
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
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Traceable feedback processed</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <span>Explore {stats.totalFeedbackRecords} records</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* KPI 3: Targeted Surveys */}
        <div
          onClick={() => onNavigate?.('surveys')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate?.('surveys'); }}
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
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">drafted</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Targeted to specific gaps</p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] font-bold text-sky-600 dark:text-sky-400">
            <span>Manage surveys</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* KPI 4: Actual Submissions */}
        <div
          onClick={() => onNavigate?.('submissions')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onNavigate?.('submissions'); }}
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

      {/* Interactive Test Scenarios Carousel (Testing All Requirements) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Compass className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>One-Click Test Scenarios (AC Verification)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Instantly test SignalIQ against the key acceptance criteria scenarios with synthetic data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_DATASETS.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-5 flex flex-col justify-between transition-all hover:shadow-md group"
            >
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
                  className="w-full py-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                >
                  <span>Launch Scenario</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recently Accessed Projects List */}
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
