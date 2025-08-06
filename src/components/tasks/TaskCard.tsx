// Task Card Component with Swipe Actions
import { useState } from 'react';
import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Task, TaskStatus, TaskPriority } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Circle, 
  Calendar, 
  AlertTriangle, 
  Trash2,
  Edit3,
  Clock
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: Task;
  onToggleStatus: (id: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  isAnimating?: boolean;
}

export function TaskCard({ 
  task, 
  onToggleStatus, 
  onEdit, 
  onDelete,
  isAnimating = false 
}: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-150, -50, 0], [0.5, 1, 1]);
  const deleteOpacity = useTransform(x, [-150, -80, 0], [1, 0.7, 0]);

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    
    if (info.offset.x < -80) {
      // Trigger delete action
      x.set(-150);
      setTimeout(() => onDelete(task.id), 200);
    } else {
      // Snap back
      x.set(0);
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 'bg-destructive text-destructive-foreground';
      case TaskPriority.MEDIUM:
        return 'bg-warning text-warning-foreground';
      case TaskPriority.LOW:
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM d');
  };

  const isOverdue = task.dueDate && isPast(task.dueDate) && task.status === TaskStatus.OPEN;

  return (
    <div className="relative overflow-hidden">
      {/* Delete Action Background */}
      <motion.div
        className="absolute inset-0 bg-destructive text-destructive-foreground flex items-center justify-end px-6"
        style={{ opacity: deleteOpacity }}
      >
        <Trash2 className="w-5 h-5" />
      </motion.div>

      {/* Main Task Card */}
      <motion.div
        className={cn(
          'task-card relative bg-card',
          task.status === TaskStatus.COMPLETED && 'task-card completed',
          isDragging && 'cursor-grabbing'
        )}
        style={{ x, opacity }}
        drag={isAnimating ? false : 'x'}
        dragConstraints={{ left: -150, right: 0 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        whileTap={{ scale: 0.98 }}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -300 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-start gap-3">
          {/* Status Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="p-0 h-6 w-6 rounded-full hover:bg-transparent"
            onClick={() => onToggleStatus(task.id)}
          >
            {task.status === TaskStatus.COMPLETED ? (
              <CheckCircle className="w-5 h-5 text-task-completed" />
            ) : (
              <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
            )}
          </Button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className={cn(
                'font-medium text-sm leading-relaxed',
                task.status === TaskStatus.COMPLETED && 'line-through text-muted-foreground'
              )}>
                {task.title}
              </h3>
              
              {/* Priority Badge */}
              <Badge 
                variant="secondary" 
                className={cn(
                  'text-xs flex-shrink-0',
                  getPriorityColor(task.priority)
                )}
              >
                {task.priority}
              </Badge>
            </div>

            {/* Description */}
            {task.description && (
              <p className={cn(
                'text-xs text-muted-foreground mb-3 leading-relaxed',
                task.status === TaskStatus.COMPLETED && 'line-through'
              )}>
                {task.description}
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between">
              {/* Due Date */}
              {task.dueDate && (
                <div className={cn(
                  'flex items-center gap-1 text-xs',
                  isOverdue ? 'text-destructive' : 'text-muted-foreground'
                )}>
                  {isOverdue ? (
                    <AlertTriangle className="w-3 h-3" />
                  ) : (
                    <Calendar className="w-3 h-3" />
                  )}
                  <span>{formatDueDate(task.dueDate)}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  onClick={() => onEdit(task)}
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{format(task.createdAt, 'MMM d')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}