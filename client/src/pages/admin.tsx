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
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { 
  Users, DollarSign, ShoppingCart, Star, TrendingUp, TrendingDown, 
  Car, Bike, Settings, BarChart3, PieChart, Activity, Shield,
  Crown, Zap, Target, MessageSquare, Mail, Phone, Calendar,
  FileText, CreditCard, Lock, AlertTriangle, CheckCircle,
  Clock, Globe, Instagram, Facebook, Twitter, Youtube,
  RefreshCw, Plus, Edit, Trash2, Eye, Send, Filter,
  Download, Upload, Search, ArrowUp, ArrowDown, Package,
  Percent, Database, Bot, Bell, Home, Building, Tag, LogOut
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart as RechartsPie, Pie, Cell, Legend, AreaChart, Area
} from 'recharts';
import type { User, Order, RewardsConfig, CampaignConfig } from '@shared/schema';
import SiteConfigPanel from '@/components/admin/site-config';
import WholesaleCodes from '@/components/admin/wholesale-codes';
import InventoryManagement from '@/components/admin/inventory-management';
import DataBackupPanel from '@/components/admin/data-backup-panel';
import SecurityLogsPanel from '@/components/admin/security-logs-panel';
import FinancialSecurityPanel from '@/components/security/financial-security-panel';

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
  const { logout } = useAdminAuth();

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
              <Button
                onClick={() => {
                  logout();
                  toast({
                    title: "🔓 Sesión cerrada",
                    description: "Has cerrado sesión del panel de administración.",
                  });
                  window.location.href = '/';
                }}
                variant="outline"
                size="sm"
                className="border-red-300 text-red-600 hover:bg-red-50"
                data-testid="admin-logout-button"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 lg:grid-cols-15 mb-8 bg-white border border-gray-200 p-1 gap-0">
            <TabsTrigger 
              value="dashboard" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-dashboard"
            >
              <Home className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Panel Principal
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="crm" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-crm"
            >
              <Users className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Gestión Clientes
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="inventory" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-inventory"
            >
              <Package className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Control Inventario
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="wholesale" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-wholesale"
            >
              <Tag className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Códigos Mayorista
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="sales" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-sales"
            >
              <BarChart3 className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Análisis Ventas
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="campaigns" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-campaigns"
            >
              <Target className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Campañas Marketing
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="social" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-social"
            >
              <Globe className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Redes Sociales
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="analytics" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-analytics"
            >
              <PieChart className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Analítica Avanzada
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="automation" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-automation"
            >
              <Bot className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Automatización IA
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="discounts" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-discounts"
            >
              <Percent className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Descuentos & Ofertas
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="site-config" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-site-config"
            >
              <Building className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Configuración Sitio
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="settings" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-settings"
            >
              <Settings className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Configuración General
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="security" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-security"
            >
              <Shield className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Logs de Seguridad
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="backup" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-backup"
            >
              <Database className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Respaldos de Datos
              </span>
            </TabsTrigger>
            
            <TabsTrigger 
              value="financial" 
              className="group relative flex flex-col items-center gap-1 p-2 rounded-md hover:bg-gray-50 data-[state=active]:bg-gray-100 data-[state=active]:text-black transition-all duration-200 border-0" 
              data-testid="tab-financial"
            >
              <CreditCard className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors duration-200" />
              <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-10 bg-black/90 text-white px-2 py-1 rounded text-center whitespace-nowrap z-10">
                Seguridad Financiera
              </span>
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
            <InventoryManagement />
          </TabsContent>

          {/* Wholesale Codes Tab */}
          <TabsContent value="wholesale" className="space-y-6">
            <WholesaleCodes />
          </TabsContent>

          {/* Sales Tab */}
          <TabsContent value="sales" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Análisis de Ventas Avanzado</h2>
              <div className="flex gap-2">
                <Select defaultValue="30d">
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Últimos 7 días</SelectItem>
                    <SelectItem value="30d">Últimos 30 días</SelectItem>
                    <SelectItem value="90d">Últimos 3 meses</SelectItem>
                    <SelectItem value="6m">Últimos 6 meses</SelectItem>
                    <SelectItem value="1y">Último año</SelectItem>
                    <SelectItem value="2y">Últimos 2 años</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card className="bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-200/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-8 w-8 text-green-400" />
                    <div>
                      <p className="text-2xl font-bold text-green-300">${totalRevenue.toFixed(0)}</p>
                      <p className="text-sm text-gray-400">Ingresos Totales</p>
                      <div className="flex items-center text-xs text-green-400 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +15.3% vs mes anterior
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Semana: $12,450 | Año: $145,670
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-8 w-8 text-blue-400" />
                    <div>
                      <p className="text-2xl font-bold text-blue-300">{orders.length}</p>
                      <p className="text-sm text-gray-400">Total Pedidos</p>
                      <div className="flex items-center text-xs text-blue-400 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8.7% vs mes anterior
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Semana: 45 | Año: 1,247
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-8 w-8 text-purple-400" />
                    <div>
                      <p className="text-2xl font-bold text-purple-300">${averageOrderValue.toFixed(0)}</p>
                      <p className="text-sm text-gray-400">Ticket Promedio</p>
                      <div className="flex items-center text-xs text-purple-400 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +5.2% vs mes anterior
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Semana: $276 | Año: $117
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/20 border-orange-200/50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Activity className="h-8 w-8 text-orange-400" />
                    <div>
                      <p className="text-2xl font-bold text-orange-300">{conversionRate.toFixed(1)}%</p>
                      <p className="text-sm text-gray-400">Tasa Conversión</p>
                      <div className="flex items-center text-xs text-orange-400 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +2.1% vs mes anterior
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Semana: 3.2% | Año: 2.8%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ventas Comparativas por Período</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { period: 'Ene', actual: 15000, anterior: 12000, meta: 18000 },
                        { period: 'Feb', actual: 18000, anterior: 14000, meta: 20000 },
                        { period: 'Mar', actual: 22000, anterior: 16000, meta: 22000 },
                        { period: 'Abr', actual: 25000, anterior: 18000, meta: 24000 },
                        { period: 'May', actual: 28000, anterior: 20000, meta: 26000 },
                        { period: 'Jun', actual: 32000, anterior: 22000, meta: 28000 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="period" className="text-muted-foreground" />
                        <YAxis className="text-muted-foreground" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--foreground)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="hsl(var(--chart-1))" 
                          strokeWidth={3}
                          dot={{ fill: 'hsl(var(--chart-1))', strokeWidth: 2, r: 6 }}
                          name="Ventas Actuales"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="anterior" 
                          stroke="hsl(var(--chart-2))" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: 'hsl(var(--chart-2))', strokeWidth: 2, r: 4 }}
                          name="Año Anterior"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="meta" 
                          stroke="hsl(var(--chart-3))" 
                          strokeWidth={2}
                          strokeDasharray="2 2"
                          dot={{ fill: 'hsl(var(--chart-3))', strokeWidth: 2, r: 4 }}
                          name="Meta"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Ventas por Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPie>
                        <Pie
                          data={[
                            { name: 'Repuestos Autos', value: 45, color: 'hsl(var(--chart-1))' },
                            { name: 'Repuestos Motos', value: 30, color: 'hsl(var(--chart-2))' },
                            { name: 'Electrónicos', value: 20, color: 'hsl(var(--chart-3))' },
                            { name: 'Accesorios', value: 5, color: 'hsl(var(--chart-4))' }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={120}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {[
                            { name: 'Repuestos Autos', value: 45, color: '#3b82f6' },
                            { name: 'Repuestos Motos', value: 30, color: '#22c55e' },
                            { name: 'Electrónicos', value: 20, color: '#ef4444' },
                            { name: 'Accesorios', value: 5, color: '#8b5cf6' }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--foreground)'
                          }}
                        />
                        <Legend />
                      </RechartsPie>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Productos Más Vendidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={[
                          { product: 'Filtro Aceite', ventas: 245, ingresos: 4900 },
                          { product: 'Bujías', ventas: 189, ingresos: 3780 },
                          { product: 'Pastillas Freno', ventas: 156, ingresos: 4680 },
                          { product: 'Aceite Motor', ventas: 134, ingresos: 6700 },
                          { product: 'Neumáticos', ventas: 98, ingresos: 7840 }
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis type="number" className="text-muted-foreground" />
                        <YAxis dataKey="product" type="category" width={100} className="text-muted-foreground" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--foreground)'
                          }}
                        />
                        <Bar 
                          dataKey="ventas" 
                          fill="hsl(var(--chart-1))"
                          radius={[0, 8, 8, 0]}
                          name="Unidades Vendidas"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento Semanal vs Mensual</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { period: 'Sem 1', semanal: 4000, mensual: 15000 },
                        { period: 'Sem 2', semanal: 3000, mensual: 13000 },
                        { period: 'Sem 3', semanal: 5000, mensual: 18000 },
                        { period: 'Sem 4', semanal: 4500, mensual: 16000 }
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis dataKey="period" className="text-muted-foreground" />
                        <YAxis className="text-muted-foreground" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'var(--card)',
                            border: '1px solid var(--border)',
                            borderRadius: '8px',
                            color: 'var(--foreground)'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="mensual"
                          stackId="1"
                          stroke="hsl(var(--chart-2))"
                          fill="hsl(var(--chart-2))"
                          fillOpacity={0.6}
                          name="Meta Mensual"
                        />
                        <Area
                          type="monotone"
                          dataKey="semanal"
                          stackId="2"
                          stroke="hsl(var(--chart-1))"
                          fill="hsl(var(--chart-1))"
                          fillOpacity={0.8}
                          name="Ventas Semanales"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestión de Campañas Automáticas</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Bot className="h-4 w-4 mr-2" />
                  Auto-Optimizar
                </Button>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Campaña
                </Button>
              </div>
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Crear Campaña Automática</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="campaign-name">Nombre de la Campaña</Label>
                      <Input id="campaign-name" placeholder="Promoción Filtros de Aceite" />
                    </div>
                    <div>
                      <Label htmlFor="platforms">Plataformas (múltiple selección)</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {[
                          { id: 'meta', name: 'Meta Ads', icon: Facebook },
                          { id: 'facebook', name: 'Facebook', icon: Facebook },
                          { id: 'instagram', name: 'Instagram', icon: Instagram },
                          { id: 'youtube', name: 'YouTube', icon: Youtube },
                          { id: 'twitter', name: 'X (Twitter)', icon: Twitter },
                          { id: 'tiktok', name: 'TikTok', icon: Globe }
                        ].map((platform) => {
                          const PlatformIcon = platform.icon;
                          return (
                            <label key={platform.id} className="flex items-center space-x-2 p-2 border rounded cursor-pointer hover:bg-accent">
                              <input type="checkbox" className="text-primary" />
                              <PlatformIcon className="h-4 w-4" />
                              <span className="text-sm">{platform.name}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="budget">Presupuesto Diario ($)</Label>
                        <Input id="budget" type="number" placeholder="50" />
                      </div>
                      <div>
                        <Label htmlFor="duration">Duración (días)</Label>
                        <Input id="duration" type="number" placeholder="30" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="audience">Segmentación de Audiencia</Label>
                      <select className="w-full p-2 border rounded">
                        <option>Propietarios de autos (25-65 años)</option>
                        <option>Mecánicos y talleres</option>
                        <option>Entusiastas automotrices</option>
                        <option>Propietarios de motos</option>
                        <option>Audiencia personalizada</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="automation">Automatización</Label>
                      <div className="space-y-2 mt-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Optimización automática de pujas</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" defaultChecked />
                          <span className="text-sm">Pausar campañas con bajo rendimiento</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" />
                          <span className="text-sm">Aumentar presupuesto automáticamente</span>
                        </label>
                      </div>
                    </div>
                    <Button className="w-full">
                      <Bot className="h-4 w-4 mr-2" />
                      Lanzar Campaña Automática
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Campañas Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Target className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">{campaign.name}</h4>
                            <p className="text-sm text-muted-foreground">{Array.isArray(campaign.platforms) ? campaign.platforms.join(', ') : 'N/A'} • {campaign.targetAudience}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs text-green-600">ROI: +245%</span>
                              <span className="text-xs text-blue-600">CTR: 3.2%</span>
                              <span className="text-xs text-orange-600">CPC: $0.45</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <p className="text-sm text-muted-foreground">Presupuesto</p>
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
            </div>
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

          {/* Site Configuration Tab */}
          <TabsContent value="site-config" className="space-y-6">
            <SiteConfigPanel />
          </TabsContent>

          {/* Security Logs Tab */}
          <TabsContent value="security" className="space-y-6">
            <SecurityLogsPanel />
          </TabsContent>

          {/* Data Backup Tab */}
          <TabsContent value="backup" className="space-y-6">
            <DataBackupPanel />
          </TabsContent>

          {/* Financial Security Tab */}
          <TabsContent value="financial" className="space-y-6">
            <FinancialSecurityPanel />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}