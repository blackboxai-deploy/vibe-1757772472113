'use client';

import { User, AuthUser, LoginCredentials } from '@/types';
import { getStorageData, saveStorageData } from './storage';

const SESSION_KEY = 'cebip_session';

// Datos iniciales de usuarios
const initialUsers: User[] = [
  {
    id: '1',
    email: 'admin@cebip.com',
    password: 'admin123',
    name: 'Administrador CEBIP',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    email: 'maria@example.com',
    password: 'maria123',
    name: 'María González',
    role: 'member',
    status: 'active',
    createdAt: '2024-01-15T00:00:00.000Z',
    membershipType: 'premium',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5c86ad6a-af09-46ec-98cc-5f5dbaab48f3.png'
  },
  {
    id: '3',
    email: 'carlos@example.com',
    password: 'carlos123',
    name: 'Carlos Rodríguez',
    role: 'member',
    status: 'active',
    createdAt: '2024-01-20T00:00:00.000Z',
    membershipType: 'basic',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a1f61369-8279-47bb-8167-4391384a3420.png'
  },
  {
    id: '4',
    email: 'ana@example.com',
    password: 'ana123',
    name: 'Ana Martínez',
    role: 'member',
    status: 'suspended',
    createdAt: '2024-02-01T00:00:00.000Z',
    membershipType: 'basic',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8a249765-517f-4f41-976c-a780c1cee38e.png'
  },
  {
    id: '5',
    email: 'luis@example.com',
    password: 'luis123',
    name: 'Luis Fernández',
    role: 'member',
    status: 'inactive',
    createdAt: '2024-02-10T00:00:00.000Z',
    membershipType: 'vip',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1ee16eda-6620-48da-8862-a353614b6a8a.png'
  },
  {
    id: '6',
    email: 'sofia@example.com',
    password: 'sofia123',
    name: 'Sofía López',
    role: 'member',
    status: 'active',
    createdAt: '2024-02-15T00:00:00.000Z',
    membershipType: 'premium',
    avatar: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6b396ee9-01fb-40c8-82e9-7ae6acdf80f6.png'
  }
];

// Inicializar usuarios si no existen
export function initializeUsers() {
  const existingUsers = getStorageData<User[]>('users');
  if (!existingUsers || existingUsers.length === 0) {
    saveStorageData('users', initialUsers);
  }
}

// Obtener todos los usuarios
export function getUsers(): User[] {
  return getStorageData<User[]>('users') || [];
}

// Autenticar usuario
export function authenticate(credentials: LoginCredentials): AuthUser | null {
  const users = getUsers();
  const user = users.find(
    u => u.email === credentials.email && u.password === credentials.password
  );

  if (user && user.status === 'active') {
    // Actualizar último login
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, lastLogin: new Date().toISOString() } : u
    );
    saveStorageData('users', updatedUsers);

    const authUser: AuthUser = {
      user: { ...user, lastLogin: new Date().toISOString() },
      token: generateToken(user.id)
    };

    // Guardar sesión
    saveSession(authUser);
    return authUser;
  }

  return null;
}

// Generar token simple
function generateToken(userId: string): string {
  return btoa(`${userId}:${Date.now()}`);
}

// Guardar sesión
export function saveSession(authUser: AuthUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
  }
}

// Obtener sesión actual
export function getCurrentSession(): AuthUser | null {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      return JSON.parse(session);
    }
  }
  return null;
}

// Cerrar sesión
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

// Verificar si el usuario está autenticado
export function isAuthenticated(): boolean {
  const session = getCurrentSession();
  return session !== null;
}

// Verificar si el usuario es admin
export function isAdmin(): boolean {
  const session = getCurrentSession();
  return session?.user.role === 'admin';
}

// Verificar si el usuario es miembro
export function isMember(): boolean {
  const session = getCurrentSession();
  return session?.user.role === 'member';
}

// Crear nuevo usuario
export function createUser(userData: Omit<User, 'id' | 'createdAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString()
  };
  
  const updatedUsers = [...users, newUser];
  saveStorageData('users', updatedUsers);
  
  return newUser;
}

// Actualizar usuario
export function updateUser(userId: string, updates: Partial<User>): User | null {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) return null;
  
  const updatedUser = { ...users[userIndex], ...updates };
  const updatedUsers = [...users];
  updatedUsers[userIndex] = updatedUser;
  
  saveStorageData('users', updatedUsers);
  
  // Actualizar sesión si es el usuario actual
  const currentSession = getCurrentSession();
  if (currentSession && currentSession.user.id === userId) {
    saveSession({ ...currentSession, user: updatedUser });
  }
  
  return updatedUser;
}

// Eliminar usuario
export function deleteUser(userId: string): boolean {
  const users = getUsers();
  const filteredUsers = users.filter(u => u.id !== userId);
  
  if (filteredUsers.length === users.length) return false;
  
  saveStorageData('users', filteredUsers);
  return true;
}