import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

// Body parsing with generous limit for file / heatmap base64 uploads
app.use(express.json({ limit: '35mb' }));
app.use(express.urlencoded({ extended: true, limit: '35mb' }));

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Database storage setup
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DbSchema {
  projects: any[];
  surveys: any[];
  responses: any[];
  campaigns?: any[];
  optOuts?: string[];
  emailConfig?: {
    appsScriptUrl?: string;
    senderName?: string;
    lastQuota?: number;
    lastQuotaCheckedAt?: string;
  };
}

function loadDatabase(): DbSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const loaded: DbSchema = JSON.parse(content);
      loaded.campaigns = loaded.campaigns || [];
      loaded.optOuts = loaded.optOuts || [];
      loaded.emailConfig = loaded.emailConfig || {
        appsScriptUrl: process.env.APPS_SCRIPT_WEBAPP_URL || '',
        senderName: 'SignalIQ Research Team',
      };
      return loaded;
    }
  } catch (err) {
    console.error('Failed to load database file, using defaults:', err);
  }

  // Seed default demo projects for immediate exploration
  const initialDb: DbSchema = {
    campaigns: [],
    optOuts: ['unsubscribed@example.com'],
    emailConfig: {
      appsScriptUrl: process.env.APPS_SCRIPT_WEBAPP_URL || '',
      senderName: 'SignalIQ Research Team',
    },
    projects: [
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
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString(),
        brief: {
          primaryQuestion: 'Why do new signups abandon the onboarding process before completing workspace setup?',
          subQuestions: [
            'At which step of onboarding do most drop-offs occur according to feedback?',
            'What technical or usability roadblocks are users encountering during email verification?',
            'Do enterprise users drop off for different reasons than solo practitioners?',
          ],
          targetSegment: 'New signups in the last 30 days',
          requiredInfo: ['Drop-off step mentions', 'Verification failure reports', 'Invited team member friction', 'User role/team size'],
          signalsToInvestigate: ['Verification code delivery speed', 'OAuth login issues', 'Confusion around workspace naming', 'Role permission settings'],
          potentialSources: ['Support tickets (Zendesk/Intercom)', 'Customer interview transcripts', 'Onboarding analytics'],
          limitationsAndAmbiguities: ['Support tickets over-represent vocal users encountering bugs and under-represent passive abandoners who simply leave silently.'],
          clarificationQuestions: ['Are drop-offs measured at first login or at team invitation completion?'],
          recommendedFocus: 'Focus on separating technical verification hurdles from product complexity during setup.',
          approved: true,
        },
        sources: [
          {
            id: 'src_tickets_01',
            fileName: 'onboarding_support_tickets_sept.csv',
            fileType: 'csv',
            uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            fileSize: 48200,
            recordCount: 28,
            excludedCount: 1,
            exclusionNotes: '1 blank feedback record excluded from calculations.',
            detectedColumns: ['ticket_id', 'created_date', 'user_segment', 'feedback_text', 'sentiment', 'rating'],
            columnMappings: {
              idCol: 'ticket_id',
              dateCol: 'created_date',
              segmentCol: 'user_segment',
              feedbackTextCol: 'feedback_text',
              ratingCol: 'rating',
            },
            status: 'ready',
          },
        ],
        analysis: {
          analyzedAt: new Date(Date.now() - 86400000).toISOString(),
          sourcesAnalyzed: ['onboarding_support_tickets_sept.csv'],
          totalRecords: 28,
          validRecords: 27,
          excludedRecords: 1,
          exclusionsReason: '1 empty comment row without feedback was excluded from metric calculations.',
          ratingStats: {
            average: 2.1,
            distribution: { '1': 11, '2': 8, '3': 5, '4': 2, '5': 1 },
          },
          segmentStats: {
            'Solo Freelancer': 12,
            'Small Team (2-10)': 10,
            'Enterprise (50+)': 5,
          },
          recurringThemes: [
            {
              id: 'th_verification',
              name: 'Email Verification Delay & Spam Filtering',
              description: 'Users report waiting 10-15 minutes for 6-digit confirmation codes or finding them buried in corporate spam folders.',
              frequency: 14,
              sentimentBreakdown: { positive: 0, negative: 13, neutral: 1 },
              representativeQuotes: [
                { quote: 'I waited 20 minutes for the verification code email. By the time it arrived, I had moved on to test another tool.', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'Row #4 (Ticket #1042)' },
                { quote: 'Corporate firewall blocked the no-reply code email. Need an option to use Google SSO instead of forced email code.', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'Row #11 (Ticket #1089)' },
              ],
              potentialCauses: 'SendGrid deliverability throttling on new domain and lack of Google SSO fallback during signup.',
            },
            {
              id: 'th_team_invites',
              name: 'Forced Team Member Invitation Screen',
              description: 'Step 3 requires inviting at least two colleagues before reaching the workspace, frustrating solo users and evaluators.',
              frequency: 8,
              sentimentBreakdown: { positive: 0, negative: 7, neutral: 1 },
              representativeQuotes: [
                { quote: 'I just wanted to test the product myself before introducing it to my team, but the UI blocked me until I typed 2 email addresses.', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'Row #16 (Ticket #1134)' },
                { quote: 'The Skip Invite button is almost invisible gray text on white. Thought it was mandatory.', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'Row #22 (Ticket #1178)' },
              ],
              potentialCauses: 'Growth experiment forcing viral invitations prematurely.',
            },
          ],
          painPoints: [
            {
              id: 'pp_code_latency',
              problem: 'Verification code latency causes users to abandon before ever seeing the workspace dashboard.',
              circumstances: 'Occurs during initial email signup, especially on Outlook and corporate Microsoft 365 inboxes.',
              implications: 'High initial acquisition cost wasted; estimated 30%+ drop before account activation.',
              impactSeverity: 'Critical',
              confidence: 'High',
              supportingEvidence: [
                { quote: 'Code took 14 minutes. The token expired upon clicking.', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'Ticket #1042' },
              ],
            },
            {
              id: 'pp_premature_invites',
              problem: 'Compulsory team invite step halts solo evaluators.',
              circumstances: 'Step 3 of 4 in setup wizard.',
              implications: 'Creates unnecessary friction for the champion evaluating the tool on behalf of their company.',
              impactSeverity: 'High',
              confidence: 'High',
              supportingEvidence: [
                { quote: 'Blocked me until I typed 2 email addresses.', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'Ticket #1134' },
              ],
            },
          ],
          sentiment: {
            positivePct: 4,
            negativePct: 78,
            neutralPct: 18,
            mixedPct: 0,
            summary: 'Predominantly frustrated tone focused on onboarding gating mechanisms and slow verification.',
            isAiInterpretation: true,
          },
          outliers: [
            {
              observation: 'One enterprise IT manager praised the strict domain-matching security rule despite user complaints.',
              minorityPerspective: 'Security compliance administrators value mandatory verification codes even if end users experience friction.',
              evidence: 'Glad you require domain verification upfront, helps prevent unauthorized employee signups.',
              sourceFile: 'onboarding_support_tickets_sept.csv',
            },
          ],
          keyInsights: [
            {
              id: 'ins_01',
              title: 'Verification latency is the most acute technical friction in the uploaded tickets',
              explanation: '52% of uploaded negative tickets explicitly cite waiting more than 10 minutes for email tokens or code expiration.',
              supportingQuotes: [
                { quote: 'Waited 20 minutes for the verification code email. Moved on to another tool.', sourceFile: 'onboarding_support_tickets_sept.csv', sourceRef: 'Ticket #1042' },
              ],
              sourceFiles: ['onboarding_support_tickets_sept.csv'],
              confidenceLevel: 'High',
              limitations: 'Support tickets inherently capture users who bothered to write support; passive abandoners who left without submitting a ticket are not recorded here.',
            },
          ],
          sufficiencyAssessment: {
            outcome: 'B_PARTIALLY_SUFFICIENT',
            statusHeadline: 'Partially Sufficient Evidence — Key Root Causes Identified, But Silent Abandonment Rate Unknown',
            whatDataEstablishes: [
              'Customers who reach out to support are heavily impacted by email verification delays and forced team invites.',
              'The Skip button on Step 3 suffers from low contrast and confusing microcopy.',
            ],
            whatRemainsUnknown: [
              'What percentage of users who drop off do so because of verification delays vs lack of feature interest or pricing concerns?',
              'Do users who drop off without contacting support encounter the same issues, or do they abandon due to unfulfilled value expectations?',
            ],
            whyEvidenceCannotAnswer: 'Support tickets represent vocal complainants (approx 2-5% of total signups). They cannot measure the silent majority who abandoned without filing a ticket.',
            recommendedMethod: 'targeted_survey',
            recommendedMethodTitle: 'Targeted Pulse Survey to Abandoned Signups',
            rationale: 'A lightweight 3-question survey sent to users who dropped off 24-48 hours ago will quantify whether email delays or value propositions caused their departure.',
            suggestedSurveyFocus: 'Exit reasons, verification experience, and missing setup expectations.',
          },
          recommendations: [
            {
              id: 'rec_01',
              title: 'Make Team Member Invites Optional with High-Contrast "Skip for Now" Action',
              problemAddressed: 'Solo evaluators and champions are blocked from testing the product independently.',
              evidenceSupporting: '8 out of 27 tickets specifically complained about being forced to invite colleagues before seeing product value.',
              expectedOutcomeHypothesis: 'Increasing the visibility of "Skip for now" will eliminate immediate bounce on Step 3 for solo evaluators.',
              priority: 'High',
              priorityRationale: 'Low engineering effort, immediate reduction in onboarding gatekeeper friction.',
              suggestedNextStep: 'Redesign Step 3 CTA button to provide prominent primary "Skip for now and explore solo" link.',
            },
            {
              id: 'rec_02',
              title: 'Enable One-Click Google and Microsoft SSO on Initial Signup',
              problemAddressed: 'Verification code emails are throttled by spam filters or delivered with 10-15 minute latency.',
              evidenceSupporting: '14 tickets cited waiting for email codes or corporate firewall blocks.',
              expectedOutcomeHypothesis: 'OAuth SSO bypasses email delivery latency entirely for over 60% of corporate users.',
              priority: 'High',
              priorityRationale: 'Directly addresses the largest volume of support tickets.',
              suggestedNextStep: 'Implement Google & Microsoft OAuth on signup modal.',
            },
          ],
        },
      },
    ],
    surveys: [
      {
        id: 'srv_onboarding_pulse',
        projectId: 'proj_onboarding_demo',
        title: 'CloudDesk Onboarding Experience Check-in',
        introduction: 'We noticed you started setting up CloudDesk recently. Help us understand what got in your way with 3 quick questions (less than 1 minute).',
        status: 'published',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        publishedAt: new Date(Date.now() - 86400000).toISOString(),
        questions: [
          {
            id: 'q1',
            text: 'What was the main reason you paused your setup?',
            type: 'single_choice',
            options: [
              'Waiting for verification email / code',
              'Was asked to invite team members too early',
              'Could not find the feature I needed',
              'Ran out of time / will finish later',
              'Other',
            ],
            required: true,
            addressesResearchGap: 'Quantifies whether verification latency or forced invites causes the largest silent drop-off.',
          },
          {
            id: 'q2',
            text: 'How smooth was the initial account verification?',
            type: 'rating_scale',
            required: true,
            addressesResearchGap: 'Measures verification friction score across non-support respondents.',
          },
          {
            id: 'q3',
            text: 'What is one thing we could change to make setup easier for you?',
            type: 'long_text',
            required: false,
            addressesResearchGap: 'Uncovers unprompted expectations from evaluators.',
          },
        ],
        closingMessage: 'Thank you for your feedback! Your input directly helps us simplify onboarding.',
        responseCount: 2,
      },
    ],
    responses: [
      {
        id: 'resp_01',
        surveyId: 'srv_onboarding_pulse',
        projectId: 'proj_onboarding_demo',
        submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
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
        submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
        answers: {
          q1: 'Was asked to invite team members too early',
          q2: 4,
          q3: 'Let me play with demo data before asking me to invite my team manager.',
        },
      },
    ],
  };

  saveDatabase(initialDb);
  return initialDb;
}

