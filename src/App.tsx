import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { BrowseProjects } from './components/BrowseProjects';
import { CategoriesView } from './components/CategoriesView';
import { UserDashboard } from './components/UserDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { BackendDocsModal } from './components/BackendDocsModal';
import { Footer } from './components/Footer';
import { api } from './services/api';
import { Project, Category, User, ProjectFilter, DashboardStats } from './types';
import {
  Sparkles, ArrowRight, TrendingUp, Star, Layers,
  CheckCircle2, AlertCircle, RefreshCw, Code2, Database
} from 'lucide-react';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'marketplace' | 'categories' | 'dashboard' | 'admin'>('home');
  const [searchQuery, setSearchQuery] = useState('');

  // Core Data States
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_users: 0,
    total_projects: 0,
    free_projects: 0,
    paid_projects: 0,
    categories_count: 0
  });
  const [loading, setLoading] = useState(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Bookmarks & History States
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>([]);

  // Modals
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDocsOpen, setIsDocsOpen] = useState(false);

  // Filters State for Browse / Search
  const [filters, setFilters] = useState<ProjectFilter>({
    search: '',
    category: 'All',
    technology: 'All',
    difficulty: 'All',
    project_type: 'All',
    sort_by: 'latest'
  });

  // Initial Data Fetching
  const refreshAllData = async () => {
    try {
      const [fetchedProjects, fetchedCategories, fetchedStats, fetchedUsers] = await Promise.all([
        api.getProjects(),
        api.getCategories(),
        api.getDashboardStats(),
        api.getUsers()
      ]);

      setProjects(fetchedProjects);
      setCategories(fetchedCategories);
      setStats(fetchedStats);
      setUsers(fetchedUsers);

      const user = await api.getCurrentUser();
      setCurrentUser(user);

      if (user) {
        const bookmarks = await api.getUserBookmarks(user.id);
        setBookmarkedIds(new Set(bookmarks.map(p => p.id)));
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Sync user bookmarks when user logs in or changes
  const handleAuthSuccess = async (user: User) => {
    setCurrentUser(user);
    const bookmarks = await api.getUserBookmarks(user.id);
    setBookmarkedIds(new Set(bookmarks.map(p => p.id)));
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    setBookmarkedIds(new Set());
    if (currentView === 'admin' || currentView === 'dashboard') {
      setCurrentView('home');
    }
  };

  // Toggle Bookmark Handler
  const handleToggleBookmark = async (projectId: number) => {
    if (!currentUser) {
      setAuthMode('login');
      setIsAuthOpen(true);
      return;
    }

    try {
      const isBookmarked = bookmarkedIds.has(projectId);
      if (isBookmarked) {
        await api.removeBookmark(currentUser.id, projectId);
        setBookmarkedIds(prev => {
          const next = new Set(prev);
          next.delete(projectId);
          return next;
        });
      } else {
        await api.addBookmark(currentUser.id, projectId);
        setBookmarkedIds(prev => new Set(prev).add(projectId));
      }
    } catch (err) {
      console.error('Bookmark error:', err);
    }
  };

  // View Details Modal Handler & Track History
  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setRecentlyViewedIds(prev => [project.id, ...prev.filter(id => id !== project.id)].slice(0, 8));
  };

  // Filtered and Sorted Projects for the Browse View
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Search match
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesDesc = p.short_description.toLowerCase().includes(query) || p.description.toLowerCase().includes(query);
        const matchesTech = p.technology.some(t => t.toLowerCase().includes(query));
        if (!matchesTitle && !matchesDesc && !matchesTech) return false;
      }

      // Category filter
      if (filters.category && filters.category !== 'All') {
        if (p.category !== filters.category) return false;
      }

      // Tech filter
      if (filters.technology && filters.technology !== 'All') {
        if (!p.technology.includes(filters.technology)) return false;
      }

      // Difficulty filter
      if (filters.difficulty && filters.difficulty !== 'All') {
        if (p.difficulty !== filters.difficulty) return false;
      }

      // Project Type filter
      if (filters.project_type && filters.project_type !== 'All') {
        if (p.project_type !== filters.project_type) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sort_by === 'price_asc') {
        return a.price - b.price;
      }
      if (filters.sort_by === 'price_desc') {
        return b.price - a.price;
      }
      if (filters.sort_by === 'popularity') {
        return (b.views_count || 0) - (a.views_count || 0);
      }
      // default: latest
      return b.id - a.id;
    });
  }, [projects, filters]);

  // Derived Project Subsets
  const featuredProjects = useMemo(() => projects.filter(p => p.featured).slice(0, 3), [projects]);
  const trendingProjects = useMemo(() => projects.filter(p => p.trending).slice(0, 6), [projects]);
  const marketplaceProjects = useMemo(() => projects.filter(p => p.project_type === 'Paid').slice(0, 6), [projects]);
  const savedProjectsList = useMemo(() => projects.filter(p => bookmarkedIds.has(p.id)), [projects, bookmarkedIds]);
  const recentlyViewedList = useMemo(() => {
    return recentlyViewedIds
      .map(id => projects.find(p => p.id === id))
      .filter((p): p is Project => Boolean(p));
  }, [projects, recentlyViewedIds]);
  const myUploadedProjectsList = useMemo(() => {
    if (!currentUser) return [];
    return projects.filter(p => p.author_id === currentUser.id);
  }, [projects, currentUser]);

  const updateSearchQuery = (value: string) => {
    setSearchQuery(value);
    setFilters(prev => ({ ...prev, search: value }));
  };

  // Hero Quick Search Trigger
  const handleHeroSearch = (query: string) => {
    const trimmed = query.trim();
    updateSearchQuery(trimmed);
    setCurrentView('browse');
  };

  const handleHeroCategorySelect = (categoryName: string) => {
    setSearchQuery('');
    setFilters(prev => ({ ...prev, category: categoryName, search: '' }));
    setCurrentView('browse');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Glassmorphism Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        activeTab={currentView}
        setActiveTab={setCurrentView}
        onOpenAuth={(mode = 'login') => {
          setAuthMode(mode);
          setIsAuthOpen(true);
        }}
        onLogout={handleLogout}
        onOpenDocs={() => setIsDocsOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={updateSearchQuery}
        bookmarkCount={bookmarkedIds.size}
      />

      {/* Main Page Body */}
      <main className="flex-1">
        {/* ========================================================= */}
        {/* VIEW 1: HOME PAGE */}
        {/* ========================================================= */}
        {currentView === 'home' && (
          <div className="space-y-16 pb-16">
            {/* Modern Hero Section */}
            <Hero
              searchQuery={searchQuery}
              setSearchQuery={updateSearchQuery}
              onSearchSubmit={() => handleHeroSearch(searchQuery)}
              onCategoryClick={handleHeroCategorySelect}
              onExploreClick={() => {
                updateSearchQuery(searchQuery);
                setCurrentView('browse');
              }}
              onMarketplaceClick={() => setCurrentView('marketplace')}
            />

            {/* Section 1: Featured Academic Projects */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold mb-2">
                    <Star className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                    <span>Curated Selection</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                    Featured Academic Projects
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Peer-reviewed capstone projects with complete architecture diagrams and verified repository schemas.
                  </p>
                </div>

                <button
                  onClick={() => setCurrentView('browse')}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>Explore All Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(featuredProjects.length ? featuredProjects : projects.slice(0, 3)).map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isBookmarked={bookmarkedIds.has(project.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </section>

            {/* Section 2: Categories Spotlight */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2 border border-teal-500/30">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Academic Classifications</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold font-heading">
                      Explore by Technical Discipline
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Choose from specialized tracks across Machine Learning, Full-Stack Development, Embedded IoT, and Cloud Systems.
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentView('categories')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    <span>View All Categories</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {categories.slice(0, 6).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleHeroCategorySelect(cat.category_name)}
                      className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-blue-400/50 transition-all text-left flex flex-col justify-between group"
                    >
                      <span className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                        {cat.category_name}
                      </span>
                      <span className="text-[11px] text-slate-400 mt-3 font-medium">
                        {cat.project_count || 0} projects
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Section 3: Trending Projects */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                    <span>Popular this Semester</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                    Trending Projects
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1">
                    Most viewed and bookmarked project repositories across engineering campuses.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setFilters(prev => ({ ...prev, sort_by: 'popularity' }));
                    setCurrentView('browse');
                  }}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-blue-600 hover:text-blue-700"
                >
                  <span>Sort by Popularity</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trendingProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isBookmarked={bookmarkedIds.has(project.id)}
                    onToggleBookmark={handleToggleBookmark}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            </section>

            {/* Section 4: Project Marketplace Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-teal-50 border border-blue-200/80 rounded-3xl p-8 sm:p-10 shadow-sm">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold mb-2 shadow-sm">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Curated Project Marketplace</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
                      Verified Capstones & Commercial Prototypes
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                      Explore both Free and Paid academic projects with upfront transparent pricing (e.g. ₹1999). Direct administrator procurement ensures full source code verification without automated billing gateways.
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentView('marketplace')}
                    className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 flex-shrink-0"
                  >
                    <span>Visit Marketplace</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {marketplaceProjects.slice(0, 3).map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      isBookmarked={bookmarkedIds.has(project.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: BROWSE ALL PROJECTS */}
        {/* ========================================================= */}
        {currentView === 'browse' && (
          <BrowseProjects
            projects={filteredProjects}
            categories={categories}
            filters={filters}
            setFilters={setFilters}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onViewDetails={handleViewDetails}
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 3: PROJECT MARKETPLACE */}
        {/* ========================================================= */}
        {currentView === 'marketplace' && (
          <BrowseProjects
            projects={projects.filter(p => p.project_type === 'Paid')}
            categories={categories}
            filters={filters}
            setFilters={setFilters}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
            onViewDetails={handleViewDetails}
            marketplaceMode={true}
            titleOverride="Academic Project Marketplace"
            subtitleOverride="Curated paid academic prototypes and ready-to-deploy capstone architectures. Displays transparent prices; contact administrator for direct student licensing."
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 4: CATEGORIES DIRECTORY */}
        {/* ========================================================= */}
        {currentView === 'categories' && (
          <CategoriesView
            categories={categories}
            onSelectCategory={handleHeroCategorySelect}
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 5: USER DASHBOARD */}
        {/* ========================================================= */}
        {currentView === 'dashboard' && (
          <UserDashboard
            currentUser={currentUser}
            savedProjects={savedProjectsList}
            recentlyViewedProjects={recentlyViewedList}
            myUploadedProjects={myUploadedProjectsList}
            categories={categories}
            onOpenAuth={(mode) => {
              setAuthMode(mode || 'login');
              setIsAuthOpen(true);
            }}
            onToggleBookmark={handleToggleBookmark}
            onViewDetails={handleViewDetails}
            onProjectCreated={(newProject) => {
              setProjects(prev => [newProject, ...prev]);
              setStats(prev => ({ ...prev, total_projects: prev.total_projects + 1 }));
            }}
            onProjectUpdated={(updatedProject) => {
              setProjects(prev => prev.map(project => (
                project.id === updatedProject.id ? updatedProject : project
              )));
              setStats(prev => ({
                ...prev,
                free_projects: projects.filter(project => project.id !== updatedProject.id && project.project_type === 'Free').length + (updatedProject.project_type === 'Free' ? 1 : 0),
                paid_projects: projects.filter(project => project.id !== updatedProject.id && project.project_type === 'Paid').length + (updatedProject.project_type === 'Paid' ? 1 : 0)
              }));
            }}
            onProjectDeleted={(deletedProject) => {
              setProjects(prev => prev.filter(project => project.id !== deletedProject.id));
              setStats(prev => ({
                ...prev,
                total_projects: Math.max(0, prev.total_projects - 1),
                free_projects: Math.max(0, prev.free_projects - (deletedProject.project_type === 'Free' ? 1 : 0)),
                paid_projects: Math.max(0, prev.paid_projects - (deletedProject.project_type === 'Paid' ? 1 : 0))
              }));
            }}
          />
        )}

        {/* ========================================================= */}
        {/* VIEW 6: ADMIN DASHBOARD */}
        {/* ========================================================= */}
        {currentView === 'admin' && (
          <AdminDashboard
            currentUser={currentUser}
            projects={projects}
            categories={categories}
            users={users}
            stats={stats}
            onRefreshData={refreshAllData}
            onOpenAuth={(mode) => {
              setAuthMode(mode || 'login');
              setIsAuthOpen(true);
            }}
            onViewDetails={handleViewDetails}
          />
        )}
      </main>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        isBookmarked={selectedProject ? bookmarkedIds.has(selectedProject.id) : false}
        onToggleBookmark={handleToggleBookmark}
      />

      {/* Auth Modal (Login / Register / Forgot Password) */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* FastAPI & MySQL Architecture Explorer Modal */}
      <BackendDocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      {/* Dark Footer */}
      <Footer
        onNavigate={(view) => setCurrentView(view)}
        onOpenDocs={() => setIsDocsOpen(true)}
        onOpenAuth={() => {
          setAuthMode('login');
          setIsAuthOpen(true);
        }}
      />
    </div>
  );
}
