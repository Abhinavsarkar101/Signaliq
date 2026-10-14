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
}

export const Dashboard: React.FC<DashboardProps> = ({
  projects,
  stats,
  onNewProject,
  onOpenProject,
  onLoadScenario,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 shadow-xl border border-indigo-900/40">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI-Powered Customer Intelligence</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Understand customer problems with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-sky-300">evidence-backed confidence</span>.
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

      {/* Live Application Data Metrics (FR-01 / AC-01.8 - reflecting actual saved app data) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wide">Research Projects</span>
            <Layers className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.totalProjects}</span>
            <span className="text-xs text-slate-500 font-medium">({stats.completedProjects} analysed)</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Live projects in workspace</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wide">Customer Feedback</span>
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.totalFeedbackRecords}</span>
            <span className="text-xs text-slate-500 font-medium">records</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Traceable feedback processed</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wide">Targeted Surveys</span>
            <BarChart3 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.totalSurveys}</span>
            <span className="text-xs text-slate-500 font-medium">drafted</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Targeted to specific gaps</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold uppercase tracking-wide">Actual Submissions</span>
            <CheckCircle2 className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.totalResponses}</span>
            <span className="text-xs text-slate-500 font-medium">responses</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Stored respondent inputs</p>
        </div>
      </div>

      {/* Interactive Test Scenarios Carousel (Testing All Requirements) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>One-Click Test Scenarios (AC Verification)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Instantly test SignalIQ against the key acceptance criteria scenarios with synthetic data.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_DATASETS.map((scenario) => (
            <div
              key={scenario.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-5 flex flex-col justify-between transition-all hover:shadow-md group"
            >
              <div className="space-y-2.5">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm inline-block ${
                    scenario.expectedOutcome === 'A_SUFFICIENT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : scenario.expectedOutcome === 'B_PARTIALLY_SUFFICIENT'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {scenario.scenario}
                </span>

                <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {scenario.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                  {scenario.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={() => onLoadScenario(scenario)}
                  className="w-full py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-600 hover:text-indigo-700 text-xs font-bold rounded-lg flex items-center justify-center space-x-1 transition-colors cursor-pointer"
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
          <h2 className="text-lg font-bold text-slate-900">Recent Research Projects</h2>
          <span className="text-xs text-slate-500 font-medium">Sorted by last activity</span>
        </div>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.slice(0, 6).map((project) => {
              const outcome = project.analysis?.sufficiencyAssessment?.outcome;
              return (
                <div
                  key={project.id}
                  onClick={() => onOpenProject(project)}
                  className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-400 p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 rounded-sm">
                        {project.category}
                      </span>

                      {outcome && (
                        <span
                          className={`px-2 py-0.5 text-[10px] font-bold rounded-sm ${
                            outcome === 'A_SUFFICIENT'
                              ? 'bg-emerald-100 text-emerald-800'
                              : outcome === 'B_PARTIALLY_SUFFICIENT'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {outcome === 'A_SUFFICIENT' ? 'Sufficient' : outcome === 'B_PARTIALLY_SUFFICIENT' ? 'Knowledge Gap' : 'Insufficient'}
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {project.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        "{project.objective}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                      <div>
                        <span className="text-slate-400">Sources: </span>
                        <strong className="text-slate-700">{project.sources?.length || 0}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400">Status: </span>
                        <strong className="text-slate-700 capitalize">{project.status.replace('_', ' ')}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 flex items-center justify-between text-xs text-indigo-600 font-bold group-hover:translate-x-0.5 transition-transform">
                    <span>Open Research Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <p className="text-sm font-semibold text-slate-700">No research projects yet.</p>
            <p className="text-xs text-slate-400 mt-1">Create your first project to begin analysing customer feedback.</p>
            <button
              onClick={onNewProject}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
            >
              + Create Research Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
