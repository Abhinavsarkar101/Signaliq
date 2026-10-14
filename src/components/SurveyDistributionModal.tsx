import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';
import { api } from '../lib/api';
import {
  EmailRecipient,
  EmailValidationSummary,
  EmailCampaign,
} from '../types';
import {
  Mail,
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Copy,
  Check,
  Download,
  Trash2,
  ExternalLink,
  HelpCircle,
  Send,
  Layers,
  Sparkles,
  ShieldCheck,
  Code2,
  RefreshCw,
  X,
  UserCheck,
  Clock,
  ArrowRight,
  Sliders,
} from 'lucide-react';

interface SurveyDistributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  surveyId: string;
  projectId?: string;
  surveyTitle: string;
  surveyUrl: string;
  onCampaignSent?: () => void;
}

export const SurveyDistributionModal: React.FC<SurveyDistributionModalProps> = ({
  isOpen,
  onClose,
  surveyId,
  projectId = '',
  surveyTitle,
  surveyUrl,
  onCampaignSent,
}) => {
  // Navigation tabs within modal
  const [activeTab, setActiveTab] = useState<'recipients' | 'compose' | 'confirm' | 'history' | 'setup'>('recipients');
  const [recipientInputMode, setRecipientInputMode] = useState<'manual' | 'csv'>('manual');

  // Manual Input State
  const [manualText, setManualText] = useState('');

  // CSV Input State
  const [csvColumns, setCsvColumns] = useState<string[]>([]);
  const [selectedEmailCol, setSelectedEmailCol] = useState<string>('');
  const [selectedNameCol, setSelectedNameCol] = useState<string>('');
  const [csvRawRows, setCsvRawRows] = useState<Record<string, any>[]>([]);
  const [csvFileName, setCsvFileName] = useState<string>('');

  // Validated Recipients & Summary
  const [recipients, setRecipients] = useState<EmailRecipient[]>([]);
  const [summary, setSummary] = useState<EmailValidationSummary>({
    totalRows: 0,
    validUniqueCount: 0,
    invalidCount: 0,
    duplicateCount: 0,
    optedOutCount: 0,
    previouslyEmailedCount: 0,
    selectedCount: 0,
  });
  const [previouslyEmailedWarning, setPreviouslyEmailedWarning] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // Email Content
  const [campaignName, setCampaignName] = useState(`${surveyTitle} Outreach`);
  const [emailSubject, setEmailSubject] = useState(`Your feedback matters — ${surveyTitle}`);
  const [emailBody, setEmailBody] = useState(
    `Hello {{recipient_name}},\n\nWe value your opinion and would love your feedback on our product.\n\nPlease take 1-2 minutes to complete our short survey:\n{{survey_url}}\n\nThank you for helping us improve!\n— SignalIQ Research Team`
  );

  // Google Apps Script & Quota State
  const [appsScriptUrl, setAppsScriptUrl] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [remainingQuota, setRemainingQuota] = useState<number | null>(null);
  const [connectedAccount, setConnectedAccount] = useState<string>('');
  const [isCheckingQuota, setIsCheckingQuota] = useState(false);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [isSavingUrl, setIsSavingUrl] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Sending State
  const [isSending, setIsSending] = useState(false);
  const [sendConfirmed, setSendConfirmed] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [latestCampaign, setLatestCampaign] = useState<EmailCampaign | null>(null);

  // Campaign History
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load config & quota on mount
  useEffect(() => {
    if (isOpen) {
      loadEmailConfigAndQuota();
      loadCampaignHistory();
    }
  }, [isOpen, surveyId]);

  const loadEmailConfigAndQuota = async () => {
    setIsCheckingQuota(true);
    setQuotaError(null);
    try {
      const { config } = await api.getEmailConfig();
      if (config.appsScriptUrl) {
        setAppsScriptUrl(config.appsScriptUrl);
      }
      const quotaRes = await api.getEmailQuota();
      setIsConfigured(quotaRes.isConfigured);
      setRemainingQuota(quotaRes.remainingQuota);
      if (quotaRes.account) setConnectedAccount(quotaRes.account);
      if (quotaRes.error) setQuotaError(quotaRes.error);
    } catch (err: any) {
      console.error(err);
      setQuotaError(err.message || 'Failed to check email service status.');
    } finally {
      setIsCheckingQuota(false);
    }
  };

  const loadCampaignHistory = async () => {
    setIsLoadingCampaigns(true);
    try {
      const list = await api.getEmailCampaigns(surveyId);
      setCampaigns(list);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingCampaigns(false);
    }
  };

  const handleSaveAppsScriptUrl = async () => {
    setIsSavingUrl(true);
    try {
      await api.saveEmailConfig({ appsScriptUrl });
      await loadEmailConfigAndQuota();
    } catch (err: any) {
      setQuotaError(err.message || 'Failed to save configuration');
    } finally {
      setIsSavingUrl(false);
    }
  };

  // --- MANUAL EMAIL PARSING ---
  const handleValidateManual = async () => {
    if (!manualText.trim()) return;
    setIsValidating(true);
    try {
      // Split by comma, semicolon, newline, or whitespace
      const rawTokens = manualText
        .split(/[\n,;]+/)
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await api.validateEmailRecipients({
        rawRecipients: rawTokens,
        surveyId,
      });

      setRecipients(res.recipients);
      setSummary(res.summary);
      setPreviouslyEmailedWarning(res.previouslyEmailedWarning);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleAddMyEmail = () => {
    const myEmail = 'Abhinavsarkar121@gmail.com';
    const updated = manualText.trim() ? `${manualText}\n${myEmail}` : myEmail;
    setManualText(updated);
  };

  const handleAddSyntheticDemo = () => {
    const demo = [
      'sarah.product@enterprise-corp.com',
      'alex.chen@innovate-tech.io',
      'jordan.pm@startupgrowth.co',
      'taylor.ux@designcraft.org',
      'morgan.cx@customerfirst.net',
      'invalid-email-format.com', // For demonstration of validation
      'sarah.product@enterprise-corp.com', // For demonstration of duplicate removal
    ].join('\n');
    setManualText(demo);
  };

  // --- CSV FILE UPLOAD & PARSING ---
  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setCsvFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows: Record<string, any>[] = XLSX.utils.sheet_to_json(firstSheet, { defval: '' });

      if (rows.length === 0) {
        alert('Uploaded file is empty.');
        return;
      }

      setCsvRawRows(rows);
      const cols = Object.keys(rows[0] || {});
      setCsvColumns(cols);

      // Auto detect email column
      const detectedEmailCol = cols.find((c) => {
        const lower = c.toLowerCase().replace(/[^a-z0-9]/g, '');
        return ['email', 'emailaddress', 'customeremail', 'contactemail', 'useremail', 'mail'].includes(lower);
      }) || cols[0];
      setSelectedEmailCol(detectedEmailCol);

      // Auto detect name column
      const detectedNameCol = cols.find((c) => {
        const lower = c.toLowerCase().replace(/[^a-z0-9]/g, '');
        return ['name', 'fullname', 'customername', 'firstname', 'contactname'].includes(lower);
      });
      if (detectedNameCol) setSelectedNameCol(detectedNameCol);

      // Validate immediately with detected column
      processCsvRows(rows, detectedEmailCol, detectedNameCol);
    } catch (err: any) {
      alert(`Error reading CSV file: ${err.message || 'Invalid format'}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const processCsvRows = async (rows: Record<string, any>[], emailCol: string, nameCol?: string) => {
    if (!emailCol) return;
    setIsValidating(true);
    try {
      const formatted = rows.map((r) => ({
        email: String(r[emailCol] || '').trim(),
        name: nameCol ? String(r[nameCol] || '').trim() : undefined,
      }));

      const res = await api.validateEmailRecipients({
        rawRecipients: formatted,
        surveyId,
      });

      setRecipients(res.recipients);
      setSummary(res.summary);
      setPreviouslyEmailedWarning(res.previouslyEmailedWarning);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleColumnSelectionChange = (newEmailCol: string) => {
    setSelectedEmailCol(newEmailCol);
    if (csvRawRows.length > 0) {
      processCsvRows(csvRawRows, newEmailCol, selectedNameCol);
    }
  };

  // Toggle selection of individual recipient
  const handleToggleRecipient = (id: string) => {
    setRecipients((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r));
      const selectedCount = updated.filter((r) => r.selected && r.isValid && !r.isDuplicate && !r.isOptedOut).length;
      setSummary((s) => ({ ...s, selectedCount }));
      return updated;
    });
  };

  const handleRemoveRecipient = (id: string) => {
    setRecipients((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      const selectedCount = updated.filter((r) => r.selected && r.isValid && !r.isDuplicate && !r.isOptedOut).length;
      setSummary((s) => ({
        ...s,
        totalRows: updated.length,
        validUniqueCount: updated.filter((r) => r.isValid && !r.isDuplicate && !r.isOptedOut).length,
        selectedCount,
      }));
      return updated;
    });
  };

  // Download Invalid Addresses CSV
  const handleDownloadInvalidCsv = () => {
    const invalidRecipients = recipients.filter((r) => !r.isValid || r.isDuplicate || r.isOptedOut);
    if (invalidRecipients.length === 0) {
      alert('No invalid or excluded recipients to download.');
      return;
    }

    let csvContent = 'Row,Email Address,Reason\n';
    invalidRecipients.forEach((r) => {
      const reason = !r.isValid
        ? r.validationError || 'Invalid format'
        : r.isDuplicate
        ? 'Duplicate address'
        : 'Opted out from surveys';
      csvContent += `${r.rowIndex || '-'},"${(r.email || '').replace(/"/g, '""')}","${reason}"\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invalid_Recipients_${surveyId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Quota Trim: Trim selection down to available quota
  const handleTrimToQuota = () => {
    if (!remainingQuota || remainingQuota <= 0) return;
    let count = 0;
    setRecipients((prev) => {
      const updated = prev.map((r) => {
        if (r.isValid && !r.isDuplicate && !r.isOptedOut) {
          if (count < remainingQuota) {
            count++;
            return { ...r, selected: true };
          } else {
            return { ...r, selected: false };
          }
        }
        return r;
      });
      setSummary((s) => ({ ...s, selectedCount: count }));
      return updated;
    });
  };

  // --- LAUNCH BULK SEND ---
  const handleSendCampaign = async (simulate = false) => {
    const sendingList = recipients.filter((r) => r.selected && r.isValid && !r.isDuplicate && !r.isOptedOut);
    if (sendingList.length === 0) {
      setSendError('No valid recipients selected to send.');
      return;
    }

    setIsSending(true);
    setSendError(null);

    try {
      const res = await api.sendEmailCampaign({
        surveyId,
        projectId,
        campaignName,
        subject: emailSubject,
        body: emailBody,
        recipients: sendingList.map((r) => ({ email: r.email, name: r.name })),
        confirmed: true,
        simulate: simulate || !isConfigured,
      });

      setLatestCampaign(res.campaign);
      setActiveTab('history');
      await loadCampaignHistory();
      if (onCampaignSent) onCampaignSent();
    } catch (err: any) {
      console.error(err);
      setSendError(err.message || 'Failed to dispatch email campaign.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  const validSelectedRecipients = recipients.filter((r) => r.selected && r.isValid && !r.isDuplicate && !r.isOptedOut);
  const isOverQuota = remainingQuota !== null && validSelectedRecipients.length > remainingQuota;

  const appsScriptTemplate = `/**
 * SignalIQ — Google Apps Script Bulk Survey Email Distribution Web App
 * Uses Google Apps Script MailApp and Gmail with zero external paid services.
 */

function doGet(e) {
  try {
    var quota = MailApp.getRemainingDailyQuota();
    var email = Session.getActiveUser().getEmail() || "Authorized Google Account";
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      status: "active",
      remainingQuota: quota,
      account: email,
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var recipients = data.recipients || [];
    var subject = data.subject || "Your Feedback Matters";
    var body = data.body || "";
    var surveyUrl = data.surveyUrl || "";
    var campaignId = data.campaignId || ("camp_" + new Date().getTime());

    var quota = MailApp.getRemainingDailyQuota();
    if (recipients.length > quota) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Recipient count (" + recipients.length + ") exceeds remaining daily quota (" + quota + ")."
      })).setMimeType(ContentService.MimeType.JSON);
    }

    var sentCount = 0;
    var failedCount = 0;
    var results = [];

    for (var i = 0; i < recipients.length; i++) {
      var item = recipients[i];
      var email = (typeof item === 'string') ? item : item.email;
      var name = (typeof item === 'object' && item.name) ? item.name : "";

      if (!email || email.indexOf("@") === -1) {
        failedCount++;
        results.push({ email: email, status: "failed", error: "Invalid email syntax" });
        continue;
      }

      try {
        var personalizedBody = body
          .replace(/\\{\\{survey_url\\}\\}/g, surveyUrl)
          .replace(/\\{\\{recipient_name\\}\\}/g, name || "Customer")
          .replace(/\\{\\{recipient_email\\}\\}/g, email);

        var htmlBody = personalizedBody.replace(/\\n/g, "<br>");

        MailApp.sendEmail({
          to: email,
          subject: subject,
          htmlBody: htmlBody,
          body: personalizedBody
        });

        sentCount++;
        results.push({ email: email, status: "sent", timestamp: new Date().toISOString() });
      } catch (sendErr) {
        failedCount++;
        results.push({ email: email, status: "failed", error: sendErr.toString() });
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      campaignId: campaignId,
      sentCount: sentCount,
      failedCount: failedCount,
      remainingQuota: MailApp.getRemainingDailyQuota(),
      results: results
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 text-white flex items-center justify-center shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Bulk Survey Email Distribution
              </h2>
              <p className="text-xs text-slate-500 truncate max-w-md">
                Survey: <strong className="text-slate-700">{surveyTitle}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Live Quota Indicator Badge */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  isConfigured ? 'bg-emerald-500' : 'bg-amber-400'
                }`}
              ></span>
              <span className="text-slate-600 font-medium">
                {isConfigured
                  ? `Daily Quota: ${remainingQuota !== null ? remainingQuota : 'Checking...'} left`
                  : 'Apps Script: Demo Mode'}
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Workflow Tabs */}
        <div className="px-6 border-b border-slate-200 bg-white flex items-center space-x-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('recipients')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'recipients'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>1. Recipients & CSV ({summary.selectedCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('compose')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'compose'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>2. Email Content & Preview</span>
          </button>

          <button
            onClick={() => setActiveTab('confirm')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'confirm'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>3. Review & Send</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Campaign History ({campaigns.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`py-3 px-3.5 border-b-2 transition-colors cursor-pointer flex items-center space-x-1.5 ${
              activeTab === 'setup'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Google Apps Script Setup</span>
          </button>
        </div>

        {/* Modal Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: RECIPIENTS & CSV */}
          {activeTab === 'recipients' && (
            <div className="space-y-6">
              {/* Option Selector Toggle */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
                  <button
                    onClick={() => setRecipientInputMode('manual')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      recipientInputMode === 'manual'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Option A: Enter Manually
                  </button>
                  <button
                    onClick={() => setRecipientInputMode('csv')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      recipientInputMode === 'csv'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Option B: Upload CSV File
                  </button>
                </div>

                {/* Quick Test Presets */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleAddMyEmail}
                    className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors cursor-pointer"
                    title="Add user's own email: Abhinavsarkar121@gmail.com"
                  >
                    + Add My Email
                  </button>
                  <button
                    onClick={handleAddSyntheticDemo}
                    className="text-xs font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors cursor-pointer"
                  >
                    + 5 Demo Customers
                  </button>
                </div>
              </div>

              {/* Option A: Manual Entry */}
              {recipientInputMode === 'manual' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      Enter Email Addresses (Comma, Semicolon, or Newline separated)
                    </label>
                    <button
                      onClick={handleValidateManual}
                      disabled={!manualText.trim() || isValidating}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold cursor-pointer disabled:opacity-40"
                    >
                      {isValidating ? 'Validating...' : 'Validate List'}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={manualText}
                    onChange={(e) => setManualText(e.target.value)}
                    onBlur={handleValidateManual}
                    placeholder="sarah@example.com, alex@company.com&#10;jordan@startup.io&#10;taylor@design.org"
                    className="w-full text-xs font-mono p-3 border border-slate-300 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
                  />
                  <p className="text-[11px] text-slate-400">
                    Duplicates are automatically deduplicated. Invalid syntax will be detected and flagged below.
                  </p>
                </div>
              )}

              {/* Option B: CSV Upload */}
              {recipientInputMode === 'csv' && (
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-indigo-400 bg-slate-50/60 hover:bg-indigo-50/20 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleCsvUpload}
                      accept=".csv,.tsv,.txt"
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-indigo-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="text-sm font-bold text-slate-900">
                      {csvFileName ? `File: ${csvFileName}` : 'Select Customer Recipient CSV'}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Accepts single-column or multi-column customer files (.csv, .tsv).
                    </p>
                    <span className="inline-block mt-2 text-xs font-semibold text-indigo-600 group-hover:underline">
                      {csvFileName ? 'Change File' : 'Browse Files'}
                    </span>
                  </div>

                  {/* Column Mapping Selector (AC-03) */}
                  {csvColumns.length > 0 && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Detected Email Column:
                        </label>
                        <select
                          value={selectedEmailCol}
                          onChange={(e) => handleColumnSelectionChange(e.target.value)}
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                        >
                          {csvColumns.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">
                          Optional Name Column (for personalization):
                        </label>
                        <select
                          value={selectedNameCol}
                          onChange={(e) => {
                            setSelectedNameCol(e.target.value);
                            if (csvRawRows.length > 0) {
                              processCsvRows(csvRawRows, selectedEmailCol, e.target.value);
                            }
                          }}
                          className="w-full p-2 border border-slate-300 rounded-lg bg-white font-medium"
                        >
                          <option value="">-- None (Generic "Customer") --</option>
                          {csvColumns.map((col) => (
                            <option key={col} value={col}>
                              {col}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Validation Summary Cards (AC-04, AC-05) */}
              {recipients.length > 0 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                      <span className="text-slate-400 font-medium">Total Rows</span>
                      <p className="text-xl font-extrabold text-slate-900">{summary.totalRows}</p>
                    </div>

                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="text-emerald-700 font-bold">Valid & Unique</span>
                      <p className="text-xl font-extrabold text-emerald-800">{summary.validUniqueCount}</p>
                    </div>

                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                      <span className="text-rose-700 font-bold">Invalid Format</span>
                      <p className="text-xl font-extrabold text-rose-800">{summary.invalidCount}</p>
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <span className="text-amber-700 font-bold">Duplicates Removed</span>
                      <p className="text-xl font-extrabold text-amber-800">{summary.duplicateCount}</p>
                    </div>
                  </div>

                  {previouslyEmailedWarning && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>
                        Notice: <strong>{summary.previouslyEmailedCount}</strong> recipient(s) were already included in a previous campaign for this survey.
                      </span>
                    </div>
                  )}

                  {summary.invalidCount > 0 && (
                    <div className="flex items-center justify-between text-xs p-2.5 bg-rose-50/60 border border-rose-200 rounded-xl">
                      <span className="text-rose-800">
                        {summary.invalidCount} malformed email(s) will be excluded from the sending batch.
                      </span>
                      <button
                        onClick={handleDownloadInvalidCsv}
                        className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center space-x-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Invalid CSV Report</span>
                      </button>
                    </div>
                  )}

                  {/* Recipient Preview Table */}
                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 sticky top-0">
                        <tr>
                          <th className="p-2.5 border-b w-8">Send</th>
                          <th className="p-2.5 border-b">Email Address</th>
                          <th className="p-2.5 border-b">Name</th>
                          <th className="p-2.5 border-b">Status / Validation</th>
                          <th className="p-2.5 border-b text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {recipients.map((r) => {
                          const isEligible = r.isValid && !r.isDuplicate && !r.isOptedOut;
                          return (
                            <tr key={r.id} className={!isEligible ? 'bg-slate-50/50 opacity-60' : 'hover:bg-slate-50'}>
                              <td className="p-2.5">
                                <input
                                  type="checkbox"
                                  checked={r.selected && isEligible}
                                  disabled={!isEligible}
                                  onChange={() => handleToggleRecipient(r.id)}
                                  className="rounded-sm text-indigo-600"
                                />
                              </td>
                              <td className="p-2.5 font-mono text-slate-800">{r.email}</td>
                              <td className="p-2.5 text-slate-600">{r.name || '-'}</td>
                              <td className="p-2.5">
                                {!r.isValid ? (
                                  <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded-sm font-semibold text-[10px]">
                                    Invalid: {r.validationError}
                                  </span>
                                ) : r.isDuplicate ? (
                                  <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded-sm font-semibold text-[10px]">
                                    Duplicate
                                  </span>
                                ) : r.isOptedOut ? (
                                  <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-sm font-semibold text-[10px]">
                                    Opted Out
                                  </span>
                                ) : r.isPreviouslyEmailed ? (
                                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-sm font-semibold text-[10px]">
                                    Valid (Previously Emailed)
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-sm font-semibold text-[10px]">
                                    Valid
                                  </span>
                                )}
                              </td>
                              <td className="p-2.5 text-right">
                                <button
                                  onClick={() => handleRemoveRecipient(r.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                                  title="Remove from list"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Proceed to compose step */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-500">
                      Selected Recipients: <strong>{validSelectedRecipients.length}</strong>
                    </span>
                    <button
                      onClick={() => setActiveTab('compose')}
                      disabled={validSelectedRecipients.length === 0}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-40"
                    >
                      <span>Next: Compose Email</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: COMPOSE & PREVIEW */}
          {activeTab === 'compose' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Campaign Name</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Subject <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-indigo-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Email Body Content (Supports <code className="bg-slate-100 px-1 font-mono text-indigo-700">{'{{survey_url}}'}</code> & <code className="bg-slate-100 px-1 font-mono text-indigo-700">{'{{recipient_name}}'}</code>)
                  </label>
                </div>
                <textarea
                  rows={7}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full text-xs font-sans p-3 border border-slate-300 rounded-xl focus:border-indigo-500"
                />
              </div>

              {/* Live Rendered Email Preview */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Live Recipient Email Preview
                </span>
                <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs text-xs space-y-2">
                  <div className="border-b pb-2 text-slate-500 text-[11px] space-y-0.5">
                    <p>
                      <strong>From:</strong> {connectedAccount || 'Your Google Account (MailApp)'}
                    </p>
                    <p>
                      <strong>Subject:</strong> {emailSubject}
                    </p>
                  </div>
                  <div className="pt-2 text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {emailBody
                      .replace(/\{\{recipient_name\}\}/g, 'Sarah')
                      .replace(/\{\{survey_url\}\}/g, surveyUrl)}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab('recipients')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  &larr; Back to Recipients
                </button>
                <button
                  onClick={() => setActiveTab('confirm')}
                  disabled={validSelectedRecipients.length === 0}
                  className="inline-flex items-center space-x-1.5 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer disabled:opacity-40"
                >
                  <span>Review & Send</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: CONFIRM & SEND */}
          {activeTab === 'confirm' && (
            <div className="space-y-6">
              {/* Summary of send */}
              <div className="p-5 bg-gradient-to-br from-indigo-50/70 via-white to-sky-50/50 rounded-2xl border border-indigo-100 space-y-4">
                <div className="flex items-center space-x-2.5 text-indigo-900">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-bold">Campaign Dispatch Pre-Check</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-medium">Recipients</span>
                    <p className="text-lg font-bold text-slate-900">{validSelectedRecipients.length}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-medium">Daily Quota Left</span>
                    <p className="text-lg font-bold text-slate-900">
                      {remainingQuota !== null ? remainingQuota : isConfigured ? 'Available' : '100 (Demo)'}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-medium">Service Method</span>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {isConfigured ? 'Apps Script MailApp' : 'Demo Simulation'}
                    </p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-medium">Sender Account</span>
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {connectedAccount || 'Gmail Account'}
                    </p>
                  </div>
                </div>

                {/* Quota Exceeded Warning (AC-08) */}
                {isOverQuota && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-2">
                    <div className="flex items-center space-x-2 font-bold text-rose-900">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Quota Exceeded</span>
                    </div>
                    <p>
                      You have selected <strong>{validSelectedRecipients.length}</strong> recipients, but your remaining daily quota is only <strong>{remainingQuota}</strong>.
                    </p>
                    <button
                      onClick={handleTrimToQuota}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs cursor-pointer"
                    >
                      Reduce Batch to First {remainingQuota} Recipients
                    </button>
                  </div>
                )}

                {/* Unconfigured Notice */}
                {!isConfigured && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <p className="font-bold">Google Apps Script Web App Not Yet Connected</p>
                    <p>
                      You can send this batch in <strong>Test Simulation Mode</strong>, or open the{' '}
                      <button
                        onClick={() => setActiveTab('setup')}
                        className="underline font-bold text-indigo-700 cursor-pointer"
                      >
                        Google Apps Script Setup tab
                      </button>{' '}
                      to connect your personal Gmail with a free 2-minute deployment.
                    </p>
                  </div>
                )}
              </div>

              {sendError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{sendError}</span>
                </div>
              )}

              {/* Explicit Confirmation Checkbox (AC-09) */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <label className="flex items-start space-x-3 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sendConfirmed}
                    onChange={(e) => setSendConfirmed(e.target.checked)}
                    className="mt-0.5 rounded-sm text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>
                    I confirm that I want to send this survey invitation to{' '}
                    <strong>{validSelectedRecipients.length}</strong> selected recipient(s). All emails will include direct links to complete the survey.
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveTab('compose')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  &larr; Back to Content
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleSendCampaign(true)}
                    disabled={isSending || validSelectedRecipients.length === 0}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Send in Simulation Mode
                  </button>

                  <button
                    onClick={() => handleSendCampaign(false)}
                    disabled={isSending || !sendConfirmed || validSelectedRecipients.length === 0 || isOverQuota}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center space-x-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSending ? 'Sending Emails...' : `Launch Campaign (${validSelectedRecipients.length})`}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CAMPAIGN HISTORY & RESULTS REPORT (AC-12, AC-13) */}
          {activeTab === 'history' && (
            <div className="space-y-5">
              {latestCampaign && (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-emerald-900">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-sm font-bold">Campaign Dispatched Successfully</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-slate-500 font-medium">Recipients Accepted:</span>
                      <p className="text-base font-bold text-slate-900">{latestCampaign.sentCount}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Failed / Skipped:</span>
                      <p className="text-base font-bold text-slate-900">{latestCampaign.failedCount}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Remaining Quota:</span>
                      <p className="text-base font-bold text-slate-900">
                        {latestCampaign.remainingQuota !== undefined ? latestCampaign.remainingQuota : '-'}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Delivery Mode:</span>
                      <p className="text-base font-bold text-slate-900">
                        {latestCampaign.isSimulation ? 'Simulated Demo' : 'Apps Script Gmail'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-emerald-200/60 text-xs">
                    <span className="text-slate-500">
                      Dispatched at: {new Date(latestCampaign.sentAt).toLocaleTimeString()}
                    </span>
                    <a
                      href={`/api/email/campaigns/${latestCampaign.id}/export`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-800 hover:text-emerald-950 flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Campaign Results CSV</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Past Campaigns for this Survey */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Past Campaigns for this Survey ({campaigns.length})
                  </h4>
                  <button
                    onClick={loadCampaignHistory}
                    className="text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    Refresh
                  </button>
                </div>

                {campaigns.length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                    {campaigns.map((camp) => (
                      <div key={camp.id} className="p-4 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900">{camp.name}</span>
                            {camp.isSimulation && (
                              <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-sm text-[10px]">
                                Simulated
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400">
                            {new Date(camp.sentAt).toLocaleDateString()} at{' '}
                            {new Date(camp.sentAt).toLocaleTimeString()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600">
                          <div>
                            Sent: <strong className="text-slate-900">{camp.sentCount}</strong>
                          </div>
                          <div>
                            Failed: <strong className="text-slate-900">{camp.failedCount}</strong>
                          </div>
                          <div>
                            Survey Responses:{' '}
                            <strong className="text-emerald-700">{camp.responseCount || 0}</strong>
                          </div>
                          <div>
                            Response Rate:{' '}
                            <strong className="text-indigo-700">{camp.responseRate || 0}%</strong>
                          </div>
                        </div>

                        <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                          <span className="text-slate-400 font-mono text-[11px]">ID: {camp.id}</span>
                          <a
                            href={`/api/email/campaigns/${camp.id}/export`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-indigo-600 hover:underline flex items-center space-x-1"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export Results CSV</span>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    No email campaigns have been sent for this survey yet.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: GOOGLE APPS SCRIPT SETUP & INSTRUCTIONS */}
          {activeTab === 'setup' && (
            <div className="space-y-5">
              <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl text-xs text-sky-950 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sky-900">
                  <Code2 className="w-4 h-4 text-sky-600" />
                  <span>Free Gmail Bulk Email via Google Apps Script (MailApp)</span>
                </div>
                <p className="leading-relaxed">
                  Google Apps Script allows your SignalIQ deployment to send bulk survey invitation emails through your Google account with <strong>zero external paid email services</strong>. Free personal Google accounts receive up to 100 emails/day, and Google Workspace accounts receive up to 1,500 emails/day.
                </p>
              </div>

              {/* Endpoint Input Box */}
              <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                <label className="block text-xs font-bold text-slate-800">
                  Your Google Apps Script Web App URL
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="url"
                    value={appsScriptUrl}
                    onChange={(e) => setAppsScriptUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 text-xs font-mono p-2.5 border border-slate-300 rounded-lg focus:border-indigo-500"
                  />
                  <button
                    onClick={handleSaveAppsScriptUrl}
                    disabled={isSavingUrl || !appsScriptUrl.trim()}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer disabled:opacity-40"
                  >
                    {isSavingUrl ? 'Saving...' : 'Save & Verify'}
                  </button>
                  <button
                    onClick={loadEmailConfigAndQuota}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
                    title="Test Connection & Refresh Quota"
                  >
                    <RefreshCw className={`w-4 h-4 ${isCheckingQuota ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {isConfigured && remainingQuota !== null && (
                  <p className="text-xs text-emerald-700 font-semibold flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Connected to {connectedAccount || 'Google Account'}. Daily quota: {remainingQuota} emails remaining.</span>
                  </p>
                )}

                {quotaError && (
                  <p className="text-xs text-rose-700 font-medium flex items-center space-x-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{quotaError}</span>
                  </p>
                )}
              </div>

              {/* Step-by-Step 3-Minute Deployment Instructions */}
              <div className="space-y-3 text-xs">
                <h4 className="font-bold text-slate-800 uppercase tracking-wide">
                  Step-by-Step 3-Minute Deployment Guide
                </h4>
                <ol className="space-y-2 list-decimal list-inside text-slate-600">
                  <li>
                    Open{' '}
                    <a
                      href="https://script.google.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-indigo-600 underline inline-flex items-center space-x-0.5"
                    >
                      <span>script.google.com</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>{' '}
                    and click <strong>New Project</strong>.
                  </li>
                  <li>
                    Replace the default code in <code className="bg-slate-100 px-1 font-mono">Code.gs</code> with the snippet below.
                  </li>
                  <li>
                    Click <strong>Deploy &rarr; New deployment</strong>.
                  </li>
                  <li>
                    Click the gear icon next to "Select type" and choose <strong>Web app</strong>.
                  </li>
                  <li>
                    Set:
                    <ul className="list-disc list-inside ml-4 space-y-0.5 mt-1">
                      <li><strong>Execute as:</strong> "Me (your email)"</li>
                      <li><strong>Who has access:</strong> "Anyone"</li>
                    </ul>
                  </li>
                  <li>
                    Click <strong>Deploy</strong>, grant permission to your own script, and copy the <strong>Web App URL</strong> ending in <code className="bg-slate-100 px-1 font-mono">/exec</code>.
                  </li>
                  <li>
                    Paste the URL in the box above and click <strong>Save & Verify</strong>!
                  </li>
                </ol>
              </div>

              {/* Copyable Code.gs Script */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 font-mono">Code.gs (Ready to Paste)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(appsScriptTemplate);
                      setCopiedScript(true);
                      setTimeout(() => setCopiedScript(false), 2000);
                    }}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center space-x-1 cursor-pointer"
                  >
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedScript ? 'Copied Script!' : 'Copy Code.gs'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed">
                  {appsScriptTemplate}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Shareable URL:</span>
            <input
              type="text"
              readOnly
              value={surveyUrl}
              className="bg-white border border-slate-200 px-2 py-1 rounded text-slate-600 font-mono text-[11px] max-w-xs truncate select-all"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(surveyUrl);
                setCopiedUrl(true);
                setTimeout(() => setCopiedUrl(false), 2000);
              }}
              className="p-1 text-slate-500 hover:text-slate-800"
              title="Copy URL"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
