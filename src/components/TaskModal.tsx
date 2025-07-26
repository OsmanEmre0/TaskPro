import React, { useState, useEffect } from 'react';
import { X, Calendar, Flag, FileText } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { Task } from '../types/Task';

export function TaskModal() {
  const { state, addTask, updateTask, closeModal } = useTask();
  const { isModalOpen, selectedTask } = state;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    status: 'todo' as Task['status'],
    dueDate: '',
    category: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title,
        description: selectedTask.description,
        priority: selectedTask.priority,
        status: selectedTask.status,
        dueDate: selectedTask.dueDate.split('T')[0],
        category: selectedTask.category || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: new Date().toISOString().split('T')[0],
        category: ''
      });
    }
    setErrors({});
  }, [selectedTask, isModalOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Görev başlığı gereklidir';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Bitiş tarihi gereklidir';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: new Date(formData.dueDate).toISOString(),
      category: formData.category.trim()
    };

    if (selectedTask) {
      updateTask({ ...selectedTask, ...taskData });
    } else {
      addTask(taskData);
    }

    closeModal();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto backdrop-blur-sm border border-gray-200/50">
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-white to-gray-50/30">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {selectedTask ? 'Görev Düzenle' : 'Yeni Görev'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-xl"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="flex items-center text-sm font-semibold text-slate-700 mb-2">
              <FileText className="h-4 w-4 mr-2" />
              Görev Başlığı *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200 ${
                errors.title ? 'border-rose-300' : 'border-gray-200'
              }`}
              placeholder="Görev başlığını girin..."
            />
            {errors.title && <p className="mt-1 text-sm text-rose-600 font-medium">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-2">
              Açıklama
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200 resize-none"
              placeholder="Görev açıklamasını girin..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                <Flag className="h-4 w-4 mr-2" />
                Öncelik
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200"
              >
                <option value="low">Düşük</option>
                <option value="medium">Orta</option>
                <option value="high">Yüksek</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-semibold text-slate-700 mb-2">
                Durum
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200"
              >
                <option value="todo">Yapılacak</option>
                <option value="in-progress">Devam Ediyor</option>
                <option value="completed">Tamamlandı</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dueDate" className="flex items-center text-sm font-semibold text-slate-700 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              Bitiş Tarihi *
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200 ${
                errors.dueDate ? 'border-rose-300' : 'border-gray-200'
              }`}
            />
            {errors.dueDate && <p className="mt-1 text-sm text-rose-600 font-medium">{errors.dueDate}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-2">
              Kategori
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200"
              placeholder="Kategori girin..."
            />
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={closeModal}
              className="flex-1 px-6 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200 font-medium"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {selectedTask ? 'Güncelle' : 'Oluştur'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}