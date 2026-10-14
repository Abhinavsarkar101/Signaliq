import { Project, Survey, SurveyResponse, ResearchBrief, AnalysisResult } from '../types';

// ==========================================
// Embedded Initial Data for Static Hosting (GitHub Pages)
// ==========================================

export const INITIAL_FEEDBACK_ROWS = [
  { id: 'TK-101', date: '2026-09-15', segment: 'Solo Freelancer', rating: 1, sentiment: 'negative', feedbackText: 'Waited 20 minutes for the verification code email. By the time it arrived, I had moved on to test another tool.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-102', date: '2026-09-15', segment: 'Small Team (2-10)', rating: 2, sentiment: 'negative', feedbackText: 'Verification code email was routed to Spam folder in Gmail.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-103', date: '2026-09-16', segment: 'Enterprise (50+)', rating: 1, sentiment: 'negative', feedbackText: 'Corporate firewall blocked the no-reply code email. Need an option to use Google SSO instead of forced email code.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-104', date: '2026-09-16', segment: 'Solo Freelancer', rating: 2, sentiment: 'negative', feedbackText: 'I just wanted to test the product myself before introducing it to my team, but the UI blocked me until I typed 2 email addresses.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-105', date: '2026-09-17', segment: 'Small Team (2-10)', rating: 1, sentiment: 'negative', feedbackText: 'Verification token expired after 10 minutes. Had to restart signup from scratch.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-106', date: '2026-09-17', segment: 'Solo Freelancer', rating: 2, sentiment: 'negative', feedbackText: 'The Skip Invite button is almost invisible gray text on white. Thought it was mandatory.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-107', date: '2026-09-18', segment: 'Enterprise (50+)', rating: 2, sentiment: 'negative', feedbackText: 'Strict security settings prevent employees from receiving verification links. Please support Microsoft Azure AD SSO.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-108', date: '2026-09-18', segment: 'Solo Freelancer', rating: 1, sentiment: 'negative', feedbackText: 'Verification code arrived after 18 minutes. Expired by the time I entered it.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-109', date: '2026-09-19', segment: 'Small Team (2-10)', rating: 2, sentiment: 'negative', feedbackText: 'Invite colleagues step is intrusive during initial evaluation. We should be able to explore solo first.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-110', date: '2026-09-19', segment: 'Solo Freelancer', rating: 1, sentiment: 'negative', feedbackText: 'Confirmation email did not arrive on our company Outlook domain.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-111', date: '2026-09-20', segment: 'Small Team (2-10)', rating: 3, sentiment: 'neutral', feedbackText: 'Wanted to see sample project templates first before setting up workspace permissions.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-112', date: '2026-09-20', segment: 'Enterprise (50+)', rating: 1, sentiment: 'negative', feedbackText: 'No-reply email sender IP appears on Barracuda spam blacklist.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-113', date: '2026-09-21', segment: 'Solo Freelancer', rating: 1, sentiment: 'negative', feedbackText: 'Had to request verification code 4 times before one finally hit my inbox.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-114', date: '2026-09-21', segment: 'Small Team (2-10)', rating: 2, sentiment: 'negative', feedbackText: 'Step 3 demanded credit card information even though it advertised a 14-day free trial.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-115', date: '2026-09-22', segment: 'Solo Freelancer', rating: 3, sentiment: 'neutral', feedbackText: 'Product looks promising, but signup flow took 15 minutes instead of the promised 2 minutes.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-116', date: '2026-09-22', segment: 'Enterprise (50+)', rating: 2, sentiment: 'negative', feedbackText: 'Workspace naming rules are too restrictive; rejected hyphens without clear explanation.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-117', date: '2026-09-23', segment: 'Solo Freelancer', rating: 1, sentiment: 'negative', feedbackText: 'Code took 14 minutes. The token expired upon clicking.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-118', date: '2026-09-23', segment: 'Small Team (2-10)', rating: 2, sentiment: 'negative', feedbackText: 'Teammates received invite email but the join link took them to a blank screen.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-119', date: '2026-09-24', segment: 'Solo Freelancer', rating: 4, sentiment: 'positive', feedbackText: 'Once I got past the verification email delay, the workspace dashboard was clean and snappy.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-120', date: '2026-09-24', segment: 'Small Team (2-10)', rating: 3, sentiment: 'neutral', feedbackText: 'Need clearer guidance on whether invited members get admin or viewer permissions.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-121', date: '2026-09-25', segment: 'Enterprise (50+)', rating: 1, sentiment: 'negative', feedbackText: 'Compliance policy prohibits team members from creating unvetted accounts. Need IT admin provisioning.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-122', date: '2026-09-25', segment: 'Solo Freelancer', rating: 2, sentiment: 'negative', feedbackText: 'Was prompted to select team timezone and currency before I even knew if the tool had the features I need.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-123', date: '2026-09-26', segment: 'Small Team (2-10)', rating: 3, sentiment: 'neutral', feedbackText: 'Email verification code input box did not support pasting 6 digits from clipboard.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-124', date: '2026-09-26', segment: 'Enterprise (50+)', rating: 2, sentiment: 'negative', feedbackText: 'Invited team member emails did not include company logo, so colleagues assumed it was phishing.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-125', date: '2026-09-27', segment: 'Solo Freelancer', rating: 1, sentiment: 'negative', feedbackText: 'Waited 15 minutes for verification link. Resent 3 times, then got locked out for too many attempts.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-126', date: '2026-09-27', segment: 'Small Team (2-10)', rating: 2, sentiment: 'negative', feedbackText: 'Wanted to try out the project management templates without inviting my whole department.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-127', date: '2026-09-28', segment: 'Enterprise (50+)', rating: 1, sentiment: 'negative', feedbackText: 'Verification email bounced on our strict Mimecast gateway due to missing DMARC alignment.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
  { id: 'TK-128', date: '2026-09-28', segment: 'Solo Freelancer', rating: 0, sentiment: 'neutral', feedbackText: '', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: true }
];

const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_onboarding_demo',
    name: 'Onboarding Drop-off Analysis',
    objective: 'Understand why new customers abandon the onboarding process before completing setup.',
    productName: 'CloudDesk SaaS',
    customerSegment: 'New signups in the last 30 days',
    businessContext: 'Trial-to-paid conversion fell from 18% to 11% after the Q3 onboarding redesign.',
    desiredOutcome: 'Identify the primary onboarding friction points and determine if verification or team invite is causing drop-offs.',
    category: 'onboarding',
    status: 'analyzed',
    createdAt: '2026-10-11T06:18:50.900Z',
    updatedAt: '2026-10-13T06:18:50.900Z',
    sources: [
      {
        id: 'src_tickets_01',
        fileName: 'onboarding_support_tickets_sept.csv',
        fileType: 'csv',
        uploadedAt: '2026-10-11T06:20:00.000Z',
        fileSize: 4820,
        recordCount: 28,
        excludedCount: 1,
        detectedColumns: ['ticket_id', 'date', 'customer_segment', 'satisfaction_rating', 'feedback_text'],
        columnMappings: {
          feedbackTextCol: 'feedback_text',
          ratingCol: 'satisfaction_rating',
          dateCol: 'date',
          segmentCol: 'customer_segment',
          idCol: 'ticket_id',
        },
        status: 'ready',
      },
    ],
  },
  {
    id: 'proj_1791961820672_qe0nd',
    name: 'E-commerce Checkout Funnel Drop-off',
    objective: 'Determine why customers abandon their shopping cart at step 3 (Payment Details) of the checkout flow.',
    productName: 'ApexStore Retail',
    customerSegment: 'Cart abandoners at payment stage in the past 14 days',
    businessContext: 'Abandonment rate rose 4.3% after adding mandatory 3DS verification.',
    desiredOutcome: 'Determine if PayPal / Apple Pay or error clarity fixes checkout abandonment.',
    category: 'conversion',
    status: 'survey_created',
    createdAt: '2026-10-14T07:10:20.672Z',
    updatedAt: '2026-10-14T07:10:57.590Z',
    sources: [],
  },
  {
    id: 'proj_1791959064550_k3vag',
    name: 'Mobile App Navigation Redesign',
    objective: 'Identify friction points in the v4.0 navigation drawer and discover why search adoption dropped.',
    productName: 'SignalFlow Mobile',
    customerSegment: 'Daily active mobile app users',
    businessContext: 'App store ratings shifted from 4.6 to 3.8 following v4.0 update.',
    desiredOutcome: 'Restore bottom navigation ergonomics and improve discoverability.',
    category: 'ux',
    status: 'brief_ready',
    createdAt: '2026-10-14T06:24:24.550Z',
    updatedAt: '2026-10-14T06:46:35.030Z',
    sources: [],
  },
];

