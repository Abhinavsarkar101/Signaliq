import React, { useState, useEffect } from 'react';
import { Project, ResearchBrief } from '../types';
import { api } from '../lib/api';
import { HelpTooltip } from './HelpTooltip';
import {
  Sparkles,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Edit3,
  ShieldAlert,
  Users,
  Database,
  Target,
  FileText,
  Check,
  Compass,
  Layers,
  Info,
  Clock,
  ShieldCheck,
} from 'lucide-react';

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
  
  // Objective & Metadata editing
  const [isEditingObjective, setIsEditingObjective] = useState(false);
  const [tempObjective, setTempObjective] = useState(project.objective);
  const [tempProductName, setTempProductName] = useState(project.productName || '');
  const [tempSegment, setTempSegment] = useState(project.customerSegment || '');
  const [tempContext, setTempContext] = useState(project.businessContext || '');
  const [tempOutcome, setTempOutcome] = useState(project.desiredOutcome || '');

  // User notes & clarifications
  const [userClarification, setUserClarification] = useState(project.brief?.userNotes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState(false);

  useEffect(() => {
    setBrief(project.brief);
    setTempObjective(project.objective);
    setTempProductName(project.productName || '');
    setTempSegment(project.customerSegment || '');
    setTempContext(project.businessContext || '');
    setTempOutcome(project.desiredOutcome || '');
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
      setError(err.message || 'Failed to generate research brief. Please verify network and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProjectDetails = async () => {
    if (!tempObjective.trim()) return;
    await onUpdateProject({
      objective: tempObjective.trim(),
      productName: tempProductName.trim() || undefined,
      customerSegment: tempSegment.trim() || undefined,
      businessContext: tempContext.trim() || undefined,
      desiredOutcome: tempOutcome.trim() || undefined,
    });
    setIsEditingObjective(false);
  };

  const handleSaveNotesOnly = async () => {
    if (!brief) return;
    setIsSavingNotes(true);
    const updatedBrief: ResearchBrief = {
      ...brief,
      userNotes: userClarification.trim() || undefined,
    };
    setBrief(updatedBrief);
    await onUpdateProject({ brief: updatedBrief });
    setIsSavingNotes(false);
    setNotesSavedSuccess(true);
    setTimeout(() => setNotesSavedSuccess(false), 2500);
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
      {/* ========================================================================= */}
      {/* SECTION 1: YOUR PROJECT INPUTS & OBJECTIVE (Human Defined) */}
      {/* ========================================================================= */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 rounded-md border border-indigo-200/60 dark:border-indigo-800">
              Section 1 • Your Business Inputs
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              (Provided by you when creating this project)
            </span>
          </div>

          {!isEditingObjective ? (
            <button
              onClick={() => setIsEditingObjective(true)}
              className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Inputs</span>
            </button>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSaveProjectDetails}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition cursor-pointer"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setTempObjective(project.objective);
                  setTempProductName(project.productName || '');
                  setTempSegment(project.customerSegment || '');
                  setTempContext(project.businessContext || '');
                  setTempOutcome(project.desiredOutcome || '');
                  setIsEditingObjective(false);
                }}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium rounded-lg transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Objective & Metadata Content */}
        {isEditingObjective ? (
          <div className="space-y-4 pt-1">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Core Research Objective *
              </label>
              <textarea
                rows={2}
                value={tempObjective}
                onChange={(e) => setTempObjective(e.target.value)}
                className="w-full text-sm font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 border border-indigo-300 dark:border-indigo-700 rounded-xl p-3 focus:ring-2 focus:ring-indigo-200 outline-hidden"
                placeholder="What is the primary problem or mystery you need to solve?"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Product / Service Name
                </label>
                <input
                  type="text"
                  value={tempProductName}
                  onChange={(e) => setTempProductName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Target Customer Segment
                </label>
                <input
                  type="text"
                  value={tempSegment}
                  onChange={(e) => setTempSegment(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Business Context (Why now?)
                </label>
                <input
                  type="text"
                  value={tempContext}
                  onChange={(e) => setTempContext(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Desired Business Outcome
                </label>
                <input
                  type="text"
                  value={tempOutcome}
                  onChange={(e) => setTempOutcome(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Core Problem Statement
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1 leading-snug">
                "{project.objective}"
              </h2>
            </div>

            {/* 4 Metadata Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Product / Service
                  </span>
                  <HelpTooltip content="The name of your application or product being analyzed in this study." />
                </div>
                <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                  {project.productName || 'General Product'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Target Customer Segment
                  </span>
                  <HelpTooltip content="The specific user cohort or demographic targeted by this research project." />
                </div>
                <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                  {project.customerSegment || 'All Active Users'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Study Category
                  </span>
                  <HelpTooltip content="The primary category of research (e.g., onboarding, conversion, UX, churn prevention)." />
                </div>
                <p className="font-bold text-xs sm:text-sm capitalize text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                  {project.category}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block">
                    Desired Outcome
                  </span>
                  <HelpTooltip content="The specific decision, insight, or metric improvement you aim to achieve." />
                </div>
                <p className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 mt-0.5 truncate" title={project.desiredOutcome || 'Actionable recommendations'}>
                  {project.desiredOutcome || 'Actionable recommendations'}
                </p>
              </div>
            </div>

            {project.businessContext && (
              <div className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex items-start justify-between">
                <div>
                  <strong className="text-slate-700 dark:text-slate-300">Business Context: </strong>
                  {project.businessContext}
                </div>
                <HelpTooltip content="Recent events, metrics variance, or background explaining why this study is needed now." />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl text-sm text-rose-800 dark:text-rose-200 flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold">Unable to formulate AI Research Brief</p>
            <p className="text-xs mt-0.5 text-rose-700 dark:text-rose-300">{error}</p>
          </div>
          <button
            onClick={handleGenerateBrief}
            className="text-xs font-bold text-rose-700 dark:text-rose-300 underline hover:text-rose-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: AI-GENERATED RESEARCH STRATEGY & BRIEF */}
      {/* ========================================================================= */}
      {!brief ? (
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-sky-50/70 dark:from-slate-900 dark:via-indigo-950/20 dark:to-slate-900 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 p-8 text-center space-y-4">
          <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-indigo-200 dark:shadow-none">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="max-w-lg mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Step 1 • AI Strategy Synthesis
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
              Generate AI Research Architecture
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Gemini AI will interpret your objective, derive measurable sub-questions, define your target segment, recommend evidence sources, and flag potential data blindspots before you upload evidence.
            </p>
          </div>
          <button
            onClick={handleGenerateBrief}
            disabled={isGenerating}
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Synthesizing Strategy with Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Research Brief Now</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
          {/* Header of AI Brief with Honest Approval State */}
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/70 dark:bg-slate-800/40 rounded-t-2xl">
            <div className="flex items-start sm:items-center space-x-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  brief.approved
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300'
                }`}
              >
                {brief.approved ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <Clock className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Section 2 • AI-Synthesized Research Brief
                  </h3>
                  {brief.approved ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                      <Check className="w-3 h-3" />
                      <span>Approved by You</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      <span>Draft Proposal • Awaiting Your Review</span>
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {brief.approved
                    ? 'You reviewed and approved this research scope. You can proceed or re-generate at any time.'
                    : 'Generated by Gemini AI based on your business inputs. Review the strategy below, then click "Approve Brief" to proceed.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleGenerateBrief}
              disabled={isGenerating}
              className="self-start sm:self-center text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Regenerate Brief</span>
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-7">
            {/* 1. Primary Question */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Primary Research Question (Core Hypothesis)
                  </span>
                  <HelpTooltip content="The central research hypothesis or main problem statement that this research project aims to solve." />
                </div>
              </div>
              <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 leading-relaxed shadow-2xs">
                {brief.primaryQuestion}
              </p>
            </div>

            {/* 2. Target Segment & Recommended Sources Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Target Segment */}
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                      Target Customer Segment
                    </span>
                    <HelpTooltip content="The specific subset of customers (e.g., power users, first-time churners) focused on in this research." />
                  </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Whose feedback will be analyzed
                    </span>
                  </div>
                </div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 pt-1">
                  {brief.targetSegment || project.customerSegment || 'General customer base affected by this workflow'}
                </p>
              </div>

              {/* Recommended Sources */}
              <div className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Database className="w-4 h-4" />
                  </div>
                  <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 block">
                      Recommended Evidence Sources
                    </span>
                    <HelpTooltip content="The recommended data channels (e.g., support tickets, transcripts) where the AI expects to find the required information." />
                  </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Where to gather data for Step 2
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(brief.potentialSources && brief.potentialSources.length > 0
                    ? brief.potentialSources
                    : ['Support tickets (Zendesk / Intercom)', 'Sales call transcripts', 'App Store / Play Store reviews']
                  ).map((source, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shadow-2xs"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Specific Sub-Questions to Answer */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Specific Questions This Research Must Answer</span>
                  <HelpTooltip content="Granular, investigative questions derived by AI from your primary hypothesis to guide evidence synthesis." />
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {brief.subQuestions?.length || 0} sub-questions derived
                </span>
              </div>

              <div className="space-y-2.5">
                {brief.subQuestions?.map((q, idx) => (
                  <div
                    key={idx}
                    className="flex items-start space-x-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200"
                  >
                    <span className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="font-medium text-slate-900 dark:text-slate-100 leading-snug">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Required Info & Signals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Required Information & Data Points
                    </span>
                  </div>
                  <HelpTooltip content="Specific data attributes or information types needed in your files to answer the research questions." />
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  {brief.requiredInfo?.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                      Customer Signals to Investigate
                    </span>
                  </div>
                  <HelpTooltip content="Specific behavioral patterns, sentiment trends, or friction points to look for in the feedback." />
                </div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                  {brief.signalsToInvestigate?.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0"></span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 5. Identified Limitations & Missing Context */}
            {brief.limitationsAndAmbiguities && brief.limitationsAndAmbiguities.length > 0 && (
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2.5 shadow-2xs border-l-4 border-l-amber-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Known Data Limitations & Potential Blindspots</span>
                  </div>
                  <HelpTooltip content="Risks, missing dimensions, or sampling biases that may limit the accuracy of findings." />
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  The AI identified the following constraints in your current research scope:
                </p>
                <ul className="space-y-1 text-xs text-slate-800 dark:text-slate-200 list-disc list-inside">
                  {brief.limitationsAndAmbiguities.map((lim, idx) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 6. Clarification Questions & User Input */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3 shadow-2xs border-l-4 border-l-sky-500">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-slate-900 dark:text-white text-xs font-bold uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>AI Clarification Requests for the User</span>
                </div>
                <HelpTooltip content="Questions generated by AI to resolve ambiguities in your brief before evidence is analyzed." />
              </div>
              
              {brief.clarificationQuestions && brief.clarificationQuestions.length > 0 ? (
                <div className="space-y-1.5">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                    To make the upcoming analysis as accurate as possible, consider these questions:
                  </p>
                  <ul className="space-y-1 text-xs text-slate-800 dark:text-slate-200 list-disc list-inside">
                    {brief.clarificationQuestions.map((q, idx) => (
                      <li key={idx} className="font-semibold">{q}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  No critical ambiguities detected. You can add optional notes or edge cases below.
                </p>
              )}

              <div className="pt-2">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Your Additional Research Notes & Clarifications (Optional)
                    </label>
                    <HelpTooltip content="Provide domain nuances, exclusions, or instructions that feed directly into upcoming analysis synthesis." />
                  </div>
                  {notesSavedSuccess && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Notes Saved!</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={userClarification}
                    onChange={(e) => setUserClarification(e.target.value)}
                    placeholder="e.g. Focus specifically on self-serve trial users on mobile, excluding sales-assisted enterprise contracts..."
                    className="flex-1 text-xs px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl focus:border-indigo-500 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 outline-hidden"
                  />
                  {brief.approved && (
                    <button
                      onClick={handleSaveNotesOnly}
                      disabled={isSavingNotes}
                      className="px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
                    >
                      {isSavingNotes ? 'Saving...' : 'Save Notes'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 7. Recommended Focus */}
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex items-start space-x-3 shadow-2xs border-l-4 border-l-indigo-500">
              <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Target className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide block">
                  AI Strategic Focus Recommendation:
                </span>
                <p className="text-xs sm:text-sm text-slate-900 dark:text-white font-semibold mt-0.5">
                  {brief.recommendedFocus}
                </p>
              </div>
            </div>

            {/* 8. Action & Approval Progression Bar */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  {brief.approved
                    ? 'Step 1 Complete • Ready for Evidence Ingestion'
                    : 'Action Required • Approve Plan to Continue'}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {brief.approved
                    ? 'Click below to advance to Step 2 (Evidence Upload) and ingest your customer data.'
                    : 'Approving confirms this research scope and takes you to Step 2 to upload files.'}
                </p>
              </div>

              <button
                onClick={handleApproveBrief}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-md shadow-indigo-200 dark:shadow-none transition-all cursor-pointer"
              >
                <span>
                  {brief.approved
                    ? 'Proceed to Step 2: Evidence Upload'
                    : 'Approve Brief & Proceed to Step 2'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
