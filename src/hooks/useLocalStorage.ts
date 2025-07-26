// This file is no longer needed as we're using Supabase for data persistence
// Keeping it for potential future use or migration purposes

import { useEffect } from 'react';
import { Task } from '../types/Task';

export function useLocalStorage(tasks: Task[], setTasks: (tasks: Task[]) => void) {
  // This hook is deprecated in favor of Supabase storage
  // Left empty to maintain compatibility
}