function saveDatabase(data: DbSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save database file:', err);
  }
}

let db = loadDatabase();

// --- HEALTH CHECK & STATUS ---
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SignalIQ API',
    nodeVersion: process.version,
    env: process.env.NODE_ENV || 'development',
  });
});

// --- PROJECT MANAGEMENT ROUTES ---

// GET /api/projects
app.get('/api/projects', (req, res) => {
  res.json({ success: true, projects: db.projects });
});

// GET /api/projects/:id
app.get('/api/projects/:id', (req, res) => {
  const project = db.projects.find((p) => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  const projectSurveys = db.surveys.filter((s) => s.projectId === project.id);
  res.json({ success: true, project, surveys: projectSurveys });
});

// POST /api/projects
app.post('/api/projects', (req, res) => {
  const { id, name, objective, productName, customerSegment, businessContext, desiredOutcome, category } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, error: 'Project name is required' });
  }
  if (!objective || !objective.trim()) {
    return res.status(400).json({ success: false, error: 'Research objective is required' });
  }

  const existingIndex = db.projects.findIndex((p) => p.id === id);

  if (existingIndex >= 0) {
    // Update existing project
    db.projects[existingIndex] = {
      ...db.projects[existingIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDatabase(db);
    return res.json({ success: true, project: db.projects[existingIndex] });
  } else {
    // Create new project
    const newProject = {
      id: id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      objective: objective.trim(),
      productName: productName?.trim() || '',
      customerSegment: customerSegment?.trim() || '',
      businessContext: businessContext?.trim() || '',
      desiredOutcome: desiredOutcome?.trim() || '',
      category: category || 'general',
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sources: [],
    };
    db.projects.unshift(newProject);
    saveDatabase(db);
    return res.json({ success: true, project: newProject });
  }
});

