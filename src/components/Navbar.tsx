import React, { useState } from 'react';
import {
  GraduationCap, Search, Bookmark as BookmarkIcon,
  User as UserIcon, LogOut, Shield,
  Terminal, Menu, X, Sparkles, FolderKanban
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenDocs: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  bookmarkCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  onOpenDocs,
  searchQuery,
  setSearchQuery,
  bookmarkCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div 
            id="nav-brand-logo"
            onClick={() => { setActiveTab('home'); }}
            className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 font-heading">
                  Project<span className="text-blue-600">Hub</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  Academic
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Discovery & Marketplace</p>
            </div>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="nav-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'browse' && activeTab !== 'marketplace') {
                    setActiveTab('browse');
                  }
                }}
                onFocus={() => {
                  if (activeTab !== 'browse' && activeTab !== 'marketplace') {
                    setActiveTab('browse');
                  }
                }}
                placeholder="Search Python, AI, Web, Android projects..."
                className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 hover:bg-slate-50 focus:bg-white border border-transparent focus:border-blue-500 rounded-full outline-none transition-all duration-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-link-home"
              onClick={() => setActiveTab('home')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'home'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              id="nav-link-browse"
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'browse'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Browse Projects
            </button>
            <button
              id="nav-link-marketplace"
              onClick={() => setActiveTab('marketplace')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'marketplace'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Marketplace
            </button>
            <button
              id="nav-link-categories"
              onClick={() => setActiveTab('categories')}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'categories'
                  ? 'text-blue-600 bg-blue-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Categories
            </button>
            <button
              id="nav-link-docs"
              onClick={onOpenDocs}
              className="px-3 py-1.5 text-sm font-medium rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100/80 transition-colors flex items-center gap-1.5 border border-teal-200"
              title="FastAPI & MySQL Architecture"
            >
              <Terminal className="w-3.5 h-3.5 text-teal-600" />
              API & SQL Docs
            </button>
          </nav>

          {/* Action buttons & User profile */}
          <div className="flex items-center gap-2.5">
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.name}`}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full bg-blue-100 object-cover"
                  />
                  <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  {currentUser.role === 'admin' ? (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-indigo-100 text-indigo-700">
                      Admin
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-slate-100 text-slate-600">
                      {currentUser.role}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <div 
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      id="dropdown-dashboard-btn"
                      onClick={() => {
                        setActiveTab('dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      User Dashboard
                    </button>

                    <button
                      id="dropdown-saved-btn"
                      onClick={() => {
                        setActiveTab('dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <BookmarkIcon className="w-4 h-4 text-slate-400" />
                        Saved Projects
                      </span>
                      {bookmarkCount > 0 && (
                        <span className="px-1.5 py-0.2 text-[10px] bg-blue-100 text-blue-700 rounded-full font-bold">
                          {bookmarkCount}
                        </span>
                      )}
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        id="dropdown-admin-btn"
                        onClick={() => {
                          setActiveTab('admin');
                          setUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs text-indigo-700 hover:bg-indigo-50 flex items-center gap-2 font-medium"
                      >
                        <Shield className="w-4 h-4 text-indigo-600" />
                        Admin Control Panel
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      id="dropdown-logout-btn"
                      onClick={() => {
                        setUserMenuOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-500/20"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 lg:hidden rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-2 shadow-lg">
          <div className="mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveTab('browse');
              }}
              placeholder="Search projects..."
              className="w-full px-3 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg"
            />
          </div>
          <button
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeTab === 'home' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'}`}
          >
            Home
          </button>
          <button
            onClick={() => { setActiveTab('browse'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeTab === 'browse' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'}`}
          >
            Browse Projects
          </button>
          <button
            onClick={() => { setActiveTab('marketplace'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeTab === 'marketplace' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'}`}
          >
            Marketplace (Free & Paid)
          </button>
          <button
            onClick={() => { setActiveTab('categories'); setMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeTab === 'categories' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700'}`}
          >
            Categories
          </button>
          <button
            onClick={() => { onOpenDocs(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-teal-700 bg-teal-50 font-medium flex items-center gap-2"
          >
            <Terminal className="w-4 h-4" />
            FastAPI & MySQL Docs
          </button>

          {currentUser && (
            <>
              <div className="border-t border-slate-100 pt-2" />
              <button
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false); }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-700"
              >
                My Dashboard & Saved Projects
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => { setActiveTab('admin'); setMobileMenuOpen(false); }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-indigo-700 font-semibold"
                >
                  Admin Control Panel
                </button>
              )}
            </>
          )}
        </div>
      )}
    </header>
  );
};
