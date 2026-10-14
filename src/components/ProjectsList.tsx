import React, { useState } from 'react';
import { Project } from '../types';
import {
  Search,
  Filter,
  Plus,
  ArrowRight,
  FolderKanban,
  Trash2,
  Edit2,
  FileSpreadsheet,
  AlertCircle,
  ShieldCheck,
  HelpCircle,
  ShieldAlert,
} from 'lucide-react';

interface ProjectsListProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onNewProject: () => void;
  onDeleteProject: (projectId: string) => Promise<void>;
  onRenameProject: (projectId: string, newName: string) => Promise<void>;
}

export const ProjectsList: React.FC<ProjectsListProps> = ({
  projects,
  onOpenProject,
  onNewProject,
  onDeleteProject,
  onRenameProject,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [projectToRename, setProjectToRename] = useState<Project | null>(null);
  const [renameInput, setRenameInput] = useState('');

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.objective.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.productName && p.productName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    await onDeleteProject(projectToDelete.id);
    setProjectToDelete(null);
  };

  const handleConfirmRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectToRename || !renameInput.trim()) return;
    await onRenameProject(projectToRename.id, renameInput.trim());
    setProjectToRename(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Research Projects</h1>
          <p className="text-xs text-slate-500">
            Manage your customer feedback investigations, evidence datasets, and reports.
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Research Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by name, objective, or product..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-100"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="all">All Categories</option>
            <option value="onboarding">Onboarding</option>
            <option value="retention">Retention</option>
            <option value="conversion">Conversion</option>
            <option value="customer satisfaction">Satisfaction (CSAT)</option>
            <option value="pricing">Pricing</option>
            <option value="feature adoption">Feature Adoption</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full md:w-auto text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="brief_ready">Brief Ready</option>
            <option value="data_uploaded">Data Uploaded</option>
            <option value="analyzed">Analysed</option>
            <option value="survey_created">Survey Created</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const outcome = project.analysis?.sufficiencyAssessment?.outcome;
            const validRecs = project.analysis?.validRecords ||
              project.sources?.reduce((acc, s) => acc + (s.recordCount || 0), 0) || 0;

            return (
              <div
                key={project.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-slate-100 text-slate-600 rounded-sm">
                      {project.category}
                    </span>

                    {outcome ? (
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-sm flex items-center space-x-1 ${
                          outcome === 'A_SUFFICIENT'
                            ? 'bg-emerald-100 text-emerald-800'
                            : outcome === 'B_PARTIALLY_SUFFICIENT'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {outcome === 'A_SUFFICIENT' ? (
                          <ShieldCheck className="w-3 h-3" />
                        ) : outcome === 'B_PARTIALLY_SUFFICIENT' ? (
                          <HelpCircle className="w-3 h-3" />
                        ) : (
                          <ShieldAlert className="w-3 h-3" />
                        )}
                        <span>{outcome === 'A_SUFFICIENT' ? 'Sufficient' : outcome === 'B_PARTIALLY_SUFFICIENT' ? 'Partial' : 'Insufficient'}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Analysis Pending</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      "{project.objective}"
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                    <div>
                      <span className="text-slate-400">Sources: </span>
                      <strong className="text-slate-700">{project.sources?.length || 0} files</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Records: </span>
                      <strong className="text-slate-700">{validRecs}</strong>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        setProjectToRename(project);
                        setRenameInput(project.name);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 rounded-md hover:bg-slate-100 cursor-pointer"
                      title="Rename Project"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setProjectToDelete(project)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer"
                      title="Delete Project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onOpenProject(project)}
                    className="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    <span>Open Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
          <FolderKanban className="w-8 h-8 mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-semibold text-slate-700">No projects found</p>
          <p className="text-xs text-slate-400 mt-1">
            {searchTerm ? 'Try adjusting your search or category filters.' : 'Create your first project to begin.'}
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal (AC-12.5) */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center space-x-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Project?</h3>
                <p className="text-xs text-slate-500">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-900">"{projectToDelete.name}"</strong>?
              All associated evidence sources, analysis findings, and surveys will be permanently removed.
            </p>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                onClick={() => setProjectToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {projectToRename && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmRename}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <h3 className="text-base font-bold text-slate-900">Rename Project</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project Name</label>
              <input
                type="text"
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:border-indigo-500"
                required
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setProjectToRename(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg cursor-pointer"
              >
                Save Name
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
