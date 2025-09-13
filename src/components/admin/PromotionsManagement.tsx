'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  SearchIcon,
  TagIcon,
  ImageIcon,
  CalendarIcon,
  TrendingUpIcon
} from 'lucide-react';
import { getPromotions, savePromotions } from '@/lib/storage';
import type { Promotion } from '@/types';

interface PromotionsManagementProps {
  onDataChange: () => void;
}

export function PromotionsManagement({ onDataChange }: PromotionsManagementProps) {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [filteredPromotions, setFilteredPromotions] = useState<Promotion[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    discount: '',
    startDate: '',
    endDate: '',
    isActive: true,
    terms: '',
    limitedQuantity: 0,
    usedQuantity: 0
  });

  useEffect(() => {
    loadPromotions();
  }, []);

  useEffect(() => {
    filterPromotions();
  }, [promotions, searchTerm]);

  const loadPromotions = () => {
    const allPromotions = getPromotions();
    setPromotions(allPromotions);
  };

  const filterPromotions = () => {
    let filtered = promotions;

    if (searchTerm) {
      filtered = filtered.filter(promotion =>
        promotion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.discount.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPromotions(filtered);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      discount: '',
      startDate: '',
      endDate: '',
      isActive: true,
      terms: '',
      limitedQuantity: 0,
      usedQuantity: 0
    });
  };

  const handleCreatePromotion = () => {
    setIsEditing(false);
    setSelectedPromotion(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditPromotion = (promotion: Promotion) => {
    setIsEditing(true);
    setSelectedPromotion(promotion);
    setFormData({
      title: promotion.title,
      description: promotion.description,
      image: promotion.image,
      discount: promotion.discount,
      startDate: promotion.startDate.split('T')[0],
      endDate: promotion.endDate.split('T')[0],
      isActive: promotion.isActive,
      terms: promotion.terms || '',
      limitedQuantity: promotion.limitedQuantity || 0,
      usedQuantity: promotion.usedQuantity || 0
    });
    setIsDialogOpen(true);
  };

  const handleDeletePromotion = (promotion: Promotion) => {
    if (confirm(`¿Estás seguro de eliminar "${promotion.title}"?`)) {
      const updatedPromotions = promotions.filter(p => p.id !== promotion.id);
      savePromotions(updatedPromotions);
      loadPromotions();
      onDataChange();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();
    
    if (isEditing && selectedPromotion) {
      // Actualizar promoción existente
      const updatedPromotion: Promotion = {
        ...selectedPromotion,
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        updatedAt: now
      };

      const updatedPromotions = promotions.map(p => 
        p.id === selectedPromotion.id ? updatedPromotion : p
      );
      savePromotions(updatedPromotions);
    } else {
      // Crear nueva promoción
      const newPromotion: Promotion = {
        id: Date.now().toString(),
        ...formData,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        createdAt: now,
        updatedAt: now
      };

      const updatedPromotions = [...promotions, newPromotion];
      savePromotions(updatedPromotions);
    }

    loadPromotions();
    onDataChange();
    setIsDialogOpen(false);
    resetForm();
  };

  const generatePlaceholderImage = () => {
    return `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/aea95a9f-febc-4f60-8684-153d1e1b12a5.png`;
  };

  const handleGenerateImage = () => {
    if (formData.title && formData.discount) {
      const imageUrl = generatePlaceholderImage();
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  const getPromotionStatus = (promotion: Promotion) => {
    const now = new Date();
    const start = new Date(promotion.startDate);
    const end = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return <Badge className="bg-gray-100 text-gray-800">Inactiva</Badge>;
    }

    if (now < start) {
      return <Badge className="bg-blue-100 text-blue-800">Programada</Badge>;
    }

    if (now > end) {
      return <Badge className="bg-red-100 text-red-800">Expirada</Badge>;
    }

    return <Badge className="bg-green-100 text-green-800">Activa</Badge>;
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Gestión de Promociones
              </CardTitle>
              <CardDescription>
                Administra las promociones temporales y ofertas especiales
              </CardDescription>
            </div>
            <Button onClick={handleCreatePromotion} className="bg-orange-600 hover:bg-orange-700">
              <PlusIcon className="w-4 h-4 mr-2" />
              Nueva Promoción
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar promociones por título, descripción o descuento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Grid de Promociones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPromotions.map((promotion) => (
              <Card key={promotion.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {promotion.image ? (
                      <img
                        src={promotion.image}
                        alt={promotion.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4b16c0a1-6675-4cde-99bc-64c436d7975e.png}+Promotion`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ImageIcon className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">{promotion.title}</CardTitle>
                      <div className="flex items-center mt-1">
                        <TrendingUpIcon className="w-4 h-4 mr-1 text-orange-600" />
                        <span className="text-orange-600 font-semibold">{promotion.discount}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      {getPromotionStatus(promotion)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-2 mb-3">
                    {promotion.description}
                  </CardDescription>
                  
                  <div className="space-y-2 text-xs text-gray-600">
                    <div className="flex items-center">
                      <CalendarIcon className="w-3 h-3 mr-1" />
                      <span>
                        {new Date(promotion.startDate).toLocaleDateString('es-ES')} - {' '}
                        {new Date(promotion.endDate).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    
                    <div className="text-orange-600 font-medium">
                      {getDaysRemaining(promotion.endDate)}
                    </div>

                    {promotion.limitedQuantity && (
                      <div className="flex justify-between">
                        <span>Usados:</span>
                        <span>{promotion.usedQuantity || 0} / {promotion.limitedQuantity}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-xs text-gray-500">
                      Actualizado: {new Date(promotion.updatedAt).toLocaleDateString('es-ES')}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditPromotion(promotion)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeletePromotion(promotion)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPromotions.length === 0 && (
            <div className="text-center py-12">
              <TagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No se encontraron promociones</p>
              <p className="text-gray-400">Intenta cambiar el término de búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Crear/Editar Promoción */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Promoción' : 'Nueva Promoción'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Modifica la información de la promoción seleccionada'
                : 'Completa la información para crear una nueva promoción'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título de la Promoción</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nombre de la promoción"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount">Descuento</Label>
              <Input
                id="discount"
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                placeholder="Ej: 25%, $500 de descuento, 2x1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe detalladamente la promoción"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL de la Imagen</Label>
              <div className="flex gap-2">
                <Input
                  id="image"
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateImage}
                  disabled={!formData.title || !formData.discount}
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Generar
                </Button>
              </div>
            </div>

            {formData.image && (
              <div className="space-y-2">
                <Label>Vista Previa</Label>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={formData.image}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/dc3d3aee-6f95-4d30-8b88-7b4d58c7b560.png`;
                    }}
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="limitedQuantity">Cantidad Limitada (opcional)</Label>
                <Input
                  id="limitedQuantity"
                  type="number"
                  value={formData.limitedQuantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, limitedQuantity: parseInt(e.target.value) || 0 }))}
                  placeholder="0 = ilimitado"
                  min="0"
                />
              </div>

              {isEditing && (
                <div className="space-y-2">
                  <Label htmlFor="usedQuantity">Cantidad Usada</Label>
                  <Input
                    id="usedQuantity"
                    type="number"
                    value={formData.usedQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, usedQuantity: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                    min="0"
                    max={formData.limitedQuantity || undefined}
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="terms">Términos y Condiciones (opcional)</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                placeholder="Términos y condiciones de la promoción"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Promoción activa</Label>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
                {isEditing ? 'Actualizar' : 'Crear'} Promoción
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}