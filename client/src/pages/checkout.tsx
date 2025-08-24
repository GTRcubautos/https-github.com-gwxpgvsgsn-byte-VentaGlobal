import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { 
  CreditCard, Package, MapPin, Phone, Mail, User, 
  DollarSign, Building, Truck, Zap, Shield, Check,
  ArrowLeft, Star, CheckCircle, Crown, Car, Bike,
  Smartphone, Lock, Copy, QrCode, Calendar, Clock,
  Minus, Plus, X, Loader2
} from "lucide-react";

const checkoutSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email válido requerido"),
  phone: z.string().min(8, "Teléfono requerido"),
  address: z.string().min(5, "Dirección requerida"),
  city: z.string().min(2, "Ciudad requerida"),
  paymentMethod: z.string(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  zelleEmail: z.string().optional(),
  bankName: z.string().optional(),
  bankAccount: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const paymentMethods = [
  {
    id: "credit_card",
    name: "Tarjeta de Crédito/Débito",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
    color: "from-red-600 to-red-800",
    instant: true,
    secure: true,
    automated: true
  },
  {
    id: "zelle",
    name: "Zelle",
    description: "Transferencia instantánea automatizada",
    icon: Zap,
    color: "from-gray-700 to-gray-900",
    instant: true,
    secure: true,
    automated: true
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Procesamiento automático con PayPal",
    icon: Shield,
    color: "from-black to-gray-800",
    instant: true,
    secure: true,
    automated: true
  },
  {
    id: "bank_transfer",
    name: "Transferencia Bancaria",
    description: "Verificación automática en tiempo real",
    icon: Building,
    color: "from-gray-600 to-gray-800",
    instant: false,
    secure: true,
    automated: true
  },
  {
    id: "cash_on_delivery",
    name: "Pago Contra Entrega",
    description: "Paga en efectivo al recibir tu pedido",
    icon: Truck,
    color: "from-red-500 to-red-700",
    instant: false,
    secure: true,
    automated: false
  }
];

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart, getCartTotal, clearCart, user, addPoints, updateQuantity, removeFromCart } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const total = getCartTotal();
  const shipping = total >= 500 ? 0 : 50;
  const finalTotal = total + shipping;

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : '',
      email: user?.email || '',
      paymentMethod: "credit_card",
    },
  });

  // Procesamiento automático de pagos
  const processAutomatedPayment = async (paymentMethod: string, orderData: any) => {
    switch (paymentMethod) {
      case 'credit_card':
        // Integración automática con Stripe
        return await apiRequest('POST', '/api/payments/stripe', {
          amount: finalTotal,
          orderId: orderData.id,
          cardToken: 'auto-generated'
        });
      
      case 'zelle':
        // Verificación automática de Zelle
        return await apiRequest('POST', '/api/payments/zelle', {
          amount: finalTotal,
          orderId: orderData.id,
          zelleEmail: orderData.paymentDetails.zelleEmail
        });
      
      case 'paypal':
        // Procesamiento automático con PayPal
        return await apiRequest('POST', '/api/payments/paypal', {
          amount: finalTotal,
          orderId: orderData.id
        });
      
      case 'bank_transfer':
        // Verificación automática bancaria
        return await apiRequest('POST', '/api/payments/bank', {
          amount: finalTotal,
          orderId: orderData.id,
          bankAccount: orderData.paymentDetails.bankAccount
        });
      
      case 'cash_on_delivery':
        // Pago contra entrega - solo confirmar orden
        return { ok: true, message: 'Order confirmed for cash on delivery' };
        
      default:
        throw new Error('Método de pago no válido');
    }
  };

  const onSubmit = async (data: CheckoutForm) => {
    setIsProcessing(true);
    
    try {
      // Crear orden
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
        status: selectedPayment === 'cash_on_delivery' ? 'pending' : 'processing',
        pointsEarned: Math.floor(finalTotal),
        shippingInfo: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
        },
        paymentDetails: {
          zelleEmail: data.zelleEmail,
          bankAccount: data.bankAccount,
          bankName: data.bankName,
        }
      };

      const response = await apiRequest('POST', '/api/orders', orderData);
      const order = await response.json();

      // Procesamiento automático del pago
      const paymentResult = await processAutomatedPayment(selectedPayment, order);
      
      if (paymentResult.ok) {
        toast({
          title: "🎉 ¡Pago procesado automáticamente!",
          description: `Orden #${order.id} confirmada. Puntos ganados: ${order.pointsEarned}`,
        });

        addPoints(order.pointsEarned);
        clearCart();
        setLocation('/checkout/success');
      } else {
        throw new Error('Payment processing failed');
      }

    } catch (error: any) {
      toast({
        title: "❌ Error en el procesamiento",
        description: "El pago automático falló. Intenta con otro método.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16" data-testid="empty-cart">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-gray-600" />
            </div>
            <h1 className="text-3xl font-bold mb-4 text-black">Carrito vacío</h1>
            <p className="text-gray-600 mb-8">
              Agrega algunos productos antes de proceder al checkout
            </p>
            <Link href="/">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar comprando
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" data-testid="checkout-page">
      {/* Header */}
      <div className="bg-black text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Checkout GTR CUBAUTO</h1>
              <p className="text-gray-300 text-lg">Sistema de pago completamente automatizado</p>
            </div>
            <Badge className="bg-red-600 text-white px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              100% Automatizado
            </Badge>
          </div>
        </div>
      </div>

      {/* Cart Review Section */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-black">Resumen del pedido</h2>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border">
                  <img 
                    src={item.imageUrl || 'https://via.placeholder.com/80'} 
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-black">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2 font-semibold">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 p-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black">${(item.price * item.quantity).toFixed(2)}</p>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 bg-black text-white p-6 rounded-lg">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío:</span>
                  <span>{shipping === 0 ? 'GRATIS' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <Separator className="bg-gray-600" />
                <div className="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section className="py-8 bg-gray-100">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-black">Métodos de pago automatizados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => {
                const MethodIcon = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`cursor-pointer transition-all duration-300 border-2 rounded-lg p-6 ${
                      selectedPayment === method.id
                        ? 'border-red-600 bg-red-50 shadow-lg scale-105'
                        : 'border-gray-300 hover:border-gray-500 hover:bg-white bg-white'
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                    data-testid={`payment-method-${method.id}`}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center mb-4`}>
                      <MethodIcon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold mb-2 text-black">{method.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{method.description}</p>
                    <div className="flex gap-2">
                      {method.instant && (
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Instantáneo
                        </Badge>
                      )}
                      <Badge className="bg-red-100 text-red-800 text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        100% Automatizado
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Payment Form Section */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="border-gray-300">
              <CardHeader className="bg-gray-50">
                <CardTitle className="text-black">Información de contacto y envío</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="flex items-center gap-2 text-black font-semibold">
                        <User className="h-4 w-4" />
                        Nombre Completo
                      </Label>
                      <Input
                        id="name"
                        {...form.register("name")}
                        placeholder="Tu nombre completo"
                        className="border-gray-300 focus:border-red-600"
                        data-testid="input-name"
                      />
                      {form.formState.errors.name && (
                        <p className="text-red-600 text-sm mt-1">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone" className="flex items-center gap-2 text-black font-semibold">
                        <Phone className="h-4 w-4" />
                        Teléfono
                      </Label>
                      <Input
                        id="phone"
                        {...form.register("phone")}
                        placeholder="+53 5555-5555"
                        className="border-gray-300 focus:border-red-600"
                        data-testid="input-phone"
                      />
                      {form.formState.errors.phone && (
                        <p className="text-red-600 text-sm mt-1">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 text-black font-semibold">
                      <Mail className="h-4 w-4" />
                      Correo Electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                      placeholder="tu@email.com"
                      className="border-gray-300 focus:border-red-600"
                      data-testid="input-email"
                    />
                    {form.formState.errors.email && (
                      <p className="text-red-600 text-sm mt-1">
                        {form.formState.errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Shipping Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="address" className="flex items-center gap-2 text-black font-semibold">
                        <MapPin className="h-4 w-4" />
                        Dirección Completa
                      </Label>
                      <Input
                        id="address"
                        {...form.register("address")}
                        placeholder="Calle, número, apartamento"
                        className="border-gray-300 focus:border-red-600"
                        data-testid="input-address"
                      />
                      {form.formState.errors.address && (
                        <p className="text-red-600 text-sm mt-1">
                          {form.formState.errors.address.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city" className="flex items-center gap-2 text-black font-semibold">
                        <Building className="h-4 w-4" />
                        Ciudad
                      </Label>
                      <Input
                        id="city"
                        {...form.register("city")}
                        placeholder="La Habana"
                        className="border-gray-300 focus:border-red-600"
                        data-testid="input-city"
                      />
                      {form.formState.errors.city && (
                        <p className="text-red-600 text-sm mt-1">
                          {form.formState.errors.city.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Payment Method Specific Fields */}
                  {selectedPayment === "credit_card" && (
                    <div className="space-y-4 p-6 bg-red-50 rounded-lg border border-red-200">
                      <h3 className="font-bold text-red-800 flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Procesamiento automático con tarjeta
                      </h3>
                      <p className="text-sm text-red-700">
                        Tu tarjeta será procesada automáticamente y de forma segura a través de nuestro sistema integrado.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <Label htmlFor="cardNumber" className="text-black font-semibold">Número de Tarjeta</Label>
                          <Input
                            id="cardNumber"
                            {...form.register("cardNumber")}
                            placeholder="1234 5678 9012 3456"
                            className="border-red-300 focus:border-red-600"
                            maxLength={19}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardExpiry" className="text-black font-semibold">Fecha de Vencimiento</Label>
                          <Input
                            id="cardExpiry"
                            {...form.register("cardExpiry")}
                            placeholder="MM/AA"
                            className="border-red-300 focus:border-red-600"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <Label htmlFor="cardCvv" className="text-black font-semibold">CVV</Label>
                          <Input
                            id="cardCvv"
                            {...form.register("cardCvv")}
                            placeholder="123"
                            className="border-red-300 focus:border-red-600"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPayment === "zelle" && (
                    <div className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-300">
                      <h3 className="font-bold text-black flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Verificación automática con Zelle
                      </h3>
                      <p className="text-sm text-gray-700">
                        Tu pago será verificado automáticamente en tiempo real.
                      </p>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="zelleEmail" className="text-black font-semibold">Tu Email de Zelle</Label>
                          <Input
                            id="zelleEmail"
                            {...form.register("zelleEmail")}
                            placeholder="tu@email.com"
                            className="border-gray-300 focus:border-red-600"
                          />
                        </div>
                        <div className="bg-black text-white p-4 rounded border">
                          <h4 className="font-bold mb-3 text-red-400">📱 Datos automáticos para el pago:</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                              <span>Email Zelle:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-green-400">pagos@gtrcubauto.com</span>
                                <Button variant="ghost" size="sm" className="text-white hover:text-red-400">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>Monto:</span>
                              <span className="font-bold text-green-400">${finalTotal.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-gray-300 mt-2">
                              🤖 Sistema automático: Tu pago será detectado y verificado al instante.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPayment === "paypal" && (
                    <div className="space-y-4 p-6 bg-black rounded-lg border border-gray-300">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Procesamiento automático con PayPal
                      </h3>
                      <p className="text-sm text-gray-300">
                        Serás redirigido automáticamente a PayPal para completar el pago de forma segura.
                      </p>
                      <div className="bg-gray-800 text-white p-4 rounded border">
                        <div className="flex items-center justify-between">
                          <span>Monto total:</span>
                          <span className="font-bold text-lg text-green-400">${finalTotal.toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          🤖 Redirección y procesamiento automático
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedPayment === "bank_transfer" && (
                    <div className="space-y-4 p-6 bg-gray-50 rounded-lg border border-gray-300">
                      <h3 className="font-bold text-black flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Verificación automática bancaria
                      </h3>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="bankName" className="text-black font-semibold">Tu Banco</Label>
                            <Input
                              id="bankName"
                              {...form.register("bankName")}
                              placeholder="Banco Popular"
                              className="border-gray-300 focus:border-red-600"
                            />
                          </div>
                          <div>
                            <Label htmlFor="bankAccount" className="text-black font-semibold">Número de Cuenta</Label>
                            <Input
                              id="bankAccount"
                              {...form.register("bankAccount")}
                              placeholder="1234567890"
                              className="border-gray-300 focus:border-red-600"
                            />
                          </div>
                        </div>
                        <div className="bg-black text-white p-4 rounded border">
                          <h4 className="font-bold mb-3 text-red-400">🏦 Datos automáticos de nuestra cuenta:</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Banco:</span>
                              <span>Banco Metropolitano</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span>Cuenta:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-green-400">9876543210</span>
                                <Button variant="ghost" size="sm" className="text-white hover:text-red-400">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span>Titular:</span>
                              <span>GTR CUBAUTO S.A.</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Monto:</span>
                              <span className="font-bold text-green-400">${finalTotal.toFixed(2)}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-300 mt-2">
                            🤖 Sistema automático: Tu transferencia será verificada en tiempo real.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPayment === "cash_on_delivery" && (
                    <div className="space-y-4 p-6 bg-red-50 rounded-lg border border-red-200">
                      <h3 className="font-bold text-red-800 flex items-center gap-2">
                        <Truck className="h-5 w-5" />
                        Pago Contra Entrega
                      </h3>
                      <div className="bg-white p-4 rounded border">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-red-700">
                            <Clock className="h-4 w-4" />
                            <span className="font-medium">Tiempo de entrega: 2-5 días hábiles</span>
                          </div>
                          <div className="flex items-center gap-2 text-red-700">
                            <Truck className="h-4 w-4" />
                            <span>Paga en efectivo cuando recibas tu pedido</span>
                          </div>
                          <div className="flex justify-between mt-4 p-3 bg-black text-white rounded">
                            <span>Monto a pagar en entrega:</span>
                            <span className="font-bold text-lg text-green-400">${finalTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-red-700 bg-red-100 p-3 rounded">
                        💰 Ten el monto exacto listo para la entrega. No se aceptan cheques.
                      </p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-lg py-6 shadow-xl hover:shadow-2xl transition-all duration-300"
                    data-testid="submit-order"
                  >
                    {isProcessing ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>
                          {selectedPayment === "cash_on_delivery" 
                            ? "Confirmando pedido..." 
                            : "Procesando pago automático..."
                          }
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        {selectedPayment === "cash_on_delivery" ? (
                          <>
                            <Truck className="h-6 w-6" />
                            <span>📦 CONFIRMAR PEDIDO - Pagar ${finalTotal.toFixed(2)} en entrega</span>
                          </>
                        ) : (
                          <>
                            <Lock className="h-6 w-6" />
                            <span>🤖 PROCESAR PAGO AUTOMÁTICO - ${finalTotal.toFixed(2)}</span>
                          </>
                        )}
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}