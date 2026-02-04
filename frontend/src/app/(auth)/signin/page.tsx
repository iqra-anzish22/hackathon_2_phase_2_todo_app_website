'use client';

/**
 * Sign-in page for existing user authentication.
 * Uses Better Auth for user authentication and JWT token issuance.
 * Handles authentication errors with user-friendly feedback.
 */
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ApiError } from '@/types/errors';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/tasks';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  // Handle URL error parameters (from 401 redirects)
  useEffect(() => {
    if (errorParam === 'session_expired') {
      setError({
        error_code: 'TOKEN_EXPIRED',
        message: 'Your session has expired. Please sign in again.',
      });
    } else if (errorParam === 'auth_required') {
      setError({
        error_code: 'MISSING_TOKEN',
        message: 'Please sign in to continue.',
      });
    }
  }, [errorParam]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Call Better Auth sign-in endpoint
      const response = await fetch('/api/auth/signin', {
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
            error_code: 'AUTH_FAILED',
            message: data?.message || 'Invalid email or password. Please try again.',
          });
        }
        return;
      }

      // Redirect to original destination or tasks page on success
      router.push(redirect);
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
      <h1>Sign In</h1>
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
              {error.error_code === 'TOKEN_EXPIRED' && 'Session Expired'}
              {error.error_code === 'MISSING_TOKEN' && 'Authentication Required'}
              {error.error_code === 'AUTH_FAILED' && 'Sign In Failed'}
              {error.error_code === 'NETWORK_ERROR' && 'Connection Error'}
              {!['TOKEN_EXPIRED', 'MISSING_TOKEN', 'AUTH_FAILED', 'NETWORK_ERROR'].includes(error.error_code) && 'Error'}
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
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center' }}>
        Don't have an account?{' '}
        <a href="/signup" style={{ color: '#0070f3' }}>
          Sign Up
        </a>
      </p>
    </div>
  );
}
