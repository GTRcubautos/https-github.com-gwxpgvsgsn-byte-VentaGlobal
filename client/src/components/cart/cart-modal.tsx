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
    { id: 'card', name: 'Tarjeta de Crédito', icon: CreditCard, description: 'Visa, MasterCard, Amex (Stripe)' },
    { id: 'zelle', name: 'Zelle', icon: Smartphone, description: 'Transferencia instantánea' },
    { id: 'paypal', name: 'PayPal', icon: DollarSign, description: 'Pago seguro en línea' },
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
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0 bg-gradient-to-br from-white to-gray-50" data-testid="cart-modal">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white">
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold flex items-center gap-3">
                <ShoppingCart className="h-8 w-8" />
                Carrito GTR CUBAUTOS
                {cart.length > 0 && (
                  <Badge className="bg-white/20 text-white backdrop-blur-sm px-3 py-1">
                    {cart.length} {cart.length === 1 ? 'artículo' : 'artículos'}
                  </Badge>
                )}
              </DialogTitle>
            </DialogHeader>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div className="text-center py-16" data-testid="empty-cart">
                <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="h-12 w-12 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">Tu carrito está vacío</h3>
                <p className="text-gray-500 mb-6">¡Descubre nuestros vehículos premium y tecnología de vanguardia!</p>
                <Button 
                  onClick={() => setIsOpen(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  Continuar comprando
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Productos en tu carrito</h3>
                  {cart.map((item) => (
                    <Card 
                      key={item.id} 
                      className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
                      data-testid={`cart-item-${item.id}`}
                    >
                      <CardContent className="p-0">
                        <div className="flex items-center">
                          {/* Product Image */}
                          {item.imageUrl && (
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          )}
                          
                          {/* Product Details */}
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-lg text-gray-900" data-testid={`item-name-${item.id}`}>
                                {item.name}
                              </h4>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-1"
                                data-testid={`remove-item-${item.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
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
                                  className="w-8 h-8 p-0 border-gray-300"
                                  data-testid={`decrease-quantity-${item.id}`}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span 
                                  className="w-12 text-center font-semibold text-gray-900"
                                  data-testid={`item-quantity-${item.id}`}
                                >
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  className="w-8 h-8 p-0 border-gray-300"
                                  data-testid={`increase-quantity-${item.id}`}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              
                              {/* Price */}
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  ${item.price.toFixed(2)} c/u
                                </div>
                                <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
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
                  <Card className="sticky top-4 border-0 shadow-xl bg-gradient-to-br from-white to-gray-50">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">Resumen del pedido</h3>
                      
                      {/* Price Breakdown */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Envío</span>
                          <span className={shipping === 0 ? 'text-green-600 font-semibold' : ''}>
                            {shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}
                          </span>
                        </div>
                        {shipping === 0 && (
                          <div className="flex items-center gap-2 text-green-600 text-sm">
                            <Shield className="h-4 w-4" />
                            ¡Envío gratis por compra mayor a $500!
                          </div>
                        )}
                        <hr className="border-gray-200" />
                        <div className="flex justify-between text-xl font-bold text-gray-900">
                          <span>Total</span>
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            ${finalTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Payment Methods */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Método de pago</h4>
                        <div className="space-y-2">
                          {paymentMethods.map((method) => {
                            const IconComponent = method.icon;
                            return (
                              <button
                                key={method.id}
                                onClick={() => setSelectedPayment(method.id)}
                                className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                                  selectedPayment === method.id
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                data-testid={`payment-method-${method.id}`}
                              >
                                <div className="flex items-center gap-3">
                                  <IconComponent className={`h-5 w-5 ${
                                    selectedPayment === method.id ? 'text-blue-600' : 'text-gray-600'
                                  }`} />
                                  <div className="text-left flex-1">
                                    <div className={`font-medium ${
                                      selectedPayment === method.id ? 'text-blue-900' : 'text-gray-900'
                                    }`}>
                                      {method.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
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
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                        data-testid="checkout-button"
                      >
                        {createOrderMutation.isPending ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Procesando...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5" />
                            Proceder al Pago GTR
                          </div>
                        )}
                      </Button>

                      {/* Security Badge */}
                      <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <Shield className="h-4 w-4" />
                        Pago 100% seguro y protegido
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