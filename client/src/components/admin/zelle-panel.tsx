import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Send, 
  Settings, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  CreditCard,
  Zap
} from 'lucide-react';
import {
  Alert,
  AlertDescription,
} from '@/components/ui/alert';

interface ZelleConfig {
  bankName: string;
  accountHolderName: string;
  minimumTransferAmount: number;
  transferSchedule: string;
  autoTransferEnabled: boolean;
}

interface ZelleEarnings {
  dailyEarnings: number;
  minimumTransfer: number;
  canTransfer: boolean;
  timestamp: string;
}

export default function ZellePanel() {
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMemo, setTransferMemo] = useState('GTR CUBAUTO - Transferencia manual');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Consultar configuración de Zelle
  const { data: zelleConfig, isLoading: configLoading } = useQuery<ZelleConfig>({
    queryKey: ['/api/zelle/config'],
  });

  // Consultar ganancias diarias
  const { data: earnings, isLoading: earningsLoading } = useQuery<ZelleEarnings>({
    queryKey: ['/api/zelle/earnings'],
    refetchInterval: 30000, // Actualizar cada 30 segundos
  });

  // Mutación para transferencia manual
  const transferMutation = useMutation({
    mutationFn: async (data: { amount: number; memo: string }) => {
      return apiRequest('POST', '/api/zelle/transfer', data);
    },
    onSuccess: (result: any) => {
      toast({
        title: "Transferencia iniciada",
        description: `Transferencia de $${result.amount || transferAmount} procesada exitosamente`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/zelle/earnings'] });
      setTransferAmount('');
    },
    onError: (error: any) => {
      toast({
        title: "Error en transferencia",
        description: error.message || "Error al procesar transferencia",
        variant: "destructive",
      });
    },
  });

  // Mutación para transferencia automática
  const autoTransferMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/zelle/auto-transfer', {});
    },
    onSuccess: (result: any) => {
      if (result.transferId) {
        toast({
          title: "Transferencia automática completada",
          description: `$${result.amount || '0.00'} transferido automáticamente`,
        });
      } else {
        toast({
          title: "Transferencia automática",
          description: result.message || "Transferencia procesada",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['/api/zelle/earnings'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error en transferencia automática",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleManualTransfer = () => {
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Error",
        description: "Ingrese un monto válido",
        variant: "destructive",
      });
      return;
    }

    transferMutation.mutate({ amount, memo: transferMemo });
  };

  const handleAutoTransfer = () => {
    autoTransferMutation.mutate();
  };

  if (configLoading || earningsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-700">Automatización Zelle</h2>
        <Badge variant={zelleConfig?.autoTransferEnabled ? "default" : "secondary"}>
          {zelleConfig?.autoTransferEnabled ? "Activo" : "Inactivo"}
        </Badge>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">${earnings?.dailyEarnings?.toFixed(2) || '0.00'}</p>
                <p className="text-sm text-gray-500">Ganancias Hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">${zelleConfig?.minimumTransferAmount || 0}</p>
                <p className="text-sm text-gray-500">Mínimo Transferencia</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold capitalize">{zelleConfig?.transferSchedule || 'N/A'}</p>
                <p className="text-sm text-gray-500">Frecuencia Auto</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Estado */}
      {earnings?.canTransfer && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            ✅ Ganancias disponibles para transferir: ${earnings.dailyEarnings.toFixed(2)}
          </AlertDescription>
        </Alert>
      )}

      {!earnings?.canTransfer && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            ⏳ Ganancias insuficientes para transferencia automática (${earnings?.dailyEarnings?.toFixed(2) || '0.00'} / ${earnings?.minimumTransfer || 0})
          </AlertDescription>
        </Alert>
      )}

      {/* Transferencias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transferencia Manual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <Send className="h-5 w-5" />
              Transferencia Manual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="amount">Monto a transferir</Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                data-testid="input-transfer-amount"
              />
            </div>
            <div>
              <Label htmlFor="memo">Nota (opcional)</Label>
              <Input
                id="memo"
                placeholder="Concepto de transferencia"
                value={transferMemo}
                onChange={(e) => setTransferMemo(e.target.value)}
                data-testid="input-transfer-memo"
              />
            </div>
            <Button 
              onClick={handleManualTransfer}
              disabled={transferMutation.isPending}
              className="w-full"
              data-testid="button-manual-transfer"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              {transferMutation.isPending ? 'Procesando...' : 'Transferir a Zelle'}
            </Button>
          </CardContent>
        </Card>

        {/* Transferencia Automática */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-700">
              <Zap className="h-5 w-5" />
              Transferencia Automática
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <strong>Cuenta destino:</strong> {zelleConfig?.accountHolderName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Banco:</strong> {zelleConfig?.bankName}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Frecuencia:</strong> {zelleConfig?.transferSchedule}
              </p>
            </div>
            
            <Button 
              onClick={handleAutoTransfer}
              disabled={autoTransferMutation.isPending || !earnings?.canTransfer}
              className="w-full"
              variant={earnings?.canTransfer ? "default" : "outline"}
              data-testid="button-auto-transfer"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              {autoTransferMutation.isPending ? 'Procesando...' : 'Ejecutar Transferencia Auto'}
            </Button>

            {!earnings?.canTransfer && (
              <p className="text-xs text-gray-500 text-center">
                Transferencia automática disponible cuando las ganancias superen ${earnings?.minimumTransfer || 0}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Configuración */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-700">
            <Settings className="h-5 w-5" />
            Configuración Zelle
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Estado:</span>
              <Badge className="ml-2" variant={zelleConfig?.autoTransferEnabled ? "default" : "secondary"}>
                {zelleConfig?.autoTransferEnabled ? "Habilitado" : "Deshabilitado"}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Mínimo:</span> ${zelleConfig?.minimumTransferAmount}
            </div>
            <div>
              <span className="font-medium">Frecuencia:</span> {zelleConfig?.transferSchedule}
            </div>
            <div>
              <span className="font-medium">Última actualización:</span> {earnings?.timestamp ? new Date(earnings.timestamp).toLocaleString('es-ES') : 'N/A'}
            </div>
          </div>
          
          {/* Características de Seguridad */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Transferencias Seguras con Zelle</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
              <div>
                <span className="font-medium text-xs">Encriptación:</span>
                <p className="text-xs leading-tight">AES-256 para datos sensibles</p>
              </div>
              <div>
                <span className="font-medium text-xs">Autenticación:</span>
                <p className="text-xs leading-tight">Verificación 2FA opcional</p>
              </div>
              <div>
                <span className="font-medium text-xs">Detección:</span>
                <p className="text-xs leading-tight">Monitoreo anti-fraude activo</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}