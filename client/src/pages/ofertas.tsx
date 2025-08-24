import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import ProductCard from '@/components/products/product-card';
import SearchBar from '@/components/products/search-bar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, Clock, Star, Percent, Tag, Gift } from 'lucide-react';
import type { Product } from '@shared/schema';

export default function Ofertas() {
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = urlParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentSearch, setCurrentSearch] = useState(initialSearch);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { search: currentSearch }],
  });

  // Filtrar productos en oferta (precio retail < 100 como ejemplo)
  const offerProducts = products.filter(product => 
    parseFloat(product.retailPrice) < 100 || product.name.toLowerCase().includes('oferta') || product.name.toLowerCase().includes('descuento')
  );

  const handleSearch = (query: string) => {
    setCurrentSearch(query);
    setSearchQuery(query);
    
    // Update URL
    if (query) {
      setLocation(`/ofertas?search=${encodeURIComponent(query)}`);
    } else {
      setLocation('/ofertas');
    }
  };

  const clearSearch = () => {
    setCurrentSearch('');
    setSearchQuery('');
    setLocation('/ofertas');
  };

  return (
    <div className="py-16 bg-black min-h-screen" data-testid="ofertas-page">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full mb-4">
            <Zap className="h-5 w-5" />
            <span className="font-semibold">OFERTAS ESPECIALES</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Súper Ofertas GTR CUBAUTO
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Aprovecha nuestras ofertas exclusivas en repuestos automotrices de alta calidad. 
            Precios especiales por tiempo limitado.
          </p>
          <div className="w-32 h-1 bg-red-500 mx-auto"></div>
        </div>

        {/* Destacados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-red-600 to-red-700 border-0 text-white">
            <CardContent className="p-6 text-center">
              <Percent className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Hasta 50% OFF</h3>
              <p className="text-red-100">En repuestos seleccionados</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 text-white">
            <CardContent className="p-6 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Flash Sale</h3>
              <p className="text-gray-300">Ofertas por tiempo limitado</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-600 to-yellow-700 border-0 text-white">
            <CardContent className="p-6 text-center">
              <Gift className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Envío Gratis</h3>
              <p className="text-yellow-100">En compras mayores a $50</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            placeholder="Buscar en ofertas..."
            onSearch={handleSearch}
            className="mb-4"
          />
          {currentSearch && (
            <div className="text-center">
              <p className="text-gray-300 mb-2">
                Resultados para: "{currentSearch}"
              </p>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={clearSearch}
                data-testid="clear-search"
              >
                Limpiar búsqueda
              </Button>
            </div>
          )}
        </div>

        {/* Productos en Oferta */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Tag className="h-6 w-6 text-red-500" />
            <h2 className="text-3xl font-bold text-white">Productos en Oferta</h2>
            <Badge className="bg-red-600 text-white">
              {offerProducts.length} ofertas
            </Badge>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-700 aspect-square rounded-lg mb-4"></div>
                <div className="bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-700 h-4 rounded w-2/3 mb-4"></div>
                <div className="bg-gray-700 h-10 rounded"></div>
              </div>
            ))}
          </div>
        ) : offerProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {offerProducts.map((product) => (
              <div key={product.id} className="relative group">
                {/* Badge de oferta */}
                <div className="absolute -top-2 -right-2 z-10 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                  ¡OFERTA!
                </div>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Tag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {currentSearch ? 'No se encontraron ofertas' : 'Próximamente nuevas ofertas'}
            </h3>
            <p className="text-gray-400 mb-6">
              {currentSearch 
                ? `No hay ofertas que coincidan con "${currentSearch}"` 
                : 'Estamos preparando increíbles ofertas para ti'
              }
            </p>
            {currentSearch && (
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={clearSearch}
              >
                Ver todas las ofertas
              </Button>
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-red-600 to-red-700 border-0">
            <CardContent className="p-8">
              <Star className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-4">
                ¿No encuentras lo que buscas?
              </h3>
              <p className="text-red-100 mb-6">
                Contáctanos y te ayudamos a encontrar el repuesto perfecto para tu vehículo
              </p>
              <Button 
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-100 font-semibold"
                data-testid="contact-button"
              >
                Contactar Ahora
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}