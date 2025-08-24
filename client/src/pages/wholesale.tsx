import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/products/product-card';
import SearchBar from '@/components/products/search-bar';
import { openWholesaleModal } from '@/components/wholesale/wholesale-modal';
import { useStore } from '@/lib/store';
import type { Product } from '@shared/schema';

export default function Wholesale() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { isWholesaleUser } = useStore();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ['/api/products', { search: searchQuery }],
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (isWholesaleUser) {
      setIsAuthenticated(true);
    }

    const handleWholesaleAuth = () => {
      setIsAuthenticated(true);
    };

    window.addEventListener('wholesaleAuthenticated', handleWholesaleAuth);
    return () => window.removeEventListener('wholesaleAuthenticated', handleWholesaleAuth);
  }, [isWholesaleUser]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className="py-16 bg-white" data-testid="wholesale-page">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-black mb-2">
          Portal Mayoristas
        </h2>
        <div className="w-20 h-1 bg-red-600 mx-auto mb-12"></div>
        
        {!isAuthenticated ? (
          <div className="text-center mb-8" data-testid="wholesale-access">
            <p className="text-lg text-gray-600 mb-4">
              Acceso exclusivo para clientes mayoristas
            </p>
            <Button
              onClick={openWholesaleModal}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold"
              data-testid="wholesale-access-button"
            >
              Acceder con Código
            </Button>
          </div>
        ) : (
          <div data-testid="wholesale-products">
            {/* Search Bar */}
            <div className="mb-8">
              <SearchBar
                placeholder="Buscar productos mayoristas..."
                onSearch={handleSearch}
                className="mb-4"
              />
            </div>
            
            {/* Price Comparison Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8" data-testid="price-comparison">
              <h3 className="font-bold text-xl mb-4">Comparación de Precios</h3>
              <div className="space-y-4">
                {products.slice(0, 3).map((product) => {
                  const retailPrice = parseFloat(product.retailPrice);
                  const wholesalePrice = parseFloat(product.wholesalePrice);
                  const savings = retailPrice - wholesalePrice;
                  const savingsPercentage = ((savings / retailPrice) * 100).toFixed(1);
                  
                  return (
                    <div key={product.id} className="border-b pb-3">
                      <h4 className="font-semibold" data-testid={`comparison-name-${product.id}`}>
                        {product.name}
                      </h4>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precio Minorista:</span>
                        <span className="text-secondary font-bold" data-testid={`comparison-retail-${product.id}`}>
                          ${retailPrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Precio Mayorista:</span>
                        <span className="text-primary font-bold" data-testid={`comparison-wholesale-${product.id}`}>
                          ${wholesalePrice.toFixed(2)}
                        </span>
                      </div>
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>Ahorro:</span>
                        <span data-testid={`comparison-savings-${product.id}`}>
                          ${savings.toFixed(2)} ({savingsPercentage}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Products Grid */}
            {products.length === 0 ? (
              <div className="text-center py-12" data-testid="no-wholesale-products">
                <i className="fas fa-box text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-500">
                  {searchQuery 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'No hay productos disponibles en este momento'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="wholesale-products-grid">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    showWholesalePrice={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
