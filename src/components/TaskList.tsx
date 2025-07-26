import React from 'react';
import { TaskCard } from './TaskCard';
import { useTask } from '../context/TaskContext';
import { FileText } from 'lucide-react';

export function TaskList() {
  const { state } = useTask();
  const { filteredTasks } = state;

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
          <FileText className="h-10 w-10 text-violet-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3">Henüz görev yok</h3>
        <p className="text-slate-500 text-center max-w-md leading-relaxed">
          İlk görevinizi oluşturmak için "Yeni Görev" butonuna tıklayın veya filtreleri kontrol edin.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {filteredTasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}