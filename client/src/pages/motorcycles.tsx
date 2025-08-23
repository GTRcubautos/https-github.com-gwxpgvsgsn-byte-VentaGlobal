import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import ProductCard from '@/components/products/product-card';
import SearchBar from '@/components/products/search-bar';
import { Button } from '@/components/ui/button';
import type { Product } from '@shared/schema';

export default function Motorcycles() {
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = urlParams.get('search') || '';
  
  const [currentSearch, setCurrentSearch] = useState(initialSearch);

  const { data: motorcycles = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { category: 'motorcycles', search: currentSearch }],
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

  return (
    <div className="py-16 bg-white" data-testid="motorcycles-page">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-secondary mb-2">
          Motos en Venta
        </h2>
        <div className="w-20 h-1 bg-primary mx-auto mb-12"></div>
        
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            placeholder="Buscar motos..."
            onSearch={handleSearch}
            className="mb-4"
          />
          {currentSearch && (
            <div className="text-center">
              <p className="text-gray-600 mb-2">
                Resultados para: "{currentSearch}"
              </p>
              <Button
                variant="outline"
                onClick={clearSearch}
                data-testid="clear-search"
              >
                Limpiar búsqueda
              </Button>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 aspect-video rounded-lg mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-2/3 mb-4"></div>
                <div className="bg-gray-300 h-10 rounded"></div>
              </div>
            ))}
          </div>
        ) : motorcycles.length === 0 ? (
          <div className="text-center py-12" data-testid="no-motorcycles">
            <i className="fas fa-motorcycle text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No se encontraron motos
            </h3>
            <p className="text-gray-500">
              {currentSearch 
                ? 'Intenta con otros términos de búsqueda'
                : 'No hay motos disponibles en este momento'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="motorcycles-grid">
            {motorcycles.map((motorcycle) => (
              <div key={motorcycle.id} className="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                <div className="aspect-video overflow-hidden rounded-t-lg">
                  <img
                    src={motorcycle.imageUrl || 'https://via.placeholder.com/500x300'}
                    alt={motorcycle.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    data-testid={`motorcycle-image-${motorcycle.id}`}
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2" data-testid={`motorcycle-name-${motorcycle.id}`}>
                    {motorcycle.name}
                  </h3>
                  {motorcycle.specs && (
                    <p className="text-gray-600 mb-4" data-testid={`motorcycle-specs-${motorcycle.id}`}>
                      {typeof motorcycle.specs === 'object' && motorcycle.specs !== null ? 
                        Object.values(motorcycle.specs as Record<string, any>).join(', ') : 
                        String(motorcycle.specs)}
                    </p>
                  )}
                  <ProductCard product={motorcycle} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
