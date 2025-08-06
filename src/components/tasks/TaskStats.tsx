// Task Statistics Component
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Circle, AlertTriangle, Target } from 'lucide-react';

interface TaskStatsProps {
  stats: {
    total: number;
    completed: number;
    open: number;
    overdue: number;
  };
}

export function TaskStats({ stats }: TaskStatsProps) {
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const statItems = [
    {
      label: 'Total',
      value: stats.total,
      icon: Target,
      color: 'text-foreground',
      bgColor: 'bg-muted'
    },
    {
      label: 'Open',
      value: stats.open,
      icon: Circle,
      color: 'text-task-open',
      bgColor: 'bg-task-open/10'
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-task-completed',
      bgColor: 'bg-task-completed/10'
    },
    {
      label: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      color: 'text-task-overdue',
      bgColor: 'bg-task-overdue/10'
    }
  ];

  return (
    <div className="p-4 space-y-4">
      {/* Completion Rate */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">Progress</h3>
            <span className="text-sm text-muted-foreground">
              {completionRate.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <motion.div
              className="bg-task-completed h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        {statItems.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="text-center">
              <CardContent className="p-3">
                <div className={`w-8 h-8 mx-auto mb-2 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}