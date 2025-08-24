import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { 
  CreditCard, 
  AlertTriangle, 
  Shield,
  DollarSign,
  TrendingUp,
  Clock,
  Ban,
  CheckCircle,
  Eye,
  Settings,
  Zap,
  Lock,
  Globe,
  Smartphone,
  RefreshCw,
  BarChart3,
  Target,
  Flag
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface TransactionSecurity {
  id: string;
  orderId: string;
  userId: string;
  amount: string;
  paymentMethod: string;
  riskScore: number;
  fraudFlags: string[];
  ipAddress: string;
  location: string;
  deviceFingerprint: string;
  status: 'approved' | 'under_review' | 'rejected';
  createdAt: string;
  reviewedAt?: string;
}

interface FinancialLimit {
  id: string;
  userId: string;
  limitType: 'daily' | 'weekly' | 'monthly' | 'per_transaction';
  amount: number;
  currentUsage: number;
  isActive: boolean;
  lastReset: string;
}

interface FraudAlert {
  id: string;
  type: 'high_amount' | 'unusual_location' | 'multiple_attempts' | 'suspicious_pattern';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  userId?: string;
  orderId?: string;
  createdAt: string;
  resolved: boolean;
}

export default function FinancialSecurityPanel() {
  const { toast } = useToast();
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionSecurity | null>(null);
  const [dailyLimit, setDailyLimit] = useState<number>(5000);
  const [monthlyLimit, setMonthlyLimit] = useState<number>(50000);

  // Fetch transaction security data
  const { data: transactions = [], isLoading: loadingTransactions } = useQuery({
    queryKey: ['/api/admin/transaction-security'],
  });

  // Fetch financial limits
  const { data: limits = [], isLoading: loadingLimits } = useQuery({
    queryKey: ['/api/admin/financial-limits'],
  });

  // Fetch fraud alerts
  const { data: alerts = [], isLoading: loadingAlerts } = useQuery({
    queryKey: ['/api/admin/fraud-alerts'],
  });

  // Update transaction status
  const updateTransactionMutation = useMutation({
    mutationFn: async ({ transactionId, status }: { transactionId: string; status: string }) => {
      return apiRequest('PUT', `/api/admin/transaction-security/${transactionId}`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Estado Actualizado",
        description: "El estado de la transacción ha sido actualizado.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transaction-security'] });
      setSelectedTransaction(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado de la transacción.",
        variant: "destructive",
      });
    },
  });

  // Update financial limits
  const updateLimitsMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('PUT', '/api/admin/financial-limits', {
        dailyLimit,
        monthlyLimit
      });
    },
    onSuccess: () => {
      toast({
        title: "Límites Actualizados",
        description: "Los límites financieros han sido actualizados.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/financial-limits'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudieron actualizar los límites.",
        variant: "destructive",
      });
    },
  });

  // Resolve fraud alert
  const resolveAlertMutation = useMutation({
    mutationFn: async (alertId: string) => {
      return apiRequest('PUT', `/api/admin/fraud-alerts/${alertId}/resolve`);
    },
    onSuccess: () => {
      toast({
        title: "Alerta Resuelta",
        description: "La alerta de fraude ha sido marcada como resuelta.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/fraud-alerts'] });
    },
  });

  const getRiskLevelConfig = (riskScore: number) => {
    if (riskScore >= 80) {
      return { level: 'Crítico', color: 'text-red-400', bgColor: 'bg-red-500/20', borderColor: 'border-red-500/30' };
    } else if (riskScore >= 60) {
      return { level: 'Alto', color: 'text-orange-400', bgColor: 'bg-orange-500/20', borderColor: 'border-orange-500/30' };
    } else if (riskScore >= 40) {
      return { level: 'Medio', color: 'text-yellow-400', bgColor: 'bg-yellow-500/20', borderColor: 'border-yellow-500/30' };
    } else {
      return { level: 'Bajo', color: 'text-green-400', bgColor: 'bg-green-500/20', borderColor: 'border-green-500/30' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'approved':
        return { label: 'Aprobada', icon: CheckCircle, color: 'text-green-400', bgColor: 'bg-green-500/20' };
      case 'under_review':
        return { label: 'En Revisión', icon: Clock, color: 'text-yellow-400', bgColor: 'bg-yellow-500/20' };
      case 'rejected':
        return { label: 'Rechazada', icon: Ban, color: 'text-red-400', bgColor: 'bg-red-500/20' };
      default:
        return { label: 'Desconocido', icon: AlertTriangle, color: 'text-gray-400', bgColor: 'bg-gray-500/20' };
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

  const criticalAlerts = alerts.filter((alert: FraudAlert) => 
    alert.severity === 'critical' && !alert.resolved
  );

  const highRiskTransactions = transactions.filter((tx: TransactionSecurity) => 
    tx.riskScore >= 60 && tx.status === 'under_review'
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Seguridad Financiera</h2>
          <p className="text-gray-400">Monitoreo de transacciones y detección de fraude</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['/api/admin/transaction-security'] });
              queryClient.invalidateQueries({ queryKey: ['/api/admin/fraud-alerts'] });
            }}
            data-testid="button-refresh-security"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-500/30 bg-red-500/10">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-200">
            <strong>Alerta Crítica:</strong> Se detectaron {criticalAlerts.length} eventos de seguridad críticos 
            que requieren atención inmediata.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Flag className="h-8 w-8 text-red-400" />
              <div>
                <p className="text-2xl font-bold text-red-300">{criticalAlerts.length}</p>
                <p className="text-sm text-red-200">Alertas Críticas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-500/10 border-orange-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="h-8 w-8 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-orange-300">{highRiskTransactions.length}</p>
                <p className="text-sm text-orange-200">En Revisión</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-8 w-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-blue-300">{transactions.length}</p>
                <p className="text-sm text-blue-200">Transacciones Hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-500/10 border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-green-400" />
              <div>
                <p className="text-2xl font-bold text-green-300">
                  {Math.round((transactions.filter((tx: TransactionSecurity) => tx.status === 'approved').length / Math.max(transactions.length, 1)) * 100)}%
                </p>
                <p className="text-sm text-green-200">Tasa Aprobación</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Limits Configuration */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="h-5 w-5 text-blue-400" />
            Límites Financieros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="daily-limit" className="text-white font-medium">
                  Límite Diario por Usuario
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <Input
                    id="daily-limit"
                    type="number"
                    value={dailyLimit}
                    onChange={(e) => setDailyLimit(Number(e.target.value))}
                    className="bg-gray-900/50 border-gray-600"
                    data-testid="input-daily-limit"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="monthly-limit" className="text-white font-medium">
                  Límite Mensual por Usuario
                </Label>
                <div className="flex items-center gap-2 mt-2">
                  <DollarSign className="h-4 w-4 text-gray-400" />
                  <Input
                    id="monthly-limit"
                    type="number"
                    value={monthlyLimit}
                    onChange={(e) => setMonthlyLimit(Number(e.target.value))}
                    className="bg-gray-900/50 border-gray-600"
                    data-testid="input-monthly-limit"
                  />
                </div>
              </div>

              <Button
                onClick={() => updateLimitsMutation.mutate()}
                disabled={updateLimitsMutation.isPending}
                className="w-full"
                data-testid="button-update-limits"
              >
                {updateLimitsMutation.isPending ? 'Actualizando...' : 'Actualizar Límites'}
              </Button>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-white">Límites Actuales</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-300">Límite Diario:</span>
                  <span className="text-white font-medium">${dailyLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-300">Límite Mensual:</span>
                  <span className="text-white font-medium">${monthlyLimit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg">
                  <span className="text-gray-300">Por Transacción:</span>
                  <span className="text-white font-medium">$10,000</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fraud Alerts */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="h-5 w-5 text-yellow-400" />
            Alertas de Fraude ({alerts.filter((a: FraudAlert) => !a.resolved).length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingAlerts ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-400">Cargando alertas...</span>
            </div>
          ) : alerts.filter((a: FraudAlert) => !a.resolved).length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay alertas de fraude activas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.filter((alert: FraudAlert) => !alert.resolved).map((alert: FraudAlert) => {
                const severityConfig = getSeverityConfig(alert.severity);
                
                return (
                  <div 
                    key={alert.id}
                    className={`flex items-center justify-between p-4 rounded-lg border ${severityConfig.color}`}
                  >
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-current" />
                      <div>
                        <p className="font-medium text-white">{alert.description}</p>
                        <p className="text-sm text-gray-400">
                          {new Date(alert.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={severityConfig.color}>
                        {severityConfig.label}
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveAlertMutation.mutate(alert.id)}
                        disabled={resolveAlertMutation.isPending}
                        data-testid={`button-resolve-alert-${alert.id}`}
                      >
                        Resolver
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            Transacciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingTransactions ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-400">Cargando transacciones...</span>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CreditCard className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay transacciones disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((transaction: TransactionSecurity) => {
                const riskConfig = getRiskLevelConfig(transaction.riskScore);
                const statusConfig = getStatusConfig(transaction.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <div 
                    key={transaction.id}
                    className={`flex items-center justify-between p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:bg-gray-900/70 transition-colors cursor-pointer`}
                    onClick={() => setSelectedTransaction(transaction)}
                    data-testid={`transaction-item-${transaction.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${statusConfig.bgColor}`}>
                        <StatusIcon className={`h-4 w-4 ${statusConfig.color}`} />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-white">${transaction.amount}</span>
                          <Badge className={riskConfig.color}>
                            Riesgo: {riskConfig.level}
                          </Badge>
                          <Badge className={statusConfig.color}>
                            {statusConfig.label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {transaction.ipAddress}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(transaction.createdAt).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                          {transaction.fraudFlags.length > 0 && (
                            <span className="flex items-center gap-1 text-orange-400">
                              <Flag className="h-3 w-3" />
                              {transaction.fraudFlags.length} flags
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-view-transaction-${transaction.id}`}
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

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <Card className="fixed inset-4 md:inset-20 bg-gray-800 border-gray-600 z-50 overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5 text-cyan-400" />
                Detalles de Transacción
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTransaction(null)}
                data-testid="button-close-transaction-details"
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-300">ID de Orden</label>
                <p className="text-white">{selectedTransaction.orderId}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Monto</label>
                <p className="text-white text-xl font-bold">${selectedTransaction.amount}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Método de Pago</label>
                <p className="text-white">{selectedTransaction.paymentMethod}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Puntuación de Riesgo</label>
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold">{selectedTransaction.riskScore}/100</p>
                  <Badge className={getRiskLevelConfig(selectedTransaction.riskScore).color}>
                    {getRiskLevelConfig(selectedTransaction.riskScore).level}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Dirección IP</label>
                <p className="text-white">{selectedTransaction.ipAddress}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Ubicación</label>
                <p className="text-white">{selectedTransaction.location}</p>
              </div>
            </div>

            {selectedTransaction.fraudFlags.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-300">Flags de Fraude</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedTransaction.fraudFlags.map((flag, index) => (
                    <Badge key={index} variant="destructive">
                      {flag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {selectedTransaction.status === 'under_review' && (
              <div className="flex gap-3">
                <Button
                  onClick={() => updateTransactionMutation.mutate({
                    transactionId: selectedTransaction.id,
                    status: 'approved'
                  })}
                  disabled={updateTransactionMutation.isPending}
                  className="flex-1"
                  data-testid="button-approve-transaction"
                >
                  Aprobar Transacción
                </Button>
                <Button
                  onClick={() => updateTransactionMutation.mutate({
                    transactionId: selectedTransaction.id,
                    status: 'rejected'
                  })}
                  disabled={updateTransactionMutation.isPending}
                  variant="destructive"
                  className="flex-1"
                  data-testid="button-reject-transaction"
                >
                  Rechazar Transacción
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}