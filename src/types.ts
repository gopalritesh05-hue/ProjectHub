export type UserRole = 'student' | 'admin' | 'faculty';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  institution?: string;
  avatar?: string;
  created_at?: string;
}

export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';
export type ProjectType = 'Free' | 'Paid';

export interface Project {
  id: number;
  title: string;
  short_description: string;
  description: string;
  technology: string[];
  category: string;
  difficulty: ProjectDifficulty;
  image: string;
  screenshots?: string[];
  project_type: ProjectType;
  price: number; // 0 for Free, e.g. 1999 for Paid
  created_at: string;
  views_count?: number;
  featured?: boolean;
  trending?: boolean;
  author_id?: number;
  author_name?: string;
  features?: string[];
  github_url?: string;
  demo_url?: string;
}

export interface Category {
  id: number;
  category_name: string;
  description?: string;
  icon?: string;
  project_count?: number;
}

export interface Bookmark {
  id: number;
  user_id: number;
  project_id: number;
  created_at?: string;
}

export interface DashboardStats {
  total_users: number;
  total_projects: number;
  free_projects: number;
  paid_projects: number;
  categories_count: number;
  total_bookmarks: number;
}

export interface ProjectFilter {
  search: string;
  category: string;
  technology: string;
  difficulty: string;
  project_type: 'All' | 'Free' | 'Paid';
  sort_by: 'latest' | 'price_asc' | 'price_desc' | 'popularity';
}