// PUT /api/projects/:id/update-full
app.put('/api/projects/:id', (req, res) => {
  const index = db.projects.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  db.projects[index] = {
    ...db.projects[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(db);
  res.json({ success: true, project: db.projects[index] });
});

// DELETE /api/projects/:id
app.delete('/api/projects/:id', (req, res) => {
  const projectId = req.params.id;
  const projectIndex = db.projects.findIndex((p) => p.id === projectId);
  if (projectIndex === -1) {
    return res.status(404).json({ success: false, error: 'Project not found' });
  }
  db.projects.splice(projectIndex, 1);
  // Also clean up linked surveys and responses
  db.surveys = db.surveys.filter((s) => s.projectId !== projectId);
  db.responses = db.responses.filter((r) => r.projectId !== projectId);
  saveDatabase(db);
  res.json({ success: true, message: 'Project and associated data deleted' });
});

// GET /api/stats
app.get('/api/stats', (req, res) => {
  const totalProjects = db.projects.length;
  const completedProjects = db.projects.filter((p) => p.status === 'completed' || p.analysis).length;
  const totalSurveys = db.surveys.length;
  const totalResponses = db.responses.length;
  const totalFeedbackRecords = db.projects.reduce((acc, p) => {
    return acc + (p.analysis?.validRecords || p.sources?.reduce((sAcc: number, s: any) => sAcc + (s.recordCount || 0), 0) || 0);
  }, 0);

  res.json({
    success: true,
    stats: {
      totalProjects,
      completedProjects,
      totalSurveys,
      totalResponses,
      totalFeedbackRecords,
    },
  });
});

// --- SURVEY MANAGEMENT & RESPONDENT ROUTES ---

// GET /api/surveys
app.get('/api/surveys', (req, res) => {
  res.json({ success: true, surveys: db.surveys });
});

// GET /api/surveys/:id
app.get('/api/surveys/:id', (req, res) => {
  const survey = db.surveys.find((s) => s.id === req.params.id);
  if (!survey) {
    return res.status(404).json({ success: false, error: 'Survey not found' });
  }
  const project = db.projects.find((p) => p.id === survey.projectId);
  res.json({ success: true, survey, projectName: project?.name || 'Research Project' });
});

// POST /api/surveys
app.post('/api/surveys', (req, res) => {
  const { projectId, title, introduction, questions, closingMessage, status } = req.body;
  if (!projectId || !title) {
    return res.status(400).json({ success: false, error: 'Project ID and title are required' });
  }

  const newSurvey = {
    id: req.body.id || `srv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    projectId,
    title,
    introduction: introduction || '',
    status: status || 'draft',
    createdAt: new Date().toISOString(),
    publishedAt: status === 'published' ? new Date().toISOString() : undefined,
    questions: questions || [],
    closingMessage: closingMessage || 'Thank you for your valuable feedback!',
    responseCount: 0,
  };

  const existingIndex = db.surveys.findIndex((s) => s.id === newSurvey.id);
  if (existingIndex >= 0) {
    db.surveys[existingIndex] = { ...db.surveys[existingIndex], ...newSurvey };
  } else {
    db.surveys.unshift(newSurvey);
  }

  // Also link in project
  const pIndex = db.projects.findIndex((p) => p.id === projectId);
  if (pIndex >= 0) {
    db.projects[pIndex].survey = newSurvey;
    if (db.projects[pIndex].status !== 'completed') {
      db.projects[pIndex].status = 'survey_created';
    }
  }

  saveDatabase(db);
  res.json({ success: true, survey: newSurvey });
});

// POST /api/surveys/:id/status
app.post('/api/surveys/:id/status', (req, res) => {
  const { status } = req.body;
  const survey = db.surveys.find((s) => s.id === req.params.id);
  if (!survey) {
    return res.status(404).json({ success: false, error: 'Survey not found' });
  }
  survey.status = status;
  if (status === 'published' && !survey.publishedAt) {
    survey.publishedAt = new Date().toISOString();
  }
  saveDatabase(db);
  res.json({ success: true, survey });
});

// POST /api/surveys/:id/responses (Public Respondent Submission)
app.post('/api/surveys/:id/responses', (req, res) => {
  const survey = db.surveys.find((s) => s.id === req.params.id);
  if (!survey) {
    return res.status(404).json({ success: false, error: 'Survey not found' });
  }

  if (survey.status !== 'published') {
    return res.status(403).json({ success: false, error: 'This survey is not currently accepting responses' });
  }

  const { answers, campaignId } = req.body;
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ success: false, error: 'Valid survey answers are required' });
  }

  // Validate required questions
  for (const q of survey.questions) {
    if (q.required) {
      const ans = answers[q.id];
      if (ans === undefined || ans === null || (typeof ans === 'string' && ans.trim() === '')) {
        return res.status(400).json({
          success: false,
          error: `Question "${q.text}" is required`,
          questionId: q.id,
        });
      }
    }
  }

  const newResponse = {
    id: `resp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    surveyId: survey.id,
    projectId: survey.projectId,
    campaignId: campaignId || undefined,
    submittedAt: new Date().toISOString(),
    answers,
  };

  db.responses.push(newResponse);
  survey.responseCount = (survey.responseCount || 0) + 1;

  // Also update project representation
  const pIndex = db.projects.findIndex((p) => p.id === survey.projectId);
  if (pIndex >= 0 && db.projects[pIndex].survey) {
    db.projects[pIndex].survey.responseCount = survey.responseCount;
  }

  saveDatabase(db);
  res.json({ success: true, responseId: newResponse.id, message: 'Response saved successfully' });
});

// GET /api/surveys/:id/responses
app.get('/api/surveys/:id/responses', (req, res) => {
  const responses = db.responses.filter((r) => r.surveyId === req.params.id);
  res.json({ success: true, responses, count: responses.length });
});

// GET /api/responses (All Survey Submissions)
app.get('/api/responses', (req, res) => {
  const { surveyId, projectId } = req.query;
  let responses = db.responses || [];
  if (surveyId) {
    responses = responses.filter((r) => r.surveyId === surveyId);
  }
  if (projectId) {
    responses = responses.filter((r) => r.projectId === projectId);
  }
  const enriched = responses.map((r) => {
    const survey = db.surveys.find((s) => s.id === r.surveyId);
    const project = db.projects.find((p) => p.id === r.projectId);
    return {
      ...r,
      surveyTitle: survey?.title || 'Targeted Survey',
      projectName: project?.name || 'Research Project',
      surveyQuestions: survey?.questions || [],
    };
  });
  res.json({ success: true, responses: enriched, count: enriched.length });
});

// GET /api/surveys/responses (Alias for all survey responses)
app.get('/api/surveys/responses', (req, res) => {
  const { surveyId, projectId } = req.query;
  let responses = db.responses || [];
  if (surveyId) {
    responses = responses.filter((r) => r.surveyId === surveyId);
  }
  if (projectId) {
    responses = responses.filter((r) => r.projectId === projectId);
  }
  const enriched = responses.map((r) => {
    const survey = db.surveys.find((s) => s.id === r.surveyId);
    const project = db.projects.find((p) => p.id === r.projectId);
    return {
      ...r,
      surveyTitle: survey?.title || 'Targeted Survey',
      projectName: project?.name || 'Research Project',
      surveyQuestions: survey?.questions || [],
    };
  });
  res.json({ success: true, responses: enriched, count: enriched.length });
});

// Demo feedback records helper for Onboarding Drop-off dataset
function getDemoFeedbackRows() {
  return [
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
    { id: 'TK-124', date: '2026-09-26', segment: 'Solo Freelancer', rating: 1, sentiment: 'negative', feedbackText: 'Verification code email had no branding, thought it was a phishing attempt.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
    { id: 'TK-125', date: '2026-09-27', segment: 'Small Team (2-10)', rating: 4, sentiment: 'positive', feedbackText: 'Great product concept, but onboarding forced too many decisions upfront.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
    { id: 'TK-126', date: '2026-09-27', segment: 'Solo Freelancer', rating: 5, sentiment: 'positive', feedbackText: 'Customer support resolved my signup issue within 10 minutes, loved the quick response.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
    { id: 'TK-127', date: '2026-09-28', segment: 'Small Team (2-10)', rating: 3, sentiment: 'neutral', feedbackText: 'Would prefer a video walkthrough option during the initial setup step.', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: false },
    { id: 'TK-128', date: '2026-09-28', segment: 'Solo Freelancer', rating: null, sentiment: null, feedbackText: '', sourceFile: 'onboarding_support_tickets_sept.csv', projectName: 'Onboarding Drop-off Analysis', projectId: 'proj_onboarding_demo', isExcluded: true }
  ];
}

// GET /api/feedback-records (Aggregated customer feedback intelligence)
app.get('/api/feedback-records', (req, res) => {
  const records: any[] = [];
  const sourcesSummary: any[] = [];

  // Gather from loaded projects
  for (const project of db.projects) {
    if (project.sources && project.sources.length > 0) {
      for (const src of project.sources) {
        sourcesSummary.push({
          id: src.id,
          fileName: src.fileName,
          fileType: src.fileType,
          uploadedAt: src.uploadedAt,
          recordCount: src.recordCount || 0,
          excludedCount: src.excludedCount || 0,
          exclusionNotes: src.exclusionNotes,
          projectId: project.id,
          projectName: project.name,
        });

        if (src.previewRows && Array.isArray(src.previewRows) && src.previewRows.length > 0) {
          src.previewRows.forEach((row: any, idx: number) => {
            records.push({
              id: row.ticket_id || row.id || `row_${idx + 1}`,
              date: row.created_date || row.date || '2026-09-20',
              segment: row.user_segment || row.segment || row.device_type || 'General',
              rating: typeof row.rating === 'number' ? row.rating : (typeof row.satisfaction_rating === 'number' ? row.satisfaction_rating : null),
              sentiment: row.sentiment || (row.rating <= 2 ? 'negative' : (row.rating === 3 ? 'neutral' : 'positive')),
              feedbackText: row.feedback_text || row.customer_comment || row.text || '',
              sourceFile: src.fileName,
              projectName: project.name,
              projectId: project.id,
              isExcluded: !row.feedback_text && !row.customer_comment,
            });
          });
        }
      }
    }
  }

  // If no records in project previewRows yet, use the canonical demo records
  if (records.length === 0) {
    const demoRecords = getDemoFeedbackRows();
    demoRecords.forEach((r) => records.push(r));
    if (sourcesSummary.length === 0) {
      sourcesSummary.push({
        id: 'src_tickets_01',
        fileName: 'onboarding_support_tickets_sept.csv',
        fileType: 'csv',
        uploadedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        recordCount: 28,
        excludedCount: 1,
        exclusionNotes: '1 blank feedback record excluded from calculations.',
        projectId: 'proj_onboarding_demo',
        projectName: 'Onboarding Drop-off Analysis',
      });
    }
  }

  const validRecords = records.filter((r) => !r.isExcluded);
  const excludedRecords = records.filter((r) => r.isExcluded);

  res.json({
    success: true,
    records,
    sources: sourcesSummary,
    totalRecords: validRecords.length,
    totalExcluded: excludedRecords.length,
    validRecordsCount: validRecords.length,
  });
});

// --- BULK EMAIL DISTRIBUTION & GOOGLE APPS SCRIPT ROUTES ---

function validateEmailFormat(email: string): { isValid: boolean; error?: string } {
  const trimmed = email ? email.trim() : '';
  if (!trimmed) {
    return { isValid: false, error: 'Empty email address' };
  }
  if (!trimmed.includes('@')) {
    return { isValid: false, error: 'Missing @ symbol' };
  }
  const parts = trimmed.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Multiple @ symbols found' };
  }
  const [localPart, domainPart] = parts;
  if (!localPart) {
    return { isValid: false, error: 'Missing username before @' };
  }
  if (!domainPart) {
    return { isValid: false, error: 'Missing domain after @' };
  }
  if (!domainPart.includes('.')) {
    return { isValid: false, error: 'Domain missing extension (e.g. .com)' };
  }
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: 'Malformed email syntax or forbidden characters' };
  }
  return { isValid: true };
}

// GET /api/email/config
app.get('/api/email/config', (req, res) => {
  res.json({
    success: true,
    config: db.emailConfig || {},
    optOuts: db.optOuts || [],
  });
});

// POST /api/email/config
app.post('/api/email/config', (req, res) => {
  const { appsScriptUrl, senderName } = req.body;
  db.emailConfig = {
    ...db.emailConfig,
    appsScriptUrl: appsScriptUrl !== undefined ? appsScriptUrl.trim() : db.emailConfig?.appsScriptUrl,
    senderName: senderName !== undefined ? senderName.trim() : db.emailConfig?.senderName,
  };
  saveDatabase(db);
  res.json({ success: true, config: db.emailConfig });
});

// GET /api/email/quota
app.get('/api/email/quota', async (req, res) => {
  const url = db.emailConfig?.appsScriptUrl;
  if (!url) {
    return res.json({
      success: true,
      isConfigured: false,
      remainingQuota: null,
      message: 'Google Apps Script Web App URL is not configured yet.',
    });
  }

  try {
    const scriptRes = await fetch(url, { method: 'GET', redirect: 'follow' });
    const data: any = await scriptRes.json();
    if (data && typeof data.remainingQuota === 'number') {
      if (db.emailConfig) {
        db.emailConfig.lastQuota = data.remainingQuota;
        db.emailConfig.lastQuotaCheckedAt = new Date().toISOString();
        saveDatabase(db);
      }
      return res.json({
        success: true,
        isConfigured: true,
        remainingQuota: data.remainingQuota,
        account: data.account || 'Google Account',
        status: data.status || 'active',
      });
    } else {
      return res.json({
        success: false,
        isConfigured: true,
        remainingQuota: null,
        error: data.error || 'Failed to retrieve quota from script response',
      });
    }
  } catch (err: any) {
    return res.status(502).json({
      success: false,
      isConfigured: true,
      remainingQuota: db.emailConfig?.lastQuota || null,
      error: `Could not reach Apps Script endpoint: ${err.message || 'Network error'}`,
    });
  }
});

// POST /api/email/validate-recipients
app.post('/api/email/validate-recipients', (req, res) => {
  const { rawRecipients, surveyId } = req.body;

  if (!rawRecipients || !Array.isArray(rawRecipients)) {
    return res.status(400).json({ success: false, error: 'Raw recipients list is required' });
  }

  const optOutSet = new Set((db.optOuts || []).map((e: string) => e.toLowerCase().trim()));

  // Previous campaigns for this survey to check for re-sends
  const previousCampaigns = (db.campaigns || []).filter((c: any) => c.surveyId === surveyId);
  const previouslyEmailedSet = new Set<string>();
  previousCampaigns.forEach((c: any) => {
    (c.results || []).forEach((r: any) => {
      if (r.status === 'sent' && r.email) {
        previouslyEmailedSet.add(r.email.toLowerCase().trim());
      }
    });
  });

  const seenEmails = new Set<string>();
  const recipients: any[] = [];

  let invalidCount = 0;
  let duplicateCount = 0;
  let optedOutCount = 0;
  let previouslyEmailedCount = 0;
  let validUniqueCount = 0;

  rawRecipients.forEach((item: any, idx: number) => {
    const rawEmail = typeof item === 'string' ? item : item.email;
    const name = typeof item === 'object' && item.name ? String(item.name).trim() : undefined;
    const cleanEmail = rawEmail ? String(rawEmail).trim().toLowerCase() : '';

    const validation = validateEmailFormat(cleanEmail);
    const isOptedOut = optOutSet.has(cleanEmail);
    const isPreviouslyEmailed = previouslyEmailedSet.has(cleanEmail);
    let isDuplicate = false;

    if (!validation.isValid) {
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
        if (isPreviouslyEmailed) {
          previouslyEmailedCount++;
        }
      }
    }

    const isSelectable = validation.isValid && !isDuplicate && !isOptedOut;

    recipients.push({
      id: `rcp_${idx}_${Math.random().toString(36).substring(2, 6)}`,
      email: cleanEmail,
      name,
      rowIndex: idx + 1,
      isValid: validation.isValid,
      validationError: validation.error,
      isDuplicate,
      isOptedOut,
      isPreviouslyEmailed,
      selected: isSelectable,
    });
  });

  const summary = {
    totalRows: rawRecipients.length,
    validUniqueCount,
    invalidCount,
    duplicateCount,
    optedOutCount,
    previouslyEmailedCount,
    selectedCount: validUniqueCount,
  };

  res.json({
    success: true,
    summary,
    recipients,
    previouslyEmailedWarning: previouslyEmailedCount > 0,
  });
});

// POST /api/email/send (Alias for send-campaign)
app.post('/api/email/send', async (req, res) => {
  req.url = '/api/email/send-campaign';
  return app._router.handle(req, res);
});

// POST /api/email/send-campaign
app.post('/api/email/send-campaign', async (req, res) => {
  const {
    surveyId,
    projectId,
    campaignName,
    subject,
    body,
    recipients,
    confirmed,
    simulate,
  } = req.body;

  if (!confirmed) {
    return res.status(400).json({
      success: false,
      error: 'Explicit user confirmation is required before launching a bulk send.',
    });
  }

  if (!surveyId || !recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ success: false, error: 'Survey ID and valid recipient list are required.' });
  }

  const survey = db.surveys.find((s) => s.id === surveyId);
  if (!survey) {
    return res.status(404).json({ success: false, error: 'Survey not found.' });
  }

  const project = db.projects.find((p) => p.id === (projectId || survey.projectId));
  const optOutSet = new Set((db.optOuts || []).map((e: string) => e.toLowerCase().trim()));

  // Filter only valid & not opted out
  const targetRecipients = recipients.filter((r: any) => {
    const email = typeof r === 'string' ? r.trim().toLowerCase() : r.email?.trim().toLowerCase();
    const v = validateEmailFormat(email);
    return v.isValid && !optOutSet.has(email);
  });

  if (targetRecipients.length === 0) {
    return res.status(400).json({ success: false, error: 'No valid, non-opted-out recipients selected.' });
  }

  const campaignId = `camp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const surveyUrl = `${req.protocol}://${req.get('host')}/#survey-${survey.id}?cid=${campaignId}`;

  const appsScriptUrl = db.emailConfig?.appsScriptUrl;

  // Real Google Apps Script Execution
  if (appsScriptUrl && !simulate) {
    try {
      const payload = {
        action: 'send',
        campaignId,
        subject: subject || `${survey.title} — Please share your feedback`,
        body: body || `Please complete our survey: {{survey_url}}`,
        surveyUrl,
        recipients: targetRecipients.map((r: any) => ({
          email: typeof r === 'string' ? r : r.email,
          name: typeof r === 'object' ? r.name : '',
        })),
      };

      const scriptRes = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'follow',
      });

      const scriptData: any = await scriptRes.json();

      if (!scriptData || scriptData.success === false) {
        return res.status(500).json({
          success: false,
          error: scriptData?.error || 'Apps Script reported an execution error.',
        });
      }

      const campaignRecord = {
        id: campaignId,
        surveyId,
        projectId: survey.projectId,
        surveyTitle: survey.title,
        name: campaignName || `${survey.title} Email Campaign`,
        subject: subject || `${survey.title} — Please share your feedback`,
        body: body || `Please complete our survey: {{survey_url}}`,
        senderAccount: scriptData.account || 'Configured Google Account',
        totalRecipients: targetRecipients.length,
        sentCount: scriptData.sentCount || targetRecipients.length,
        failedCount: scriptData.failedCount || 0,
        remainingQuota: scriptData.remainingQuota,
        sentAt: new Date().toISOString(),
        results: scriptData.results || targetRecipients.map((r: any) => ({
          email: typeof r === 'string' ? r : r.email,
          name: typeof r === 'object' ? r.name : undefined,
          status: 'sent',
          timestamp: new Date().toISOString(),
        })),
        responseCount: 0,
        responseRate: 0,
        isSimulation: false,
      };

      db.campaigns = db.campaigns || [];
      db.campaigns.unshift(campaignRecord);
      if (db.emailConfig && typeof scriptData.remainingQuota === 'number') {
        db.emailConfig.lastQuota = scriptData.remainingQuota;
        db.emailConfig.lastQuotaCheckedAt = new Date().toISOString();
      }
      saveDatabase(db);

      return res.json({ success: true, campaign: campaignRecord });
    } catch (err: any) {
      console.error('Apps Script dispatch error:', err);
      return res.status(502).json({
        success: false,
        error: `Failed to dispatch to Apps Script: ${err.message || 'Network error'}`,
      });
    }
  }

  // Simulation / Development Test Mode (with honest labeling)
  const results = targetRecipients.map((r: any) => {
    const email = typeof r === 'string' ? r : r.email;
    const name = typeof r === 'object' ? r.name : undefined;
    return {
      email,
      name,
      status: 'simulated',
      timestamp: new Date().toISOString(),
    };
  });

  const simulatedCampaign = {
    id: campaignId,
    surveyId,
    projectId: survey.projectId,
    surveyTitle: survey.title,
    name: campaignName || `${survey.title} Test Batch`,
    subject: subject || `${survey.title} — Please share your feedback`,
    body: body || `Please complete our survey: {{survey_url}}`,
    senderAccount: 'Local Simulation (Apps Script Not Connected)',
    totalRecipients: targetRecipients.length,
    sentCount: targetRecipients.length,
    failedCount: 0,
    remainingQuota: db.emailConfig?.lastQuota || 100,
    sentAt: new Date().toISOString(),
    results,
    responseCount: 0,
    responseRate: 0,
    isSimulation: true,
  };

  db.campaigns = db.campaigns || [];
  db.campaigns.unshift(simulatedCampaign);
  saveDatabase(db);

  res.json({
    success: true,
    campaign: simulatedCampaign,
    message: appsScriptUrl
      ? 'Campaign sent in simulation mode.'
      : 'Google Apps Script Web App URL is not configured yet. Campaign recorded in test mode with shareable link.',
  });
});

