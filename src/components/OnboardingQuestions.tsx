import React, { useState } from 'react';
import { Sparkles, Check, X, Sliders, AlertCircle, ArrowRight } from 'lucide-react';

interface OnboardingQuestionsProps {
  onComplete: (answers: Record<string, string>) => void;
  initialAnswers?: Record<string, string>;
  isEditing?: boolean;
  onCancel?: () => void;
}

export const OnboardingQuestions: React.FC<OnboardingQuestionsProps> = ({
  onComplete,
  initialAnswers = {},
  isEditing = false,
  onCancel,
}) => {
  const [answers, setAnswers] = useState<Record<string, string>>({
    role: initialAnswers.role || '',
    goal: initialAnswers.goal || '',
    dataSource: initialAnswers.dataSource || '',
    primaryFocus: initialAnswers.primaryFocus || '',
    viewMode: initialAnswers.viewMode || 'Tailored Focused View (Show only my role-specific tools & KPIs)',
  });

  const [validationError, setValidationError] = useState<string | null>(null);

  const questions = [
    {
      id: 'role',
      question: 'What is your primary role?',
      description: 'Used to calibrate dashboard metrics and primary navigation views.',
      options: [
        'Founder / Executive',
        'Product Manager / Designer',
        'Customer Success & Support Lead',
        'User Researcher / Data Analyst',
      ],
    },
    {
      id: 'goal',
      question: 'What is your primary goal?',
      description: 'Determines recommended quick actions and high-priority insight cards.',
      options: [
        'Reduce Churn & Retention Drop-offs',
        'Improve Onboarding & Funnel Conversion',
        'Feature Prioritization & Product Roadmap',
        'Track Customer Sentiment & CSAT / NPS',
      ],
    },
    {
      id: 'dataSource',
      question: 'What primary evidence source will you analyze?',
      description: 'Highlights relevant ingestion templates and analysis pipelines.',
      options: [
        'Customer Support Tickets & Helpdesk Logs',
        'User Interview Transcripts & Call Notes',
        'App Reviews & Survey Feedback CSVs',
        'Multi-Channel Combined Datasets',
      ],
    },
    {
      id: 'primaryFocus',
      question: 'Which research workflow should be prioritized?',
      description: 'Pins your most important intelligence module to the top of your workspace.',
      options: [
        'Executive Insights & Decision Reports',
        'AI Feedback Synthesis & Pain Point Clustering',
        'Targeted Survey Builder & Distribution',
        'Complete End-to-End Suite',
      ],
    },
    {
      id: 'viewMode',
      question: 'How would you like your dashboard structured?',
      description: 'You can toggle between focused mode and full platform mode at any time.',
      options: [
        'Tailored Focused View (Show only my role-specific tools & KPIs)',
        'Full Platform View (Show all tools, raw explorers, and metrics)',
      ],
    },
  ];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setValidationError(null);

    // Validate required questions
    if (!answers.role || !answers.goal) {
      setValidationError('Please select at least your Primary Role and Primary Goal to proceed.');
      return;
    }

    // Default other answers if unselected
    const finalAnswers: Record<string, string> = {
      role: answers.role,
      goal: answers.goal,
      dataSource: answers.dataSource || 'Multi-Channel Combined Datasets',
      primaryFocus: answers.primaryFocus || 'AI Feedback Synthesis & Pain Point Clustering',
      viewMode: answers.viewMode || 'Tailored Focused View (Show only my role-specific tools & KPIs)',
    };

    onComplete(finalAnswers);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#111827] dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 text-slate-100 my-8 transition-all animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Workspace Customization' : 'Personalized Setup'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isEditing ? 'Customize Your Dashboard' : 'Welcome to SignalIQ!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
              {isEditing
                ? 'Update your role and goals below. Your dashboard, KPIs, and navigation options will adapt immediately.'
                : 'Please tell us a bit about yourself so we can customize your dashboard and show only what matters.'}
            </p>
          </div>
          {isEditing && onCancel && (
            <button
              onClick={onCancel}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Validation error if any */}
        {validationError && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Questions Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {questions.map((q, idx) => (
            <div key={q.id} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-200 tracking-wide">
                  {q.question} {idx < 2 && <span className="text-indigo-400">*</span>}
                </label>
              </div>

              <div className="relative">
                <select
                  value={answers[q.id] || ''}
                  onChange={(e) => {
                    setAnswers({ ...answers, [q.id]: e.target.value });
                    if (validationError) setValidationError(null);
                  }}
                  className="w-full px-3.5 py-3 text-xs sm:text-sm font-medium border border-slate-700/80 bg-slate-800/90 hover:bg-slate-800 text-white rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition outline-hidden appearance-none cursor-pointer"
                >
                  <option value="" className="text-slate-400 bg-slate-900">
                    Select an option
                  </option>
                  {q.options.map((opt) => (
                    <option key={opt} value={opt} className="text-white bg-slate-900 py-1">
                      {opt}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <p className="text-[11px] text-slate-500">{q.description}</p>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center gap-3">
            {isEditing && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="w-full sm:w-1/3 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl transition cursor-pointer text-xs"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="w-full flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition cursor-pointer text-xs sm:text-sm flex items-center justify-center space-x-2 active:scale-98"
            >
              <span>{isEditing ? 'Save & Update Dashboard' : 'Complete Setup'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
