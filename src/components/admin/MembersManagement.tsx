'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  SearchIcon,
  FilterIcon,
  UserIcon
} from 'lucide-react';
import { getUsers } from '@/lib/storage';
import { createUser, updateUser, deleteUser } from '@/lib/auth';
import type { User, UserStatus, MembershipType } from '@/types';

interface MembersManagementProps {
  onDataChange: () => void;
}

export function MembersManagement({ onDataChange }: MembersManagementProps) {
  const [members, setMembers] = useState<User[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [membershipFilter, setMembershipFilter] = useState<string>('all');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    status: 'active' as UserStatus,
    membershipType: 'basic' as MembershipType,
    avatar: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterMembers();
  }, [members, searchTerm, statusFilter, membershipFilter]);

  const loadMembers = () => {
    const allUsers = getUsers();
    const memberUsers = allUsers.filter(user => user.role === 'member');
    setMembers(memberUsers);
  };

  const filterMembers = () => {
    let filtered = members;

    // Filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro de estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(member => member.status === statusFilter);
    }

    // Filtro de membresía
    if (membershipFilter !== 'all') {
      filtered = filtered.filter(member => member.membershipType === membershipFilter);
    }

    setFilteredMembers(filtered);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      status: 'active',
      membershipType: 'basic',
      avatar: ''
    });
  };

  const handleCreateMember = () => {
    setIsEditing(false);
    setSelectedMember(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditMember = (member: User) => {
    setIsEditing(true);
    setSelectedMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      password: '',
      status: member.status,
      membershipType: member.membershipType || 'basic',
      avatar: member.avatar || ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteMember = (member: User) => {
    if (confirm(`¿Estás seguro de eliminar a ${member.name}?`)) {
      deleteUser(member.id);
      loadMembers();
      onDataChange();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && selectedMember) {
        // Actualizar miembro existente
        const updates: Partial<User> = {
          name: formData.name,
          email: formData.email,
          status: formData.status,
          membershipType: formData.membershipType,
          avatar: formData.avatar || undefined
        };

        if (formData.password) {
          updates.password = formData.password;
        }

        updateUser(selectedMember.id, updates);
      } else {
        // Crear nuevo miembro
        createUser({
          name: formData.name,
          email: formData.email,
          password: formData.password || 'defaultpassword123',
          role: 'member',
          status: formData.status,
          membershipType: formData.membershipType,
          avatar: formData.avatar || undefined
        });
      }

      loadMembers();
      onDataChange();
      setIsDialogOpen(false);
      resetForm();
    } catch {
      alert('Error al guardar el miembro. Verifica que el email no esté duplicado.');
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Activo</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Inactivo</Badge>;
      case 'suspended':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Suspendido</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getMembershipBadge = (type: MembershipType | undefined) => {
    switch (type) {
      case 'basic':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Básico</Badge>;
      case 'premium':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Premium</Badge>;
      case 'vip':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">VIP</Badge>;
      default:
        return <Badge variant="outline">Básico</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Gestión de Miembros
              </CardTitle>
              <CardDescription>
                Administra los miembros de CEBIP, sus estados y tipos de membresía
              </CardDescription>
            </div>
            <Button onClick={handleCreateMember} className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="w-4 h-4 mr-2" />
              Nuevo Miembro
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <FilterIcon className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="suspended">Suspendido</SelectItem>
              </SelectContent>
            </Select>
            <Select value={membershipFilter} onValueChange={setMembershipFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Membresía" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las membresías</SelectItem>
                <SelectItem value="basic">Básico</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabla de Miembros */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miembro</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Membresía</TableHead>
                  <TableHead>Fecha de Registro</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{getStatusBadge(member.status)}</TableCell>
                    <TableCell>{getMembershipBadge(member.membershipType)}</TableCell>
                    <TableCell>
                      {new Date(member.createdAt).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditMember(member)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteMember(member)}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <UserIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg font-medium">No se encontraron miembros</p>
                <p className="text-gray-400">Intenta cambiar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialog para Crear/Editar Miembro */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Miembro' : 'Nuevo Miembro'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Modifica la información del miembro seleccionado'
                : 'Completa la información para crear un nuevo miembro'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nombre del miembro"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="email@ejemplo.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">
                {isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder={isEditing ? 'Dejar vacío para mantener actual' : 'Contraseña'}
                required={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: UserStatus) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="suspended">Suspendido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="membershipType">Tipo de Membresía</Label>
              <Select 
                value={formData.membershipType} 
                onValueChange={(value: MembershipType) => setFormData(prev => ({ ...prev, membershipType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Básico</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="vip">VIP</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">URL del Avatar (opcional)</Label>
              <Input
                id="avatar"
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData(prev => ({ ...prev, avatar: e.target.value }))}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                {isEditing ? 'Actualizar' : 'Crear'} Miembro
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}