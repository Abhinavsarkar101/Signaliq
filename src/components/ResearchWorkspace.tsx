import React, { useState } from 'react';
import { Project } from '../types';
import { api } from '../lib/api';
import { BriefStep } from './BriefStep';
import { EvidenceUploadStep } from './EvidenceUploadStep';
import { FeedbackHubView } from './FeedbackHubView';
import { AnalysisStep } from './AnalysisStep';
import { SurveyBuilderStep } from './SurveyBuilderStep';
import { ReportStep } from './ReportStep';
import {
  FileText,
  UploadCloud,
  BarChart3,
  CheckCircle2,
  ListTodo,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface ResearchWorkspaceProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => Promise<void>;
  onBackToProjects: () => void;
}

export type WorkspaceStep = 'brief' | 'upload' | 'feedback_hub' | 'analysis' | 'survey' | 'report';

export const ResearchWorkspace: React.FC<ResearchWorkspaceProps> = ({
  project,
  onUpdateProject,
  onBackToProjects,
}) => {
  // Determine initial step based on project state
  const getInitialStep = (): WorkspaceStep => {
    if (project.analysis) return 'analysis';
    if (project.sources && project.sources.length > 0) return 'feedback_hub';
    return 'brief';
  };

  const [activeStep, setActiveStep] = useState<WorkspaceStep>(getInitialStep());
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    if (!project.sources || project.sources.length === 0) {
      alert('Please upload at least one evidence source first.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const result = await api.analyzeFeedback({
        brief: project.brief,
        objective: project.objective,
        sources: project.sources,
      });

      await onUpdateProject({
        analysis: result,
        status: 'analyzed',
      });

      setActiveStep('analysis');
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'Analysis failed. Please check network and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const steps = [
    { id: 'brief', label: '1. Objective & AI Brief', icon: FileText },
    { id: 'upload', label: '2. Evidence Upload', icon: UploadCloud, badge: project.sources?.length || 0 },
    { id: 'feedback_hub', label: '3. VoC & Churn Intelligence', icon: Sparkles, badge: 'New' },
    { id: 'analysis', label: '4. Analysis & Sufficiency', icon: BarChart3, badge: project.analysis ? '✓' : undefined },
    { id: 'survey', label: '5. Targeted Survey', icon: ListTodo, badge: project.survey ? 'Ready' : undefined },
    { id: 'report', label: '6. Consolidated Report', icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Workspace Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <button
              onClick={onBackToProjects}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1 cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Projects</span>
            </button>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-sm bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300">
              {project.category}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {project.name}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-2xl truncate">
            {project.objective}
          </p>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-3 self-end md:self-center">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Status:{' '}
            <strong className="text-slate-800 dark:text-slate-200 capitalize">
              {project.status.replace('_', ' ')}
            </strong>
          </span>
        </div>
      </div>

      {/* Stepper Navigation Tabs */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl shadow-2xs p-1.5 overflow-x-auto">
        <div className="flex items-center space-x-1 min-w-max">
          {steps.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(step.id as WorkspaceStep)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-200 dark:shadow-none'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{step.label}</span>
                {step.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {step.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {analysisError && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs text-rose-800 dark:text-rose-200 flex items-center justify-between">
          <span>{analysisError}</span>
          <button
            onClick={() => setAnalysisError(null)}
            className="font-bold underline hover:text-rose-950 dark:hover:text-rose-100 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Step View Content */}
      <main className="transition-all">
        {activeStep === 'brief' && (
          <BriefStep
            project={project}
            onUpdateProject={onUpdateProject}
            onNextStep={() => setActiveStep('upload')}
          />
        )}

        {activeStep === 'upload' && (
          <EvidenceUploadStep
            project={project}
            onUpdateProject={onUpdateProject}
            onRunAnalysis={handleRunAnalysis}
            isAnalyzing={isAnalyzing}
            onNextStep={() => setActiveStep('feedback_hub')}
          />
        )}

        {activeStep === 'feedback_hub' && (
          <FeedbackHubView
            project={project}
            onUpdateProject={onUpdateProject}
          />
        )}

        {activeStep === 'analysis' && (
          <AnalysisStep
            project={project}
            onProceedToSurvey={() => setActiveStep('survey')}
            onProceedToReport={() => setActiveStep('report')}
          />
        )}

        {activeStep === 'survey' && (
          <SurveyBuilderStep
            project={project}
            onUpdateProject={onUpdateProject}
            onProceedToReport={() => setActiveStep('report')}
          />
        )}

        {activeStep === 'report' && <ReportStep project={project} />}
      </main>
    </div>
  );
};