// GET /api/email/campaigns
app.get('/api/email/campaigns', (req, res) => {
  const { surveyId } = req.query;
  let campaigns = db.campaigns || [];
  if (surveyId) {
    campaigns = campaigns.filter((c: any) => c.surveyId === surveyId);
  }

  // Calculate actual response counts from db.responses
  const enriched = campaigns.map((c: any) => {
    const matchedResponses = (db.responses || []).filter((r: any) => r.campaignId === c.id);
    const responseCount = matchedResponses.length;
    const responseRate = c.sentCount > 0 ? parseFloat(((responseCount / c.sentCount) * 100).toFixed(1)) : 0;
    return {
      ...c,
      responseCount,
      responseRate,
    };
  });

  res.json({ success: true, campaigns: enriched });
});

// GET /api/email/campaigns/:id
app.get('/api/email/campaigns/:id', (req, res) => {
  const campaign = (db.campaigns || []).find((c: any) => c.id === req.params.id);
  if (!campaign) {
    return res.status(404).json({ success: false, error: 'Campaign not found' });
  }
  const matchedResponses = (db.responses || []).filter((r: any) => r.campaignId === campaign.id);
  const responseCount = matchedResponses.length;
  const responseRate = campaign.sentCount > 0 ? parseFloat(((responseCount / campaign.sentCount) * 100).toFixed(1)) : 0;

  res.json({
    success: true,
    campaign: {
      ...campaign,
      responseCount,
      responseRate,
    },
  });
});

