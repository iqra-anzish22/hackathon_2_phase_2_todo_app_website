/**
 * TaskForm component - form for creating new tasks with validation feedback.
 */
import { useState } from 'react';
import { Task, TaskCreate } from '@/types/task';
import { ApiError } from '@/types/errors';
import { apiRequest } from '@/lib/api';

interface TaskFormProps {
  onTaskCreated: (task: Task) => void;
}

export default function TaskForm({ onTaskCreated }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [titleError, setTitleError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setTitleError(null);

    // Client-side validation
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }

    if (title.trim().length > 200) {
      setTitleError('Title must be 200 characters or less');
      return;
    }

    try {
      setSubmitting(true);

      const taskData: TaskCreate = {
        title: title.trim(),
        description: description.trim() || undefined,
      };

      const newTask = await apiRequest<Task>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(taskData),
      });

      onTaskCreated(newTask);

      // Reset form
      setTitle('');
      setDescription('');
    } catch (err) {
      if (err && typeof err === 'object' && 'error_code' in err) {
        const apiError = err as ApiError;
        setError(apiError);

        // Map field-level errors to form fields
        if (apiError.details) {
          apiError.details.forEach(detail => {
            if (detail.field === 'title') {
              setTitleError(detail.message);
            }
          });
        }
      } else {
        setError({
          error_code: 'UNKNOWN_ERROR',
          message: 'Failed to create task',
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      backgroundColor: '#f9f9f9',
    }}>
      <h3 style={{ marginTop: 0 }}>Create New Task</h3>

      {error && !error.details && (
        <div style={{
          padding: '12px',
          marginBottom: '15px',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          color: '#c33',
        }}>
          {error.message}
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="title" style={{ display: 'block', marginBottom: '5px' }}>
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            setTitleError(null);
          }}
          required
          maxLength={200}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '16px',
            border: titleError ? '1px solid #c33' : '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        {titleError && (
          <div style={{ color: '#c33', fontSize: '14px', marginTop: '4px' }}>
            {titleError}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>
          Description (optional)
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={2000}
          style={{
            width: '100%',
            padding: '8px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
          {description.length}/2000 characters
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        style={{
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: submitting ? 'not-allowed' : 'pointer',
          fontSize: '16px',
        }}
      >
        {submitting ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}
