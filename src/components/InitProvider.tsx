'use client';

import { useEffect } from 'react';
import { initializeUsers } from '@/lib/auth';
import { initializeDefaultData } from '@/lib/storage';

interface InitProviderProps {
  children: React.ReactNode;
}

export function InitProvider({ children }: InitProviderProps) {
  useEffect(() => {
    // Inicializar datos cuando el componente se monta
    initializeUsers();
    initializeDefaultData();
  }, []);

  return <>{children}</>;
}