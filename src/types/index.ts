export interface Project {
  id: string;
  name: string;
  objective: string;
  productName?: string;
  customerSegment?: string;
  businessContext?: string;
  desiredOutcome?: string;
  category: string;
  status: 'draft' | 'brief_ready' | 'data_uploaded' | 'analyzed' | 'survey_created' | 'completed';
  createdAt: string;
  updatedAt: string;
  brief?: ResearchBrief;
  sources: EvidenceSource[];
  analysis?: AnalysisResult;
  survey?: Survey;
  report?: ResearchReport;
}

export interface ResearchBrief {
  primaryQuestion: string;
  subQuestions: string[];
  targetSegment: string;
  requiredInfo: string[];
  signalsToInvestigate: string[];
  potentialSources: string[];
  limitationsAndAmbiguities: string[];
  clarificationQuestions: string[];
  recommendedFocus: string;
  approved: boolean;
  userNotes?: string;
}

export interface EvidenceSource {
  id: string;
  fileName: string;
  fileType: 'csv' | 'xlsx' | 'transcript' | 'heatmap' | 'text';
  uploadedAt: string;
  fileSize: number;
  recordCount: number;
  excludedCount: number;
  exclusionNotes?: string;
  detectedColumns?: string[];
  columnMappings?: {
    feedbackTextCol?: string;
    ratingCol?: string;
    dateCol?: string;
    segmentCol?: string;
    idCol?: string;
  };
  previewRows?: Record<string, any>[];
  extractedContent?: string;
  imageDataUrl?: string;
  status: 'ready' | 'processing' | 'error';
  errorMessage?: string;
}

export interface QuoteReference {
  quote: string;
  sourceFile: string;
  sourceRef?: string; // Row #, Speaker tag, etc.
}

export interface RecurringTheme {
  id: string;
  name: string;
  description: string;
  frequency: number;
  sentimentBreakdown: {
    positive: number;
    negative: number;
    neutral: number;
  };
  representativeQuotes: QuoteReference[];
  potentialCauses?: string;
}

export interface PainPoint {
  id: string;
  problem: string;
  circumstances: string;
  implications: string;
  impactSeverity: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: 'High' | 'Moderate' | 'Exploratory';
  supportingEvidence: QuoteReference[];
}

export interface KeyInsight {
  id: string;
  title: string;
  explanation: string;
  supportingQuotes: QuoteReference[];
  sourceFiles: string[];
  confidenceLevel: 'High' | 'Medium' | 'Low';
  limitations: string;
}

export interface SufficiencyAssessment {
  outcome: 'A_SUFFICIENT' | 'B_PARTIALLY_SUFFICIENT' | 'C_INSUFFICIENT';
  statusHeadline: string;
  whatDataEstablishes: string[];
  whatRemainsUnknown: string[];
  whyEvidenceCannotAnswer: string;
  recommendedMethod: 'none_sufficient' | 'targeted_survey' | 'interviews' | 'behavioural_heatmap' | 'additional_tickets';
  recommendedMethodTitle: string;
  rationale: string;
  suggestedSurveyFocus?: string;
  userOverrideStatus?: 'accepted' | 'declined' | 'modified';
}

export interface Recommendation {
  id: string;
  title: string;
  problemAddressed: string;
  evidenceSupporting: string;
  expectedOutcomeHypothesis: string;
  priority: 'High' | 'Medium' | 'Low';
  priorityRationale: string;
  suggestedNextStep: string;
}

export interface AnalysisResult {
  analyzedAt: string;
  sourcesAnalyzed: string[];
  totalRecords: number;
  validRecords: number;
  excludedRecords: number;
  exclusionsReason?: string;
  ratingStats?: {
    average: number;
    distribution: Record<string, number>;
  };
  segmentStats?: Record<string, number>;
  recurringThemes: RecurringTheme[];
  painPoints: PainPoint[];
  sentiment: {
    positivePct: number;
    negativePct: number;
    neutralPct: number;
    mixedPct: number;
    summary: string;
    isAiInterpretation: boolean;
  };
  outliers: Array<{
    observation: string;
    minorityPerspective: string;
    evidence: string;
    sourceFile: string;
  }>;
  keyInsights: KeyInsight[];
  sufficiencyAssessment: SufficiencyAssessment;
  recommendations: Recommendation[];
}

export type QuestionType = 'single_choice' | 'multiple_choice' | 'rating_scale' | 'short_text' | 'long_text' | 'yes_no';

export interface SurveyQuestion {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
  addressesResearchGap: string;
}

export interface Survey {
  id: string;
  projectId: string;
  title: string;
  introduction: string;
  status: 'draft' | 'published' | 'closed';
  createdAt: string;
  publishedAt?: string;
  questions: SurveyQuestion[];
  closingMessage: string;
  responseCount: number;
}

export interface SurveyResponse {
  id: string;
  surveyId: string;
  projectId: string;
  submittedAt: string;
  answers: Record<string, any>;
  campaignId?: string;
}

export interface ResearchReport {
  id: string;
  projectId: string;
  generatedAt: string;
  title: string;
  executiveSummary: string;
  keyThemes: string[];
  painPointsSummary: string[];
  quantitativeHighlights: string[];
  sufficiencySummary: string;
  unresolvedQuestions: string[];
  actionItems: Array<{
    title: string;
    priority: string;
    rationale: string;
    hypothesis: string;
  }>;
  limitationsAndAssumptions: string[];
}

export interface EmailRecipient {
  id: string;
  email: string;
  name?: string;
  rowIndex?: number;
  isValid: boolean;
  validationError?: string;
  isDuplicate?: boolean;
  isOptedOut?: boolean;
  isPreviouslyEmailed?: boolean;
  selected: boolean;
}

export interface EmailValidationSummary {
  totalRows: number;
  validUniqueCount: number;
  invalidCount: number;
  duplicateCount: number;
  optedOutCount: number;
  previouslyEmailedCount: number;
  selectedCount: number;
}

export interface EmailCampaignResultItem {
  email: string;
  name?: string;
  status: 'sent' | 'failed' | 'simulated';
  error?: string;
  timestamp: string;
}

export interface EmailCampaign {
  id: string;
  surveyId: string;
  projectId: string;
  surveyTitle: string;
  name: string;
  subject: string;
  body: string;
  senderAccount?: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  remainingQuota?: number;
  sentAt: string;
  results: EmailCampaignResultItem[];
  responseCount: number;
  responseRate: number;
  isSimulation?: boolean;
}

export interface EmailConfig {
  appsScriptUrl?: string;
  senderName?: string;
  lastQuota?: number;
  lastQuotaCheckedAt?: string;
  optOuts?: string[];
}

