import React, { useMemo, useState } from 'react';
import { useTask } from '../context/TaskContext';
import { Task } from '../types/Task';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const FILTERS = [
  { key: 'week', label: 'Bu Hafta' },
  { key: 'month', label: 'Bu Ay' },
  { key: 'all', label: 'Tümü' }
];

const COLORS = [
  '#10b981', // green - completed
  '#3b82f6', // blue - in-progress
  '#f97316'  // orange - todo
];

function filterTasksByDate(tasks: Task[], filter: string): Task[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (filter === 'week') {
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return tasks.filter((task: Task) => {
      const d = new Date(task.dueDate);
      return d >= startOfWeek && d <= endOfWeek;
    });
  }
  if (filter === 'month') {
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
    return tasks.filter((task: Task) => {
      const d = new Date(task.dueDate);
      return d >= startOfMonth && d <= endOfMonth;
    });
  }
  return tasks;
}

const Statistics: React.FC = () => {
  const { state } = useTask();
  const { tasks } = state;
  const [dateFilter, setDateFilter] = useState('week');

  const filteredTasks = useMemo(() => filterTasksByDate(tasks, dateFilter), [tasks, dateFilter]);

  const completedCount = filteredTasks.filter((t: Task) => t.status === 'completed').length;
  const inProgressCount = filteredTasks.filter((t: Task) => t.status === 'in-progress').length;
  const todoCount = filteredTasks.filter((t: Task) => t.status === 'todo').length;


  // Bar chart için tüm durumları göster (0 olsa bile)
  const barChartData = [
    { name: 'Tamamlandı', value: completedCount, fill: COLORS[0] },
    { name: 'Devam Ediyor', value: inProgressCount, fill: COLORS[1] },
    { name: 'Yapılacak', value: todoCount, fill: COLORS[2] }
  ];

  // Pie chart verisini her durumda sabit tut (0 değerler de dahil)
  // Böylece "Tümü" seçiliyken de renkler ve efsane (legend) doğru eşleşir
  const pieChartData = [
    { name: 'Tamamlandı', value: completedCount, fill: COLORS[0] },
    { name: 'Devam Ediyor', value: inProgressCount, fill: COLORS[1] },
    { name: 'Yapılacak', value: todoCount, fill: COLORS[2] }
  ];

  const hasBarData = barChartData.some(item => item.value > 0);


  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-violet-700">Görev İstatistikleri</h1>
      <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setDateFilter(f.key)}
            className={`px-3 sm:px-4 py-2 rounded-xl text-sm sm:text-base font-medium border transition-all duration-200 ${dateFilter === f.key ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white border-violet-500' : 'bg-white text-violet-700 border-violet-200 hover:bg-violet-50'}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center w-full">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-700">Görev Durum Dağılımı</h2>
          <div className="w-full h-64 sm:h-72 md:h-80 relative">
            {hasBarData ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                    <XAxis dataKey="name" tick={false} axisLine={true} />
                    <YAxis allowDecimals={false} />
                                      <Tooltip  
                    cursor={{ fill: 'transparent' }}
                    formatter={(adet: number, name) => [`${adet}`, name as string]}
                    labelFormatter={(label: string) => label}
                  />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={true} animationBegin={0} animationDuration={800}>
                      {barChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="absolute inset-x-0 bottom-1 flex items-center justify-center gap-2 px-1 flex-wrap text-xs sm:text-sm">
                  {barChartData.map((item, index) => (
                    <div key={`bar-legend-${index}`} className="flex items-center gap-2">
                      <span
                        className="inline-block w-3 h-3 rounded-sm"
                        style={{ backgroundColor: item.fill as string }}
                      />
                      <span style={{ color: item.fill as string }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">📊</div>
                  <p>Bu dönemde görev bulunmuyor</p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col items-center w-full">
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-slate-700">Oranlar</h2>
          <div className="w-full h-64 sm:h-72 md:h-80">
            <div className="relative w-full h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 20, right: 20, bottom: 40, left: 20 }}>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={20}
                    paddingAngle={2}
                                            label={({ value, percent }) => (value && value > 0 && percent) ? `${(percent * 100).toFixed(0)}%` : ''}
                    labelLine={false}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-pie-${index}`} fill={entry.fill || COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                                        <Tooltip 
                        formatter={(value: number, name) => [`${value}`, name as string]}
                      />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-x-0 bottom-1 flex items-center justify-center gap-2 px-1 flex-wrap text-xs sm:text-sm">
                {pieChartData.map((item, index) => (
                  <div key={`pie-legend-${index}`} className="flex items-center gap-2">
                    <span
                      className="inline-block w-3 h-3 rounded-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span style={{ color: COLORS[index % COLORS.length] }}>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6 flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-center justify-between">
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl font-bold text-emerald-600">{completedCount}</span>
          <span className="text-xs sm:text-sm text-slate-600">Tamamlanan Görev</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl font-bold text-blue-600">{inProgressCount}</span>
          <span className="text-xs sm:text-sm text-slate-600">Devam Eden Görev</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl font-bold text-orange-600">{todoCount}</span>
          <span className="text-xs sm:text-sm text-slate-600">Yapılacak Görev</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xl sm:text-2xl font-bold text-violet-700">{filteredTasks.length}</span>
          <span className="text-xs sm:text-sm text-slate-600">Toplam</span>
        </div>
      </div>
    </div>
  );
};

export { Statistics }; 