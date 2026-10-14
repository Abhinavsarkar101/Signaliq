import { Project, Survey, SurveyResponse, ResearchBrief, AnalysisResult } from '../types';

export const api = {
  async getProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects');
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch projects');
    return data.projects;
  },

  async getProject(id: string): Promise<{ project: Project; surveys: Survey[] }> {
    const res = await fetch(`/api/projects/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch project');
    return { project: data.project, surveys: data.surveys };
  },

  async saveProject(project: Partial<Project>): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to save project');
    return data.project;
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update project');
    return data.project;
  },

  async deleteProject(id: string): Promise<void> {
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to delete project');
  },

  async getStats(): Promise<{
    totalProjects: number;
    completedProjects: number;
    totalSurveys: number;
    totalResponses: number;
    totalFeedbackRecords: number;
  }> {
    const res = await fetch('/api/stats');
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch stats');
    return data.stats;
  },

  async getResponses(params?: { surveyId?: string; projectId?: string }): Promise<any[]> {
    const query = new URLSearchParams();
    if (params?.surveyId) query.set('surveyId', params.surveyId);
    if (params?.projectId) query.set('projectId', params.projectId);
    const url = `/api/responses${query.toString() ? '?' + query.toString() : ''}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch survey responses');
    return data.responses;
  },

  async getFeedbackRecords(): Promise<{
    records: any[];
    sources: any[];
    totalRecords: number;
    totalExcluded: number;
  }> {
    const res = await fetch('/api/feedback-records');
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch feedback records');
    return {
      records: data.records,
      sources: data.sources,
      totalRecords: data.totalRecords,
      totalExcluded: data.totalExcluded,
    };
  },
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
    const res = await fetch('/api/ai/suggest-objective', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to suggest objective');
    return data.suggestion;
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
    const res = await fetch('/api/ai/research-brief', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to generate brief');
    return data.brief;
  },

  async analyzeFeedback(params: {
    brief?: ResearchBrief;
    objective: string;
    sources: any[];
  }): Promise<AnalysisResult> {
    const res = await fetch('/api/ai/analyze-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to analyze feedback');
    return data.analysis;
  },

  async generateSurvey(params: {
    brief?: ResearchBrief;
    objective: string;
    sufficiencyAssessment: any;
    targetSegment?: string;
    desiredOutcome?: string;
  }): Promise<Partial<Survey>> {
    const res = await fetch('/api/ai/generate-survey', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to generate survey');
    return data.survey;
  },

  async analyzeHeatmap(params: {
    objective: string;
    imageDataUrl?: string;
    notes?: string;
  }): Promise<any> {
    const res = await fetch('/api/ai/analyze-heatmap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to analyze heatmap');
    return data.analysis;
  },

  async analyzeTranscript(params: {
    transcriptText: string;
    objective: string;
  }): Promise<any> {
    const res = await fetch('/api/ai/analyze-transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to analyze transcript');
    return data.analysis;
  },

  async getSurveys(): Promise<Survey[]> {
    const res = await fetch('/api/surveys');
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch surveys');
    return data.surveys;
  },

  async getSurvey(id: string): Promise<{ survey: Survey; projectName: string }> {
    const res = await fetch(`/api/surveys/${id}`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch survey');
    return { survey: data.survey, projectName: data.projectName };
  },

  async saveSurvey(surveyData: any): Promise<Survey> {
    const res = await fetch('/api/surveys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to save survey');
    return data.survey;
  },

  async updateSurveyStatus(id: string, status: string): Promise<Survey> {
    const res = await fetch(`/api/surveys/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update survey status');
    return data.survey;
  },

  async submitSurveyResponse(
    surveyId: string,
    answers: Record<string, any>,
    campaignId?: string
  ): Promise<string> {
    const res = await fetch(`/api/surveys/${surveyId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers, campaignId }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to submit survey');
    return data.responseId;
  },

  async getSurveyResponses(surveyId: string): Promise<SurveyResponse[]> {
    const res = await fetch(`/api/surveys/${surveyId}/responses`);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch responses');
    return data.responses;
  },

  // --- Email Distribution & Google Apps Script API ---
  async getEmailConfig(): Promise<{ config: any; optOuts: string[] }> {
    const res = await fetch('/api/email/config');
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch email config');
    return { config: data.config, optOuts: data.optOuts };
  },

  async saveEmailConfig(config: { appsScriptUrl?: string; senderName?: string }): Promise<any> {
    const res = await fetch('/api/email/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to save email config');
    return data.config;
  },

  async getEmailQuota(): Promise<{
    isConfigured: boolean;
    remainingQuota: number | null;
    account?: string;
    message?: string;
    error?: string;
  }> {
    const res = await fetch('/api/email/quota');
    const data = await res.json();
    return data;
  },

  async validateEmailRecipients(params: {
    rawRecipients: Array<string | { email: string; name?: string }>;
    surveyId: string;
  }): Promise<{
    summary: any;
    recipients: any[];
    previouslyEmailedWarning: boolean;
  }> {
    const res = await fetch('/api/email/validate-recipients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to validate recipients');
    return data;
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
  }): Promise<{ campaign: any; message?: string }> {
    const res = await fetch('/api/email/send-campaign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to launch email campaign');
    return data;
  },

  async getEmailCampaigns(surveyId?: string): Promise<any[]> {
    const url = surveyId ? `/api/email/campaigns?surveyId=${surveyId}` : '/api/email/campaigns';
    const res = await fetch(url);
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch campaigns');
    return data.campaigns;
  },

  async getOptOuts(): Promise<string[]> {
    const res = await fetch('/api/email/opt-outs');
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to fetch opt-outs');
    return data.optOuts;
  },

  async updateOptOut(email: string, action: 'add' | 'remove'): Promise<string[]> {
    const res = await fetch('/api/email/opt-outs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, action }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Failed to update opt-out');
    return data.optOuts;
  },
};

