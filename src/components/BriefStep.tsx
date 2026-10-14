import React, { useState, useEffect } from 'react';
import { Project, ResearchBrief } from '../types';
import { api } from '../lib/api';
import { Sparkles, CheckCircle2, HelpCircle, AlertTriangle, ArrowRight, RefreshCw, Edit3, ShieldAlert } from 'lucide-react';

interface BriefStepProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => Promise<void>;
  onNextStep: () => void;
}

export const BriefStep: React.FC<BriefStepProps> = ({
  project,
  onUpdateProject,
  onNextStep,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [brief, setBrief] = useState<ResearchBrief | undefined>(project.brief);
  const [isEditingObjective, setIsEditingObjective] = useState(false);
  const [tempObjective, setTempObjective] = useState(project.objective);
  const [userClarification, setUserClarification] = useState(project.brief?.userNotes || '');

  useEffect(() => {
    setBrief(project.brief);
    setTempObjective(project.objective);
    setUserClarification(project.brief?.userNotes || '');
  }, [project.id, project.brief, project.objective]);

  const handleGenerateBrief = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const generated = await api.generateBrief({
        name: project.name,
        objective: project.objective,
        productName: project.productName,
        customerSegment: project.customerSegment,
        businessContext: project.businessContext,
        desiredOutcome: project.desiredOutcome,
        category: project.category,
      });

      setBrief(generated);
      await onUpdateProject({
        brief: generated,
        status: project.status === 'draft' ? 'brief_ready' : project.status,
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate brief. Please verify network and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveObjective = async () => {
    if (!tempObjective.trim()) return;
    await onUpdateProject({ objective: tempObjective.trim() });
    setIsEditingObjective(false);
  };

  const handleApproveBrief = async () => {
    if (!brief) return;
    const updatedBrief: ResearchBrief = {
      ...brief,
      approved: true,
      userNotes: userClarification.trim() || undefined,
    };
    setBrief(updatedBrief);
    await onUpdateProject({
      brief: updatedBrief,
      status: project.status === 'draft' ? 'brief_ready' : project.status,
    });
    onNextStep();
  };

  return (
    <div className="space-y-6">
      {/* Objective Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-5">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">
              Core Objective
            </span>
            {isEditingObjective ? (
              <div className="mt-2 space-y-2">
                <textarea
                  rows={2}
                  value={tempObjective}
                  onChange={(e) => setTempObjective(e.target.value)}
                  className="w-full text-base font-semibold text-slate-900 border border-indigo-300 rounded-lg p-2.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-100"
                />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSaveObjective}
                    className="px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-md hover:bg-indigo-700 cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setTempObjective(project.objective);
                      setIsEditingObjective(false);
                    }}
                    className="px-3 py-1 text-slate-600 text-xs font-medium rounded-md hover:bg-slate-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <h2 className="mt-2 text-xl font-bold text-slate-900">
                "{project.objective}"
              </h2>
            )}
          </div>
          {!isEditingObjective && (
            <button
              onClick={() => setIsEditingObjective(true)}
              className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center space-x-1 p-1 rounded-md hover:bg-slate-50 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Objective</span>
            </button>
          )}
        </div>

        {/* Project Metadata details */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Product / Service</span>
            <p className="font-semibold text-slate-800">{project.productName || 'General Product'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Target Segment</span>
            <p className="font-semibold text-slate-800">{project.customerSegment || 'All Active Users'}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Category</span>
            <p className="font-semibold capitalize text-slate-800">{project.category}</p>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Desired Outcome</span>
            <p className="font-semibold text-slate-800 truncate" title={project.desiredOutcome || 'Actionable recommendations'}>
              {project.desiredOutcome || 'Actionable recommendations'}
            </p>
          </div>
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800 flex items-start space-x-2.5">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Unable to generate AI Research Brief</p>
            <p className="text-xs mt-0.5 text-rose-700">{error}</p>
          </div>
          <button
            onClick={handleGenerateBrief}
            className="text-xs font-bold text-rose-700 underline hover:text-rose-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* AI Research Brief Section */}
      {!brief ? (
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/60 rounded-xl border border-indigo-100/80 p-8 text-center space-y-4">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-indigo-200">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-slate-900">Formulate AI Research Brief</h3>
            <p className="text-sm text-slate-600 mt-1">
              SignalIQ interprets your objective, extracts key sub-questions, flags ambiguous assumptions, and identifies required signals before any evidence is analysed.
            </p>
          </div>
          <button
            onClick={handleGenerateBrief}
            disabled={isGenerating}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs shadow-indigo-200 transition-all cursor-pointer disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Interpreting Objective with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Research Brief</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs divide-y divide-slate-100">
          {/* Header of Brief */}
          <div className="p-5 flex items-center justify-between bg-slate-50/60 rounded-t-xl">
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Approved Research Architecture</h3>
                <p className="text-xs text-slate-500">Grounded in your specified objective & business questions</p>
              </div>
            </div>

            <button
              onClick={handleGenerateBrief}
              disabled={isGenerating}
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center space-x-1.5 px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate Brief</span>
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Primary Question */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Primary Research Question
              </span>
              <p className="mt-1 text-base font-bold text-indigo-950 bg-indigo-50/50 p-3 rounded-lg border border-indigo-100/80">
                {brief.primaryQuestion}
              </p>
            </div>

            {/* Sub-Questions */}
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Specific Questions This Research Must Answer
              </span>
              <div className="mt-2 space-y-2">
                {brief.subQuestions.map((q, idx) => (
                  <div key={idx} className="flex items-start space-x-2.5 text-sm text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="font-medium">{q}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Info & Signals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Required Information & Data Points
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {brief.requiredInfo.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/70">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Customer Signals to Investigate
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {brief.signalsToInvestigate.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Limitations & Ambiguities Identified */}
            {brief.limitationsAndAmbiguities && brief.limitationsAndAmbiguities.length > 0 && (
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Identified Limitations & Missing Variables</span>
                </div>
                <ul className="space-y-1 text-xs text-amber-900 list-disc list-inside">
                  {brief.limitationsAndAmbiguities.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Clarification Questions */}
            {brief.clarificationQuestions && brief.clarificationQuestions.length > 0 && (
              <div className="p-4 bg-sky-50/60 border border-sky-200/70 rounded-xl space-y-2.5">
                <div className="flex items-center space-x-2 text-sky-900 text-xs font-bold">
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  <span>Clarification Considerations for the User</span>
                </div>
                <ul className="space-y-1 text-xs text-sky-800 list-disc list-inside">
                  {brief.clarificationQuestions.map((q, idx) => (
                    <li key={idx}>{q}</li>
                  ))}
                </ul>
                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Your Additional Research Notes / Clarifications (Optional)
                  </label>
                  <input
                    type="text"
                    value={userClarification}
                    onChange={(e) => setUserClarification(e.target.value)}
                    placeholder="e.g. Primarily focused on our self-serve trial users on desktop..."
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 bg-white"
                  />
                </div>
              </div>
            )}

            {/* Recommended Focus */}
            <div className="p-3 bg-indigo-50/60 rounded-lg border border-indigo-100 flex items-center space-x-3">
              <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide shrink-0">
                Recommended Focus:
              </span>
              <p className="text-xs text-indigo-950 font-medium">
                {brief.recommendedFocus}
              </p>
            </div>

            {/* Action Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Next: Upload your existing customer tickets, CSV files, transcripts, or heatmaps.
              </span>
              <button
                onClick={handleApproveBrief}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs shadow-indigo-200 transition-all cursor-pointer"
              >
                <span>Approve Brief & Upload Evidence</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
