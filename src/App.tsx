import React, { useState, useEffect } from 'react';
import { Project, Survey } from './types';
import { api } from './lib/api';
import { parseCsvString } from './lib/csvParser';
import { SampleDataset } from './lib/sampleData';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { ProjectsList } from './components/ProjectsList';
import { ResearchWorkspace } from './components/ResearchWorkspace';
import { SurveysView } from './components/SurveysView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { NewProjectModal } from './components/NewProjectModal';
import { PublicSurveyView } from './components/PublicSurveyView';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<
    'dashboard' | 'projects' | 'workspace' | 'surveys' | 'reports' | 'settings'
  >('dashboard');

  const [projects, setProjects] = useState<Project[]>([]);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalProjects: 0,
    completedProjects: 0,
    totalSurveys: 0,
    totalResponses: 0,
    totalFeedbackRecords: 0,
  });

  // Direct Survey Link detection (e.g. #survey-srv_...)
  const [directRespondentSurvey, setDirectRespondentSurvey] = useState<Survey | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const [fetchedProjects, fetchedSurveys, fetchedStats] = await Promise.all([
        api.getProjects(),
        api.getSurveys(),
        api.getStats(),
      ]);
      setProjects(fetchedProjects);
      setSurveys(fetchedSurveys);
      setStats(fetchedStats);

      // Check URL hash for direct survey link
      const hash = window.location.hash;
      if (hash && hash.startsWith('#survey-')) {
        const surveyId = hash.replace('#survey-', '');
        const target = fetchedSurveys.find((s) => s.id === surveyId);
        if (target) {
          setDirectRespondentSurvey(target);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'Failed to connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for hash changes
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash && hash.startsWith('#survey-')) {
        const surveyId = hash.replace('#survey-', '');
        const target = surveys.find((s) => s.id === surveyId);
        if (target) setDirectRespondentSurvey(target);
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleCreateProject = async (projectData: Partial<Project>) => {
    const newProj = await api.saveProject(projectData);
    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
    setCurrentView('workspace');
    loadData();
  };

  const handleUpdateProject = async (updates: Partial<Project>) => {
    if (!activeProject) return;
    const updated = await api.updateProject(activeProject.id, updates);
    setActiveProject(updated);
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    loadData();
  };

  const handleDeleteProject = async (projectId: string) => {
    await api.deleteProject(projectId);
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (activeProject?.id === projectId) {
      setActiveProject(null);
      setCurrentView('projects');
    }
    loadData();
  };

  const handleRenameProject = async (projectId: string, newName: string) => {
    const updated = await api.updateProject(projectId, { name: newName });
    setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)));
    if (activeProject?.id === projectId) {
      setActiveProject(updated);
    }
  };

  const handleOpenProject = (project: Project) => {
    setActiveProject(project);
    setCurrentView('workspace');
  };

  const handleOpenReport = (project: Project) => {
    setActiveProject(project);
    setCurrentView('workspace');
  };

  // Launch a synthetic scenario directly into a project
  const handleLaunchScenario = async (scenario: SampleDataset) => {
    const sources: any[] = [];

    if (scenario.fileType === 'csv' && scenario.csvContent) {
      const parsed = parseCsvString(scenario.csvContent, scenario.fileName);
      sources.push({
        id: `src_${Date.now()}`,
        fileName: scenario.fileName,
        fileType: 'csv',
        uploadedAt: new Date().toISOString(),
        fileSize: scenario.csvContent.length,
        recordCount: parsed.recordCount || 0,
        excludedCount: parsed.excludedCount || 0,
        exclusionNotes: parsed.exclusionNotes,
        detectedColumns: parsed.detectedColumns || [],
        columnMappings: scenario.columnMappings || parsed.columnMappings,
        previewRows: parsed.previewRows,
        status: 'ready',
      });
    } else if (scenario.fileType === 'transcript' && scenario.transcriptContent) {
      sources.push({
        id: `src_trans_${Date.now()}`,
        fileName: scenario.fileName,
        fileType: 'transcript',
        uploadedAt: new Date().toISOString(),
        fileSize: scenario.transcriptContent.length,
        recordCount: 1,
        excludedCount: 0,
        extractedContent: scenario.transcriptContent,
        previewRows: [{ section: 'Interview Transcript', text: scenario.transcriptContent.substring(0, 400) }],
        status: 'ready',
      });
    }

    const created = await api.saveProject({
      name: scenario.projectName,
      objective: scenario.objective,
      productName: scenario.productName,
      customerSegment: scenario.customerSegment,
      category: scenario.category,
      sources,
      status: 'data_uploaded',
    });

    setProjects((prev) => [created, ...prev]);
    setActiveProject(created);
    setCurrentView('workspace');
    loadData();
  };

  if (isLoading && projects.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center animate-pulse mb-3 shadow-lg shadow-indigo-100">
          <RefreshCw className="w-6 h-6 animate-spin" />
        </div>
        <p className="text-sm font-bold text-slate-800">Initializing SignalIQ Platform...</p>
        <p className="text-xs text-slate-400 mt-1">Connecting to server intelligence service</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          if (view === 'workspace' && !activeProject && projects.length > 0) {
            setActiveProject(projects[0]);
          }
          setCurrentView(view);
        }}
        onNewProject={() => setIsNewProjectModalOpen(true)}
        activeProjectName={activeProject?.name}
        hasActiveProject={Boolean(activeProject)}
      />

      {/* Global Error Banner if any */}
      {errorMessage && (
        <div className="bg-rose-600 text-white text-xs py-2 px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-white hover:underline text-[11px] font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Views */}
      <div className="flex-1">
        {currentView === 'dashboard' && (
          <Dashboard
            projects={projects}
            stats={stats}
            onNewProject={() => setIsNewProjectModalOpen(true)}
            onOpenProject={handleOpenProject}
            onLoadScenario={handleLaunchScenario}
          />
        )}

        {currentView === 'projects' && (
          <ProjectsList
            projects={projects}
            onOpenProject={handleOpenProject}
            onNewProject={() => setIsNewProjectModalOpen(true)}
            onDeleteProject={handleDeleteProject}
            onRenameProject={handleRenameProject}
          />
        )}

        {currentView === 'workspace' && activeProject && (
          <ResearchWorkspace
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onBackToProjects={() => setCurrentView('projects')}
          />
        )}

        {currentView === 'surveys' && (
          <SurveysView
            surveys={surveys}
            projects={projects}
            onOpenProjectWorkspace={handleOpenProject}
            onRefreshSurveys={loadData}
          />
        )}

        {currentView === 'reports' && (
          <ReportsView
            projects={projects}
            onOpenReport={handleOpenReport}
          />
        )}

        {currentView === 'settings' && <SettingsView />}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            SignalIQ &copy; {new Date().getFullYear()} &mdash; Customer Feedback Intelligence Platform.
          </p>
          <div className="flex items-center space-x-4 text-slate-500">
            <span>Server Gemini 3.8-Flash</span>
            <span>&bull;</span>
            <span>Persistent File Storage</span>
            <span>&bull;</span>
            <span>Strict Evidence Attribution</span>
          </div>
        </div>
      </footer>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreate={handleCreateProject}
      />

      {/* Direct Respondent Flow when navigating via shareable survey URL */}
      {directRespondentSurvey && (
        <PublicSurveyView
          survey={directRespondentSurvey}
          onClose={() => {
            setDirectRespondentSurvey(null);
            window.location.hash = '';
          }}
          onResponseSubmitted={() => {
            loadData();
          }}
        />
      )}
    </div>
  );
}
