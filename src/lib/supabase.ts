import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      user_tasks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string;
          priority: 'low' | 'medium' | 'high';
          status: 'todo' | 'in-progress' | 'completed';
          due_date: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string;
          priority?: 'low' | 'medium' | 'high';
          status?: 'todo' | 'in-progress' | 'completed';
          due_date: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string;
          priority?: 'low' | 'medium' | 'high';
          status?: 'todo' | 'in-progress' | 'completed';
          due_date?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};