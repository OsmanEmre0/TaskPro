import { useEffect, useCallback } from 'react';
import { Task, TaskFilters, TaskStats } from '../types/Task';

export function useTaskFilters(
  tasks: Task[],
  filters: TaskFilters,
  setFilteredTasks: (tasks: Task[]) => void,
  setStats: (stats: TaskStats) => void
) {
  useEffect(() => {
    // Always start with all tasks
    let filtered = [...tasks];

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Filter by priority
    if (filters.priority && filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Filter by date range
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      
      filtered = filtered.filter(task => {
        const taskDate = new Date(task.dueDate);
        
        switch (filters.dateRange) {
          case 'today':
            return taskDate.toDateString() === today.toDateString();
          case 'week':
            const weekAhead = new Date(today);
            weekAhead.setDate(today.getDate() + 7);
            return taskDate >= today && taskDate <= weekAhead;
          case 'month':
            const monthAhead = new Date(today);
            monthAhead.setMonth(today.getMonth() + 1);
            return taskDate >= today && taskDate <= monthAhead;
          default:
            return true;
        }
      });
    }

    // Filter by search term
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm)
      );
    }

    // Always update filtered tasks, even if it's empty
    setFilteredTasks(filtered);

    // Calculate stats
    const stats: TaskStats = {
      total: tasks.length,
      completed: tasks.filter(task => task.status === 'completed').length,
      inProgress: tasks.filter(task => task.status === 'in-progress').length,
      todo: tasks.filter(task => task.status === 'todo').length
    };

    setStats(stats);
  }, [tasks, filters, setFilteredTasks, setStats]);
}