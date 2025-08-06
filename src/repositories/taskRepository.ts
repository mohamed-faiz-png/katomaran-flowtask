// Task Repository - Data Access Layer
import { Task } from '@/types/task';

export interface TaskRepository {
  getAll(): Promise<Task[]>;
  getById(id: string): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(id: string, task: Task): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
  clear(): Promise<void>;
}

class LocalStorageTaskRepository implements TaskRepository {
  private readonly STORAGE_KEY = 'katomaran-flowtask-tasks';

  async getAll(): Promise<Task[]> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return [];
      
      const tasks = JSON.parse(data);
      // Convert date strings back to Date objects
      return tasks.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined
      }));
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      return [];
    }
  }

  async getById(id: string): Promise<Task | null> {
    const tasks = await this.getAll();
    return tasks.find(task => task.id === id) || null;
  }

  async create(task: Task): Promise<Task> {
    const tasks = await this.getAll();
    tasks.push(task);
    await this.saveTasks(tasks);
    return task;
  }

  async update(id: string, updatedTask: Task): Promise<Task | null> {
    const tasks = await this.getAll();
    const index = tasks.findIndex(task => task.id === id);
    
    if (index === -1) return null;
    
    tasks[index] = updatedTask;
    await this.saveTasks(tasks);
    return updatedTask;
  }

  async delete(id: string): Promise<boolean> {
    const tasks = await this.getAll();
    const filteredTasks = tasks.filter(task => task.id !== id);
    
    if (filteredTasks.length === tasks.length) return false;
    
    await this.saveTasks(filteredTasks);
    return true;
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private async saveTasks(tasks: Task[]): Promise<void> {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
      throw new Error('Failed to save tasks');
    }
  }
}

// Export singleton instance
export const taskRepository = new LocalStorageTaskRepository();