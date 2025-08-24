import { useState } from "react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { CreateTemplateDialog } from "@/components/CreateTemplateDialog";
import { CreateCampaignDialog } from "@/components/CreateCampaignDialog";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  MessageCircle, 
  Calendar as CalendarIcon, 
  Plus,
  Send,
  Clock,
  Users,
  BarChart3,
  Settings,
  Play,
  Pause,
  Eye,
  Edit,
  Trash2,
  Copy,
  Zap,
  FileText,
  RefreshCw,
  ChevronDown,
  Image,
  Video,
  Hash,
  AtSign,
  Globe,
  Bot,
  Sparkles
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SocialPost {
  id: string;
  platform: string[];
  content: string;
  mediaUrls?: string[];
  hashtags?: string[];
  mentions?: string[];
  scheduledAt?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed' | 'publishing';
  postType: 'manual' | 'automated' | 'template' | 'recurring';
  automation?: {
    isRecurring: boolean;
    frequency?: 'daily' | 'weekly' | 'monthly';
    endDate?: string;
    triggers?: string[];
  };
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  campaignId?: string;
  templateId?: string;
  productId?: string;
}

interface Campaign {
  id: string;
  name: string;
  platforms: string[];
  status: string;
  isAutomated: boolean;
  automationType: 'scheduled' | 'triggered' | 'content_based' | 'manual';
  scheduleTime?: string;
  dailyBudget: string;
  targetAudience: string;
  contentTemplate?: string;
  triggers?: {
    newProduct: boolean;
    priceUpdate: boolean;
    stockAlert: boolean;
    salesMilestone: boolean;
  };
  schedule?: {
    startDate: string;
    endDate?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    times: string[];
    daysOfWeek?: number[];
  };
  metrics?: {
    views: number;
    clicks: number;
    conversions: number;
    ctr: number;
    postsGenerated: number;
  };
}

interface ContentTemplate {
  id: string;
  name: string;
  category: 'product' | 'promotion' | 'news' | 'engagement';
  content: string;
  variables: string[];
  platforms: string[];
  mediaRequired: boolean;
  isActive: boolean;
}

