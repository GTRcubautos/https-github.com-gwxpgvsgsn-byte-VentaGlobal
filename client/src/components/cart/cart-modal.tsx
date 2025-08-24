import { useState, useEffect } from 'react';
import { X, Plus, Minus, CreditCard, Smartphone, DollarSign, ShoppingCart, Trash2, Star, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const shipping = total >= 500 ? 0 : 50;
  const finalTotal = total + shipping;

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
        title: "🎉 ¡Compra exitosa!",
        description: `Pedido GTR procesado. Puntos ganados: ${data.pointsEarned}`,
      });
      addPoints(data.pointsEarned);
      clearCart();
      setSelectedPayment('');
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo procesar el pedido GTR",
        variant: "destructive",
      });
    },
  });

  const paymentMethods = [
    { id: 'card', name: 'Tarjeta de Crédito', icon: CreditCard, description: 'Visa, MasterCard, Amex' },
    { id: 'zelle', name: 'Zelle', icon: Smartphone, description: 'Transferencia instantánea' },
    { id: 'paypal', name: 'PayPal', icon: DollarSign, description: 'Pago seguro en línea' },
    { id: 'cash_delivery', name: 'Pago Contra Entrega', icon: DollarSign, description: 'Paga al recibir el producto' },
  ];

  const handleCheckout = () => {
    if (!selectedPayment || cart.length === 0) return;

    // If card payment is selected, redirect to Stripe checkout
    if (selectedPayment === 'card') {
      window.location.href = '/checkout';
      return;
    }

    // For other payment methods, create order directly
    const orderData = {
      userId: user?.id || null,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total: finalTotal.toString(),
      paymentMethod: selectedPayment,
      status: selectedPayment === 'card' ? 'pending' : 'completed',
      pointsEarned: Math.floor(finalTotal),
    };

    createOrderMutation.mutate(orderData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-hidden p-0 bg-white border border-gray-300 shadow-2xl" data-testid="cart-modal">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-gray-900 to-black text-white border-b border-gray-200">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <ShoppingCart className="h-6 w-6" />
                GTR CUBAUTO
                {cart.length > 0 && (
                  <Badge className="bg-red-600 text-white px-2 py-1 text-sm">
                    {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12" data-testid="empty-cart">
                <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="h-8 w-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Carrito vacío</h3>
                <p className="text-gray-600 mb-4">Agrega productos automotrices</p>
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Continuar comprando
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-3">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Productos</h3>
                  {cart.map((item) => (
                    <Card 
                      key={item.id} 
                      className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                      data-testid={`cart-item-${item.id}`}
                    >
                      <CardContent className="p-0">
                        <div className="flex items-center">
                          {/* Product Image */}
                          {item.imageUrl && (
                            <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Product Details */}
                          <div className="flex-1 p-3">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-base text-black" data-testid={`item-name-${item.id}`}>
                                {item.name}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                                data-testid={`remove-item-${item.id}`}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              {/* Quantity Controls */}
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-7 h-7 p-0 border-gray-300 text-gray-600"
                                  data-testid={`decrease-quantity-${item.id}`}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span 
                                  className="w-8 text-center font-semibold text-gray-900 text-sm"
                                  data-testid={`item-quantity-${item.id}`}
                                >
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-7 h-7 p-0 border-gray-300 text-gray-600"
                                  data-testid={`increase-quantity-${item.id}`}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right">
                                <div className="text-xs text-gray-500">
                                  ${item.price.toFixed(2)} c/u
                                </div>
                                <div className="text-lg font-bold text-red-600">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-4 border border-gray-200 shadow-sm bg-white">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-bold text-black mb-4">Resumen</h3>
                      
                      {/* Price Breakdown */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-gray-600 text-sm">
                          <span>Subtotal</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600 text-sm">
                          <span>Envío</span>
                          <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                            {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                          </span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between text-lg font-bold text-black">
                          <span>Total</span>
                          <span className="text-red-600">
                            ${finalTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <div className="mb-4">
                        <h4 className="font-semibold text-black mb-2 text-sm">Método de pago</h4>
                        <div className="space-y-2">
                          {paymentMethods.map((method) => {
                            const IconComponent = method.icon;
                            return (
                              <button
                                key={method.id}
                                onClick={() => setSelectedPayment(method.id)}
                                className={`w-full p-2 rounded border transition-all duration-200 text-left ${
                                  selectedPayment === method.id
                                    ? 'border-red-600 bg-red-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                data-testid={`payment-method-${method.id}`}
                              >
                                <div className="flex items-center gap-2">
                                  <IconComponent className={`h-4 w-4 ${
                                    selectedPayment === method.id ? 'text-red-600' : 'text-gray-600'
                                  }`} />
                                  <div className="flex-1">
                                    <div className={`font-medium text-sm ${
                                      selectedPayment === method.id ? 'text-red-900' : 'text-gray-900'
                                    }`}>
                                      {method.name}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {method.description}
                                    </div>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <Button
                        onClick={handleCheckout}
                        disabled={!selectedPayment || cart.length === 0 || createOrderMutation.isPending}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 shadow-sm hover:shadow-md transition-all duration-200"
                        data-testid="checkout-button"
                      >
                        {createOrderMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Procesando...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Proceder al Pago
                          </div>
                        )}
                      </Button>

                      {/* Security Badge */}
                      <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-500">
                        <Shield className="h-3 w-3" />
                        Pago seguro
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}