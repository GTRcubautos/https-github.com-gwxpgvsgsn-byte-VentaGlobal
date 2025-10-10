import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Download, 
  Database, 
  Clock, 
  Shield,
  AlertTriangle,
  CheckCircle,
  RotateCcw,
  HardDrive,
  FileArchive,
  Users,
  Activity
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BackupItem {
  id: string;
  type: 'full' | 'incremental' | 'users' | 'orders' | 'security';
  size: string;
  status: 'completed' | 'running' | 'failed';
  createdAt: string;
  description: string;
}

export default function DataBackupPanel() {
  const { toast } = useToast();
  const [activeBackupType, setActiveBackupType] = useState<string | null>(null);

  // Fetch backup history
  const { data: backups = [], isLoading } = useQuery<BackupItem[]>({
    queryKey: ['/api/admin/backups'],
  });

  // Create backup mutation
  const createBackupMutation = useMutation({
    mutationFn: async (backupType: string) => {
      return apiRequest('POST', '/api/admin/backups', { type: backupType });
    },
    onMutate: (backupType) => {
      setActiveBackupType(backupType);
    },
    onSuccess: (data) => {
      toast({
        title: "Respaldo Creado",
        description: "El respaldo se ha completado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/backups'] });
      setActiveBackupType(null);
    },
    onError: (error) => {
      toast({
        title: "Error en el Respaldo",
        description: "No se pudo crear el respaldo. Intente nuevamente.",
        variant: "destructive",
      });
      setActiveBackupType(null);
    },
  });

  // Download backup mutation
  const downloadBackupMutation = useMutation({
    mutationFn: async (backupId: string) => {
      const response = await fetch(`/api/admin/backups/${backupId}/download`);
      if (!response.ok) throw new Error('Error downloading backup');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup-${backupId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast({
        title: "Descarga Iniciada",
        description: "El archivo de respaldo se está descargando.",
      });
    },
    onError: () => {
      toast({
        title: "Error de Descarga",
        description: "No se pudo descargar el respaldo.",
        variant: "destructive",
      });
    },
  });

  const backupTypes = [
    {
      id: 'full',
      name: 'Respaldo Completo',
      description: 'Todos los datos del sistema',
      icon: Database,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800',
      gradientFrom: 'from-blue-50',
      gradientTo: 'to-cyan-50'
    },
    {
      id: 'users',
      name: 'Datos de Usuarios',
      description: 'Información de usuarios y perfiles',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'border-green-200 dark:border-green-800',
      gradientFrom: 'from-green-50',
      gradientTo: 'to-emerald-50'
    },
    {
      id: 'orders',
      name: 'Órdenes y Transacciones',
      description: 'Historial de compras y pagos',
      icon: FileArchive,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800',
      gradientFrom: 'from-purple-50',
      gradientTo: 'to-pink-50'
    },
    {
      id: 'security',
      name: 'Logs de Seguridad',
      description: 'Auditoría y eventos de seguridad',
      icon: Shield,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      borderColor: 'border-orange-200 dark:border-orange-800',
      gradientFrom: 'from-orange-50',
      gradientTo: 'to-amber-50'
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'running':
        return <RotateCcw className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-200 dark:border-gray-800';
    }
  };

  const lastBackup = backups.length > 0 ? backups[0] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
            <HardDrive className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Respaldo de Datos</h2>
            <p className="text-gray-500 dark:text-gray-400">Gestión y creación de respaldos del sistema</p>
          </div>
        </div>
        {lastBackup && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-lg">
            <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>Último respaldo: {format(new Date(lastBackup.createdAt), "dd MMM, HH:mm", { locale: es })}</span>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Respaldos</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{backups.length}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Completados
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
              {backups.filter(b => b.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="p-4">
            <div className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <RotateCcw className="h-3 w-3" />
              En Progreso
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
              {backups.filter(b => b.status === 'running').length}
            </div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              Fallidos
            </div>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">
              {backups.filter(b => b.status === 'failed').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {backupTypes.map((type) => {
          const Icon = type.icon;
          const isActive = activeBackupType === type.id;
          
          return (
            <TooltipProvider key={type.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Card 
                    className={`border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all cursor-pointer ${
                      isActive ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
                    }`}
                    onClick={() => !isActive && createBackupMutation.mutate(type.id)}
                  >
                    <CardHeader className={`bg-gradient-to-br ${type.gradientFrom} ${type.gradientTo} dark:from-gray-800 dark:to-gray-900 pb-3`}>
                      <div className={`inline-flex p-2.5 rounded-lg ${type.bgColor} ${type.borderColor} border w-fit`}>
                        <Icon className={`h-5 w-5 ${type.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4 pb-4">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">{type.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{type.description}</p>
                      <Button
                        size="sm"
                        className={`w-full h-8 text-xs ${
                          isActive 
                            ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                        disabled={isActive || createBackupMutation.isPending}
                        data-testid={`button-backup-${type.id}`}
                      >
                        {isActive ? (
                          <>
                            <RotateCcw className="h-3 w-3 mr-1.5 animate-spin" />
                            Creando...
                          </>
                        ) : (
                          <>
                            <Download className="h-3 w-3 mr-1.5" />
                            Crear Respaldo
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Hacer clic para crear respaldo de {type.name.toLowerCase()}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>

      {/* Backup History */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-900">
          <CardTitle className="flex items-center gap-2 text-gray-800 dark:text-gray-100">
            <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            Historial de Respaldos
            {backups.length > 0 && (
              <Badge variant="outline" className="ml-auto">{backups.length} total</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <RotateCcw className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
              <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando historial...</span>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Database className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No hay respaldos disponibles</p>
              <p className="text-sm mt-1">Crea tu primer respaldo usando los botones de arriba</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {backups.map((backup) => (
                <div 
                  key={backup.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(backup.status)}
                        <Badge variant="outline" className={`${getStatusColor(backup.status)} text-xs`}>
                          {backup.status === 'completed' ? 'Completado' :
                           backup.status === 'running' ? 'En Progreso' : 'Fallido'}
                        </Badge>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 dark:text-gray-100">{backup.description}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <HardDrive className="h-3 w-3" />
                            {backup.size}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(backup.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {backup.status === 'completed' && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadBackupMutation.mutate(backup.id)}
                                disabled={downloadBackupMutation.isPending}
                                className="border-gray-300 dark:border-gray-600"
                                data-testid={`button-download-${backup.id}`}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Descargar respaldo</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
              <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Seguridad de Respaldos</h4>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Los respaldos están encriptados y almacenados de forma segura. 
                Recomendamos crear respaldos completos semanalmente y respaldos incrementales diariamente para mantener la integridad de tus datos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