// GET /api/email/campaigns/:id/export
app.get('/api/email/campaigns/:id/export', (req, res) => {
  const campaign = (db.campaigns || []).find((c: any) => c.id === req.params.id);
  if (!campaign) {
    return res.status(404).send('Campaign not found');
  }

  let csv = 'Recipient Email,Name,Status,Error Reason,Timestamp\n';
  (campaign.results || []).forEach((r: any) => {
    const email = `"${(r.email || '').replace(/"/g, '""')}"`;
    const name = `"${(r.name || '').replace(/"/g, '""')}"`;
    const status = `"${(r.status || '').replace(/"/g, '""')}"`;
    const error = `"${(r.error || '').replace(/"/g, '""')}"`;
    const ts = `"${(r.timestamp || campaign.sentAt || '').replace(/"/g, '""')}"`;
    csv += `${email},${name},${status},${error},${ts}\n`;
  });

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=Campaign_${campaign.id}_results.csv`);
  res.send(csv);
});

// GET /api/email/opt-outs
app.get('/api/email/opt-outs', (req, res) => {
  res.json({ success: true, optOuts: db.optOuts || [] });
});

// POST /api/email/opt-outs
app.post('/api/email/opt-outs', (req, res) => {
  const { email, action } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ success: false, error: 'Email address is required' });
  }

  const clean = email.trim().toLowerCase();
  db.optOuts = db.optOuts || [];

  if (action === 'remove') {
    db.optOuts = db.optOuts.filter((e: string) => e !== clean);
  } else {
    if (!db.optOuts.includes(clean)) {
      db.optOuts.push(clean);
    }
  }

  saveDatabase(db);
  res.json({ success: true, optOuts: db.optOuts });
});

// --- AI / GEMINI POWERED ENDPOINTS ---

// Helper function to extract JSON reliably from Gemini response
function cleanAndParseJson(text: string) {
  try {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (clean.startsWith('```')) {
      clean = clean.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }
    return JSON.parse(clean);
  } catch (err) {
    console.error('Failed to parse model JSON:', err, '\nRaw text was:', text);
    throw new Error('Model produced non-JSON output');
  }
}

