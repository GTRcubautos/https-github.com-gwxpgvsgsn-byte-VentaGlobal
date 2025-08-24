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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { 
  CreditCard, Package, MapPin, Phone, Mail, User, 
  DollarSign, Building, Truck, Zap, Shield, Check,
  ArrowLeft, Star, CheckCircle, Crown, Car, Bike,
  Smartphone, Lock, Copy, QrCode, Calendar, Clock
} from "lucide-react";

const checkoutSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email válido requerido"),
  phone: z.string().min(10, "Teléfono válido requerido"),
  address: z.string().min(10, "Dirección completa requerida"),
  city: z.string().min(2, "Ciudad requerida"),
  paymentMethod: z.enum(["credit_card", "zelle", "paypal", "bank_transfer", "cash_on_delivery"]),
  // Campos específicos por método de pago
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  zelleEmail: z.string().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const paymentMethods = [
  {
    id: "credit_card",
    name: "Tarjeta de Crédito/Débito",
    description: "Visa, Mastercard, American Express",
    icon: CreditCard,
    color: "from-blue-500 to-blue-700",
    instant: true,
    secure: true
  },
  {
    id: "zelle",
    name: "Zelle",
    description: "Transferencia instantánea segura",
    icon: Zap,
    color: "from-purple-500 to-purple-700",
    instant: true,
    secure: true
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Pago rápido y seguro con PayPal",
    icon: Shield,
    color: "from-indigo-500 to-indigo-700",
    instant: true,
    secure: true
  },
  {
    id: "bank_transfer",
    name: "Transferencia Bancaria",
    description: "Transferencia directa a nuestra cuenta",
    icon: Building,
    color: "from-green-500 to-green-700",
    instant: false,
    secure: true
  },
  {
    id: "cash_on_delivery",
    name: "Pago Contra Entrega",
    description: "Paga cuando recibas tu pedido",
    icon: Truck,
    color: "from-orange-500 to-orange-700",
    instant: false,
    secure: true
  }
];

