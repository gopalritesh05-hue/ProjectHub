import React from 'react';
import { Search, Sparkles, BookOpen, Layers, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: () => void;
  onCategoryClick: (categoryName: string) => void;
  onExploreClick: () => void;
  onMarketplaceClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  onCategoryClick,
  onExploreClick,
  onMarketplaceClick
}) => {
  const popularKeywords = ['AI & Machine Learning', 'Python', 'Web Development', 'IoT', 'FastAPI', 'Android'];

  return (
    <div className="relative overflow-hidden pt-8 pb-16 md:py-20 bg-gradient-to-b from-blue-50/60 via-slate-50/50 to-[#F8FAFC]">
      {/* Background visual accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40 overflow-hidden">
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute top-12 right-1/4 w-80 h-80 rounded-full bg-teal-400/20 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100/70 border border-blue-200/80 text-blue-700 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Centralized Academic Discovery & Project Repository</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
          Find, Learn & Build <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 bg-clip-text text-transparent">
            Academic Grade Projects
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
          The ultimate hub for college capstone, semester, and research projects.
          Explore verified source codes, system architectures, Free repositories, and project marketplace pricing.
        </p>

        {/* Central Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearchSubmit();
            }}
            className="relative flex items-center p-2 rounded-2xl bg-white shadow-xl shadow-blue-900/5 border border-slate-200/90 hover:border-blue-300 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-200"
          >
            <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 flex-shrink-0" />
            <input
              id="hero-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by project name, stack (e.g. FastAPI, OpenCV, React)..."
              className="w-full py-2.5 text-sm sm:text-base text-slate-800 placeholder-slate-400 bg-transparent outline-none"
            />
            <button
              id="hero-search-submit-btn"
              type="submit"
              className="flex-shrink-0 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors shadow-md shadow-blue-600/20 flex items-center gap-1.5"
            >
              <span>Search</span>
              <ArrowRight className="w-4 h-4 hidden sm:inline" />
            </button>
          </form>

          {/* Quick Filter Keyword Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 text-xs text-slate-500">
            <span className="font-medium text-slate-400">Trending Stacks:</span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => onCategoryClick(kw)}
                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border border-slate-200/60 transition-colors text-slate-600 font-medium"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2 mb-12">
          <button
            id="hero-browse-cta"
            onClick={onExploreClick}
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md transition-all flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-teal-400" />
            Explore Free & Verified Projects
          </button>
          <button
            id="hero-marketplace-cta"
            onClick={onMarketplaceClick}
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-sm hover:shadow transition-all flex items-center gap-2"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            View Marketplace Pricing
          </button>
        </div>

        {/* Feature Trust Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200/70">
          <div className="p-3 text-left sm:text-center">
            <div className="flex sm:justify-center items-center gap-1.5 text-blue-600 font-bold text-xl sm:text-2xl font-heading">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              150+
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Academic Source Repos</p>
          </div>

          <div className="p-3 text-left sm:text-center">
            <div className="flex sm:justify-center items-center gap-1.5 text-blue-600 font-bold text-xl sm:text-2xl font-heading">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              100%
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Verified System Schemas</p>
          </div>

          <div className="p-3 text-left sm:text-center">
            <div className="flex sm:justify-center items-center gap-1.5 text-blue-600 font-bold text-xl sm:text-2xl font-heading">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              FastAPI
            </div>
            <p className="text-xs text-slate-500 mt-0.5">& MySQL Architecture</p>
          </div>

          <div className="p-3 text-left sm:text-center">
            <div className="flex sm:justify-center items-center gap-1.5 text-blue-600 font-bold text-xl sm:text-2xl font-heading">
              <CheckCircle2 className="w-4 h-4 text-teal-500" />
              ₹0 - ₹2499
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Transparent Price Tags</p>
          </div>
        </div>

      </div>
    </div>
  );
};
