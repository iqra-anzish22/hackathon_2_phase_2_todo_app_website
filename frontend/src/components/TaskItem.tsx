/**
 * TaskItem component - displays a single task in the list.
 * Includes delete functionality, completion toggle, and link to detail view.
 */
import { Task } from '@/types/task';
import { ApiError } from '@/types/errors';
import { apiRequest } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TaskItemProps {
  task: Task;
  onDeleted: (taskId: number) => void;
  onUpdated: (task: Task) => void;
}

export default function TaskItem({ task, onDeleted, onUpdated }: TaskItemProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      setDeleting(true);
      setError(null);
      await apiRequest(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });
      onDeleted(task.id);
    } catch (err) {
      if (err && typeof err === 'object' && 'error_code' in err) {
        const apiError = err as ApiError;
        setError(apiError.message);
      } else {
        setError('Failed to delete task');
      }
      setDeleting(false);
    }
  };

  const handleToggleComplete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    try {
      setToggling(true);
      setError(null);
      const updatedTask = await apiRequest<Task>(`/api/tasks/${task.id}/complete`, {
        method: 'PATCH',
      });
      onUpdated(updatedTask);
    } catch (err) {
      if (err && typeof err === 'object' && 'error_code' in err) {
        const apiError = err as ApiError;
        setError(apiError.message);
      } else {
        setError('Failed to toggle task completion');
      }
    } finally {
      setToggling(false);
    }
  };

  const handleClick = () => {
    router.push(`/tasks/${task.id}`);
  };

  return (
    <div
      onClick={handleClick}
      style={{
        padding: '15px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        backgroundColor: task.completed ? '#f0f8f0' : 'white',
        transition: 'box-shadow 0.2s',
        opacity: task.completed ? 0.8 : 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {error && (
        <div style={{
          padding: '8px',
          marginBottom: '10px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33',
          fontSize: '14px',
        }}>
          {error}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div style={{ display: 'flex', alignItems: 'start', flex: 1, gap: '12px' }}>
          <button
            onClick={handleToggleComplete}
            disabled={toggling}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: '2px solid #0070f3',
              backgroundColor: task.completed ? '#0070f3' : 'white',
              cursor: toggling ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '14px',
              flexShrink: 0,
              marginTop: '2px',
            }}
          >
            {task.completed && '✓'}
          </button>
          <div style={{ flex: 1 }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '18px',
              textDecoration: task.completed ? 'line-through' : 'none',
              color: task.completed ? '#666' : '#000',
            }}>
              {task.title}
            </h3>
            {task.description && (
              <p style={{
                margin: '0 0 8px 0',
                color: '#666',
                fontSize: '14px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textDecoration: task.completed ? 'line-through' : 'none',
              }}>
                {task.description}
              </p>
            )}
            <div style={{ fontSize: '12px', color: '#999' }}>
              {task.completed ? '✓ Completed' : '○ Incomplete'} •
              Created {new Date(task.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            padding: '6px 12px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: deleting ? 'not-allowed' : 'pointer',
            fontSize: '14px',
          }}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
}
