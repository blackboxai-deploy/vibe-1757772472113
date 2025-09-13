export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'member';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin?: string;
  membershipType?: 'basic' | 'premium' | 'vip';
  avatar?: string;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  terms?: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  discount: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  terms?: string;
  limitedQuantity?: number;
  usedQuantity?: number;
}

export interface AuthUser {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AdminStats {
  totalMembers: number;
  activeMembers: number;
  totalBenefits: number;
  totalPromotions: number;
  activePromotions: number;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  mercadoPagoButtonId?: string;
}

export type UserStatus = 'active' | 'inactive' | 'suspended';
export type MembershipType = 'basic' | 'premium' | 'vip';
export type UserRole = 'admin' | 'member';