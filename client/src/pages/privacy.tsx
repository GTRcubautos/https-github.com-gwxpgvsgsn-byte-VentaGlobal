import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, Eye, Lock, Database, Globe, Users, FileText, AlertTriangle,
  CheckCircle, Server, Smartphone, CreditCard, Mail, Phone, Settings,
  UserCheck, Bell, Key, RefreshCw, Download, Trash2
} from "lucide-react";
import { Link } from "wouter";

export function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20" data-testid="privacy-page">
      {/* Header */}
      <section className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-white/20 text-white backdrop-blur-sm px-6 py-3">
              <Shield className="h-4 w-4 mr-2" />
              Política de Privacidad GTR CUBAUTOS
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Política de Privacidad y Protección de Datos
            </h1>
            <p className="text-xl text-green-100 max-w-2xl mx-auto mb-4">
              Última actualización: 23 de agosto de 2025
            </p>
            <div className="flex items-center justify-center gap-2 text-green-200">
              <RefreshCw className="h-4 w-4" />
              <span>Versión 3.0 - Compatible con GDPR y CCPA</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Privacy Philosophy */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Eye className="h-6 w-6 text-blue-600" />
                Nuestra Filosofía de Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg font-medium text-blue-900">
                En GTR CUBAUTOS, su privacidad no es negociable. Es un derecho fundamental 
                que protegemos con tecnología de vanguardia y políticas estrictas.
              </p>
              <p>
                Esta política explica de manera transparente cómo recopilamos, usamos, 
                almacenamos y protegemos sus datos personales cuando utiliza nuestros servicios 
                de comercio electrónico automotriz.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
                  <Lock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-green-800">Cifrado AES-256</h4>
                  <p className="text-green-700 text-sm">Máxima seguridad</p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
                  <Shield className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-blue-800">GDPR Compliant</h4>
                  <p className="text-blue-700 text-sm">Estándares europeos</p>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
                  <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold text-purple-800">Auditorías SOC 2</h4>
                  <p className="text-purple-700 text-sm">Certificación anual</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Collection */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Database className="h-6 w-6 text-purple-600" />
                Información que Recopilamos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Recopilamos únicamente la información necesaria para brindarle el mejor 
                servicio posible y cumplir con nuestras obligaciones legales.
              </p>

              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    Información Personal Directa
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-blue-700 space-y-2 text-sm">
                      <li>• <strong>Identidad:</strong> Nombre completo, fecha de nacimiento</li>
                      <li>• <strong>Contacto:</strong> Email, teléfono, dirección postal</li>
                      <li>• <strong>Facturación:</strong> Dirección de facturación y envío</li>
                      <li>• <strong>Preferencias:</strong> Idioma, configuraciones</li>
                    </ul>
                    <ul className="text-blue-700 space-y-2 text-sm">
                      <li>• <strong>Cuenta:</strong> Username, contraseña cifrada</li>
                      <li>• <strong>Verificación:</strong> Documentos de identidad (si requerido)</li>
                      <li>• <strong>Comunicación:</strong> Historial de soporte</li>
                      <li>• <strong>Marketing:</strong> Consentimientos específicos</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Información Financiera (Procesada por Stripe)
                  </h4>
                  <div className="bg-white/80 p-4 rounded-lg mb-4">
                    <div className="flex items-center gap-2 text-green-800 font-semibold mb-2">
                      <Shield className="h-4 w-4" />
                      Seguridad PCI DSS Nivel 1
                    </div>
                    <p className="text-green-700 text-sm">
                      Stripe maneja toda la información de pago. GTR CUBAUTOS nunca almacena 
                      números de tarjeta completos, CVV, o datos bancarios sensibles.
                    </p>
                  </div>
                  <ul className="text-green-700 space-y-2 text-sm">
                    <li>• <strong>Tokens seguros:</strong> Referencias cifradas de métodos de pago</li>
                    <li>• <strong>Historial:</strong> Registro de transacciones completadas</li>
                    <li>• <strong>Facturación:</strong> Información fiscal requerida por ley</li>
                    <li>• <strong>Reembolsos:</strong> Datos necesarios para procesos de devolución</li>
                  </ul>
                </div>
                
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-4 flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Información Técnica Automática
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ul className="text-orange-700 space-y-2 text-sm">
                      <li>• <strong>Dispositivo:</strong> Tipo, modelo, sistema operativo</li>
                      <li>• <strong>Navegador:</strong> Tipo, versión, configuraciones</li>
                      <li>• <strong>Red:</strong> Dirección IP, geolocalización aproximada</li>
                      <li>• <strong>Cookies:</strong> Preferencias, sesión, analytics</li>
                    </ul>
                    <ul className="text-orange-700 space-y-2 text-sm">
                      <li>• <strong>Actividad:</strong> Páginas visitadas, tiempo de permanencia</li>
                      <li>• <strong>Rendimiento:</strong> Velocidad de carga, errores</li>
                      <li>• <strong>Referencia:</strong> Sitio web de origen</li>
                      <li>• <strong>Interacciones:</strong> Clics, desplazamientos, formularios</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Data */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Settings className="h-6 w-6 text-indigo-600" />
                Cómo Utilizamos Sus Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Utilizamos sus datos únicamente para los propósitos específicos para los cuales 
                fueron recopilados, siempre con su consentimiento explícito cuando sea requerido.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-indigo-800 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Servicios Esenciales
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                      <div>
                        <h5 className="font-semibold text-indigo-800">Procesamiento de Pedidos</h5>
                        <p className="text-indigo-700 text-sm">Gestión completa de compras y entregas</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                      <div>
                        <h5 className="font-semibold text-indigo-800">Soporte al Cliente</h5>
                        <p className="text-indigo-700 text-sm">Atención personalizada y resolución de problemas</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg">
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                      <div>
                        <h5 className="font-semibold text-indigo-800">Seguridad de Cuenta</h5>
                        <p className="text-indigo-700 text-sm">Detección de fraudes y autenticación</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Servicios Opcionales (con Consentimiento)
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
                      <div>
                        <h5 className="font-semibold text-green-800">Marketing Personalizado</h5>
                        <p className="text-green-700 text-sm">Ofertas relevantes basadas en sus intereses</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">B</div>
                      <div>
                        <h5 className="font-semibold text-green-800">Análisis y Mejoras</h5>
                        <p className="text-green-700 text-sm">Optimización de experiencia y rendimiento</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">C</div>
                      <div>
                        <h5 className="font-semibold text-green-800">Comunicaciones</h5>
                        <p className="text-green-700 text-sm">Newsletters y actualizaciones de productos</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-2 text-yellow-800 font-semibold mb-2">
                  <Key className="h-5 w-5" />
                  Base Legal para el Procesamiento
                </div>
                <ul className="text-yellow-700 space-y-1 text-sm">
                  <li>• <strong>Cumplimiento contractual:</strong> Servicios acordados en términos</li>
                  <li>• <strong>Consentimiento explícito:</strong> Marketing y cookies no esenciales</li>
                  <li>• <strong>Interés legítimo:</strong> Seguridad, fraude, mejoras operativas</li>
                  <li>• <strong>Obligación legal:</strong> Retención fiscal, reportes regulatorios</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Server className="h-6 w-6 text-red-600" />
                Seguridad y Protección de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-700 leading-relaxed">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                  <Shield className="h-5 w-5" />
                  Seguridad de Grado Militar
                </div>
                <p className="text-red-700">
                  Implementamos múltiples capas de seguridad para proteger sus datos contra 
                  acceso no autorizado, alteración, divulgación o destrucción.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-800 mb-3">Medidas Técnicas</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Lock className="h-5 w-5 text-red-600" />
                      <div>
                        <h5 className="font-semibold text-gray-800">Cifrado AES-256</h5>
                        <p className="text-gray-600 text-sm">Datos en reposo y en tránsito</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Server className="h-5 w-5 text-red-600" />
                      <div>
                        <h5 className="font-semibold text-gray-800">Infraestructura AWS</h5>
                        <p className="text-gray-600 text-sm">Centros de datos certificados SOC 2</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Shield className="h-5 w-5 text-red-600" />
                      <div>
                        <h5 className="font-semibold text-gray-800">Firewall Avanzado</h5>
                        <p className="text-gray-600 text-sm">Detección de intrusiones 24/7</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Medidas Organizacionales</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <h5 className="font-semibold text-gray-800">Acceso Restringido</h5>
                        <p className="text-gray-600 text-sm">Solo personal autorizado</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <div>
                        <h5 className="font-semibold text-gray-800">Políticas Estrictas</h5>
                        <p className="text-gray-600 text-sm">Capacitación continua en privacidad</p>
                      </div>
                    </li>
                    <li className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <RefreshCw className="h-5 w-5 text-blue-600" />
                      <div>
                        <h5 className="font-semibold text-gray-800">Auditorías Regulares</h5>
                        <p className="text-gray-600 text-sm">Evaluaciones de seguridad trimestrales</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-3">Certificaciones y Cumplimiento</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-1" />
                    <p className="text-blue-700 text-sm font-medium">SOC 2 Tipo II</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-1" />
                    <p className="text-blue-700 text-sm font-medium">ISO 27001</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-1" />
                    <p className="text-blue-700 text-sm font-medium">GDPR</p>
                  </div>
                  <div className="text-center">
                    <CheckCircle className="h-8 w-8 text-blue-600 mx-auto mb-1" />
                    <p className="text-blue-700 text-sm font-medium">CCPA</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <UserCheck className="h-6 w-6 text-purple-600" />
                Sus Derechos de Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Usted tiene control total sobre sus datos personales. Respetamos y facilitamos 
                el ejercicio de todos sus derechos de privacidad.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-800 mb-3">Derechos Fundamentales</h4>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Derecho de Acceso
                    </h5>
                    <p className="text-purple-700 text-sm">
                      Solicitar copia de todos los datos que tenemos sobre usted, 
                      incluyendo fuentes y propósitos.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Derecho de Rectificación
                    </h5>
                    <p className="text-purple-700 text-sm">
                      Corregir información inexacta o completar datos incompletos 
                      en cualquier momento.
                    </p>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h5 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Derecho al Olvido
                    </h5>
                    <p className="text-purple-700 text-sm">
                      Solicitar eliminación completa de sus datos cuando ya no 
                      sean necesarios para los propósitos originales.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-green-800 mb-3">Derechos de Control</h4>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Portabilidad de Datos
                    </h5>
                    <p className="text-green-700 text-sm">
                      Obtener sus datos en formato estructurado para transferir 
                      a otro proveedor de servicios.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Limitación del Procesamiento
                    </h5>
                    <p className="text-green-700 text-sm">
                      Restringir cómo procesamos sus datos en circunstancias 
                      específicas, manteniendo solo almacenamiento.
                    </p>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h5 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Oposición al Marketing
                    </h5>
                    <p className="text-green-700 text-sm">
                      Retirar consentimiento para comunicaciones de marketing 
                      en cualquier momento, fácilmente.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Cómo Ejercer Sus Derechos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">1</div>
                    <h5 className="font-semibold text-blue-800">Contáctenos</h5>
                    <p className="text-blue-700 text-sm">Email: privacy@gtrcubautos.com</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">2</div>
                    <h5 className="font-semibold text-blue-800">Verificación</h5>
                    <p className="text-blue-700 text-sm">Confirmamos su identidad</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2">3</div>
                    <h5 className="font-semibold text-blue-800">Respuesta</h5>
                    <p className="text-blue-700 text-sm">Máximo 30 días calendario</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Clock className="h-6 w-6 text-orange-600" />
                Retención y Eliminación de Datos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                Conservamos sus datos solo durante el tiempo necesario para cumplir con los 
                propósitos para los cuales fueron recopilados y nuestras obligaciones legales.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-800 mb-3">Períodos de Retención</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-800">Datos de cuenta activa</span>
                      <Badge className="bg-orange-600 text-white">Mientras esté activa</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-800">Historial de transacciones</span>
                      <Badge className="bg-orange-600 text-white">7 años (fiscal)</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-800">Logs de seguridad</span>
                      <Badge className="bg-orange-600 text-white">2 años</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="font-medium text-orange-800">Datos de marketing</span>
                      <Badge className="bg-orange-600 text-white">Hasta retirar consentimiento</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-red-800 mb-3">Eliminación Segura</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Borrado criptográfico de claves</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Destrucción física de medios</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Verificación de eliminación completa</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-red-600" />
                      <span className="text-sm">Certificados de destrucción</span>
                    </li>
                  </ul>
                  
                  <div className="bg-red-50 p-3 rounded-lg border border-red-200 mt-4">
                    <p className="text-red-700 text-sm">
                      <strong>Nota:</strong> Algunos datos pueden conservarse por más tiempo 
                      si es requerido por ley o para defendernos en procedimientos legales.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <Mail className="h-6 w-6 text-green-600" />
                Contacto y Soporte de Privacidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 text-lg">
                Para cualquier pregunta sobre privacidad, ejercicio de derechos, o inquietudes 
                sobre el manejo de sus datos:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Oficial de Protección de Datos
                  </h4>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Email:</strong> privacy@gtrcubautos.com</p>
                    <p><strong>Respuesta:</strong> Máximo 48 horas</p>
                    <p><strong>Teléfono:</strong> +1 (555) 123-4567 ext. 200</p>
                    <p><strong>Horario:</strong> Lun-Vie 9AM-6PM EST</p>
                  </div>
                </div>
                
                <div className="bg-white/80 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Autoridad de Control
                  </h4>
                  <div className="space-y-2 text-gray-600">
                    <p><strong>Para residentes UE:</strong></p>
                    <p>Autoridad de Protección de Datos de su país</p>
                    <p><strong>Para residentes California:</strong></p>
                    <p>Oficina del Fiscal General de California</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-purple-600" />
                  Dirección Postal para Asuntos de Privacidad
                </h4>
                <p className="text-gray-600">
                  GTR CUBAUTOS - Departamento de Privacidad<br/>
                  1234 Premium Drive, Suite 567<br/>
                  Miami, FL 33101, Estados Unidos<br/>
                  <strong>Atención:</strong> Data Protection Officer
                </p>
              </div>
            </CardContent>
          </Card>

          <Separator className="my-8" />

          {/* Footer Actions */}
          <div className="text-center space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-blue-800 font-medium mb-2">
                Esta política se actualiza periódicamente para reflejar cambios en nuestras 
                prácticas y regulaciones aplicables.
              </p>
              <p className="text-blue-700 text-sm">
                Le notificaremos sobre cambios materiales por email y/o mediante aviso 
                prominente en nuestro sitio web.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/terms">
                <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
                  <FileText className="h-4 w-4 mr-2" />
                  Ver Términos y Condiciones
                </Button>
              </Link>
              
              <Link href="/">
                <Button className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
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