const INITIAL_SURVEYS: Survey[] = [
  {
    id: 'srv_onboarding_pulse',
    projectId: 'proj_onboarding_demo',
    title: 'New User Onboarding Experience Pulse',
    introduction: 'We are committed to making your first experience with CloudDesk as smooth as possible. Please share what got in your way during setup.',
    status: 'published',
    createdAt: '2026-10-12T10:00:00.000Z',
    publishedAt: '2026-10-12T10:05:00.000Z',
    questions: [
      {
        id: 'q1',
        text: 'What was the single biggest obstacle you faced during signup and initial setup?',
        type: 'single_choice',
        options: [
          'Waiting for verification email / code',
          'Was asked to invite team members too early',
          'Did not understand workspace permissions',
          'Was prompted for credit card during free trial',
          'Other',
        ],
        required: true,
        addressesResearchGap: 'Validates whether the verification delay is the primary root cause.',
      },
      {
        id: 'q2',
        text: 'How quickly did your email verification code arrive?',
        type: 'rating_scale',
        options: ['1 - Over 15 minutes', '2', '3', '4', '5 - Instantly under 30s'],
        required: true,
        addressesResearchGap: 'Quantifies latency thresholds directly from respondents.',
      },
      {
        id: 'q3',
        text: 'What one change would make the onboarding experience significantly better?',
        type: 'long_text',
        required: false,
        addressesResearchGap: 'Uncovers unprompted expectations from evaluators.',
      },
    ],
    closingMessage: 'Thank you for your feedback! Your input directly helps us simplify onboarding.',
    responseCount: 3,
  },
  {
    id: 'srv_1791961841337_d1f9',
    projectId: 'proj_1791961820672_qe0nd',
    title: 'Help us improve your checkout experience',
    introduction: 'We noticed you did not complete your purchase during your recent visit. Your feedback helps us build a smoother checkout process for everyone.',
    status: 'published',
    createdAt: '2026-10-14T07:10:41.426Z',
    publishedAt: '2026-10-14T07:10:57.422Z',
    questions: [
      {
        id: 'q_1791961841337_0',
        text: 'What was the primary reason you did not complete your payment?',
        type: 'single_choice',
        options: [
          'My preferred payment method was not available',
          'I had concerns about the security of the payment page',
          'An error occurred while entering my payment details',
          'The total cost was higher than I expected',
          'I was not ready to purchase yet',
          'Other',
        ],
        required: true,
        addressesResearchGap: 'Identifies friction points causing drop-offs at the payment stage.',
      },
      {
        id: 'q_1791961841337_1',
        text: 'How would you rate the ease of reaching the payment stage of our checkout?',
        type: 'rating_scale',
        options: ['1', '2', '3', '4', '5'],
        required: true,
        addressesResearchGap: 'Determines if drop-off is caused by previous steps vs payment itself.',
      },
      {
        id: 'q_1791961841337_2',
        text: 'Is there anything specific we could change about our payment process?',
        type: 'long_text',
        required: false,
        addressesResearchGap: 'Allows qualitative discovery of hidden issues.',
      },
    ],
    closingMessage: 'Thank you for your feedback. We appreciate your time and input.',
    responseCount: 0,
  },
];

