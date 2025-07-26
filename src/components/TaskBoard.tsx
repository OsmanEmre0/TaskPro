import React from 'react';
import { TaskCard } from './TaskCard';
import { useTask } from '../context/TaskContext';
import { Task } from '../types/Task';
import { CheckSquare } from 'lucide-react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';

interface SortableTaskCardProps {
  task: Task;
}

function SortableTaskCard({ task }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard task={task} />
    </div>
  );
}

interface DroppableColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
  children: React.ReactNode;
}

function DroppableColumn({ id, title, tasks, color, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-2xl border-2 border-dashed ${color} p-5 min-h-[400px] relative transition-all duration-200 ${isOver ? 'ring-4 ring-violet-200/60' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        {id === 'todo' ? (
          <>
            <h3 className="font-bold text-amber-700 text-lg">{title}</h3>
            <span className="ml-2 bg-white/80 backdrop-blur-sm text-slate-700 text-sm px-3 py-1 rounded-full shadow-sm border border-gray-200/50">
              {tasks.length}
            </span>
          </>
        ) : id === 'in-progress' ? (
          <>
            <h3 className="font-bold text-blue-700 text-lg">{title}</h3>
            <span className="ml-2 bg-white/80 backdrop-blur-sm text-slate-700 text-sm px-3 py-1 rounded-full shadow-sm border border-gray-200/50">
              {tasks.length}
            </span>
          </>
        ) : (
          <>
            <h3 className="font-bold text-emerald-700 text-lg">{title}</h3>
            <span className="ml-2 bg-white/80 backdrop-blur-sm text-slate-700 text-sm px-3 py-1 rounded-full shadow-sm border border-gray-200/50">
              {tasks.length}
            </span>
          </>
        )}
      </div>
      <div className="space-y-4">
        {children}
        {tasks.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <div className="w-16 h-16 mx-auto mb-4 bg-white/50 rounded-full flex items-center justify-center">
              <CheckSquare className="h-8 w-8 text-slate-300" />
            </div>
            <p className="text-sm font-medium">Bu sütunda görev yok</p>
          </div>
        )}
      </div>
      {isOver && (
        <div className="absolute inset-0 pointer-events-none rounded-2xl ring-4 ring-violet-200/60 z-10"></div>
      )}
    </div>
  );
}

export function TaskBoard() {
  const { state, updateTask } = useTask();
  const { filteredTasks } = state;
  const [activeTask, setActiveTask] = React.useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const columns = [
    { 
      id: 'todo', 
      title: 'Yapılacak', 
      tasks: filteredTasks.filter(task => task.status === 'todo'),
      color: 'border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-yellow-50/30 backdrop-blur-sm'
    },
    { 
      id: 'in-progress', 
      title: 'Devam Ediyor', 
      tasks: filteredTasks.filter(task => task.status === 'in-progress'),
      color: 'border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 backdrop-blur-sm'
    },
    { 
      id: 'completed', 
      title: 'Tamamlandı', 
      tasks: filteredTasks.filter(task => task.status === 'completed'),
      color: 'border-emerald-200/50 bg-gradient-to-br from-emerald-50/50 to-green-50/30 backdrop-blur-sm'
    }
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const task = filteredTasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    let newStatus = over.id as string;

    // Eğer bir task'ın üstüne değil de doğrudan sütuna bırakıldıysa, sütun id'sini kullan
    if (!['todo', 'in-progress', 'completed'].includes(newStatus)) {
      // over.id bir task id'si ise, o task'ın bulunduğu sütunun id'sini bul
      const overTask = filteredTasks.find(t => t.id === newStatus);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    const task = filteredTasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      updateTask({ ...task, status: newStatus as Task['status'] });
    }
    
    setActiveTask(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <DroppableColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={column.tasks}
            color={column.color}
          >
            <SortableContext
              items={column.tasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              {column.tasks.map(task => (
                <SortableTaskCard key={task.id} task={task} />
              ))}
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <TaskCard task={activeTask} /> : null}
      </DragOverlay>
    </DndContext>
  );
}