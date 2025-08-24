import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  Eye, 
  Mail, 
  Share2,
  Download,
  Trash2,
  Clock,
  Lock,
  AlertTriangle,
  CheckCircle,
  Settings,
  Database,
  Globe,
  UserCheck,
  FileText,
  History
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface PrivacySettings {
  id: string;
  userId: string;
  dataRetention: number; // days
  marketingEmails: boolean;
  analyticsTracking: boolean;
  dataSharing: boolean;
  cookiePreferences: {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  profileVisibility: 'public' | 'private' | 'friends';
  activityTracking: boolean;
  locationData: boolean;
  updatedAt: string;
}

interface DataRequest {
  id: string;
  requestType: 'export' | 'delete' | 'correction';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  processedAt?: string;
  downloadUrl?: string;
}

export default function PrivacySettingsPanel() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<PrivacySettings | null>(null);

  // Fetch current privacy settings
  const { data: privacySettings, isLoading } = useQuery({
    queryKey: ['/api/user-privacy-settings/me'],
    onSuccess: (data) => {
      setSettings(data);
    }
  });

  // Fetch data requests history
  const { data: dataRequests = [] } = useQuery({
    queryKey: ['/api/data-requests/me'],
  });

  // Update privacy settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: Partial<PrivacySettings>) => {
      return apiRequest('PUT', '/api/user-privacy-settings/me', newSettings);
    },
    onSuccess: () => {
      toast({
        title: "Configuración Actualizada",
        description: "Tu configuración de privacidad ha sido guardada.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/user-privacy-settings/me'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar la configuración.",
        variant: "destructive",
      });
    },
  });

  // Request data export
  const requestDataExportMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/data-requests', {
        requestType: 'export',
        reason: 'User requested data export'
      });
    },
    onSuccess: () => {
      toast({
        title: "Solicitud Enviada",
        description: "Tu solicitud de exportación de datos está siendo procesada.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/data-requests/me'] });
    },
  });

  // Request data deletion
  const requestDataDeletionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/data-requests', {
        requestType: 'delete',
        reason: 'User requested account deletion'
      });
    },
    onSuccess: () => {
      toast({
        title: "Solicitud de Eliminación Enviada",
        description: "Tu solicitud de eliminación de datos está siendo procesada.",
        variant: "destructive",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/data-requests/me'] });
    },
  });

  const handleSettingChange = (key: string, value: any) => {
    if (!settings) return;
    
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettingsMutation.mutate({ [key]: value });
  };

  const handleCookiePreferenceChange = (cookieType: string, enabled: boolean) => {
    if (!settings) return;
    
    const newCookiePreferences = {
      ...settings.cookiePreferences,
      [cookieType]: enabled
    };
    
    const newSettings = {
      ...settings,
      cookiePreferences: newCookiePreferences
    };
    
    setSettings(newSettings);
    updateSettingsMutation.mutate({ cookiePreferences: newCookiePreferences });
  };

  const getRequestStatusConfig = (status: string) => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' };
      case 'processing':
        return { icon: Clock, color: 'text-blue-400', bgColor: 'bg-blue-500/20', borderColor: 'border-blue-500/30' };
      case 'failed':
        return { icon: AlertTriangle, color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' };
      case 'pending':
      default:
        return { icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Settings className="h-12 w-12 animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-400">Cargando configuración de privacidad...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <Shield className="h-12 w-12 mx-auto mb-4 text-blue-400" />
        <h1 className="text-3xl font-bold text-white mb-2">Configuración de Privacidad</h1>
        <p className="text-gray-400">Gestiona cómo usamos y compartimos tu información</p>
      </div>

      {/* Privacy Overview */}
      <Card className="bg-blue-500/10 border-blue-500/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <UserCheck className="h-8 w-8 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-blue-300 mb-2">Tu Privacidad es Importante</h3>
              <p className="text-blue-200/80 text-sm">
                Tienes control total sobre tu información personal. Puedes modificar estas configuraciones en cualquier momento 
                y solicitar la exportación o eliminación de tus datos según las leyes de protección de datos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Collection Settings */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-5 w-5 text-cyan-400" />
            Recopilación de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white font-medium">Emails de Marketing</Label>
              <p className="text-sm text-gray-400">
                Recibir ofertas especiales, nuevos productos y promociones
              </p>
            </div>
            <Switch
              checked={settings?.marketingEmails || false}
              onCheckedChange={(checked) => handleSettingChange('marketingEmails', checked)}
              data-testid="switch-marketing-emails"
            />
          </div>

          <Separator className="bg-gray-600" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white font-medium">Seguimiento de Analytics</Label>
              <p className="text-sm text-gray-400">
                Ayúdanos a mejorar tu experiencia con datos de uso anónimos
              </p>
            </div>
            <Switch
              checked={settings?.analyticsTracking || false}
              onCheckedChange={(checked) => handleSettingChange('analyticsTracking', checked)}
              data-testid="switch-analytics-tracking"
            />
          </div>

          <Separator className="bg-gray-600" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white font-medium">Compartir Datos con Socios</Label>
              <p className="text-sm text-gray-400">
                Permitir que socios de confianza mejoren nuestros servicios
              </p>
            </div>
            <Switch
              checked={settings?.dataSharing || false}
              onCheckedChange={(checked) => handleSettingChange('dataSharing', checked)}
              data-testid="switch-data-sharing"
            />
          </div>

          <Separator className="bg-gray-600" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white font-medium">Seguimiento de Actividad</Label>
              <p className="text-sm text-gray-400">
                Rastrear tu actividad para personalizar tu experiencia
              </p>
            </div>
            <Switch
              checked={settings?.activityTracking || false}
              onCheckedChange={(checked) => handleSettingChange('activityTracking', checked)}
              data-testid="switch-activity-tracking"
            />
          </div>

          <Separator className="bg-gray-600" />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white font-medium">Datos de Ubicación</Label>
              <p className="text-sm text-gray-400">
                Usar tu ubicación para mejorar entregas y servicios locales
              </p>
            </div>
            <Switch
              checked={settings?.locationData || false}
              onCheckedChange={(checked) => handleSettingChange('locationData', checked)}
              data-testid="switch-location-data"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cookie Preferences */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Globe className="h-5 w-5 text-orange-400" />
            Preferencias de Cookies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div>
                  <Label className="text-white font-medium">Cookies Necesarias</Label>
                  <p className="text-xs text-gray-400">Requeridas para el funcionamiento</p>
                </div>
                <Switch
                  checked={true}
                  disabled={true}
                  data-testid="switch-necessary-cookies"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div>
                  <Label className="text-white font-medium">Cookies Funcionales</Label>
                  <p className="text-xs text-gray-400">Mejoran la experiencia de usuario</p>
                </div>
                <Switch
                  checked={settings?.cookiePreferences?.functional || false}
                  onCheckedChange={(checked) => handleCookiePreferenceChange('functional', checked)}
                  data-testid="switch-functional-cookies"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div>
                  <Label className="text-white font-medium">Cookies de Analytics</Label>
                  <p className="text-xs text-gray-400">Nos ayudan a entender el uso</p>
                </div>
                <Switch
                  checked={settings?.cookiePreferences?.analytics || false}
                  onCheckedChange={(checked) => handleCookiePreferenceChange('analytics', checked)}
                  data-testid="switch-analytics-cookies"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                <div>
                  <Label className="text-white font-medium">Cookies de Marketing</Label>
                  <p className="text-xs text-gray-400">Para publicidad personalizada</p>
                </div>
                <Switch
                  checked={settings?.cookiePreferences?.marketing || false}
                  onCheckedChange={(checked) => handleCookiePreferenceChange('marketing', checked)}
                  data-testid="switch-marketing-cookies"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-purple-400" />
            Tus Derechos de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gray-900/50 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Download className="h-6 w-6 text-blue-400" />
                  <h4 className="font-semibold text-white">Exportar Mis Datos</h4>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Descarga una copia de todos tus datos personales
                </p>
                <Button
                  onClick={() => requestDataExportMutation.mutate()}
                  disabled={requestDataExportMutation.isPending}
                  className="w-full"
                  data-testid="button-export-data"
                >
                  {requestDataExportMutation.isPending ? 'Procesando...' : 'Solicitar Exportación'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-600">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Trash2 className="h-6 w-6 text-red-400" />
                  <h4 className="font-semibold text-white">Eliminar Mi Cuenta</h4>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Solicita la eliminación permanente de tu cuenta
                </p>
                <Button
                  onClick={() => requestDataDeletionMutation.mutate()}
                  disabled={requestDataDeletionMutation.isPending}
                  variant="destructive"
                  className="w-full"
                  data-testid="button-delete-account"
                >
                  {requestDataDeletionMutation.isPending ? 'Procesando...' : 'Solicitar Eliminación'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Data Requests History */}
      {dataRequests.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <History className="h-5 w-5 text-green-400" />
              Historial de Solicitudes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataRequests.map((request: DataRequest) => {
                const statusConfig = getRequestStatusConfig(request.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div 
                    key={request.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${statusConfig.bgColor} ${statusConfig.borderColor}`}
                  >
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
                      <div>
                        <p className="font-medium text-white">
                          {request.requestType === 'export' ? 'Exportación de Datos' : 
                           request.requestType === 'delete' ? 'Eliminación de Cuenta' : 'Corrección de Datos'}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={statusConfig.color}>
                        {request.status === 'completed' ? 'Completado' :
                         request.status === 'processing' ? 'Procesando' :
                         request.status === 'failed' ? 'Fallido' : 'Pendiente'}
                      </Badge>
                      {request.status === 'completed' && request.downloadUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(request.downloadUrl)}
                          data-testid={`button-download-${request.id}`}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Descargar
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Important Notice */}
      <Alert className="border-amber-500/30 bg-amber-500/10">
        <AlertTriangle className="h-4 w-4 text-amber-400" />
        <AlertDescription className="text-amber-200">
          <strong>Importante:</strong> Los cambios en tu configuración de privacidad pueden afectar la funcionalidad 
          de algunas características del sitio. Siempre puedes volver a habilitar las opciones cuando desees.
        </AlertDescription>
      </Alert>
    </div>
  );
}