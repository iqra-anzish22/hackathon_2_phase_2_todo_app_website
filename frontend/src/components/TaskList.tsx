/**
 * TaskList component - displays a list of tasks with loading and empty states.
 */
import { Task } from '@/types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onTaskDeleted: (taskId: number) => void;
  onTaskUpdated: (task: Task) => void;
  loading?: boolean;
}

export default function TaskList({ tasks, onTaskDeleted, onTaskUpdated, loading = false }: TaskListProps) {
  // Show loading state
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <div style={{ fontSize: '18px' }}>Loading tasks...</div>
      </div>
    );
  }

  // Show empty state
  if (tasks.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <div style={{ fontSize: '20px', marginBottom: '10px' }}>📝</div>
        <div style={{ fontSize: '18px', marginBottom: '8px' }}>No tasks yet</div>
        <div style={{ fontSize: '14px' }}>Create your first task to get started!</div>
      </div>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onDeleted={onTaskDeleted}
          onUpdated={onTaskUpdated}
        />
      ))}
    </div>
  );
}
