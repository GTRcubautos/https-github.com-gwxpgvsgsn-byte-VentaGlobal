import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft, Eye, Lock, Database, Mail, Cookie, FileText, Users, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPolicy() {
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
              <Shield className="h-16 w-16 text-blue-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Política de Privacidad
            </h1>
            <p className="text-xl text-gray-300 mb-4">
              GTR CUBAUTO - Tu privacidad es nuestra prioridad
            </p>
            <Badge className="bg-blue-600 text-white px-4 py-2">
              Versión 1.0 - Vigente desde: {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introducción */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-300">
                <FileText className="h-6 w-6" />
                Introducción
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                En GTR CUBAUTO, nos comprometemos a proteger tu privacidad y los datos personales que compartes con nosotros. 
                Esta política explica cómo recopilamos, usamos, protegemos y compartimos tu información cuando utilizas nuestros servicios.
              </p>
              <p>
                Como empresa líder en el sector automotriz, entendemos la importancia de la confianza en nuestras relaciones comerciales. 
                Por eso, manejamos tus datos con el máximo cuidado y transparencia.
              </p>
            </CardContent>
          </Card>

          {/* Información que Recopilamos */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-green-300">
                <Database className="h-6 w-6" />
                Información que Recopilamos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Información Personal:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Nombre completo</li>
                    <li>• Dirección de correo electrónico</li>
                    <li>• Número de teléfono</li>
                    <li>• Dirección de entrega</li>
                    <li>• Información de vehículos (marca, modelo, año)</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Información Técnica:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Dirección IP</li>
                    <li>• Tipo de navegador</li>
                    <li>• Páginas visitadas</li>
                    <li>• Tiempo de navegación</li>
                    <li>• Historial de compras</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cómo Usamos tu Información */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-purple-300">
                <Eye className="h-6 w-6" />
                Cómo Usamos tu Información
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Servicios Esenciales:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Procesar pedidos</li>
                    <li>• Gestionar entregas</li>
                    <li>• Soporte al cliente</li>
                    <li>• Seguridad de la cuenta</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Mejoras del Servicio:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Personalizar experiencia</li>
                    <li>• Analizar preferencias</li>
                    <li>• Mejorar productos</li>
                    <li>• Optimizar navegación</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Comunicación:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Confirmaciones de pedido</li>
                    <li>• Ofertas especiales</li>
                    <li>• Nuevos productos</li>
                    <li>• Actualizaciones importantes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seguridad de Datos */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-300">
                <Lock className="h-6 w-6" />
                Seguridad de tus Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Implementamos múltiples capas de seguridad para proteger tu información:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Seguridad Técnica:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Encriptación SSL/TLS</li>
                    <li>• Bases de datos seguras</li>
                    <li>• Respaldos automáticos</li>
                    <li>• Monitoreo 24/7</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-white">Seguridad Organizacional:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>• Acceso limitado a datos</li>
                    <li>• Capacitación del personal</li>
                    <li>• Auditorías regulares</li>
                    <li>• Políticas estrictas</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-yellow-300">
                <Cookie className="h-6 w-6" />
                Uso de Cookies
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Utilizamos cookies para mejorar tu experiencia en nuestro sitio web:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Cookies Esenciales</h4>
                  <p className="text-sm">Necesarias para el funcionamiento básico del sitio.</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Cookies de Análisis</h4>
                  <p className="text-sm">Nos ayudan a entender cómo usas nuestro sitio.</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h4 className="font-semibold text-white mb-2">Cookies de Marketing</h4>
                  <p className="text-sm">Para mostrarte contenido relevante y ofertas personalizadas.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tus Derechos */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-orange-300">
                <Users className="h-6 w-6" />
                Tus Derechos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>Tienes derecho a:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Acceder</strong> a tus datos personales</li>
                  <li>• <strong>Rectificar</strong> información incorrecta</li>
                  <li>• <strong>Eliminar</strong> tus datos (derecho al olvido)</li>
                  <li>• <strong>Portar</strong> tus datos a otro servicio</li>
                </ul>
                <ul className="space-y-2 text-sm">
                  <li>• <strong>Limitar</strong> el procesamiento</li>
                  <li>• <strong>Oponerte</strong> al marketing directo</li>
                  <li>• <strong>Retirar</strong> el consentimiento</li>
                  <li>• <strong>Presentar</strong> quejas ante autoridades</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Contacto */}
          <Card className="bg-blue-900/30 border-blue-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-blue-300">
                <Mail className="h-6 w-6" />
                Contacto y Consultas
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Si tienes preguntas sobre esta política o quieres ejercer tus derechos de privacidad, contáctanos:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Datos de Contacto:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Email: privacidad@gtrcubauto.com</li>
                    <li>Teléfono: +1 (555) 123-4567</li>
                    <li>WhatsApp: +1 (555) 987-6543</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Tiempo de Respuesta:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>Consultas generales: 24-48 horas</li>
                    <li>Solicitudes de datos: 5-7 días</li>
                    <li>Eliminación de datos: 15-30 días</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advertencia de cambios */}
          <Card className="bg-amber-900/30 border-amber-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-amber-300">
                <AlertTriangle className="h-6 w-6" />
                Cambios en esta Política
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 space-y-4">
              <p>
                Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios importantes 
                por email o mediante un aviso prominente en nuestro sitio web al menos 30 días antes de que entren en vigor.
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
            <Link href="/terminos-condiciones">
              Ver Términos y Condiciones
            </Link>
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/">
              Volver al Sitio Principal
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}