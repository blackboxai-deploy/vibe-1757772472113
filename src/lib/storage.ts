'use client';

import { User, Benefit, Promotion } from '@/types';

// Claves para localStorage
const STORAGE_KEYS = {
  USERS: 'cebip_users',
  BENEFITS: 'cebip_benefits',
  PROMOTIONS: 'cebip_promotions'
} as const;

// Función genérica para obtener datos del localStorage
export function getStorageData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

// Función genérica para guardar datos en localStorage
export function saveStorageData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}

// Función para limpiar datos del localStorage
export function clearStorageData(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error);
  }
}

// Funciones específicas para cada tipo de dato

// Usuarios
export function getUsers(): User[] {
  return getStorageData<User[]>(STORAGE_KEYS.USERS) || [];
}

export function saveUsers(users: User[]): void {
  saveStorageData(STORAGE_KEYS.USERS, users);
}

// Beneficios
export function getBenefits(): Benefit[] {
  return getStorageData<Benefit[]>(STORAGE_KEYS.BENEFITS) || [];
}

export function saveBenefits(benefits: Benefit[]): void {
  saveStorageData(STORAGE_KEYS.BENEFITS, benefits);
}

// Promociones
export function getPromotions(): Promotion[] {
  return getStorageData<Promotion[]>(STORAGE_KEYS.PROMOTIONS) || [];
}

export function savePromotions(promotions: Promotion[]): void {
  saveStorageData(STORAGE_KEYS.PROMOTIONS, promotions);
}

