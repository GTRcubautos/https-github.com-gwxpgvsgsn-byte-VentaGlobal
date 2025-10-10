import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Upload, Save, Eye, Video, Image, Plus, X, Settings, Mail, Phone, MapPin, MessageSquare, Key, Lock } from "lucide-react";

export default function SiteConfigPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, any>>({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { data: config = {}, isLoading } = useQuery({
    queryKey: ["/api/site-config"],
  });

  const updateConfigMutation = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: any }) => {
      return apiRequest("POST", "/api/site-config", { key, value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-config"] });
      toast({
        title: "Configuración actualizada",
        description: "Los cambios se han guardado correctamente",
      });
      setUnsavedChanges({});
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return apiRequest("POST", "/api/admin/change-password", data);
    },
    onSuccess: () => {
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo cambiar la contraseña. Verifica tu contraseña actual",
        variant: "destructive",
      });
    },
  });

  const handleConfigChange = (key: string, value: any) => {
    setUnsavedChanges(prev => ({ ...prev, [key]: value }));
  };

  const saveAllChanges = async () => {
    for (const [key, value] of Object.entries(unsavedChanges)) {
      await updateConfigMutation.mutateAsync({ key, value });
    }
  };

  const getCurrentValue = (key: string) => {
    return unsavedChanges[key] !== undefined ? unsavedChanges[key] : config[key] || '';
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    await changePasswordMutation.mutateAsync({
      currentPassword,
      newPassword,
    });
  };

  const addPromotionalImage = () => {
    const currentImages = getCurrentValue('promotional_images') || [];
    handleConfigChange('promotional_images', [...currentImages, '']);
  };

  const removePromotionalImage = (index: number) => {
    const currentImages = getCurrentValue('promotional_images') || [];
    const newImages = currentImages.filter((_: any, i: number) => i !== index);
    handleConfigChange('promotional_images', newImages);
  };

  const updatePromotionalImage = (index: number, value: string) => {
    const currentImages = getCurrentValue('promotional_images') || [];
    const newImages = [...currentImages];
    newImages[index] = value;
    handleConfigChange('promotional_images', newImages);
  };

  const addPromotionalVideo = () => {
    const currentVideos = getCurrentValue('promotional_videos') || [];
    handleConfigChange('promotional_videos', [...currentVideos, '']);
  };

  const removePromotionalVideo = (index: number) => {
    const currentVideos = getCurrentValue('promotional_videos') || [];
    const newVideos = currentVideos.filter((_: any, i: number) => i !== index);
    handleConfigChange('promotional_videos', newVideos);
  };

  const updatePromotionalVideo = (index: number, value: string) => {
    const currentVideos = getCurrentValue('promotional_videos') || [];
    const newVideos = [...currentVideos];
    newVideos[index] = value;
    handleConfigChange('promotional_videos', newVideos);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64" data-testid="site-config-loading">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="site-config-panel">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-red-500" />
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Configuración del Sistema</h2>
            <p className="text-gray-500 dark:text-gray-400">Personaliza el contenido y apariencia de tu sitio</p>
          </div>
        </div>
        
        {Object.keys(unsavedChanges).length > 0 && (
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-amber-600 border-amber-500 dark:text-amber-400 dark:border-amber-400">
              {Object.keys(unsavedChanges).length} cambios sin guardar
            </Badge>
            <Button 
              onClick={saveAllChanges}
              disabled={updateConfigMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="save-all-button"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger value="hero" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Inicio</TabsTrigger>
          <TabsTrigger value="cars" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Autos</TabsTrigger>
          <TabsTrigger value="motorcycles" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Motos</TabsTrigger>
          <TabsTrigger value="promotional" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Promo</TabsTrigger>
          <TabsTrigger value="contact" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Contacto</TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">Vista P</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900">
              <CardTitle className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Settings className="h-5 w-5 text-red-600" />
                Configuración de Página de Inicio
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Personaliza el contenido principal que los usuarios ven al entrar al sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hero_title" className="text-gray-700 dark:text-gray-300 font-medium">Título Principal</Label>
                    <Input
                      id="hero_title"
                      value={getCurrentValue('hero_title')}
                      onChange={(e) => handleConfigChange('hero_title', e.target.value)}
                      placeholder="GTR CUBAUTO"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="hero-title-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hero_subtitle" className="text-gray-700 dark:text-gray-300 font-medium">Subtítulo</Label>
                    <Input
                      id="hero_subtitle"
                      value={getCurrentValue('hero_subtitle')}
                      onChange={(e) => handleConfigChange('hero_subtitle', e.target.value)}
                      placeholder="REPUESTOS DE CALIDAD PARA AUTOS Y MOTOS"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="hero-subtitle-input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hero_image_url" className="text-gray-700 dark:text-gray-300 font-medium">URL de Imagen de Fondo</Label>
                    <Input
                      id="hero_image_url"
                      value={getCurrentValue('hero_image_url')}
                      onChange={(e) => handleConfigChange('hero_image_url', e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="hero-image-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hero_video_url" className="text-gray-700 dark:text-gray-300 font-medium">URL de Video de Fondo (opcional)</Label>
                    <Input
                      id="hero_video_url"
                      value={getCurrentValue('hero_video_url')}
                      onChange={(e) => handleConfigChange('hero_video_url', e.target.value)}
                      placeholder="https://ejemplo.com/video.mp4"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="hero-video-input"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="hero_description" className="text-gray-700 dark:text-gray-300 font-medium">Descripción</Label>
                <Textarea
                  id="hero_description"
                  value={getCurrentValue('hero_description')}
                  onChange={(e) => handleConfigChange('hero_description', e.target.value)}
                  placeholder="Todo para tu vehículo en un solo lugar..."
                  className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:bg-gray-800 dark:text-gray-100 min-h-[100px]"
                  data-testid="hero-description-input"
                />
              </div>

              <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Switch
                  id="enable_video_hero"
                  checked={getCurrentValue('enable_video_hero')}
                  onCheckedChange={(checked) => handleConfigChange('enable_video_hero', checked)}
                  data-testid="enable-video-switch"
                />
                <Label htmlFor="enable_video_hero" className="text-gray-700 dark:text-gray-300 cursor-pointer">
                  Usar video como fondo principal (en lugar de imagen)
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cars" className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-900">
              <CardTitle className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                Configuración de Página de Autos
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Personaliza el contenido y fondo de la página de autos clásicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cars_hero_title" className="text-gray-700 dark:text-gray-300 font-medium">Título de Autos</Label>
                    <Input
                      id="cars_hero_title"
                      value={getCurrentValue('cars_hero_title')}
                      onChange={(e) => handleConfigChange('cars_hero_title', e.target.value)}
                      placeholder="Autos Clásicos & Repuestos"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="cars-title-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cars_hero_subtitle" className="text-gray-700 dark:text-gray-300 font-medium">Subtítulo de Autos</Label>
                    <Input
                      id="cars_hero_subtitle"
                      value={getCurrentValue('cars_hero_subtitle')}
                      onChange={(e) => handleConfigChange('cars_hero_subtitle', e.target.value)}
                      placeholder="GTR CUBAUTOS - MULTISERVICIO AUTOMOTRIZ"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="cars-subtitle-input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cars_hero_image_url" className="text-gray-700 dark:text-gray-300 font-medium">URL de Imagen de Fondo (Autos)</Label>
                    <Input
                      id="cars_hero_image_url"
                      value={getCurrentValue('cars_hero_image_url')}
                      onChange={(e) => handleConfigChange('cars_hero_image_url', e.target.value)}
                      placeholder="https://ejemplo.com/imagen-autos.jpg"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="cars-image-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cars_hero_video_url" className="text-gray-700 dark:text-gray-300 font-medium">URL de Video de Fondo (Autos - opcional)</Label>
                    <Input
                      id="cars_hero_video_url"
                      value={getCurrentValue('cars_hero_video_url')}
                      onChange={(e) => handleConfigChange('cars_hero_video_url', e.target.value)}
                      placeholder="https://ejemplo.com/video-autos.mp4"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="cars-video-input"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="cars_hero_description" className="text-gray-700 dark:text-gray-300 font-medium">Descripción de Autos</Label>
                <Textarea
                  id="cars_hero_description"
                  value={getCurrentValue('cars_hero_description')}
                  onChange={(e) => handleConfigChange('cars_hero_description', e.target.value)}
                  placeholder="Tu centro automotriz completo: autos clásicos, piezas, repuestos y servicios especializados."
                  className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100 min-h-[100px]"
                  data-testid="cars-description-input"
                />
              </div>

              <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Switch
                  id="cars_enable_video_hero"
                  checked={getCurrentValue('cars_enable_video_hero')}
                  onCheckedChange={(checked) => handleConfigChange('cars_enable_video_hero', checked)}
                  data-testid="cars-enable-video-switch"
                />
                <Label htmlFor="cars_enable_video_hero" className="text-gray-700 dark:text-gray-300 cursor-pointer">
                  Usar video como fondo en página de autos
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motorcycles" className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900">
              <CardTitle className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Settings className="h-5 w-5 text-green-600" />
                Configuración de Página de Motos
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Personaliza el contenido y fondo de la página de motocicletas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="motorcycles_hero_title" className="text-gray-700 dark:text-gray-300 font-medium">Título de Motos</Label>
                    <Input
                      id="motorcycles_hero_title"
                      value={getCurrentValue('motorcycles_hero_title')}
                      onChange={(e) => handleConfigChange('motorcycles_hero_title', e.target.value)}
                      placeholder="Suzuki & Yamaha + Repuestos"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="motorcycles-title-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="motorcycles_hero_subtitle" className="text-gray-700 dark:text-gray-300 font-medium">Subtítulo de Motos</Label>
                    <Input
                      id="motorcycles_hero_subtitle"
                      value={getCurrentValue('motorcycles_hero_subtitle')}
                      onChange={(e) => handleConfigChange('motorcycles_hero_subtitle', e.target.value)}
                      placeholder="GTR CUBAUTOS - MULTISERVICIO MOTOCICLETAS"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="motorcycles-subtitle-input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="motorcycles_hero_image_url" className="text-gray-700 dark:text-gray-300 font-medium">URL de Imagen de Fondo (Motos)</Label>
                    <Input
                      id="motorcycles_hero_image_url"
                      value={getCurrentValue('motorcycles_hero_image_url')}
                      onChange={(e) => handleConfigChange('motorcycles_hero_image_url', e.target.value)}
                      placeholder="https://ejemplo.com/imagen-motos.jpg"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="motorcycles-image-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="motorcycles_hero_video_url" className="text-gray-700 dark:text-gray-300 font-medium">URL de Video de Fondo (Motos - opcional)</Label>
                    <Input
                      id="motorcycles_hero_video_url"
                      value={getCurrentValue('motorcycles_hero_video_url')}
                      onChange={(e) => handleConfigChange('motorcycles_hero_video_url', e.target.value)}
                      placeholder="https://ejemplo.com/video-motos.mp4"
                      className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:bg-gray-800 dark:text-gray-100"
                      data-testid="motorcycles-video-input"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="motorcycles_hero_description" className="text-gray-700 dark:text-gray-300 font-medium">Descripción de Motos</Label>
                <Textarea
                  id="motorcycles_hero_description"
                  value={getCurrentValue('motorcycles_hero_description')}
                  onChange={(e) => handleConfigChange('motorcycles_hero_description', e.target.value)}
                  placeholder="Especialistas en motocicletas Suzuki y Yamaha, piezas originales y servicios técnicos."
                  className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:bg-gray-800 dark:text-gray-100 min-h-[100px]"
                  data-testid="motorcycles-description-input"
                />
              </div>

              <div className="flex items-center space-x-2 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <Switch
                  id="motorcycles_enable_video_hero"
                  checked={getCurrentValue('motorcycles_enable_video_hero')}
                  onCheckedChange={(checked) => handleConfigChange('motorcycles_enable_video_hero', checked)}
                  data-testid="motorcycles-enable-video-switch"
                />
                <Label htmlFor="motorcycles_enable_video_hero" className="text-gray-700 dark:text-gray-300 cursor-pointer">
                  Usar video como fondo en página de motos
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Imágenes Promocionales */}
            <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Image className="h-5 w-5 text-purple-600" />
                  Imágenes Promocionales
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Agregar imágenes publicitarias que se mostrarán en la página
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {(getCurrentValue('promotional_images') || []).map((image: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={image}
                      onChange={(e) => updatePromotionalImage(index, e.target.value)}
                      placeholder="https://ejemplo.com/imagen-promocional.jpg"
                      className="border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:bg-gray-800 dark:text-gray-100 flex-1"
                      data-testid={`promotional-image-${index}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePromotionalImage(index)}
                      className="border-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      data-testid={`remove-image-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={addPromotionalImage}
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  data-testid="add-promotional-image"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Imagen Promocional
                </Button>
              </CardContent>
            </Card>

            {/* Videos Promocionales */}
            <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Video className="h-5 w-5 text-orange-600" />
                  Videos Promocionales
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Agregar videos publicitarios que se mostrarán en la página
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {(getCurrentValue('promotional_videos') || []).map((video: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={video}
                      onChange={(e) => updatePromotionalVideo(index, e.target.value)}
                      placeholder="https://ejemplo.com/video-promocional.mp4"
                      className="border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:bg-gray-800 dark:text-gray-100 flex-1"
                      data-testid={`promotional-video-${index}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePromotionalVideo(index)}
                      className="border-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      data-testid={`remove-video-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={addPromotionalVideo}
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                  data-testid="add-promotional-video"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Video Promocional
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información de Contacto */}
            <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-cyan-600" />
                  Información de Contacto
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Configura los datos de contacto de tu negocio
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <Label htmlFor="contact_email" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4 text-cyan-600" />
                    Email de Contacto
                  </Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={getCurrentValue('contact_email')}
                    onChange={(e) => handleConfigChange('contact_email', e.target.value)}
                    placeholder="info@gtrcubauto.com"
                    className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-cyan-500 dark:bg-gray-800 dark:text-gray-100"
                    data-testid="contact-email-input"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_phone" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4 text-cyan-600" />
                    Teléfono de Contacto
                  </Label>
                  <Input
                    id="contact_phone"
                    type="tel"
                    value={getCurrentValue('contact_phone')}
                    onChange={(e) => handleConfigChange('contact_phone', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-cyan-500 dark:bg-gray-800 dark:text-gray-100"
                    data-testid="contact-phone-input"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_whatsapp" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    WhatsApp
                  </Label>
                  <Input
                    id="contact_whatsapp"
                    type="tel"
                    value={getCurrentValue('contact_whatsapp')}
                    onChange={(e) => handleConfigChange('contact_whatsapp', e.target.value)}
                    placeholder="+1 234 567 8900"
                    className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-green-500 dark:bg-gray-800 dark:text-gray-100"
                    data-testid="contact-whatsapp-input"
                  />
                </div>

                <div>
                  <Label htmlFor="contact_address" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    Dirección Física
                  </Label>
                  <Textarea
                    id="contact_address"
                    value={getCurrentValue('contact_address')}
                    onChange={(e) => handleConfigChange('contact_address', e.target.value)}
                    placeholder="Calle Principal #123, Ciudad, País"
                    className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:bg-gray-800 dark:text-gray-100 min-h-[80px]"
                    data-testid="contact-address-input"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Cambio de Contraseña */}
            <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                <CardTitle className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Key className="h-5 w-5 text-indigo-600" />
                  Cambiar Contraseña
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Actualiza tu contraseña de administrador
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <Label htmlFor="current_password" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4 text-gray-600" />
                    Contraseña Actual
                  </Label>
                  <Input
                    id="current_password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña actual"
                    className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                    data-testid="current-password-input"
                  />
                </div>

                <div>
                  <Label htmlFor="new_password" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                    <Key className="h-4 w-4 text-indigo-600" />
                    Nueva Contraseña
                  </Label>
                  <Input
                    id="new_password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                    data-testid="new-password-input"
                  />
                </div>

                <div>
                  <Label htmlFor="confirm_password" className="text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                    <Key className="h-4 w-4 text-indigo-600" />
                    Confirmar Nueva Contraseña
                  </Label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite la nueva contraseña"
                    className="mt-1.5 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100"
                    data-testid="confirm-password-input"
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={changePasswordMutation.isPending || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4"
                  data-testid="change-password-button"
                >
                  <Key className="h-4 w-4 mr-2" />
                  {changePasswordMutation.isPending ? "Cambiando..." : "Cambiar Contraseña"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-900">
              <CardTitle className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Eye className="h-5 w-5 text-gray-600" />
                Vista Previa de Configuración
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Revisa todos los valores configurados
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Título Principal</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-100">{getCurrentValue('hero_title') || 'No configurado'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email de Contacto</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-100">{getCurrentValue('contact_email') || 'No configurado'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Teléfono</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-100">{getCurrentValue('contact_phone') || 'No configurado'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">WhatsApp</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-100">{getCurrentValue('contact_whatsapp') || 'No configurado'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg md:col-span-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dirección</p>
                    <p className="mt-1 text-gray-800 dark:text-gray-100">{getCurrentValue('contact_address') || 'No configurado'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
