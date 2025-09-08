import React, { useState } from 'react';
import { Edit2, Trash2, Clock, Flag, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { Task } from '../types/Task';
import { useTask } from '../context/TaskContext';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTask, deleteTask, openModal } = useTask();
  const [showConfirm, setShowConfirm] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-rose-700 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200';
      case 'medium': return 'text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200';
      case 'low': return 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200';
      default: return 'text-slate-700 bg-gradient-to-r from-slate-50 to-gray-50 border border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'in-progress': return <PlayCircle className="h-5 w-5 text-blue-500" />;
      default: return <Circle className="h-5 w-5 text-slate-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-800 border border-emerald-200';
      case 'in-progress': return 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-800 border border-blue-200';
      default: return 'bg-gradient-to-r from-slate-50 to-gray-50 text-slate-800 border border-slate-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    });
  };

  const isOverdue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== 'completed';
  };

  const toggleStatus = () => {
    let newStatus: Task['status'];
    switch (task.status) {
      case 'todo':
        newStatus = 'in-progress';
        break;
      case 'in-progress':
        newStatus = 'completed';
        break;
      case 'completed':
        newStatus = 'todo';
        break;
      default:
        newStatus = 'todo';
    }
    updateTask({ ...task, status: newStatus });
  };

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-md border-2 border-gray-300 p-5 hover:shadow-xl transition-all duration-300 backdrop-blur-sm hover:border-violet-400 group ${
        task.status === 'completed' ? 'opacity-75' : ''
      }`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleStatus}
              className="hover:scale-110 transition-transform duration-200 p-1 rounded-full hover:bg-violet-50"
            >
              {getStatusIcon(task.status)}
            </button>
            <h3 className={`font-semibold text-slate-800 ${
              task.status === 'completed' ? 'line-through' : ''
            }`}>
              {task.title}
            </h3>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => openModal(task)}
              className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Düzenle"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowConfirm(true)}
              className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
              title="Sil"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {task.description && (
          <p className="text-slate-600 text-sm mb-4 line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
              <Flag className="h-3 w-3 mr-1" />
              {task.priority === 'high' ? 'Yüksek' : task.priority === 'medium' ? 'Orta' : 'Düşük'}
            </span>
            
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              task.status === 'todo'
                ? 'bg-amber-50/80 text-amber-700 backdrop-blur-sm'
                : getStatusColor(task.status)
            }`}>
              {task.status === 'completed' ? 'Tamamlandı' : 
               task.status === 'in-progress' ? 'Devam Ediyor' : 'Yapılacak'}
            </span>
          </div>
          
          <div className={`flex items-center text-xs px-2 py-1 rounded-lg ${
            isOverdue() ? 'text-rose-600 bg-rose-50' : 'text-slate-500 bg-slate-50'
          }`}>
            <Clock className="h-3 w-3 mr-1" />
            {formatDate(task.dueDate)}
          </div>
        </div>
      </div>
      {/* Silme Onay Popup'ı */}
      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 animate-fade-in" onClick={() => setShowConfirm(false)}>
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm relative flex flex-col items-center border border-gray-100 animate-pop-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 mb-4 shadow-lg">
              <Trash2 className="h-8 w-8 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-800 text-center">Görevi silmek istediğinize emin misiniz?</h3>
            <p className="text-slate-500 text-center mb-6">Bu işlem geri alınamaz.</p>
            <div className="flex justify-center gap-3 w-full">
              <button
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 font-semibold transition-all duration-150 shadow-sm"
                onClick={() => setShowConfirm(false)}
              >
                Hayır
              </button>
              <button
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 text-white hover:from-rose-600 hover:to-rose-700 font-semibold transition-all duration-150 shadow-lg"
                onClick={() => { deleteTask(task.id); setShowConfirm(false); }}
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}