// Main Task Application Component
import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Task, TaskFilters, CreateTaskData, UpdateTaskData, TaskPriority } from '@/types/task';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { Header } from '@/components/layout/Header';
import { TaskList } from '@/components/tasks/TaskList';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskStats } from '@/components/tasks/TaskStats';
import { TaskFilters as TaskFiltersComponent } from '@/components/tasks/TaskFilters';
import { taskService } from '@/services/taskService';

export function TaskApp() {
  const auth = useAuth();
  const [filters, setFilters] = useState<TaskFilters>({});
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { 
    tasks, 
    isLoading, 
    createTask, 
    updateTask, 
    deleteTask, 
    toggleTaskStatus, 
    refresh 
  } = useTasks(filters);

  // Task statistics
  const taskStats = useMemo(() => {
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      open: tasks.filter(t => t.status === 'open').length,
      overdue: tasks.filter(t => {
        const now = new Date();
        return t.status === 'open' && t.dueDate && t.dueDate < now;
      }).length
    };
  }, [tasks]);

  // Task counts for filters
  const taskCounts = useMemo(() => {
    const allTasks = tasks;
    return {
      all: allTasks.length,
      open: allTasks.filter(t => t.status === 'open').length,
      completed: allTasks.filter(t => t.status === 'completed').length,
      high: allTasks.filter(t => t.priority === TaskPriority.HIGH).length,
      medium: allTasks.filter(t => t.priority === TaskPriority.MEDIUM).length,
      low: allTasks.filter(t => t.priority === TaskPriority.LOW).length,
    };
  }, [tasks]);

  // Handlers
  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleTaskSubmit = async (data: CreateTaskData | UpdateTaskData) => {
    setIsSubmitting(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, data as UpdateTaskData);
      } else {
        await createTask(data as CreateTaskData);
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      // Error is handled in the hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchChange = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };

  const handleFiltersChange = (newFilters: TaskFilters) => {
    setFilters(newFilters);
  };

  // Loading state for auth
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Authentication screen
  if (!auth.isAuthenticated) {
    return (
      <AuthScreen 
        onSignIn={auth.signInWithGoogle}
        isLoading={auth.isLoading}
      />
    );
  }

  // Main app
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <Header 
        user={auth.user!}
        onSignOut={auth.signOut}
        onStatsToggle={() => setShowStats(!showStats)}
        showStats={showStats}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Stats Panel */}
        <AnimatePresence>
          {showStats && (
            <TaskStats stats={taskStats} />
          )}
        </AnimatePresence>

        {/* Filters */}
        <TaskFiltersComponent
          filters={filters}
          onFiltersChange={handleFiltersChange}
          taskCounts={taskCounts}
        />

        {/* Task List */}
        <div className="flex-1 overflow-hidden">
          <TaskList
            tasks={tasks}
            onToggleStatus={toggleTaskStatus}
            onEdit={handleEditTask}
            onDelete={deleteTask}
            onRefresh={refresh}
            onCreateTask={handleCreateTask}
            isLoading={isLoading}
            searchQuery={filters.search || ''}
            onSearchChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onSubmit={handleTaskSubmit}
            onCancel={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
            isSubmitting={isSubmitting}
          />
        )}
      </AnimatePresence>
    </div>
  );
}