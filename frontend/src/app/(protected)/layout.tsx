/**
 * Protected layout for authenticated routes.
 * Checks authentication and redirects to sign-in if not authenticated.
 */
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for authentication token in cookies
  const cookieStore = cookies();
  const token = cookieStore.get('auth-token');

  // Redirect to sign-in if not authenticated
  if (!token) {
    redirect('/signin');
  }

  return <>{children}</>;
}