// Multi-model resilient caller: tries gemini-3.1-flash-lite, falls back to gemini-3.8-flash
async function generateWithGemini(contents: any, config?: any) {
  const models = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  let lastErr: any = null;

  for (const model of models) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents,
        config,
      });
      return res;
    } catch (err: any) {
      console.warn(`Model ${model} attempt failed:`, err?.message || err);
      lastErr = err;
      // brief pause before trying next model
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  throw lastErr || new Error('Failed to generate content from Gemini models');
}

// POST /api/ai/suggest-objective
app.post('/api/ai/suggest-objective', async (req, res) => {
  const { topic, category, productName } = req.body;
  const prompt = `You are a Senior AI Product Research Architect.
Generate a concise, realistic, high-impact research objective based on:
Topic / Hint: "${topic || 'User friction'}"
Category: "${category || 'onboarding'}"
Product: "${productName || 'Web SaaS Platform'}"

Respond ONLY with valid JSON:
{
  "name": "Concise Project Name (3-5 words)",
  "objective": "Clear, measurable research objective (1-2 sentences)",
  "customerSegment": "Specific target customer profile or cohort",
  "businessContext": "Brief context explaining why this matters right now",
  "desiredOutcome": "Target decision or improvement to achieve"
}`;

  try {
    const response = await generateWithGemini(prompt, { responseMimeType: 'application/json' });
    const parsed = cleanAndParseJson(response.text || '{}');
    res.json({ success: true, suggestion: parsed });
  } catch (err: any) {
    console.error('Suggest objective error:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to suggest objective' });
  }
});

// POST /api/ai/generate-brief (Alias for research-brief)
app.post('/api/ai/generate-brief', async (req, res) => {
  req.url = '/api/ai/research-brief';
  return app._router.handle(req, res);
});

// POST /api/ai/research-brief
app.post('/api/ai/research-brief', async (req, res) => {
  const { name, objective, productName, customerSegment, businessContext, desiredOutcome, category } = req.body;

  if (!objective || !objective.trim()) {
    return res.status(400).json({ success: false, error: 'Research objective is required' });
  }

  const prompt = `You are an expert AI product research architect for SignalIQ.
Analyze the following research project request and produce a structured, thorough Research Brief.
Do NOT fabricate customer numbers or replace the user's business question with an unrelated topic.
If there are ambiguities or unknown variables, explicitly list them under limitationsAndAmbiguities and provide relevant clarificationQuestions.

Project Name: ${name || 'Untitled Research'}
Research Objective: ${objective}
Product Name: ${productName || 'Unspecified'}
Target Customer Segment: ${customerSegment || 'General customer base'}
Business Context: ${businessContext || 'None provided'}
Desired Outcome: ${desiredOutcome || 'Unspecified'}
Category: ${category || 'general'}

Respond ONLY with a valid JSON object matching this schema:
{
  "primaryQuestion": "The core question formulated clearly",
  "subQuestions": ["3-4 specific, measurable sub-questions this research must answer"],
  "targetSegment": "Specific target customer profile or segment",
  "requiredInfo": ["3-5 specific data points or information types needed to answer the question"],
  "signalsToInvestigate": ["3-5 customer signals, friction points, or metrics to look for"],
  "potentialSources": ["Recommended evidence sources such as support tickets, interview transcripts, churn logs, or heatmaps"],
  "limitationsAndAmbiguities": ["Known limitations, missing context, or assumptions in the current objective"],
  "clarificationQuestions": ["1-2 clarifying questions for the user if any context is ambiguous"],
  "recommendedFocus": "A 1-2 sentence recommendation on what to prioritize in the upcoming analysis"
}`;

  try {
    const response = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const brief = cleanAndParseJson(response.text || '{}');
    brief.approved = false;
    res.json({ success: true, brief });
  } catch (err: any) {
    console.error('Gemini brief generation error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate research brief: ' + (err.message || 'Unknown AI error'),
    });
  }
});

