import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Save, X, Key, CheckCircle, XCircle, Calendar, Users, Percent } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { WholesaleCode } from '@shared/schema';

interface WholesaleCodeFormData {
  code: string;
  description: string;
  isActive: boolean;
  expiresAt?: string;
  maxUses?: number;
  discountPercent?: number;
}

export default function WholesaleCodes() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState<WholesaleCodeFormData>({
    code: '',
    description: '',
    isActive: true,
    expiresAt: '',
    maxUses: undefined,
    discountPercent: undefined
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: wholesaleCodes = [], isLoading } = useQuery<WholesaleCode[]>({
    queryKey: ['/api/wholesale-codes'],
  });

  const createMutation = useMutation({
    mutationFn: (data: WholesaleCodeFormData) => apiRequest('POST', '/api/wholesale-codes', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wholesale-codes'] });
      setShowCreateForm(false);
      resetForm();
      toast({
        title: "✅ Código creado",
        description: "El código mayorista ha sido creado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "❌ Error",
        description: "Error al crear el código mayorista.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<WholesaleCode> }) => 
      apiRequest('PUT', `/api/wholesale-codes/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wholesale-codes'] });
      setEditingId(null);
      toast({
        title: "✅ Código actualizado",
        description: "El código mayorista ha sido actualizado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "❌ Error",
        description: "Error al actualizar el código mayorista.",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      code: '',
      description: '',
      isActive: true,
      expiresAt: '',
      maxUses: undefined,
      discountPercent: undefined
    });
  };

  const handleCreate = () => {
    if (!formData.code.trim()) {
      toast({
        title: "⚠️ Campo requerido",
        description: "El código es obligatorio.",
        variant: "destructive",
      });
      return;
    }

    const submitData = {
      ...formData,
      expiresAt: formData.expiresAt || undefined,
    };

    createMutation.mutate(submitData);
  };

  const handleUpdate = (id: string, updates: Partial<WholesaleCode>) => {
    updateMutation.mutate({ id, data: updates });
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isExpired = (expiresAt?: Date | null) => {
    if (!expiresAt) return false;
    return new Date() > new Date(expiresAt);
  };

  const getUsagePercentage = (current: number, max?: number | null) => {
    if (!max) return 0;
    return (current / max) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8" data-testid="wholesale-codes-loading">
        <div className="animate-spin w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="wholesale-codes-panel">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Códigos Mayoristas</h2>
          <p className="text-gray-400">Gestiona códigos de acceso mayorista</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white"
          data-testid="create-wholesale-code-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Crear Código
        </Button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="h-5 w-5" />
              Crear Nuevo Código Mayorista
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code" className="text-gray-300">Código *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="MAYORISTA2024"
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-code"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-active"
                />
                <Label className="text-gray-300">Código activo</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripción del código mayorista"
                className="bg-gray-700 border-gray-600 text-white"
                data-testid="input-description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="expiresAt" className="text-gray-300">Fecha de Expiración</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-expires-at"
                />
              </div>
              <div>
                <Label htmlFor="maxUses" className="text-gray-300">Usos Máximos</Label>
                <Input
                  id="maxUses"
                  type="number"
                  value={formData.maxUses || ''}
                  onChange={(e) => setFormData({ ...formData, maxUses: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder="100"
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-max-uses"
                />
              </div>
              <div>
                <Label htmlFor="discountPercent" className="text-gray-300">Descuento %</Label>
                <Input
                  id="discountPercent"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.discountPercent || ''}
                  onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value ? parseFloat(e.target.value) : undefined })}
                  placeholder="15"
                  className="bg-gray-700 border-gray-600 text-white"
                  data-testid="input-discount-percent"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white"
                data-testid="save-wholesale-code-button"
              >
                <Save className="h-4 w-4 mr-2" />
                {createMutation.isPending ? 'Creando...' : 'Crear Código'}
              </Button>
              <Button
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
                data-testid="cancel-create-button"
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Codes List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wholesaleCodes.map((code) => (
          <Card key={code.id} className="bg-gray-800 border-gray-700 hover:border-red-500 transition-colors" data-testid={`wholesale-code-card-${code.id}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="h-5 w-5 text-red-500" />
                  {code.code}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {code.isActive ? (
                    <Badge className="bg-green-600 text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Activo
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-600 text-white">
                      <XCircle className="h-3 w-3 mr-1" />
                      Inactivo
                    </Badge>
                  )}
                  {isExpired(code.expiresAt) && (
                    <Badge className="bg-red-600 text-white">
                      Expirado
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">{code.description}</p>
              
              <div className="space-y-2 text-sm text-gray-400">
                {code.expiresAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Expira: {formatDate(code.expiresAt)}</span>
                  </div>
                )}
                
                {code.maxUses && (
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Usos: {code.currentUses}/{code.maxUses}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-2 ml-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getUsagePercentage(code.currentUses, code.maxUses)}%` }}
                      />
                    </div>
                  </div>
                )}
                
                {code.discountPercent && (
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    <span>Descuento: {code.discountPercent}%</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => handleUpdate(code.id, { isActive: !code.isActive })}
                  disabled={updateMutation.isPending}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                  data-testid={`toggle-active-${code.id}`}
                >
                  {code.isActive ? 'Desactivar' : 'Activar'}
                </Button>
                <Button
                  onClick={() => setEditingId(code.id)}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                  data-testid={`edit-button-${code.id}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {wholesaleCodes.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-12">
            <Key className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No hay códigos mayoristas</h3>
            <p className="text-gray-400 mb-6">Crea el primer código mayorista para comenzar</p>
            <Button
              onClick={() => setShowCreateForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Crear Primer Código
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}