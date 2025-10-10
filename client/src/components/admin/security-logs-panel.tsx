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
  ExternalLink,
  X
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    failed_login: { 
      label: 'Login Fallido', 
      icon: UserX, 
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      borderColor: 'border-orange-200 dark:border-orange-800'
    },
    data_access: { 
      label: 'Acceso a Datos', 
      icon: Database, 
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
      borderColor: 'border-cyan-200 dark:border-cyan-800'
    },
    admin_action: { 
      label: 'Acción Admin', 
      icon: Settings, 
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    payment_fraud: { 
      label: 'Fraude de Pago', 
      icon: CreditCard, 
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    privacy_violation: { 
      label: 'Violación Privacidad', 
      icon: Lock, 
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    system_breach: { 
      label: 'Brecha del Sistema', 
      icon: AlertTriangle, 
      color: 'text-red-700 dark:text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      borderColor: 'border-red-300 dark:border-red-700'
    }
  };

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-200 dark:border-red-800', 
          label: 'Crítico',
          dotColor: 'bg-red-500'
        };
      case 'high':
        return { 
          color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200 dark:border-orange-800', 
          label: 'Alto',
          dotColor: 'bg-orange-500'
        };
      case 'medium':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-200 dark:border-yellow-800', 
          label: 'Medio',
          dotColor: 'bg-yellow-500'
        };
      case 'low':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800', 
          label: 'Bajo',
          dotColor: 'bg-green-500'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-200 dark:border-gray-800', 
          label: 'N/A',
          dotColor: 'bg-gray-500'
        };
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

  const stats = {
    total: logs.length,
    critical: logs.filter(l => l.severity === 'critical').length,
    high: logs.filter(l => l.severity === 'high').length,
    medium: logs.filter(l => l.severity === 'medium').length,
    low: logs.filter(l => l.severity === 'low').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Logs de Seguridad</h2>
            <p className="text-gray-500 dark:text-gray-400">Monitoreo y auditoría de eventos de seguridad</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetch()}
                  className="border-gray-200 dark:border-gray-700"
                  data-testid="button-refresh-logs"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Actualizar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
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
                  className="border-gray-200 dark:border-gray-700"
                  data-testid="button-export-logs"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Exportar
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Descargar logs en formato CSV</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="border-gray-200 dark:border-gray-700">
          <CardContent className="p-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">Total Logs</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stats.total}</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
          <CardContent className="p-4">
            <div className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full"></span>
              Críticos
            </div>
            <div className="text-2xl font-bold text-red-700 dark:text-red-300 mt-1">{stats.critical}</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="p-4">
            <div className="text-sm text-orange-600 dark:text-orange-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-orange-500 rounded-full"></span>
              Alto
            </div>
            <div className="text-2xl font-bold text-orange-700 dark:text-orange-300 mt-1">{stats.high}</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
          <CardContent className="p-4">
            <div className="text-sm text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-yellow-500 rounded-full"></span>
              Medio
            </div>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">{stats.medium}</div>
          </CardContent>
        </Card>
        <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              Bajo
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">{stats.low}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-900">
          <CardTitle className="text-gray-800 dark:text-gray-100 flex items-center gap-2 text-base">
            <Filter className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por email, IP o ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:bg-gray-800"
                  data-testid="input-search-logs"
                />
              </div>
            </div>
            
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-48 border-gray-300 dark:border-gray-600 dark:bg-gray-800" data-testid="select-severity-filter">
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
              <SelectTrigger className="w-full md:w-48 border-gray-300 dark:border-gray-600 dark:bg-gray-800" data-testid="select-event-type-filter">
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

      {/* Logs List */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-gray-900">
          <CardTitle className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
            <Database className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Eventos de Seguridad
            <Badge variant="outline" className="ml-auto">{filteredLogs.length} resultados</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Database className="h-12 w-12 mb-4 opacity-50" />
              <p>No se encontraron logs de seguridad</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map((log) => {
                const eventConfig = eventTypeConfig[log.eventType];
                const EventIcon = eventConfig.icon;
                const severityConfig = getSeverityConfig(log.severity);

                return (
                  <div
                    key={log.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                    data-testid={`log-item-${log.id}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${eventConfig.bgColor} ${eventConfig.borderColor} border`}>
                        <EventIcon className={`h-5 w-5 ${eventConfig.color}`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium ${eventConfig.color}`}>
                            {eventConfig.label}
                          </span>
                          <Badge variant="outline" className={`border ${severityConfig.color} text-xs`}>
                            <span className={`inline-block w-1.5 h-1.5 ${severityConfig.dotColor} rounded-full mr-1.5`}></span>
                            {severityConfig.label}
                          </Badge>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                            {format(new Date(log.createdAt), "dd MMM yyyy, HH:mm", { locale: es })}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {log.userEmail && (
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span className="truncate max-w-[200px]">{log.userEmail}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            <span>{log.ipAddress}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLog(log);
                            }}
                            className="ml-auto text-xs h-6 px-2"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Ver detalles
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedLog(null)}>
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto border-gray-200 dark:border-gray-700 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-gray-800 dark:to-gray-900 sticky top-0 z-10">
              <div className="flex items-center justify-between">
                <CardTitle className="text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                  Detalles del Log de Seguridad
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLog(null)}
                  data-testid="button-close-log-detail"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tipo de Evento</p>
                  <p className="mt-1 text-gray-800 dark:text-gray-100">{eventTypeConfig[selectedLog.eventType].label}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Severidad</p>
                  <Badge variant="outline" className={`mt-1 ${getSeverityConfig(selectedLog.severity).color}`}>
                    {getSeverityConfig(selectedLog.severity).label}
                  </Badge>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dirección IP</p>
                  <p className="mt-1 text-gray-800 dark:text-gray-100 font-mono">{selectedLog.ipAddress}</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fecha y Hora</p>
                  <p className="mt-1 text-gray-800 dark:text-gray-100">
                    {format(new Date(selectedLog.createdAt), "dd MMMM yyyy, HH:mm:ss", { locale: es })}
                  </p>
                </div>
              </div>

              {selectedLog.userEmail && (
                <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuario</p>
                  <p className="mt-1 text-gray-800 dark:text-gray-100">{selectedLog.userEmail}</p>
                </div>
              )}

              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">User Agent</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-mono break-all">{selectedLog.userAgent}</p>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Detalles del Evento</p>
                <pre className="text-sm text-gray-600 dark:text-gray-300 font-mono overflow-x-auto p-3 bg-gray-100 dark:bg-gray-900 rounded">
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </div>

              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">ID del Log</p>
                <p className="mt-1 text-blue-800 dark:text-blue-300 font-mono text-xs">{selectedLog.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
