import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Task, TaskFilters, TaskStats } from '../types/Task';
import { useAuth } from './AuthContext';
import { taskService } from '../services/taskService';

interface TaskState {
  tasks: Task[];
  filteredTasks: Task[];
  filters: TaskFilters;
  stats: TaskStats;
  selectedTask: Task | null;
  isModalOpen: boolean;
  viewMode: 'list' | 'calendar' | 'board';
}

type TaskAction =
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_FILTERS'; payload: Partial<TaskFilters> }
  | { type: 'SET_FILTERED_TASKS'; payload: Task[] }
  | { type: 'SET_STATS'; payload: TaskStats }
  | { type: 'SET_SELECTED_TASK'; payload: Task | null }
  | { type: 'SET_MODAL_OPEN'; payload: boolean }
  | { type: 'SET_VIEW_MODE'; payload: 'list' | 'calendar' | 'board' };

const initialState: TaskState = {
  tasks: [],
  filteredTasks: [],
  filters: {
    status: 'all',
    priority: 'all',
    dateRange: 'all',
    search: ''
  },
  stats: { total: 0, completed: 0, inProgress: 0, todo: 0 },
  selectedTask: null,
  isModalOpen: false,
  viewMode: 'list'
};

const TaskContext = createContext<{
  state: TaskState;
  dispatch: React.Dispatch<TaskAction>;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  setFilters: (filters: Partial<TaskFilters>) => void;
  openModal: (task?: Task) => void;
  closeModal: () => void;
  setViewMode: (mode: 'list' | 'calendar' | 'board') => void;
} | undefined>(undefined);

function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_TASKS':
      return { ...state, tasks: action.payload };
    case 'ADD_TASK':
      const newTasks = [...state.tasks, action.payload];
      return { 
        ...state, 
        tasks: newTasks,
        // Also update filtered tasks if no active filters
        filteredTasks: state.filters.status === 'all' && 
                      state.filters.priority === 'all' && 
                      state.filters.dateRange === 'all' && 
                      !state.filters.search.trim() 
                      ? newTasks 
                      : state.filteredTasks
      };
    case 'UPDATE_TASK':
      const updatedTasks = state.tasks.map(task =>
        task.id === action.payload.id ? action.payload : task
      );
      return {
        ...state,
        tasks: updatedTasks,
        // Also update filtered tasks if no active filters
        filteredTasks: state.filters.status === 'all' && 
                      state.filters.priority === 'all' && 
                      state.filters.dateRange === 'all' && 
                      !state.filters.search.trim() 
                      ? updatedTasks 
                      : state.filteredTasks.map(task =>
                          task.id === action.payload.id ? action.payload : task
                        )
      };
    case 'DELETE_TASK':
      const remainingTasks = state.tasks.filter(task => task.id !== action.payload);
      return {
        ...state,
        tasks: remainingTasks,
        filteredTasks: state.filteredTasks.filter(task => task.id !== action.payload)
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_FILTERED_TASKS':
      return { ...state, filteredTasks: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    case 'SET_SELECTED_TASK':
      return { ...state, selectedTask: action.payload };
    case 'SET_MODAL_OPEN':
      return { ...state, isModalOpen: action.payload };
    case 'SET_VIEW_MODE':
      return { ...state, viewMode: action.payload };
    default:
      return state;
  }
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(taskReducer, initialState);
  const { user } = useAuth();

  // Load tasks when user changes
  useEffect(() => {
    if (user) {
      loadTasks();
    } else {
      // Clear tasks when user logs out
      dispatch({ type: 'SET_TASKS', payload: [] });
      dispatch({ type: 'SET_FILTERED_TASKS', payload: [] });
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;
    
    try {
      const tasks = await taskService.getTasks(user.id);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;
    
    try {
      const newTask = await taskService.createTask(taskData, user.id);
      dispatch({ type: 'ADD_TASK', payload: newTask });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    try {
      const task = await taskService.updateTask(updatedTask);
      dispatch({ type: 'UPDATE_TASK', payload: task });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      dispatch({ type: 'DELETE_TASK', payload: id });
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const setFilters = (filters: Partial<TaskFilters>) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const openModal = (task?: Task) => {
    dispatch({ type: 'SET_SELECTED_TASK', payload: task || null });
    dispatch({ type: 'SET_MODAL_OPEN', payload: true });
  };

  const closeModal = () => {
    dispatch({ type: 'SET_MODAL_OPEN', payload: false });
    dispatch({ type: 'SET_SELECTED_TASK', payload: null });
  };

  const setViewMode = (mode: 'list' | 'calendar' | 'board') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  return (
    <TaskContext.Provider value={{
      state,
      dispatch,
      addTask,
      updateTask,
      deleteTask,
      setFilters,
      openModal,
      closeModal,
      setViewMode
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTask() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
}