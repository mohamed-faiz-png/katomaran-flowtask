// Authentication Hook
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types/task';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Load current user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        setIsLoading(true);
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (err) {
        console.error('Error loading user:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const user = await authService.signInWithGoogle();
      setUser(user);
      toast({
        title: 'Welcome!',
        description: `Signed in as ${user.name}`
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign in';
      setError(message);
      toast({
        title: 'Sign In Failed',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      setUser(null);
      toast({
        title: 'Signed Out',
        description: 'Come back soon!'
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sign out';
      toast({
        title: 'Sign Out Failed',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return {
    user,
    isLoading,
    error,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  };
}