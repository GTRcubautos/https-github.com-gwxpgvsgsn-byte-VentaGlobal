import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Lock, Database, Globe, Users, FileText, AlertTriangle } from "lucide-react";
import { Link } from "wouter";

export function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-foreground text-background">
              <Shield className="h-3 w-3 mr-1" />
              Política de Privacidad
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Política de Privacidad y Protección de Datos
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Última actualización: 23 de agosto de 2025
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Introduction */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Eye className="h-5 w-5" />
                Nuestra Filosofía de Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                En TiendaOnline, su privacidad es fundamental. Nos comprometemos a proteger 
                y respetar su información personal con los más altos estándares de seguridad.
              </p>
              <p>
                Esta política explica cómo recopilamos, usamos, almacenamos y protegemos 
                sus datos personales cuando utiliza nuestros servicios.
              </p>
            </CardContent>
          </Card>

          {/* Data Collection */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Database className="h-5 w-5" />
                Información que Recopilamos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Información Personal</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Nombre completo y datos de contacto</li>
                    <li>Dirección de correo electrónico</li>
                    <li>Número de teléfono</li>
                    <li>Dirección de facturación y envío</li>
                    <li>Información de pago (encriptada)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Información Técnica</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Dirección IP y ubicación geográfica</li>
                    <li>Tipo de navegador y dispositivo</li>
                    <li>Páginas visitadas y tiempo de permanencia</li>
                    <li>Cookies y tecnologías similares</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Información de Compras</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Historial de pedidos y transacciones</li>
                    <li>Preferencias de productos</li>
                    <li>Puntos de recompensa acumulados</li>
                    <li>Interacciones con el servicio al cliente</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users className="h-5 w-5" />
                Cómo Utilizamos su Información
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Procesar y cumplir sus pedidos</li>
                <li>Proporcionar atención al cliente personalizada</li>
                <li>Mejorar nuestros productos y servicios</li>
                <li>Enviar actualizaciones importantes sobre pedidos</li>
                <li>Personalizar su experiencia de compra</li>
                <li>Prevenir fraudes y garantizar la seguridad</li>
                <li>Cumplir con obligaciones legales y regulatorias</li>
                <li>Analizar tendencias de uso para optimización</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Lock className="h-5 w-5" />
                Seguridad y Protección de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Implementamos medidas de seguridad avanzadas para proteger su información:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Encriptación</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>SSL/TLS 256-bit para transmisión</li>
                    <li>AES-256 para almacenamiento</li>
                    <li>Hashing seguro para contraseñas</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Acceso Controlado</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Autenticación multi-factor</li>
                    <li>Acceso basado en roles</li>
                    <li>Auditorías de acceso regulares</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Globe className="h-5 w-5" />
                Compartir Información
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Nunca vendemos su información personal. Solo compartimos datos cuando es necesario para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Procesar pagos (con procesadores de pago certificados)</li>
                <li>Realizar envíos (con empresas de logística)</li>
                <li>Prevenir fraudes (con servicios de verificación)</li>
                <li>Cumplir con requisitos legales (cuando sea obligatorio)</li>
                <li>Proteger nuestros derechos y propiedad</li>
              </ul>
              <p className="text-sm bg-muted/50 p-3 rounded-lg">
                <strong>Nota:</strong> Todos nuestros socios deben cumplir con estrictas 
                normas de privacidad y solo pueden usar sus datos para los fines específicos acordados.
              </p>
            </CardContent>
          </Card>

          {/* User Rights */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5" />
                Sus Derechos y Controles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Usted tiene control total sobre su información:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Acceso y Actualización</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Ver toda su información almacenada</li>
                    <li>Actualizar datos en cualquier momento</li>
                    <li>Descargar sus datos (portabilidad)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Control y Eliminación</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Eliminar su cuenta completamente</li>
                    <li>Optar por no recibir marketing</li>
                    <li>Limitar el procesamiento de datos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <AlertTriangle className="h-5 w-5" />
                Cookies y Tecnologías de Seguimiento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Utilizamos cookies para mejorar su experiencia:</p>
              <div className="space-y-3">
                <div>
                  <strong className="text-foreground">Cookies Esenciales:</strong> Necesarias para el funcionamiento básico del sitio
                </div>
                <div>
                  <strong className="text-foreground">Cookies de Rendimiento:</strong> Nos ayudan a entender cómo interactúa con el sitio
                </div>
                <div>
                  <strong className="text-foreground">Cookies de Funcionalidad:</strong> Recuerdan sus preferencias y configuraciones
                </div>
                <div>
                  <strong className="text-foreground">Cookies de Marketing:</strong> Permiten mostrar anuncios relevantes (opcional)
                </div>
              </div>
              <p className="text-sm">
                Puede gestionar sus preferencias de cookies en cualquier momento a través 
                de la configuración de su navegador.
              </p>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Database className="h-5 w-5" />
                Retención de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>Conservamos su información durante:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Datos de cuenta:</strong> Mientras su cuenta esté activa</li>
                <li><strong>Historial de compras:</strong> 7 años (por requisitos fiscales)</li>
                <li><strong>Datos de marketing:</strong> Hasta que retire su consentimiento</li>
                <li><strong>Registros de seguridad:</strong> 2 años para protección</li>
                <li><strong>Datos técnicos:</strong> 12 meses para análisis</li>
              </ul>
              <p className="text-sm bg-muted/50 p-3 rounded-lg">
                Después de estos períodos, eliminamos o anonimizamos permanentemente sus datos.
              </p>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5" />
                Contacto y Preguntas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Para cualquier pregunta sobre privacidad o para ejercer sus derechos:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p><strong>Oficial de Protección de Datos:</strong></p>
                <p>Email: privacy@tiendaonline.com</p>
                <p>Teléfono: +1 (555) 123-4567</p>
                <p>Horario: Lunes a Viernes, 9:00 AM - 6:00 PM</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/terms">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Ver Términos y Condiciones
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" className="min-w-[200px]">
                Volver al Inicio
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}