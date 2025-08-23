import { useState, useEffect } from 'react';
import { X, CreditCard, Smartphone, DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

export default function CartModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal,
    selectedPayment,
    setSelectedPayment,
    user,
    addPoints
  } = useStore();

  const total = getCartTotal();

  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true);
    window.addEventListener('openCart', handleOpenCart);
    return () => window.removeEventListener('openCart', handleOpenCart);
  }, []);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "¡Compra exitosa!",
        description: `Pedido procesado. Puntos ganados: ${data.pointsEarned}`,
      });
      addPoints(data.pointsEarned);
      clearCart();
      setSelectedPayment(null);
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo procesar el pedido",
        variant: "destructive",
      });
    },
  });

  const paymentMethods = [
    { id: 'card', name: 'Tarjeta', icon: CreditCard },
    { id: 'zelle', name: 'Zelle', icon: Smartphone },
    { id: 'paypal', name: 'PayPal', icon: DollarSign },
  ];

  const handleCheckout = () => {
    if (!selectedPayment || cart.length === 0) return;

    const orderData = {
      userId: user?.id || null,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: total.toString(),
      paymentMethod: selectedPayment,
      status: 'completed',
      pointsEarned: Math.floor(total),
    };

    createOrderMutation.mutate(orderData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="cart-modal">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-secondary">
            Carrito de Compras
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 py-8" data-testid="empty-cart">
              <i className="fas fa-shopping-cart text-4xl mb-4"></i>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div 
                  key={item.id} 
                  className="flex justify-between items-center bg-gray-50 p-4 rounded-lg"
                  data-testid={`cart-item-${item.id}`}
                >
                  <div className="flex items-center space-x-4">
                    {item.imageUrl && (
                      <img 
                        src={item.imageUrl} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h4 className="font-semibold" data-testid={`item-name-${item.id}`}>
                        {item.name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          data-testid={`decrease-quantity-${item.id}`}
                        >
                          -
                        </Button>
                        <span className="px-3" data-testid={`quantity-${item.id}`}>
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          data-testid={`increase-quantity-${item.id}`}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold" data-testid={`item-price-${item.id}`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                      data-testid={`remove-item-${item.id}`}
                    >
                      <i className="fas fa-trash"></i>
                    </Button>
                  </div>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xl font-bold">Total:</span>
                  <span className="text-xl font-bold text-primary" data-testid="cart-total">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <h3 className="font-semibold">Método de Pago:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {paymentMethods.map((method) => {
                      const Icon = method.icon;
                      return (
                        <Button
                          key={method.id}
                          variant={selectedPayment === method.id ? "default" : "outline"}
                          className="p-4 h-auto"
                          onClick={() => setSelectedPayment(method.id)}
                          data-testid={`payment-${method.id}`}
                        >
                          <div className="text-center">
                            <Icon className="h-6 w-6 mx-auto mb-2" />
                            <div>{method.name}</div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>

                <Button
                  onClick={handleCheckout}
                  disabled={!selectedPayment || cart.length === 0 || createOrderMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90"
                  data-testid="checkout-button"
                >
                  {createOrderMutation.isPending ? "Procesando..." : "Proceder al Pago"}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
