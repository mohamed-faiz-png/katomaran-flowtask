// Task List Component with Pull-to-Refresh
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Task } from '@/types/task';
import { TaskCard } from './TaskCard';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: Task[];
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onRefresh: () => void;
  onCreateTask: () => void;
  isLoading?: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function TaskList({
  tasks,
  onToggleStatus,
  onEdit,
  onDelete,
  onRefresh,
  onCreateTask,
  isLoading = false,
  searchQuery,
  onSearchChange
}: TaskListProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);
  const isRefreshing = useRef(false);

  // Pull-to-refresh handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (containerRef.current?.scrollTop === 0 && !isRefreshing.current) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === 0 || isRefreshing.current) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;

    if (distance > 0 && containerRef.current?.scrollTop === 0) {
      e.preventDefault();
      const pullAmount = Math.min(distance * 0.5, 80);
      setPullDistance(pullAmount);
      setIsPulling(pullAmount > 60);
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 60 && !isRefreshing.current) {
      isRefreshing.current = true;
      setIsPulling(false);
      await onRefresh();
      isRefreshing.current = false;
    }
    
    setPullDistance(0);
    setIsPulling(false);
    touchStartY.current = 0;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Pull-to-Refresh Indicator */}
      {pullDistance > 0 && (
        <motion.div
          className="flex items-center justify-center py-4 text-muted-foreground"
          style={{ height: pullDistance }}
          animate={{ opacity: isPulling ? 1 : 0.5 }}
        >
          <motion.div
            animate={{ rotate: isPulling ? 360 : 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <RefreshCw className={cn(
              "w-5 h-5",
              isPulling && "text-primary"
            )} />
          </motion.div>
          <span className="ml-2 text-sm">
            {isPulling ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </motion.div>
      )}

      {/* Task List */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateY(${pullDistance}px)` }}
      >
        {isLoading && tasks.length === 0 ? (
          // Loading skeleton
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="task-card animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : tasks.length === 0 ? (
          // Empty state
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center"
              >
                <Plus className="w-8 h-8 text-muted-foreground" />
              </motion.div>
              <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-4 text-balance">
                {searchQuery 
                  ? `No tasks found for "${searchQuery}"`
                  : "Create your first task to get started"
                }
              </p>
              {!searchQuery && (
                <Button onClick={onCreateTask} variant="outline">
                  Create Task
                </Button>
              )}
            </div>
          </div>
        ) : (
          // Task list
          <div className="p-4 space-y-3">
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggleStatus={onToggleStatus}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isAnimating={isLoading}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <motion.button
        className="fab"
        onClick={onCreateTask}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.5 }}
      >
        <Plus className="w-6 h-6" />
      </motion.button>
    </div>
  );
}