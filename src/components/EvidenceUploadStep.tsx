import React, { useState, useRef } from 'react';
import { Project, EvidenceSource } from '../types';
import { parseFileContent, parseCsvString } from '../lib/csvParser';
import { SAMPLE_DATASETS, SampleDataset } from '../lib/sampleData';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Trash2,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  Globe,
  Sliders,
  Sparkles,
  ArrowRight,
  Eye,
  FileCode,
} from 'lucide-react';

interface EvidenceUploadStepProps {
  project: Project;
  onUpdateProject: (updated: Partial<Project>) => Promise<void>;
  onRunAnalysis: () => Promise<void>;
  isAnalyzing: boolean;
}

export const EvidenceUploadStep: React.FC<EvidenceUploadStepProps> = ({
  project,
  onUpdateProject,
  onRunAnalysis,
  isAnalyzing,
}) => {
  const [sources, setSources] = useState<EvidenceSource[]>(project.sources || []);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [showUrlGuardrail, setShowUrlGuardrail] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlGuardrailMessage, setUrlGuardrailMessage] = useState('');
  const [activeMappingSourceId, setActiveMappingSourceId] = useState<string | null>(null);
  const [previewModalSource, setPreviewModalSource] = useState<EvidenceSource | null>(null);
  const [showPasteTranscriptModal, setShowPasteTranscriptModal] = useState(false);
  const [pastedTranscriptText, setPastedTranscriptText] = useState('');
  const [transcriptTitle, setTranscriptTitle] = useState('Customer Interview Transcript');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    setIsProcessingFile(true);

    try {
      const newSources: EvidenceSource[] = [...sources];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const lowerName = file.name.toLowerCase();

        // Check if supported
        if (
          !lowerName.endsWith('.csv') &&
          !lowerName.endsWith('.tsv') &&
          !lowerName.endsWith('.xlsx') &&
          !lowerName.endsWith('.xls') &&
          !lowerName.endsWith('.txt')
        ) {
          throw new Error(`Unsupported file type for "${file.name}". Please upload .csv, .xlsx, or .txt files.`);
        }

        const arrayBuffer = await file.arrayBuffer();
        const parsed = await parseFileContent(file, arrayBuffer);

        newSources.push({
          id: parsed.id || `src_${Date.now()}_${i}`,
          fileName: parsed.fileName || file.name,
          fileType: parsed.fileType || 'csv',
          uploadedAt: new Date().toISOString(),
          fileSize: file.size,
          recordCount: parsed.recordCount || 0,
          excludedCount: parsed.excludedCount || 0,
          exclusionNotes: parsed.exclusionNotes,
          detectedColumns: parsed.detectedColumns || [],
          columnMappings: parsed.columnMappings,
          previewRows: parsed.previewRows,
          status: 'ready',
        });
      }

      setSources(newSources);
      await onUpdateProject({
        sources: newSources,
        status: newSources.length > 0 ? 'data_uploaded' : project.status,
      });
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Error parsing file.');
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleHeatmapUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const heatmapSource: EvidenceSource = {
        id: `src_heatmap_${Date.now()}`,
        fileName: file.name,
        fileType: 'heatmap',
        uploadedAt: new Date().toISOString(),
        fileSize: file.size,
        recordCount: 1,
        excludedCount: 0,
        imageDataUrl: dataUrl,
        extractedContent: `Heatmap visual screenshot: ${file.name}. Size: ${(file.size / 1024).toFixed(1)} KB.`,
        status: 'ready',
      };

      const updated = [...sources, heatmapSource];
      setSources(updated);
      await onUpdateProject({ sources: updated, status: 'data_uploaded' });
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleRemoveSource = async (sourceId: string) => {
    const updated = sources.filter((s) => s.id !== sourceId);
    setSources(updated);
    await onUpdateProject({
      sources: updated,
      status: updated.length === 0 ? 'brief_ready' : project.status,
    });
  };

  const handleLoadSample = async (sample: SampleDataset) => {
    setUploadError(null);
    let newSource: EvidenceSource;

    if (sample.fileType === 'csv' && sample.csvContent) {
      const parsed = parseCsvString(sample.csvContent, sample.fileName);
      newSource = {
        id: `src_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        fileName: sample.fileName,
        fileType: 'csv',
        uploadedAt: new Date().toISOString(),
        fileSize: sample.csvContent.length,
        recordCount: parsed.recordCount || 0,
        excludedCount: parsed.excludedCount || 0,
        exclusionNotes: parsed.exclusionNotes,
        detectedColumns: parsed.detectedColumns || [],
        columnMappings: sample.columnMappings || parsed.columnMappings,
        previewRows: parsed.previewRows,
        status: 'ready',
      };
    } else if (sample.fileType === 'transcript' && sample.transcriptContent) {
      newSource = {
        id: `src_trans_${Date.now()}`,
        fileName: sample.fileName,
        fileType: 'transcript',
        uploadedAt: new Date().toISOString(),
        fileSize: sample.transcriptContent.length,
        recordCount: 1,
        excludedCount: 0,
        extractedContent: sample.transcriptContent,
        previewRows: [{ section: 'Full Interview Transcript', text: sample.transcriptContent.substring(0, 500) }],
        status: 'ready',
      };
    } else {
      return;
    }

    const updated = [...sources, newSource];
    setSources(updated);
    await onUpdateProject({
      sources: updated,
      status: 'data_uploaded',
    });
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    // SCENARIO 6 / AC-09.4 Realism Guardrail
    setShowUrlGuardrail(true);
    setUrlGuardrailMessage(
      `A pasted website URL (${urlInput.trim()}) alone does not provide actual visitor interaction data (clicks, scrolls, or bounce events). Real behavioural data requires a heatmap screenshot or analytics export.`
    );
  };

  const handleSaveTranscript = async () => {
    if (!pastedTranscriptText.trim()) return;

    const transcriptSource: EvidenceSource = {
      id: `src_trans_${Date.now()}`,
      fileName: `${transcriptTitle.trim() || 'Interview'}.txt`,
      fileType: 'transcript',
      uploadedAt: new Date().toISOString(),
      fileSize: pastedTranscriptText.length,
      recordCount: 1,
      excludedCount: 0,
      extractedContent: pastedTranscriptText.trim(),
      previewRows: [{ section: 'Interview Transcript', text: pastedTranscriptText.trim().substring(0, 400) }],
      status: 'ready',
    };

    const updated = [...sources, transcriptSource];
    setSources(updated);
    await onUpdateProject({ sources: updated, status: 'data_uploaded' });
    setShowPasteTranscriptModal(false);
    setPastedTranscriptText('');
  };

  const handleUpdateMapping = async (
    sourceId: string,
    key: 'feedbackTextCol' | 'ratingCol' | 'dateCol' | 'segmentCol' | 'idCol',
    value: string
  ) => {
    const updated = sources.map((s) => {
      if (s.id === sourceId) {
        return {
          ...s,
          columnMappings: {
            ...s.columnMappings,
            [key]: value || undefined,
          },
        };
      }
      return s;
    });
    setSources(updated);
    await onUpdateProject({ sources: updated });
  };

  const activeMappingSource = sources.find((s) => s.id === activeMappingSourceId);

  return (
    <div className="space-y-6">
      {/* Upload Zone Card */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">Upload Evidence & Feedback Sources</h3>
            <p className="text-xs text-slate-500">
              Upload existing support tickets, CSV/Excel feedback files, interview transcripts, or heatmap screenshots.
            </p>
          </div>

          {/* Quick-load Sample Buttons */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-semibold text-slate-400">Load Synthetic Data:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_DATASETS[0])}
                className="text-xs font-semibold px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/70 rounded-md transition-colors cursor-pointer"
                title="Scenario 1: Checkout Drop-off (25 rows, Sufficient data)"
              >
                + Checkout CSV
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_DATASETS[1])}
                className="text-xs font-semibold px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/70 rounded-md transition-colors cursor-pointer"
                title="Scenario 2: Onboarding Tickets (12 rows, Knowledge Gap)"
              >
                + Onboarding Tickets
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample(SAMPLE_DATASETS[2])}
                className="text-xs font-semibold px-2.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/70 rounded-md transition-colors cursor-pointer"
                title="Scenario 3: Interview Transcript"
              >
                + Qualitative Transcript
              </button>
            </div>
          </div>
        </div>

        {/* Upload Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Option A: CSV / Excel / TXT File Upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20 rounded-xl p-5 text-center cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              accept=".csv,.tsv,.xlsx,.xls,.txt"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Customer Feedback Dataset</h4>
            <p className="text-xs text-slate-500 mt-1">
              Upload <span className="font-semibold text-slate-700">CSV, XLSX, XLS</span> files. Support tickets, NPS comments, App Store reviews.
            </p>
            <span className="inline-block mt-3 text-xs font-semibold text-indigo-600 group-hover:underline">
              Choose Files &rarr;
            </span>
          </div>

          {/* Option B: Qualitative Interview Transcripts */}
          <div
            onClick={() => setShowPasteTranscriptModal(true)}
            className="border-2 border-dashed border-slate-200 hover:border-sky-400 bg-slate-50/50 hover:bg-sky-50/20 rounded-xl p-5 text-center cursor-pointer transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Interview Transcript</h4>
            <p className="text-xs text-slate-500 mt-1">
              Paste customer 1-on-1 calls, Zoom/Teams transcripts, or user testing session notes.
            </p>
            <span className="inline-block mt-3 text-xs font-semibold text-sky-600 group-hover:underline">
              Paste Transcript &rarr;
            </span>
          </div>

          {/* Option C: Heatmap Screenshot & Reports */}
          <div
            onClick={() => imageInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-amber-400 bg-slate-50/50 hover:bg-amber-50/20 rounded-xl p-5 text-center cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleHeatmapUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">Heatmap Screenshot</h4>
            <p className="text-xs text-slate-500 mt-1">
              Upload actual click/scroll heatmap screenshots (Hotjar, CrazyEgg, Clarity).
            </p>
            <span className="inline-block mt-3 text-xs font-semibold text-amber-600 group-hover:underline">
              Upload Heatmap &rarr;
            </span>
          </div>
        </div>

        {/* Website URL Guardrail Form (Scenario 6 Requirement) */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <form onSubmit={handleUrlSubmit} className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or test a website URL (e.g. https://apexstore.com/checkout)..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Check URL
            </button>
          </form>

          {showUrlGuardrail && (
            <div className="mt-3 p-3.5 bg-amber-50 border border-amber-200/90 rounded-lg text-xs text-amber-900 flex items-start space-x-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold">Realism Guardrail: </span>
                {urlGuardrailMessage}
              </div>
              <button
                type="button"
                onClick={() => setShowUrlGuardrail(false)}
                className="text-amber-700 font-bold hover:text-amber-900 cursor-pointer"
              >
                &times;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Upload Error Alert */}
      {uploadError && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-800 flex items-start space-x-2.5">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Upload or Parsing Error</p>
            <p className="text-xs mt-0.5 text-rose-700">{uploadError}</p>
          </div>
          <button
            onClick={() => setUploadError(null)}
            className="text-xs font-bold text-rose-700 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Uploaded Evidence Sources Table */}
      {sources.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="px-5 py-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Uploaded Evidence Sources ({sources.length})
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Total Records:{' '}
              <strong className="text-slate-800">
                {sources.reduce((sum, s) => sum + (s.recordCount || 0), 0)}
              </strong>
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {sources.map((source) => (
              <div key={source.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                    {source.fileType === 'csv' || source.fileType === 'xlsx' ? (
                      <FileSpreadsheet className="w-5 h-5" />
                    ) : source.fileType === 'transcript' ? (
                      <FileText className="w-5 h-5" />
                    ) : (
                      <ImageIcon className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-bold text-slate-900">{source.fileName}</h4>
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-slate-100 text-slate-600 rounded-md">
                        {source.fileType}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>{source.recordCount} records</span>
                      <span>&bull;</span>
                      <span>{(source.fileSize / 1024).toFixed(1)} KB</span>
                      {source.excludedCount > 0 && (
                        <>
                          <span>&bull;</span>
                          <span className="text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded-sm">
                            {source.excludedCount} empty/blank rows excluded
                          </span>
                        </>
                      )}
                    </div>

                    {/* Column mapping tags for tabular sources */}
                    {source.columnMappings && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {source.columnMappings.feedbackTextCol && (
                          <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                            Text: <strong>{source.columnMappings.feedbackTextCol}</strong>
                          </span>
                        )}
                        {source.columnMappings.ratingCol && (
                          <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                            Rating: <strong>{source.columnMappings.ratingCol}</strong>
                          </span>
                        )}
                        {source.columnMappings.segmentCol && (
                          <span className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-mono">
                            Segment: <strong>{source.columnMappings.segmentCol}</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Source actions */}
                <div className="flex items-center space-x-2 self-end sm:self-center">
                  {source.columnMappings && (
                    <button
                      onClick={() => setActiveMappingSourceId(source.id)}
                      className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center space-x-1.5 cursor-pointer"
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>Adjust Mapping</span>
                    </button>
                  )}

                  <button
                    onClick={() => setPreviewModalSource(source)}
                    className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                    title="Preview extracted records"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleRemoveSource(source.id)}
                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                    title="Remove this source"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Action: Run Analysis */}
          <div className="p-5 bg-slate-50/80 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Ready to process <strong className="text-slate-800">{sources.length}</strong> sources with Gemini AI.
            </div>

            <button
              onClick={onRunAnalysis}
              disabled={isAnalyzing}
              className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-xs shadow-indigo-200 transition-all cursor-pointer disabled:opacity-60"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Processing Feedback & Sufficiency...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Feedback Intelligence Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-400">
          <UploadCloud className="w-8 h-8 mx-auto mb-2 text-slate-300" />
          <p className="text-sm font-medium text-slate-600">No evidence files uploaded yet</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload at least one CSV, transcript, or heatmap file, or click a sample button above to begin.
          </p>
        </div>
      )}

      {/* Adjust Column Mapping Modal */}
      {activeMappingSource && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Adjust Column Mappings</h3>
                <p className="text-xs text-slate-500">{activeMappingSource.fileName}</p>
              </div>
              <button
                onClick={() => setActiveMappingSourceId(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Customer Feedback / Comment Text Column:
                </label>
                <select
                  value={activeMappingSource.columnMappings?.feedbackTextCol || ''}
                  onChange={(e) =>
                    handleUpdateMapping(activeMappingSource.id, 'feedbackTextCol', e.target.value)
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- None --</option>
                  {activeMappingSource.detectedColumns?.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Rating Column (1-5 scale):
                </label>
                <select
                  value={activeMappingSource.columnMappings?.ratingCol || ''}
                  onChange={(e) =>
                    handleUpdateMapping(activeMappingSource.id, 'ratingCol', e.target.value)
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- None --</option>
                  {activeMappingSource.detectedColumns?.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Customer Segment / Tier Column:
                </label>
                <select
                  value={activeMappingSource.columnMappings?.segmentCol || ''}
                  onChange={(e) =>
                    handleUpdateMapping(activeMappingSource.id, 'segmentCol', e.target.value)
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- None --</option>
                  {activeMappingSource.detectedColumns?.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Record ID / Ticket # Column:
                </label>
                <select
                  value={activeMappingSource.columnMappings?.idCol || ''}
                  onChange={(e) =>
                    handleUpdateMapping(activeMappingSource.id, 'idCol', e.target.value)
                  }
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- None --</option>
                  {activeMappingSource.detectedColumns?.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveMappingSourceId(null)}
                className="px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg text-xs hover:bg-indigo-700 cursor-pointer"
              >
                Apply Mappings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Records Modal */}
      {previewModalSource && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">Source Records Preview</h3>
                <p className="text-xs text-slate-500">
                  {previewModalSource.fileName} ({previewModalSource.recordCount} records)
                </p>
              </div>
              <button
                onClick={() => setPreviewModalSource(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto mt-4">
              {previewModalSource.fileType === 'heatmap' && previewModalSource.imageDataUrl ? (
                <div className="text-center p-4">
                  <img
                    src={previewModalSource.imageDataUrl}
                    alt="Heatmap Preview"
                    className="max-h-96 mx-auto rounded-lg border border-slate-200 shadow-xs"
                  />
                </div>
              ) : previewModalSource.extractedContent ? (
                <pre className="p-4 bg-slate-50 text-slate-800 rounded-lg text-xs font-mono whitespace-pre-wrap">
                  {previewModalSource.extractedContent}
                </pre>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200">
                    <thead className="bg-slate-100 text-slate-700 font-semibold">
                      <tr>
                        {previewModalSource.detectedColumns?.map((col) => (
                          <th key={col} className="p-2 border-b border-slate-200 whitespace-nowrap">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {previewModalSource.previewRows?.slice(0, 10).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50">
                          {previewModalSource.detectedColumns?.map((col) => (
                            <td key={col} className="p-2 border-b border-slate-100 max-w-xs truncate">
                              {String(row[col] ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {previewModalSource.previewRows && previewModalSource.previewRows.length > 10 && (
                    <p className="text-xs text-slate-400 p-2 text-center">
                      Showing first 10 of {previewModalSource.recordCount} rows...
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setPreviewModalSource(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-200 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Paste Qualitative Transcript Modal */}
      {showPasteTranscriptModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-sky-600" />
                <h3 className="text-base font-bold text-slate-900">Add Customer Interview Transcript</h3>
              </div>
              <button
                onClick={() => setShowPasteTranscriptModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transcript Title / Participant Name
                </label>
                <input
                  type="text"
                  value={transcriptTitle}
                  onChange={(e) => setTranscriptTitle(e.target.value)}
                  placeholder="e.g. Interview with Sarah - Enterprise Lead"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transcript Text (Speaker labels & timestamps are preserved)
                </label>
                <textarea
                  rows={8}
                  value={pastedTranscriptText}
                  onChange={(e) => setPastedTranscriptText(e.target.value)}
                  placeholder="[00:01:15] Alex: How would you describe your experience with the new menu?&#10;[00:01:25] Customer: It was confusing because my pinned shortcuts were removed..."
                  className="w-full text-xs font-mono p-3 border border-slate-300 rounded-lg focus:border-sky-500 resize-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                onClick={() => setShowPasteTranscriptModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTranscript}
                disabled={!pastedTranscriptText.trim()}
                className="px-4 py-2 text-xs font-semibold bg-sky-600 text-white rounded-lg hover:bg-sky-700 disabled:opacity-50 cursor-pointer"
              >
                Save Transcript Source
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
