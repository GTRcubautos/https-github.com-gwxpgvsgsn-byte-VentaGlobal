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
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { 
  Users, DollarSign, ShoppingCart, Star, TrendingUp, TrendingDown, 
  Car, Bike, Settings, BarChart3, PieChart, Activity, Shield,
  Crown, Zap, Target, MessageSquare, Mail, Phone, Calendar,
  FileText, CreditCard, Lock, AlertTriangle, CheckCircle,
  Clock, Globe, Instagram, Facebook, Twitter, Youtube,
  RefreshCw, Plus, Edit, Trash2, Eye, Send, Filter,
  Download, Upload, Search, ArrowUp, ArrowDown, Package,
  Percent, Database, Bot, Bell, Home, Building, Tag
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

const discountSchema = z.object({
  code: z.string().min(3, 'Código mínimo 3 caracteres'),
  percentage: z.number().min(1).max(100),
  validUntil: z.string(),
  maxUses: z.number().min(1),
  isActive: z.boolean(),
});

type RewardsConfigForm = z.infer<typeof rewardsConfigSchema>;
type CampaignForm = z.infer<typeof campaignSchema>;
type DiscountForm = z.infer<typeof discountSchema>;

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

  const discountForm = useForm<DiscountForm>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      code: '',
      percentage: 10,
      validUntil: '',
      maxUses: 100,
      isActive: true,
    },
  });

  // Statistics calculations
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const wholesaleUsers = users.filter(user => user.userType === 'wholesale').length;
  const retailUsers = users.filter(user => user.userType === 'retail').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const todayOrders = orders.filter(order => {
    const today = new Date().toDateString();
    const orderDate = new Date(order.createdAt).toDateString();
    return today === orderDate;
  }).length;
  
  const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const conversionRate = users.length > 0 ? (completedOrders / users.length) * 100 : 0;

  // Mock inventory data
  const inventoryData = [
    { id: 1, name: 'Aceite Motor Sintético 5W-30', category: 'Lubricantes', stock: 45, minStock: 10, price: 94.50, status: 'En Stock' },
    { id: 2, name: 'Pastillas de Freno Cerámicas', category: 'Frenos', stock: 8, minStock: 15, price: 156.99, status: 'Stock Bajo' },
    { id: 3, name: 'Filtro de Aire K&N', category: 'Filtros', stock: 0, minStock: 20, price: 78.99, status: 'Agotado' },
    { id: 4, name: 'Llanta Michelin Pilot Sport', category: 'Llantas', stock: 22, minStock: 5, price: 299.99, status: 'En Stock' },
    { id: 5, name: 'Batería AGM 12V 75Ah', category: 'Eléctricos', stock: 12, minStock: 8, price: 189.99, status: 'En Stock' },
    { id: 6, name: 'Amortiguador Monroe', category: 'Suspensión', stock: 18, minStock: 12, price: 225.50, status: 'En Stock' },
  ];

  // Mock sales data for charts
  const salesData = [
    { month: 'Ene', ventas: 45000, objetivo: 50000 },
    { month: 'Feb', ventas: 52000, objetivo: 50000 },
    { month: 'Mar', ventas: 48000, objetivo: 55000 },
    { month: 'Abr', ventas: 61000, objetivo: 55000 },
    { month: 'May', ventas: 58000, objetivo: 60000 },
    { month: 'Jun', ventas: 67000, objetivo: 60000 },
  ];

  const analyticsData = {
    pageViews: 125430,
    uniqueVisitors: 8750,
    bounceRate: 32.5,
    avgSessionDuration: '00:03:45',
    topProducts: [
      { name: 'Filtro de Aceite', views: 2340, sales: 156 },
      { name: 'Pastillas de Freno', views: 1890, sales: 89 },
      { name: 'Aceite Motor', views: 1560, sales: 203 },
    ],
    trafficSources: [
      { source: 'Búsqueda Orgánica', percentage: 45.2 },
      { source: 'Redes Sociales', percentage: 28.7 },
      { source: 'Directo', percentage: 16.8 },
      { source: 'Referencias', percentage: 9.3 },
    ]
  };

  if (usersLoading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-page">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-automotive-black">GTR CUBAUTO Admin</h1>
              <p className="text-automotive-gray">Ciudad Darío • Today {new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right text-sm">
                <p className="font-medium text-automotive-black">Sistema v2.4.1</p>
                <p className="text-automotive-gray">Última actualización: Hoy</p>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Online
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Datos
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 mb-8 bg-white shadow-sm">
            <TabsTrigger value="dashboard" className="flex items-center gap-2" data-testid="tab-dashboard">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="crm" className="flex items-center gap-2" data-testid="tab-crm">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">CRM</span>
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2" data-testid="tab-inventory">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">Inventario</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2" data-testid="tab-sales">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Ventas</span>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2" data-testid="tab-campaigns">
              <Target className="h-4 w-4" />
              <span className="hidden sm:inline">Campañas</span>
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2" data-testid="tab-social">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">Redes</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2" data-testid="tab-analytics">
              <PieChart className="h-4 w-4" />
              <span className="hidden sm:inline">Analítica</span>
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2" data-testid="tab-automation">
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Automatización</span>
            </TabsTrigger>
            <TabsTrigger value="discounts" className="flex items-center gap-2" data-testid="tab-discounts">
              <Percent className="h-4 w-4" />
              <span className="hidden sm:inline">Descuentos</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2" data-testid="tab-settings">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Config</span>
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
                        ${totalRevenue.toFixed(2)}
                      </p>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +18% este mes
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
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8% vs ayer
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
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2.3% este mes
                      </div>
                    </div>
                    <Target className="h-12 w-12 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Ventas vs Objetivos (6 meses)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {salesData.map((data) => (
                      <div key={data.month} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{data.month}</span>
                          <span className="font-medium">${data.ventas.toLocaleString()}</span>
                        </div>
                        <Progress value={(data.ventas / data.objetivo) * 100} className="h-2" />
                        <div className="text-xs text-gray-500">
                          Objetivo: ${data.objetivo.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Distribución de Usuarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Usuarios Retail</span>
                      </div>
                      <span className="font-medium">{retailUsers}</span>
                    </div>
                    <Progress value={(retailUsers / users.length) * 100} className="h-2" />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">Usuarios Mayoristas</span>
                      </div>
                      <span className="font-medium">{wholesaleUsers}</span>
                    </div>
                    <Progress value={(wholesaleUsers / users.length) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* CRM Tab */}
          <TabsContent value="crm" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Clientes (CRM)</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Cliente
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{users.length}</p>
                      <p className="text-sm text-gray-500">Total Clientes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Crown className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">{wholesaleUsers}</p>
                      <p className="text-sm text-gray-500">Mayoristas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{retailUsers}</p>
                      <p className="text-sm text-gray-500">Retail</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Star className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{users.reduce((sum, user) => sum + user.points, 0)}</p>
                      <p className="text-sm text-gray-500">Puntos Totales</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Lista de Clientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 10).map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{user.username}</h4>
                          <p className="text-sm text-gray-500">{user.email || 'Sin email'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={user.userType === 'wholesale' ? 'default' : 'secondary'}>
                          {user.userType === 'wholesale' ? 'Mayorista' : 'Retail'}
                        </Badge>
                        <span className="text-sm font-medium">{user.points} pts</span>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Inventario</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Producto
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{inventoryData.filter(item => item.status === 'En Stock').length}</p>
                      <p className="text-sm text-gray-500">En Stock</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">{inventoryData.filter(item => item.status === 'Stock Bajo').length}</p>
                      <p className="text-sm text-gray-500">Stock Bajo</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-8 w-8 text-red-500" />
                    <div>
                      <p className="text-2xl font-bold">{inventoryData.filter(item => item.status === 'Agotado').length}</p>
                      <p className="text-sm text-gray-500">Agotado</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">${inventoryData.reduce((sum, item) => sum + (item.price * item.stock), 0).toFixed(0)}</p>
                      <p className="text-sm text-gray-500">Valor Total</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Inventario de Productos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inventoryData.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{item.name}</h4>
                          <p className="text-sm text-gray-500">{item.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Stock</p>
                          <p className="font-medium">{item.stock}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Precio</p>
                          <p className="font-medium">${item.price}</p>
                        </div>
                        <Badge 
                          variant={
                            item.status === 'En Stock' ? 'default' :
                            item.status === 'Stock Bajo' ? 'secondary' : 'destructive'
                          }
                        >
                          {item.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Análisis de Ventas</h2>
              <div className="flex gap-2">
                <Select defaultValue="30d">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 días</SelectItem>
                    <SelectItem value="30d">Últimos 30 días</SelectItem>
                    <SelectItem value="90d">Últimos 3 meses</SelectItem>
                    <SelectItem value="1y">Último año</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">${totalRevenue.toFixed(0)}</p>
                      <p className="text-sm text-gray-500">Ingresos Totales</p>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +15.3% vs mes anterior
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{orders.length}</p>
                      <p className="text-sm text-gray-500">Total Pedidos</p>
                      <div className="flex items-center text-xs text-blue-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8.7% vs mes anterior
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">${averageOrderValue.toFixed(0)}</p>
                      <p className="text-sm text-gray-500">Ticket Promedio</p>
                      <div className="flex items-center text-xs text-purple-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5.2% vs mes anterior
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
                      <p className="text-sm text-gray-500">Tasa Conversión</p>
                      <div className="flex items-center text-xs text-orange-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2.1% vs mes anterior
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ventas por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Repuestos Autos</span>
                        <span className="font-medium">$45,230</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Repuestos Motos</span>
                        <span className="font-medium">$28,450</span>
                      </div>
                      <Progress value={41} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accesorios</span>
                        <span className="font-medium">$18,920</span>
                      </div>
                      <Progress value={27} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pedidos Recientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">Pedido #{order.id.slice(-8)}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${order.total}</p>
                          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Campañas</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Campaña
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{campaigns.filter(c => c.status === 'active').length}</p>
                      <p className="text-sm text-gray-500">Campañas Activas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">$2,340</p>
                      <p className="text-sm text-gray-500">Presupuesto Diario</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">125,430</p>
                      <p className="text-sm text-gray-500">Impresiones</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">3.2%</p>
                      <p className="text-sm text-gray-500">CTR Promedio</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Campañas Activas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign) => (
                    <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Target className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{campaign.name}</h4>
                          <p className="text-sm text-gray-500">{campaign.platform} • {campaign.targetAudience}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Presupuesto</p>
                          <p className="font-medium">${campaign.dailyBudget}/día</p>
                        </div>
                        <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                          {campaign.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Media Tab */}
          <TabsContent value="social" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Redes Sociales</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Publicación
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Facebook className="h-8 w-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">12.5K</p>
                      <p className="text-sm text-gray-500">Seguidores FB</p>
                      <div className="flex items-center text-xs text-blue-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2.3% esta semana
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-8 w-8 text-pink-600" />
                    <div>
                      <p className="text-2xl font-bold">8.7K</p>
                      <p className="text-sm text-gray-500">Seguidores IG</p>
                      <div className="flex items-center text-xs text-pink-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5.1% esta semana
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Twitter className="h-8 w-8 text-blue-400" />
                    <div>
                      <p className="text-2xl font-bold">3.2K</p>
                      <p className="text-sm text-gray-500">Seguidores X</p>
                      <div className="flex items-center text-xs text-blue-400 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +1.8% esta semana
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-8 w-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">4.5%</p>
                      <p className="text-sm text-gray-500">Engagement</p>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +0.8% esta semana
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Publicaciones Programadas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Facebook className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">Oferta Filtros de Aceite</p>
                          <p className="text-xs text-gray-500">Hoy 18:00</p>
                        </div>
                      </div>
                      <Badge variant="outline">Programado</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Instagram className="h-5 w-5 text-pink-600" />
                        <div>
                          <p className="font-medium text-sm">Nuevos Amortiguadores</p>
                          <p className="text-xs text-gray-500">Mañana 10:00</p>
                        </div>
                      </div>
                      <Badge variant="outline">Programado</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento del Contenido</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Alcance Semanal</span>
                        <span className="font-medium">25,430</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Interacciones</span>
                        <span className="font-medium">1,245</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Compartidos</span>
                        <span className="font-medium">89</span>
                      </div>
                      <Progress value={32} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Analítica Web</h2>
              <Select defaultValue="30d">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="90d">Últimos 3 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Eye className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Páginas Vistas</p>
                      <div className="flex items-center text-xs text-blue-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12.5% vs período anterior
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.uniqueVisitors.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Visitantes Únicos</p>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8.3% vs período anterior
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.bounceRate}%</p>
                      <p className="text-sm text-gray-500">Tasa Rebote</p>
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        -2.1% vs período anterior
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">{analyticsData.avgSessionDuration}</p>
                      <p className="text-sm text-gray-500">Duración Promedio</p>
                      <div className="flex items-center text-xs text-purple-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +15s vs período anterior
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Productos Más Vistos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.views} visualizaciones</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{product.sales} ventas</p>
                          <p className="text-xs text-gray-500">
                            {((product.sales / product.views) * 100).toFixed(1)}% conversión
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fuentes de Tráfico</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {analyticsData.trafficSources.map((source, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{source.source}</span>
                          <span className="font-medium">{source.percentage}%</span>
                        </div>
                        <Progress value={source.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Automatización</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nueva Automatización
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Bot className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">8</p>
                      <p className="text-sm text-gray-500">Automatizaciones Activas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">1,245</p>
                      <p className="text-sm text-gray-500">Emails Enviados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Bell className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">456</p>
                      <p className="text-sm text-gray-500">Notificaciones Enviadas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Automatizaciones de Email</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Mail className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Email de Bienvenida</p>
                          <p className="text-sm text-gray-500">Activado • 98% tasa de entrega</p>
                        </div>
                      </div>
                      <Switch checked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <ShoppingCart className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Carrito Abandonado</p>
                          <p className="text-sm text-gray-500">Activado • 15% recuperación</p>
                        </div>
                      </div>
                      <Switch checked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Star className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-medium">Solicitud de Reseña</p>
                          <p className="text-sm text-gray-500">Activado • 45% respuesta</p>
                        </div>
                      </div>
                      <Switch checked />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Notificaciones Push</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium">Stock Bajo</p>
                          <p className="text-sm text-gray-500">Cuando stock &lt; 10 unidades</p>
                        </div>
                      </div>
                      <Switch checked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium">Nueva Venta</p>
                          <p className="text-sm text-gray-500">En tiempo real</p>
                        </div>
                      </div>
                      <Switch checked />
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">Errores del Sistema</p>
                          <p className="text-sm text-gray-500">Notificación inmediata</p>
                        </div>
                      </div>
                      <Switch checked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Discounts Tab */}
          <TabsContent value="discounts" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Configuración de Descuentos</h2>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Descuento
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Percent className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">12</p>
                      <p className="text-sm text-gray-500">Códigos Activos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">245</p>
                      <p className="text-sm text-gray-500">Usos este Mes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-8 w-8 text-purple-500" />
                    <div>
                      <p className="text-2xl font-bold">$4,580</p>
                      <p className="text-sm text-gray-500">Ahorros Generados</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-8 w-8 text-orange-500" />
                    <div>
                      <p className="text-2xl font-bold">18.5%</p>
                      <p className="text-sm text-gray-500">Tasa de Uso</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Nuevo Descuento</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="discount-code">Código de Descuento</Label>
                      <Input id="discount-code" placeholder="DESCUENTO20" />
                    </div>
                    <div>
                      <Label htmlFor="discount-percentage">Porcentaje (%)</Label>
                      <Input id="discount-percentage" type="number" placeholder="20" />
                    </div>
                    <div>
                      <Label htmlFor="discount-expiry">Fecha de Expiración</Label>
                      <Input id="discount-expiry" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="discount-uses">Usos Máximos</Label>
                      <Input id="discount-uses" type="number" placeholder="100" />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="discount-active" />
                      <Label htmlFor="discount-active">Activar descuento</Label>
                    </div>
                    <Button className="w-full">
                      Crear Descuento
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Descuentos Activos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">ENVIOGRATIS</p>
                        <p className="text-sm text-gray-500">100% descuento en envío • Expira 31/12/2024</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Activo</Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">NUEVOCLIENTE15</p>
                        <p className="text-sm text-gray-500">15% descuento • Expira 15/01/2025</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge>Activo</Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">VERANO2024</p>
                        <p className="text-sm text-gray-500">25% descuento • Expira 31/03/2024</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Expirado</Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Configuración del Sistema</h2>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Configuración
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Modo Mantenimiento</p>
                      <p className="text-sm text-gray-500">Desactivar temporalmente el sitio</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Registros Automáticos</p>
                      <p className="text-sm text-gray-500">Permitir registro de nuevos usuarios</p>
                    </div>
                    <Switch checked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Notificaciones Email</p>
                      <p className="text-sm text-gray-500">Enviar notificaciones por correo</p>
                    </div>
                    <Switch checked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Cache Automático</p>
                      <p className="text-sm text-gray-500">Optimizar rendimiento del sitio</p>
                    </div>
                    <Switch checked />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Seguridad</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autenticación 2FA</p>
                      <p className="text-sm text-gray-500">Requerir doble factor de autenticación</p>
                    </div>
                    <Switch checked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Logs de Actividad</p>
                      <p className="text-sm text-gray-500">Registrar todas las acciones</p>
                    </div>
                    <Switch checked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Limitación de Intentos</p>
                      <p className="text-sm text-gray-500">Bloquear tras fallos de login</p>
                    </div>
                    <Switch checked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Encriptación SSL</p>
                      <p className="text-sm text-gray-500">Certificado SSL activo</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Activo</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Pagos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currency">Moneda Principal</Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - Dólar Americano</SelectItem>
                        <SelectItem value="cup">CUP - Peso Cubano</SelectItem>
                        <SelectItem value="eur">EUR - Euro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tax-rate">Tasa de Impuesto (%)</Label>
                    <Input id="tax-rate" type="number" defaultValue="0" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Procesamiento Stripe</p>
                      <p className="text-sm text-gray-500">Gateway de pagos principal</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Conectado</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Respaldo y Recuperación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Respaldo Automático</p>
                      <p className="text-sm text-gray-500">Cada 24 horas</p>
                    </div>
                    <Switch checked />
                  </div>
                  <div>
                    <Label>Último Respaldo</Label>
                    <p className="text-sm text-gray-500">Hace 2 horas - 245 MB</p>
                  </div>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Crear Respaldo Manual
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Restaurar desde Respaldo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}