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

  async submitSurveyResponse(surveyId: string, answers: Record<string, any>): Promise<string> {
    const res = await fetch(`/api/surveys/${surveyId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
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
};
