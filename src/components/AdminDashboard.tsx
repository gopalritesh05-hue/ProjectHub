import React, { useState } from 'react';
import {
  Shield, Users, FolderKanban, Layers, Sparkles, Check,
  Plus, Edit2, Trash2, Search, ArrowUpRight, AlertCircle, X,
  FileCode2, CheckCircle2
} from 'lucide-react';
import { User, Project, Category, DashboardStats } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  currentUser: User | null;
  projects: Project[];
  categories: Category[];
  users: User[];
  stats: DashboardStats;
  onRefreshData: () => Promise<void>;
  onOpenAuth: (mode?: 'login' | 'register') => void;
  onViewDetails: (project: Project) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  projects,
  categories,
  users,
  stats,
  onRefreshData,
  onOpenAuth,
  onViewDetails
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'projects' | 'categories' | 'users'>('overview');

  // Project Edit/Add Modal States
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isAddingProject, setIsAddingProject] = useState(false);
  const [projectFormData, setProjectFormData] = useState<Partial<Project>>({
    title: '',
    short_description: '',
    description: '',
    category: categories[0]?.category_name || 'AI & Machine Learning',
    difficulty: 'Intermediate',
    project_type: 'Free',
    price: 0,
    technology: ['Python', 'FastAPI'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
    featured: false,
    trending: false
  });

  // Category Add Modal
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  // Search queries for admin tables
  const [projectSearch, setProjectSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl shadow-sm border border-slate-200 text-center">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Administrator Access Required</h2>
        <p className="text-xs text-slate-500 mb-6">
          You must be authenticated as an Administrator to manage projects, set prices, edit categories, and supervise users.
        </p>
        <button
          onClick={() => onOpenAuth('login')}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-md transition-colors"
        >
          Sign In as Administrator (Demo: admin@projecthub.edu)
        </button>
      </div>
    );
  }

  // Handle Project Save (Create or Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await api.updateProject(editingProject.id, projectFormData);
        showToast('Project updated successfully!');
      } else {
        await api.createProject({
          title: projectFormData.title || 'Untitled Project',
          short_description: projectFormData.short_description || '',
          description: projectFormData.description || '',
          category: projectFormData.category || categories[0].category_name,
          difficulty: projectFormData.difficulty || 'Intermediate',
          project_type: projectFormData.project_type || 'Free',
          price: projectFormData.project_type === 'Free' ? 0 : Number(projectFormData.price) || 1999,
          technology: projectFormData.technology || ['Python'],
          image: projectFormData.image || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
          featured: projectFormData.featured || false,
          trending: projectFormData.trending || false,
          author_id: currentUser.id,
          author_name: currentUser.name
        });
        showToast('New project created and published!');
      }

      await onRefreshData();
      setIsAddingProject(false);
      setEditingProject(null);
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    }
  };

  // Handle Delete Project
  const handleDeleteProject = async (id: number, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await api.deleteProject(id);
      await onRefreshData();
      showToast('Project deleted successfully.');
    } catch (err: any) {
      alert(err.message || 'Error deleting project');
    }
  };

  // Handle Add Category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.createCategory({
        category_name: newCatName.trim(),
        description: newCatDesc.trim(),
        icon: 'Folder'
      });
      await onRefreshData();
      setShowAddCategory(false);
      setNewCatName('');
      setNewCatDesc('');
      showToast('Category created successfully!');
    } catch (err: any) {
      alert(err.message || 'Error creating category');
    }
  };

  // Handle Delete Category
  const handleDeleteCategory = async (id: number, name: string) => {
    if (!window.confirm(`Delete category "${name}"? Only empty categories can be deleted.`)) return;
    try {
      await api.deleteCategory(id);
      await onRefreshData();
      showToast('Category deleted.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  // Handle Role Change
  const handleRoleChange = async (userId: number, role: 'student' | 'faculty' | 'admin') => {
    try {
      await api.updateUserRole(userId, role);
      await onRefreshData();
      showToast(`User role updated to ${role}`);
    } catch (err: any) {
      alert(err.message || 'Failed to update role');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId: number, name: string) => {
    if (userId === currentUser.id) {
      alert('Cannot delete your own active administrator account.');
      return;
    }
    if (!window.confirm(`Are you sure you want to remove user "${name}"?`)) return;
    try {
      await api.deleteUser(userId);
      await onRefreshData();
      showToast('User removed.');
    } catch (err: any) {
      alert(err.message || 'Failed to remove user');
    }
  };

  const filteredProjects = projects.filter(p =>
    p.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 text-xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-2 border border-indigo-500/30">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span>ProjectHub Administration Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading">
              Administrative Command Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Supervise academic projects, manage categories, curate marketplace pricing, and audit user permissions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setEditingProject(null);
                setProjectFormData({
                  title: '',
                  short_description: '',
                  description: '',
                  category: categories[0]?.category_name || 'AI & Machine Learning',
                  difficulty: 'Intermediate',
                  project_type: 'Free',
                  price: 0,
                  technology: ['Python', 'FastAPI'],
                  image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
                  featured: false,
                  trending: false
                });
                setIsAddingProject(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-600/30 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-slate-800 mt-6 pt-4 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeAdminTab === 'overview'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Overview & KPIs</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('projects')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeAdminTab === 'projects'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileCode2 className="w-4 h-4" />
            <span>Manage Projects ({projects.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('categories')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeAdminTab === 'categories'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Manage Categories ({categories.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${
              activeAdminTab === 'users'
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Manage Users ({users.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards: Total Users, Total Projects, Free Projects, Paid Projects, Categories */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Users</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">{stats.total_users}</div>
          <p className="text-[10px] text-slate-400 mt-1">Students & Faculty</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Projects</span>
            <FileCode2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">{stats.total_projects}</div>
          <p className="text-[10px] text-slate-400 mt-1">Curated Repositories</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Free Projects</span>
            <Check className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 font-heading">{stats.free_projects}</div>
          <p className="text-[10px] text-slate-400 mt-1">Open Source / ₹0</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Paid Projects</span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-blue-600 font-heading">{stats.paid_projects}</div>
          <p className="text-[10px] text-slate-400 mt-1">Marketplace Tier</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Categories</span>
            <FolderKanban className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-heading">{stats.categories_count}</div>
          <p className="text-[10px] text-slate-400 mt-1">Academic Tracks</p>
        </div>
      </div>

      {/* 1. Overview Tab */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Quick Administrative Tools</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setEditingProject(null);
                    setIsAddingProject(true);
                  }}
                  className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 hover:bg-blue-100/70 text-left transition-colors"
                >
                  <Plus className="w-5 h-5 text-blue-600 mb-2" />
                  <p className="text-xs font-bold text-slate-900">Add New Project</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Upload image, set price & tech tags</p>
                </button>

                <button
                  onClick={() => {
                    setActiveAdminTab('categories');
                    setShowAddCategory(true);
                  }}
                  className="p-4 rounded-2xl border border-teal-200 bg-teal-50/50 hover:bg-teal-100/70 text-left transition-colors"
                >
                  <FolderKanban className="w-5 h-5 text-teal-600 mb-2" />
                  <p className="text-xs font-bold text-slate-900">Create Category</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Expand platform academic domains</p>
                </button>

                <button
                  onClick={() => setActiveAdminTab('projects')}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                >
                  <Edit2 className="w-5 h-5 text-slate-700 mb-2" />
                  <p className="text-xs font-bold text-slate-900">Manage Pricing</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Toggle Free/Paid and price tags</p>
                </button>

                <button
                  onClick={() => setActiveAdminTab('users')}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left transition-colors"
                >
                  <Users className="w-5 h-5 text-slate-700 mb-2" />
                  <p className="text-xs font-bold text-slate-900">Review User Roles</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Assign student / faculty / admin</p>
                </button>
              </div>
            </div>

            {/* Scope Compliance & System Policy Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Project Marketplace Policy
              </h3>
              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <p className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                  <strong>Strict Non-Ecommerce Mode:</strong> In this version of ProjectHub, online payment gateways (Stripe, Razorpay, UPI) are strictly disabled. Projects marked as "Paid" display transparent price tags (e.g. ₹1999) with inquiry hooks directing students to contact administrators directly.
                </p>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                  <p className="font-semibold mb-1">Architecture Summary:</p>
                  <p>• Backend: Python (FastAPI) REST endpoints with JWT</p>
                  <p>• Database: MySQL 8.0+ Relational Schema (users, projects, categories, bookmarks)</p>
                  <p>• Frontend: React + Tailwind CSS with Glassmorphism</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Projects Management Tab */}
      {activeAdminTab === 'projects' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Search projects to edit, price, or delete..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={() => {
                setEditingProject(null);
                setProjectFormData({
                  title: '',
                  short_description: '',
                  description: '',
                  category: categories[0]?.category_name || 'AI & Machine Learning',
                  difficulty: 'Intermediate',
                  project_type: 'Free',
                  price: 0,
                  technology: ['Python', 'FastAPI'],
                  image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1000&q=80',
                  featured: false,
                  trending: false
                });
                setIsAddingProject(true);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4">Type & Price</th>
                  <th className="py-3 px-4">Views</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover bg-slate-100 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900 max-w-xs truncate">{p.title}</p>
                          <p className="text-[11px] text-slate-400">{p.technology.slice(0, 3).join(', ')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 font-medium text-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold">{p.difficulty}</span>
                    </td>
                    <td className="py-3 px-4">
                      {p.project_type === 'Free' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px]">
                          Free (₹0)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px]">
                          ₹{p.price.toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {p.views_count || 0}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onViewDetails(p)}
                          title="Preview project"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                        >
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingProject(p);
                            setProjectFormData({ ...p });
                            setIsAddingProject(true);
                          }}
                          title="Edit project & price"
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id, p.title)}
                          title="Delete project"
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Categories Management Tab */}
      {activeAdminTab === 'categories' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Manage Categories</h3>
              <p className="text-xs text-slate-500">Organize project domains and classification taxonomy</p>
            </div>
            <button
              onClick={() => setShowAddCategory(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => (
              <div key={cat.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 text-sm">{cat.category_name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                      {cat.project_count || 0} projects
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{cat.description || 'No description'}</p>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end">
                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.category_name)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Users Management Tab */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-slate-900">Registered Users</h3>
              <p className="text-xs text-slate-500">Manage user accounts, privileges, and student roles</p>
            </div>

            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.name}`}
                          alt={u.name}
                          className="w-7 h-7 rounded-full bg-slate-100 object-cover"
                        />
                        <span className="font-bold text-slate-900">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{u.email}</td>
                    <td className="py-3 px-4 text-slate-500">{u.department || 'General Academic'}</td>
                    <td className="py-3 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value as any)}
                        disabled={u.id === currentUser.id}
                        className="px-2 py-1 rounded border border-slate-200 text-xs font-semibold bg-white"
                      >
                        <option value="student">student</option>
                        <option value="faculty">faculty</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {u.id !== currentUser.id && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 rounded text-red-500 hover:bg-red-50"
                          title="Remove user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Project Modal */}
      {isAddingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-8 my-auto text-left max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsAddingProject(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-slate-900 font-heading mb-1">
              {editingProject ? 'Edit Academic Project' : 'Add New Academic Project'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Configure project details, assign categories, manage source code metadata, and set marketplace pricing.
            </p>

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={projectFormData.title || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, title: e.target.value })}
                  placeholder="e.g. AI-Powered Medical Diagnostic Suite"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Short Description *</label>
                <input
                  type="text"
                  required
                  value={projectFormData.short_description || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, short_description: e.target.value })}
                  placeholder="Card summary (1-2 sentences)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Description *</label>
                <textarea
                  rows={3}
                  required
                  value={projectFormData.description || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, description: e.target.value })}
                  placeholder="Abstract, problem statement, methodology, and results..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={projectFormData.category || categories[0]?.category_name}
                    onChange={(e) => setProjectFormData({ ...projectFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:border-blue-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.category_name}>{c.category_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                  <select
                    value={projectFormData.difficulty || 'Intermediate'}
                    onChange={(e) => setProjectFormData({ ...projectFormData, difficulty: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:border-blue-500"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Free vs Paid Toggle & Price Input */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Project Marketplace Status</label>
                    <select
                      value={projectFormData.project_type || 'Free'}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setProjectFormData({
                          ...projectFormData,
                          project_type: val,
                          price: val === 'Free' ? 0 : (projectFormData.price && projectFormData.price > 0 ? projectFormData.price : 1999)
                        });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white outline-none focus:border-blue-500 font-semibold"
                    >
                      <option value="Free">Free (Open Source Repository)</option>
                      <option value="Paid">Paid (Marketplace Tier)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Project Price (₹)</label>
                    <input
                      type="number"
                      disabled={projectFormData.project_type === 'Free'}
                      value={projectFormData.project_type === 'Free' ? 0 : projectFormData.price || 0}
                      onChange={(e) => setProjectFormData({ ...projectFormData, price: parseFloat(e.target.value) || 0 })}
                      placeholder="1999"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500 disabled:bg-slate-100 font-semibold text-blue-600"
                    />
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {projectFormData.project_type === 'Free' ? 'Free projects always cost ₹0.' : 'Displays "₹Price" on cards and detail view.'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={projectFormData.image || ''}
                  onChange={(e) => setProjectFormData({ ...projectFormData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Technologies (comma-separated)</label>
                <input
                  type="text"
                  value={Array.isArray(projectFormData.technology) ? projectFormData.technology.join(', ') : ''}
                  onChange={(e) => setProjectFormData({
                    ...projectFormData,
                    technology: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                  })}
                  placeholder="Python, FastAPI, OpenCV, PyTorch"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingProject(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md"
                >
                  {editingProject ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 text-left">
            <button
              onClick={() => setShowAddCategory(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold text-slate-900 font-heading mb-1">Add Academic Category</h3>
            <p className="text-xs text-slate-500 mb-4">Create a new domain for academic project discovery.</p>

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Cloud & DevOps"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Brief description of the academic domain..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCategory(false)}
                  className="px-3 py-1.5 text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
