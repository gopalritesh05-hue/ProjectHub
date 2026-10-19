import React, { useState } from 'react';
import {
  X, CheckCircle2, Bookmark as BookmarkIcon,
  Download, Sparkles, MessageSquare, AlertCircle,
  ExternalLink, Github, Calendar, Layers, Eye, Check, Send
} from 'lucide-react';
import { Project } from '../types';
import { api } from '../services/api';

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (projectId: number) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  onClose,
  isBookmarked,
  onToggleBookmark
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'architecture'>('overview');
  const [showBuyNotice, setShowBuyNotice] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Inquiry form states
  const [inquirerName, setInquirerName] = useState('');
  const [inquirerEmail, setInquirerEmail] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  if (!project) return null;

  const handleSimulatedDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => {
      setDownloadSuccess(false);
    }, 4000);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquirerName || !inquirerEmail) return;

    await api.submitInquiry({
      project_id: project.id,
      user_name: inquirerName,
      user_email: inquirerEmail,
      message: inquiryMessage || `Interested in inquiring about ${project.title}`
    });

    setInquirySubmitted(true);
    setTimeout(() => {
      setShowContactForm(false);
      setInquirySubmitted(false);
    }, 3000);
  };

  return (
    <div
      id="project-detail-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="project-detail-modal-content"
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Close Button */}
        <button
          id="project-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Project Image Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Hero Content on Banner */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-3 py-1 text-xs font-bold rounded-lg bg-blue-600 text-white shadow-sm">
                  {project.category}
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/20 text-white backdrop-blur-md border border-white/20">
                  {project.difficulty} Level
                </span>
                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-white/20 text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {project.created_at}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight font-heading leading-tight">
                {project.title}
              </h2>
            </div>

            {/* Price badge floating in hero */}
            <div className="flex sm:flex-col items-start sm:items-end gap-1 flex-shrink-0">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                Project Tier
              </span>
              {project.project_type === 'Free' ? (
                <span className="px-4 py-1.5 rounded-xl bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-500/30 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Free Project
                </span>
              ) : (
                <span className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-extrabold text-base sm:text-xl shadow-lg shadow-blue-500/30 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  ₹{project.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Bar (Free Download vs Buy Now / Contact Admin) */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="detail-modal-bookmark-toggle"
              onClick={() => onToggleBookmark(project.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                isBookmarked
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <BookmarkIcon className={`w-4 h-4 ${isBookmarked ? 'fill-current text-red-500' : ''}`} />
              <span>{isBookmarked ? 'Saved in Bookmarks' : 'Save Project'}</span>
            </button>

            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repo</span>
              </a>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="flex items-center gap-2">
            {project.project_type === 'Free' ? (
              <button
                id="free-project-download-btn"
                onClick={handleSimulatedDownload}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
              >
                {downloadSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Source ZIP Ready (Downloaded)</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Complete Source Code (Free)</span>
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="paid-project-contact-admin-btn"
                  onClick={() => {
                    setShowContactForm(true);
                    setShowBuyNotice(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-300 transition-all flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span>Contact Admin</span>
                </button>

                <button
                  id="paid-project-buy-now-btn"
                  onClick={() => {
                    setShowBuyNotice(true);
                    setShowContactForm(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Buy Now (Coming Soon)</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Simulated Download Toast */}
        {downloadSuccess && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              Academic Package downloaded: <strong>{project.title.slice(0, 30)}...zip</strong> (Includes README, system architecture diagram, source code & database schema).
            </span>
          </div>
        )}

        {/* IMPORTANT NOTICE BANNER: Strict Scope Requirement for Paid Projects */}
        {showBuyNotice && (
          <div
            id="buy-now-notice-box"
            className="mx-6 mt-5 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-sm shadow-sm animate-in fade-in duration-200"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="font-bold text-amber-900 mb-1">Project Marketplace Notice</h4>
                <p className="text-amber-800 text-xs sm:text-sm mb-2 font-medium">
                  "This feature will be available in the next version."
                </p>
                <p className="text-amber-700 text-xs mb-3">
                  "Please contact the administrator to purchase this project."
                </p>
                <div className="p-3 bg-white/80 rounded-xl border border-amber-200/80 text-xs text-slate-700 space-y-1">
                  <p><strong>Project Code:</strong> PH-PRJ-{project.id}</p>
                  <p><strong>Listed Price:</strong> ₹{project.price.toLocaleString()} (Standard Academic License)</p>
                  <p><strong>Administrator Contact:</strong> <a href="mailto:admin@projecthub.edu" className="text-blue-600 underline">admin@projecthub.edu</a></p>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      setShowBuyNotice(false);
                      setShowContactForm(true);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors"
                  >
                    Send Direct Inquiry to Admin
                  </button>
                  <button
                    onClick={() => setShowBuyNotice(false)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-800 text-xs font-medium"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Form Dialog */}
        {showContactForm && (
          <div
            id="admin-contact-form-box"
            className="mx-6 mt-5 p-5 rounded-2xl bg-blue-50/70 border border-blue-200 text-slate-800 shadow-sm animate-in fade-in duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-blue-600" />
                Contact Administrator for "{project.title.slice(0, 40)}..."
              </h4>
              <button onClick={() => setShowContactForm(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="p-4 bg-emerald-100/70 border border-emerald-300 rounded-xl text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Thank you! Your inquiry has been sent to the administrator. They will contact you shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      value={inquirerName}
                      onChange={(e) => setInquirerName(e.target.value)}
                      placeholder="e.g. Ritesh Gopal"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Email Address</label>
                    <input
                      type="email"
                      required
                      value={inquirerEmail}
                      onChange={(e) => setInquirerEmail(e.target.value)}
                      placeholder="student@projecthub.edu"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Inquiry / College Requirement</label>
                  <textarea
                    rows={2}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Describe your academic query, capstone batch deadline, or request preview access..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowContactForm(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Content Navigation Tabs */}
        <div className="px-6 pt-5">
          <div className="flex items-center gap-4 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Project Overview
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'features'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Key Features & Modules
            </button>
            <button
              onClick={() => setActiveTab('architecture')}
              className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
                activeTab === 'architecture'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Tech Stack & Architecture
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[420px] overflow-y-auto space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Abstract</h4>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {project.description}
                </p>
              </div>

              {/* Technologies Used Grid */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Technologies Used</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technology.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-100"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Screenshots Gallery if present */}
              {project.screenshots && project.screenshots.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Screenshots & Diagrams</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {project.screenshots.map((imgUrl, i) => (
                      <div key={i} className="rounded-xl overflow-hidden border border-slate-200 h-28 bg-slate-100">
                        <img src={imgUrl} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Module Implementations</h4>
              {project.features && project.features.length > 0 ? (
                <ul className="space-y-2.5">
                  {project.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">Comprehensive modular source code structure provided.</p>
              )}
            </div>
          )}

          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h5 className="font-bold text-xs text-slate-800 mb-1 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-blue-600" />
                  System Architecture & Relational Database Design
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Engineered using a modern layered pattern (Presentation, FastAPI RESTful Business Controller, SQLAlchemy ORM Layer, and MySQL Relational Storage). Designed with strict schema constraints, indexing, and scalable endpoints.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-400 font-semibold mb-1">Author & Department</p>
                  <p className="font-bold text-slate-800">{project.author_name || 'Academic Consortium'}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-400 font-semibold mb-1">Platform Category</p>
                  <p className="font-bold text-slate-800">{project.category}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Project Reference: <strong>PH-{project.id.toString().padStart(4, '0')}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