export default function Checkout() {
  const [selectedPayment, setSelectedPayment] = useState("credit_card");
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart, getCartTotal, clearCart, user, addPoints } = useStore();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const total = getCartTotal();
  const shipping = total >= 500 ? 0 : 50;
  const finalTotal = total + shipping;

  const form = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      paymentMethod: "credit_card",
    },
  });

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
        paymentMethod: data.paymentMethod,
        status: data.paymentMethod === 'cash_on_delivery' ? 'pending' : 'processing',
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

      toast({
        title: "🎉 ¡Pedido creado exitosamente!",
        description: `Orden #${order.id} procesada. Puntos ganados: ${order.pointsEarned}`,
      });

      addPoints(order.pointsEarned);
      clearCart();
      setLocation('/checkout/success');

    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: "Hubo un problema procesando el pedido",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16" data-testid="empty-cart">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Package className="h-12 w-12 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Carrito vacío</h1>
            <p className="text-muted-foreground mb-8">
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

  return (
    <div className="min-h-screen bg-background" data-testid="checkout-page">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Checkout GTR CUBAUTO</h1>
              <p className="text-blue-100 text-lg">Múltiples opciones de pago seguro</p>
            </div>
            <Badge className="bg-white/20 text-white backdrop-blur-sm px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              Pago Seguro
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Payment Methods */}
            <div className="lg:col-span-2 space-y-6">
              {/* Payment Method Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Selecciona Método de Pago
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map((method) => {
                      const MethodIcon = method.icon;
                      return (
                        <div
                          key={method.id}
                          className={`cursor-pointer transition-all duration-300 border-2 rounded-lg p-4 ${
                            selectedPayment === method.id
                              ? 'border-primary bg-primary/5 shadow-lg scale-105'
                              : 'border-border hover:border-primary/50 hover:bg-accent'
                          }`}
                          onClick={() => setSelectedPayment(method.id)}
                          data-testid={`payment-method-${method.id}`}
                        >
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${method.color} flex items-center justify-center mb-3`}>
                            <MethodIcon className="h-6 w-6 text-white" />
                          </div>
                          <h3 className="font-semibold mb-1">{method.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                          <div className="flex gap-2">
                            {method.instant && (
                              <Badge variant="secondary" className="text-xs">
                                <Zap className="h-3 w-3 mr-1" />
                                Instantáneo
                              </Badge>
                            )}
                            {method.secure && (
                              <Badge variant="secondary" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Seguro
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Información de Pago y Envío</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          Nombre Completo
                        </Label>
                        <Input
                          id="name"
                          {...form.register("name")}
                          placeholder="Tu nombre completo"
                          data-testid="input-name"
                        />
                        {form.formState.errors.name && (
                          <p className="text-destructive text-sm mt-1">
                            {form.formState.errors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Teléfono
                        </Label>
                        <Input
                          id="phone"
                          {...form.register("phone")}
                          placeholder="+53 5555-5555"
                          data-testid="input-phone"
                        />
                        {form.formState.errors.phone && (
                          <p className="text-destructive text-sm mt-1">
                            {form.formState.errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Correo Electrónico
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...form.register("email")}
                        placeholder="tu@email.com"
                        data-testid="input-email"
                      />
                      {form.formState.errors.email && (
                        <p className="text-destructive text-sm mt-1">
                          {form.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Shipping Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="address" className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Dirección Completa
                        </Label>
                        <Input
                          id="address"
                          {...form.register("address")}
                          placeholder="Calle, número, apartamento"
                          data-testid="input-address"
                        />
                        {form.formState.errors.address && (
                          <p className="text-destructive text-sm mt-1">
                            {form.formState.errors.address.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="city" className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          Ciudad
                        </Label>
                        <Input
                          id="city"
                          {...form.register("city")}
                          placeholder="La Habana"
                          data-testid="input-city"
                        />
                        {form.formState.errors.city && (
                          <p className="text-destructive text-sm mt-1">
                            {form.formState.errors.city.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Payment Method Specific Fields */}
                    {selectedPayment === "credit_card" && (
                      <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-semibold text-blue-800">Información de la Tarjeta</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                            <Input
                              id="cardNumber"
                              {...form.register("cardNumber")}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardExpiry">Fecha de Vencimiento</Label>
                            <Input
                              id="cardExpiry"
                              {...form.register("cardExpiry")}
                              placeholder="MM/AA"
                              maxLength={5}
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardCvv">CVV</Label>
                            <Input
                              id="cardCvv"
                              {...form.register("cardCvv")}
                              placeholder="123"
                              maxLength={4}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPayment === "zelle" && (
                      <div className="space-y-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h3 className="font-semibold text-purple-800">Pago con Zelle</h3>
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor="zelleEmail">Tu Email de Zelle</Label>
                            <Input
                              id="zelleEmail"
                              {...form.register("zelleEmail")}
                              placeholder="tu@email.com"
                            />
                          </div>
                          <div className="bg-white p-4 rounded border">
                            <h4 className="font-medium mb-2">Datos para el pago:</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Email Zelle:</span>
                                <span className="font-mono">pagos@gtrcubauto.com</span>
                                <Button variant="ghost" size="sm">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex justify-between">
                                <span>Monto:</span>
                                <span className="font-bold">${finalTotal.toFixed(2)}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-2">
                                Envía el pago y luego completa el pedido. Tu orden será procesada automáticamente.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPayment === "paypal" && (
                      <div className="space-y-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                        <h3 className="font-semibold text-indigo-800">Pago con PayPal</h3>
                        <p className="text-sm text-indigo-700">
                          Serás redirigido a PayPal para completar el pago de forma segura.
                        </p>
                        <div className="bg-white p-4 rounded border">
                          <div className="flex items-center justify-between">
                            <span>Monto total:</span>
                            <span className="font-bold text-lg">${finalTotal.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPayment === "bank_transfer" && (
                      <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="font-semibold text-green-800">Transferencia Bancaria</h3>
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="bankName">Tu Banco</Label>
                              <Input
                                id="bankName"
                                {...form.register("bankName")}
                                placeholder="Banco Popular"
                              />
                            </div>
                            <div>
                              <Label htmlFor="bankAccount">Número de Cuenta</Label>
                              <Input
                                id="bankAccount"
                                {...form.register("bankAccount")}
                                placeholder="1234567890"
                              />
                            </div>
                          </div>
                          <div className="bg-white p-4 rounded border">
                            <h4 className="font-medium mb-2">Datos de nuestra cuenta:</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span>Banco:</span>
                                <span>Banco Metropolitano</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Cuenta:</span>
                                <span className="font-mono">9876543210</span>
                                <Button variant="ghost" size="sm">
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex justify-between">
                                <span>Titular:</span>
                                <span>GTR CUBAUTO S.A.</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Monto:</span>
                                <span className="font-bold">${finalTotal.toFixed(2)}</span>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                              Procesa tu transferencia y envíanos el comprobante. Tu pedido será verificado en 24 horas.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPayment === "cash_on_delivery" && (
                      <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <h3 className="font-semibold text-orange-800">Pago Contra Entrega</h3>
                        <div className="bg-white p-4 rounded border">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-orange-700">
                              <Clock className="h-4 w-4" />
                              <span className="font-medium">Tiempo de entrega: 2-5 días hábiles</span>
                            </div>
                            <div className="flex items-center gap-2 text-orange-700">
                              <Truck className="h-4 w-4" />
                              <span>Paga en efectivo al recibir tu pedido</span>
                            </div>
                            <div className="flex justify-between mt-3">
                              <span>Monto a pagar en entrega:</span>
                              <span className="font-bold text-lg">${finalTotal.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-orange-700">
                          Ten el monto exacto listo para la entrega. No se aceptan cheques.
                        </p>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      disabled={isProcessing}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                      data-testid="submit-order"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Procesando pedido...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Lock className="h-5 w-5" />
                          {selectedPayment === "cash_on_delivery" 
                            ? `Confirmar Pedido - Pagar $${finalTotal.toFixed(2)} en entrega`
                            : `Procesar Pago $${finalTotal.toFixed(2)}`
                          }
                        </div>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order Summary */}
            <div className="space-y-6">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    Resumen del Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Cart Items */}
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 bg-accent rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                            {item.name.toLowerCase().includes('auto') || item.name.toLowerCase().includes('car') ? <Car className="h-5 w-5" /> :
                             item.name.toLowerCase().includes('moto') || item.name.toLowerCase().includes('bike') ? <Bike className="h-5 w-5" /> :
                             <Smartphone className="h-5 w-5" />}
                          </div>
                          <div>
                            <div className="font-medium text-sm">{item.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Qty: {item.quantity}
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
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
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
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${finalTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Points Earned */}
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                      <Crown className="h-5 w-5" />
                      <span className="font-semibold">
                        Ganarás {Math.floor(finalTotal)} puntos GTR
                      </span>
                    </div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Equivalente a ${(Math.floor(finalTotal) * 0.01).toFixed(2)} en descuentos futuros
                    </div>
                  </div>

                  {/* Security Features */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Garantías de Seguridad
                    </h4>
                    <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
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