import React, { useState } from 'react';
import { Survey, Project } from '../types';
import { api } from '../lib/api';
import { PublicSurveyView } from './PublicSurveyView';
import { EmailModal } from './EmailModal';
import {
  ListTodo,
  Globe,
  Eye,
  Mail,
  Copy,
  Check,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface SurveysViewProps {
  surveys: Survey[];
  projects: Project[];
  onOpenProjectWorkspace: (project: Project) => void;
  onRefreshSurveys: () => void;
}

export const SurveysView: React.FC<SurveysViewProps> = ({
  surveys,
  projects,
  onOpenProjectWorkspace,
  onRefreshSurveys,
}) => {
  const [selectedSurveyForRespondent, setSelectedSurveyForRespondent] = useState<Survey | null>(null);
  const [emailModalSurvey, setEmailModalSurvey] = useState<Survey | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyLink = (surveyId: string) => {
    const url = `${window.location.origin}/#survey-${surveyId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(surveyId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Targeted Research Surveys</h1>
          <p className="text-xs text-slate-500">
            Surveys crafted to fill specific knowledge gaps identified during evidence analysis.
          </p>
        </div>
      </div>

      {surveys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {surveys.map((survey) => {
            const project = projects.find((p) => p.id === survey.projectId);
            const surveyUrl = `${window.location.origin}/#survey-${survey.id}`;

            return (
              <div
                key={survey.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm ${
                        survey.status === 'published'
                          ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                          : survey.status === 'closed'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {survey.status}
                    </span>

                    <span className="text-xs font-bold text-slate-700">
                      {survey.responseCount || 0} response{(survey.responseCount || 0) === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{survey.title}</h3>
                    {project && (
                      <p className="text-xs text-indigo-600 font-semibold mt-0.5">
                        Project: {project.name}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                      {survey.introduction || 'Follow-up customer pulse survey.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>{survey.questions.length} targeted questions</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setSelectedSurveyForRespondent(survey)}
                      className="px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center space-x-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Test Survey</span>
                    </button>

                    {survey.status === 'published' && (
                      <>
                        <button
                          onClick={() => handleCopyLink(survey.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                          title="Copy Shareable Link"
                        >
                          {copiedId === survey.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setEmailModalSurvey(survey)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer"
                          title="Distribute via Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>

                  {project && (
                    <button
                      onClick={() => onOpenProjectWorkspace(project)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Workspace</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <ListTodo className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No surveys created yet</p>
          <p className="text-xs text-slate-400 mt-1">
            Surveys are generated from the research workspace when knowledge gaps exist in your evidence.
          </p>
        </div>
      )}

      {selectedSurveyForRespondent && (
        <PublicSurveyView
          survey={selectedSurveyForRespondent}
          onClose={() => setSelectedSurveyForRespondent(null)}
          onResponseSubmitted={() => {
            onRefreshSurveys();
          }}
        />
      )}

      {emailModalSurvey && (
        <EmailModal
          isOpen={Boolean(emailModalSurvey)}
          onClose={() => setEmailModalSurvey(null)}
          surveyUrl={`${window.location.origin}/#survey-${emailModalSurvey.id}`}
          surveyTitle={emailModalSurvey.title}
        />
      )}
    </div>
  );
};
