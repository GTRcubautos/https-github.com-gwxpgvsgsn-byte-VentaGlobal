import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Shield } from 'lucide-react';

interface ProtectedAdminProps {
  children: React.ReactNode;
}

export default function ProtectedAdmin({ children }: ProtectedAdminProps) {
  const { isAuthenticated, isLoading } = useAdminAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-700 p-4 sm:p-6 md:p-8 max-w-md mx-auto">
          <CardContent className="flex flex-col items-center space-y-3 sm:space-y-4">
            <div className="animate-spin w-6 h-6 sm:w-8 sm:h-8 border-4 border-red-600 border-t-transparent rounded-full" />
            <p className="text-white text-sm sm:text-base">Verificando acceso...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-700 p-4 sm:p-6 md:p-8 max-w-md mx-auto">
          <CardContent className="flex flex-col items-center space-y-3 sm:space-y-4">
            <Shield className="h-12 w-12 sm:h-16 sm:w-16 text-red-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-white text-center">Acceso Denegado</h2>
            <p className="text-gray-400 text-center text-sm sm:text-base">
              Redirigiendo al formulario de autenticación...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}