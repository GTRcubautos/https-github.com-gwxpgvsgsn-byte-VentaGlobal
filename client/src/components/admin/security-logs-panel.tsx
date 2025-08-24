import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Search,
  Filter,
  Download,
  Calendar,
  User,
  Globe,
  Lock,
  Unlock,
  UserX,
  CreditCard,
  Database,
  Settings,
  RefreshCw,
  ExternalLink
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface SecurityLog {
  id: string;
  eventType: 'login_attempt' | 'failed_login' | 'data_access' | 'admin_action' | 'payment_fraud' | 'privacy_violation' | 'system_breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  userEmail?: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  createdAt: string;
}

export default function SecurityLogsPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);

  // Fetch security logs
  const { data: logs = [], isLoading, refetch } = useQuery<SecurityLog[]>({
    queryKey: ['/api/admin/security-logs', { search: searchTerm, severity: severityFilter, eventType: eventTypeFilter }],
  });

  const eventTypeConfig = {
    login_attempt: { 
      label: 'Intento de Login', 
      icon: User, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30'
    },
    failed_login: { 
      label: 'Login Fallido', 
      icon: UserX, 
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30'
    },
    data_access: { 
      label: 'Acceso a Datos', 
      icon: Database, 
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/20',
      borderColor: 'border-cyan-500/30'
    },
    admin_action: { 
      label: 'Acción Admin', 
      icon: Settings, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30'
    },
    payment_fraud: { 
      label: 'Fraude de Pago', 
      icon: CreditCard, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    },
    privacy_violation: { 
      label: 'Violación Privacidad', 
      icon: Lock, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30'
    },
    system_breach: { 
      label: 'Brecha del Sistema', 
      icon: AlertTriangle, 
      color: 'text-red-500',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/30'
    }
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { color: 'bg-red-500/20 text-red-300 border-red-500/30', label: 'Crítico' };
      case 'high':
        return { color: 'bg-orange-500/20 text-orange-300 border-orange-500/30', label: 'Alto' };
      case 'medium':
        return { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', label: 'Medio' };
      case 'low':
        return { color: 'bg-green-500/20 text-green-300 border-green-500/30', label: 'Bajo' };
      default:
        return { color: 'bg-gray-500/20 text-gray-300 border-gray-500/30', label: 'N/A' };
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch = !searchTerm || 
      log.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm) ||
      log.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    const matchesEventType = eventTypeFilter === 'all' || log.eventType === eventTypeFilter;
    
    return matchesSearch && matchesSeverity && matchesEventType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Logs de Seguridad</h2>
          <p className="text-gray-400">Monitoreo y auditoría de eventos de seguridad</p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  data-testid="button-refresh-logs"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Actualizar
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black text-white border-gray-600">
                <p>Actualizar lista de logs de seguridad</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  data-testid="button-export-logs"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-black text-white border-gray-600">
                <p>Descargar logs en formato CSV</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por email, IP o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-900/50 border-gray-600"
                  data-testid="input-search-logs"
                />
              </div>
            </div>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-900/50 border-gray-600" data-testid="select-severity-filter">
                <SelectValue placeholder="Severidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las severidades</SelectItem>
                <SelectItem value="critical">Crítico</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="medium">Medio</SelectItem>
                <SelectItem value="low">Bajo</SelectItem>
              </SelectContent>
            </Select>

            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-gray-900/50 border-gray-600" data-testid="select-event-type-filter">
                <SelectValue placeholder="Tipo de Evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los eventos</SelectItem>
                <SelectItem value="login_attempt">Intento de Login</SelectItem>
                <SelectItem value="failed_login">Login Fallido</SelectItem>
                <SelectItem value="data_access">Acceso a Datos</SelectItem>
                <SelectItem value="admin_action">Acción Admin</SelectItem>
                <SelectItem value="payment_fraud">Fraude de Pago</SelectItem>
                <SelectItem value="privacy_violation">Violación Privacidad</SelectItem>
                <SelectItem value="system_breach">Brecha del Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-red-300">
                  {logs.filter((l: SecurityLog) => l.severity === 'critical').length}
                </p>
                <p className="text-sm text-red-200">Eventos Críticos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserX className="h-8 w-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-orange-300">
                  {logs.filter((l: SecurityLog) => l.eventType === 'failed_login').length}
                </p>
                <p className="text-sm text-orange-200">Logins Fallidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-500/10 border-yellow-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Lock className="h-8 w-8 text-yellow-400" />
              <div>
                <p className="text-2xl font-bold text-yellow-300">
                  {logs.filter((l: SecurityLog) => l.eventType === 'privacy_violation').length}
                </p>
                <p className="text-sm text-yellow-200">Violaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-300">{logs.length}</p>
                <p className="text-sm text-blue-200">Total Eventos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs Table */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Shield className="h-5 w-5 text-cyan-400" />
            Registro de Eventos ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-400">Cargando logs...</span>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No se encontraron logs con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log: SecurityLog) => {
                const eventConfig = eventTypeConfig[log.eventType];
                const severityConfig = getSeverityConfig(log.severity);
                const EventIcon = eventConfig.icon;
                
                return (
                  <div 
                    key={log.id}
                    className={`flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border hover:bg-gray-900/50 transition-colors cursor-pointer ${eventConfig.borderColor}`}
                    onClick={() => setSelectedLog(log)}
                    data-testid={`log-item-${log.id}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`p-2 rounded-lg ${eventConfig.bgColor}`}>
                        <EventIcon className={`h-4 w-4 ${eventConfig.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">{eventConfig.label}</span>
                          <Badge className={severityConfig.color}>
                            {severityConfig.label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          {log.userEmail && (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {log.userEmail}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {log.ipAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(log.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-view-details-${log.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      {selectedLog && (
        <Card className="fixed inset-4 md:inset-20 bg-gray-800 border-gray-600 z-50 overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-cyan-400" />
                Detalles del Evento
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLog(null)}
                data-testid="button-close-details"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">Tipo de Evento</label>
                <p className="text-white">{eventTypeConfig[selectedLog.eventType]?.label}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Severidad</label>
                <p className="text-white">{getSeverityConfig(selectedLog.severity).label}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Usuario</label>
                <p className="text-white">{selectedLog.userEmail || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Dirección IP</label>
                <p className="text-white">{selectedLog.ipAddress}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-gray-300">User Agent</label>
                <p className="text-white text-sm break-all">{selectedLog.userAgent}</p>
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300">Detalles Adicionales</label>
              <pre className="mt-2 p-4 bg-gray-900/50 rounded-lg text-sm text-gray-300 overflow-auto">
                {JSON.stringify(selectedLog.details, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}