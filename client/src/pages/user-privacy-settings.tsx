import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Shield, 
  ArrowLeft, 
  FileText, 
  Settings,
  Eye,
  Download,
  Trash2,
  Lock,
  Globe,
  CheckCircle,
  AlertTriangle,
  Info,
  User,
  Bell,
  Database
} from "lucide-react";
import PrivacySettingsPanel from "@/components/privacy/privacy-settings-panel";

export default function UserPrivacySettings() {
  const [activeSection, setActiveSection] = useState<'overview' | 'settings' | 'data' | 'rights'>('overview');

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al inicio
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Mi Centro de Privacidad</h1>
                <p className="text-gray-400">Controla tu información personal y configuraciones de privacidad</p>
              </div>
            </div>
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Shield className="h-3 w-3 mr-1" />
              Protegido por GDPR
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveSection('overview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'overview'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              data-testid="nav-overview"
            >
              <User className="h-4 w-4 inline mr-2" />
              Mi Perfil
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'settings'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              data-testid="nav-settings"
            >
              <Settings className="h-4 w-4 inline mr-2" />
              Configuración
            </button>
            <button
              onClick={() => setActiveSection('data')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'data'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              data-testid="nav-data"
            >
              <Database className="h-4 w-4 inline mr-2" />
              Mis Datos
            </button>
            <button
              onClick={() => setActiveSection('rights')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeSection === 'rights'
                  ? 'border-blue-500 text-blue-300'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              data-testid="nav-rights"
            >
              <Eye className="h-4 w-4 inline mr-2" />
              Mis Derechos
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {activeSection === 'overview' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Privacy Dashboard */}
            <div className="text-center mb-8">
              <Shield className="h-12 w-12 mx-auto mb-4 text-blue-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Resumen de Privacidad</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Estado actual de tu privacidad y configuraciones de datos en GTR CUBAUTO
              </p>
            </div>

            {/* Privacy Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    Estado de Privacidad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Nivel de Protección</span>
                      <Badge className="bg-green-500/20 text-green-300">Alto</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Consentimientos</span>
                      <Badge className="bg-blue-500/20 text-blue-300">Actualizados</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Datos Encriptados</span>
                      <Badge className="bg-green-500/20 text-green-300">Sí</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Database className="h-5 w-5 text-blue-400" />
                    Datos Almacenados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Información Personal</span>
                      <span className="text-white text-sm">Básica</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Historial de Compras</span>
                      <span className="text-white text-sm">24 registros</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Preferencias</span>
                      <span className="text-white text-sm">Configurado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Bell className="h-5 w-5 text-purple-400" />
                    Comunicaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Email Marketing</span>
                      <Badge className="bg-green-500/20 text-green-300">Activo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">Notificaciones</span>
                      <Badge className="bg-green-500/20 text-green-300">Activo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300 text-sm">SMS</span>
                      <Badge className="bg-gray-500/20 text-gray-300">Inactivo</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-white">Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => setActiveSection('settings')}
                    className="justify-start h-auto p-4"
                    variant="outline"
                    data-testid="button-quick-settings"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Settings className="h-4 w-4" />
                        <span className="font-medium">Configurar</span>
                      </div>
                      <p className="text-xs text-gray-400">Ajustar permisos</p>
                    </div>
                  </Button>

                  <Button
                    onClick={() => setActiveSection('data')}
                    className="justify-start h-auto p-4"
                    variant="outline"
                    data-testid="button-quick-export"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Download className="h-4 w-4" />
                        <span className="font-medium">Exportar</span>
                      </div>
                      <p className="text-xs text-gray-400">Descargar datos</p>
                    </div>
                  </Button>

                  <Button
                    onClick={() => setActiveSection('rights')}
                    className="justify-start h-auto p-4"
                    variant="outline"
                    data-testid="button-quick-rights"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="h-4 w-4" />
                        <span className="font-medium">Mis Derechos</span>
                      </div>
                      <p className="text-xs text-gray-400">Ver opciones</p>
                    </div>
                  </Button>

                  <Button
                    className="justify-start h-auto p-4"
                    variant="outline"
                    data-testid="button-quick-delete"
                  >
                    <div className="text-left">
                      <div className="flex items-center gap-2 mb-1">
                        <Trash2 className="h-4 w-4" />
                        <span className="font-medium">Eliminar</span>
                      </div>
                      <p className="text-xs text-gray-400">Borrar cuenta</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Actividad Reciente de Privacidad</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <div className="flex-1">
                      <p className="text-white text-sm">Consentimiento de cookies actualizado</p>
                      <p className="text-gray-400 text-xs">Hace 2 días</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                    <Settings className="h-5 w-5 text-blue-400" />
                    <div className="flex-1">
                      <p className="text-white text-sm">Configuración de marketing modificada</p>
                      <p className="text-gray-400 text-xs">Hace 1 semana</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                    <Download className="h-5 w-5 text-purple-400" />
                    <div className="flex-1">
                      <p className="text-white text-sm">Datos exportados</p>
                      <p className="text-gray-400 text-xs">Hace 2 semanas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'settings' && (
          <PrivacySettingsPanel />
        )}

        {activeSection === 'data' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Database className="h-12 w-12 mx-auto mb-4 text-blue-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Gestión de Mis Datos</h2>
              <p className="text-gray-400">Accede, descarga o elimina tu información personal</p>
            </div>

            {/* Data Overview */}
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Resumen de Datos Almacenados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-blue-300 mb-3">Información Personal</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                        <span className="text-gray-300 text-sm">Nombre completo</span>
                        <span className="text-white text-sm">Juan Pérez</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                        <span className="text-gray-300 text-sm">Email</span>
                        <span className="text-white text-sm">juan@ejemplo.com</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                        <span className="text-gray-300 text-sm">Teléfono</span>
                        <span className="text-white text-sm">+1 234 567 8900</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                        <span className="text-gray-300 text-sm">Dirección</span>
                        <span className="text-white text-sm">123 Main St</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold text-green-300 mb-3">Datos de Actividad</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                        <span className="text-gray-300 text-sm">Compras realizadas</span>
                        <span className="text-white text-sm">24</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                        <span className="text-gray-300 text-sm">Productos favoritos</span>
                        <span className="text-white text-sm">12</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                        <span className="text-gray-300 text-sm">Puntos acumulados</span>
                        <span className="text-white text-sm">2,450</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-gray-900/50 rounded">
                        <span className="text-gray-300 text-sm">Última actividad</span>
                        <span className="text-white text-sm">Hoy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-blue-500/10 border-blue-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-300">
                    <Download className="h-5 w-5" />
                    Exportar Datos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Descarga una copia completa de todos tus datos personales en formato JSON.
                  </p>
                  <Button className="w-full" data-testid="button-export-data">
                    <Download className="h-4 w-4 mr-2" />
                    Solicitar Exportación
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-yellow-500/10 border-yellow-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-300">
                    <Settings className="h-5 w-5" />
                    Corregir Datos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Actualiza o corrige información personal incorrecta o desactualizada.
                  </p>
                  <Button variant="outline" className="w-full" data-testid="button-correct-data">
                    <Settings className="h-4 w-4 mr-2" />
                    Editar Información
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-red-500/10 border-red-500/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300">
                    <Trash2 className="h-5 w-5" />
                    Eliminar Datos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Solicita la eliminación permanente de todos tus datos personales.
                  </p>
                  <Button variant="destructive" className="w-full" data-testid="button-delete-data">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Cuenta
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeSection === 'rights' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <Eye className="h-12 w-12 mx-auto mb-4 text-purple-400" />
              <h2 className="text-3xl font-bold text-white mb-2">Mis Derechos de Privacidad</h2>
              <p className="text-gray-400">Conoce y ejerce tus derechos sobre datos personales</p>
            </div>

            {/* Rights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-300">
                    <Eye className="h-5 w-5" />
                    Derecho de Acceso
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Puedes solicitar información sobre qué datos personales procesamos sobre ti.
                  </p>
                  <ul className="text-gray-400 text-xs space-y-1 mb-4">
                    <li>• Qué datos tenemos</li>
                    <li>• Cómo los obtenemos</li>
                    <li>• Para qué los usamos</li>
                    <li>• Con quién los compartimos</li>
                  </ul>
                  <Button variant="outline" size="sm" className="w-full">
                    Solicitar Acceso
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-300">
                    <Settings className="h-5 w-5" />
                    Derecho de Rectificación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Puedes corregir información personal inexacta o incompleta.
                  </p>
                  <ul className="text-gray-400 text-xs space-y-1 mb-4">
                    <li>• Corrección inmediata</li>
                    <li>• Actualización de registros</li>
                    <li>• Sin costo adicional</li>
                    <li>• Confirmación por email</li>
                  </ul>
                  <Button variant="outline" size="sm" className="w-full">
                    Corregir Datos
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-300">
                    <Trash2 className="h-5 w-5" />
                    Derecho al Olvido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Puedes solicitar la eliminación de tus datos cuando ya no sean necesarios.
                  </p>
                  <ul className="text-gray-400 text-xs space-y-1 mb-4">
                    <li>• Eliminación completa</li>
                    <li>• Proceso irreversible</li>
                    <li>• Confirmación requerida</li>
                    <li>• Retención legal respetada</li>
                  </ul>
                  <Button variant="destructive" size="sm" className="w-full">
                    Solicitar Eliminación
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-300">
                    <Download className="h-5 w-5" />
                    Portabilidad de Datos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4">
                    Puedes obtener tus datos en formato estructurado para transferir a otro servicio.
                  </p>
                  <ul className="text-gray-400 text-xs space-y-1 mb-4">
                    <li>• Formato JSON estándar</li>
                    <li>• Datos completos</li>
                    <li>• Fácil importación</li>
                    <li>• Procesamiento en 48h</li>
                  </ul>
                  <Button variant="outline" size="sm" className="w-full">
                    Exportar Datos
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <Card className="bg-blue-500/10 border-blue-500/30">
              <CardHeader>
                <CardTitle className="text-blue-300">¿Necesitas Ayuda?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  Si tienes preguntas sobre tus derechos de privacidad o necesitas asistencia para ejercerlos, contáctanos.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-blue-300 font-medium">Email</span>
                    <p className="text-gray-300 text-sm">privacy@gtrcubauto.com</p>
                  </div>
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-blue-300 font-medium">Teléfono</span>
                    <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
                  </div>
                  <div className="text-center p-3 bg-gray-900/50 rounded-lg">
                    <span className="text-blue-300 font-medium">Horario</span>
                    <p className="text-gray-300 text-sm">Lun-Vie 9:00-18:00</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}