// POST /api/ai/analyze-feedback
app.post('/api/ai/analyze-feedback', async (req, res) => {
  const { brief, objective, sources } = req.body;

  if (!sources || !Array.isArray(sources) || sources.length === 0) {
    return res.status(400).json({ success: false, error: 'At least one evidence source is required for analysis' });
  }

  // Prepare evidence payload
  let totalRecords = 0;
  let validRecords = 0;
  let excludedRecords = 0;
  const ratingValues: number[] = [];
  const segments: Record<string, number> = {};

  const sourceSummaries = sources.map((s: any) => {
    const records = s.previewRows || [];
    const sourceRecCount = s.recordCount || records.length;
    const sourceExcluded = s.excludedCount || 0;
    totalRecords += sourceRecCount;
    validRecords += sourceRecCount - sourceExcluded;
    excludedRecords += sourceExcluded;

    // Calculate rating distribution if present
    records.forEach((row: any) => {
      const ratingCol = s.columnMappings?.ratingCol;
      const segmentCol = s.columnMappings?.segmentCol;
      if (ratingCol && row[ratingCol] !== undefined && row[ratingCol] !== null && row[ratingCol] !== '') {
        const val = parseFloat(row[ratingCol]);
        if (!isNaN(val) && val >= 1 && val <= 5) {
          ratingValues.push(val);
        }
      }
      if (segmentCol && row[segmentCol]) {
        const seg = String(row[segmentCol]).trim();
        if (seg) segments[seg] = (segments[seg] || 0) + 1;
      }
    });

    return {
      fileName: s.fileName,
      fileType: s.fileType,
      recordCount: sourceRecCount,
      excludedCount: sourceExcluded,
      detectedColumns: s.detectedColumns,
      mappings: s.columnMappings,
      sampleRowsOrText: records.slice(0, 30),
      extractedContent: s.extractedContent ? s.extractedContent.substring(0, 4000) : undefined,
    };
  });

  const avgRating = ratingValues.length > 0
    ? parseFloat((ratingValues.reduce((a, b) => a + b, 0) / ratingValues.length).toFixed(1))
    : undefined;

  const ratingDistribution: Record<string, number> = {};
  if (ratingValues.length > 0) {
    [1, 2, 3, 4, 5].forEach((k) => {
      ratingDistribution[String(k)] = ratingValues.filter((v) => Math.round(v) === k).length;
    });
  }

  const prompt = `You are SignalIQ's Chief Feedback Intelligence Architect.
Analyze the provided customer feedback evidence strictly against the research objective and research brief.

CRITICAL PRINCIPLES:
1. Do NOT automatically recommend or force a survey!
2. Evaluate Evidence Sufficiency:
   - "A_SUFFICIENT": Available data thoroughly and adequately answers the research question. (User can jump straight to final recommendations, NO survey needed!).
   - "B_PARTIALLY_SUFFICIENT": Data identifies problems or patterns, but does NOT fully prove root cause across all customer segments (e.g., support tickets show verification complaints, but do not capture silent abandoners who never submitted a ticket).
   - "C_INSUFFICIENT": Uploaded data is off-topic, too sparse, or lacking critical dimensions to answer the primary objective.
3. NEVER fabricate customer quotes, IDs, or statistics. All quotes must be extracted directly from the actual sampleRowsOrText or extractedContent provided.
4. Distinguish observed facts from AI interpretations and hypotheses.
5. Identify minority opinions / outliers and conflicting viewpoints.

Research Objective: ${objective || brief?.primaryQuestion || 'Customer problem analysis'}
Approved Brief Context:
- Sub-questions: ${JSON.stringify(brief?.subQuestions || [])}
- Target Segment: ${brief?.targetSegment || 'All users'}
- Limitations noted: ${JSON.stringify(brief?.limitationsAndAmbiguities || [])}

Evidence Sources Data:
${JSON.stringify(sourceSummaries, null, 2)}

Calculated Metrics:
- Total records: ${totalRecords}
- Valid records: ${validRecords}
- Excluded records: ${excludedRecords}
- Average rating: ${avgRating || 'N/A'}

Respond ONLY with a valid JSON object matching this schema:
{
  "recurringThemes": [
    {
      "id": "th_1",
      "name": "Theme title",
      "description": "2-sentence explanation of what customers are experiencing",
      "frequency": 12,
      "sentimentBreakdown": { "positive": 1, "negative": 10, "neutral": 1 },
      "representativeQuotes": [
        { "quote": "Verbatim quote from uploaded evidence", "sourceFile": "filename.csv", "sourceRef": "Row # / Ticket ID" }
      ],
      "potentialCauses": "Likely underlying product or design factor"
    }
  ],
  "painPoints": [
    {
      "id": "pp_1",
      "problem": "Specific customer obstacle",
      "circumstances": "When and where it occurs",
      "implications": "Impact on user progress or retention",
      "impactSeverity": "Critical",
      "confidence": "High",
      "supportingEvidence": [
        { "quote": "Verbatim quote", "sourceFile": "filename.csv", "sourceRef": "Row #" }
      ]
    }
  ],
  "sentiment": {
    "positivePct": 15,
    "negativePct": 70,
    "neutralPct": 15,
    "mixedPct": 0,
    "summary": "Concise summary of tone across processed records",
    "isAiInterpretation": true
  },
  "outliers": [
    {
      "observation": "Interesting contradiction or counter-opinion",
      "minorityPerspective": "Why this perspective exists and why it shouldn't be ignored",
      "evidence": "Supporting quote or observation",
      "sourceFile": "filename"
    }
  ],
  "keyInsights": [
    {
      "id": "ins_1",
      "title": "Insight headline",
      "explanation": "Detailed evidence-backed explanation",
      "supportingQuotes": [{ "quote": "Actual quote", "sourceFile": "filename", "sourceRef": "Row #" }],
      "sourceFiles": ["filename"],
      "confidenceLevel": "High",
      "limitations": "Specific caveat or sampling limitation of this data"
    }
  ],
  "sufficiencyAssessment": {
    "outcome": "A_SUFFICIENT" or "B_PARTIALLY_SUFFICIENT" or "C_INSUFFICIENT",
    "statusHeadline": "Clear headline of evidence sufficiency",
    "whatDataEstablishes": ["2-3 specific things proven by the data"],
    "whatRemainsUnknown": ["1-3 questions that current evidence cannot answer"],
    "whyEvidenceCannotAnswer": "Clear rationale why current data has gaps (e.g., ticket bias, missing quantitative abandon metrics)",
    "recommendedMethod": "none_sufficient" or "targeted_survey" or "interviews" or "behavioural_heatmap" or "additional_tickets",
    "recommendedMethodTitle": "Title of recommended method (e.g. No Further Research Needed or Targeted Pulse Survey)",
    "rationale": "Why this recommendation is the most efficient next step",
    "suggestedSurveyFocus": "If survey or interviews recommended, what specific questions to ask"
  },
  "recommendations": [
    {
      "id": "rec_1",
      "title": "Actionable product/UX recommendation",
      "problemAddressed": "Which pain point or theme this solves",
      "evidenceSupporting": "Summary of data pointing to this solution",
      "expectedOutcomeHypothesis": "What we hypothesize will happen (labeled clearly as a hypothesis)",
      "priority": "High",
      "priorityRationale": "Why this priority was assigned based on frequency and severity",
      "suggestedNextStep": "First tactical implementation or validation step"
    }
  ]
}`;

  try {
    const response = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const parsed = cleanAndParseJson(response.text || '{}');

    const analysisResult = {
      analyzedAt: new Date().toISOString(),
      sourcesAnalyzed: sources.map((s: any) => s.fileName),
      totalRecords,
      validRecords,
      excludedRecords,
      exclusionsReason: excludedRecords > 0 ? `${excludedRecords} empty or unparseable records were excluded from quantitative calculation.` : undefined,
      ratingStats: avgRating ? { average: avgRating, distribution: ratingDistribution } : undefined,
      segmentStats: Object.keys(segments).length > 0 ? segments : undefined,
      recurringThemes: parsed.recurringThemes || [],
      painPoints: parsed.painPoints || [],
      sentiment: parsed.sentiment || { positivePct: 0, negativePct: 0, neutralPct: 0, mixedPct: 0, summary: 'N/A', isAiInterpretation: true },
      outliers: parsed.outliers || [],
      keyInsights: parsed.keyInsights || [],
      sufficiencyAssessment: parsed.sufficiencyAssessment || {
        outcome: 'B_PARTIALLY_SUFFICIENT',
        statusHeadline: 'Evidence Partially Sufficient',
        whatDataEstablishes: [],
        whatRemainsUnknown: [],
        whyEvidenceCannotAnswer: '',
        recommendedMethod: 'targeted_survey',
        recommendedMethodTitle: 'Targeted Customer Survey',
        rationale: 'Additional customer verification needed.',
      },
      recommendations: parsed.recommendations || [],
    };

    res.json({ success: true, analysis: analysisResult });
  } catch (err: any) {
    console.error('Gemini feedback analysis error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze feedback data: ' + (err.message || 'Unknown AI error'),
    });
  }
});

