import {
  Project, Category, User, Bookmark, DashboardStats, ProjectFilter
} from '../types';
import { INITIAL_PROJECTS, INITIAL_CATEGORIES, INITIAL_USERS } from '../data/mockData';

const STORAGE_KEYS = {
  PROJECTS: 'projecthub_projects_v1',
  CATEGORIES: 'projecthub_categories_v1',
  USERS: 'projecthub_users_v1',
  BOOKMARKS: 'projecthub_bookmarks_v1',
  CURRENT_USER: 'projecthub_current_user_v1',
  RECENTLY_VIEWED: 'projecthub_recently_viewed_v1',
  INQUIRIES: 'projecthub_inquiries_v1'
};

function getStored<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error('Error reading localStorage key', key, e);
    return defaultVal;
  }
}

function setStored<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Error writing localStorage key', key, e);
  }
}

// Initialize database if empty
if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
  setStored(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
}
if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
  setStored(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
}
if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
  setStored(STORAGE_KEYS.USERS, INITIAL_USERS);
}
if (!localStorage.getItem(STORAGE_KEYS.BOOKMARKS)) {
  setStored(STORAGE_KEYS.BOOKMARKS, [
    { id: 1, user_id: 2, project_id: 1, created_at: '2025-02-16' },
    { id: 2, user_id: 2, project_id: 2, created_at: '2025-02-18' }
  ]);
}

// Reset tokens simulation map
const RESET_TOKENS: Record<string, string> = {};

