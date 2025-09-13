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
  GiftIcon,
  ImageIcon
} from 'lucide-react';
import { getBenefits, saveBenefits } from '@/lib/storage';
import type { Benefit } from '@/types';

interface BenefitsManagementProps {
  onDataChange: () => void;
}

export function BenefitsManagement({ onDataChange }: BenefitsManagementProps) {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [filteredBenefits, setFilteredBenefits] = useState<Benefit[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    isActive: true,
    featured: false,
    terms: ''
  });

  useEffect(() => {
    loadBenefits();
  }, []);

  useEffect(() => {
    filterBenefits();
  }, [benefits, searchTerm]);

  const loadBenefits = () => {
    const allBenefits = getBenefits();
    setBenefits(allBenefits);
  };

  const filterBenefits = () => {
    let filtered = benefits;

    if (searchTerm) {
      filtered = filtered.filter(benefit =>
        benefit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        benefit.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        benefit.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredBenefits(filtered);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image: '',
      category: '',
      isActive: true,
      featured: false,
      terms: ''
    });
  };

  const handleCreateBenefit = () => {
    setIsEditing(false);
    setSelectedBenefit(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEditBenefit = (benefit: Benefit) => {
    setIsEditing(true);
    setSelectedBenefit(benefit);
    setFormData({
      title: benefit.title,
      description: benefit.description,
      image: benefit.image,
      category: benefit.category,
      isActive: benefit.isActive,
      featured: benefit.featured || false,
      terms: benefit.terms || ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteBenefit = (benefit: Benefit) => {
    if (confirm(`¿Estás seguro de eliminar "${benefit.title}"?`)) {
      const updatedBenefits = benefits.filter(b => b.id !== benefit.id);
      saveBenefits(updatedBenefits);
      loadBenefits();
      onDataChange();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const now = new Date().toISOString();
    
    if (isEditing && selectedBenefit) {
      // Actualizar beneficio existente
      const updatedBenefit: Benefit = {
        ...selectedBenefit,
        ...formData,
        updatedAt: now
      };

      const updatedBenefits = benefits.map(b => 
        b.id === selectedBenefit.id ? updatedBenefit : b
      );
      saveBenefits(updatedBenefits);
    } else {
      // Crear nuevo beneficio
      const newBenefit: Benefit = {
        id: Date.now().toString(),
        ...formData,
        createdAt: now,
        updatedAt: now
      };

      const updatedBenefits = [...benefits, newBenefit];
      saveBenefits(updatedBenefits);
    }

    loadBenefits();
    onDataChange();
    setIsDialogOpen(false);
    resetForm();
  };

  const generatePlaceholderImage = () => {
    return `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/68f7bb16-3fa8-47fb-8758-49be4dcb947c.png`;
  };

  const handleGenerateImage = () => {
    if (formData.title && formData.category) {
      const imageUrl = generatePlaceholderImage();
      setFormData(prev => ({ ...prev, image: imageUrl }));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Gestión de Beneficios
              </CardTitle>
              <CardDescription>
                Administra los beneficios disponibles para los miembros de CEBIP
              </CardDescription>
            </div>
            <Button onClick={handleCreateBenefit} className="bg-purple-600 hover:bg-purple-700">
              <PlusIcon className="w-4 h-4 mr-2" />
              Nuevo Beneficio
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Búsqueda */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar beneficios por título, categoría o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Grid de Beneficios */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBenefits.map((benefit) => (
              <Card key={benefit.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-3">
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                    {benefit.image ? (
                      <img
                        src={benefit.image}
                        alt={benefit.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c7965a2a-6a0c-4b87-b85d-344b757d12fc.png}+Benefit`;
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
                      <CardTitle className="text-lg line-clamp-1">{benefit.title}</CardTitle>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {benefit.category}
                      </Badge>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <Badge className={benefit.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {benefit.isActive ? 'Activo' : 'Inactivo'}
                      </Badge>
                      {benefit.featured && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          Destacado
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="line-clamp-3 mb-4">
                    {benefit.description}
                  </CardDescription>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Actualizado: {new Date(benefit.updatedAt).toLocaleDateString('es-ES')}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditBenefit(benefit)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteBenefit(benefit)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredBenefits.length === 0 && (
            <div className="text-center py-12">
              <GiftIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">No se encontraron beneficios</p>
              <p className="text-gray-400">Intenta cambiar el término de búsqueda</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para Crear/Editar Beneficio */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Editar Beneficio' : 'Nuevo Beneficio'}
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Modifica la información del beneficio seleccionado'
                : 'Completa la información para crear un nuevo beneficio'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título del Beneficio</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nombre del beneficio"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoría</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                placeholder="Ej: Gastronomía, Bienestar, Entretenimiento"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe detalladamente el beneficio"
                rows={3}
                required
              />
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
                  disabled={!formData.title || !formData.category}
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
                      target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/9329e3ff-99ff-4443-ba31-01361c3a63db.png`;
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="terms">Términos y Condiciones (opcional)</Label>
              <Textarea
                id="terms"
                value={formData.terms}
                onChange={(e) => setFormData(prev => ({ ...prev, terms: e.target.value }))}
                placeholder="Términos y condiciones del beneficio"
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Beneficio activo</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">Beneficio destacado</Label>
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
                {isEditing ? 'Actualizar' : 'Crear'} Beneficio
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}