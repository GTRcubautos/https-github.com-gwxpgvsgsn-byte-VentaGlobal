import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import type { User, Order, RewardsConfig, CampaignConfig } from '@shared/schema';

const rewardsConfigSchema = z.object({
  pointsPerVisit: z.number().min(0).max(1000),
  pointsPerPurchase: z.number().min(0).max(1000),
  pointsPerShare: z.number().min(0).max(1000),
  pointValue: z.string().regex(/^\d+\.?\d*$/, 'Debe ser un número válido'),
  isActive: z.boolean(),
});

const campaignSchema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  platform: z.string().default('youtube'),
  dailyBudget: z.string().regex(/^\d+\.?\d*$/, 'Debe ser un número válido'),
  targetAudience: z.string().min(1, 'Audiencia objetivo requerida'),
  status: z.enum(['active', 'paused', 'completed']).default('active'),
});

type RewardsConfigForm = z.infer<typeof rewardsConfigSchema>;
type CampaignForm = z.infer<typeof campaignSchema>;

export default function Admin() {
  const [activeTab, setActiveTab] = useState('clients');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Data queries
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  const { data: orders = [], isLoading: ordersLoading } = useQuery<Order[]>({
    queryKey: ['/api/admin/orders'],
  });

  const { data: rewardsConfig, isLoading: rewardsLoading } = useQuery<RewardsConfig>({
    queryKey: ['/api/rewards/config'],
  });

  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery<CampaignConfig[]>({
    queryKey: ['/api/campaigns'],
  });

  // Forms
  const rewardsForm = useForm<RewardsConfigForm>({
    resolver: zodResolver(rewardsConfigSchema),
    defaultValues: {
      pointsPerVisit: rewardsConfig?.pointsPerVisit || 10,
      pointsPerPurchase: rewardsConfig?.pointsPerPurchase || 50,
      pointsPerShare: rewardsConfig?.pointsPerShare || 25,
      pointValue: rewardsConfig?.pointValue || '0.01',
      isActive: rewardsConfig?.isActive || true,
    },
  });

  const campaignForm = useForm<CampaignForm>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      platform: 'youtube',
      dailyBudget: '',
      targetAudience: '',
      status: 'active',
    },
  });

  // Mutations
  const updateRewardsMutation = useMutation({
    mutationFn: async (data: RewardsConfigForm) => {
      const response = await apiRequest('PUT', '/api/rewards/config', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Configuración actualizada",
        description: "Los ajustes de recompensas han sido guardados",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/rewards/config'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive",
      });
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (data: CampaignForm) => {
      const response = await apiRequest('POST', '/api/campaigns', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Campaña creada",
        description: "La nueva campaña de YouTube ha sido creada",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      campaignForm.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la campaña",
        variant: "destructive",
      });
    },
  });

  const updateCampaignMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<CampaignConfig> }) => {
      const response = await apiRequest('PUT', `/api/campaigns/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Campaña actualizada",
        description: "Los cambios han sido guardados",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
    },
  });

  // Update form when data loads
  useState(() => {
    if (rewardsConfig) {
      rewardsForm.reset({
        pointsPerVisit: rewardsConfig.pointsPerVisit,
        pointsPerPurchase: rewardsConfig.pointsPerPurchase,
        pointsPerShare: rewardsConfig.pointsPerShare,
        pointValue: rewardsConfig.pointValue,
        isActive: rewardsConfig.isActive,
      });
    }
  });

  const onUpdateRewards = (data: RewardsConfigForm) => {
    updateRewardsMutation.mutate(data);
  };

  const onCreateCampaign = (data: CampaignForm) => {
    createCampaignMutation.mutate(data);
  };

  const toggleCampaignStatus = (campaign: CampaignConfig) => {
    const newStatus = campaign.status === 'active' ? 'paused' : 'active';
    updateCampaignMutation.mutate({
      id: campaign.id,
      updates: { status: newStatus },
    });
  };

  // Statistics calculations
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const wholesaleUsers = users.filter(user => user.userType === 'wholesale').length;
  const retailUsers = users.filter(user => user.userType === 'retail').length;
  const totalPoints = users.reduce((sum, user) => sum + user.points, 0);

  return (
    <div className="py-16 bg-white" data-testid="admin-page">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-secondary mb-2">
          Panel de Administración
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-12"></div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <i className="fas fa-users text-2xl text-primary mr-4"></i>
                <div>
                  <p className="text-sm text-gray-600">Total Usuarios</p>
                  <p className="text-2xl font-bold" data-testid="total-users">
                    {users.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <i className="fas fa-dollar-sign text-2xl text-primary mr-4"></i>
                <div>
                  <p className="text-sm text-gray-600">Ingresos Totales</p>
                  <p className="text-2xl font-bold" data-testid="total-revenue">
                    ${totalRevenue.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <i className="fas fa-shopping-cart text-2xl text-primary mr-4"></i>
                <div>
                  <p className="text-sm text-gray-600">Total Pedidos</p>
                  <p className="text-2xl font-bold" data-testid="total-orders">
                    {orders.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <i className="fas fa-star text-2xl text-primary mr-4"></i>
                <div>
                  <p className="text-sm text-gray-600">Puntos Totales</p>
                  <p className="text-2xl font-bold" data-testid="total-points">
                    {totalPoints.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-4">
            <TabsTrigger value="clients" data-testid="tab-clients">
              Gestión de Clientes
            </TabsTrigger>
            <TabsTrigger value="rewards" data-testid="tab-rewards">
              Sistema de Recompensas
            </TabsTrigger>
            <TabsTrigger value="campaigns" data-testid="tab-campaigns">
              Campañas YouTube
            </TabsTrigger>
            <TabsTrigger value="orders" data-testid="tab-orders">
              Gestión de Pedidos
            </TabsTrigger>
          </TabsList>

          {/* Client Management */}
          <TabsContent value="clients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-users mr-2"></i>
                  Gestión de Clientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Usuarios Mayoristas</h4>
                      <p className="text-2xl font-bold text-primary" data-testid="wholesale-count">
                        {wholesaleUsers}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-semibold mb-2">Usuarios Minoristas</h4>
                      <p className="text-2xl font-bold text-secondary" data-testid="retail-count">
                        {retailUsers}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {usersLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-16 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3" data-testid="users-list">
                    {users.map((user) => (
                      <div key={user.id} className="bg-gray-50 p-4 rounded border" data-testid={`user-${user.id}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div>
                              <span className="font-semibold" data-testid={`user-name-${user.id}`}>
                                {user.username}
                              </span>
                              <p className="text-sm text-gray-600" data-testid={`user-email-${user.id}`}>
                                {user.email}
                              </p>
                            </div>
                            <Badge 
                              variant={user.userType === 'wholesale' ? 'default' : 'secondary'}
                              data-testid={`user-type-${user.id}`}
                            >
                              {user.userType === 'wholesale' ? 'Mayorista' : 'Minorista'}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold" data-testid={`user-points-${user.id}`}>
                              {user.points} puntos
                            </p>
                            <p className="text-sm text-gray-600">
                              ${(user.points * 0.01).toFixed(2)} en descuentos
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Management */}
          <TabsContent value="rewards" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-trophy mr-2"></i>
                  Sistema de Recompensas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={rewardsForm.handleSubmit(onUpdateRewards)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pointsPerVisit">Puntos por Visita</Label>
                      <Input
                        id="pointsPerVisit"
                        type="number"
                        {...rewardsForm.register('pointsPerVisit', { valueAsNumber: true })}
                        data-testid="points-per-visit"
                      />
                      {rewardsForm.formState.errors.pointsPerVisit && (
                        <p className="text-sm text-red-500 mt-1">
                          {rewardsForm.formState.errors.pointsPerVisit.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="pointsPerPurchase">Puntos por Compra</Label>
                      <Input
                        id="pointsPerPurchase"
                        type="number"
                        {...rewardsForm.register('pointsPerPurchase', { valueAsNumber: true })}
                        data-testid="points-per-purchase"
                      />
                      {rewardsForm.formState.errors.pointsPerPurchase && (
                        <p className="text-sm text-red-500 mt-1">
                          {rewardsForm.formState.errors.pointsPerPurchase.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="pointsPerShare">Puntos por Compartir</Label>
                      <Input
                        id="pointsPerShare"
                        type="number"
                        {...rewardsForm.register('pointsPerShare', { valueAsNumber: true })}
                        data-testid="points-per-share"
                      />
                      {rewardsForm.formState.errors.pointsPerShare && (
                        <p className="text-sm text-red-500 mt-1">
                          {rewardsForm.formState.errors.pointsPerShare.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="pointValue">Valor por Punto ($)</Label>
                      <Input
                        id="pointValue"
                        type="number"
                        step="0.01"
                        {...rewardsForm.register('pointValue')}
                        data-testid="point-value"
                      />
                      {rewardsForm.formState.errors.pointValue && (
                        <p className="text-sm text-red-500 mt-1">
                          {rewardsForm.formState.errors.pointValue.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isActive"
                      checked={rewardsForm.watch('isActive')}
                      onCheckedChange={(checked) => rewardsForm.setValue('isActive', checked)}
                      data-testid="rewards-active"
                    />
                    <Label htmlFor="isActive">Sistema Activo</Label>
                  </div>

                  <Button
                    type="submit"
                    disabled={updateRewardsMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                    data-testid="update-rewards"
                  >
                    {updateRewardsMutation.isPending ? 'Actualizando...' : 'Actualizar Configuración'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* YouTube Campaigns */}
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fab fa-youtube mr-2"></i>
                  Campañas YouTube
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Create New Campaign */}
                <form onSubmit={campaignForm.handleSubmit(onCreateCampaign)} className="space-y-4 mb-8 p-4 border rounded-lg">
                  <h4 className="font-semibold">Crear Nueva Campaña</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="campaignName">Nombre de la Campaña</Label>
                      <Input
                        id="campaignName"
                        {...campaignForm.register('name')}
                        data-testid="campaign-name"
                      />
                      {campaignForm.formState.errors.name && (
                        <p className="text-sm text-red-500 mt-1">
                          {campaignForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="dailyBudget">Presupuesto Diario ($)</Label>
                      <Input
                        id="dailyBudget"
                        type="number"
                        step="0.01"
                        {...campaignForm.register('dailyBudget')}
                        data-testid="daily-budget"
                      />
                      {campaignForm.formState.errors.dailyBudget && (
                        <p className="text-sm text-red-500 mt-1">
                          {campaignForm.formState.errors.dailyBudget.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="targetAudience">Audiencia Objetivo</Label>
                      <Select
                        value={campaignForm.watch('targetAudience')}
                        onValueChange={(value) => campaignForm.setValue('targetAudience', value)}
                      >
                        <SelectTrigger data-testid="target-audience">
                          <SelectValue placeholder="Seleccionar audiencia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Tecnología">Tecnología</SelectItem>
                          <SelectItem value="Autos">Autos</SelectItem>
                          <SelectItem value="Motos">Motos</SelectItem>
                          <SelectItem value="General">General</SelectItem>
                        </SelectContent>
                      </Select>
                      {campaignForm.formState.errors.targetAudience && (
                        <p className="text-sm text-red-500 mt-1">
                          {campaignForm.formState.errors.targetAudience.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={campaignForm.watch('status')}
                        onValueChange={(value) => campaignForm.setValue('status', value as 'active' | 'paused' | 'completed')}
                      >
                        <SelectTrigger data-testid="campaign-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activa</SelectItem>
                          <SelectItem value="paused">Pausada</SelectItem>
                          <SelectItem value="completed">Completada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={createCampaignMutation.isPending}
                    className="bg-red-600 hover:bg-red-700 text-white"
                    data-testid="create-campaign"
                  >
                    {createCampaignMutation.isPending ? 'Creando...' : 'Crear Nueva Campaña'}
                  </Button>
                </form>

                {/* Existing Campaigns */}
                {campaignsLoading ? (
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-24 rounded"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="campaigns-list">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="bg-gray-50 p-4 rounded border" data-testid={`campaign-${campaign.id}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold" data-testid={`campaign-name-${campaign.id}`}>
                              {campaign.name}
                            </h4>
                            <p className="text-sm text-gray-600" data-testid={`campaign-audience-${campaign.id}`}>
                              Audiencia: {campaign.targetAudience}
                            </p>
                            <p className="text-sm text-gray-600" data-testid={`campaign-budget-${campaign.id}`}>
                              Presupuesto diario: ${campaign.dailyBudget}
                            </p>
                            {campaign.metrics && typeof campaign.metrics === 'object' && campaign.metrics !== null && (
                              <div className="text-sm text-gray-600 mt-2" data-testid={`campaign-metrics-${campaign.id}`}>
                                <span>Reproducciones: {(campaign.metrics as Record<string, any>).views || 0}</span>
                                <span className="ml-4">CTR: {(campaign.metrics as Record<string, any>).ctr || 0}%</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant={campaign.status === 'active' ? 'default' : 'secondary'}
                              data-testid={`campaign-status-${campaign.id}`}
                            >
                              {campaign.status === 'active' ? 'Activa' : 
                               campaign.status === 'paused' ? 'Pausada' : 'Completada'}
                            </Badge>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleCampaignStatus(campaign)}
                              disabled={updateCampaignMutation.isPending || campaign.status === 'completed'}
                              data-testid={`toggle-campaign-${campaign.id}`}
                            >
                              {campaign.status === 'active' ? 'Pausar' : 'Activar'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Management */}
          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <i className="fas fa-shopping-cart mr-2"></i>
                  Gestión de Pedidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gray-200 h-20 rounded"></div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-8" data-testid="no-orders">
                    <i className="fas fa-shopping-cart text-4xl text-gray-400 mb-4"></i>
                    <p className="text-gray-600">No hay pedidos registrados</p>
                  </div>
                ) : (
                  <div className="space-y-3" data-testid="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="bg-gray-50 p-4 rounded border" data-testid={`order-${order.id}`}>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold" data-testid={`order-id-${order.id}`}>
                              Pedido #{order.id.slice(-8)}
                            </p>
                            <p className="text-sm text-gray-600" data-testid={`order-date-${order.id}`}>
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600" data-testid={`order-payment-${order.id}`}>
                              Método: {order.paymentMethod}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg" data-testid={`order-total-${order.id}`}>
                              ${parseFloat(order.total).toFixed(2)}
                            </p>
                            <Badge 
                              variant={order.status === 'completed' ? 'default' : 'secondary'}
                              data-testid={`order-status-${order.id}`}
                            >
                              {order.status === 'completed' ? 'Completado' : 
                               order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                            </Badge>
                            <p className="text-sm text-primary" data-testid={`order-points-${order.id}`}>
                              {order.pointsEarned} puntos
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
