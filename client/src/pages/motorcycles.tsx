import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/products/product-card';
import SearchBar from '@/components/products/search-bar';
import { Bike, Search, Filter, Zap, Star, Gauge, Shield, Crown, Wind } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';
import heroImage from "@assets/generated_images/Luxury_car_mountain_landscape_42bbaabd.png";

export default function Motorcycles() {
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = urlParams.get('search') || '';
  
  const [currentSearch, setCurrentSearch] = useState(initialSearch);
  const { addToCart, isWholesaleUser } = useStore();
  const { toast } = useToast();

  const { data: motorcycles = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { category: 'motorcycles', search: currentSearch }],
  });

  const { data: siteConfig = {}, isLoading: configLoading } = useQuery({
    queryKey: ["/api/site-config"],
  });

  const handleSearch = (query: string) => {
    setCurrentSearch(query);
    
    // Update URL
    if (query) {
      setLocation(`/motos?search=${encodeURIComponent(query)}`);
    } else {
      setLocation('/motos');
    }
  };

  const clearSearch = () => {
    setCurrentSearch('');
    setLocation('/motos');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, isWholesaleUser);
    toast({
      title: "🏍️ Producto agregado",
      description: `${product.name} agregado al carrito GTR`,
    });
  };

  const featuredBikes = motorcycles.filter(bike => 
    bike.name.toLowerCase().includes('sport') || 
    bike.name.toLowerCase().includes('racing') ||
    bike.name.toLowerCase().includes('premium')
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-black" data-testid="motorcycles-page">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden" data-testid="motorcycles-hero-section">
        {/* Background Image or Video */}
        {siteConfig.motorcycles_enable_video_hero && siteConfig.motorcycles_hero_video_url ? (
          <video 
            autoPlay 
            muted 
            loop 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.4)' }}
          >
            <source src={siteConfig.motorcycles_hero_video_url} type="video/mp4" />
          </video>
        ) : (
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${siteConfig.motorcycles_hero_image_url || heroImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(0.4)'
            }}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>
        
        <div className="relative container mx-auto px-6">
          <div className="max-w-6xl mx-auto text-center">
            <div className="mb-12">
              <Badge className="mb-4 bg-black dark:bg-white text-white dark:text-black border-0 px-6 py-3 text-sm font-medium">
                <Bike className="h-4 w-4 mr-2" />
                {siteConfig.motorcycles_hero_subtitle || "GTR CUBAUTOS - MULTISERVICIO MOTOCICLETAS"}
              </Badge>
              <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight text-white font-display" data-testid="motorcycles-hero-title">
                {siteConfig.motorcycles_hero_title || "Suzuki & Yamaha + Repuestos"}
              </h1>
              <p className="text-lg md:text-xl text-gray-100 mb-12 leading-relaxed max-w-4xl mx-auto" data-testid="motorcycles-hero-description">
                {siteConfig.motorcycles_hero_description || "Especialistas en motocicletas Suzuki y Yamaha, piezas originales y servicios técnicos. Calidad, confianza y experiencia en cada servicio."}
              </p>
            
            {/* Featured Bikes Preview */}
            {featuredBikes.length > 0 && (
              <div className="flex justify-center gap-4 mb-8">
                {featuredBikes.map((bike, index) => (
                  <div key={bike.id} className="relative">
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs px-2 py-1 z-10">
                      <Wind className="h-3 w-3 mr-1" />
                      VELOCIDAD
                    </Badge>
                    <div className="w-20 h-12 bg-gray-900 dark:bg-gray-100 rounded-lg flex items-center justify-center text-white dark:text-black font-bold text-xs">
                      MOTO
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-6 pb-16">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <Card className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <SearchBar
                  placeholder="Buscar Suzuki, Yamaha, piezas, repuestos, filtros, cadenas..."
                  onSearch={handleSearch}
                  className="w-full"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                <Filter className="h-4 w-4" />
                Filtros Avanzados
              </Button>
            </div>
            {currentSearch && (
              <div className="mt-4 flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-gray-800 dark:text-gray-200 font-medium">
                    Resultados para: "{currentSearch}"
                  </span>
                  <Badge className="bg-black dark:bg-white text-white dark:text-black">{motorcycles.length}</Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearSearch}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  data-testid="clear-search"
                >
                  Limpiar búsqueda
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 text-center bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
            <Bike className="h-10 w-10 mx-auto mb-3 text-gray-700 dark:text-gray-300" />
            <div className="text-3xl font-bold text-black dark:text-white mb-1">{motorcycles.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Suzuki & Yamaha</div>
          </Card>
          <Card className="p-6 text-center bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
            <Wind className="h-10 w-10 mx-auto mb-3 text-gray-700 dark:text-gray-300" />
            <div className="text-3xl font-bold text-black dark:text-white mb-1">500+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Piezas Disponibles</div>
          </Card>
          <Card className="p-6 text-center bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
            <Star className="h-10 w-10 mx-auto mb-3 text-gray-700 dark:text-gray-300" />
            <div className="text-3xl font-bold text-black dark:text-white mb-1">10+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Años Experiencia</div>
          </Card>
          <Card className="p-6 text-center bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
            <Shield className="h-10 w-10 mx-auto mb-3 text-gray-700 dark:text-gray-300" />
            <div className="text-2xl font-bold text-black dark:text-white mb-1">🔧</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 uppercase tracking-wider">Taller Especializado</div>
          </Card>
        </div>

        {/* Promotional Banner */}
        <div className="mb-12">
          <Card className="p-6 bg-black dark:bg-white text-white dark:text-black border-0 overflow-hidden relative">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-2xl font-bold mb-2">🏍️ Especialistas Suzuki & Yamaha</h3>
                <p className="text-gray-300 dark:text-gray-600">Piezas originales • Repuestos garantizados • Taller especializado • Servicio técnico</p>
              </div>
              <Badge className="bg-red-600 text-white px-4 py-2 text-lg font-bold">
                SERVICIO GARANTIZADO
              </Badge>
            </div>
          </Card>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse overflow-hidden bg-white/50 backdrop-blur-sm">
                <div className="bg-gradient-to-r from-purple-200 via-pink-300 to-orange-200 aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-purple-200 to-pink-300 h-6 rounded mb-3"></div>
                  <div className="bg-gradient-to-r from-purple-200 to-pink-300 h-4 rounded w-2/3 mb-4"></div>
                  <div className="bg-gradient-to-r from-purple-200 to-pink-300 h-12 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : motorcycles.length === 0 ? (
          <div className="text-center py-20" data-testid="no-motorcycles">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
              <Bike className="h-16 w-16 text-purple-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">
              {currentSearch ? 'No se encontraron motocicletas' : 'Colección en actualización'}
            </h3>
            <p className="text-xl text-gray-500 mb-8 max-w-md mx-auto">
              {currentSearch 
                ? `No encontramos motocicletas que coincidan con "${currentSearch}". Intenta con otros términos.`
                : 'Estamos preparando nuevas superbikes para ti. ¡Vuelve pronto!'
              }
            </p>
            {currentSearch && (
              <Button onClick={clearSearch} className="bg-red-600 hover:bg-red-700 text-white">
                Ver todas las motocicletas
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentSearch ? `Resultados de búsqueda (${motorcycles.length})` : `Colección GTR Motocicletas (${motorcycles.length})`}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600">
                  <Wind className="h-3 w-3 mr-1" />
                  Velocidad
                </Badge>
                <Badge variant="outline" className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="motorcycles-grid">
              {motorcycles.map((motorcycle) => (
                <Card key={motorcycle.id} className="group overflow-hidden bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={motorcycle.imageUrl || 'https://via.placeholder.com/600x400/8B5CF6/FFFFFF?text=GTR+MOTO'}
                      alt={motorcycle.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      data-testid={`motorcycle-image-${motorcycle.id}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black dark:bg-white text-white dark:text-black border-0">
                        SUZUKI | YAMAHA
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/30">
                        🔧 SERVICIO TÉCNICO
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-bold text-xl text-white mb-1" data-testid={`motorcycle-name-${motorcycle.id}`}>
                        {motorcycle.name}
                      </h3>
                      {motorcycle.specs && (
                        <p className="text-purple-200 text-sm" data-testid={`motorcycle-specs-${motorcycle.id}`}>
                          {typeof motorcycle.specs === 'object' && motorcycle.specs !== null ? 
                            Object.values(motorcycle.specs as Record<string, any>).slice(0, 2).join(' • ') : 
                            String(motorcycle.specs)}
                        </p>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Precio GTR</span>
                        <span className="text-2xl font-bold text-black dark:text-white">
                          ${motorcycle.retailPrice}
                        </span>
                      </div>
                      {isWholesaleUser && (
                        <div className="text-right">
                          <span className="text-sm text-green-600">Precio Mayorista</span>
                          <div className="text-lg font-bold text-green-700">${motorcycle.wholesalePrice}</div>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleAddToCart(motorcycle)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      data-testid={`add-to-cart-${motorcycle.id}`}
                    >
                      <Bike className="h-4 w-4 mr-2" />
                      Agregar al Carrito GTR
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}