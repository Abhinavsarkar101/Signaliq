import React, { useState } from 'react';
import { Project, AnalysisResult } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  BarChart2,
  TrendingDown,
  Star,
  Quote,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  Lightbulb,
} from 'lucide-react';

interface AnalysisStepProps {
  project: Project;
  onProceedToSurvey: () => void;
  onProceedToReport: () => void;
}

export const AnalysisStep: React.FC<AnalysisStepProps> = ({
  project,
  onProceedToSurvey,
  onProceedToReport,
}) => {
  const analysis = project.analysis;
  const [expandedThemeId, setExpandedThemeId] = useState<string | null>(null);

  if (!analysis) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
        <p className="text-sm text-slate-600">No analysis results yet. Please upload evidence and run analysis.</p>
      </div>
    );
  }

  const { sufficiencyAssessment, recurringThemes, painPoints, sentiment, outliers, keyInsights, recommendations } =
    analysis;

  const isSufficient = sufficiencyAssessment.outcome === 'A_SUFFICIENT';
  const isPartiallySufficient = sufficiencyAssessment.outcome === 'B_PARTIALLY_SUFFICIENT';
  const isInsufficient = sufficiencyAssessment.outcome === 'C_INSUFFICIENT';

  return (
    <div className="space-y-6">
      {/* 1. Research Sufficiency Assessment Hero Banner (Core SignalIQ principle) */}
      <div
        className={`rounded-2xl border p-6 shadow-sm transition-all ${
          isSufficient
            ? 'bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/40 border-emerald-300'
            : isPartiallySufficient
            ? 'bg-gradient-to-br from-amber-50/90 via-white to-orange-50/40 border-amber-300'
            : 'bg-gradient-to-br from-rose-50/90 via-white to-red-50/40 border-rose-300'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-xs ${
                isSufficient
                  ? 'bg-emerald-600 text-white'
                  : isPartiallySufficient
                  ? 'bg-amber-500 text-white'
                  : 'bg-rose-600 text-white'
              }`}
            >
              {isSufficient ? (
                <ShieldCheck className="w-6 h-6" />
              ) : isPartiallySufficient ? (
                <HelpCircle className="w-6 h-6" />
              ) : (
                <ShieldAlert className="w-6 h-6" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                    isSufficient
                      ? 'bg-emerald-100 text-emerald-800'
                      : isPartiallySufficient
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {isSufficient
                    ? 'Outcome A: Sufficient Evidence'
                    : isPartiallySufficient
                    ? 'Outcome B: Partially Sufficient Evidence'
                    : 'Outcome C: Insufficient Evidence'}
                </span>
                <span className="text-xs text-slate-400">&bull;</span>
                <span className="text-xs font-semibold text-slate-600">Research Sufficiency Evaluation</span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                {sufficiencyAssessment.statusHeadline}
              </h2>
            </div>
          </div>

          {/* Direct CTA depending on Sufficiency */}
          <div className="self-end md:self-start shrink-0">
            {isSufficient ? (
              <button
                onClick={onProceedToReport}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition-all cursor-pointer"
              >
                <span>No Survey Needed &rarr; View Final Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onProceedToSurvey}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Targeted Survey to Fill Gaps</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Breakdown of What is Established vs What Remains Unknown */}
        <div className="mt-6 pt-5 border-t border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* What Data Establishes */}
          <div className="bg-white/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
            <span className="font-bold text-emerald-800 uppercase tracking-wide flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>What Current Data Establishes:</span>
            </span>
            <ul className="space-y-1.5 text-slate-700">
              {sufficiencyAssessment.whatDataEstablishes.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What Remains Unknown */}
          <div className="bg-white/80 rounded-xl p-4 border border-slate-200/80 space-y-2">
            <span className="font-bold text-amber-800 uppercase tracking-wide flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <span>What Remains Unknown (Gaps):</span>
            </span>
            <ul className="space-y-1.5 text-slate-700">
              {sufficiencyAssessment.whatRemainsUnknown.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Why Current Data Cannot Answer & Method Rationale */}
        <div className="mt-4 p-3.5 bg-slate-900/5 rounded-xl text-xs space-y-2 text-slate-700">
          <div>
            <strong className="text-slate-900">Coverage Limitation: </strong>
            {sufficiencyAssessment.whyEvidenceCannotAnswer}
          </div>
          <div>
            <strong className="text-slate-900">Recommended Next Research Action: </strong>
            <span className="font-bold text-indigo-700">{sufficiencyAssessment.recommendedMethodTitle}</span> &mdash;{' '}
            {sufficiencyAssessment.rationale}
          </div>
        </div>
      </div>

      {/* 2. Quantitative Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Valid Records Analysed
          </span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">{analysis.validRecords}</span>
            <span className="text-xs text-slate-400">of {analysis.totalRecords} total</span>
          </div>
          {analysis.excludedRecords > 0 && (
            <p className="mt-1 text-[11px] text-amber-700 font-medium">
              {analysis.excludedRecords} blank records excluded
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Average Rating
          </span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-slate-900">
              {analysis.ratingStats?.average ? `${analysis.ratingStats.average} / 5` : 'N/A'}
            </span>
            {analysis.ratingStats?.average && (
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
            )}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">From actual rating column</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              Sentiment Distribution
            </span>
            <span className="text-[9px] font-bold uppercase bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-sm">
              AI Interpretation
            </span>
          </div>
          <div className="mt-2 flex h-2 rounded-full overflow-hidden bg-slate-100">
            <div
              style={{ width: `${sentiment.negativePct}%` }}
              className="bg-rose-500"
              title={`Negative: ${sentiment.negativePct}%`}
            ></div>
            <div
              style={{ width: `${sentiment.neutralPct}%` }}
              className="bg-slate-400"
              title={`Neutral: ${sentiment.neutralPct}%`}
            ></div>
            <div
              style={{ width: `${sentiment.positivePct}%` }}
              className="bg-emerald-500"
              title={`Positive: ${sentiment.positivePct}%`}
            ></div>
          </div>
          <div className="mt-2 flex justify-between text-[11px] text-slate-500 font-medium">
            <span className="text-rose-600">{sentiment.negativePct}% Neg</span>
            <span className="text-slate-500">{sentiment.neutralPct}% Neu</span>
            <span className="text-emerald-600">{sentiment.positivePct}% Pos</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
            Customer Themes Found
          </span>
          <div className="mt-1 flex items-baseline space-x-2">
            <span className="text-2xl font-extrabold text-indigo-700">{recurringThemes.length}</span>
            <span className="text-xs text-slate-400">clusters</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">{painPoints.length} high-severity pain points</p>
        </div>
      </div>

      {/* 3. Recurring Customer Themes with Representative Quotes */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Recurring Customer Themes ({recurringThemes.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">Grouped by semantic similarity</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recurringThemes.map((theme) => {
            const isExpanded = expandedThemeId === theme.id;
            return (
              <div key={theme.id} className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <h4 className="text-sm font-bold text-slate-900">{theme.name}</h4>
                      <span className="px-2 py-0.5 text-xs font-bold rounded-md bg-indigo-50 text-indigo-700">
                        {theme.frequency} mentions
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{theme.description}</p>
                    {theme.potentialCauses && (
                      <p className="text-xs text-slate-500">
                        <strong className="text-slate-700">Potential Cause: </strong>
                        {theme.potentialCauses}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => setExpandedThemeId(isExpanded ? null : theme.id)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 shrink-0 p-1 cursor-pointer"
                  >
                    <span>{isExpanded ? 'Hide Evidence' : 'View Quotes'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Verbatim Supporting Quotes (Traceable to uploaded records) */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-2.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                      Verbatim Customer Excerpts ({theme.representativeQuotes.length}):
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {theme.representativeQuotes.map((q, qIdx) => (
                        <div
                          key={qIdx}
                          className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 text-xs text-slate-800 space-y-1.5"
                        >
                          <div className="flex items-start space-x-2">
                            <Quote className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                            <p className="italic font-medium text-slate-700">"{q.quote}"</p>
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-200/50">
                            <span>Source: <strong className="text-slate-600">{q.sourceFile}</strong></span>
                            {q.sourceRef && <span>{q.sourceRef}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Customer Pain Points */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingDown className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Customer Pain Points & Obstacles ({painPoints.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">Evaluated by severity & user impact</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5">
          {painPoints.map((pp) => (
            <div
              key={pp.id}
              className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white space-y-2.5 shadow-2xs"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm ${
                    pp.impactSeverity === 'Critical'
                      ? 'bg-rose-100 text-rose-800'
                      : pp.impactSeverity === 'High'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {pp.impactSeverity} Severity
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Confidence: {pp.confidence}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{pp.problem}</h4>

              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <strong className="text-slate-700">Circumstances: </strong>
                  {pp.circumstances}
                </p>
                <p>
                  <strong className="text-slate-700">Implications: </strong>
                  {pp.implications}
                </p>
              </div>

              {pp.supportingEvidence && pp.supportingEvidence.length > 0 && (
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs italic text-slate-700 bg-slate-50 p-2 rounded-md">
                    "{pp.supportingEvidence[0].quote}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 5. Outliers and Conflicting Evidence (Minority Opinions - FR-04.5) */}
      {outliers && outliers.length > 0 && (
        <div className="bg-sky-50/60 rounded-xl border border-sky-200/80 p-5 space-y-3">
          <div className="flex items-center space-x-2 text-sky-900">
            <Lightbulb className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-bold">Outliers & Conflicting Feedback</h3>
          </div>
          <p className="text-xs text-sky-800">
            SignalIQ surfaces valid minority opinions and conflicting customer reactions that must not be buried.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {outliers.map((outlier, idx) => (
              <div key={idx} className="bg-white p-3.5 rounded-lg border border-sky-100 text-xs space-y-1.5 shadow-2xs">
                <h5 className="font-bold text-slate-900">{outlier.observation}</h5>
                <p className="text-slate-600">{outlier.minorityPerspective}</p>
                {outlier.evidence && (
                  <p className="italic text-slate-500 pt-1 text-[11px]">
                    "{outlier.evidence}" ({outlier.sourceFile})
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Evidence-Backed Recommendations & Hypotheses */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Recommended Actions & Strategic Hypotheses ({recommendations.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500">Unvalidated impact labeled as hypotheses</span>
        </div>

        <div className="divide-y divide-slate-100">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-sm ${
                      rec.priority === 'High'
                        ? 'bg-indigo-100 text-indigo-800'
                        : rec.priority === 'Medium'
                        ? 'bg-sky-100 text-sky-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Priority: {rec.priority}
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{rec.title}</h4>
                </div>
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <p>
                  <strong className="text-slate-700">Problem Addressed: </strong>
                  {rec.problemAddressed}
                </p>
                <p>
                  <strong className="text-slate-700">Supporting Evidence: </strong>
                  {rec.evidenceSupporting}
                </p>
                <p className="text-indigo-900 bg-indigo-50/50 p-2 rounded-md border border-indigo-100/60">
                  <strong className="text-indigo-800">Expected Outcome (Hypothesis): </strong>
                  {rec.expectedOutcomeHypothesis}
                </p>
                <p>
                  <strong className="text-slate-700">Suggested Next Step: </strong>
                  {rec.suggestedNextStep}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="text-xs text-slate-500">
          {isSufficient
            ? 'Evidence is sufficient to complete recommendations without further research.'
            : 'Knowledge gaps exist. Conduct a targeted survey or proceed to report.'}
        </span>

        <div className="flex items-center space-x-3">
          <button
            onClick={onProceedToReport}
            className="px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            Go Directly to Report
          </button>

          {!isSufficient && (
            <button
              onClick={onProceedToSurvey}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs shadow-indigo-200 transition-all cursor-pointer"
            >
              <span>Build Targeted Survey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
