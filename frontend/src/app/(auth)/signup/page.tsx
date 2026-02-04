'use client';

/**
 * Sign-up page for new user registration.
 * Uses Better Auth for user creation and JWT token issuance.
 * Handles registration errors with user-friendly feedback.
 */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError } from '@/types/errors';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call Better Auth sign-up endpoint
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));

        // Parse structured error response
        if (data?.error_code) {
          setError(data as ApiError);
        } else {
          setError({
            error_code: 'SIGNUP_FAILED',
            message: data?.message || 'Unable to create account. Please try again.',
          });
        }
        return;
      }

      // Redirect to tasks page on success
      router.push('/tasks');
    } catch (err) {
      setError({
        error_code: 'NETWORK_ERROR',
        message: 'Unable to connect. Please check your internet connection and try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px' }}>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
        </div>
        {error && (
          <div
            style={{
              padding: '12px',
              marginBottom: '15px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c33',
            }}
          >
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              {error.error_code === 'SIGNUP_FAILED' && 'Registration Failed'}
              {error.error_code === 'NETWORK_ERROR' && 'Connection Error'}
              {error.error_code === 'VALIDATION_ERROR' && 'Invalid Input'}
              {!['SIGNUP_FAILED', 'NETWORK_ERROR', 'VALIDATION_ERROR'].includes(error.error_code) && 'Error'}
            </div>
            <div style={{ fontSize: '14px' }}>{error.message}</div>
            {error.details && error.details.length > 0 && (
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', fontSize: '14px' }}>
                {error.details.map((detail, index) => (
                  <li key={index}>
                    <strong>{detail.field}:</strong> {detail.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Already have an account?{' '}
        <a href="/signin" style={{ color: '#0070f3' }}>
          Sign In
        </a>
      </p>
    </div>
  );
}
