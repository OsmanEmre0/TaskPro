export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'todo' | 'in-progress' | 'completed';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  inProgress: number;
  todo: number;
}

export interface TaskFilters {
  status?: 'all' | 'todo' | 'in-progress' | 'completed';
  priority?: 'all' | 'low' | 'medium' | 'high';
  dateRange?: 'all' | 'today' | 'week' | 'month';
  search: string;
}