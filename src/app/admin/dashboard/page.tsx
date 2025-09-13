'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { MembersManagement } from '@/components/admin/MembersManagement';
import { BenefitsManagement } from '@/components/admin/BenefitsManagement';
import { PromotionsManagement } from '@/components/admin/PromotionsManagement';
import { 
  UsersIcon, 
  GiftIcon, 
  TagIcon, 
  UserCheckIcon
} from 'lucide-react';
import { getCurrentSession, isAdmin } from '@/lib/auth';
import { getUsers } from '@/lib/storage';
import { getBenefits, getPromotions } from '@/lib/storage';
import type { AdminStats, User, Benefit, Promotion } from '@/types';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<AdminStats>({
    totalMembers: 0,
    activeMembers: 0,
    totalBenefits: 0,
    totalPromotions: 0,
    activePromotions: 0
  });
  const [recentMembers, setRecentMembers] = useState<User[]>([]);
  const [recentBenefits, setRecentBenefits] = useState<Benefit[]>([]);
  const [recentPromotions, setRecentPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    // Verificar autenticación y permisos
    const session = getCurrentSession();
    if (!session || !isAdmin()) {
      router.push('/login');
      return;
    }

    // Cargar datos para el dashboard
    loadDashboardData();
  }, [router]);

  const loadDashboardData = () => {
    const users = getUsers();
    const benefits = getBenefits();
    const promotions = getPromotions();

    // Calcular estadísticas
    const activeMembers = users.filter(u => u.role === 'member' && u.status === 'active');
    const totalMembers = users.filter(u => u.role === 'member');
    const activePromotions = promotions.filter(p => {
      const now = new Date();
      const start = new Date(p.startDate);
      const end = new Date(p.endDate);
      return p.isActive && now >= start && now <= end;
    });

    setStats({
      totalMembers: totalMembers.length,
      activeMembers: activeMembers.length,
      totalBenefits: benefits.length,
      totalPromotions: promotions.length,
      activePromotions: activePromotions.length
    });

    // Obtener elementos recientes
    setRecentMembers(
      users
        .filter(u => u.role === 'member')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
    );

    setRecentBenefits(
      benefits
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3)
    );

    setRecentPromotions(
      promotions
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 3)
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800">Suspendido</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-poppins">Panel de Administración</h1>
            <p className="text-gray-600 mt-2">Gestiona miembros, beneficios y promociones</p>
          </div>
          <Button 
            onClick={loadDashboardData}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Actualizar Datos
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="members" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Miembros
            </TabsTrigger>
            <TabsTrigger value="benefits" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Beneficios
            </TabsTrigger>
            <TabsTrigger value="promotions" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Promociones
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">
                    Total Miembros
                  </CardTitle>
                  <UsersIcon className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">{stats.totalMembers}</div>
                  <p className="text-xs text-blue-700 mt-1">
                    +{stats.activeMembers} activos
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-green-900">
                    Miembros Activos
                  </CardTitle>
                  <UserCheckIcon className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-900">{stats.activeMembers}</div>
                  <p className="text-xs text-green-700 mt-1">
                    {Math.round((stats.activeMembers / stats.totalMembers) * 100)}% del total
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900">
                    Beneficios
                  </CardTitle>
                  <GiftIcon className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-900">{stats.totalBenefits}</div>
                  <p className="text-xs text-purple-700 mt-1">
                    Disponibles para miembros
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
                  <div className="text-2xl font-bold text-orange-900">{stats.activePromotions}</div>
                  <p className="text-xs text-orange-700 mt-1">
                    de {stats.totalPromotions} totales
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {/* Recent Members */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <UsersIcon className="w-5 h-5 mr-2 text-blue-600" />
                    Miembros Recientes
                  </CardTitle>
                  <CardDescription>
                    Últimos miembros registrados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentMembers.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{member.name}</div>
                        <div className="text-sm text-gray-600">{member.email}</div>
                      </div>
                      <div className="text-right">
                        {getStatusBadge(member.status)}
                        <div className="text-xs text-gray-500 mt-1">
                          {formatDate(member.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <GiftIcon className="w-5 h-5 mr-2 text-purple-600" />
                    Beneficios Recientes
                  </CardTitle>
                  <CardDescription>
                    Últimos beneficios actualizados
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentBenefits.map((benefit) => (
                    <div key={benefit.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">{benefit.title}</div>
                          <div className="text-sm text-gray-600">{benefit.category}</div>
                        </div>
                        <Badge className={benefit.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {benefit.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Actualizado: {formatDate(benefit.updatedAt)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Promotions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold flex items-center">
                    <TagIcon className="w-5 h-5 mr-2 text-orange-600" />
                    Promociones Recientes
                  </CardTitle>
                  <CardDescription>
                    Últimas promociones actualizadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentPromotions.map((promotion) => (
                    <div key={promotion.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-medium text-gray-900 line-clamp-1">{promotion.title}</div>
                          <div className="text-sm text-orange-600 font-semibold">{promotion.discount} de descuento</div>
                        </div>
                        <Badge className={promotion.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {promotion.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500">
                        Válida hasta: {formatDate(promotion.endDate)}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Members Management Tab */}
          <TabsContent value="members">
            <MembersManagement onDataChange={loadDashboardData} />
          </TabsContent>

          {/* Benefits Management Tab */}
          <TabsContent value="benefits">
            <BenefitsManagement onDataChange={loadDashboardData} />
          </TabsContent>

          {/* Promotions Management Tab */}
          <TabsContent value="promotions">
            <PromotionsManagement onDataChange={loadDashboardData} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}