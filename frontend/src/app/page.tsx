/**
 * Landing page - home page with links to sign up and sign in.
 */
export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      textAlign: 'center',
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        Multi-User Todo App
      </h1>
      <p style={{ fontSize: '20px', color: '#666', marginBottom: '40px', maxWidth: '600px' }}>
        Manage your tasks securely with JWT authentication.
        Create, update, and track your todos with complete user isolation.
      </p>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href="/signup"
          style={{
            padding: '15px 30px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          Sign Up
        </a>
        <a
          href="/signin"
          style={{
            padding: '15px 30px',
            backgroundColor: 'white',
            color: '#0070f3',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '2px solid #0070f3',
          }}
        >
          Sign In
        </a>
      </div>
      <div style={{ marginTop: '60px', color: '#999', fontSize: '14px' }}>
        <p>Features:</p>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✓ Secure JWT authentication</li>
          <li>✓ Multi-user task isolation</li>
          <li>✓ Create, read, update, delete tasks</li>
          <li>✓ Toggle task completion</li>
          <li>✓ Responsive design</li>
        </ul>
      </div>
    </div>
  );
}
