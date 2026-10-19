import React from 'react';
import {
  Cpu, Code, Globe, BarChart3, Smartphone, Coffee, Radio,
  ShieldCheck, ArrowRight, FolderKanban
} from 'lucide-react';
import { Category } from '../types';

interface CategoriesViewProps {
  categories: Category[];
  onSelectCategory: (categoryName: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Cpu: <Cpu className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  BarChart3: <BarChart3 className="w-6 h-6" />,
  Smartphone: <Smartphone className="w-6 h-6" />,
  Coffee: <Coffee className="w-6 h-6" />,
  Radio: <Radio className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />
};

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  categories,
  onSelectCategory
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100/70 text-blue-700 text-xs font-semibold mb-3">
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Academic Domains</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          Explore by Project Category
        </h1>
        <p className="text-sm text-slate-600 mt-2">
          Dive into specific technical disciplines, research areas, and capstone domains with verified source architectures.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => {
          const icon = ICON_MAP[cat.icon || 'Code'] || <Code className="w-6 h-6" />;

          return (
            <div
              key={cat.id}
              id={`category-card-${cat.id}`}
              onClick={() => onSelectCategory(cat.category_name)}
              className="group p-6 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500/80 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-200 flex items-center justify-center mb-4 shadow-sm">
                  {icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors font-heading mb-1.5">
                  {cat.category_name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                  {cat.description || 'Academic projects and source repositories.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold">
                <span className="text-slate-500">
                  {cat.project_count || 0} {cat.project_count === 1 ? 'Project' : 'Projects'}
                </span>
                <span className="text-blue-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                  <span>Browse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
