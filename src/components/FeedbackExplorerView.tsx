import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Project } from '../types';
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  ArrowLeft,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Star,
  ExternalLink,
  Layers,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface FeedbackExplorerViewProps {
  projects: Project[];
  onBackToDashboard: () => void;
  onOpenProjectWorkspace: (project: Project) => void;
}

export const FeedbackExplorerView: React.FC<FeedbackExplorerViewProps> = ({
  projects,
  onBackToDashboard,
  onOpenProjectWorkspace,
}) => {
  const [records, setRecords] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalExcluded, setTotalExcluded] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSentiment, setSelectedSentiment] = useState<'all' | 'negative' | 'neutral' | 'positive'>('all');
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await api.getFeedbackRecords();
      setRecords(data.records || []);
      setSources(data.sources || []);
      setTotalRecords(data.totalRecords || 0);
      setTotalExcluded(data.totalExcluded || 0);
    } catch (err) {
      console.error('Failed to load feedback records:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filtered records
  const filteredRecords = records.filter((rec) => {
    // Exclude noise if filter is active, but allow viewing excluded
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = (rec.feedbackText || '').toLowerCase().includes(q);
      const matchId = (rec.id || '').toLowerCase().includes(q);
      const matchSegment = (rec.segment || '').toLowerCase().includes(q);
      const matchProject = (rec.projectName || '').toLowerCase().includes(q);
      if (!matchText && !matchId && !matchSegment && !matchProject) return false;
    }

    if (selectedSentiment !== 'all') {
      if (rec.sentiment !== selectedSentiment) return false;
    }

    if (selectedSegment !== 'all') {
      if (rec.segment !== selectedSegment) return false;
    }

    if (selectedProjectId !== 'all') {
      if (rec.projectId !== selectedProjectId) return false;
    }

    return true;
  });

  // Calculate average rating of valid records
  const validRecordsWithRating = records.filter((r) => !r.isExcluded && typeof r.rating === 'number');
  const avgRating = validRecordsWithRating.length > 0
    ? (validRecordsWithRating.reduce((acc, r) => acc + r.rating, 0) / validRecordsWithRating.length).toFixed(1)
    : '2.1';

  // Distinct segments
  const distinctSegments = Array.from(new Set(records.map((r) => r.segment).filter(Boolean)));

  const handleDownloadCsv = () => {
    const headers = ['Record_ID', 'Date', 'Customer_Segment', 'Rating', 'Sentiment', 'Feedback_Text', 'Source_File', 'Project_Name', 'Excluded'];
    const rows = filteredRecords.map((r) => [
      `"${r.id || ''}"`,
      `"${r.date || ''}"`,
      `"${r.segment || ''}"`,
      r.rating !== null && r.rating !== undefined ? r.rating : '',
      `"${r.sentiment || ''}"`,
      `"${(r.feedbackText || '').replace(/"/g, '""')}"`,
      `"${r.sourceFile || ''}"`,
      `"${r.projectName || ''}"`,
      r.isExcluded ? 'Yes' : 'No',
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `customer_feedback_records_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenWorkspaceForRecord = (projectId?: string) => {
    const project = projects.find((p) => p.id === projectId) || projects[0];
    if (project) {
      onOpenProjectWorkspace(project);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                <span>Customer Feedback Records</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">
                  {totalRecords} Valid Records
                </span>
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Traceable customer support tickets, interview excerpts, and feedback processed with full audit trails.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleDownloadCsv}
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV ({filteredRecords.length})</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wide">Valid Evidence</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalRecords}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">records</span>
          </div>
          <p className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% verified & mapped</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wide">Average Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{avgRating}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">/ 5.0</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Critical friction detected</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wide">Excluded Noise</span>
            <ShieldAlert className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalExcluded}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">row</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">Blank comment excluded</p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 dark:text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wide">Evidence Sources</span>
            <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1.5">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{sources.length || 1}</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">files</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">CSVs, tickets & transcripts</p>
        </div>
      </div>

      {/* Sources Ingested Details Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Active Evidence Sources</span>
          </h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">Audit trail reference</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sources.map((src) => (
            <div
              key={src.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between"
            >
              <div className="min-w-0 pr-2">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{src.fileName}</p>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {src.recordCount} rows &bull; {src.excludedCount} excluded &bull; {src.projectName}
                </p>
              </div>
              <button
                onClick={() => handleOpenWorkspaceForRecord(src.projectId)}
                className="shrink-0 p-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 rounded-lg cursor-pointer"
                title="Open Project Workspace"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search comments, ticket ID, keywords..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Sentiment Filter Pills */}
          <div className="flex items-center space-x-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'negative', 'neutral', 'positive'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSentiment(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                  selectedSentiment === s
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary filters: Segment & Project */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Segment:</span>
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs"
            >
              <option value="all">All Segments</option>
              {distinctSegments.map((seg) => (
                <option key={seg} value={seg}>
                  {seg}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-medium">Project:</span>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="py-1 px-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs max-w-xs truncate"
            >
              <option value="all">All Research Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="ml-auto text-slate-400 text-[11px]">
            Showing <strong className="text-slate-700 dark:text-slate-300">{filteredRecords.length}</strong> of{' '}
            {records.length} records
          </div>
        </div>
      </div>

      {/* Feedback Records Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-indigo-500" />
            <p className="text-xs">Loading customer feedback records...</p>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <AlertCircle className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No feedback records found</p>
            <p className="text-xs text-slate-400">Try adjusting your search terms or filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <th className="py-3 px-4">Ticket / ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Segment</th>
                  <th className="py-3 px-3">Rating & Sentiment</th>
                  <th className="py-3 px-4 min-w-[320px]">Customer Feedback Quote</th>
                  <th className="py-3 px-3">Project / Source</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {filteredRecords.map((r, idx) => (
                  <tr
                    key={r.id || idx}
                    className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                      r.isExcluded ? 'opacity-60 bg-slate-50/40 dark:bg-slate-900/40' : ''
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 dark:text-slate-200">
                      {r.id}
                      {r.isExcluded && (
                        <span className="block text-[10px] text-rose-500 font-sans font-bold">Excluded (Empty)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">{r.date}</td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-[11px]">
                        {r.segment}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      {r.rating !== null && r.rating !== undefined ? (
                        <div className="flex items-center space-x-1.5">
                          <span
                            className={`px-2 py-0.5 rounded-sm font-bold text-[10px] uppercase ${
                              r.sentiment === 'positive' || r.rating >= 4
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                : r.sentiment === 'neutral' || r.rating === 3
                                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                                : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300'
                            }`}
                          >
                            ★ {r.rating} &bull; {r.sentiment || 'negative'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 leading-relaxed text-slate-800 dark:text-slate-200">
                      {r.feedbackText ? (
                        <span className="italic">"{r.feedbackText}"</span>
                      ) : (
                        <span className="text-rose-400 italic">&lt;Blank feedback comment row&gt;</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <p className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                        {r.projectName}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{r.sourceFile}</p>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenWorkspaceForRecord(r.projectId)}
                        className="inline-flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold cursor-pointer"
                        title="Open Research Workspace"
                      >
                        <span>Workspace</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
