// Task Management Hook
import { useState, useEffect, useCallback } from 'react';
import { Task, CreateTaskData, UpdateTaskData, TaskFilters } from '@/types/task';
import { taskService } from '@/services/taskService';
import { useToast } from '@/hooks/use-toast';

export function useTasks(filters?: TaskFilters) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load tasks
  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await taskService.getAllTasks(filters);
      setTasks(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load tasks';
      setError(message);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, toast]);

  // Create task
  const createTask = useCallback(async (data: CreateTaskData) => {
    try {
      const newTask = await taskService.createTask(data);
      setTasks(prev => [newTask, ...prev]);
      toast({
        title: 'Success',
        description: 'Task created successfully'
      });
      return newTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw err;
    }
  }, [toast]);

  // Update task
  const updateTask = useCallback(async (id: string, data: UpdateTaskData) => {
    try {
      const updatedTask = await taskService.updateTask(id, data);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? updatedTask : task
        ));
        toast({
          title: 'Success',
          description: 'Task updated successfully'
        });
      }
      return updatedTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw err;
    }
  }, [toast]);

  // Delete task
  const deleteTask = useCallback(async (id: string) => {
    try {
      const success = await taskService.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id));
        toast({
          title: 'Success',
          description: 'Task deleted successfully'
        });
      }
      return success;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw err;
    }
  }, [toast]);

  // Toggle task status
  const toggleTaskStatus = useCallback(async (id: string) => {
    try {
      const updatedTask = await taskService.toggleTaskStatus(id);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? updatedTask : task
        ));
        toast({
          title: 'Success',
          description: `Task marked as ${updatedTask.status}`
        });
      }
      return updatedTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to toggle task status';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
      throw err;
    }
  }, [toast]);

  // Initial load
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Refresh function
  const refresh = useCallback(() => {
    loadTasks();
  }, [loadTasks]);

  return {
    tasks,
    isLoading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    refresh
  };
}