import React from 'react';
import {
  GraduationCap, Github, Twitter, Linkedin,
  Mail, Heart, Code2, Database, Shield, Sparkles
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: any) => void;
  onOpenDocs: () => void;
  onOpenAuth: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenDocs,
  onOpenAuth
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight font-heading">
                Project<span className="text-blue-400">Hub</span>
              </span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-sm text-xs">
              ProjectHub is a centralized academic project discovery and repository management platform. Explore peer-reviewed semester projects, final year capstone architectures, and verified source repositories.
            </p>

            <div className="pt-2 flex items-center gap-3 text-slate-400">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="mailto:support@projecthub.edu" className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 hover:text-white flex items-center justify-center transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-heading">
              Platform
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('browse')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Browse Projects
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                >
                  <span>Project Marketplace</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/20 text-blue-400 font-bold">Paid Tier</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('categories')}
                  className="hover:text-blue-400 transition-colors"
                >
                  All Academic Categories
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Portal */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-heading">
              Students & Faculty
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Student Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Saved Bookmarks
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-blue-400 transition-colors"
                >
                  Submit Academic Project
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="hover:text-indigo-400 transition-colors flex items-center gap-1"
                >
                  <Shield className="w-3 h-3 text-indigo-400" />
                  <span>Admin Command Center</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Architecture & Developer */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider font-heading">
              Full-Stack Architecture
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={onOpenDocs}
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <Code2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>FastAPI Source Code</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDocs}
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <Database className="w-3.5 h-3.5 text-teal-400" />
                  <span>MySQL 8.0+ Schema (DDL)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDocs}
                  className="hover:text-teal-400 transition-colors"
                >
                  Interactive REST API Runner
                </button>
              </li>
              <li>
                <span className="text-slate-500 text-[11px] block mt-2">
                  No payment gateways integrated as per academic specification.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} ProjectHub. Academic discovery & repository management platform.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3 h-3 text-rose-500 inline fill-current" /> for Computer Science Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
