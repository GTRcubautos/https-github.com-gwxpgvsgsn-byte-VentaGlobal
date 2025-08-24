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
import { Upload, Save, Eye, Video, Image, Plus, X, Settings } from "lucide-react";

export default function SiteConfigPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [unsavedChanges, setUnsavedChanges] = useState<Record<string, any>>({});

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
            <h2 className="text-2xl font-bold text-gray-700">Configuración de Página de Inicio</h2>
            <p className="text-gray-400">Personaliza el contenido y apariencia de tu página principal</p>
          </div>
        </div>
        
        {Object.keys(unsavedChanges).length > 0 && (
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-yellow-400 border-yellow-400">
              {Object.keys(unsavedChanges).length} cambios sin guardar
            </Badge>
            <Button 
              onClick={saveAllChanges}
              disabled={updateConfigMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
              data-testid="save-all-button"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Todos los Cambios
            </Button>
          </div>
        )}
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 bg-gray-800">
          <TabsTrigger value="hero" className="data-[state=active]:bg-red-600">Inicio</TabsTrigger>
          <TabsTrigger value="cars" className="data-[state=active]:bg-red-600">Autos</TabsTrigger>
          <TabsTrigger value="motorcycles" className="data-[state=active]:bg-red-600">Motos</TabsTrigger>
          <TabsTrigger value="promotional" className="data-[state=active]:bg-red-600">Promo</TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-red-600">Vista P</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-700">Configuración de Página de Inicio</CardTitle>
              <CardDescription className="text-gray-400">
                Personaliza el contenido principal que los usuarios ven al entrar al sitio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hero_title" className="text-gray-700">Título Principal</Label>
                    <Input
                      id="hero_title"
                      value={getCurrentValue('hero_title')}
                      onChange={(e) => handleConfigChange('hero_title', e.target.value)}
                      placeholder="GTR CUBAUTO"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="hero-title-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hero_subtitle" className="text-gray-700">Subtítulo</Label>
                    <Input
                      id="hero_subtitle"
                      value={getCurrentValue('hero_subtitle')}
                      onChange={(e) => handleConfigChange('hero_subtitle', e.target.value)}
                      placeholder="REPUESTOS DE CALIDAD PARA AUTOS Y MOTOS"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="hero-subtitle-input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="hero_image_url" className="text-gray-700">URL de Imagen de Fondo</Label>
                    <Input
                      id="hero_image_url"
                      value={getCurrentValue('hero_image_url')}
                      onChange={(e) => handleConfigChange('hero_image_url', e.target.value)}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="hero-image-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="hero_video_url" className="text-gray-700">URL de Video de Fondo (opcional)</Label>
                    <Input
                      id="hero_video_url"
                      value={getCurrentValue('hero_video_url')}
                      onChange={(e) => handleConfigChange('hero_video_url', e.target.value)}
                      placeholder="https://ejemplo.com/video.mp4"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="hero-video-input"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="hero_description" className="text-gray-700">Descripción</Label>
                <Textarea
                  id="hero_description"
                  value={getCurrentValue('hero_description')}
                  onChange={(e) => handleConfigChange('hero_description', e.target.value)}
                  placeholder="Todo para tu vehículo en un solo lugar..."
                  className="bg-gray-800 border-gray-700 text-gray-700 min-h-[100px]"
                  data-testid="hero-description-input"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="enable_video_hero"
                  checked={getCurrentValue('enable_video_hero')}
                  onCheckedChange={(checked) => handleConfigChange('enable_video_hero', checked)}
                  data-testid="enable-video-switch"
                />
                <Label htmlFor="enable_video_hero" className="text-gray-700">
                  Usar video como fondo principal (en lugar de imagen)
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cars" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-700">Configuración de Página de Autos</CardTitle>
              <CardDescription className="text-gray-400">
                Personaliza el contenido y fondo de la página de autos clásicos
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cars_hero_title" className="text-gray-700">Título de Autos</Label>
                    <Input
                      id="cars_hero_title"
                      value={getCurrentValue('cars_hero_title')}
                      onChange={(e) => handleConfigChange('cars_hero_title', e.target.value)}
                      placeholder="Autos Clásicos & Repuestos"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="cars-title-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cars_hero_subtitle" className="text-gray-700">Subtítulo de Autos</Label>
                    <Input
                      id="cars_hero_subtitle"
                      value={getCurrentValue('cars_hero_subtitle')}
                      onChange={(e) => handleConfigChange('cars_hero_subtitle', e.target.value)}
                      placeholder="GTR CUBAUTOS - MULTISERVICIO AUTOMOTRIZ"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="cars-subtitle-input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cars_hero_image_url" className="text-gray-700">URL de Imagen de Fondo (Autos)</Label>
                    <Input
                      id="cars_hero_image_url"
                      value={getCurrentValue('cars_hero_image_url')}
                      onChange={(e) => handleConfigChange('cars_hero_image_url', e.target.value)}
                      placeholder="https://ejemplo.com/imagen-autos.jpg"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="cars-image-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cars_hero_video_url" className="text-gray-700">URL de Video de Fondo (Autos - opcional)</Label>
                    <Input
                      id="cars_hero_video_url"
                      value={getCurrentValue('cars_hero_video_url')}
                      onChange={(e) => handleConfigChange('cars_hero_video_url', e.target.value)}
                      placeholder="https://ejemplo.com/video-autos.mp4"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="cars-video-input"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="cars_hero_description" className="text-gray-700">Descripción de Autos</Label>
                <Textarea
                  id="cars_hero_description"
                  value={getCurrentValue('cars_hero_description')}
                  onChange={(e) => handleConfigChange('cars_hero_description', e.target.value)}
                  placeholder="Tu centro automotriz completo: autos clásicos, piezas, repuestos y servicios especializados."
                  className="bg-gray-800 border-gray-700 text-gray-700 min-h-[100px]"
                  data-testid="cars-description-input"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="cars_enable_video_hero"
                  checked={getCurrentValue('cars_enable_video_hero')}
                  onCheckedChange={(checked) => handleConfigChange('cars_enable_video_hero', checked)}
                  data-testid="cars-enable-video-switch"
                />
                <Label htmlFor="cars_enable_video_hero" className="text-gray-700">
                  Usar video como fondo en página de autos
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="motorcycles" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-700">Configuración de Página de Motos</CardTitle>
              <CardDescription className="text-gray-400">
                Personaliza el contenido y fondo de la página de motocicletas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="motorcycles_hero_title" className="text-gray-700">Título de Motos</Label>
                    <Input
                      id="motorcycles_hero_title"
                      value={getCurrentValue('motorcycles_hero_title')}
                      onChange={(e) => handleConfigChange('motorcycles_hero_title', e.target.value)}
                      placeholder="Suzuki & Yamaha + Repuestos"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="motorcycles-title-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="motorcycles_hero_subtitle" className="text-gray-700">Subtítulo de Motos</Label>
                    <Input
                      id="motorcycles_hero_subtitle"
                      value={getCurrentValue('motorcycles_hero_subtitle')}
                      onChange={(e) => handleConfigChange('motorcycles_hero_subtitle', e.target.value)}
                      placeholder="GTR CUBAUTOS - MULTISERVICIO MOTOCICLETAS"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="motorcycles-subtitle-input"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="motorcycles_hero_image_url" className="text-gray-700">URL de Imagen de Fondo (Motos)</Label>
                    <Input
                      id="motorcycles_hero_image_url"
                      value={getCurrentValue('motorcycles_hero_image_url')}
                      onChange={(e) => handleConfigChange('motorcycles_hero_image_url', e.target.value)}
                      placeholder="https://ejemplo.com/imagen-motos.jpg"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="motorcycles-image-input"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="motorcycles_hero_video_url" className="text-gray-700">URL de Video de Fondo (Motos - opcional)</Label>
                    <Input
                      id="motorcycles_hero_video_url"
                      value={getCurrentValue('motorcycles_hero_video_url')}
                      onChange={(e) => handleConfigChange('motorcycles_hero_video_url', e.target.value)}
                      placeholder="https://ejemplo.com/video-motos.mp4"
                      className="bg-gray-800 border-gray-700 text-gray-700"
                      data-testid="motorcycles-video-input"
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="motorcycles_hero_description" className="text-gray-700">Descripción de Motos</Label>
                <Textarea
                  id="motorcycles_hero_description"
                  value={getCurrentValue('motorcycles_hero_description')}
                  onChange={(e) => handleConfigChange('motorcycles_hero_description', e.target.value)}
                  placeholder="Especialistas en motocicletas Suzuki y Yamaha, piezas originales y servicios técnicos."
                  className="bg-gray-800 border-gray-700 text-gray-700 min-h-[100px]"
                  data-testid="motorcycles-description-input"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="motorcycles_enable_video_hero"
                  checked={getCurrentValue('motorcycles_enable_video_hero')}
                  onCheckedChange={(checked) => handleConfigChange('motorcycles_enable_video_hero', checked)}
                  data-testid="motorcycles-enable-video-switch"
                />
                <Label htmlFor="motorcycles_enable_video_hero" className="text-gray-700">
                  Usar video como fondo en página de motos
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotional" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Imágenes Promocionales */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-700 flex items-center gap-2">
                  <Image className="h-5 w-5 text-red-500" />
                  Imágenes Promocionales
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Agregar imágenes publicitarias que se mostrarán en la página
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(getCurrentValue('promotional_images') || []).map((image: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={image}
                      onChange={(e) => updatePromotionalImage(index, e.target.value)}
                      placeholder="https://ejemplo.com/imagen-promocional.jpg"
                      className="bg-gray-800 border-gray-700 text-gray-700 flex-1"
                      data-testid={`promotional-image-${index}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePromotionalImage(index)}
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-gray-700"
                      data-testid={`remove-image-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={addPromotionalImage}
                  variant="outline"
                  className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-gray-700"
                  data-testid="add-promotional-image"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Imagen Promocional
                </Button>
              </CardContent>
            </Card>

            {/* Videos Promocionales */}
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-700 flex items-center gap-2">
                  <Video className="h-5 w-5 text-red-500" />
                  Videos Promocionales
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Agregar videos publicitarios que se mostrarán en la página
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(getCurrentValue('promotional_videos') || []).map((video: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={video}
                      onChange={(e) => updatePromotionalVideo(index, e.target.value)}
                      placeholder="https://ejemplo.com/video-promocional.mp4"
                      className="bg-gray-800 border-gray-700 text-gray-700 flex-1"
                      data-testid={`promotional-video-${index}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePromotionalVideo(index)}
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-gray-700"
                      data-testid={`remove-video-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  onClick={addPromotionalVideo}
                  variant="outline"
                  className="w-full border-green-500 text-green-400 hover:bg-green-500 hover:text-gray-700"
                  data-testid="add-promotional-video"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Video Promocional
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-700 flex items-center gap-2">
                <Eye className="h-5 w-5 text-red-500" />
                Vista Previa del Hero
              </CardTitle>
              <CardDescription className="text-gray-400">
                Así se verá la sección principal con la configuración actual
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative rounded-lg overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-8 text-center min-h-[300px] flex flex-col justify-center">
                {getCurrentValue('enable_video_hero') && getCurrentValue('hero_video_url') && (
                  <div className="absolute inset-0">
                    <video 
                      className="w-full h-full object-cover opacity-50" 
                      autoPlay 
                      muted 
                      loop
                    >
                      <source src={getCurrentValue('hero_video_url')} type="video/mp4" />
                    </video>
                  </div>
                )}
                {!getCurrentValue('enable_video_hero') && getCurrentValue('hero_image_url') && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-50"
                    style={{ backgroundImage: `url(${getCurrentValue('hero_image_url')})` }}
                  />
                )}
                <div className="relative z-10 space-y-4">
                  <h1 className="text-4xl md:text-6xl font-bold text-gray-700">
                    {getCurrentValue('hero_title') || 'GTR CUBAUTO'}
                  </h1>
                  <h2 className="text-xl md:text-2xl text-red-200">
                    {getCurrentValue('hero_subtitle') || 'REPUESTOS DE CALIDAD PARA AUTOS Y MOTOS'}
                  </h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    {getCurrentValue('hero_description') || 'Todo para tu vehículo en un solo lugar...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vista Previa de Contenido Promocional */}
          {((getCurrentValue('promotional_images') || []).length > 0 || 
            (getCurrentValue('promotional_videos') || []).length > 0) && (
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-700">Contenido Promocional</CardTitle>
                <CardDescription className="text-gray-400">
                  Vista previa del contenido promocional configurado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(getCurrentValue('promotional_images') || []).map((image: string, index: number) => (
                    image && (
                      <div key={`img-${index}`} className="relative rounded-lg overflow-hidden bg-gray-800">
                        <img 
                          src={image} 
                          alt={`Promocional ${index + 1}`}
                          className="w-full h-32 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x150?text=Error+al+cargar';
                          }}
                        />
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-blue-600">Imagen {index + 1}</Badge>
                        </div>
                      </div>
                    )
                  ))}
                  {(getCurrentValue('promotional_videos') || []).map((video: string, index: number) => (
                    video && (
                      <div key={`vid-${index}`} className="relative rounded-lg overflow-hidden bg-gray-800">
                        <video 
                          className="w-full h-32 object-cover" 
                          controls
                          preload="metadata"
                        >
                          <source src={video} type="video/mp4" />
                          Tu navegador no soporta videos
                        </video>
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-purple-600">Video {index + 1}</Badge>
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}