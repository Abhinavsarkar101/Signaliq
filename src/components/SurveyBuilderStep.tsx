import React, { useState, useEffect } from 'react';
import { Project, Survey, SurveyQuestion, QuestionType } from '../types';
import { api } from '../lib/api';
import { PublicSurveyView } from './PublicSurveyView';
import { EmailModal } from './EmailModal';
import { HelpTooltip } from './HelpTooltip';
import {
  Sparkles,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Globe,
  Share2,
  Mail,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  Eye,
  Edit2,
  Save,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface SurveyBuilderStepProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => Promise<void>;
  onProceedToReport: () => void;
}

export const SurveyBuilderStep: React.FC<SurveyBuilderStepProps> = ({
  project,
  onUpdateProject,
  onProceedToReport,
}) => {
  const [survey, setSurvey] = useState<Survey | undefined>(project.survey);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSurvey(project.survey);
  }, [project.id, project.survey]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showRespondentModal, setShowRespondentModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [responses, setResponses] = useState<any[]>([]);
  const [isLoadingResponses, setIsLoadingResponses] = useState(false);

  // Generate survey using Gemini based on identified knowledge gaps
  const handleGenerateSurvey = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const gaps = project.analysis?.sufficiencyAssessment || {
        whatRemainsUnknown: ['Why do users drop off before completing setup?'],
      };

      const generated = await api.generateSurvey({
        brief: project.brief,
        objective: project.objective,
        sufficiencyAssessment: gaps,
        targetSegment: project.customerSegment,
        desiredOutcome: project.desiredOutcome,
      });

      const newSurvey: Survey = {
        id: `srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        projectId: project.id,
        title: generated.title || `${project.name} Follow-up Survey`,
        introduction:
          generated.introduction ||
          'Help us improve your experience with a few quick questions (less than 1 minute).',
        status: 'draft',
        createdAt: new Date().toISOString(),
        questions: (generated.questions || []).map((q: any, idx: number) => ({
          id: `q_${Date.now()}_${idx}`,
          text: q.text || 'Question text',
          type: (q.type as QuestionType) || 'single_choice',
          options: q.options || (q.type === 'single_choice' ? ['Option 1', 'Option 2', 'Other'] : undefined),
          required: q.required ?? true,
          addressesResearchGap:
            q.addressesResearchGap || 'Clarifies customer friction identified in previous feedback',
        })),
        closingMessage: generated.closingMessage || 'Thank you for your valuable feedback!',
        responseCount: 0,
      };

      const saved = await api.saveSurvey(newSurvey);
      setSurvey(saved);
      await onUpdateProject({ survey: saved, status: 'survey_created' });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate targeted survey.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishSurvey = async () => {
    if (!survey) return;

    // Validation (AC-06.6)
    for (const q of survey.questions) {
      if (!q.text.trim()) {
        setError('Every question must have non-empty text before publishing.');
        return;
      }
      if ((q.type === 'single_choice' || q.type === 'multiple_choice') && (!q.options || q.options.length < 2)) {
        setError(`Question "${q.text}" requires at least 2 answer choices.`);
        return;
      }
    }

    try {
      const updated = await api.updateSurveyStatus(survey.id, 'published');
      setSurvey(updated);
      await onUpdateProject({ survey: updated });
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to publish survey');
    }
  };

  const handleCloseSurvey = async () => {
    if (!survey) return;
    try {
      const updated = await api.updateSurveyStatus(survey.id, 'closed');
      setSurvey(updated);
      await onUpdateProject({ survey: updated });
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleAddQuestion = () => {
    if (!survey) return;
    const newQ: SurveyQuestion = {
      id: `q_${Date.now()}`,
      text: 'What was your primary motivation for testing this feature?',
      type: 'single_choice',
      options: ['Feature capability', 'Team recommendation', 'Price / ROI', 'Other'],
      required: true,
      addressesResearchGap: 'Investigates user intent and primary evaluation criteria.',
    };
    const updated = {
      ...survey,
      questions: [...survey.questions, newQ],
    };
    setSurvey(updated);
    setEditingQuestionId(newQ.id);
  };

  const handleUpdateQuestion = (qId: string, updates: Partial<SurveyQuestion>) => {
    if (!survey) return;
    const updatedQuestions = survey.questions.map((q) => (q.id === qId ? { ...q, ...updates } : q));
    const updated = { ...survey, questions: updatedQuestions };
    setSurvey(updated);
  };

  const handleDeleteQuestion = (qId: string) => {
    if (!survey) return;
    const updated = {
      ...survey,
      questions: survey.questions.filter((q) => q.id !== qId),
    };
    setSurvey(updated);
  };

  const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
    if (!survey) return;
    const newQuestions = [...survey.questions];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newQuestions.length) return;
    const temp = newQuestions[index];
    newQuestions[index] = newQuestions[targetIdx];
    newQuestions[targetIdx] = temp;
    setSurvey({ ...survey, questions: newQuestions });
  };

  const handleFetchResponses = async () => {
    if (!survey) return;
    setIsLoadingResponses(true);
    try {
      const data = await api.getSurveyResponses(survey.id);
      setResponses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingResponses(false);
    }
  };

  const surveyUrl = `${window.location.origin}/#survey-${survey?.id || ''}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(surveyUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* If No Survey Yet: Generation Banner */}
      {!survey ? (
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/70 dark:from-indigo-950/50 dark:via-slate-900 dark:to-sky-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900 p-8 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-indigo-100 dark:shadow-none">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Generate Targeted Research Survey</h3>
              <HelpTooltip content="Automatically formulates focused questions to resolve unanswered blind spots identified in evidence analysis." />
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
              Based on the specific knowledge gaps identified in your evidence analysis, SignalIQ drafts neutral, focused survey questions to resolve outstanding questions.
            </p>
          </div>

          {error && (
            <div className="max-w-md mx-auto p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <div className="pt-2 flex items-center justify-center space-x-3">
            <button
              onClick={handleGenerateSurvey}
              disabled={isGenerating}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Drafting Questions with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Survey from Gaps</span>
                </>
              )}
            </button>

            <button
              onClick={onProceedToReport}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Skip Survey & Go to Report
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Survey Control & Status Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2.5">
                <span
                  className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-sm ${
                    survey.status === 'published'
                      ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 animate-pulse border border-emerald-200 dark:border-emerald-800'
                      : survey.status === 'closed'
                      ? 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  }`}
                >
                  {survey.status}
                </span>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{survey.title}</h3>
                  <HelpTooltip content="Research survey tailored to close specific qualitative knowledge gaps." />
                </div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Created to resolve:{' '}
                <strong className="text-slate-700 dark:text-slate-200">
                  {project.analysis?.sufficiencyAssessment?.whatRemainsUnknown?.[0] || project.objective}
                </strong>
              </p>
            </div>

            {/* Actions: Publish, Preview, Distribute */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setShowRespondentModal(true)}
                className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center space-x-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Test as Respondent</span>
              </button>

              {survey.status === 'draft' ? (
                <button
                  onClick={handlePublishSurvey}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs flex items-center space-x-1.5 cursor-pointer"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>Publish Survey</span>
                </button>
              ) : survey.status === 'published' ? (
                <>
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="px-3 py-2 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 rounded-lg flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Distribute</span>
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg flex items-center space-x-1.5 cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied Link' : 'Copy Link'}</span>
                  </button>

                  <button
                    onClick={handleCloseSurvey}
                    className="px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                  >
                    Close Survey
                  </button>
                </>
              ) : (
                <button
                  onClick={handlePublishSurvey}
                  className="px-3 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                >
                  Re-open Survey
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Survey Questions List */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
            <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Targeted Survey Questions ({survey.questions.length})
                </h4>
                <HelpTooltip content="Questions crafted with neutral framing to avoid confirmation bias while gathering missing data." />
              </div>
              <button
                onClick={handleAddQuestion}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {survey.questions.map((q, idx) => {
                const isEditing = editingQuestionId === q.id;
                return (
                  <div key={q.id} className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        {isEditing ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              value={q.text}
                              onChange={(e) => handleUpdateQuestion(q.id, { text: e.target.value })}
                              className="w-full text-sm font-bold p-2 border border-indigo-300 dark:border-indigo-700 rounded-lg bg-white dark:bg-slate-950 text-slate-900 dark:text-white"
                            />
                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <label className="block text-slate-500 dark:text-slate-400 mb-1">Question Type</label>
                                <select
                                  value={q.type}
                                  onChange={(e) =>
                                    handleUpdateQuestion(q.id, {
                                      type: e.target.value as QuestionType,
                                      options:
                                        e.target.value === 'single_choice' || e.target.value === 'multiple_choice'
                                          ? q.options || ['Option 1', 'Option 2']
                                          : undefined,
                                    })
                                  }
                                  className="w-full p-1.5 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                  <option value="single_choice">Single Choice (Radio)</option>
                                  <option value="multiple_choice">Multiple Choice (Checkboxes)</option>
                                  <option value="rating_scale">Rating Scale (1-5)</option>
                                  <option value="short_text">Short Text</option>
                                  <option value="long_text">Long Text</option>
                                  <option value="yes_no">Yes / No</option>
                                </select>
                              </div>

                              <div className="flex items-center space-x-2 pt-4">
                                <label className="flex items-center space-x-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={q.required}
                                    onChange={(e) => handleUpdateQuestion(q.id, { required: e.target.checked })}
                                    className="rounded-sm text-indigo-600"
                                  />
                                  <span>Required answer</span>
                                </label>
                              </div>
                            </div>

                            {/* Options if choice question */}
                            {(q.type === 'single_choice' || q.type === 'multiple_choice') && (
                              <div className="space-y-1.5">
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400">Answer Options:</label>
                                {q.options?.map((opt, oIdx) => (
                                  <div key={oIdx} className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={opt}
                                      onChange={(e) => {
                                        const newOpts = [...(q.options || [])];
                                        newOpts[oIdx] = e.target.value;
                                        handleUpdateQuestion(q.id, { options: newOpts });
                                      }}
                                      className="flex-1 text-xs p-1.5 border border-slate-200 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                    <button
                                      onClick={() => {
                                        const newOpts = (q.options || []).filter((_, i) => i !== oIdx);
                                        handleUpdateQuestion(q.id, { options: newOpts });
                                      }}
                                      className="text-slate-400 hover:text-rose-600"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                ))}
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleUpdateQuestion(q.id, {
                                      options: [...(q.options || []), `Option ${(q.options?.length || 0) + 1}`],
                                    });
                                  }}
                                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                                >
                                  + Add option
                                </button>
                              </div>
                            )}

                            <div>
                              <button
                                onClick={() => setEditingQuestionId(null)}
                                className="px-3 py-1 bg-indigo-600 text-white rounded-md text-xs font-semibold cursor-pointer"
                              >
                                Save Question
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                                {idx + 1}
                              </span>
                              <h5 className="text-sm font-bold text-slate-900 dark:text-white">
                                {q.text} {q.required && <span className="text-rose-500">*</span>}
                              </h5>
                              <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm">
                                {q.type.replace('_', ' ')}
                              </span>
                            </div>

                            {/* Addresses Knowledge Gap Callout */}
                            <div className="mt-2 ml-7 p-2 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-md border border-indigo-100/70 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-300">
                              <strong className="text-indigo-800 dark:text-indigo-200">Addresses Research Gap: </strong>
                              {q.addressesResearchGap}
                            </div>

                            {/* Options Preview */}
                            {q.options && (
                              <div className="mt-2 ml-7 flex flex-wrap gap-1.5">
                                {q.options.map((opt, oIdx) => (
                                  <span
                                    key={oIdx}
                                    className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md text-xs font-medium border border-slate-200/50 dark:border-slate-700"
                                  >
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Question Order & Controls */}
                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => handleMoveQuestion(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleMoveQuestion(idx, 'down')}
                          disabled={idx === survey.questions.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingQuestionId(isEditing ? null : q.id)}
                          className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer"
                          title="Edit question"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actual Collected Responses Viewer */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Collected Survey Responses ({survey.responseCount || 0})
                    </h4>
                    <HelpTooltip content="Real respondent submissions captured from public survey links and email distributions." />
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Real respondent submissions stored in database</p>
                </div>
              </div>

              <button
                onClick={handleFetchResponses}
                className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {isLoadingResponses ? 'Loading...' : 'Refresh Responses'}
              </button>
            </div>

            {responses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="p-2 border-b border-slate-200 dark:border-slate-700">Respondent ID</th>
                      <th className="p-2 border-b border-slate-200 dark:border-slate-700">Submitted At</th>
                      {survey.questions.map((q) => (
                        <th key={q.id} className="p-2 border-b border-slate-200 dark:border-slate-700 max-w-xs truncate">
                          {q.text}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {responses.map((resp) => (
                      <tr key={resp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <td className="p-2 font-mono font-medium text-slate-600 dark:text-slate-400">{resp.id}</td>
                        <td className="p-2 text-slate-400">
                          {new Date(resp.submittedAt).toLocaleTimeString()}
                        </td>
                        {survey.questions.map((q) => {
                          const val = resp.answers[q.id];
                          const display = Array.isArray(val) ? val.join(', ') : String(val ?? '-');
                          return (
                            <td key={q.id} className="p-2 max-w-xs truncate text-slate-800 dark:text-slate-200">
                              {display}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs">
                <p>No submitted responses yet. Use "Test as Respondent" to submit a test response.</p>
              </div>
            )}
          </div>

          {/* Navigation to Report */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              onClick={onProceedToReport}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              <span>View Consolidated Report</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Respondent Experience Modal */}
      {showRespondentModal && survey && (
        <PublicSurveyView
          survey={survey}
          onClose={() => setShowRespondentModal(false)}
          onResponseSubmitted={() => {
            handleFetchResponses();
            if (survey) {
              setSurvey({ ...survey, responseCount: (survey.responseCount || 0) + 1 });
            }
          }}
        />
      )}

      {/* Email Distribution Modal */}
      {showEmailModal && survey && (
        <EmailModal
          isOpen={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          surveyId={survey.id}
          projectId={survey.projectId}
          surveyUrl={surveyUrl}
          surveyTitle={survey.title}
        />
      )}
    </div>
  );
};
