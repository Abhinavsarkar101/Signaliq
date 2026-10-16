import React, { useState } from 'react';
import { Project } from '../types';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  Quote,
  Star,
  ShieldCheck,
  Layers,
  Sparkles,
} from 'lucide-react';
import { HelpTooltip } from './HelpTooltip';

interface ReportStepProps {
  project: Project;
}

export const ReportStep: React.FC<ReportStepProps> = ({ project }) => {
  const [copiedMd, setCopiedMd] = useState(false);
  const analysis = project.analysis;

  if (!analysis) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center text-slate-900 dark:text-slate-100">
        <p className="text-sm text-slate-600 dark:text-slate-400">No report available. Please complete evidence analysis first.</p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdownReport = (): string => {
    const lines: string[] = [
      `# SignalIQ Intelligence Report: ${project.name}`,
      `**Generated:** ${new Date().toLocaleDateString()}`,
      `**Objective:** ${project.objective}`,
      `**Target Segment:** ${project.customerSegment || 'All active users'}`,
      `**Category:** ${project.category}`,
      '',
      '## 1. Executive Summary',
      `SignalIQ analysed ${analysis.validRecords} customer records across ${analysis.sourcesAnalyzed.length} data source(s).`,
      `**Sufficiency Status:** ${analysis.sufficiencyAssessment.statusHeadline}`,
      '',
      '### What Current Data Establishes:',
      ...analysis.sufficiencyAssessment.whatDataEstablishes.map((item) => `- ${item}`),
      '',
      '### What Remains Unknown:',
      ...analysis.sufficiencyAssessment.whatRemainsUnknown.map((item) => `- ${item}`),
      '',
      '## 2. Key Customer Themes',
      ...analysis.recurringThemes.map(
        (t) =>
          `### ${t.name} (${t.frequency} mentions)\n${t.description}\n` +
          t.representativeQuotes.map((q) => `> "${q.quote}" — *${q.sourceFile} (${q.sourceRef || ''})*`).join('\n')
      ),
      '',
      '## 3. Customer Pain Points',
      ...analysis.painPoints.map((p) => `- **[${p.impactSeverity} Severity]** ${p.problem}\n  Circumstances: ${p.circumstances}\n  Implications: ${p.implications}`),
      '',
      '## 4. Evidence-Backed Recommendations & Hypotheses',
      ...analysis.recommendations.map(
        (r) =>
          `### [Priority: ${r.priority}] ${r.title}\n- **Problem Solved:** ${r.problemAddressed}\n- **Evidence Supporting:** ${r.evidenceSupporting}\n- **Expected Outcome (Hypothesis):** ${r.expectedOutcomeHypothesis}\n- **Next Tactical Step:** ${r.suggestedNextStep}`
      ),
      '',
      '## 5. Research Limitations & Assumptions',
      `- Evidence based on: ${analysis.sourcesAnalyzed.join(', ')}`,
      `- Excluded records: ${analysis.excludedRecords} empty or unparseable items.`,
      `- Sentiment metrics are AI-generated interpretations, not objective measurements.`,
    ];
    return lines.join('\n');
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdownReport());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleDownloadJson = () => {
    const reportData = {
      project: {
        id: project.id,
        name: project.name,
        objective: project.objective,
        category: project.category,
      },
      sources: project.sources.map((s) => ({
        fileName: s.fileName,
        fileType: s.fileType,
        recordCount: s.recordCount,
      })),
      analysis: project.analysis,
      survey: project.survey
        ? {
            title: project.survey.title,
            responseCount: project.survey.responseCount,
            questions: project.survey.questions,
          }
        : null,
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SignalIQ_Report_${project.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-slate-100">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs print:hidden">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Consolidated Research Intelligence Report</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Ready for product, UX, and executive stakeholder review</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedMd ? 'Copied MD!' : 'Copy Markdown'}</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Printable Report Document Body */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm p-8 sm:p-12 space-y-8 print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest text-[11px]">
              SignalIQ Customer Intelligence Platform
            </span>
            <span>{new Date().toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {project.name}
          </h1>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/70 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1 mt-3">
            <p>
              <strong className="text-slate-900 dark:text-white">Research Objective: </strong>
              {project.objective}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-slate-500 dark:text-slate-400">
              <span>Segment: <strong className="text-slate-700 dark:text-slate-200">{project.customerSegment || 'General'}</strong></span>
              <span>Product: <strong className="text-slate-700 dark:text-slate-200">{project.productName || 'Default'}</strong></span>
              <span>Category: <strong className="capitalize text-slate-700 dark:text-slate-200">{project.category}</strong></span>
              <span>Records Analysed: <strong className="text-slate-700 dark:text-slate-200">{analysis.validRecords}</strong></span>
            </div>
          </div>
        </div>

        {/* 1. Executive Summary & Sufficiency Assessment */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>1. Executive Summary & Evidence Sufficiency</span>
            </div>
            <HelpTooltip content="Consolidated overview stating whether collected feedback is mathematically sufficient to make decisions." />
          </h2>

          <div
            className={`p-4 rounded-xl border ${
              analysis.sufficiencyAssessment.outcome === 'A_SUFFICIENT'
                ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                : 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center space-x-2 font-bold text-xs uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Sufficiency Classification: {analysis.sufficiencyAssessment.outcome.replace('_', ' ')}</span>
            </div>
            <p className="text-sm font-bold">{analysis.sufficiencyAssessment.statusHeadline}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 block uppercase tracking-wide">
                Established By Evidence:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300">
                {analysis.sufficiencyAssessment.whatDataEstablishes.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
              <span className="font-bold text-amber-700 dark:text-amber-400 block uppercase tracking-wide">
                Unresolved Knowledge Gaps:
              </span>
              <ul className="space-y-1.5 list-disc list-inside text-slate-700 dark:text-slate-300">
                {analysis.sufficiencyAssessment.whatRemainsUnknown.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Key Customer Themes & Supporting Evidence */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>2. Key Customer Themes & Verbatim Evidence</span>
            </div>
            <HelpTooltip content="Aggregated qualitative patterns with frequency counts and cited customer quotes." />
          </h2>

          <div className="space-y-4">
            {analysis.recurringThemes.map((theme, idx) => (
              <div key={theme.id} className="p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {idx + 1}. {theme.name}
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-md">
                    {theme.frequency} mentions
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{theme.description}</p>

                {theme.representativeQuotes && theme.representativeQuotes.length > 0 && (
                  <div className="pt-2 space-y-2">
                    {theme.representativeQuotes.map((q, qIdx) => (
                      <div
                        key={qIdx}
                        className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/70 dark:border-slate-700 text-xs italic text-slate-700 dark:text-slate-300"
                      >
                        <p>"{q.quote}"</p>
                        <span className="block text-[10px] text-slate-400 dark:text-slate-500 not-italic mt-1">
                          Source: {q.sourceFile} {q.sourceRef ? `(${q.sourceRef})` : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 3. Customer Pain Points */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>3. Identified Pain Points & Operational Impact</span>
            </div>
            <HelpTooltip content="Friction points categorized by severity level, context, and business risk." />
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.painPoints.map((pp) => (
              <div key={pp.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold uppercase text-[10px] bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 px-2 py-0.5 rounded-sm">
                    {pp.impactSeverity} Severity
                  </span>
                  <span className="text-slate-400 font-medium">Confidence: {pp.confidence}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{pp.problem}</h4>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-700 dark:text-slate-200">Circumstances: </strong>
                  {pp.circumstances}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-700 dark:text-slate-200">Implications: </strong>
                  {pp.implications}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Strategic Recommendations & Tested Hypotheses */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>4. Evidence-Backed Action Items & Expected Hypotheses</span>
            </div>
            <HelpTooltip content="Prioritized solutions with testable hypotheses and suggested next tactical steps." />
          </h2>

          <div className="space-y-3">
            {analysis.recommendations.map((rec) => (
              <div key={rec.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-extrabold text-[10px] rounded-sm uppercase">
                    Priority: {rec.priority}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rec.title}</h4>
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-700 dark:text-slate-200">Problem Addressed: </strong>
                  {rec.problemAddressed}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-700 dark:text-slate-200">Supporting Evidence: </strong>
                  {rec.evidenceSupporting}
                </p>
                <div className="p-2.5 bg-indigo-50/50 dark:bg-indigo-950/50 rounded-lg border border-indigo-100 dark:border-indigo-900 text-indigo-950 dark:text-indigo-200 font-medium">
                  <strong>Hypothesis: </strong>
                  {rec.expectedOutcomeHypothesis}
                </div>
                <p className="text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-700 dark:text-slate-200">Next Action: </strong>
                  {rec.suggestedNextStep}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Limitations & Transparency Statement */}
        <section className="pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-2">
          <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
            Methodology & Transparency Statement
          </h4>
          <p>
            SignalIQ analyzes uploaded customer feedback and qualitative inputs using Gemini AI.
            Calculations reflect valid processed records from: {analysis.sourcesAnalyzed.join(', ')}.
            Sentiment classifications and hypotheses represent AI interpretations and should be validated through product iteration.
          </p>
        </section>
      </div>
    </div>
  );
};
