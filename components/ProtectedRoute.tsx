import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Roles that are allowed to view the page. */
  allowedRoles?: ('student' | 'owner' | 'admin')[];
}

/**
 * Wrap any page or component that requires authentication.
 * If the user is not logged in, they are redirected to the sign‑in page.
 * If `allowedRoles` is provided, the user must have one of those roles.
 */
export default function ProtectedRoute({
  children,
  allowedRoles = ['student', 'owner', 'admin'],
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const loading = status === 'loading';

  useEffect(() => {
    if (!loading) {
      if (!session) {
        // Not logged in → redirect to sign‑in
        router.replace('/auth/signin');
      } else if (!allowedRoles.includes(session.user.role as any)) {
        // Logged in but role not permitted → redirect to home or 403 page
        router.replace('/');
      }
    }
  }, [loading, session, router, allowedRoles]);

  // While checking session we show nothing (or a skeleton if desired)
  if (loading || !session) {
    return null;
  }

  return <>{children}</>;
}
