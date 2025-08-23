import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useStore } from '@/lib/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, Shield, CheckCircle, ArrowLeft, Car, Bike, 
  Smartphone, Star, Lock, Zap, Crown 
} from 'lucide-react';
import { Link } from 'wouter';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { cart, clearCart, getCartTotal, user, addPoints } = useStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const total = getCartTotal();
  const shipping = total >= 500 ? 0 : 50;
  const finalTotal = total + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || isProcessing) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (error) {
        toast({
          title: "❌ Error en el pago",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Payment succeeded - create order
        const orderData = {
          userId: user?.id || null,
          items: cart.map(item => ({
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          total: finalTotal.toString(),
          paymentMethod: 'card',
          status: 'completed',
          pointsEarned: Math.floor(finalTotal),
        };

        const response = await apiRequest('POST', '/api/orders', orderData);
        const order = await response.json();

        toast({
          title: "🎉 ¡Pago exitoso!",
          description: `Pedido GTR procesado. Puntos ganados: ${order.pointsEarned}`,
        });

        addPoints(order.pointsEarned);
        clearCart();
      }
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: "Hubo un problema procesando el pago",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Información de Pago
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PaymentElement 
            options={{
              layout: 'tabs'
            }}
          />
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-300"
        data-testid="submit-payment"
      >
        {isProcessing ? (
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Procesando pago...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Pagar ${finalTotal.toFixed(2)} GTR
          </div>
        )}
      </Button>

      <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2">
        <Shield className="h-4 w-4" />
        Pago 100% seguro con cifrado SSL
      </div>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const { cart, getCartTotal } = useStore();
  const { toast } = useToast();

  const total = getCartTotal();
  const shipping = total >= 500 ? 0 : 50;
  const finalTotal = total + shipping;

  useEffect(() => {
    if (cart.length === 0) return;

    // Create PaymentIntent as soon as the page loads
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: finalTotal,
      metadata: {
        cart_items: cart.length,
        order_type: 'ecommerce'
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error('Error creating payment intent:', error);
        toast({
          title: "❌ Error",
          description: "No se pudo inicializar el procesador de pagos",
          variant: "destructive",
        });
      });
  }, [cart, finalTotal, toast]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-12 w-12 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Carrito vacío
            </h1>
            <p className="text-gray-600 mb-8">
              Agrega algunos productos antes de proceder al checkout
            </p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Procesando checkout...
              </h1>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20" data-testid="checkout-page">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                🛒 Checkout GTR CUBAUTOS
              </h1>
              <p className="text-blue-100 text-lg">
                Procesamiento seguro de pagos
              </p>
            </div>
            <Badge className="bg-white/20 text-white backdrop-blur-sm px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Pago Seguro
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Payment Form */}
            <div className="space-y-6">
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm />
              </Elements>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Resumen del Pedido GTR
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {item.name.toLowerCase().includes('auto') || item.name.toLowerCase().includes('car') ? <Car className="h-6 w-6" /> :
                             item.name.toLowerCase().includes('moto') || item.name.toLowerCase().includes('bike') ? <Bike className="h-6 w-6" /> :
                             <Smartphone className="h-6 w-6" />}
                          </div>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-600">
                              Cantidad: {item.quantity}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
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
                        <CheckCircle className="h-4 w-4" />
                        ¡Envío gratis por compra mayor a $500!
                      </div>
                    )}
                    <Separator />
                    <div className="flex justify-between text-xl font-bold text-gray-900">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Points Earned */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Crown className="h-5 w-5" />
                      <span className="font-semibold">
                        Ganarás {Math.floor(finalTotal)} puntos GTR
                      </span>
                    </div>
                    <div className="text-sm text-yellow-700 mt-1">
                      Equivalente a ${(Math.floor(finalTotal) * 0.01).toFixed(2)} en descuentos futuros
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Características de Seguridad
                    </h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Cifrado SSL de 256 bits</li>
                      <li>• Procesamiento PCI DSS</li>
                      <li>• Protección contra fraude</li>
                      <li>• Garantía de reembolso</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}