import { LucideIcon } from 'lucide-react';

export type UserRole = 'super_admin' | 'faculty_admin' | 'student';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  faculty?: string; // Optional, for faculty admins
  avatar?: string;
}

export interface SubMenuItem {
  id: string;
  label: string;
}

export interface MenuGroup {
  id: string;
  label: string;
  items: SubMenuItem[];
}

export interface MainTab {
  id: string;
  label: string;
  icon: LucideIcon;
  groups: MenuGroup[];
  role?: UserRole; 
}

export interface Faculty {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon name
  studentCount: number;
  staffCount: number;
  color: string;
}

export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: LucideIcon;
  color: string;
}

// Database / Page Configuration Types
export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'date' | 'status' | 'currency' | 'progress' | 'file' | 'long_text';
}

export interface Action {
  type: 'add' | 'edit' | 'delete' | 'view' | 'print' | 'export' | 'approve' | 'reject' | 'upload';
  label: string;
}

export interface PageConfig {
  id: string;
  title: string;
  description: string;
  type: 'table' | 'form' | 'dashboard' | 'request_form';
  columns?: Column[];
  data?: any[];
  actions?: Action[];
}