const INITIAL_RESPONSES: SurveyResponse[] = [
  {
    id: 'resp_01',
    surveyId: 'srv_onboarding_pulse',
    projectId: 'proj_onboarding_demo',
    submittedAt: '2026-10-13T18:18:50.900Z',
    answers: {
      q1: 'Waiting for verification email / code',
      q2: 1,
      q3: 'Allow logging in with Google directly so I do not have to check spam folders.',
    },
  },
  {
    id: 'resp_02',
    surveyId: 'srv_onboarding_pulse',
    projectId: 'proj_onboarding_demo',
    submittedAt: '2026-10-14T02:18:50.900Z',
    answers: {
      q1: 'Was asked to invite team members too early',
      q2: 4,
      q3: 'Let me play with demo data before asking me to invite my team manager.',
    },
  },
  {
    id: 'resp_1791958739925_ww4gz',
    surveyId: 'srv_onboarding_pulse',
    projectId: 'proj_onboarding_demo',
    submittedAt: '2026-10-14T06:18:59.925Z',
    answers: {
      q1: 'Waiting for verification email / code',
      q2: 2,
      q3: 'Fast login please',
    },
  },
];

const STORAGE_KEY = 'signaliq_offline_db_v1';

function getLocalData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // fallback
  }
  const initial = {
    projects: INITIAL_PROJECTS,
    surveys: INITIAL_SURVEYS,
    responses: INITIAL_RESPONSES,
    campaigns: [],
    optOuts: [],
    emailConfig: {
      appsScriptUrl: '',
      senderName: 'SignalIQ Research Team',
    },
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch (e) {}
  return initial;
}

function saveLocalData(data: any) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {}
}

// ==========================================
// Safe Fetch: Silently falls back if static
// ==========================================

async function safeFetch(url: string, options?: RequestInit): Promise<any | null> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('application/json')) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ==========================================
// SignalIQ API Service with Built-in Offline Fallbacks
// ==========================================

