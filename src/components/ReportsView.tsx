import React from 'react';
import { Project } from '../types';
import {
  FileText,
  ShieldCheck,
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  Layers,
  Sparkles,
  Download,
} from 'lucide-react';

interface ReportsViewProps {
  projects: Project[];
  onOpenReport: (project: Project) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  projects,
  onOpenReport,
}) => {
  const completedProjects = projects.filter((p) => p.analysis);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Insights & Intelligence Reports
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Executive research summaries backed by customer evidence, quotes, and tested hypotheses.
        </p>
      </div>

      {completedProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {completedProjects.map((project) => {
            const analysis = project.analysis!;
            const outcome = analysis.sufficiencyAssessment.outcome;

            return (
              <div
                key={project.id}
                onClick={() => onOpenReport(project)}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-500 p-6 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-sm">
                      {project.category}
                    </span>

                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-sm flex items-center space-x-1 ${
                        outcome === 'A_SUFFICIENT'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : outcome === 'B_PARTIALLY_SUFFICIENT'
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                      }`}
                    >
                      {outcome === 'A_SUFFICIENT' ? 'Sufficient' : outcome === 'B_PARTIALLY_SUFFICIENT' ? 'Partial' : 'Insufficient'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      "{project.objective}"
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-150 line-clamp-1">
                      {analysis.sufficiencyAssessment.statusHeadline}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      Analysed {analysis.validRecords} records &bull; {analysis.recurringThemes.length} themes &bull; {analysis.recommendations.length} recommendations
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>View Full Intelligence Report</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500">
          <FileText className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No reports generated yet</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            Create a research project and run feedback analysis to generate your first intelligence report.
          </p>
        </div>
      )}
    </div>
  );
};
