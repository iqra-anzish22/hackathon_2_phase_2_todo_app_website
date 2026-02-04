'use client';

/**
 * Task list page - displays all tasks for the authenticated user.
 * Allows creating new tasks and viewing/editing existing ones.
 */
import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { ApiError } from '@/types/errors';
import { apiRequest } from '@/lib/api';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import ErrorMessage from '@/components/ErrorMessage';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await apiRequest<Task[]>('/api/tasks');
      setTasks(data);
    } catch (err) {
      if (err && typeof err === 'object' && 'error_code' in err) {
        setError(err as ApiError);
      } else {
        setError({
          error_code: 'UNKNOWN_ERROR',
          message: 'Failed to load tasks',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
    setShowForm(false);
  };

  const handleTaskDeleted = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleTaskUpdated = (updatedTask: Task) => {
    setTasks(tasks.map(task =>
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>My Tasks</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {showForm ? 'Cancel' : 'New Task'}
        </button>
      </div>

      {showForm && (
        <div style={{ marginBottom: '20px' }}>
          <TaskForm onTaskCreated={handleTaskCreated} />
        </div>
      )}

      {error && (
        <ErrorMessage error={error} onRetry={fetchTasks} />
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <div style={{ fontSize: '18px' }}>Loading tasks...</div>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          onTaskDeleted={handleTaskDeleted}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}
