import React, { useState } from 'react';
import { Survey, SurveyQuestion } from '../types';
import { api } from '../lib/api';
import {
  CheckCircle2,
  AlertCircle,
  Star,
  Send,
  X,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface PublicSurveyViewProps {
  survey: Survey;
  onClose?: () => void;
  onResponseSubmitted?: () => void;
}

export const PublicSurveyView: React.FC<PublicSurveyViewProps> = ({
  survey,
  onClose,
  onResponseSubmitted,
}) => {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: '' }));
    }
  };

  const handleToggleMultipleOption = (questionId: string, option: string) => {
    const current = (answers[questionId] as string[]) || [];
    const updated = current.includes(option)
      ? current.filter((o) => o !== option)
      : [...current, option];
    setAnswers((prev) => ({ ...prev, [questionId]: updated }));
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: '' }));
    }
  };

  const handleTextChange = (questionId: string, text: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
    if (errors[questionId]) {
      setErrors((prev) => ({ ...prev, [questionId]: '' }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    for (const q of survey.questions) {
      if (q.required) {
        const val = answers[q.id];
        if (val === undefined || val === null || val === '') {
          newErrors[q.id] = 'This question is required.';
        } else if (Array.isArray(val) && val.length === 0) {
          newErrors[q.id] = 'Please select at least one option.';
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      await api.submitSurveyResponse(survey.id, {
        answers,
        metadata: {
          userAgent: navigator.userAgent,
          submittedVia: 'web_direct',
        },
      });

      setIsSubmitted(true);
      if (onResponseSubmitted) {
        onResponseSubmitted();
      }
    } catch (err: any) {
      setSubmissionError(err.message || 'Failed to submit response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col text-slate-900 dark:text-slate-100">
        {/* Top Respondent Header */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Respondent Experience
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1">
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-emerald-100 dark:shadow-none">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Thank You!</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                {survey.closingMessage || 'Your response has been saved and will inform our product decisions.'}
              </p>
              <div className="pt-4">
                {onClose ? (
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Return to Workspace
                  </button>
                ) : (
                  <span className="text-xs text-slate-400 dark:text-slate-500">Response recorded in database.</span>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Survey Header */}
              <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{survey.title}</h1>
                {survey.introduction && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {survey.introduction}
                  </p>
                )}
              </div>

              {submissionError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/80 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-800 dark:text-rose-200 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{submissionError}</span>
                </div>
              )}

              {/* Questions List */}
              <div className="space-y-6">
                {survey.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border transition-all ${
                      errors[q.id]
                        ? 'bg-rose-50/20 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                        : 'bg-slate-50/40 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <label className="text-sm font-bold text-slate-900 dark:text-white flex items-start space-x-2">
                        <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{idx + 1}.</span>
                        <span>
                          {q.text} {q.required && <span className="text-rose-500">*</span>}
                        </span>
                      </label>
                    </div>

                    {/* Question Input by Type */}
                    <div className="mt-3">
                      {q.type === 'single_choice' && q.options && (
                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => (
                            <label
                              key={oIdx}
                              className={`flex items-center space-x-3 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                                answers[q.id] === opt
                                  ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200'
                                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <input
                                type="radio"
                                name={q.id}
                                value={opt}
                                checked={answers[q.id] === opt}
                                onChange={() => handleSelectOption(q.id, opt)}
                                className="text-indigo-600 focus:ring-indigo-500"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>
                      )}

                      {q.type === 'multiple_choice' && q.options && (
                        <div className="space-y-2">
                          {q.options.map((opt, oIdx) => {
                            const isChecked = ((answers[q.id] as string[]) || []).includes(opt);
                            return (
                              <label
                                key={oIdx}
                                className={`flex items-center space-x-3 p-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200'
                                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => handleToggleMultipleOption(q.id, opt)}
                                  className="rounded-sm text-indigo-600 focus:ring-indigo-500"
                                />
                                <span>{opt}</span>
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {q.type === 'rating_scale' && (
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((num) => {
                            const isSelected = answers[q.id] === num.toString();
                            return (
                              <button
                                type="button"
                                key={num}
                                onClick={() => handleSelectOption(q.id, num.toString())}
                                className={`w-11 h-11 rounded-xl text-sm font-bold flex flex-col items-center justify-center border transition-all cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                                }`}
                              >
                                <span>{num}</span>
                                <Star className={`w-2.5 h-2.5 ${isSelected ? 'fill-white' : 'text-slate-300 dark:text-slate-600'}`} />
                              </button>
                            );
                          })}
                          <span className="text-[11px] text-slate-400 dark:text-slate-500 pl-2">
                            (1 = Difficult / Dissatisfied &bull; 5 = Excellent)
                          </span>
                        </div>
                      )}

                      {q.type === 'yes_no' && (
                        <div className="flex space-x-3">
                          {['Yes', 'No'].map((opt) => (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => handleSelectOption(q.id, opt)}
                              className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                                answers[q.id] === opt
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}

                      {q.type === 'short_text' && (
                        <input
                          type="text"
                          value={answers[q.id] || ''}
                          onChange={(e) => handleTextChange(q.id, e.target.value)}
                          placeholder="Your answer..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500"
                        />
                      )}

                      {q.type === 'long_text' && (
                        <textarea
                          rows={3}
                          value={answers[q.id] || ''}
                          onChange={(e) => handleTextChange(q.id, e.target.value)}
                          placeholder="Type your feedback here..."
                          className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-indigo-500 resize-none"
                        />
                      )}
                    </div>

                    {errors[q.id] && (
                      <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 flex items-center space-x-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{errors[q.id]}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 dark:text-slate-500">All submissions are anonymized.</span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
