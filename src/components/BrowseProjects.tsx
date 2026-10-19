import React from 'react';
import {
  Search, SlidersHorizontal, RotateCcw, Filter,
  Sparkles, Check, ChevronDown
} from 'lucide-react';
import { Project, Category, ProjectFilter } from '../types';
import { ProjectCard } from './ProjectCard';

interface BrowseProjectsProps {
  projects: Project[];
  categories: Category[];
  filters: ProjectFilter;
  setFilters: React.Dispatch<React.SetStateAction<ProjectFilter>>;
  bookmarkedIds: Set<number>;
  onToggleBookmark: (id: number) => void;
  onViewDetails: (project: Project) => void;
  titleOverride?: string;
  subtitleOverride?: string;
  marketplaceMode?: boolean;
}

export const BrowseProjects: React.FC<BrowseProjectsProps> = ({
  projects,
  categories,
  filters,
  setFilters,
  bookmarkedIds,
  onToggleBookmark,
  onViewDetails,
  titleOverride,
  subtitleOverride,
  marketplaceMode
}) => {
  const allTechnologies = Array.from(
    new Set(projects.flatMap(p => p.technology))
  ).sort();

  const handleResetFilters = () => {
    setFilters({
      search: '',
      category: 'All',
      technology: 'All',
      difficulty: 'All',
      project_type: marketplaceMode ? 'Paid' : 'All',
      sort_by: 'latest'
    });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.category !== 'All' ||
    filters.technology !== 'All' ||
    filters.difficulty !== 'All' ||
    (!marketplaceMode && filters.project_type !== 'All') ||
    filters.sort_by !== 'latest';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Title Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{marketplaceMode ? 'Academic Marketplace' : 'Centralized Repository'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              {titleOverride || (marketplaceMode ? 'Project Marketplace' : 'Browse Academic Projects')}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {subtitleOverride || (
                marketplaceMode
                  ? 'Explore curated premium and capstone-ready academic projects with verified architectures and pricing.'
                  : 'Search through verified university capstone source codes, system designs, and free student repositories.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
              Showing <strong>{projects.length}</strong> {projects.length === 1 ? 'project' : 'projects'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Control Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-8 space-y-4">
        {/* Top search & Sort row */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              id="browse-search-input"
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search projects by title, description, or keyword..."
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl outline-none transition-all text-slate-800"
            />
          </div>

          {/* Project Type Filter (All / Free / Paid) */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setFilters(prev => ({ ...prev, project_type: 'All' }))}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                filters.project_type === 'All'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, project_type: 'Free' }))}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                filters.project_type === 'Free'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              <Check className="w-3 h-3" />
              Free
            </button>
            <button
              onClick={() => setFilters(prev => ({ ...prev, project_type: 'Paid' }))}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
                filters.project_type === 'Paid'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              Paid
            </button>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative min-w-[180px]">
            <select
              id="sort-by-select"
              value={filters.sort_by}
              onChange={(e) => setFilters(prev => ({ ...prev, sort_by: e.target.value as any }))}
              className="w-full appearance-none px-3.5 py-2.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl text-slate-800 outline-none focus:border-blue-500 pr-8 cursor-pointer"
            >
              <option value="latest">Sort: Latest Uploads</option>
              <option value="popularity">Sort: Most Popular</option>
              <option value="price_asc">Sort: Price: Low to High</option>
              <option value="price_desc">Sort: Price: High to Low</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 text-xs font-semibold text-slate-500 mr-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Filters:</span>
          </div>

          {/* Category Dropdown */}
          <div className="relative">
            <select
              id="filter-category-select"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="appearance-none px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg text-slate-700 pr-7 cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.category_name}>
                  {cat.category_name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Technology Dropdown */}
          <div className="relative">
            <select
              id="filter-tech-select"
              value={filters.technology}
              onChange={(e) => setFilters(prev => ({ ...prev, technology: e.target.value }))}
              className="appearance-none px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg text-slate-700 pr-7 cursor-pointer"
            >
              <option value="All">All Technologies</option>
              {allTechnologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Difficulty Dropdown */}
          <div className="relative">
            <select
              id="filter-difficulty-select"
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="appearance-none px-3 py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-lg text-slate-700 pr-7 cursor-pointer"
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="ml-auto px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isBookmarked={bookmarkedIds.has(project.id)}
              onToggleBookmark={onToggleBookmark}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No Academic Projects Found</h3>
          <p className="text-xs text-slate-500 mb-6">
            No projects matched your active filters. Try adjusting your search keyword or clearing selected categories.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};