// POST /api/ai/generate-survey
app.post('/api/ai/generate-survey', async (req, res) => {
  const { brief, objective, sufficiencyAssessment, targetSegment, desiredOutcome } = req.body;

  if (!sufficiencyAssessment || !sufficiencyAssessment.whatRemainsUnknown) {
    return res.status(400).json({ success: false, error: 'Knowledge gaps from sufficiency assessment are required' });
  }

  const prompt = `You are an expert UX Survey Architect in SignalIQ.
Generate a targeted, high-impact survey designed SPECIFICALLY to fill the identified knowledge gaps from previous research.
Do NOT repeat questions that the uploaded data has already thoroughly answered.
Keep it concise (3 to 5 questions maximum).
Avoid leading questions or double-barrelled questions. Include neutral choices and 'Other' where suitable.

Research Objective: ${objective || brief?.primaryQuestion || 'Understand customer problem'}
Identified Knowledge Gaps (What remains unknown):
${JSON.stringify(sufficiencyAssessment.whatRemainsUnknown, null, 2)}

Target Customer Segment: ${targetSegment || brief?.targetSegment || 'Affected customers'}
Desired Business Outcome: ${desiredOutcome || 'Clarify root causes and prioritize improvements'}

Supported question types:
- "single_choice" (radio buttons)
- "multiple_choice" (checkboxes)
- "rating_scale" (1 to 5)
- "short_text"
- "long_text"
- "yes_no"

Respond ONLY with a valid JSON object matching this schema:
{
  "title": "Clear, professional survey title",
  "introduction": "Brief 1-2 sentence introduction setting expectations for the respondent",
  "closingMessage": "Gratitude message shown after submission",
  "questions": [
    {
      "id": "q1",
      "text": "Neutral, well-crafted question",
      "type": "single_choice",
      "options": ["Option 1", "Option 2", "Option 3", "Other"],
      "required": true,
      "addressesResearchGap": "Explanation of which exact knowledge gap this question resolves"
    }
  ]
}`;

  try {
    const response = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const parsed = cleanAndParseJson(response.text || '{}');
    res.json({ success: true, survey: parsed });
  } catch (err: any) {
    console.error('Gemini survey generation error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to generate targeted survey: ' + (err.message || 'Unknown AI error'),
    });
  }
});

// POST /api/ai/analyze-heatmap
app.post('/api/ai/analyze-heatmap', async (req, res) => {
  const { objective, imageDataUrl, notes } = req.body;

  if (!imageDataUrl && !notes) {
    return res.status(400).json({ success: false, error: 'Heatmap screenshot or report text is required' });
  }

  try {
    const parts: any[] = [];

    if (imageDataUrl && imageDataUrl.startsWith('data:image/')) {
      const match = imageDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        parts.push({
          inlineData: {
            mimeType: match[1],
            data: match[2],
          },
        });
      }
    }

    const promptText = `You are a Behavioural UX Analytics specialist.
Analyze this heatmap screenshot / visual interaction report in the context of the research objective: "${objective || 'UX friction analysis'}".
User notes: "${notes || 'No extra notes provided.'}"

RULES:
1. Describe visible click, scroll, or interaction patterns ONLY where supported by the visual evidence.
2. Distinguish visible facts (e.g. "Warm click cluster on upper-right navigation") from hypotheses (e.g. "Users might be searching for login").
3. Do NOT invent click counts, bounce rates, or visitor counts that are not explicitly readable in the image.
4. Highlight limitations of analyzing a single screenshot without session context.

Provide a structured JSON response:
{
  "visiblePatterns": ["3-4 observed visual click / scroll patterns"],
  "potentialFrictionPoints": ["2-3 areas where engagement drops or confusion is evident"],
  "factsVsHypotheses": [
    { "observedFact": "What is visually confirmed", "possibleHypothesis": "What it might indicate" }
  ],
  "usabilityRecommendations": ["2-3 interface improvements to test"],
  "limitations": ["Clear limitations of this screenshot evidence alone"]
}`;

    parts.push({ text: promptText });

    const response = await generateWithGemini({ parts }, {
      responseMimeType: 'application/json',
    });

    const parsed = cleanAndParseJson(response.text || '{}');
    res.json({ success: true, analysis: parsed });
  } catch (err: any) {
    console.error('Heatmap analysis error:', err);
    res.status(500).json({
      success: false,
      error: 'Heatmap analysis failed: ' + (err.message || 'Unknown error'),
    });
  }
});

// POST /api/ai/analyze-transcript
app.post('/api/ai/analyze-transcript', async (req, res) => {
  const { transcriptText, objective, speakerLabels } = req.body;

  if (!transcriptText || !transcriptText.trim()) {
    return res.status(400).json({ success: false, error: 'Transcript text is required' });
  }

  const prompt = `You are an expert Qualitative UX Researcher.
Analyze the following customer interview transcript against the research objective: "${objective || 'Customer feedback analysis'}".

Transcript:
"""
${transcriptText.substring(0, 8000)}
"""

Extract:
1. Core discussion themes with supporting verbatim quotes (preserve speaker tags/timestamps if available).
2. Customer pain points and unmet needs.
3. Feature requests and positive moments.
4. Objections, hesitations, or pricing concerns.
5. Unanswered questions and suggested follow-up questions for future interviews.
6. Do NOT fabricate quotes or invent speakers.

Respond ONLY with valid JSON:
{
  "themes": [
    { "theme": "Theme title", "summary": "Description", "quotes": ["Verbatim quote with speaker tag"] }
  ],
  "painPoints": [
    { "issue": "Problem", "context": "When it arose", "quote": "Verbatim quote" }
  ],
  "expectationsAndGoals": ["Customer expectations"],
  "unansweredQuestions": ["What remained ambiguous in the conversation"],
  "suggestedFollowUps": ["Questions to ask in next interview"]
}`;

  try {
    const response = await generateWithGemini(prompt, {
      responseMimeType: 'application/json',
    });

    const parsed = cleanAndParseJson(response.text || '{}');
    res.json({ success: true, analysis: parsed });
  } catch (err: any) {
    console.error('Transcript analysis error:', err);
    res.status(500).json({
      success: false,
      error: 'Transcript analysis failed: ' + (err.message || 'Unknown error'),
    });
  }
});

// API 404 handler for any unmatched /api/* routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, error: 'API endpoint not found' });
});

// --- FRONTEND INTEGRATION (Vite dev middleware vs static build) ---

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SignalIQ Full-Stack server running on port ${PORT} (NODE_ENV=${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
