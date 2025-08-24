import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import ProductCard from '@/components/products/product-card';
import SearchBar from '@/components/products/search-bar';
import { Button } from '@/components/ui/button';
import type { Product } from '@shared/schema';

export default function Products() {
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const initialSearch = urlParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [currentSearch, setCurrentSearch] = useState(initialSearch);

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products', { category: 'electronics', search: currentSearch }],
  });

  const handleSearch = (query: string) => {
    setCurrentSearch(query);
    setSearchQuery(query);
    
    // Update URL
    if (query) {
      setLocation(`/productos?search=${encodeURIComponent(query)}`);
    } else {
      setLocation('/productos');
    }
  };

  const clearSearch = () => {
    setCurrentSearch('');
    setSearchQuery('');
    setLocation('/productos');
  };

  return (
    <div className="py-16 bg-white dark:bg-black" data-testid="products-page">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-black dark:text-white mb-2">
          Productos Electrónicos
        </h2>
        <div className="w-20 h-1 bg-red-600 mx-auto mb-12"></div>
        
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            placeholder="Buscar en productos..."
            onSearch={handleSearch}
            className="mb-4"
          />
          {currentSearch && (
            <div className="text-center bg-gray-100 dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
              <p className="text-gray-800 dark:text-gray-200 mb-2">
                Resultados para: "{currentSearch}"
              </p>
              <Button
                variant="outline"
                onClick={clearSearch}
                className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                data-testid="clear-search"
              >
                Limpiar búsqueda
              </Button>
            </div>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 aspect-square rounded-lg mb-4"></div>
                <div className="bg-gray-300 h-4 rounded mb-2"></div>
                <div className="bg-gray-300 h-4 rounded w-2/3 mb-4"></div>
                <div className="bg-gray-300 h-10 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12" data-testid="no-products">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
              <i className="fas fa-search text-4xl text-gray-600 dark:text-gray-400"></i>
            </div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
              No se encontraron productos
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {currentSearch 
                ? 'Intenta con otros términos de búsqueda'
                : 'No hay productos disponibles en este momento'
              }
            </p>
            {currentSearch && (
              <Button onClick={clearSearch} className="mt-4 bg-red-600 hover:bg-red-700 text-white">
                Ver todos los productos
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
