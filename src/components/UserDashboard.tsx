import React, { useState } from 'react';
import {
  User as UserIcon, Bookmark as BookmarkIcon, History,
  Upload, Plus, Trash2, ArrowUpRight, CheckCircle2,
  Sparkles, ExternalLink, AlertCircle, X
} from 'lucide-react';
import { User, Project, Category } from '../types';
import { ProjectCard } from './ProjectCard';
import { api } from '../services/api';

interface UserDashboardProps {
  currentUser: User | null;
  savedProjects: Project[];
  recentlyViewedProjects: Project[];
  myUploadedProjects: Project[];
  categories: Category[];
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onToggleBookmark: (id: number) => void;
  onViewDetails: (project: Project) => void;
  onProjectCreated: (newProject: Project) => void;
  onProjectUpdated: (updatedProject: Project) => void;
  onProjectDeleted: (project: Project) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  savedProjects,
  recentlyViewedProjects,
  myUploadedProjects,
  categories,
  onOpenAuth,
  onToggleBookmark,
  onViewDetails,
  onProjectCreated,
  onProjectUpdated,
  onProjectDeleted
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'recent' | 'uploaded'>('saved');
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Upload Form states
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState(categories[0]?.category_name || 'AI & Machine Learning');
  const [techInput, setTechInput] = useState('Python, FastAPI, React');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [projectType, setProjectType] = useState<'Free' | 'Paid'>('Free');
  const [price, setPrice] = useState('0');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80');
  const [githubUrl, setGithubUrl] = useState('');
  const [featuresInput, setFeaturesInput] = useState('RESTful API architecture\nInteractive UI components\nDatabase schema included');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [listingActionId, setListingActionId] = useState<number | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-sm border border-slate-200 text-center">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <UserIcon className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Student & Faculty Dashboard</h2>
        <p className="text-xs text-slate-500 mb-6">
          Please sign in to access your profile, bookmarked academic projects, recently viewed history, and uploaded repository submissions.
        </p>
        <button
          onClick={() => onOpenAuth('login')}
          className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
        >
          Sign In to Access Dashboard
        </button>
      </div>
    );
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDesc || !desc) return;

    setUploadLoading(true);
    try {
      const technologies = techInput.split(',').map(t => t.trim()).filter(Boolean);
      const featureList = featuresInput.split('\n').map(f => f.trim()).filter(Boolean);

      const created = await api.createProject({
        title,
        short_description: shortDesc,
        description: desc,
        category,
        technology: technologies.length ? technologies : ['Python', 'FastAPI'],
        difficulty,
        project_type: projectType,
        price: projectType === 'Free' ? 0 : parseFloat(price) || 1999,
        image: imageUrl || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
        author_id: currentUser.id,
        author_name: currentUser.name,
        github_url: githubUrl,
        features: featureList,
        screenshots: [imageUrl]
      });

      onProjectCreated(created);
      setShowUploadModal(false);
      setActiveTab('uploaded');

      // Reset form
      setTitle('');
      setShortDesc('');
      setDesc('');
      setPrice('0');
      setProjectType('Free');
    } catch (err: any) {
      alert(err.message || 'Error submitting project');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleToggleSale = async (project: Project) => {
    setListingActionId(project.id);
    try {
      const nextType = project.project_type === 'Paid' ? 'Free' : 'Paid';
      const updated = await api.updateProject(project.id, {
        project_type: nextType,
        price: nextType === 'Paid' ? (project.price || 1999) : 0
      });
      onProjectUpdated(updated);
    } catch (err: any) {
      alert(err.message || 'Unable to update this listing');
    } finally {
      setListingActionId(null);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    if (!window.confirm(`Remove "${project.title}" from ProjectHub?`)) return;

    setListingActionId(project.id);
    try {
      await api.deleteProject(project.id);
      onProjectDeleted(project);
    } catch (err: any) {
      alert(err.message || 'Unable to remove this project');
    } finally {
      setListingActionId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Dashboard Header Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl bg-blue-100 object-cover border-2 border-blue-100 shadow-inner"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading">
                  {currentUser.name}
                </h1>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-blue-100 text-blue-700">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.department || 'Computer Science & Engineering'} • {currentUser.institution || 'Engineering University'}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">{currentUser.email}</p>
            </div>
          </div>

          <button
            id="dashboard-upload-project-btn"
            onClick={() => setShowUploadModal(true)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2 transition-colors self-stretch sm:self-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            <span>Submit Academic Project</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-100 mt-6 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'saved'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookmarkIcon className="w-4 h-4" />
            <span>Saved Projects ({savedProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('uploaded')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'uploaded'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>My Uploaded Projects ({myUploadedProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('recent')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'recent'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Recently Viewed ({recentlyViewedProjects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            <span>My Profile</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {/* 1. Saved Projects */}
      {activeTab === 'saved' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Saved Bookmarks</h3>
            <span className="text-xs text-slate-500">Quickly revisit and track projects for your coursework</span>
          </div>

          {savedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isBookmarked={true}
                  onToggleBookmark={onToggleBookmark}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <BookmarkIcon className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Saved Projects Yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                Explore the project repository or marketplace and bookmark projects to access them anytime.
              </p>
            </div>
          )}
        </div>
      )}

      {/* 2. My Uploaded Projects */}
      {activeTab === 'uploaded' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">My Uploaded Projects</h3>
              <p className="text-xs text-slate-500">Academic projects you contributed to ProjectHub</p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Submission</span>
            </button>
          </div>

          {myUploadedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myUploadedProjects.map((project) => (
                <div key={project.id} className="space-y-2">
                  <ProjectCard
                    project={project}
                    isBookmarked={savedProjects.some(p => p.id === project.id)}
                    onToggleBookmark={onToggleBookmark}
                    onViewDetails={onViewDetails}
                  />
                  <div className="flex items-center justify-between gap-2 px-1">
                    <span className={`text-[11px] font-semibold ${project.project_type === 'Paid' ? 'text-blue-700' : 'text-emerald-700'}`}>
                      {project.project_type === 'Paid' ? `For sale at ₹${project.price.toLocaleString()}` : 'Free listing'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggleSale(project)}
                        disabled={listingActionId === project.id}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-[11px] font-semibold disabled:opacity-50"
                      >
                        {listingActionId === project.id ? 'Saving...' : project.project_type === 'Paid' ? 'Make Free' : 'Sell Project'}
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project)}
                        disabled={listingActionId === project.id}
                        title="Remove project"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Projects Uploaded Yet</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-4">
                Share your semester project, capstone research, or open-source software with other students.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors"
              >
                Upload Your First Project
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Recently Viewed */}
      {activeTab === 'recent' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900">Recently Viewed</h3>
            <span className="text-xs text-slate-500">Projects you explored in this browser session</span>
          </div>

          {recentlyViewedProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentlyViewedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isBookmarked={savedProjects.some(p => p.id === project.id)}
                  onToggleBookmark={onToggleBookmark}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <History className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No Browsing History</p>
              <p className="text-xs text-slate-400 mt-1">Open projects to view details and they will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* 4. My Profile */}
      {activeTab === 'profile' && (
        <div className="max-w-2xl bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Academic Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Full Name</label>
              <p className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-100">
                {currentUser.name}
              </p>
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Email Address</label>
              <p className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-100">
                {currentUser.email}
              </p>
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Department / Branch</label>
              <p className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-100">
                {currentUser.department || 'Computer Science & Engineering'}
              </p>
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">College / University</label>
              <p className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-100">
                {currentUser.institution || 'State Technical University'}
              </p>
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Role</label>
              <p className="p-3 bg-slate-50 rounded-xl font-bold text-blue-700 capitalize border border-slate-100">
                {currentUser.role}
              </p>
            </div>
            <div>
              <label className="block font-semibold text-slate-400 mb-1">Registered Since</label>
              <p className="p-3 bg-slate-50 rounded-xl font-bold text-slate-800 border border-slate-100">
                {currentUser.created_at || 'Academic Session 2025'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Academic Project Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 my-auto text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowUploadModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 font-heading">Submit Academic Project</h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload your semester, capstone, or research project for academic discovery and peer learning.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Sensor Telemetry & MQTT Dashboard"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description (1-2 sentences) *</label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Brief abstract displayed on cards"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Comprehensive Description & Methodology *</label>
                <textarea
                  rows={3}
                  required
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Detailed project summary, problem statement, and algorithmic design..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Academic Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.category_name}>{c.category_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:border-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Marketplace Type</label>
                  <select
                    value={projectType}
                    onChange={(e) => {
                      const val = e.target.value as any;
                      setProjectType(val);
                      if (val === 'Free') setPrice('0');
                      else if (price === '0') setPrice('1999');
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:border-blue-500"
                  >
                    <option value="Free">Free Open Source</option>
                    <option value="Paid">Paid Project (Marketplace)</option>
                  </select>
                </div>

                {projectType === 'Paid' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Display Price (₹)</label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="1999"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technologies Used (comma separated)</label>
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Python, FastAPI, MySQL, React"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image Thumbnail URL</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">GitHub / Source Repository URL</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Key Features Highlight (1 per line)</label>
                <textarea
                  rows={2}
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-md"
                >
                  {uploadLoading ? 'Publishing...' : 'Publish Academic Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
