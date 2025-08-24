import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import ProductCard from '@/components/products/product-card';
import SearchBar from '@/components/products/search-bar';
import { Car, Search, Filter, Zap, Star, Gauge, Shield, Crown } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';

export default function Cars() {
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = urlParams.get('search') || '';
  
  const [currentSearch, setCurrentSearch] = useState(initialSearch);
  const { addToCart, isWholesaleUser } = useStore();
  const { toast } = useToast();

  const { data: cars = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { category: 'cars', search: currentSearch }],
  });

  const handleSearch = (query: string) => {
    setCurrentSearch(query);
    
    // Update URL
    if (query) {
      setLocation(`/autos?search=${encodeURIComponent(query)}`);
    } else {
      setLocation('/autos');
    }
  };

  const clearSearch = () => {
    setCurrentSearch('');
    setLocation('/autos');
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, isWholesaleUser);
    toast({
      title: "🚗 Producto agregado",
      description: `${product.name} agregado al carrito GTR`,
    });
  };

  const featuredCars = cars.filter(car => 
    car.name.toLowerCase().includes('gtr') || 
    car.name.toLowerCase().includes('premium') ||
    car.name.toLowerCase().includes('sport')
  ).slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20" data-testid="cars-page">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/5 to-cyan-600/10"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 px-6 py-3 text-sm font-medium">
              <Car className="h-4 w-4 mr-2" />
              GTR CUBAUTOS - MULTISERVICIO AUTOMOTRIZ
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-700 to-purple-700 bg-clip-text text-transparent">
              Autos Clásicos & Repuestos
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Tu centro automotriz completo: autos clásicos, piezas, repuestos y servicios especializados. 
              <br className="hidden md:block" />
              Calidad, experiencia y confianza en cada producto.
            </p>
            
            {/* Featured Cars Preview */}
            {featuredCars.length > 0 && (
              <div className="flex justify-center gap-4 mb-8">
                {featuredCars.map((car, index) => (
                  <div key={car.id} className="relative">
                    <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 py-1 z-10">
                      <Crown className="h-3 w-3 mr-1" />
                      DESTACADO
                    </Badge>
                    <div className="w-20 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
                      GTR
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-6 pb-16">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <SearchBar
                  placeholder="Buscar autos clásicos, piezas, repuestos, frenos, motores..."
                  onSearch={handleSearch}
                  className="w-full"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2 border-blue-200 text-blue-600 hover:bg-blue-50">
                <Filter className="h-4 w-4" />
                Filtros Avanzados
              </Button>
            </div>
            {currentSearch && (
              <div className="mt-4 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                <div className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <span className="text-blue-800 font-medium">
                    Resultados para: "{currentSearch}"
                  </span>
                  <Badge className="bg-blue-600 text-white">{cars.length}</Badge>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={clearSearch}
                  className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
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
          <Card className="p-6 text-center bg-gradient-to-br from-blue-500/10 to-blue-600/20 border-blue-200/50 hover:scale-105 transition-transform duration-300">
            <Car className="h-10 w-10 mx-auto mb-3 text-blue-600" />
            <div className="text-3xl font-bold text-blue-700 mb-1">{cars.length}</div>
            <div className="text-sm text-blue-600 uppercase tracking-wider">Autos Clásicos</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-purple-500/10 to-purple-600/20 border-purple-200/50 hover:scale-105 transition-transform duration-300">
            <Zap className="h-10 w-10 mx-auto mb-3 text-purple-600" />
            <div className="text-3xl font-bold text-purple-700 mb-1">1000+</div>
            <div className="text-sm text-purple-600 uppercase tracking-wider">Piezas Disponibles</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-cyan-500/10 to-cyan-600/20 border-cyan-200/50 hover:scale-105 transition-transform duration-300">
            <Star className="h-10 w-10 mx-auto mb-3 text-cyan-600" />
            <div className="text-3xl font-bold text-cyan-700 mb-1">15+</div>
            <div className="text-sm text-cyan-600 uppercase tracking-wider">Años Experiencia</div>
          </Card>
          <Card className="p-6 text-center bg-gradient-to-br from-green-500/10 to-green-600/20 border-green-200/50 hover:scale-105 transition-transform duration-300">
            <Shield className="h-10 w-10 mx-auto mb-3 text-green-600" />
            <div className="text-2xl font-bold text-green-700 mb-1">🔧</div>
            <div className="text-sm text-green-600 uppercase tracking-wider">Servicio Técnico</div>
          </Card>
        </div>

        {/* Promotional Banner */}
        <div className="mb-12">
          <Card className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white border-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h3 className="text-2xl font-bold mb-2">🚗 Multiservicio Automotriz Completo</h3>
                <p className="text-blue-100">Autos clásicos • Piezas originales • Repuestos • Servicios especializados</p>
              </div>
              <Badge className="bg-white/20 text-white backdrop-blur-sm px-4 py-2 text-lg font-bold">
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
                <div className="bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 aspect-video relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                </div>
                <CardContent className="p-6">
                  <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-6 rounded mb-3"></div>
                  <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-4 rounded w-2/3 mb-4"></div>
                  <div className="bg-gradient-to-r from-gray-200 to-gray-300 h-12 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-20" data-testid="no-cars">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
              <Car className="h-16 w-16 text-blue-600" />
            </div>
            <h3 className="text-3xl font-bold text-gray-700 mb-4">
              {currentSearch ? 'No se encontraron autos' : 'Catálogo en actualización'}
            </h3>
            <p className="text-xl text-gray-500 mb-8 max-w-md mx-auto">
              {currentSearch 
                ? `No encontramos autos que coincidan con "${currentSearch}". Intenta con otros términos.`
                : 'Estamos preparando nuevos modelos GTR para ti. ¡Vuelve pronto!'
              }
            </p>
            {currentSearch && (
              <Button onClick={clearSearch} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                Ver todos los autos
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentSearch ? `Resultados de búsqueda (${cars.length})` : `Catálogo GTR Autos (${cars.length})`}
              </h2>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-600 border-blue-200">
                  <Gauge className="h-3 w-3 mr-1" />
                  Performance
                </Badge>
                <Badge variant="outline" className="text-purple-600 border-purple-200">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="cars-grid">
              {cars.map((car) => (
                <Card key={car.id} className="group overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={car.imageUrl || 'https://via.placeholder.com/600x400/3B82F6/FFFFFF?text=GTR+AUTO'}
                      alt={car.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      data-testid={`car-image-${car.id}`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                        GTR PREMIUM
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-white/20 text-white backdrop-blur-sm border-white/30">
                        🚚 ENVÍO GRATIS
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="font-bold text-xl text-white mb-1" data-testid={`car-name-${car.id}`}>
                        {car.name}
                      </h3>
                      {car.specs && (
                        <p className="text-blue-200 text-sm" data-testid={`car-specs-${car.id}`}>
                          {typeof car.specs === 'object' && car.specs !== null ? 
                            Object.values(car.specs as Record<string, any>).slice(0, 2).join(' • ') : 
                            String(car.specs)}
                        </p>
                      )}
                    </div>
                  </div>
                  <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-muted-foreground">Precio GTR</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ${car.retailPrice}
                        </span>
                      </div>
                      {isWholesaleUser && (
                        <div className="text-right">
                          <span className="text-sm text-green-600">Precio Mayorista</span>
                          <div className="text-lg font-bold text-green-700">${car.wholesalePrice}</div>
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => handleAddToCart(car)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                      data-testid={`add-to-cart-${car.id}`}
                    >
                      <Car className="h-4 w-4 mr-2" />
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