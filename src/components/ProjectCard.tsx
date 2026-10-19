import React from 'react';
import { Bookmark as BookmarkIcon, Eye, ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  isBookmarked: boolean;
  onToggleBookmark: (projectId: number) => void;
  onViewDetails: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  isBookmarked,
  onToggleBookmark,
  onViewDetails
}) => {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div
      id={`project-card-${project.id}`}
      className="group relative flex flex-col rounded-2xl bg-white border border-slate-200/90 hover:border-blue-400/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Thumbnail Header */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {/* Category & Difficulty */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-md bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
              {project.category}
            </span>
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border backdrop-blur-sm ${getDifficultyColor(project.difficulty)}`}>
              {project.difficulty}
            </span>
          </div>

          {/* Bookmark Button */}
          <button
            id={`bookmark-btn-${project.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(project.id);
            }}
            title={isBookmarked ? 'Remove Bookmark' : 'Save Project'}
            className={`p-2 rounded-full backdrop-blur-md transition-all ${
              isBookmarked
                ? 'bg-red-500 text-white shadow-md shadow-red-500/30 hover:bg-red-600'
                : 'bg-white/80 text-slate-700 hover:bg-white hover:text-red-500 shadow-sm'
            }`}
          >
            <BookmarkIcon className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Price Badge on Bottom Right of Thumbnail */}
        <div className="absolute bottom-3 right-3">
          {project.project_type === 'Free' ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20">
              <Check className="w-3 h-3" />
              Free
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-extrabold shadow-md shadow-blue-500/30">
              <Sparkles className="w-3 h-3 text-amber-300" />
              ₹{project.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Views Count on Bottom Left */}
        {project.views_count !== undefined && (
          <div className="absolute bottom-3 left-3 text-[11px] font-medium text-white/90 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{project.views_count.toLocaleString()} views</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3
          onClick={() => onViewDetails(project)}
          className="text-base font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition-colors cursor-pointer mb-2 font-heading leading-snug"
        >
          {project.title}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed flex-1">
          {project.short_description}
        </p>

        {/* Technologies Badges */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.technology.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 text-[11px] font-medium rounded-md bg-slate-100 text-slate-700 border border-slate-200/70"
            >
              {tech}
            </span>
          ))}
          {project.technology.length > 3 && (
            <span className="px-1.5 py-0.5 text-[10px] font-medium rounded text-slate-400 bg-slate-50">
              +{project.technology.length - 3}
            </span>
          )}
        </div>

        {/* Author & Details Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-auto">
          <span className="text-[11px] text-slate-500 truncate max-w-[130px]" title={project.author_name}>
            {project.author_name || 'Academic Team'}
          </span>

          <button
            id={`view-details-btn-${project.id}`}
            onClick={() => onViewDetails(project)}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
