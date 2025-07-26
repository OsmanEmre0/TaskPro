import { supabase } from '../lib/supabase';
import { Task } from '../types/Task';
import { Database } from '../lib/supabase';

type TaskRow = Database['public']['Tables']['user_tasks']['Row'];
type TaskInsert = Database['public']['Tables']['user_tasks']['Insert'];
type TaskUpdate = Database['public']['Tables']['user_tasks']['Update'];

// Convert database row to Task type
const convertToTask = (row: TaskRow): Task => ({
  id: row.id,
  title: row.title,
  description: row.description,
  priority: row.priority,
  status: row.status,
  dueDate: row.due_date,
  category: row.category,
  createdAt: row.created_at,
  updatedAt: row.updated_at
});

// Convert Task to database insert format
const convertToInsert = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, userId: string): TaskInsert => ({
  user_id: userId,
  title: task.title,
  description: task.description,
  priority: task.priority,
  status: task.status,
  due_date: task.dueDate,
  category: task.category || ''
});

// Convert Task to database update format
const convertToUpdate = (task: Task): TaskUpdate => ({
  title: task.title,
  description: task.description,
  priority: task.priority,
  status: task.status,
  due_date: task.dueDate,
  category: task.category || '',
  updated_at: new Date().toISOString()
});

export const taskService = {
  async getTasks(userId: string): Promise<Task[]> {
    const { data, error } = await supabase
      .from('user_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }

    return data.map(convertToTask);
  },

  async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>, userId: string): Promise<Task> {
    const taskInsert = convertToInsert(task, userId);
    
    const { data, error } = await supabase
      .from('user_tasks')
      .insert(taskInsert)
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      throw error;
    }

    return convertToTask(data);
  },

  async updateTask(task: Task): Promise<Task> {
    const taskUpdate = convertToUpdate(task);
    
    const { data, error } = await supabase
      .from('user_tasks')
      .update(taskUpdate)
      .eq('id', task.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }

    return convertToTask(data);
  },

  async deleteTask(taskId: string): Promise<void> {
    const { error } = await supabase
      .from('user_tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
};