import { User } from '@/types/auth';

export const AUTH_COOKIE_NAME = 'auth_session_token';

// Demo users database untuk keperluan tutorial & testing
export const MOCK_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'usr_1',
    name: 'Ahmad Habib',
    email: 'admin@example.com',
    passwordHash: 'admin123', // Demo password
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad',
    createdAt: '2025-01-10',
  },
  {
    id: 'usr_2',
    name: 'Siti Nurhaliza',
    email: 'staff@example.com',
    passwordHash: 'staff123', // Demo password
    role: 'staff',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Siti',
    createdAt: '2025-02-15',
  },
];

export function findUserByEmail(email: string) {
  return MOCK_USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function getUserWithoutPassword(user: (typeof MOCK_USERS)[0]): User {
  const { passwordHash: _, ...rest } = user;
  return rest;
}