export function SocialAutomation() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [activeView, setActiveView] = useState<'grid' | 'calendar'>('grid');
  const [automationMode, setAutomationMode] = useState<'manual' | 'automated'>('manual');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery<SocialPost[]>({
    queryKey: ["/api/social-posts"],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
  });

  const { data: templates = [] } = useQuery<ContentTemplate[]>({
    queryKey: ["/api/content-templates"],
  });

  const { data: products = [] } = useQuery({
    queryKey: ["/api/products"],
  });

  const createPostMutation = useMutation({
    mutationFn: async (postData: Partial<SocialPost>) => {
      return await apiRequest("POST", "/api/social-posts", postData);
    },
    onSuccess: () => {
      toast({
        title: "Post Creado",
        description: "El post ha sido creado exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/social-posts"] });
      setIsCreatingPost(false);
    },
  });

  const createCampaignMutation = useMutation({
    mutationFn: async (campaignData: Partial<Campaign>) => {
      return await apiRequest("POST", "/api/campaigns", campaignData);
    },
    onSuccess: () => {
      toast({
        title: "Campaña Creada",
        description: "La campaña ha sido configurada exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/campaigns"] });
      setIsCreatingCampaign(false);
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: Partial<ContentTemplate>) => {
      return await apiRequest("POST", "/api/content-templates", templateData);
    },
    onSuccess: () => {
      toast({
        title: "Plantilla Creada",
        description: "La plantilla de contenido ha sido creada exitosamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/content-templates"] });
      setIsCreatingTemplate(false);
    },
  });

  const generateAutomatedContentMutation = useMutation({
    mutationFn: async (data: { templateId: string; productId?: string; platforms: string[] }) => {
      return await apiRequest("POST", "/api/social-posts/generate", data);
    },
    onSuccess: () => {
      toast({
        title: "Contenido Generado",
        description: "Se ha generado contenido automáticamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/social-posts"] });
    },
  });

  const platforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-600" },
    { id: "twitter", name: "Twitter/X", icon: Twitter, color: "bg-black" },
    { id: "youtube", name: "YouTube", icon: Play, color: "bg-red-600" },
    { id: "tiktok", name: "TikTok", icon: MessageCircle, color: "bg-black" },
    { id: "whatsapp", name: "WhatsApp", icon: MessageCircle, color: "bg-green-600" },
  ];

  const getPlatformIcon = (platform: string) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData ? platformData.icon : MessageCircle;
  };

  const getPlatformColor = (platform: string) => {
    const platformData = platforms.find(p => p.id === platform);
    return platformData ? platformData.color : "bg-gray-600";
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: "secondary" as const, text: "Borrador" },
      scheduled: { variant: "outline" as const, text: "Programado" },
      published: { variant: "default" as const, text: "Publicado" },
      failed: { variant: "destructive" as const, text: "Fallido" },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  };

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Automatización Social Avanzada</h2>
          <p className="text-gray-600">Gestiona, programa y automatiza tus campañas multicanal con inteligencia artificial</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2">
          <Button 
            onClick={() => setIsCreatingTemplate(true)} 
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-3 w-full md:w-auto"
          >
            <FileText className="h-4 w-4 mr-1" />
            <span className="text-xs">Nueva Plantilla</span>
          </Button>
          <Button 
            onClick={() => setIsCreatingCampaign(true)} 
            variant="outline"
            size="sm"
            className="border-gray-800 text-gray-800 hover:bg-gray-50 hover:border-black px-3 w-full md:w-auto"
          >
            <Zap className="h-4 w-4 mr-1" />
            <span className="text-xs">Campaña Automática</span>
          </Button>
        </div>
      </div>

      {/* Quick Actions & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-gray-900 to-black text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Posts Programados</p>
                <p className="text-3xl font-bold mt-1">
                  {posts.filter(p => p.status === 'scheduled').length}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Campañas Activas</p>
                <p className="text-3xl font-bold mt-1">
                  {campaigns.filter(c => c.status === 'active').length}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-full">
                <Bot className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-700 to-gray-800 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Plantillas</p>
                <p className="text-3xl font-bold mt-1">{templates.length}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-full">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-600 to-gray-700 text-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm font-medium">Auto-Posts Hoy</p>
                <p className="text-3xl font-bold mt-1">
                  {posts.filter(p => p.postType === 'automated' && 
                    new Date(p.scheduledAt || '').toDateString() === new Date().toDateString()).length}
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-full">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 bg-gray-100 border-0 rounded-none p-1 gap-1">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600 text-xs md:text-sm px-2 py-1">Dashboard</TabsTrigger>
          <TabsTrigger value="calendar" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600 text-xs md:text-sm px-2 py-1">Calendario</TabsTrigger>
          <TabsTrigger value="posts" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600 text-xs md:text-sm px-2 py-1">Publicaciones</TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600 text-xs md:text-sm px-2 py-1">Campañas</TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600 text-xs md:text-sm px-2 py-1">Plantillas</TabsTrigger>
          <TabsTrigger value="automation" className="data-[state=active]:bg-white data-[state=active]:text-gray-900 text-gray-600 text-xs md:text-sm px-2 py-1">Automatización</TabsTrigger>
        </TabsList>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Create */}
            <Card className="border-gray-200 shadow-sm bg-black">
              <CardHeader className="border-b border-gray-100">
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5 text-white" />
                  Creación Rápida
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid grid-cols-2 gap-3">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={() => setIsCreatingPost(true)} 
                          className="h-20 flex-col bg-black hover:bg-gray-800 text-white shadow-sm"
                        >
                          <Send className="h-6 w-6 mb-2" />
                          <span className="text-white">Post Manual</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black text-white border-gray-600">
                        <p>Crear una publicación manual personalizada</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          onClick={() => setIsCreatingCampaign(true)} 
                          variant="outline" 
                          className="h-20 flex-col border-gray-300 text-white hover:bg-gray-800"
                        >
                          <Bot className="h-6 w-6 mb-2" />
                          <span className="text-white">Auto-Post</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-black text-white border-gray-600">
                        <p>Crear campaña automatizada con AI</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                {/* Platform Selection */}
                <div>
                  <Label className="text-sm font-medium text-white">Plataformas de Destino</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {platforms.map((platform) => {
                      const PlatformIcon = platform.icon;
                      const isSelected = selectedPlatforms.includes(platform.id);
                      return (
                        <TooltipProvider key={platform.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={isSelected ? "default" : "outline"}
                                size="sm"
                                onClick={() => {
                                  setSelectedPlatforms(prev => 
                                    isSelected 
                                      ? prev.filter(p => p !== platform.id)
                                      : [...prev, platform.id]
                                  );
                                }}
                                className={`flex-col h-16 border-gray-300 ${
                                  isSelected ? 'bg-gray-800 text-white hover:bg-gray-700' : 'text-white hover:bg-gray-800'
                                }`}
                              >
                                <PlatformIcon className="h-4 w-4 mb-1" />
                                <span className="text-xs text-white">{platform.name}</span>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top" className="bg-black text-white border-gray-600">
                              <p>{isSelected ? `Remover ${platform.name}` : `Agregar ${platform.name}`}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Template Actions */}
                <div className="border-t border-gray-200 pt-4">
                  <Label className="text-sm font-medium mb-2 block text-white">Plantillas Rápidas</Label>
                  <div className="space-y-2">
                    {templates.slice(0, 3).map((template) => (
                      <Button
                        key={template.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-white hover:bg-gray-800"
                        onClick={() => generateAutomatedContentMutation.mutate({
                          templateId: template.id,
                          platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['facebook', 'instagram']
                        })}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        {template.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Posts */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Próximas Publicaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {posts
                    .filter(p => p.status === 'scheduled')
                    .sort((a, b) => new Date(a.scheduledAt || '').getTime() - new Date(b.scheduledAt || '').getTime())
                    .slice(0, 5)
                    .map((post) => (
                      <div key={post.id} className="flex items-center gap-3 p-3 border rounded-lg">
                        <div className="flex">
                          {(Array.isArray(post.platform) ? post.platform : [post.platform]).map((platformId, index) => {
                            const PlatformIcon = getPlatformIcon(platformId);
                            return (
                              <div key={platformId} className={`p-1 rounded ${getPlatformColor(platformId)} ${index > 0 ? '-ml-2' : ''}`}>
                                <PlatformIcon className="h-3 w-3 text-white" />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate overflow-hidden whitespace-nowrap">{post.content}</p>
                          <p className="text-xs text-muted-foreground truncate overflow-hidden whitespace-nowrap">
                            {post.scheduledAt && format(new Date(post.scheduledAt), "MMM d, HH:mm", { locale: es })}
                          </p>
                        </div>
                        <Badge variant={post.postType === 'automated' ? 'default' : 'secondary'}>
                          {post.postType === 'automated' ? 'Auto' : 'Manual'}
                        </Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  Calendario de Publicaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? format(selectedDate, "d MMMM", { locale: es }) : "Selecciona una fecha"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedDate && posts
                    .filter(p => p.scheduledAt && 
                      new Date(p.scheduledAt).toDateString() === selectedDate.toDateString())
                    .map((post) => (
                      <div key={post.id} className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {(Array.isArray(post.platform) ? post.platform : [post.platform]).map((platformId) => {
                              const PlatformIcon = getPlatformIcon(platformId);
                              return (
                                <div key={platformId} className={`p-1 rounded mr-1 ${getPlatformColor(platformId)}`}>
                                  <PlatformIcon className="h-3 w-3 text-white" />
                                </div>
                              );
                            })}
                          </div>
                          <span className="text-sm font-medium">
                            {post.scheduledAt && format(new Date(post.scheduledAt), "HH:mm")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{post.content}</p>
                        <Badge className="mt-2">
                          {post.postType}
                        </Badge>
                      </div>
                    ))}
                  
                  {selectedDate && posts.filter(p => p.scheduledAt && 
                    new Date(p.scheduledAt).toDateString() === selectedDate.toDateString()).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No hay publicaciones programadas para esta fecha
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button
                variant={activeView === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('grid')}
              >
                Grid
              </Button>
              <Button
                variant={activeView === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('calendar')}
              >
                <CalendarIcon className="h-4 w-4 mr-2" />
                Calendario
              </Button>
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="scheduled">Programado</SelectItem>
                  <SelectItem value="published">Publicado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-4">
            {posts.map((post) => {
              const statusBadge = getStatusBadge(post.status);
              
              return (
                <Card key={post.id} className="border border-border shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex">
                          {(Array.isArray(post.platform) ? post.platform : [post.platform]).map((platformId, index) => {
                            const PlatformIcon = getPlatformIcon(platformId);
                            return (
                              <div key={platformId} className={`p-2 rounded-lg ${getPlatformColor(platformId)} ${index > 0 ? '-ml-2' : ''} border-2 border-white`}>
                                <PlatformIcon className="h-4 w-4 text-white" />
                              </div>
                            );
                          })}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge {...statusBadge}>
                              {statusBadge.text}
                            </Badge>
                            <Badge variant="outline">
                              {post.postType}
                            </Badge>
                            {post.automation?.isRecurring && (
                              <Badge variant="secondary">
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Recurrente
                              </Badge>
                            )}
                          </div>
                          <p className="text-foreground mb-2">{post.content}</p>
                          
                          {post.hashtags && post.hashtags.length > 0 && (
                            <div className="flex items-center gap-1 mb-2">
                              <Hash className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {post.hashtags.join(' ')}
                              </span>
                            </div>
                          )}
                          
                          {post.scheduledAt && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              Programado para: {format(new Date(post.scheduledAt), "PPp", { locale: es })}
                            </div>
                          )}
                          
                          {post.engagement && (
                            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                              <span>{post.engagement.views} vistas</span>
                              <span>{post.engagement.likes} likes</span>
                              <span>{post.engagement.shares} shares</span>
                              <span>{post.engagement.comments} comentarios</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <div className="grid gap-4">
            {campaigns.map((campaign) => {
              return (
                <Card key={campaign.id} className="border border-border shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex">
                          {(campaign.platforms || []).map((platformId, index) => {
                            const PlatformIcon = getPlatformIcon(platformId);
                            return (
                              <div key={platformId} className={`p-2 rounded-lg ${getPlatformColor(platformId)} ${index > 0 ? '-ml-2' : ''} border-2 border-white`}>
                                <PlatformIcon className="h-4 w-4 text-white" />
                              </div>
                            );
                          })}
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.targetAudience}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                              {campaign.status === 'active' ? 'Activa' : 'Pausada'}
                            </Badge>
                            <Badge variant="outline">
                              {campaign.automationType}
                            </Badge>
                            {campaign.isAutomated && (
                              <Badge className="bg-green-100 text-green-800">
                                <Bot className="h-3 w-3 mr-1" />
                                Automatizada
                              </Badge>
                            )}
                          </div>
                          {campaign.schedule && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Frecuencia: {campaign.schedule.frequency} | 
                              Horarios: {campaign.schedule.times.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Presupuesto diario</div>
                        <div className="font-semibold text-foreground">${campaign.dailyBudget}</div>
                        {campaign.metrics && (
                          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mt-2">
                            <div>CTR: {campaign.metrics.ctr}%</div>
                            <div>Posts: {campaign.metrics.postsGenerated || 0}</div>
                          </div>
                        )}
                        <div className="flex gap-1 mt-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            {campaign.status === 'active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="border border-border shadow-soft">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <Badge variant={template.isActive ? 'default' : 'secondary'}>
                      {template.isActive ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {template.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {template.content}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Plataformas:</span>
                    <div className="flex">
                      {template.platforms.map((platformId, index) => {
                        const PlatformIcon = getPlatformIcon(platformId);
                        return (
                          <div key={platformId} className={`p-1 rounded ${getPlatformColor(platformId)} ${index > 0 ? '-ml-1' : ''}`}>
                            <PlatformIcon className="h-3 w-3 text-white" />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {template.variables.length > 0 && (
                    <div>
                      <span className="text-xs text-muted-foreground">Variables:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {template.variables.map((variable) => (
                          <Badge key={variable} variant="secondary" className="text-xs">
                            {variable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => generateAutomatedContentMutation.mutate({
                        templateId: template.id,
                        platforms: template.platforms
                      })}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Usar
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add New Template Card */}
            <Card 
              className="border-dashed border-2 border-border hover:border-primary cursor-pointer transition-colors"
              onClick={() => setIsCreatingTemplate(true)}
            >
              <CardContent className="flex flex-col items-center justify-center h-full p-6 min-h-[200px]">
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">
                  Crear Nueva Plantilla
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Automation Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-primary" />
                  Reglas de Automatización
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Globe className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Nuevos Productos</p>
                        <p className="text-sm text-muted-foreground">Auto-publicar cuando se agreguen productos</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BarChart3 className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Ofertas Especiales</p>
                        <p className="text-sm text-muted-foreground">Publicar automáticamente cambios de precio</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Clock className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium">Posts Programados</p>
                        <p className="text-sm text-muted-foreground">Contenido semanal automático</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <Button className="w-full" variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar Reglas Avanzadas
                </Button>
              </CardContent>
            </Card>

            {/* Scheduling */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Programación Inteligente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Horarios Óptimos</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['09:00', '12:00', '17:00', '20:00'].map((time) => (
                      <div key={time} className="flex items-center justify-between p-2 border rounded">
                        <span className="text-sm">{time}</span>
                        <Switch defaultChecked />
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm font-medium">Días de la Semana</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day, index) => (
                      <Button
                        key={day}
                        variant={index < 5 ? 'default' : 'outline'}
                        size="sm"
                        className="h-8"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Publicación Automática</Label>
                    <Switch defaultChecked />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Las publicaciones programadas se enviarán automáticamente en las fechas especificadas
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Activity Log */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Registro de Actividad Automática
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { action: 'Post automático publicado', platform: 'facebook', time: '10:30 AM', status: 'success' },
                  { action: 'Nuevo producto detectado', platform: 'instagram', time: '09:15 AM', status: 'pending' },
                  { action: 'Campaña programada iniciada', platform: 'twitter', time: '08:00 AM', status: 'success' },
                  { action: 'Post recurrente creado', platform: 'youtube', time: '07:30 AM', status: 'success' },
                ].map((log, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className={`p-2 rounded-lg ${getPlatformColor(log.platform)}`}>
                      {React.createElement(getPlatformIcon(log.platform), { 
                        className: "h-4 w-4 text-white" 
                      })}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{log.action}</p>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                    <Badge 
                      variant={log.status === 'success' ? 'default' : log.status === 'pending' ? 'secondary' : 'destructive'}
                    >
                      {log.status === 'success' ? 'Completado' : log.status === 'pending' ? 'Pendiente' : 'Error'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Dialogs */}
      <CreatePostDialog 
        open={isCreatingPost} 
        onOpenChange={setIsCreatingPost}
      />
      <CreateTemplateDialog 
        open={isCreatingTemplate} 
        onOpenChange={setIsCreatingTemplate}
      />
      <CreateCampaignDialog 
        open={isCreatingCampaign} 
        onOpenChange={setIsCreatingCampaign}
      />
    </div>
  );
}