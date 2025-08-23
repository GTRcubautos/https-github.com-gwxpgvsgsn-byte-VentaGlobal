import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, Shield, Scale, Clock, Mail, Phone, Globe, 
  CreditCard, Truck, AlertTriangle, CheckCircle, User,
  Car, Bike, Smartphone, Crown, Lock, RefreshCw
} from "lucide-react";
import { Link } from "wouter";

export function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20" data-testid="terms-page">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white backdrop-blur-sm px-6 py-3">
              <FileText className="h-4 w-4 mr-2" />
              Términos y Condiciones GTR CUBAUTOS
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Términos y Condiciones de Uso
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-4">
              Última actualización: 23 de agosto de 2025
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-200">
              <RefreshCw className="h-4 w-4" />
              <span>Versión 2.1 - Actualizado para Stripe Payments</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Introduction */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Scale className="h-6 w-6 text-blue-600" />
                1. Introducción y Aceptación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg font-medium text-blue-900">
                Bienvenido a GTR CUBAUTOS, su destino premium para vehículos y tecnología de vanguardia.
              </p>
              <p>
                Al acceder y utilizar nuestro sitio web <strong>gtrcubautos.com</strong> y nuestros servicios, 
                usted acepta estar sujeto a estos términos y condiciones de uso en su totalidad.
              </p>
              <p>
                Si no está de acuerdo con alguna parte de estos términos, debe discontinuar el uso 
                de nuestros servicios inmediatamente.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-800 font-semibold mb-2">
                  <CheckCircle className="h-5 w-5" />
                  Actualizaciones Importantes
                </div>
                <p className="text-blue-700">
                  Estos términos han sido actualizados para incluir procesamiento de pagos con Stripe, 
                  medidas de seguridad mejoradas y nuevas políticas de devolución.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <User className="h-6 w-6 text-purple-600" />
                2. Cuentas de Usuario y Registro
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Para realizar compras y acceder a funciones premium, debe crear una cuenta proporcionando 
                información precisa, actualizada y completa.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Usuarios Regulares
                  </h4>
                  <ul className="text-green-700 space-y-1 text-sm">
                    <li>• Acceso a precios al público</li>
                    <li>• Sistema de puntos GTR</li>
                    <li>• Soporte estándar</li>
                    <li>• Garantía básica</li>
                  </ul>
                </div>
                
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <Crown className="h-4 w-4" />
                    Usuarios Mayoristas VIP
                  </h4>
                  <ul className="text-yellow-700 space-y-1 text-sm">
                    <li>• Precios preferenciales</li>
                    <li>• Puntos GTR multiplicados</li>
                    <li>• Soporte prioritario 24/7</li>
                    <li>• Garantía extendida premium</li>
                  </ul>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">Responsabilidades del Usuario:</h4>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Mantener la confidencialidad de su cuenta y credenciales</li>
                <li>Notificar inmediatamente cualquier uso no autorizado</li>
                <li>Proporcionar información veraz y actualizada</li>
                <li>Ser mayor de 18 años para crear una cuenta</li>
                <li>Cumplir con todas las leyes aplicables en su jurisdicción</li>
              </ul>
            </CardContent>
          </Card>

          {/* Products and Services */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Car className="h-6 w-6 text-green-600" />
                3. Productos y Servicios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                GTR CUBAUTOS ofrece una amplia gama de productos automotrices, motocicletas y 
                tecnología premium a través de nuestra plataforma de comercio electrónico.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <Car className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-800">Automóviles</h4>
                  <p className="text-blue-700 text-sm">Vehículos premium y deportivos</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <Bike className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-800">Motocicletas</h4>
                  <p className="text-purple-700 text-sm">Superbikes y motos deportivas</p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Smartphone className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-800">Tecnología</h4>
                  <p className="text-green-700 text-sm">Dispositivos y accesorios</p>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">Condiciones de Productos:</h4>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Todos los precios están sujetos a cambios sin previo aviso</li>
                <li>La disponibilidad está sujeta a stock existente</li>
                <li>Las especificaciones pueden variar según el modelo y año</li>
                <li>Las imágenes son referenciales y pueden diferir del producto real</li>
                <li>Garantías varían según el fabricante y tipo de producto</li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <CreditCard className="h-6 w-6 text-indigo-600" />
                4. Términos de Pago y Facturación
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <div className="flex items-center gap-2 text-indigo-800 font-semibold mb-2">
                  <Lock className="h-5 w-5" />
                  Procesamiento Seguro con Stripe
                </div>
                <p className="text-indigo-700">
                  Utilizamos Stripe, líder mundial en procesamiento de pagos, para garantizar 
                  transacciones 100% seguras con cifrado de extremo a extremo.
                </p>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">Métodos de Pago Aceptados:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h5 className="font-semibold text-gray-800 mb-2">Tarjetas de Crédito/Débito</h5>
                  <p className="text-gray-600 text-sm">Visa, MasterCard, American Express</p>
                  <p className="text-green-600 text-sm font-medium">✓ Procesado por Stripe</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h5 className="font-semibold text-gray-800 mb-2">Transferencias</h5>
                  <p className="text-gray-600 text-sm">Zelle, transferencias bancarias</p>
                  <p className="text-blue-600 text-sm font-medium">✓ Verificación inmediata</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h5 className="font-semibold text-gray-800 mb-2">Billeteras Digitales</h5>
                  <p className="text-gray-600 text-sm">PayPal, Apple Pay, Google Pay</p>
                  <p className="text-purple-600 text-sm font-medium">✓ Pago rápido</p>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">Políticas de Facturación:</h4>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Todos los precios incluyen impuestos aplicables</li>
                <li>El cargo se realizará al momento de confirmar el pedido</li>
                <li>Los reembolsos se procesan en 5-10 días hábiles</li>
                <li>Las facturas se envían por correo electrónico</li>
                <li>Mantenemos registros de todas las transacciones por motivos fiscales</li>
              </ul>
            </CardContent>
          </Card>

          {/* Shipping and Delivery */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Truck className="h-6 w-6 text-orange-600" />
                5. Envío y Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 text-orange-800 font-semibold mb-2">
                  <Truck className="h-5 w-5" />
                  Envío GRATIS en compras mayores a $500
                </div>
                <p className="text-orange-700">
                  Disfruta de envío gratuito en todas tus compras que superen los $500 USD.
                </p>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">Políticas de Envío:</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">1</div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Procesamiento</h5>
                    <p className="text-gray-600 text-sm">1-2 días hábiles para preparar el pedido</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">2</div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Envío Estándar</h5>
                    <p className="text-gray-600 text-sm">3-7 días hábiles, $25-50 dependiendo del peso</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">3</div>
                  <div>
                    <h5 className="font-semibold text-gray-800">Envío Express</h5>
                    <p className="text-gray-600 text-sm">1-3 días hábiles, $75-100 dependiendo de la zona</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-2">⚠️ Restricciones Especiales</h5>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• Vehículos requieren coordinación especial de entrega</li>
                  <li>• Algunos productos pueden tener restricciones de envío por región</li>
                  <li>• Tiempos de entrega pueden variar durante temporadas altas</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Returns and Warranty */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <RefreshCw className="h-6 w-6 text-green-600" />
                6. Devoluciones y Garantías
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                  <Shield className="h-5 w-5" />
                  Garantía de Satisfacción 100%
                </div>
                <p className="text-green-700">
                  Ofrecemos garantía completa en todos nuestros productos con política 
                  de devolución flexible.
                </p>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">Política de Devoluciones:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Productos Elegibles</h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Electrónicos: 30 días</li>
                    <li>• Accesorios: 45 días</li>
                    <li>• Productos sin usar con embalaje original</li>
                    <li>• Con recibo de compra válido</li>
                  </ul>
                </div>
                
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Proceso de Devolución</h5>
                  <ul className="text-gray-600 space-y-1 text-sm">
                    <li>• Contactar soporte en 48 horas</li>
                    <li>• Obtener número de autorización RMA</li>
                    <li>• Empaque seguro para envío de retorno</li>
                    <li>• Reembolso procesado en 5-10 días</li>
                  </ul>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 mt-6 mb-3">Cobertura de Garantía:</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">Electrónicos y Accesorios</span>
                  <Badge className="bg-blue-600 text-white">1 año</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">Vehículos (según fabricante)</span>
                  <Badge className="bg-green-600 text-white">2-5 años</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">Usuarios VIP (garantía extendida)</span>
                  <Badge className="bg-purple-600 text-white">+50% cobertura</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prohibited Uses */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                7. Usos Prohibidos y Limitaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                  <AlertTriangle className="h-5 w-5" />
                  Actividades Estrictamente Prohibidas
                </div>
                <p className="text-red-700">
                  El incumplimiento de estas restricciones puede resultar en la suspensión 
                  o terminación de su cuenta.
                </p>
              </div>

              <h4 className="font-semibold text-gray-900 mb-3">No está permitido:</h4>
              <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700">
                <li>Usar el sitio para actividades ilegales o fraudulentas</li>
                <li>Intentar acceder a sistemas o datos no autorizados</li>
                <li>Distribuir virus, malware o código malicioso</li>
                <li>Realizar ingeniería inversa de nuestros sistemas</li>
                <li>Crear cuentas múltiples para evadir restricciones</li>
                <li>Revender productos sin autorización expresa</li>
                <li>Usar nuestro contenido o marca sin permiso</li>
                <li>Interferir con el funcionamiento normal del sitio</li>
              </ul>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mt-4">
                <h5 className="font-semibold text-blue-800 mb-2">Consecuencias del Incumplimiento</h5>
                <p className="text-blue-700 text-sm">
                  Las violaciones pueden resultar en advertencias, suspensión temporal, 
                  terminación permanente de cuenta, y/o acciones legales según corresponda.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Mail className="h-6 w-6 text-blue-600" />
                8. Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-lg">
                Para preguntas sobre estos términos y condiciones, contáctenos:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    Soporte Legal
                  </h4>
                  <p className="text-gray-600">legal@gtrcubautos.com</p>
                  <p className="text-gray-600">Respuesta en 24-48 horas</p>
                </div>
                
                <div className="bg-white/80 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    Línea Directa
                  </h4>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-gray-600">Lunes a Viernes 9AM-6PM EST</p>
                </div>
              </div>

              <div className="bg-white/80 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-600" />
                  Dirección Corporativa
                </h4>
                <p className="text-gray-600">
                  GTR CUBAUTOS Corporation<br/>
                  1234 Premium Drive, Suite 567<br/>
                  Miami, FL 33101, Estados Unidos
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Footer Actions */}
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Estos términos están sujetos a cambios. Las actualizaciones se notificarán 
              por email y/o publicación en el sitio web.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/privacy">
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <Shield className="h-4 w-4 mr-2" />
                  Ver Política de Privacidad
                </Button>
              </Link>
              
              <Link href="/">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Volver al Inicio GTR
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}