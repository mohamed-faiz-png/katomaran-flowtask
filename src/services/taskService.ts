// Task Service - Business Logic Layer
import { Task, CreateTaskData, UpdateTaskData, TaskFilters, TaskStatus, TaskPriority } from '@/types/task';
import { taskRepository } from '@/repositories/taskRepository';

export class TaskService {
  private repository = taskRepository;

  async getAllTasks(filters?: TaskFilters): Promise<Task[]> {
    const tasks = await this.repository.getAll();
    return this.applyFilters(tasks, filters);
  }

  async getTaskById(id: string): Promise<Task | null> {
    return await this.repository.getById(id);
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    const task: Task = {
      id: this.generateId(),
      title: data.title.trim(),
      description: data.description?.trim(),
      dueDate: data.dueDate,
      status: TaskStatus.OPEN,
      priority: data.priority || TaskPriority.MEDIUM,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.repository.create(task);
  }

  async updateTask(id: string, data: UpdateTaskData): Promise<Task | null> {
    const existingTask = await this.repository.getById(id);
    if (!existingTask) {
      throw new Error('Task not found');
    }

    const updatedTask: Task = {
      ...existingTask,
      ...data,
      title: data.title?.trim() || existingTask.title,
      description: data.description?.trim() ?? existingTask.description,
      updatedAt: new Date()
    };

    return await this.repository.update(id, updatedTask);
  }

  async deleteTask(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }

  async toggleTaskStatus(id: string): Promise<Task | null> {
    const task = await this.repository.getById(id);
    if (!task) {
      throw new Error('Task not found');
    }

    const newStatus = task.status === TaskStatus.OPEN 
      ? TaskStatus.COMPLETED 
      : TaskStatus.OPEN;

    return await this.updateTask(id, { status: newStatus });
  }

  async getTaskStats(): Promise<{
    total: number;
    completed: number;
    open: number;
    overdue: number;
  }> {
    const tasks = await this.repository.getAll();
    const now = new Date();

    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === TaskStatus.COMPLETED).length,
      open: tasks.filter(t => t.status === TaskStatus.OPEN).length,
      overdue: tasks.filter(t => 
        t.status === TaskStatus.OPEN && 
        t.dueDate && 
        t.dueDate < now
      ).length
    };
  }

  private applyFilters(tasks: Task[], filters?: TaskFilters): Task[] {
    if (!filters) return tasks;

    let filtered = [...tasks];

    // Status filter
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }

    // Sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        const aValue = a[filters.sortBy!];
        const bValue = b[filters.sortBy!];
        
        let comparison = 0;
        if (aValue < bValue) comparison = -1;
        if (aValue > bValue) comparison = 1;
        
        return filters.sortOrder === 'desc' ? -comparison : comparison;
      });
    }

    return filtered;
  }

  private generateId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const taskService = new TaskService();