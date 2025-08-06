// Core Task Entity and Types

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  priority: TaskPriority;
}

export enum TaskStatus {
  OPEN = 'open',
  COMPLETED = 'completed'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface CreateTaskData {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: 'createdAt' | 'dueDate' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

// User Entity
export interface User {
  id: string;
  email: string;
  name: string;
  photoURL?: string;
  provider: 'google' | 'email';
  createdAt: Date;
}

// Auth State
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}