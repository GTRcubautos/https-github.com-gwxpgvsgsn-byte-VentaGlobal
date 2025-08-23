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
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Users, DollarSign, ShoppingCart, Star, TrendingUp, TrendingDown, 
  Car, Bike, Settings, BarChart3, PieChart, Activity, Shield,
  Crown, Zap, Target, MessageSquare, Mail, Phone, Calendar,
  FileText, CreditCard, Lock, AlertTriangle, CheckCircle,
  Clock, Globe, Instagram, Facebook, Twitter, Youtube,
  RefreshCw, Plus, Edit, Trash2, Eye, Send, Filter,
  Download, Upload, Search, ArrowUp, ArrowDown
} from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('dashboard');
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
        title: "✅ Configuración actualizada",
        description: "Los ajustes de recompensas han sido guardados",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/rewards/config'] });
    },
    onError: () => {
      toast({
        title: "❌ Error",
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
        title: "🚀 Campaña creada",
        description: "La nueva campaña publicitaria ha sido creada",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      campaignForm.reset();
    },
    onError: () => {
      toast({
        title: "❌ Error",
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
        title: "✅ Campaña actualizada",
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
  
  // Advanced metrics
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.createdAt).toDateString();
    return today === orderDate;
  }).length;
  
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const conversionRate = users.length > 0 ? (completedOrders / users.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20" data-testid="admin-page">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                🏢 Dashboard GTR CUBAUTOS
              </h1>
              <p className="text-blue-100 text-lg">
                Centro de control administrativo
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-white/20 text-white backdrop-blur-sm px-4 py-2">
                <Shield className="h-4 w-4 mr-2" />
                Sesión Segura
              </Badge>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2" data-testid="tab-dashboard">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2" data-testid="tab-clients">
              <Users className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2" data-testid="tab-orders">
              <ShoppingCart className="h-4 w-4" />
              Pedidos
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2" data-testid="tab-social">
              <Globe className="h-4 w-4" />
              Redes Sociales
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2" data-testid="tab-rewards">
              <Star className="h-4 w-4" />
              Recompensas
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2" data-testid="tab-security">
              <Lock className="h-4 w-4" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200/50 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Total Usuarios</p>
                      <p className="text-3xl font-bold text-blue-700" data-testid="total-users">
                        {users.length}
                      </p>
                      <div className="flex items-center text-xs text-blue-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12% este mes
                      </div>
                    </div>
                    <Users className="h-12 w-12 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-200/50 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Ingresos Totales</p>
                      <p className="text-3xl font-bold text-green-700" data-testid="total-revenue">
                        ${totalRevenue.toLocaleString()}
                      </p>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +28% este mes
                      </div>
                    </div>
                    <DollarSign className="h-12 w-12 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200/50 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 font-medium">Pedidos Hoy</p>
                      <p className="text-3xl font-bold text-purple-700" data-testid="today-orders">
                        {todayOrders}
                      </p>
                      <div className="flex items-center text-xs text-purple-600 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        En tiempo real
                      </div>
                    </div>
                    <ShoppingCart className="h-12 w-12 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-200/50 hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">Tasa Conversión</p>
                      <p className="text-3xl font-bold text-orange-700" data-testid="conversion-rate">
                        {conversionRate.toFixed(1)}%
                      </p>
                      <div className="flex items-center text-xs text-orange-600 mt-1">
                        <Target className="h-3 w-3 mr-1" />
                        Excelente
                      </div>
                    </div>
                    <Activity className="h-12 w-12 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Análisis de Ventas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                      <span className="font-medium">Valor Promedio de Pedido</span>
                      <span className="text-xl font-bold text-blue-600">${averageOrderValue.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <span className="font-medium">Pedidos Completados</span>
                      <span className="text-xl font-bold text-green-600">{completedOrders}</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                      <span className="font-medium">Puntos Totales</span>
                      <span className="text-xl font-bold text-purple-600">{totalPoints.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5 text-purple-600" />
                    Distribución de Usuarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Crown className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">Usuarios Mayoristas</span>
                      </div>
                      <Badge className="bg-blue-600 text-white">{wholesaleUsers}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-green-600" />
                        <span className="font-medium">Usuarios Minoristas</span>
                      </div>
                      <Badge className="bg-green-600 text-white">{retailUsers}</Badge>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <div className="text-sm text-purple-600">Total de usuarios registrados</div>
                      <div className="text-2xl font-bold text-purple-700">{users.length}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium">Pedido #{order.id.slice(-8)}</div>
                          <div className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()} - {order.paymentMethod}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">${parseFloat(order.total).toFixed(2)}</div>
                        <Badge className={order.status === 'completed' ? 'bg-green-600' : 'bg-yellow-600'}>
                          {order.status === 'completed' ? 'Completado' : 'Pendiente'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Gestión de Clientes CRM
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Search className="h-4 w-4" />
                      Buscar
                    </Button>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Cliente
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-20 rounded-lg"></div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="users-list">
                    {users.map((user) => (
                      <Card key={user.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid={`user-${user.id}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                                user.userType === 'wholesale' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gradient-to-r from-green-500 to-cyan-500'
                              }`}>
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-lg" data-testid={`user-name-${user.id}`}>
                                  {user.username}
                                </div>
                                <div className="text-gray-600" data-testid={`user-email-${user.id}`}>
                                  {user.email}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    className={user.userType === 'wholesale' ? 'bg-blue-600' : 'bg-green-600'}
                                    data-testid={`user-type-${user.id}`}
                                  >
                                    {user.userType === 'wholesale' ? '👑 Mayorista VIP' : '🛒 Cliente Regular'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600" data-testid={`user-points-${user.id}`}>
                                {user.points.toLocaleString()} pts
                              </div>
                              <div className="text-sm text-gray-600">
                                ${(user.points * 0.01).toFixed(2)} en descuentos
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline">
                                  <Mail className="h-3 w-3 mr-1" />
                                  Email
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Phone className="h-3 w-3 mr-1" />
                                  Llamar
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                    Gestión de Pedidos
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtrar
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {ordersLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-24 rounded-lg"></div>
                    ))}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12" data-testid="no-orders">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-600 mb-2">No hay pedidos registrados</h3>
                    <p className="text-gray-500">Los pedidos aparecerán aquí cuando los clientes realicen compras</p>
                  </div>
                ) : (
                  <div className="space-y-4" data-testid="orders-list">
                    {orders.map((order) => (
                      <Card key={order.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300" data-testid={`order-${order.id}`}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                #
                              </div>
                              <div>
                                <div className="font-bold text-lg" data-testid={`order-id-${order.id}`}>
                                  Pedido #{order.id.slice(-8)}
                                </div>
                                <div className="text-gray-600" data-testid={`order-date-${order.id}`}>
                                  {new Date(order.createdAt).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <CreditCard className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm text-gray-600" data-testid={`order-payment-${order.id}`}>
                                    {order.paymentMethod}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" data-testid={`order-total-${order.id}`}>
                                ${parseFloat(order.total).toFixed(2)}
                              </div>
                              <Badge 
                                className={`${
                                  order.status === 'completed' 
                                    ? 'bg-green-600 text-white' 
                                    : order.status === 'pending'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-red-600 text-white'
                                }`}
                                data-testid={`order-status-${order.id}`}
                              >
                                {order.status === 'completed' ? '✅ Completado' : 
                                 order.status === 'pending' ? '⏳ Pendiente' : '❌ Cancelado'}
                              </Badge>
                              <div className="text-sm text-purple-600 mt-1" data-testid={`order-points-${order.id}`}>
                                +{order.pointsEarned} puntos GTR
                              </div>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-3 w-3 mr-1" />
                                  Ver
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-3 w-3 mr-1" />
                                  Editar
                                </Button>
                                <Button size="sm" variant="outline">
                                  <FileText className="h-3 w-3 mr-1" />
                                  Factura
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Automatización de Redes Sociales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200/50">
                    <CardContent className="p-4 text-center">
                      <Facebook className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <div className="font-bold">Facebook</div>
                      <div className="text-sm text-blue-600">15.2K seguidores</div>
                      <Button size="sm" className="mt-2 bg-blue-600 text-white w-full">
                        Configurar
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-pink-500/10 to-pink-600/20 border-pink-200/50">
                    <CardContent className="p-4 text-center">
                      <Instagram className="h-8 w-8 mx-auto mb-2 text-pink-600" />
                      <div className="font-bold">Instagram</div>
                      <div className="text-sm text-pink-600">8.7K seguidores</div>
                      <Button size="sm" className="mt-2 bg-pink-600 text-white w-full">
                        Configurar
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/20 border-cyan-200/50">
                    <CardContent className="p-4 text-center">
                      <Twitter className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
                      <div className="font-bold">X (Twitter)</div>
                      <div className="text-sm text-cyan-600">5.1K seguidores</div>
                      <Button size="sm" className="mt-2 bg-cyan-600 text-white w-full">
                        Configurar
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-red-500/10 to-red-600/20 border-red-200/50">
                    <CardContent className="p-4 text-center">
                      <Youtube className="h-8 w-8 mx-auto mb-2 text-red-600" />
                      <div className="font-bold">YouTube</div>
                      <div className="text-sm text-red-600">2.3K suscriptores</div>
                      <Button size="sm" className="mt-2 bg-red-600 text-white w-full">
                        Configurar
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Campañas Automáticas</h3>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Campaña
                    </Button>
                  </div>

                  {campaignsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse bg-gray-200 h-24 rounded-lg"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4" data-testid="campaigns-list">
                      {campaigns.map((campaign) => (
                        <Card key={campaign.id} className="hover:shadow-lg transition-shadow duration-300" data-testid={`campaign-${campaign.id}`}>
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                                  <Youtube className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                  <div className="font-bold text-lg" data-testid={`campaign-name-${campaign.id}`}>
                                    {campaign.name}
                                  </div>
                                  <div className="text-gray-600" data-testid={`campaign-audience-${campaign.id}`}>
                                    Audiencia: {campaign.targetAudience}
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge className={campaign.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                                      {campaign.status === 'active' ? '🚀 Activa' : '⏸️ Pausada'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-600" data-testid={`campaign-budget-${campaign.id}`}>
                                  ${campaign.dailyBudget}/día
                                </div>
                                {campaign.metrics && typeof campaign.metrics === 'object' && campaign.metrics !== null && (
                                  <div className="text-sm text-gray-600 mt-1" data-testid={`campaign-metrics-${campaign.id}`}>
                                    <div>📊 {(campaign.metrics as Record<string, any>).views || 0} vistas</div>
                                    <div>📈 CTR: {(campaign.metrics as Record<string, any>).ctr || 0}%</div>
                                  </div>
                                )}
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleCampaignStatus(campaign)}
                                  >
                                    {campaign.status === 'active' ? 'Pausar' : 'Activar'}
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Sistema de Recompensas GTR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={rewardsForm.handleSubmit(onUpdateRewards)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="pointsPerVisit" className="text-sm font-medium">
                        Puntos por Visita Diaria
                      </Label>
                      <Input
                        id="pointsPerVisit"
                        type="number"
                        {...rewardsForm.register('pointsPerVisit', { valueAsNumber: true })}
                        className="border-gray-200"
                        data-testid="points-per-visit"
                      />
                      {rewardsForm.formState.errors.pointsPerVisit && (
                        <p className="text-sm text-red-500">
                          {rewardsForm.formState.errors.pointsPerVisit.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pointsPerPurchase" className="text-sm font-medium">
                        Puntos por Compra (por cada $1)
                      </Label>
                      <Input
                        id="pointsPerPurchase"
                        type="number"
                        {...rewardsForm.register('pointsPerPurchase', { valueAsNumber: true })}
                        className="border-gray-200"
                        data-testid="points-per-purchase"
                      />
                      {rewardsForm.formState.errors.pointsPerPurchase && (
                        <p className="text-sm text-red-500">
                          {rewardsForm.formState.errors.pointsPerPurchase.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pointsPerShare" className="text-sm font-medium">
                        Puntos por Compartir en Redes
                      </Label>
                      <Input
                        id="pointsPerShare"
                        type="number"
                        {...rewardsForm.register('pointsPerShare', { valueAsNumber: true })}
                        className="border-gray-200"
                        data-testid="points-per-share"
                      />
                      {rewardsForm.formState.errors.pointsPerShare && (
                        <p className="text-sm text-red-500">
                          {rewardsForm.formState.errors.pointsPerShare.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pointValue" className="text-sm font-medium">
                        Valor por Punto en USD
                      </Label>
                      <Input
                        id="pointValue"
                        type="number"
                        step="0.01"
                        {...rewardsForm.register('pointValue')}
                        className="border-gray-200"
                        data-testid="point-value"
                      />
                      {rewardsForm.formState.errors.pointValue && (
                        <p className="text-sm text-red-500">
                          {rewardsForm.formState.errors.pointValue.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <Switch
                        id="isActive"
                        checked={rewardsForm.watch('isActive')}
                        onCheckedChange={(checked) => rewardsForm.setValue('isActive', checked)}
                        data-testid="rewards-active"
                      />
                      <Label htmlFor="isActive" className="font-medium">
                        Sistema de Recompensas Activo
                      </Label>
                    </div>
                    <Badge className={rewardsForm.watch('isActive') ? 'bg-green-600' : 'bg-gray-600'}>
                      {rewardsForm.watch('isActive') ? '🟢 Habilitado' : '🔴 Deshabilitado'}
                    </Badge>
                  </div>

                  <Button
                    type="submit"
                    disabled={updateRewardsMutation.isPending}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-lg py-3"
                    data-testid="update-rewards"
                  >
                    {updateRewardsMutation.isPending ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Actualizando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Actualizar Configuración de Recompensas
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600" />
                  Centro de Seguridad GTR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-200/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                        <div>
                          <h3 className="font-bold text-green-700">SSL Certificado</h3>
                          <p className="text-sm text-green-600">Conexión segura activa</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600 text-white">✅ Activo</Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Lock className="h-8 w-8 text-blue-600" />
                        <div>
                          <h3 className="font-bold text-blue-700">Cifrado de Datos</h3>
                          <p className="text-sm text-blue-600">AES-256 implementado</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-600 text-white">🔒 Protegido</Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <CreditCard className="h-8 w-8 text-purple-600" />
                        <div>
                          <h3 className="font-bold text-purple-700">Pagos Seguros</h3>
                          <p className="text-sm text-purple-600">PCI DSS Compatible</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-600 text-white">💳 Certificado</Badge>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-200/50">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <AlertTriangle className="h-8 w-8 text-orange-600" />
                        <div>
                          <h3 className="font-bold text-orange-700">Monitoreo 24/7</h3>
                          <p className="text-sm text-orange-600">Sistema de alertas activo</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-600 text-white">🔍 Monitoreando</Badge>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold">Configuración de Seguridad</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Autenticación de Dos Factores</div>
                        <div className="text-sm text-gray-600">Capa adicional de seguridad para administradores</div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Registro de Actividad</div>
                        <div className="text-sm text-gray-600">Registrar todas las acciones administrativas</div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">Notificaciones de Seguridad</div>
                        <div className="text-sm text-gray-600">Alertas por actividad sospechosa</div>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                      <Shield className="h-4 w-4 mr-2" />
                      Realizar Auditoría de Seguridad
                    </Button>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar Logs de Seguridad
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}