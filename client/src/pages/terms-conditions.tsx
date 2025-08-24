import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, ShoppingCart, CreditCard, Truck, RotateCcw, AlertTriangle, Scale, Phone } from "lucide-react";
import { Link } from "wouter";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Button variant="ghost" className="mb-6 text-gray-300 hover:text-white" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Inicio
            </Link>
          </Button>
          
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Scale className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Términos y Condiciones
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              GTR CUBAUTO - Condiciones de Uso y Venta
            </p>
            <Badge className="bg-green-600 text-white px-4 py-2">
              Versión 1.0 - Vigente desde: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introducción */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-300">
                <FileText className="h-6 w-6" />
                Introducción y Aceptación
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Bienvenido a GTR CUBAUTO. Al acceder y utilizar nuestro sitio web, aceptas estos términos y condiciones. 
                Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestros servicios.
              </p>
              <p>
                Somos una empresa especializada en repuestos automotrices, autos clásicos y motocicletas Suzuki y Yamaha. 
                Nos comprometemos a ofrecer productos de la más alta calidad y un servicio excepcional.
              </p>
            </CardContent>
          </Card>

          {/* Servicios Ofrecidos */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-300">
                <ShoppingCart className="h-6 w-6" />
                Servicios y Productos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Repuestos Automotrices:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Frenos y sistema de frenado</li>
                    <li>• Motores y componentes</li>
                    <li>• Transmisión y embrague</li>
                    <li>• Suspensión y dirección</li>
                    <li>• Sistema eléctrico</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Vehículos:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Autos clásicos restaurados</li>
                    <li>• Vehículos de colección</li>
                    <li>• Motocicletas Suzuki</li>
                    <li>• Motocicletas Yamaha</li>
                    <li>• Accesorios especializados</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Servicios Adicionales:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Asesoría técnica especializada</li>
                    <li>• Instalación profesional</li>
                    <li>• Diagnóstico vehicular</li>
                    <li>• Servicio de entrega</li>
                    <li>• Soporte post-venta</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Precios y Pagos */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-300">
                <CreditCard className="h-6 w-6" />
                Precios y Métodos de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Precios:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Precios retail para clientes generales</li>
                    <li>• Precios especiales para clientes mayoristas</li>
                    <li>• Descuentos VIP por acumulación de puntos</li>
                    <li>• Precios sujetos a cambios sin previo aviso</li>
                    <li>• Todos los precios incluyen impuestos aplicables</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Métodos de Pago Aceptados:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Tarjetas de crédito (Visa, MasterCard)</li>
                    <li>• Tarjetas de débito</li>
                    <li>• Zelle (transferencias directas)</li>
                    <li>• PayPal</li>
                    <li>• Pago contra entrega (área local)</li>
                  </ul>
                </div>
              </div>
              <div className="bg-amber-900/30 border-amber-700 border rounded-lg p-4 mt-4">
                <p className="text-amber-200 text-sm">
                  <strong>Importante:</strong> Todos los pagos son procesados de forma segura mediante proveedores certificados. 
                  Nunca almacenamos información completa de tarjetas de crédito en nuestros servidores.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Envíos y Entregas */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-300">
                <Truck className="h-6 w-6" />
                Envíos y Entregas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Áreas de Entrega:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Entrega local: 24-48 horas</li>
                    <li>• Nacional: 3-7 días hábiles</li>
                    <li>• Internacional: 7-15 días hábiles</li>
                    <li>• Envío express disponible</li>
                    <li>• Seguimiento en tiempo real</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Costos de Envío:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Envío GRATIS en pedidos &gt;$500</li>
                    <li>• Tarifa estándar: $15-25</li>
                    <li>• Express: $30-45</li>
                    <li>• Internacional: según destino</li>
                    <li>• Calculadora automática al checkout</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Devoluciones y Garantías */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-cyan-300">
                <RotateCcw className="h-6 w-6" />
                Devoluciones y Garantías
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Política de Devoluciones:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• 30 días para devoluciones</li>
                    <li>• Productos sin usar y en empaque original</li>
                    <li>• Reembolso completo o cambio</li>
                    <li>• Cliente paga envío de devolución</li>
                    <li>• Proceso simple en línea</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Garantías:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Repuestos nuevos: 12 meses</li>
                    <li>• Repuestos reconstruidos: 6 meses</li>
                    <li>• Vehículos: según especificaciones</li>
                    <li>• Garantía contra defectos de fabricación</li>
                    <li>• Servicio técnico especializado</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Responsabilidades del Usuario */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-300">
                <AlertTriangle className="h-6 w-6" />
                Responsabilidades del Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">Al usar nuestros servicios, te comprometes a:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Proporcionar información veraz y actualizada</li>
                    <li>• Usar los productos de acuerdo a las especificaciones</li>
                    <li>• Respetar los derechos de propiedad intelectual</li>
                    <li>• No realizar actividades fraudulentas o ilegales</li>
                    <li>• Mantener la confidencialidad de tu cuenta</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Está prohibido:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Usar el sitio para fines ilegales</li>
                    <li>• Intentar acceder a sistemas no autorizados</li>
                    <li>• Distribuir contenido malicioso</li>
                    <li>• Realizar ingeniería inversa de nuestros sistemas</li>
                    <li>• Violar estos términos y condiciones</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Limitación de Responsabilidad */}
          <Card className="bg-amber-900/30 border-amber-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-300">
                <Scale className="h-6 w-6" />
                Limitación de Responsabilidad
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                GTR CUBAUTO no será responsable por daños indirectos, incidentales, especiales o consecuentes 
                que puedan surgir del uso de nuestros productos o servicios, incluyendo pero no limitándose a:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Pérdida de ganancias o datos</li>
                <li>• Daños a vehículos por instalación incorrecta</li>
                <li>• Interrupciones del servicio</li>
                <li>• Incompatibilidad de productos mal seleccionados</li>
              </ul>
              <p className="text-sm text-amber-200">
                Nuestra responsabilidad máxima se limita al valor del producto comprado.
              </p>
            </CardContent>
          </Card>

          {/* Propiedad Intelectual */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-pink-300">
                <FileText className="h-6 w-6" />
                Propiedad Intelectual
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Todo el contenido del sitio web, incluyendo textos, imágenes, logos, diseños y software, 
                está protegido por derechos de autor y otras leyes de propiedad intelectual.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Permitido:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Visualizar para uso personal</li>
                    <li>• Compartir enlaces a productos</li>
                    <li>• Imprimir para referencia personal</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Prohibido:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Reproducir contenido comercialmente</li>
                    <li>• Modificar o alterar materiales</li>
                    <li>• Usar logos o marcas sin autorización</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contacto y Soporte */}
          <Card className="bg-blue-900/30 border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-300">
                <Phone className="h-6 w-6" />
                Contacto y Soporte
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Para cualquier consulta sobre estos términos y condiciones, contáctanos:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Información de Contacto:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Email: soporte@gtrcubauto.com</li>
                    <li>Teléfono: +1 (555) 123-4567</li>
                    <li>WhatsApp: +1 (555) 987-6543</li>
                    <li>Horario: Lun-Vie 8:00-18:00</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Soporte Técnico:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Email: tecnico@gtrcubauto.com</li>
                    <li>Chat en vivo: 24/7</li>
                    <li>Base de conocimientos en línea</li>
                    <li>Video tutoriales disponibles</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Modificaciones */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-300">
                <FileText className="h-6 w-6" />
                Modificaciones de los Términos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
                Los cambios entrarán en vigor inmediatamente después de su publicación en el sitio web.
              </p>
              <p>
                Te notificaremos sobre cambios importantes por email y/o mediante un aviso prominente en nuestro sitio.
              </p>
              <p className="text-sm text-gray-400">
                Última actualización: {new Date().toLocaleDateString()} | Versión: 1.0
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800" asChild>
            <Link href="/politica-privacidad">
              Ver Política de Privacidad
            </Link>
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" asChild>
            <Link href="/">
              Aceptar y Continuar
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}