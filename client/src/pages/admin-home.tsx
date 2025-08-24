import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  Upload,
  Settings,
  Image as ImageIcon,
  Video,
  Type,
  Palette,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PromoCard {
  icon: string;
  title: string;
  description: string;
}

interface HomeSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonText?: string;
  buttonLink?: string;
  images?: string[];
  videos?: string[];
  bannerPromos?: string[];
  promoCards?: PromoCard[];
  enabled: boolean;
  order: number;
}

export default function AdminHome() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentSection, setCurrentSection] = useState('limited-offers');
  const [previewMode, setPreviewMode] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    images: true,
    videos: true,
    bannerPromos: true,
    promoCards: true
  });
  
  // Obtener configuración actual del sitio
  const { data: siteConfig = {}, isLoading } = useQuery({
    queryKey: ["/api/site-config"],
  });

  // Estado para las secciones editables
  const [sections, setSections] = useState<Record<string, HomeSection>>({
    'promotions': {
      id: 'promotions',
      title: 'PROMOCIONES',
      subtitle: 'Ofertas y Beneficios',
      description: 'Cuadritos promocionales en banner y sección final',
      backgroundColor: 'bg-red-600',
      textColor: 'white',
      buttonText: 'Ver promociones',
      buttonLink: '#',
      images: [],
      videos: [],
      bannerPromos: ['ENVÍO GRATIS +$500', 'FINANCIAMIENTO 0%', 'GARANTÍA EXTENDIDA', 'ATENCIÓN 24/7'],
      promoCards: [
        {
          icon: '🚚',
          title: 'Envío Gratis',
          description: 'En compras superiores a $500'
        },
        {
          icon: '⚡',
          title: 'Financiamiento 0%',
          description: 'Hasta 36 meses sin intereses'
        },
        {
          icon: '🔧',
          title: 'Garantía Extendida',
          description: 'Protección total hasta 5 años'
        }
      ],
      enabled: true,
      order: 0
    },
    'limited-offers': {
      id: 'limited-offers',
      title: 'OFERTAS ESPECIALES',
      subtitle: 'Promociones Exclusivas',
      description: 'No te pierdas estas increíbles ofertas limitadas',
      backgroundColor: 'from-gray-900 via-black to-gray-900',
      textColor: 'white',
      buttonText: 'Ver Detalles',
      buttonLink: '#',
      images: [],
      videos: [],
      enabled: true,
      order: 1
    },
    'categories': {
      id: 'categories',
      title: 'CATEGORÍAS DE REPUESTOS',
      subtitle: 'Repuestos de Calidad',
      description: 'Encuentra todo lo que necesitas para mantener tu vehículo en perfectas condiciones',
      backgroundColor: 'bg-white',
      textColor: 'black',
      buttonText: 'Ver más',
      buttonLink: '#',
      images: [],
      videos: [],
      enabled: true,
      order: 2
    },
    'features': {
      id: 'features',
      title: 'NUESTROS SERVICIOS',
      subtitle: 'Calidad Garantizada',
      description: 'Los mejores servicios para tu vehículo',
      backgroundColor: 'bg-gray-100',
      textColor: 'black',
      buttonText: 'Contactar',
      buttonLink: '#',
      images: [],
      videos: [],
      enabled: true,
      order: 3
    },
    'testimonials': {
      id: 'testimonials',
      title: 'TESTIMONIOS',
      subtitle: 'Lo que dicen nuestros clientes',
      description: 'Experiencias reales de clientes satisfechos',
      backgroundColor: 'bg-gray-50',
      textColor: 'black',
      buttonText: 'Ver más testimonios',
      buttonLink: '#',
      images: [],
      videos: [],
      enabled: true,
      order: 4
    }
  });

  // Cargar configuración existente
  useEffect(() => {
    if (siteConfig.home_sections) {
      setSections(prev => ({
        ...prev,
        ...siteConfig.home_sections
      }));
    }
  }, [siteConfig]);

  // Mutación para guardar cambios
  const saveSectionMutation = useMutation({
    mutationFn: async (updatedSections: Record<string, HomeSection>) => {
      const response = await apiRequest('POST', '/api/admin/home-config', {
        home_sections: updatedSections
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Cambios guardados",
        description: "La configuración de la página de inicio se ha actualizado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/site-config"] });
    },
    onError: (error) => {
      toast({
        title: "Error al guardar",
        description: "No se pudieron guardar los cambios. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleSectionUpdate = (sectionId: string, updates: Partial<HomeSection>) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        ...updates
      }
    }));
  };

  const handleSave = () => {
    saveSectionMutation.mutate(sections);
  };

  const addImage = (sectionId: string, imageUrl: string) => {
    if (!imageUrl.trim()) return;
    
    handleSectionUpdate(sectionId, {
      images: [...(sections[sectionId].images || []), imageUrl]
    });
  };

  const removeImage = (sectionId: string, index: number) => {
    const currentImages = sections[sectionId].images || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    handleSectionUpdate(sectionId, { images: newImages });
  };

  const addVideo = (sectionId: string, videoUrl: string) => {
    if (!videoUrl.trim()) return;
    
    handleSectionUpdate(sectionId, {
      videos: [...(sections[sectionId].videos || []), videoUrl]
    });
  };

  const removeVideo = (sectionId: string, index: number) => {
    const currentVideos = sections[sectionId].videos || [];
    const newVideos = currentVideos.filter((_, i) => i !== index);
    handleSectionUpdate(sectionId, { videos: newVideos });
  };

  const addBannerPromo = (sectionId: string, promoText: string) => {
    if (!promoText.trim()) return;
    
    handleSectionUpdate(sectionId, {
      bannerPromos: [...(sections[sectionId].bannerPromos || []), promoText]
    });
  };

  const removeBannerPromo = (sectionId: string, index: number) => {
    const currentPromos = sections[sectionId].bannerPromos || [];
    const newPromos = currentPromos.filter((_, i) => i !== index);
    handleSectionUpdate(sectionId, { bannerPromos: newPromos });
  };

  const addPromoCard = (sectionId: string, card: PromoCard) => {
    if (!card.title.trim() || !card.description.trim()) return;
    
    handleSectionUpdate(sectionId, {
      promoCards: [...(sections[sectionId].promoCards || []), card]
    });
  };

  const removePromoCard = (sectionId: string, index: number) => {
    const currentCards = sections[sectionId].promoCards || [];
    const newCards = currentCards.filter((_, i) => i !== index);
    handleSectionUpdate(sectionId, { promoCards: newCards });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" data-testid="admin-home-page">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-black">
              Editor de Página Principal
            </h1>
            <p className="text-gray-600 mt-2">
              Edita las secciones de la página de inicio desde "Ofertas Limitadas" hacia abajo
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="preview-mode">Vista previa</Label>
              <Switch
                id="preview-mode"
                checked={previewMode}
                onCheckedChange={setPreviewMode}
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={saveSectionMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
              data-testid="save-changes"
            >
              <Save className="h-4 w-4 mr-2" />
              {saveSectionMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>

        <Tabs value={currentSection} onValueChange={setCurrentSection} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-gray-100">
            {Object.entries(sections).map(([id, section]) => (
              <TabsTrigger 
                key={id} 
                value={id}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                {section.title.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(sections).map(([sectionId, section]) => (
            <TabsContent key={sectionId} value={sectionId} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Configuración de Sección: {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Configuración básica */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`title-${sectionId}`}>Título de la sección</Label>
                        <Input
                          id={`title-${sectionId}`}
                          value={section.title}
                          onChange={(e) => handleSectionUpdate(sectionId, { title: e.target.value })}
                          placeholder="Título de la sección"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`subtitle-${sectionId}`}>Subtítulo</Label>
                        <Input
                          id={`subtitle-${sectionId}`}
                          value={section.subtitle || ''}
                          onChange={(e) => handleSectionUpdate(sectionId, { subtitle: e.target.value })}
                          placeholder="Subtítulo opcional"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`description-${sectionId}`}>Descripción</Label>
                        <Textarea
                          id={`description-${sectionId}`}
                          value={section.description || ''}
                          onChange={(e) => handleSectionUpdate(sectionId, { description: e.target.value })}
                          placeholder="Descripción de la sección"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`button-text-${sectionId}`}>Texto del botón</Label>
                        <Input
                          id={`button-text-${sectionId}`}
                          value={section.buttonText || ''}
                          onChange={(e) => handleSectionUpdate(sectionId, { buttonText: e.target.value })}
                          placeholder="Texto del botón"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`button-link-${sectionId}`}>Enlace del botón</Label>
                        <Input
                          id={`button-link-${sectionId}`}
                          value={section.buttonLink || ''}
                          onChange={(e) => handleSectionUpdate(sectionId, { buttonLink: e.target.value })}
                          placeholder="URL o ruta del enlace"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`enabled-${sectionId}`}
                          checked={section.enabled}
                          onCheckedChange={(checked) => handleSectionUpdate(sectionId, { enabled: checked })}
                        />
                        <Label htmlFor={`enabled-${sectionId}`}>
                          Mostrar esta sección
                        </Label>
                      </div>
                    </div>
                  </div>

                  {/* Gestión de imágenes */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Imágenes promocionales
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCollapsedSections(prev => ({ ...prev, images: !prev.images }))}
                        className="flex items-center gap-2"
                      >
                        {collapsedSections.images ? (
                          <>
                            <span>Mostrar</span>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span>Ocultar</span>
                            <ChevronUp className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {!collapsedSections.images && (
                      <>
                        <div className="flex gap-2">
                          <Input
                            placeholder="URL de la imagen"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addImage(sectionId, (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addImage(sectionId, input.value);
                              input.value = '';
                            }}
                            variant="outline"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {(section.images || []).map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={imageUrl}
                                alt={`Imagen ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Error+cargando+imagen';
                                }}
                              />
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeImage(sectionId, index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Gestión de videos */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Video className="h-5 w-5" />
                        Videos promocionales
                      </h3>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCollapsedSections(prev => ({ ...prev, videos: !prev.videos }))}
                        className="flex items-center gap-2"
                      >
                        {collapsedSections.videos ? (
                          <>
                            <span>Mostrar</span>
                            <ChevronDown className="h-4 w-4" />
                          </>
                        ) : (
                          <>
                            <span>Ocultar</span>
                            <ChevronUp className="h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                    
                    {!collapsedSections.videos && (
                      <>
                        <div className="flex gap-2">
                          <Input
                            placeholder="URL del video (MP4)"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addVideo(sectionId, (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addVideo(sectionId, input.value);
                              input.value = '';
                            }}
                            variant="outline"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(section.videos || []).map((videoUrl, index) => (
                            <div key={index} className="relative group">
                              <video
                                src={videoUrl}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                controls
                                preload="metadata"
                              >
                                Tu navegador no soporta videos
                              </video>
                              <Button
                                size="sm"
                                variant="destructive"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeVideo(sectionId, index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Gestión de promociones - Solo para la sección de promociones */}
                  {sectionId === 'promotions' && (
                    <>
                      {/* Banner promociones */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Type className="h-5 w-5" />
                            Textos del banner promocional
                          </h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setCollapsedSections(prev => ({ ...prev, bannerPromos: !prev.bannerPromos }))}
                            className="flex items-center gap-2"
                          >
                            {collapsedSections.bannerPromos ? (
                              <>
                                <span>Mostrar</span>
                                <ChevronDown className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                <span>Ocultar</span>
                                <ChevronUp className="h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {!collapsedSections.bannerPromos && (
                          <>
                            <p className="text-sm text-gray-600">
                              Textos que aparecen en el banner rojo horizontal después del hero
                            </p>
                        
                        <div className="flex gap-2">
                          <Input
                            placeholder="Ej: ENVÍO GRATIS +$500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                addBannerPromo(sectionId, (e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = '';
                              }
                            }}
                          />
                          <Button
                            type="button"
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                              addBannerPromo(sectionId, input.value);
                              input.value = '';
                            }}
                            variant="outline"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                            <div className="space-y-2">
                              {(section.bannerPromos || []).map((promo, index) => (
                                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg">
                                  <span className="flex-1 font-semibold text-sm">{promo}</span>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => removeBannerPromo(sectionId, index)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>

                      {/* Tarjetas promocionales */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Palette className="h-5 w-5" />
                            Tarjetas promocionales
                          </h3>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setCollapsedSections(prev => ({ ...prev, promoCards: !prev.promoCards }))}
                            className="flex items-center gap-2"
                          >
                            {collapsedSections.promoCards ? (
                              <>
                                <span>Mostrar</span>
                                <ChevronDown className="h-4 w-4" />
                              </>
                            ) : (
                              <>
                                <span>Ocultar</span>
                                <ChevronUp className="h-4 w-4" />
                              </>
                            )}
                          </Button>
                        </div>
                        
                        {!collapsedSections.promoCards && (
                          <>
                            <p className="text-sm text-gray-600">
                              Cuadritos con íconos que aparecen al final de la página
                            </p>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            placeholder="Ícono (emoji)"
                            id={`promo-icon-${sectionId}`}
                            maxLength={5}
                          />
                          <Input
                            placeholder="Título"
                            id={`promo-title-${sectionId}`}
                          />
                          <Input
                            placeholder="Descripción"
                            id={`promo-desc-${sectionId}`}
                          />
                        </div>
                        <Button
                          type="button"
                          onClick={() => {
                            const icon = (document.getElementById(`promo-icon-${sectionId}`) as HTMLInputElement)?.value || '';
                            const title = (document.getElementById(`promo-title-${sectionId}`) as HTMLInputElement)?.value || '';
                            const description = (document.getElementById(`promo-desc-${sectionId}`) as HTMLInputElement)?.value || '';
                            
                            if (icon && title && description) {
                              addPromoCard(sectionId, { icon, title, description });
                              (document.getElementById(`promo-icon-${sectionId}`) as HTMLInputElement).value = '';
                              (document.getElementById(`promo-title-${sectionId}`) as HTMLInputElement).value = '';
                              (document.getElementById(`promo-desc-${sectionId}`) as HTMLInputElement).value = '';
                            }
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar tarjeta promocional
                        </Button>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {(section.promoCards || []).map((card, index) => (
                                <div key={index} className="border rounded-lg p-4 bg-gray-50 relative group">
                                  <div className="text-center space-y-2">
                                    <div className="text-2xl">{card.icon}</div>
                                    <h4 className="font-semibold">{card.title}</h4>
                                    <p className="text-sm text-gray-600">{card.description}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => removePromoCard(sectionId, index)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Vista previa */}
              {previewMode && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Vista previa de la sección
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`p-8 rounded-lg ${section.backgroundColor}`}>
                      <div className="text-center mb-8">
                        <Badge className="mb-4 bg-red-600 text-white px-6 py-2 text-lg font-semibold">
                          {section.title}
                        </Badge>
                        {section.subtitle && (
                          <h2 className={`text-3xl md:text-4xl font-bold mb-4 text-${section.textColor}`}>
                            {section.subtitle}
                          </h2>
                        )}
                        {section.description && (
                          <p className={`text-lg max-w-3xl mx-auto leading-relaxed text-${section.textColor === 'white' ? 'gray-300' : 'gray-600'}`}>
                            {section.description}
                          </p>
                        )}
                      </div>
                      
                      {(section.images?.length > 0 || section.videos?.length > 0) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {section.images?.map((imageUrl, index) => (
                            <div key={`img-${index}`} className="relative overflow-hidden rounded-lg shadow-lg">
                              <img
                                src={imageUrl}
                                alt={`Vista previa ${index + 1}`}
                                className="w-full h-48 object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
                                <div className="absolute bottom-4 left-4 right-4">
                                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                                    {section.buttonText || 'Ver Detalles'}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {section.videos?.map((videoUrl, index) => (
                            <div key={`vid-${index}`} className="relative overflow-hidden rounded-lg shadow-lg">
                              <video
                                src={videoUrl}
                                className="w-full h-48 object-cover"
                                controls
                                preload="metadata"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}