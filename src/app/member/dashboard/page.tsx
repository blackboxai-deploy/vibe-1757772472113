'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MemberLayout } from '@/components/member/MemberLayout';
import { 
  GiftIcon, 
  TagIcon, 
  SparklesIcon,
  CalendarIcon,
  ClockIcon,
  TrendingUpIcon,
  StarIcon,
  CrownIcon
} from 'lucide-react';
import { getCurrentSession, isMember } from '@/lib/auth';
import { getBenefits, getPromotions } from '@/lib/storage';
import type { User, Benefit, Promotion } from '@/types';

export default function MemberDashboard() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [activePromotions, setActivePromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    // Verificar autenticación y permisos
    const session = getCurrentSession();
    if (!session || !isMember()) {
      router.push('/login');
      return;
    }
    setCurrentUser(session.user);

    // Cargar datos
    loadMemberData();
  }, [router]);

  const loadMemberData = () => {
    const allBenefits = getBenefits().filter(b => b.isActive);
    const allPromotions = getPromotions();

    // Filtrar promociones activas
    const now = new Date();
    const activePromos = allPromotions.filter(p => {
      if (!p.isActive) return false;
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return now >= start && now <= end;
    });

    setBenefits(allBenefits);
    setActivePromotions(activePromos);
  };

  const getMembershipBadge = (type: string | undefined) => {
    switch (type) {
      case 'basic':
        return <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">Básico</Badge>;
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">VIP</Badge>;
      default:
        return <Badge variant="outline">Básico</Badge>;
    }
  };

  const getDaysRemaining = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Expirada';
    if (diffDays === 0) return 'Expira hoy';
    if (diffDays === 1) return '1 día restante';
    return `${diffDays} días restantes`;
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '¡Buenos días';
    if (hour < 18) return '¡Buenas tardes';
    return '¡Buenas noches';
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <MemberLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20 border-4 border-white/20">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="bg-white/20 text-white text-xl font-bold">
                  {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold font-poppins mb-2">
                  {getWelcomeMessage()}, {currentUser.name.split(' ')[0]}!
                </h1>
                <p className="text-blue-100 text-lg mb-3">
                  Bienvenido a tu mundo de beneficios exclusivos
                </p>
                <div className="flex items-center space-x-3">
                  {getMembershipBadge(currentUser.membershipType)}
                  <Badge className="bg-white/20 text-white border-white/30">
                    <SparklesIcon className="w-4 h-4 mr-1" />
                    Miembro Activo
                  </Badge>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-blue-100 text-sm mb-1">Miembro desde</div>
              <div className="text-white font-semibold">
                {new Date(currentUser.createdAt).toLocaleDateString('es-ES', {
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-900">
                Beneficios Disponibles
              </CardTitle>
              <GiftIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{benefits.length}</div>
              <p className="text-xs text-green-700 mt-1">
                Listos para usar
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-900">
                Promociones Activas
              </CardTitle>
              <TagIcon className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">{activePromotions.length}</div>
              <p className="text-xs text-orange-700 mt-1">
                ¡No te las pierdas!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-900">
                Mi Membresía
              </CardTitle>
              <CrownIcon className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 capitalize">
                {currentUser.membershipType || 'Básico'}
              </div>
              <p className="text-xs text-purple-700 mt-1">
                Nivel actual
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Promotions Section */}
        {activePromotions.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                  Promociones Especiales
                </h2>
                <p className="text-gray-600">Ofertas limitadas disponibles ahora</p>
              </div>
              <Badge className="bg-red-100 text-red-800 border-red-200">
                <ClockIcon className="w-4 h-4 mr-1" />
                Por Tiempo Limitado
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activePromotions.slice(0, 3).map((promotion) => (
                <Card key={promotion.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-orange-50 to-red-50 hover:scale-105">
                  <CardHeader className="pb-3">
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                      <img
                        src={promotion.image}
                        alt={promotion.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/597046fc-55fa-4a3d-9b11-5b5eccf1cab9.png}+Special+Offer`;
                        }}
                      />
                    </div>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg line-clamp-1 text-gray-900">{promotion.title}</CardTitle>
                        <div className="flex items-center mt-1">
                          <TrendingUpIcon className="w-4 h-4 mr-1 text-orange-600" />
                          <span className="text-orange-600 font-bold text-lg">{promotion.discount}</span>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                        Activa
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="line-clamp-2 mb-4 text-gray-700">
                      {promotion.description}
                    </CardDescription>
                    
                    <div className="space-y-2 text-xs text-gray-600 mb-4">
                      <div className="flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        <span>Válida hasta: {new Date(promotion.endDate).toLocaleDateString('es-ES')}</span>
                      </div>
                      <div className="text-red-600 font-medium">
                        {getDaysRemaining(promotion.endDate)}
                      </div>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold">
                      Usar Promoción
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Benefits Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 font-poppins">
                Tus Beneficios Exclusivos
              </h2>
              <p className="text-gray-600">Descubre y disfruta de todos los beneficios disponibles</p>
            </div>
            <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              Ver Todos los Beneficios
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.slice(0, 6).map((benefit) => (
              <Card key={benefit.id} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3c3581a6-e3ed-431d-b4dd-99d7fbae903f.png}+Benefit`;
                      }}
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {benefit.title}
                      </CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {benefit.category}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className="bg-green-100 text-green-800">
                        Activo
                      </Badge>
                      {benefit.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          <StarIcon className="w-3 h-3 mr-1" />
                          Destacado
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4 text-gray-700">
                    {benefit.description}
                  </CardDescription>
                  
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold">
                    Ver Detalles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900">
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Aprovecha al máximo tu membresía CEBIP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2 border-blue-200 hover:bg-blue-50"
              >
                <GiftIcon className="w-6 h-6 text-blue-600" />
                <span className="text-sm font-medium">Explorar Beneficios</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2 border-orange-200 hover:bg-orange-50"
              >
                <TagIcon className="w-6 h-6 text-orange-600" />
                <span className="text-sm font-medium">Ver Promociones</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col space-y-2 border-purple-200 hover:bg-purple-50"
              >
                <CrownIcon className="w-6 h-6 text-purple-600" />
                <span className="text-sm font-medium">Mejorar Plan</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MemberLayout>
  );
}