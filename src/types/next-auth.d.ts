import type { DefaultSession, DefaultUser } from 'next-auth';
import type { JWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: DefaultSession['user'] & {
      id: string;
      role: 'student' | 'owner' | 'admin';
    };
  }

  interface User extends DefaultUser {
    id: string;
    role?: 'student' | 'owner' | 'admin';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: 'student' | 'owner' | 'admin';
  }
}
