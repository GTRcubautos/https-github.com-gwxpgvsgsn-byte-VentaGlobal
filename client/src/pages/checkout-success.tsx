import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, Car, Bike, Smartphone, Star, Gift, 
  ArrowRight, Home, ShoppingBag, Crown 
} from 'lucide-react';
import { Link } from 'wouter';

export default function CheckoutSuccess() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Clear any cart data or perform cleanup
    // This could be expanded to handle Stripe return parameters
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50/30 to-purple-50/20" data-testid="checkout-success-page">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">
              🎉 ¡Pago Exitoso!
            </h1>
            <p className="text-green-100 text-lg">
              Tu pedido GTR CUBAUTOS ha sido procesado correctamente
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardContent className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                ¡Gracias por tu compra!
              </h2>
              
              <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                Tu pedido ha sido recibido y está siendo procesado. Te enviaremos un email de confirmación 
                con los detalles de seguimiento pronto.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
                  <Star className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-bold text-blue-900 mb-2">Puntos Ganados</h3>
                  <p className="text-blue-700">Has ganado puntos GTR que podrás usar en futuras compras</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
                  <Gift className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-bold text-green-900 mb-2">Garantía Premium</h3>
                  <p className="text-green-700">Todos nuestros productos incluyen garantía extendida</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
                  <Crown className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-bold text-purple-900 mb-2">Servicio VIP</h3>
                  <p className="text-purple-700">Atención personalizada y soporte prioritario</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl mb-8">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                ¿Qué sigue ahora?
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Confirmación por Email</h4>
                    <p className="text-gray-600">Te enviaremos un email con los detalles de tu pedido</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Preparación del Pedido</h4>
                    <p className="text-gray-600">Nuestro equipo preparará tu pedido con el máximo cuidado</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Envío y Entrega</h4>
                    <p className="text-gray-600">Recibirás información de seguimiento para rastrear tu envío</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 text-lg">
                <Home className="h-5 w-5 mr-2" />
                Volver al Inicio
              </Button>
            </Link>
            
            <Link href="/productos">
              <Button variant="outline" className="px-8 py-3 text-lg border-blue-200 text-blue-600 hover:bg-blue-50">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Seguir Comprando
              </Button>
            </Link>
          </div>

          {/* Support Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mt-8">
            <CardContent className="p-6 text-center">
              <h4 className="font-bold text-gray-900 mb-2">¿Necesitas ayuda?</h4>
              <p className="text-gray-600 mb-4">
                Nuestro equipo de soporte está aquí para ayudarte
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge className="bg-green-600 text-white px-4 py-2">
                  📧 support@gtrcubautos.com
                </Badge>
                <Badge className="bg-blue-600 text-white px-4 py-2">
                  📱 WhatsApp: +1 (555) 123-4567
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}