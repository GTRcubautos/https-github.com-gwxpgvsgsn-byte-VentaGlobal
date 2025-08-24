import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Users
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

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
  const { data: backups = [], isLoading } = useQuery({
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
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      id: 'users',
      name: 'Datos de Usuarios',
      description: 'Información de usuarios y perfiles',
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      id: 'orders',
      name: 'Órdenes y Transacciones',
      description: 'Historial de compras y pagos',
      icon: FileArchive,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      id: 'security',
      name: 'Logs de Seguridad',
      description: 'Auditoría y eventos de seguridad',
      icon: Shield,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'running':
        return <RotateCcw className="h-4 w-4 text-blue-400 animate-spin" />;
      case 'failed':
        return <AlertTriangle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'running':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Respaldo de Datos</h2>
          <p className="text-gray-400">Gestión y creación de respaldos del sistema</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <HardDrive className="h-4 w-4" />
          <span>Último respaldo: Hace 2 horas</span>
        </div>
      </div>

      {/* Quick Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {backupTypes.map((type) => {
          const Icon = type.icon;
          const isActive = activeBackupType === type.id;
          
          return (
            <Card 
              key={type.id} 
              className={`bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all cursor-pointer ${
                isActive ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => !isActive && createBackupMutation.mutate(type.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${type.bgColor}`}>
                    <Icon className={`h-5 w-5 ${type.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm">{type.name}</h3>
                    <p className="text-xs text-gray-400 mt-1">{type.description}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3 h-7 text-xs"
                      disabled={isActive || createBackupMutation.isPending}
                      data-testid={`button-backup-${type.id}`}
                    >
                      {isActive ? (
                        <>
                          <RotateCcw className="h-3 w-3 mr-1 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        <>
                          <Download className="h-3 w-3 mr-1" />
                          Crear
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Backup History */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Clock className="h-5 w-5 text-blue-400" />
            Historial de Respaldos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RotateCcw className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-400">Cargando historial...</span>
            </div>
          ) : backups.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay respaldos disponibles</p>
              <p className="text-sm">Crea tu primer respaldo usando los botones de arriba</p>
            </div>
          ) : (
            <div className="space-y-3">
              {backups.map((backup: BackupItem) => (
                <div 
                  key={backup.id}
                  className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(backup.status)}
                      <Badge className={getStatusColor(backup.status)}>
                        {backup.status === 'completed' ? 'Completado' :
                         backup.status === 'running' ? 'En Progreso' : 'Fallido'}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-white">{backup.description}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                        <span>Tamaño: {backup.size}</span>
                        <span>•</span>
                        <span>{new Date(backup.createdAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {backup.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadBackupMutation.mutate(backup.id)}
                        disabled={downloadBackupMutation.isPending}
                        data-testid={`button-download-${backup.id}`}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Descargar
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-amber-500/10 border-amber-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-300 mb-1">Seguridad de Respaldos</h4>
              <p className="text-sm text-amber-200/80">
                Los respaldos están encriptados y almacenados de forma segura. 
                Recomendamos crear respaldos completos semanalmente y respaldos incrementales diariamente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}