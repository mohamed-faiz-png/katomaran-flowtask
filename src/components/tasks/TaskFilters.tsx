// Task Filters Component
import { TaskStatus, TaskPriority, TaskFilters as TaskFiltersType } from '@/types/task';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuLabel, 
  DropdownMenuRadioGroup, 
  DropdownMenuRadioItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Filter, SortAsc, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  taskCounts: {
    all: number;
    open: number;
    completed: number;
    high: number;
    medium: number;
    low: number;
  };
}

export function TaskFilters({ filters, onFiltersChange, taskCounts }: TaskFiltersProps) {
  const hasActiveFilters = filters.status || filters.priority || filters.sortBy;

  const updateFilter = (key: keyof TaskFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: filters.search // Keep search
    });
  };

  return (
    <div className="p-4 border-b border-border bg-background/95 backdrop-blur-sm">
      {/* Status Filter Tabs */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
        <Button
          variant={!filters.status ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilter('status', undefined)}
          className="flex-shrink-0"
        >
          All
          <Badge variant="secondary" className="ml-2">
            {taskCounts.all}
          </Badge>
        </Button>
        
        <Button
          variant={filters.status === TaskStatus.OPEN ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilter('status', TaskStatus.OPEN)}
          className="flex-shrink-0"
        >
          Open
          <Badge variant="secondary" className="ml-2">
            {taskCounts.open}
          </Badge>
        </Button>
        
        <Button
          variant={filters.status === TaskStatus.COMPLETED ? "default" : "outline"}
          size="sm"
          onClick={() => updateFilter('status', TaskStatus.COMPLETED)}
          className="flex-shrink-0"
        >
          Completed
          <Badge variant="secondary" className="ml-2">
            {taskCounts.completed}
          </Badge>
        </Button>
      </div>

      {/* Advanced Filters */}
      <div className="flex items-center gap-2">
        {/* Priority Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className={cn(
                "flex-shrink-0",
                filters.priority && "border-primary"
              )}
            >
              <Filter className="w-4 h-4 mr-1" />
              Priority
              {filters.priority && (
                <Badge variant="secondary" className="ml-1">
                  {filters.priority}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Filter by Priority</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filters.priority || ''}
              onValueChange={(value) => updateFilter('priority', value || undefined)}
            >
              <DropdownMenuRadioItem value="">
                All Priorities
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={TaskPriority.HIGH}>
                High ({taskCounts.high})
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={TaskPriority.MEDIUM}>
                Medium ({taskCounts.medium})
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value={TaskPriority.LOW}>
                Low ({taskCounts.low})
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className={cn(
                "flex-shrink-0",
                filters.sortBy && "border-primary"
              )}
            >
              <SortAsc className="w-4 h-4 mr-1" />
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={filters.sortBy || ''}
              onValueChange={(value) => updateFilter('sortBy', value || undefined)}
            >
              <DropdownMenuRadioItem value="">
                Default
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="createdAt">
                Created Date
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dueDate">
                Due Date
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="priority">
                Priority
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Sort Order */}
        {filters.sortBy && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilter('sortOrder', filters.sortOrder === 'asc' ? 'desc' : 'asc')}
            className="flex-shrink-0"
          >
            {filters.sortOrder === 'desc' ? '↓' : '↑'}
          </Button>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="flex-shrink-0 text-muted-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}