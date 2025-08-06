// Authentication Service
import { User } from '@/types/task';

export interface AuthService {
  signInWithGoogle(): Promise<User>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

class MockAuthService implements AuthService {
  private readonly STORAGE_KEY = 'katomaran-flowtask-user';

  async signInWithGoogle(): Promise<User> {
    // Simulate Google OAuth flow
    await this.simulateNetworkDelay();
    
    // Mock user data
    const user: User = {
      id: 'user_' + Date.now(),
      email: 'demo@katomaran.com',
      name: 'Demo User',
      photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      provider: 'google',
      createdAt: new Date()
    };

    // Store user in localStorage
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    
    return user;
  }

  async signOut(): Promise<void> {
    await this.simulateNetworkDelay();
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = localStorage.getItem(this.STORAGE_KEY);
      if (!userData) return null;
      
      const user = JSON.parse(userData);
      return {
        ...user,
        createdAt: new Date(user.createdAt)
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  private async simulateNetworkDelay(): Promise<void> {
    return new Promise(resolve => {
      setTimeout(resolve, 1000 + Math.random() * 1000); // 1-2 seconds
    });
  }
}

export const authService = new MockAuthService();