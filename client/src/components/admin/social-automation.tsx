import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  Trash2
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface SocialPost {
  id: string;
  platform: string;
  content: string;
  mediaUrls?: string[];
  scheduledAt?: string;
  publishedAt?: string;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  campaignId?: string;
}

interface Campaign {
  id: string;
  name: string;
  platform: string;
  status: string;
  isAutomated: boolean;
  scheduleTime?: string;
  dailyBudget: string;
  targetAudience: string;
  metrics?: {
    views: number;
    clicks: number;
    conversions: number;
    ctr: number;
  };
}

export function SocialAutomation() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isCreatingCampaign, setIsCreatingCampaign] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: posts = [] } = useQuery<SocialPost[]>({
    queryKey: ["/api/social-posts"],
  });

  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["/api/campaigns"],
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

  const platforms = [
    { id: "facebook", name: "Facebook", icon: Facebook, color: "bg-blue-600" },
    { id: "instagram", name: "Instagram", icon: Instagram, color: "bg-pink-600" },
    { id: "twitter", name: "Twitter/X", icon: Twitter, color: "bg-black" },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Automatización Social</h2>
          <p className="text-muted-foreground">Gestiona tus campañas y publicaciones en redes sociales</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreatingCampaign(true)} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Campaña
          </Button>
          <Button onClick={() => setIsCreatingPost(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Post
          </Button>
        </div>
      </div>

      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="posts">Publicaciones</TabsTrigger>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        {/* Posts Tab */}
        <TabsContent value="posts" className="space-y-4">
          <div className="grid gap-4">
            {posts.map((post) => {
              const PlatformIcon = getPlatformIcon(post.platform);
              const statusBadge = getStatusBadge(post.status);
              
              return (
                <Card key={post.id} className="border border-border shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className={`p-2 rounded-lg ${getPlatformColor(post.platform)} flex items-center justify-center`}>
                          <PlatformIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge {...statusBadge}>
                              {statusBadge.text}
                            </Badge>
                            <span className="text-sm text-muted-foreground capitalize">
                              {post.platform}
                            </span>
                          </div>
                          <p className="text-foreground mb-2">{post.content}</p>
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
              const PlatformIcon = getPlatformIcon(campaign.platform);
              
              return (
                <Card key={campaign.id} className="border border-border shadow-soft">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${getPlatformColor(campaign.platform)} flex items-center justify-center`}>
                          <PlatformIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.targetAudience}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={campaign.status === 'active' ? 'default' : 'secondary'}>
                              {campaign.status === 'active' ? 'Activa' : 'Pausada'}
                            </Badge>
                            {campaign.isAutomated && (
                              <Badge variant="outline">
                                Automatizada
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Presupuesto diario</div>
                        <div className="font-semibold text-foreground">${campaign.dailyBudget}</div>
                        {campaign.metrics && (
                          <div className="text-sm text-muted-foreground mt-1">
                            CTR: {campaign.metrics.ctr}%
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Posts Publicados</p>
                    <p className="text-2xl font-bold text-foreground">
                      {posts.filter(p => p.status === 'published').length}
                    </p>
                  </div>
                  <Send className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Campañas Activas</p>
                    <p className="text-2xl font-bold text-foreground">
                      {campaigns.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                  <Play className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {posts.reduce((sum, post) => sum + (post.engagement?.likes || 0), 0)}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Alcance Total</p>
                    <p className="text-2xl font-bold text-foreground">
                      {posts.reduce((sum, post) => sum + (post.engagement?.views || 0), 0)}
                    </p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Plataformas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {platforms.map((platform) => {
                const PlatformIcon = platform.icon;
                return (
                  <div key={platform.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${platform.color} flex items-center justify-center`}>
                        <PlatformIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{platform.name}</h3>
                        <p className="text-sm text-muted-foreground">Configura la integración</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch />
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}