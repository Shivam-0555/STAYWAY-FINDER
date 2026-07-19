"use client";
import { SessionProvider, useSession, signIn, signOut } from 'next-auth/react';
import { ReactNode, createContext, useContext } from 'react';

interface AuthContextProps {
  user: any;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (provider?: string, options?: any) => Promise<void>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, phone: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

function AuthContextProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const isAuthenticated = !!session?.user;
  const isLoading = loading;

  const handleSignIn = async (provider?: string, options?: any) => {
    await signIn(provider, options);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      throw new Error(result.error);
    }
  };

  const signup = async (name: string, email: string, phone: string, password: string) => {
    const response = await fetch('/api/v1/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, phone, password, role: 'student' }),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = data?.message || (Array.isArray(data?.errors) ? data.errors[0]?.message : 'Signup failed');
      throw new Error(message);
    }

    await login(email, password);
  };

  const value: AuthContextProps = {
    user: session?.user,
    loading,
    isLoading,
    isAuthenticated,
    signIn: handleSignIn,
    signOut: handleSignOut,
    login,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const AuthProvider = ({ children }: { children: ReactNode }) => (
  <SessionProvider>
    <AuthContextProvider>{children}</AuthContextProvider>
  </SessionProvider>
);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