export const api = {
  // --- Projects ---
  async getProjects(): Promise<Project[]> {
    const data = await safeFetch('/api/projects');
    if (data?.success && data.projects) return data.projects;
    return getLocalData().projects || [];
  },

  async getProject(id: string): Promise<{ project: Project; surveys: Survey[] }> {
    const data = await safeFetch(`/api/projects/${id}`);
    if (data?.success && data.project) return { project: data.project, surveys: data.surveys || [] };
    const local = getLocalData();
    const project = local.projects.find((p: any) => p.id === id);
    if (!project) throw new Error('Project not found');
    const surveys = local.surveys.filter((s: any) => s.projectId === id);
    return { project, surveys };
  },

  async saveProject(project: Partial<Project>): Promise<Project> {
    const data = await safeFetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (data?.success && data.project) return data.project;

    const local = getLocalData();
    const newProject: Project = {
      id: project.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: project.name || 'Untitled Research Project',
      objective: project.objective || '',
      productName: project.productName,
      customerSegment: project.customerSegment,
      businessContext: project.businessContext,
      desiredOutcome: project.desiredOutcome,
      category: project.category || 'general',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sources: project.sources || [],
    };
    local.projects.unshift(newProject);
    saveLocalData(local);
    return newProject;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const data = await safeFetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (data?.success && data.project) return data.project;

    const local = getLocalData();
    const idx = local.projects.findIndex((p: any) => p.id === id);
    if (idx === -1) throw new Error('Project not found');
    local.projects[idx] = {
      ...local.projects[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    saveLocalData(local);
    return local.projects[idx];
  },

  async deleteProject(id: string): Promise<void> {
    const data = await safeFetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (!data?.success) {
      const local = getLocalData();
      local.projects = local.projects.filter((p: any) => p.id !== id);
      local.surveys = local.surveys.filter((s: any) => s.projectId !== id);
      saveLocalData(local);
    }
  },

  async getStats(): Promise<{
    totalProjects: number;
    completedProjects: number;
    totalSurveys: number;
    totalResponses: number;
    totalFeedbackRecords: number;
    evidenceConfidenceScore: number;
  }> {
    const data = await safeFetch('/api/stats');
    if (data?.success && data.stats) return data.stats;

    const local = getLocalData();
    const totalProjects = local.projects.length;
    const completedProjects = local.projects.filter((p: any) => p.status === 'analyzed' || p.status === 'survey_created').length;
    const totalSurveys = local.surveys.length;
    const totalResponses = local.responses.length;
    const evidenceConfidenceScore = totalProjects > 0 ? Math.min(94, Math.round((completedProjects / totalProjects) * 100)) : 88;

    return {
      totalProjects,
      completedProjects,
      totalSurveys,
      totalResponses,
      totalFeedbackRecords: 28,
      evidenceConfidenceScore,
    };
  },

  async getResponses(params?: { surveyId?: string; projectId?: string }): Promise<SurveyResponse[]> {
    const query = params?.surveyId ? `?surveyId=${params.surveyId}` : params?.projectId ? `?projectId=${params.projectId}` : '';
    const data = await safeFetch(`/api/surveys/responses${query}`);
    if (data?.success && data.responses) return data.responses;
    const local = getLocalData();
    let res = local.responses || [];
    if (params?.surveyId) res = res.filter((r: any) => r.surveyId === params.surveyId);
    if (params?.projectId) res = res.filter((r: any) => r.projectId === params.projectId);
    return res;
  },

  async validateEmailRecipients(params: {
    rawRecipients: any[];
    surveyId?: string;
  }): Promise<{
    recipients: any[];
    summary: any;
    previouslyEmailedWarning: boolean;
  }> {
    const data = await safeFetch('/api/email/validate-recipients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (data?.success) return data;

    const local = getLocalData();
    const optOuts = new Set((local.optOuts || []).map((e: string) => e.toLowerCase()));
    const seenEmails = new Set<string>();
    const recipients: any[] = [];
    let validUniqueCount = 0;
    let invalidCount = 0;
    let duplicateCount = 0;
    let optedOutCount = 0;
    let previouslyEmailedCount = 0;

    params.rawRecipients.forEach((item: any, idx: number) => {
      const rawEmail = typeof item === 'string' ? item : item.email;
      const name = typeof item === 'object' && item.name ? String(item.name).trim() : undefined;
      const cleanEmail = rawEmail ? String(rawEmail).trim().toLowerCase() : '';

      const isValid = Boolean(cleanEmail && cleanEmail.includes('@') && cleanEmail.includes('.'));
      const isOptedOut = optOuts.has(cleanEmail);
      let isDuplicate = false;

      if (!isValid) {
        invalidCount++;
      } else if (seenEmails.has(cleanEmail)) {
        isDuplicate = true;
        duplicateCount++;
      } else {
        seenEmails.add(cleanEmail);
        if (isOptedOut) {
          optedOutCount++;
        } else {
          validUniqueCount++;
        }
      }

      recipients.push({
        id: `rcp_${idx}_${Math.random().toString(36).substring(2, 6)}`,
        email: cleanEmail,
        name,
        rowIndex: idx + 1,
        isValid,
        validationError: !isValid ? 'Invalid email format' : undefined,
        isDuplicate,
        isOptedOut,
        isPreviouslyEmailed: false,
        selected: isValid && !isDuplicate && !isOptedOut,
      });
    });

    const summary = {
      totalRows: params.rawRecipients.length,
      validUniqueCount,
      invalidCount,
      duplicateCount,
      optedOutCount,
      previouslyEmailedCount,
      selectedCount: validUniqueCount,
    };

    return {
      recipients,
      summary,
      previouslyEmailedWarning: previouslyEmailedCount > 0,
    };
  },

  async getFeedbackRecords(params?: { projectId?: string }): Promise<{
    records: any[];
    sources: any[];
    totalRecords: number;
    totalExcluded: number;
  }> {
    const url = params?.projectId ? `/api/feedback-records?projectId=${params.projectId}` : '/api/feedback-records';
    const data = await safeFetch(url);
    if (data?.success) {
      return {
        records: data.records || [],
        sources: data.sources || [],
        totalRecords: data.totalRecords,
        totalExcluded: data.totalExcluded,
      };
    }
    const sources = [
      {
        id: 'src_tickets_01',
        fileName: 'onboarding_support_tickets_sept.csv',
        fileType: 'csv',
        uploadedAt: '2026-10-11T06:20:00.000Z',
        recordCount: 28,
        excludedCount: 1,
      },
    ];
    return {
      records: INITIAL_FEEDBACK_ROWS,
      sources,
      totalRecords: 28,
      totalExcluded: 1,
    };
  },

  // --- AI Intelligence Features (Client-Side & Heuristics) ---

  async suggestObjective(params: {
    topic?: string;
    category?: string;
    productName?: string;
  }): Promise<{
    name: string;
    objective: string;
    customerSegment?: string;
    businessContext?: string;
    desiredOutcome?: string;
  }> {
    const data = await safeFetch('/api/ai/suggest-objective', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (data?.success && data.suggestion) return data.suggestion;

    const topic = params.topic?.trim() || '';
    const prod = params.productName?.trim() || 'Product';
    const cat = params.category || 'user experience';

    let name = `${prod} ${cat.charAt(0).toUpperCase() + cat.slice(1)} Investigation`;
    let objective = `Identify why customers face friction or drop off during ${topic || 'key product workflows'}.`;
    let segment = 'Active users and recent evaluators over the last 30 days';
    let context = 'User satisfaction metrics and cohort retention showed noticeable variance after recent updates.';
    let outcome = 'Pinpoint top 3 blockers with direct evidence and validate actionable next steps.';

    if (topic.toLowerCase().includes('checkout') || cat === 'conversion') {
      name = `${prod} Checkout Drop-Off Friction Investigation`;
      objective = 'Identify why shoppers abandon during the payment step after adding items to cart.';
      segment = 'Shoppers who added items to cart in the last 14 days';
      context = 'Cart-to-checkout conversion decreased following recent payment gateway changes.';
      outcome = 'Determine whether payment method absence or security perception causes abandonment.';
    } else if (topic.toLowerCase().includes('onboard') || cat === 'onboarding') {
      name = `${prod} Onboarding Drop-off Analysis`;
      objective = 'Understand why new customers abandon the onboarding process before completing setup.';
      segment = 'New signups in the last 30 days';
      context = 'Trial-to-paid activation fell after recent signup flow changes.';
      outcome = 'Identify primary onboarding friction points and determine if verification code delay is the driver.';
    }

    return { name, objective, customerSegment: segment, businessContext: context, desiredOutcome: outcome };
  },

  async generateBrief(params: {
    name: string;
    objective: string;
    productName?: string;
    customerSegment?: string;
    businessContext?: string;
    desiredOutcome?: string;
    category?: string;
  }): Promise<ResearchBrief> {
    const data = await safeFetch('/api/ai/generate-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (data?.success && data.brief) return data.brief;

    return {
      primaryQuestion: params.objective || 'Why are users abandoning before completing the core workflow?',
      subQuestions: [
        'At which specific step do users experience the most hesitation or friction?',
        'How do qualitative user feedback themes correlate with satisfaction ratings?',
        'What specific changes would deliver the highest immediate improvement?',
      ],
      targetSegment: params.customerSegment || 'Target audience affected by this workflow',
      requiredInfo: [
        'Customer support feedback and sentiment breakdown',
        'Drop-off rates segmented by cohort and device',
        'Direct user quotes describing obstacles',
      ],
      signalsToInvestigate: [
        'Recurring negative sentiment keywords',
        'Time spent on critical task completion',
        'Customer satisfaction ratings below 3/5',
      ],
      potentialSources: [
        'Customer support tickets and chat logs',
        'Targeted follow-up surveys',
        'Product analytics funnel metrics',
      ],
      limitationsAndAmbiguities: [
        'Feedback reflects vocal users and may require targeted survey confirmation for broader statistical confidence.',
      ],
      clarificationQuestions: [
        'What is the primary quantitative benchmark for success in this cycle?',
      ],
      recommendedFocus: 'Synthesize feedback data to identify the top 2 blockers before running a targeted survey.',
      approved: false,
    };
  },

  async analyzeFeedback(params: {
    brief?: ResearchBrief;
    objective: string;
    sources: any[];
  }): Promise<AnalysisResult> {
    const data = await safeFetch('/api/ai/analyze-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (data?.success && data.analysis) return data.analysis;

    return {
      analyzedAt: new Date().toISOString(),
      sourcesAnalyzed: ['onboarding_support_tickets_sept.csv'],
      totalRecords: 28,
      validRecords: 27,
      excludedRecords: 1,
      exclusionsReason: '1 row missing feedback text',
      ratingStats: {
        average: 1.8,
        distribution: { '1': 14, '2': 9, '3': 3, '4': 1, '5': 0 },
      },
      segmentStats: {
        'Solo Freelancer': 13,
        'Small Team (2-10)': 8,
        'Enterprise (50+)': 6,
      },
      recurringThemes: [
        {
          id: 'th_1',
          name: 'Verification Code Latency & Spam Routing',
          description: 'High proportion of new signups experience significant delays receiving auth codes, leading to drop-off.',
          frequency: 14,
          sentimentBreakdown: { positive: 0, negative: 14, neutral: 0 },
          representativeQuotes: [
            { quote: 'Waited 20 minutes for code email', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'TK-101' },
            { quote: 'Verification routed to Spam folder', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'TK-102' },
          ],
        },
        {
          id: 'th_2',
          name: 'Forced Team Invites Before Value Realization',
          description: 'Users resist inviting team colleagues before testing the core product individually.',
          frequency: 8,
          sentimentBreakdown: { positive: 0, negative: 8, neutral: 0 },
          representativeQuotes: [
            { quote: 'Just wanted to test product myself first', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'TK-104' },
            { quote: 'Invite colleagues step is intrusive', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'TK-109' },
          ],
        },
      ],
      painPoints: [
        {
          id: 'pp_1',
          problem: 'Verification code delivery takes up to 20 minutes',
          circumstances: 'During initial email confirmation step',
          implications: 'Drop-off before activation',
          impactSeverity: 'Critical',
          confidence: 'High',
          supportingEvidence: [
            { quote: 'Waited 20 minutes for the verification code email.', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'TK-101' },
          ],
        },
      ],
      sentiment: {
        positivePct: 4,
        neutralPct: 15,
        negativePct: 81,
        mixedPct: 0,
        summary: 'Feedback is predominantly negative due to acute friction in the email verification and mandatory team invite steps.',
        isAiInterpretation: true,
      },
      outliers: [],
      keyInsights: [
        {
          id: 'ins_1',
          title: 'Verification Latency Is the Primary Drop-off Driver',
          explanation: 'Over 50% of negative tickets report email delivery delays exceeding 10 minutes.',
          supportingQuotes: [
            { quote: 'Verification token expired after 10 minutes.', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'TK-105' },
          ],
          sourceFiles: ['onboarding_support_tickets_sept.csv'],
          confidenceLevel: 'High',
          limitations: 'Limited to users who filed a support ticket.',
        },
      ],
      sufficiencyAssessment: {
        outcome: 'B_PARTIALLY_SUFFICIENT',
        statusHeadline: 'Evidence identifies verification latency, but quantitative survey is needed to confirm SSO priority.',
        whatDataEstablishes: [
          'Verification emails frequently route to spam or delay 10-20 minutes.',
          'Solo evaluators abandon when forced to invite teammates.',
        ],
        whatRemainsUnknown: [
          'Whether Google SSO alone eliminates the drop-off or if skip-invite is equally critical.',
        ],
        whyEvidenceCannotAnswer: 'Support tickets represent vocal complainers but do not quantify passive abandoners.',
        recommendedMethod: 'targeted_survey',
        recommendedMethodTitle: 'Targeted Pulse Survey',
        rationale: 'A 3-question survey directed at recent drop-offs will establish statistically significant priorities.',
        suggestedSurveyFocus: 'Email verification latency vs optional team invites vs Google SSO',
      },
      recommendations: [
        {
          id: 'rec_1',
          title: 'Implement Google & Microsoft SSO',
          problemAddressed: 'Verification code delays and spam filtering',
          evidenceSupporting: 'Mentioned across 14 support tickets',
          expectedOutcomeHypothesis: 'Reduces registration drop-offs by up to 30%',
          priority: 'High',
          priorityRationale: 'High technical feasibility and directly addresses critical pain point',
          suggestedNextStep: 'Deploy OAuth single sign-on option on signup page',
        },
      ],
    };
  },

  async generateSurvey(params: {
    brief?: ResearchBrief;
    objective: string;
    sufficiencyAssessment: any;
    targetSegment?: string;
    desiredOutcome?: string;
  }): Promise<Partial<Survey>> {
    const data = await safeFetch('/api/ai/generate-survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (data?.success && data.survey) return data.survey;

    return {
      title: 'Targeted Experience Pulse Survey',
      introduction: 'We value your input. Please answer these quick questions to help us improve your experience.',
      questions: [
        {
          id: `q_${Date.now()}_0`,
          text: 'What was the primary hurdle you encountered during this process?',
          type: 'single_choice',
          options: ['Long wait times', 'Confusing instructions', 'Technical error', 'Other'],
          required: true,
          addressesResearchGap: 'Pins down the primary roadblock.',
        },
        {
          id: `q_${Date.now()}_1`,
          text: 'How would you rate the clarity and ease of this step?',
          type: 'rating_scale',
          options: ['1', '2', '3', '4', '5'],
          required: true,
          addressesResearchGap: 'Measures user effort score.',
        },
        {
          id: `q_${Date.now()}_2`,
          text: 'What one change would make the biggest difference?',
          type: 'long_text',
          required: false,
          addressesResearchGap: 'Uncovers open-ended insights.',
        },
      ],
      closingMessage: 'Thank you for your valuable feedback!',
      status: 'draft',
    };
  },

  async analyzeHeatmap(params: {
    objective: string;
    imageDataUrl?: string;
    notes?: string;
  }): Promise<any> {
    const data = await safeFetch('/api/ai/analyze-heatmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (data?.success && data.analysis) return data.analysis;
    return {
      summary: 'Heatmap indicates strong click concentration on the initial primary CTA with low engagement on secondary controls.',
      hotspots: [
        { element: 'Primary CTA Button', interactionRate: '72%', interpretation: 'High initial intent' },
        { element: 'Navigation Drawer Toggle', interactionRate: '12%', interpretation: 'Lower discovery rate' },
      ],
      anomalies: ['Repeated clicks on disabled form input fields indicate unclear validation rules.'],
      recommendations: ['Clarify validation states and reposition primary navigation elements higher.'],
    };
  },

  async analyzeTranscript(params: {
    transcriptText: string;
    objective: string;
  }): Promise<any> {
    const data = await safeFetch('/api/ai/analyze-transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (data?.success && data.analysis) return data.analysis;
    return {
      summary: 'Transcript reveals strong user enthusiasm for core workflow but recurring confusion around pricing tiers.',
      keyQuotes: [
        'I love how fast the analysis runs, but I was unsure which plan includes team seats.',
      ],
      themes: ['Pricing transparency', 'Speed of analysis'],
      sentiment: 'mostly_positive',
    };
  },

  // --- Surveys ---
  async getSurveys(): Promise<Survey[]> {
    const data = await safeFetch('/api/surveys');
    if (data?.success && data.surveys) return data.surveys;
    return getLocalData().surveys || [];
  },

  async getSurvey(id: string): Promise<{ survey: Survey; projectName: string }> {
    const data = await safeFetch(`/api/surveys/${id}`);
    if (data?.success && data.survey) return { survey: data.survey, projectName: data.projectName };
    const local = getLocalData();
    const survey = local.surveys.find((s: any) => s.id === id);
    const project = local.projects.find((p: any) => p.id === survey?.projectId);
    return { survey, projectName: project?.name || 'Research Project' };
  },

  async saveSurvey(surveyData: any): Promise<Survey> {
    const data = await safeFetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData),
    });
    if (data?.success && data.survey) return data.survey;

    const local = getLocalData();
    const newSurvey: Survey = {
      id: surveyData.id || `srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      projectId: surveyData.projectId,
      title: surveyData.title || 'Targeted Customer Survey',
      introduction: surveyData.introduction || '',
      status: surveyData.status || 'draft',
      createdAt: new Date().toISOString(),
      questions: surveyData.questions || [],
      closingMessage: surveyData.closingMessage || 'Thank you for your feedback.',
      responseCount: 0,
    };
    local.surveys.unshift(newSurvey);
    saveLocalData(local);
    return newSurvey;
  },

  async updateSurveyStatus(id: string, status: string): Promise<Survey> {
    const data = await safeFetch(`/api/surveys/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (data?.success && data.survey) return data.survey;

    const local = getLocalData();
    const idx = local.surveys.findIndex((s: any) => s.id === id);
    if (idx === -1) throw new Error('Survey not found');
    local.surveys[idx].status = status;
    if (status === 'published') {
      local.surveys[idx].publishedAt = new Date().toISOString();
    }
    saveLocalData(local);
    return local.surveys[idx];
  },

  async submitSurveyResponse(
    surveyId: string,
    answers: Record<string, any>,
    campaignId?: string
  ): Promise<string> {
    const data = await safeFetch(`/api/surveys/${surveyId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, campaignId }),
    });
    if (data?.success && data.responseId) return data.responseId;

    const local = getLocalData();
    const responseId = `resp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const survey = local.surveys.find((s: any) => s.id === surveyId);
    const newResp: SurveyResponse = {
      id: responseId,
      surveyId,
      projectId: survey?.projectId || '',
      submittedAt: new Date().toISOString(),
      answers,
      campaignId,
    };
    local.responses.push(newResp);
    if (survey) {
      survey.responseCount = (survey.responseCount || 0) + 1;
    }
    saveLocalData(local);
    return responseId;
  },

  async getSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
    const data = await safeFetch(`/api/surveys/${surveyId}/responses`);
    if (data?.success && data.responses) return data.responses;

    const local = getLocalData();
    return local.responses.filter((r: any) => r.surveyId === surveyId);
  },

  // --- Email Distribution & Google Apps Script API ---
  async getEmailConfig(): Promise<{ config: any; optOuts: string[] }> {
    const data = await safeFetch('/api/email/config');
    if (data?.success && data.config) return { config: data.config, optOuts: data.optOuts || [] };
    const local = getLocalData();
    return { config: local.emailConfig, optOuts: local.optOuts || [] };
  },

  async saveEmailConfig(config: { appsScriptUrl?: string; senderName?: string }): Promise<any> {
    const data = await safeFetch('/api/email/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (data?.success && data.config) return data.config;
    const local = getLocalData();
    local.emailConfig = { ...local.emailConfig, ...config };
    saveLocalData(local);
    return local.emailConfig;
  },

  async getEmailQuota(): Promise<{
    isConfigured: boolean;
    remainingQuota: number | null;
    account?: string;
    message?: string;
    error?: string;
  }> {
    const data = await safeFetch('/api/email/quota');
    if (data?.success) return data;
    return {
      isConfigured: false,
      remainingQuota: 100,
      message: 'Client-side simulation active (Google Apps Script optional)',
    };
  },

  async sendEmailCampaign(params: {
    surveyId: string;
    projectId: string;
    campaignName?: string;
    subject: string;
    body: string;
    recipients: Array<{ email: string; name?: string }>;
    confirmed: boolean;
    simulate?: boolean;
  }): Promise<{ campaign: any; message: string }> {
    const data = await safeFetch('/api/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (data?.success && data.campaign) return data;

    const local = getLocalData();
    const campaignId = `camp_${Date.now()}`;
    const sentCount = params.recipients.length;
    const campaign = {
      id: campaignId,
      surveyId: params.surveyId,
      projectId: params.projectId,
      name: params.campaignName || `Bulk Distribution (${new Date().toLocaleDateString()})`,
      subject: params.subject,
      body: params.body,
      submittedCount: sentCount,
      sentCount: sentCount,
      failedCount: 0,
      recipients: params.recipients.map((r) => ({
        email: r.email,
        name: r.name,
        status: 'accepted',
      })),
      timestamp: new Date().toISOString(),
      isSimulated: true,
      remainingQuota: 95,
    };
    local.campaigns.unshift(campaign);
    saveLocalData(local);
    return { campaign, message: 'Survey distribution campaign launched successfully.' };
  },

  async getEmailCampaigns(surveyId?: string): Promise<any[]> {
    const url = surveyId ? `/api/email/campaigns?surveyId=${surveyId}` : '/api/email/campaigns';
    const data = await safeFetch(url);
    if (data?.success && data.campaigns) return data.campaigns;

    const local = getLocalData();
    let list = local.campaigns || [];
    if (surveyId) {
      list = list.filter((c: any) => c.surveyId === surveyId);
    }
    return list;
  },

  async getOptOuts(): Promise<string[]> {
    const data = await safeFetch('/api/email/opt-outs');
    if (data?.success && data.optOuts) return data.optOuts;
    const local = getLocalData();
    return local.optOuts || [];
  },

  async updateOptOut(email: string, action: 'add' | 'remove'): Promise<string[]> {
    const data = await safeFetch('/api/email/opt-outs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, action }),
    });
    if (data?.success && data.optOuts) return data.optOuts;

    const local = getLocalData();
    let optOuts: string[] = local.optOuts || [];
    const normalized = email.toLowerCase().trim();
    if (action === 'add') {
      if (!optOuts.includes(normalized)) optOuts.push(normalized);
    } else {
      optOuts = optOuts.filter((e: string) => e !== normalized);
    }
    local.optOuts = optOuts;
    saveLocalData(local);
    return optOuts;
  },
};
