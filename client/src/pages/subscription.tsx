import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Crown, Star, Zap, Shield, Gift, Check, ArrowRight, 
  Phone, Mail, User, CreditCard, Percent, TrendingUp,
  Package, Clock, Heart, Award, Target
} from "lucide-react";

const subscriptionSchema = z.object({
  name: z.string().min(2, "Nombre requerido"),
  email: z.string().email("Email válido requerido"),
  phone: z.string().min(10, "Teléfono válido requerido"),
  plan: z.enum(["basic", "premium", "vip"]),
  paymentMethod: z.enum(["credit", "debit", "paypal", "transfer"]),
});

type SubscriptionForm = z.infer<typeof subscriptionSchema>;

const plans = [
  {
    id: "basic",
    name: "Cliente Básico",
    price: 0,
    priceLabel: "GRATIS",
    description: "Acceso a productos regulares con precios estándar",
    color: "from-gray-600 to-gray-800",
    accentColor: "text-gray-400",
    features: [
      "Catálogo completo de productos",
      "Soporte por email",
      "Garantía estándar",
      "Envío regular"
    ],
    discount: 0,
    icon: Package
  },
  {
    id: "premium",
    name: "Cliente Premium",
    price: 29.99,
    priceLabel: "$29.99/mes",
    description: "Descuentos exclusivos y beneficios adicionales",
    color: "from-blue-600 to-blue-800",
    accentColor: "text-blue-400",
    features: [
      "10% descuento en todos los productos",
      "Envío gratis en pedidos +$200",
      "Soporte prioritario 24/7",
      "Acceso a ofertas exclusivas",
      "Garantía extendida",
      "Notificaciones de nuevos productos"
    ],
    discount: 10,
    icon: Star,
    popular: true
  },
  {
    id: "vip",
    name: "Cliente VIP",
    price: 59.99,
    priceLabel: "$59.99/mes",
    description: "Máximo nivel de beneficios y descuentos premium",
    color: "from-yellow-600 to-yellow-800",
    accentColor: "text-yellow-400",
    features: [
      "20% descuento en todos los productos",
      "Envío gratis sin mínimo",
      "Soporte VIP dedicado",
      "Acceso anticipado a productos",
      "Garantía premium de por vida",
      "Instalación gratuita",
      "Asesoría técnica personalizada",
      "Puntos de recompensa dobles"
    ],
    discount: 20,
    icon: Crown
  }
];

const benefits = [
  {
    icon: Percent,
    title: "Descuentos Exclusivos",
    description: "Hasta 20% de descuento en toda tu compra"
  },
  {
    icon: Zap,
    title: "Envío Express",
    description: "Entrega prioritaria en 24-48 horas"
  },
  {
    icon: Shield,
    title: "Garantía Premium",
    description: "Cobertura extendida y protección total"
  },
  {
    icon: Award,
    title: "Soporte VIP",
    description: "Atención personalizada 24/7"
  },
  {
    icon: Gift,
    title: "Ofertas Anticipadas",
    description: "Acceso exclusivo a nuevos productos"
  },
  {
    icon: Target,
    title: "Puntos Dobles",
    description: "Acumula recompensas más rápido"
  }
];

export default function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const { toast } = useToast();

  const form = useForm<SubscriptionForm>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      plan: "premium",
      paymentMethod: "credit",
    },
  });

  const onSubmit = (data: SubscriptionForm) => {
    toast({
      title: "¡Suscripción Exitosa!",
      description: `Bienvenido al plan ${plans.find(p => p.id === data.plan)?.name}`,
    });
    console.log("Subscription data:", data);
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12" data-testid="subscription-page">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Crown className="h-16 w-16 text-yellow-500" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-foreground">
            GTR CUBAUTO VIP
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Únete a nuestro programa de membresía y obtén descuentos exclusivos, envío gratis y beneficios premium en todos tus repuestos automotrices
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {benefits.map((benefit, index) => {
            const BenefitIcon = benefit.icon;
            return (
              <Card key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 group-hover:bg-primary/20 transition-colors">
                    <BenefitIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Plans Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Elige tu Plan de Membresía</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => {
              const PlanIcon = plan.icon;
              return (
                <Card 
                  key={plan.id} 
                  className={`relative overflow-hidden transition-all duration-300 cursor-pointer ${
                    selectedPlan === plan.id ? 'ring-2 ring-primary scale-105' : 'hover:scale-102'
                  } ${plan.popular ? 'border-primary shadow-lg' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                  data-testid={`plan-${plan.id}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 bg-primary text-primary-foreground text-center py-2 text-sm font-semibold">
                      MÁS POPULAR
                    </div>
                  )}
                  
                  <div className={`h-32 bg-gradient-to-br ${plan.color} relative ${plan.popular ? 'mt-8' : ''}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-6">
                      <PlanIcon className="h-10 w-10 text-white drop-shadow-lg" />
                    </div>
                    {plan.discount > 0 && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/90 text-black font-bold px-3 py-1">
                          {plan.discount}% OFF
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-6">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-3xl font-bold ${plan.accentColor}`}>
                          {plan.priceLabel}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-sm text-muted-foreground">por mes</span>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{plan.description}</p>
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button 
                      className={`w-full ${selectedPlan === plan.id ? 'bg-primary' : ''}`}
                      variant={selectedPlan === plan.id ? "default" : "outline"}
                    >
                      {selectedPlan === plan.id ? "Plan Seleccionado" : "Seleccionar Plan"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Subscription Form */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Completa tu Suscripción
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Info */}
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

              {/* Plan Summary */}
              <div className="p-4 bg-accent/50 rounded-lg">
                <h4 className="font-semibold mb-2">Plan Seleccionado:</h4>
                <div className="flex items-center justify-between">
                  <span>{plans.find(p => p.id === selectedPlan)?.name}</span>
                  <span className="font-bold text-primary">
                    {plans.find(p => p.id === selectedPlan)?.priceLabel}
                  </span>
                </div>
                {plans.find(p => p.id === selectedPlan)?.discount && (
                  <p className="text-sm text-green-600 mt-1">
                    Ahorrarás {plans.find(p => p.id === selectedPlan)?.discount}% en todas tus compras
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <CreditCard className="h-4 w-4" />
                  Método de Pago
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: "credit", label: "Tarjeta de Crédito" },
                    { value: "debit", label: "Tarjeta de Débito" },
                    { value: "paypal", label: "PayPal" },
                    { value: "transfer", label: "Transferencia" }
                  ].map((method) => (
                    <label key={method.value} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        {...form.register("paymentMethod")}
                        value={method.value}
                        className="text-primary"
                      />
                      <span className="text-sm">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" data-testid="submit-subscription">
                <Crown className="h-5 w-5 mr-2" />
                Activar Membresía
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Preguntas Frecuentes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">¿Puedo cancelar mi suscripción?</h4>
                <p className="text-muted-foreground text-sm">
                  Sí, puedes cancelar en cualquier momento sin penalizaciones. Los beneficios continuarán hasta el final del período pagado.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <h4 className="font-semibold mb-2">¿Los descuentos se aplican automáticamente?</h4>
                <p className="text-muted-foreground text-sm">
                  Sí, todos los descuentos de membresía se aplican automáticamente al momento de la compra.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}