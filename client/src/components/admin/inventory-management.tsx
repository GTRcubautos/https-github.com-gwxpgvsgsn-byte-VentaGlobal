import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Package, Plus, Edit, Save, X, Send, ShoppingCart, 
  Car, Bike, AlertTriangle, CheckCircle, DollarSign, 
  BarChart, ArrowUpCircle, Filter, Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { InventoryItem } from '@shared/schema';

interface InventoryFormData {
  name: string;
  description: string;
  category: 'cars' | 'motorcycles' | 'electronics';
  sku: string;
  costPrice: string;
  retailPrice: string;
  wholesalePrice: string;
  stock: number;
  minStock: number;
  imageUrl: string;
}

export default function InventoryManagement() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<InventoryFormData>({
    name: '',
    description: '',
    category: 'cars',
    sku: '',
    costPrice: '',
    retailPrice: '',
    wholesalePrice: '',
    stock: 0,
    minStock: 5,
    imageUrl: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inventory = [], isLoading } = useQuery<InventoryItem[]>({
    queryKey: ['/api/inventory'],
  });

  const createMutation = useMutation({
    mutationFn: (data: InventoryFormData) => apiRequest('POST', '/api/inventory', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      setShowCreateForm(false);
      resetForm();
      toast({
        title: "✅ Producto creado",
        description: "El producto ha sido agregado al inventario.",
      });
    },
    onError: () => {
      toast({
        title: "❌ Error",
        description: "Error al crear el producto.",
        variant: "destructive",
      });
    },
  });

  const publishMutation = useMutation({
    mutationFn: (id: string) => apiRequest('POST', `/api/inventory/${id}/publish`),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "🚀 Producto publicado",
        description: "El producto ha sido publicado en la tienda.",
      });
    },
    onError: () => {
      toast({
        title: "❌ Error",
        description: "Error al publicar el producto.",
        variant: "destructive",
      });
    },
  });

  const bulkPublishMutation = useMutation({
    mutationFn: ({ ids, category }: { ids: string[]; category?: string }) => 
      apiRequest('POST', '/api/inventory/bulk-publish', { ids, category }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setSelectedItems([]);
      toast({
        title: "🚀 Productos publicados",
        description: `Productos publicados exitosamente.`,
      });
    },
    onError: () => {
      toast({
        title: "❌ Error",
        description: "Error al publicar los productos.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'cars',
      sku: '',
      costPrice: '',
      retailPrice: '',
      wholesalePrice: '',
      stock: 0,
      minStock: 5,
      imageUrl: ''
    });
  };

  const handleCreate = () => {
    if (!formData.name.trim()) {
      toast({
        title: "⚠️ Campo requerido",
        description: "El nombre del producto es obligatorio.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(formData);
  };

  const handlePublish = (id: string) => {
    publishMutation.mutate(id);
  };

  const handleBulkPublish = () => {
    if (selectedItems.length === 0) {
      toast({
        title: "⚠️ Selección requerida",
        description: "Selecciona al menos un producto para publicar.",
        variant: "destructive",
      });
      return;
    }

    bulkPublishMutation.mutate({ 
      ids: selectedItems,
      category: categoryFilter !== 'all' ? categoryFilter : undefined
    });
  };

  const handleSelectItem = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === filteredInventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredInventory.map(item => item.id));
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.sku?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesCategory && matchesSearch;
  });

  const getStockStatus = (item: InventoryItem) => {
    if (item.stock <= 0) return { status: 'out', color: 'bg-blue-600', text: 'Sin Stock' };
    if (item.stock <= item.minStock) return { status: 'low', color: 'bg-yellow-600', text: 'Stock Bajo' };
    return { status: 'good', color: 'bg-green-600', text: 'En Stock' };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cars': return Car;
      case 'motorcycles': return Bike;
      default: return Package;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cars': return 'bg-blue-600';
      case 'motorcycles': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8" data-testid="inventory-loading">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="inventory-management-panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gestión de Inventario</h2>
          <p className="text-white">Administra productos antes de publicarlos</p>
        </div>
        <div className="flex gap-2">
          {selectedItems.length > 0 && (
            <Button
              onClick={handleBulkPublish}
              disabled={bulkPublishMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-gray-700"
              data-testid="bulk-publish-button"
            >
              <Send className="h-4 w-4 mr-2" />
              Publicar {selectedItems.length} Seleccionados
            </Button>
          )}
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="create-inventory-item-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Agregar Producto
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Buscar productos o SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-700 border-gray-600 text-white"
            data-testid="search-inventory"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="cars">Autos</SelectItem>
            <SelectItem value="motorcycles">Motocicletas</SelectItem>
            <SelectItem value="electronics">Electrónicos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-700 flex items-center gap-2">
              <Package className="h-5 w-5" />
              Agregar Nuevo Producto al Inventario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-white">Nombre del Producto *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Filtro de aceite premium"
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-name"
                />
              </div>
              <div>
                <Label htmlFor="sku" className="text-white">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
                  placeholder="FO-001"
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-sku"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del producto"
                className="bg-gray-700 border-gray-600 text-gray-700"
                data-testid="input-description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="category" className="text-gray-300">Categoría</Label>
                <Select value={formData.category} onValueChange={(value: 'cars' | 'motorcycles' | 'electronics') => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    <SelectItem value="cars">Autos</SelectItem>
                    <SelectItem value="motorcycles">Motocicletas</SelectItem>
                    <SelectItem value="electronics">Electrónicos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="costPrice" className="text-gray-300">Precio de Costo</Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  value={formData.costPrice}
                  onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  placeholder="10.00"
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-cost-price"
                />
              </div>
              <div>
                <Label htmlFor="retailPrice" className="text-gray-300">Precio Minorista</Label>
                <Input
                  id="retailPrice"
                  type="number"
                  step="0.01"
                  value={formData.retailPrice}
                  onChange={(e) => setFormData({ ...formData, retailPrice: e.target.value })}
                  placeholder="25.99"
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-retail-price"
                />
              </div>
              <div>
                <Label htmlFor="wholesalePrice" className="text-gray-300">Precio Mayorista</Label>
                <Input
                  id="wholesalePrice"
                  type="number"
                  step="0.01"
                  value={formData.wholesalePrice}
                  onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                  placeholder="18.99"
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-wholesale-price"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="stock" className="text-white">Stock Actual</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  placeholder="100"
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-stock"
                />
              </div>
              <div>
                <Label htmlFor="minStock" className="text-white">Stock Mínimo</Label>
                <Input
                  id="minStock"
                  type="number"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                  placeholder="5"
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-min-stock"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl" className="text-white">URL de Imagen</Label>
                <Input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-image-url"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="save-inventory-item-button"
              >
                <Save className="h-4 w-4 mr-2" />
                {createMutation.isPending ? 'Guardando...' : 'Guardar Producto'}
              </Button>
              <Button
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                data-testid="cancel-create-inventory-button"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory List */}
      {filteredInventory.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Inventario ({filteredInventory.length} productos)
              </CardTitle>
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                  onCheckedChange={handleSelectAll}
                  data-testid="select-all-checkbox"
                />
                <Label className="text-white">Seleccionar todos</Label>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                const CategoryIcon = getCategoryIcon(item.category);
                const categoryColor = getCategoryColor(item.category);
                
                return (
                  <Card key={item.id} className="bg-gray-700 border-gray-600 hover:border-blue-500 transition-colors" data-testid={`inventory-item-card-${item.id}`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={() => handleSelectItem(item.id)}
                            data-testid={`select-item-${item.id}`}
                          />
                          <Badge className={`${categoryColor} text-gray-700`}>
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {item.category === 'cars' ? 'Auto' : item.category === 'motorcycles' ? 'Moto' : 'Tech'}
                          </Badge>
                        </div>
                        <Badge className={`${stockStatus.color} text-gray-700`}>
                          {stockStatus.text}
                        </Badge>
                      </div>

                      <div className="mb-3">
                        <h3 className="text-gray-700 font-semibold mb-1">{item.name}</h3>
                        <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                        <p className="text-gray-500 text-xs mt-1">SKU: {item.sku || 'N/A'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                        <div>
                          <span className="text-gray-400">Stock:</span>
                          <span className="text-white ml-1">{item.stock}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Mín:</span>
                          <span className="text-white ml-1">{item.minStock}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Retail:</span>
                          <span className="text-green-400 ml-1">${item.retailPrice}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Mayor:</span>
                          <span className="text-blue-400 ml-1">${item.wholesalePrice}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {item.isPublished ? (
                          <Badge className="flex-1 bg-green-600 text-white justify-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Publicado
                          </Badge>
                        ) : (
                          <Button
                            onClick={() => handlePublish(item.id)}
                            disabled={publishMutation.isPending}
                            size="sm"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            data-testid={`publish-button-${item.id}`}
                          >
                            <ArrowUpCircle className="h-4 w-4 mr-1" />
                            Publicar
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {filteredInventory.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <Package className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || categoryFilter !== 'all' ? 'No se encontraron productos' : 'Inventario vacío'}
            </h3>
            <p className="text-white mb-6">
              {searchTerm || categoryFilter !== 'all' 
                ? 'Intenta con otros términos de búsqueda o filtros'
                : 'Agrega el primer producto al inventario'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Primer Producto
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}