export const api = {
  // Auth API
  async getCurrentUser(): Promise<User | null> {
    return getStored<User | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('No account found with this email address.');
    }
    // In mock client, accept password if it matches demo credentials or minimum 6 chars
    if (password.length < 4) {
      throw new Error('Password must be at least 4 characters.');
    }

    setStored(STORAGE_KEYS.CURRENT_USER, user);
    const mockToken = `jwt_ph_${btoa(user.email)}_${Date.now()}`;
    return { user, token: mockToken };
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    role?: 'student' | 'faculty' | 'admin';
    department?: string;
    institution?: string;
  }): Promise<{ user: User; token: string }> {
    const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const existing = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'student',
      department: userData.department || 'Computer Science & Engineering',
      institution: userData.institution || 'State Technical University',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(userData.name)}`,
      created_at: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    setStored(STORAGE_KEYS.USERS, users);
    setStored(STORAGE_KEYS.CURRENT_USER, newUser);

    const mockToken = `jwt_ph_${btoa(newUser.email)}_${Date.now()}`;
    return { user: newUser, token: mockToken };
  },

  async logout(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  async forgotPassword(email: string): Promise<{ message: string; simulated_token?: string }> {
    const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { message: 'If an account exists with this email, a reset token was generated.' };
    }

    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    RESET_TOKENS[email.toLowerCase()] = token;

    return {
      message: `Password reset instructions sent to ${email}`,
      simulated_token: token
    };
  },

  async resetPassword(email: string, token: string, newPass: string): Promise<{ message: string }> {
    const stored = RESET_TOKENS[email.toLowerCase()];
    if (!stored || stored !== token.trim().toUpperCase()) {
      throw new Error('Invalid or expired reset token. Please check and try again.');
    }
    delete RESET_TOKENS[email.toLowerCase()];
    return { message: 'Password has been successfully reset! You can now log in.' };
  },

  // Projects API
  async getProjects(filter?: Partial<ProjectFilter>): Promise<Project[]> {
    let projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);

    if (!filter) return projects;

    if (filter.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      projects = projects.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.short_description.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.technology.some(t => t.toLowerCase().includes(q))
      );
    }

    if (filter.category && filter.category !== 'All') {
      projects = projects.filter(p => p.category.toLowerCase() === filter.category!.toLowerCase());
    }

    if (filter.technology && filter.technology !== 'All') {
      projects = projects.filter(p =>
        p.technology.some(t => t.toLowerCase() === filter.technology!.toLowerCase())
      );
    }

    if (filter.difficulty && filter.difficulty !== 'All') {
      projects = projects.filter(p => p.difficulty === filter.difficulty);
    }

    if (filter.project_type && filter.project_type !== 'All') {
      projects = projects.filter(p => p.project_type === filter.project_type);
    }

    if (filter.sort_by) {
      if (filter.sort_by === 'price_asc') {
        projects.sort((a, b) => a.price - b.price);
      } else if (filter.sort_by === 'price_desc') {
        projects.sort((a, b) => b.price - a.price);
      } else if (filter.sort_by === 'popularity') {
        projects.sort((a, b) => (b.views_count || 0) - (a.views_count || 0));
      } else {
        // latest
        projects.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }
    }

    return projects;
  },

  async getProjectById(id: number): Promise<Project> {
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const p = projects.find(item => item.id === id);
    if (!p) throw new Error('Project not found');

    // Increment views
    p.views_count = (p.views_count || 0) + 1;
    setStored(STORAGE_KEYS.PROJECTS, projects);

    // Track recently viewed
    const recently = getStored<number[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
    const updated = [id, ...recently.filter(rid => rid !== id)].slice(0, 10);
    setStored(STORAGE_KEYS.RECENTLY_VIEWED, updated);

    return p;
  },

  async getRecentlyViewed(): Promise<Project[]> {
    const recently = getStored<number[]>(STORAGE_KEYS.RECENTLY_VIEWED, []);
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return recently.map(id => projects.find(p => p.id === id)).filter(Boolean) as Project[];
  },

  async createProject(projectData: Omit<Project, 'id' | 'created_at'>): Promise<Project> {
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const newProject: Project = {
      ...projectData,
      id: Date.now(),
      created_at: new Date().toISOString().split('T')[0],
      views_count: 0,
      price: projectData.project_type === 'Free' ? 0 : Number(projectData.price)
    };
    projects.unshift(newProject);
    setStored(STORAGE_KEYS.PROJECTS, projects);
    return newProject;
  },

  async updateProject(id: number, updates: Partial<Project>): Promise<Project> {
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const idx = projects.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('Project not found');

    const updated = {
      ...projects[idx],
      ...updates,
      price: (updates.project_type ?? projects[idx].project_type) === 'Free' ? 0 : Number(updates.price ?? projects[idx].price)
    };
    projects[idx] = updated;
    setStored(STORAGE_KEYS.PROJECTS, projects);
    return updated;
  },

  async deleteProject(id: number): Promise<void> {
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const filtered = projects.filter(p => p.id !== id);
    setStored(STORAGE_KEYS.PROJECTS, filtered);

    // Also remove from bookmarks
    const bookmarks = getStored<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
    setStored(STORAGE_KEYS.BOOKMARKS, bookmarks.filter(b => b.project_id !== id));
  },

  // Categories API
  async getCategories(): Promise<Category[]> {
    const categories = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);

    // Dynamic count
    return categories.map(cat => ({
      ...cat,
      project_count: projects.filter(p => p.category.toLowerCase() === cat.category_name.toLowerCase()).length
    }));
  },

  async createCategory(cat: { category_name: string; description?: string; icon?: string }): Promise<Category> {
    const categories = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    if (categories.some(c => c.category_name.toLowerCase() === cat.category_name.toLowerCase())) {
      throw new Error('Category already exists');
    }
    const newCat: Category = {
      id: Date.now(),
      category_name: cat.category_name,
      description: cat.description || '',
      icon: cat.icon || 'Folder',
      project_count: 0
    };
    categories.push(newCat);
    setStored(STORAGE_KEYS.CATEGORIES, categories);
    return newCat;
  },

  async deleteCategory(id: number): Promise<void> {
    const categories = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const cat = categories.find(c => c.id === id);
    if (!cat) throw new Error('Category not found');

    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const associated = projects.filter(p => p.category.toLowerCase() === cat.category_name.toLowerCase());
    if (associated.length > 0) {
      throw new Error(`Cannot delete category: ${associated.length} projects are assigned to it.`);
    }

    setStored(STORAGE_KEYS.CATEGORIES, categories.filter(c => c.id !== id));
  },

  // Bookmarks API
  async getBookmarks(userId: number): Promise<Project[]> {
    const bookmarks = getStored<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
    const userBm = bookmarks.filter(b => b.user_id === userId);
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    return userBm.map(b => projects.find(p => p.id === b.project_id)).filter(Boolean) as Project[];
  },

  async getUserBookmarks(userId: number): Promise<Project[]> {
    return this.getBookmarks(userId);
  },

  async addBookmark(userId: number, projectId: number): Promise<void> {
    const bookmarks = getStored<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
    if (!bookmarks.some(b => b.user_id === userId && b.project_id === projectId)) {
      bookmarks.push({
        id: Date.now(),
        user_id: userId,
        project_id: projectId,
        created_at: new Date().toISOString().split('T')[0]
      });
      setStored(STORAGE_KEYS.BOOKMARKS, bookmarks);
    }
  },

  async removeBookmark(userId: number, projectId: number): Promise<void> {
    const bookmarks = getStored<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
    setStored(STORAGE_KEYS.BOOKMARKS, bookmarks.filter(b => !(b.user_id === userId && b.project_id === projectId)));
  },

  async isBookmarked(userId: number, projectId: number): Promise<boolean> {
    const bookmarks = getStored<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
    return bookmarks.some(b => b.user_id === userId && b.project_id === projectId);
  },

  async toggleBookmark(userId: number, projectId: number): Promise<boolean> {
    const bookmarks = getStored<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);
    const idx = bookmarks.findIndex(b => b.user_id === userId && b.project_id === projectId);
    if (idx !== -1) {
      bookmarks.splice(idx, 1);
      setStored(STORAGE_KEYS.BOOKMARKS, bookmarks);
      return false;
    } else {
      bookmarks.push({
        id: Date.now(),
        user_id: userId,
        project_id: projectId,
        created_at: new Date().toISOString().split('T')[0]
      });
      setStored(STORAGE_KEYS.BOOKMARKS, bookmarks);
      return true;
    }
  },

  // Inquiries / Coming Soon contact
  async submitInquiry(data: { project_id: number; user_name: string; user_email: string; message: string }): Promise<void> {
    const inquiries = getStored<any[]>(STORAGE_KEYS.INQUIRIES, []);
    inquiries.push({
      id: Date.now(),
      ...data,
      created_at: new Date().toISOString()
    });
    setStored(STORAGE_KEYS.INQUIRIES, inquiries);
  },

  // User Management
  async getAllUsers(): Promise<User[]> {
    return getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  async getUsers(): Promise<User[]> {
    return this.getAllUsers();
  },

  async updateUserRole(userId: number, role: 'student' | 'faculty' | 'admin'): Promise<void> {
    const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const user = users.find(u => u.id === userId);
    if (user) {
      user.role = role;
      setStored(STORAGE_KEYS.USERS, users);
    }
  },

  async deleteUser(userId: number): Promise<void> {
    const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    setStored(STORAGE_KEYS.USERS, users.filter(u => u.id !== userId));
  },

  // Dashboard Stats
  async getDashboardStats(): Promise<DashboardStats> {
    const users = getStored<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
    const projects = getStored<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    const categories = getStored<Category[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    const bookmarks = getStored<Bookmark[]>(STORAGE_KEYS.BOOKMARKS, []);

    return {
      total_users: users.length,
      total_projects: projects.length,
      free_projects: projects.filter(p => p.project_type === 'Free').length,
      paid_projects: projects.filter(p => p.project_type === 'Paid').length,
      categories_count: categories.length,
      total_bookmarks: bookmarks.length
    };
  }
};
