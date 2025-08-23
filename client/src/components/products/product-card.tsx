import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@shared/schema';

interface ProductCardProps {
  product: Product;
  showWholesalePrice?: boolean;
}

export default function ProductCard({ product, showWholesalePrice = false }: ProductCardProps) {
  const { addToCart, isWholesaleUser, addPoints } = useStore();
  const { toast } = useToast();

  const retailPrice = parseFloat(product.retailPrice);
  const wholesalePrice = parseFloat(product.wholesalePrice);
  const savings = retailPrice - wholesalePrice;
  const savingsPercentage = ((savings / retailPrice) * 100).toFixed(1);

  const handleAddToCart = () => {
    addToCart(product, isWholesaleUser);
    addPoints(5); // Award 5 points for adding to cart
    
    toast({
      title: "Producto agregado",
      description: `${product.name} agregado al carrito. +5 puntos`,
    });
  };

  return (
    <Card className="hover:shadow-xl transition-shadow" data-testid={`product-card-${product.id}`}>
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <img
          src={product.imageUrl || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          data-testid={`product-image-${product.id}`}
        />
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-2" data-testid={`product-name-${product.id}`}>
          {product.name}
        </h3>
        
        {showWholesalePrice ? (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Precio Minorista:</span>
              <span className="text-secondary font-bold" data-testid={`retail-price-${product.id}`}>
                ${retailPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Precio Mayorista:</span>
              <span className="text-primary font-bold" data-testid={`wholesale-price-${product.id}`}>
                ${wholesalePrice.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-green-600 font-bold">
              <span>Ahorro:</span>
              <span data-testid={`savings-${product.id}`}>
                ${savings.toFixed(2)} ({savingsPercentage}%)
              </span>
            </div>
          </div>
        ) : (
          <div className="flex justify-between items-center mb-4">
            <span className="text-secondary font-bold text-xl" data-testid={`price-${product.id}`}>
              ${retailPrice.toFixed(2)}
            </span>
            {isWholesaleUser && (
              <span className="text-primary font-bold text-sm" data-testid={`wholesale-badge-${product.id}`}>
                Mayorista: ${wholesalePrice.toFixed(2)}
              </span>
            )}
          </div>
        )}

        {product.description && (
          <p className="text-gray-600 text-sm mb-4" data-testid={`product-description-${product.id}`}>
            {product.description}
          </p>
        )}

        <Button
          onClick={handleAddToCart}
          className="w-full bg-secondary hover:bg-primary text-white transition-colors"
          data-testid={`add-to-cart-${product.id}`}
        >
          Agregar al Carrito
        </Button>
      </CardContent>
    </Card>
  );
}