// Función para inicializar datos por defecto
export function initializeDefaultData(): void {
  // Inicializar beneficios por defecto
  const existingBenefits = getBenefits();
  if (existingBenefits.length === 0) {
    const defaultBenefits: Benefit[] = [
      {
        id: '1',
        title: 'Descuentos en Restaurantes',
        description: 'Disfruta hasta 25% de descuento en restaurantes afiliados de toda la ciudad.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/49558f6d-c8a2-4948-b8de-ece59d69ed04.png',
        category: 'Gastronomía',
        isActive: true,
        featured: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        terms: 'Válido de lunes a jueves. No acumulable con otras promociones.'
      },
      {
        id: '2',
        title: 'Spa y Bienestar',
        description: 'Acceso exclusivo a tratamientos de relajación y bienestar con descuentos especiales.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/91423d82-a06d-4e38-9417-59b716d3b876.png',
        category: 'Bienestar',
        isActive: true,
        featured: true,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
        terms: 'Reservas con 24 horas de anticipación.'
      },
      {
        id: '3',
        title: 'Entretenimiento Premium',
        description: 'Entradas preferenciales para cines, teatros y eventos culturales.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dfdfdf5a-ee83-4b2c-a661-080462ba4dab.png',
        category: 'Entretenimiento',
        isActive: true,
        featured: false,
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z',
        terms: 'Sujeto a disponibilidad. Válido para funciones seleccionadas.'
      },
      {
        id: '4',
        title: 'Viajes y Turismo',
        description: 'Descuentos exclusivos en hoteles, vuelos y paquetes turísticos.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/17df8c50-6c25-4a61-ab73-4dc1f11ea9f8.png',
        category: 'Viajes',
        isActive: true,
        featured: true,
        createdAt: '2024-01-04T00:00:00.000Z',
        updatedAt: '2024-01-04T00:00:00.000Z',
        terms: 'Descuentos aplicables según temporada y disponibilidad.'
      },
      {
        id: '5',
        title: 'Salud y Medicina',
        description: 'Consultas médicas preferenciales y descuentos en estudios clínicos.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/66c8e079-0a82-4ac0-9246-e9fb3b1897f8.png',
        category: 'Salud',
        isActive: true,
        featured: false,
        createdAt: '2024-01-05T00:00:00.000Z',
        updatedAt: '2024-01-05T00:00:00.000Z',
        terms: 'Previa coordinación y presentación de credencial.'
      },
      {
        id: '6',
        title: 'Educación y Capacitación',
        description: 'Cursos y talleres con descuentos especiales para el desarrollo profesional.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6fc00721-8851-4a73-9314-b17bea7a969e.png',
        category: 'Educación',
        isActive: true,
        featured: false,
        createdAt: '2024-01-06T00:00:00.000Z',
        updatedAt: '2024-01-06T00:00:00.000Z',
        terms: 'Válido para cursos regulares. Consultar disponibilidad.'
      },
      {
        id: '7',
        title: 'Deportes y Fitness',
        description: 'Acceso a gimnasios premium y actividades deportivas exclusivas.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4666f39c-f72d-4e51-a410-5a206267aecd.png',
        category: 'Deportes',
        isActive: true,
        featured: false,
        createdAt: '2024-01-07T00:00:00.000Z',
        updatedAt: '2024-01-07T00:00:00.000Z',
        terms: 'Horarios especiales para miembros. Ver condiciones en cada gimnasio.'
      },
      {
        id: '8',
        title: 'Tecnología y Servicios',
        description: 'Descuentos en productos tecnológicos y servicios digitales.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c304491e-6158-490d-84f4-679ef9883dce.png',
        category: 'Tecnología',
        isActive: true,
        featured: false,
        createdAt: '2024-01-08T00:00:00.000Z',
        updatedAt: '2024-01-08T00:00:00.000Z',
        terms: 'Descuentos aplicables en productos seleccionados.'
      }
    ];
    saveBenefits(defaultBenefits);
  }

  // Inicializar promociones por defecto
  const existingPromotions = getPromotions();
  if (existingPromotions.length === 0) {
    const defaultPromotions: Promotion[] = [
      {
        id: '1',
        title: 'Black Friday Premium',
        description: '50% de descuento en todos nuestros servicios premium durante noviembre.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/0eed94db-4bd4-4872-9d98-075234696087.png',
        discount: '50%',
        startDate: '2024-11-01T00:00:00.000Z',
        endDate: '2024-11-30T23:59:59.000Z',
        isActive: true,
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
        terms: 'No acumulable con otras promociones. Válido una vez por miembro.',
        limitedQuantity: 100,
        usedQuantity: 23
      },
      {
        id: '2',
        title: 'Verano Exclusivo',
        description: 'Promoción especial de verano con beneficios únicos para la temporada.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/26f4f7bd-6207-47ae-9d9e-f3da5fd72ebe.png',
        discount: '30%',
        startDate: '2024-12-01T00:00:00.000Z',
        endDate: '2025-02-28T23:59:59.000Z',
        isActive: true,
        createdAt: '2024-01-02T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
        terms: 'Válido para servicios de temporada. Consultar establecimientos participantes.',
        limitedQuantity: 200,
        usedQuantity: 45
      },
      {
        id: '3',
        title: 'Aniversario CEBIP',
        description: 'Celebramos nuestro aniversario con descuentos increíbles para todos los miembros.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a97ef3f7-b5e1-4335-8071-8c65c2783e17.png',
        discount: '40%',
        startDate: '2024-12-15T00:00:00.000Z',
        endDate: '2025-01-15T23:59:59.000Z',
        isActive: true,
        createdAt: '2024-01-03T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z',
        terms: 'Promoción especial de aniversario. Beneficios exclusivos para miembros activos.',
        limitedQuantity: 150,
        usedQuantity: 12
      },
      {
        id: '4',
        title: 'Fin de Año 2024',
        description: 'Termina el año con los mejores beneficios y descuentos especiales.',
        image: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/947ec7c5-08a4-493f-a9e3-2384af764504.png',
        discount: '25%',
        startDate: '2024-12-20T00:00:00.000Z',
        endDate: '2024-12-31T23:59:59.000Z',
        isActive: true,
        createdAt: '2024-01-04T00:00:00.000Z',
        updatedAt: '2024-01-04T00:00:00.000Z',
        terms: 'Promoción de fin de año. Válido hasta agotar stock.',
        limitedQuantity: 75,
        usedQuantity: 8
      }
    ];
    savePromotions(defaultPromotions);
  }
}

// Función para resetear todos los datos (útil para desarrollo)
export function resetAllData(): void {
  clearStorageData(STORAGE_KEYS.USERS);
  clearStorageData(STORAGE_KEYS.BENEFITS);
  clearStorageData(STORAGE_KEYS.PROMOTIONS);
}

// Función para exportar datos (para backup)
export function exportData() {
  return {
    users: getUsers(),
    benefits: getBenefits(),
    promotions: getPromotions(),
    exportDate: new Date().toISOString()
  };
}

// Función para importar datos (para restore)
export function importData(data: {
  users?: User[];
  benefits?: Benefit[];
  promotions?: Promotion[];
}) {
  if (data.users) saveUsers(data.users);
  if (data.benefits) saveBenefits(data.benefits);
  if (data.promotions) savePromotions(data.promotions);
}