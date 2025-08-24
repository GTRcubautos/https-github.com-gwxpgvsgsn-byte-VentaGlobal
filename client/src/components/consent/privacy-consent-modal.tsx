import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Eye, Cookie, Mail, FileText, Info } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function PrivacyConsentModal({ isOpen, onClose, userEmail }: ConsentModalProps) {
  const [consents, setConsents] = useState({
    essential: true, // Siempre necesario
    analytics: false,
    marketing: false,
    cookies: false,
  });

  const { toast } = useToast();

  const { data: privacyPolicy } = useQuery({
    queryKey: ['/api/privacy-policy/current'],
  });

  const saveConsentMutation = useMutation({
    mutationFn: async () => {
      // Guardar cada consentimiento individualmente
      const consentPromises = Object.entries(consents)
        .filter(([key, granted]) => key !== 'essential') // No guardamos essential ya que es obligatorio
        .map(([consentType, granted]) => 
          apiRequest('POST', '/api/user-consents', {
            email: userEmail,
            consentType,
            granted,
            consentVersion: privacyPolicy?.version || '1.0',
          })
        );
      
      await Promise.all(consentPromises);
    },
    onSuccess: () => {
      toast({
        title: "✅ Preferencias guardadas",
        description: "Tus preferencias de privacidad han sido guardadas correctamente.",
      });
      localStorage.setItem('gtr-consent-given', 'true');
      localStorage.setItem('gtr-consent-date', new Date().toISOString());
      onClose();
    },
    onError: () => {
      toast({
        title: "❌ Error",
        description: "No se pudieron guardar las preferencias. Inténtalo de nuevo.",
        variant: "destructive",
      });
    },
  });

  const handleAcceptAll = () => {
    setConsents({
      essential: true,
      analytics: true,
      marketing: true,
      cookies: true,
    });
    setTimeout(() => saveConsentMutation.mutate(), 100);
  };

  const handleRejectAll = () => {
    setConsents({
      essential: true,
      analytics: false,
      marketing: false,
      cookies: false,
    });
    setTimeout(() => saveConsentMutation.mutate(), 100);
  };

  const handleCustomSave = () => {
    saveConsentMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800 text-white">
        <DialogHeader className="text-center pb-6">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-blue-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-white">
            Protección de Datos y Privacidad - GTR CUBAUTO
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-lg">
            Tu privacidad es nuestra prioridad. Configura cómo queremos usar tus datos para mejorar tu experiencia.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información importante */}
          <Card className="bg-blue-900/30 border-blue-700">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-300 mb-2">Información Importante</h3>
                  <p className="text-sm text-gray-300">
                    Como empresa automotriz, procesamos datos para ofrecerte los mejores repuestos y servicios. 
                    Puedes cambiar estas preferencias en cualquier momento desde tu panel de configuración.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consentimientos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Funcionalidad Esencial */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <Shield className="h-5 w-5 text-green-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-300 mb-2">Funcionalidad Esencial</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Necesario para el funcionamiento básico del sitio web, carrito de compras y seguridad.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="essential" 
                        checked={true} 
                        disabled={true}
                        data-testid="consent-essential"
                      />
                      <label htmlFor="essential" className="text-sm text-gray-400">
                        Siempre activo (requerido)
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Análisis y Mejoras */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <Eye className="h-5 w-5 text-purple-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-purple-300 mb-2">Análisis y Mejoras</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Nos ayuda a entender cómo usas nuestro sitio para mejorarlo y ofrecerte mejores productos.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="analytics" 
                        checked={consents.analytics}
                        onCheckedChange={(checked) => 
                          setConsents(prev => ({ ...prev, analytics: checked as boolean }))
                        }
                        data-testid="consent-analytics"
                      />
                      <label htmlFor="analytics" className="text-sm text-gray-300">
                        Permitir análisis
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Marketing */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <Mail className="h-5 w-5 text-orange-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-300 mb-2">Marketing Personalizado</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Te enviamos ofertas especiales de repuestos para tu vehículo y promociones exclusivas.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="marketing" 
                        checked={consents.marketing}
                        onCheckedChange={(checked) => 
                          setConsents(prev => ({ ...prev, marketing: checked as boolean }))
                        }
                        data-testid="consent-marketing"
                      />
                      <label htmlFor="marketing" className="text-sm text-gray-300">
                        Recibir ofertas por email
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3 mb-4">
                  <Cookie className="h-5 w-5 text-yellow-400 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-yellow-300 mb-2">Cookies Opcionales</h3>
                    <p className="text-sm text-gray-300 mb-3">
                      Guardamos tus preferencias y recordamos productos que te interesan para personalizar tu experiencia.
                    </p>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cookies" 
                        checked={consents.cookies}
                        onCheckedChange={(checked) => 
                          setConsents(prev => ({ ...prev, cookies: checked as boolean }))
                        }
                        data-testid="consent-cookies"
                      />
                      <label htmlFor="cookies" className="text-sm text-gray-300">
                        Permitir cookies opcionales
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enlaces legales */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0" asChild>
              <a href="/politica-privacidad" target="_blank">
                <FileText className="h-4 w-4 mr-1" />
                Política de Privacidad
              </a>
            </Button>
            <Button variant="link" className="text-blue-400 hover:text-blue-300 p-0" asChild>
              <a href="/terminos-condiciones" target="_blank">
                <FileText className="h-4 w-4 mr-1" />
                Términos y Condiciones
              </a>
            </Button>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={handleRejectAll}
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              disabled={saveConsentMutation.isPending}
              data-testid="reject-all-btn"
            >
              Solo Esenciales
            </Button>
            <Button
              onClick={handleCustomSave}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={saveConsentMutation.isPending}
              data-testid="save-preferences-btn"
            >
              {saveConsentMutation.isPending ? "Guardando..." : "Guardar Preferencias"}
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              disabled={saveConsentMutation.isPending}
              data-testid="accept-all-btn"
            >
              Aceptar Todo
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}