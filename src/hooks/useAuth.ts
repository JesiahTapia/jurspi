import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  const checkAccess = (requiredRole: string[]) => {
    return session?.user?.role && requiredRole.includes(session.user.role);
  };

  return {
    session,
    status,
    login,
    logout,
    checkAccess,
    isAuthenticated: !!session,
  };
} 