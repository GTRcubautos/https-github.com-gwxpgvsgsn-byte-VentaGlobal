import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, FileText, AlertTriangle, Lock, CheckCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MandatoryTermsModalProps {
  isOpen: boolean;
  onAccept: () => void;
}

export default function MandatoryTermsModal({ isOpen, onAccept }: MandatoryTermsModalProps) {
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [hasReadPrivacy, setHasReadPrivacy] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [hasAcceptedPrivacy, setHasAcceptedPrivacy] = useState(false);

  const canContinue = hasReadTerms && hasReadPrivacy && hasAcceptedTerms && hasAcceptedPrivacy;

  const handleAccept = () => {
    if (canContinue) {
      // Guardar aceptación en localStorage
      localStorage.setItem('gtr-mandatory-terms-accepted', 'true');
      localStorage.setItem('gtr-terms-acceptance-date', new Date().toISOString());
      onAccept();
    }
  };

  return (
    <Dialog open={isOpen} modal>
      <DialogContent 
        className="max-w-4xl max-h-[95vh] bg-gray-950 border-red-600 text-white fixed inset-0 z-[100]"
      >
        <div className="absolute inset-0 bg-gray-950/95 backdrop-blur-sm" />
        
        <div className="relative z-10 h-full flex flex-col">
          <DialogHeader className="text-center pb-6 border-b border-gray-800">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <Shield className="h-16 w-16 text-red-500" />
                <Lock className="h-6 w-6 text-white absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1" />
              </div>
            </div>
            <DialogTitle className="text-3xl font-bold text-white mb-2">
              Bienvenido a GTR CUBAUTO
            </DialogTitle>
            <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 mx-auto max-w-2xl">
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="font-semibold text-red-300">Aceptación Obligatoria</span>
              </div>
              <p className="text-gray-300 text-sm">
                Para usar nuestros servicios, debes leer y aceptar nuestros Términos y Condiciones 
                y Política de Privacidad. Esta aceptación es obligatoria para continuar.
              </p>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-6 p-6">
                {/* Términos y Condiciones */}
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="h-6 w-6 text-blue-400" />
                      <h3 className="text-xl font-bold text-blue-300">Términos y Condiciones</h3>
                      {hasReadTerms && <CheckCircle className="h-5 w-5 text-green-400" />}
                    </div>
                    
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                      <div className="prose prose-invert text-sm">
                        <h4 className="text-white font-semibold mb-2">1. Aceptación de Términos</h4>
                        <p className="text-gray-300 mb-3">
                          Al acceder y usar GTR CUBAUTO, usted acepta estar sujeto a estos términos y condiciones 
                          de uso, todas las leyes y regulaciones aplicables.
                        </p>
                        
                        <h4 className="text-white font-semibold mb-2">2. Uso de Servicios</h4>
                        <p className="text-gray-300 mb-3">
                          Nuestros servicios están destinados únicamente para uso legítimo en la compra de repuestos 
                          automotrices. Está prohibido el uso para actividades ilegales o no autorizadas.
                        </p>
                        
                        <h4 className="text-white font-semibold mb-2">3. Responsabilidades del Usuario</h4>
                        <p className="text-gray-300 mb-3">
                          Usted es responsable de mantener la confidencialidad de su cuenta y contraseña, 
                          y de todas las actividades que ocurran bajo su cuenta.
                        </p>
                        
                        <h4 className="text-white font-semibold mb-2">4. Política de Devoluciones</h4>
                        <p className="text-gray-300 mb-3">
                          Los productos pueden ser devueltos dentro de 30 días de la compra, 
                          siempre que estén en condiciones originales y con el empaque original.
                        </p>
                        
                        <h4 className="text-white font-semibold mb-2">5. Limitación de Responsabilidad</h4>
                        <p className="text-gray-300">
                          GTR CUBAUTO no será responsable por daños indirectos, incidentales, 
                          especiales o consecuentes que resulten del uso de nuestros servicios.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="read-terms" 
                          checked={hasReadTerms}
                          onCheckedChange={(checked) => setHasReadTerms(checked as boolean)}
                          data-testid="read-terms-checkbox"
                        />
                        <label htmlFor="read-terms" className="text-sm text-gray-300">
                          ✓ He leído completamente los Términos y Condiciones
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="accept-terms" 
                          checked={hasAcceptedTerms}
                          disabled={!hasReadTerms}
                          onCheckedChange={(checked) => setHasAcceptedTerms(checked as boolean)}
                          data-testid="accept-terms-checkbox"
                        />
                        <label htmlFor="accept-terms" className="text-sm text-gray-300">
                          ✓ Acepto los Términos y Condiciones de GTR CUBAUTO
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Política de Privacidad */}
                <Card className="bg-gray-900 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="h-6 w-6 text-green-400" />
                      <h3 className="text-xl font-bold text-green-300">Política de Privacidad</h3>
                      {hasReadPrivacy && <CheckCircle className="h-5 w-5 text-green-400" />}
                    </div>
                    
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 mb-4 max-h-40 overflow-y-auto">
                      <div className="prose prose-invert text-sm">
                        <h4 className="text-white font-semibold mb-2">1. Información que Recopilamos</h4>
                        <p className="text-gray-300 mb-3">
                          Recopilamos información personal que nos proporcionas directamente, como nombre, 
                          email, teléfono y dirección al crear una cuenta o realizar compras.
                        </p>
                        
                        <h4 className="text-white font-semibold mb-2">2. Uso de la Información</h4>
                        <p className="text-gray-300 mb-3">
                          Usamos tu información para procesar pedidos, proporcionar soporte al cliente, 
                          mejorar nuestros servicios y enviarte actualizaciones importantes.
                        </p>
                        
                        <h4 className="text-white font-semibold mb-2">3. Protección de Datos</h4>
                        <p className="text-gray-300 mb-3">
                          Implementamos medidas de seguridad técnicas y organizacionales apropiadas 
                          para proteger tu información personal contra acceso no autorizado.
                        </p>
                        
                        <h4 className="text-white font-semibold mb-2">4. Tus Derechos</h4>
                        <p className="text-gray-300 mb-3">
                          Tienes derecho a acceder, corregir, eliminar o transferir tu información personal. 
                          Puedes ejercer estos derechos contactándonos directamente.
                        </p>
                        
                        <h4 className="text-white font-semibold mb-2">5. Cookies y Tecnologías Similares</h4>
                        <p className="text-gray-300">
                          Utilizamos cookies para mejorar tu experiencia de navegación, recordar preferencias 
                          y analizar el uso del sitio web.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="read-privacy" 
                          checked={hasReadPrivacy}
                          onCheckedChange={(checked) => setHasReadPrivacy(checked as boolean)}
                          data-testid="read-privacy-checkbox"
                        />
                        <label htmlFor="read-privacy" className="text-sm text-gray-300">
                          ✓ He leído completamente la Política de Privacidad
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="accept-privacy" 
                          checked={hasAcceptedPrivacy}
                          disabled={!hasReadPrivacy}
                          onCheckedChange={(checked) => setHasAcceptedPrivacy(checked as boolean)}
                          data-testid="accept-privacy-checkbox"
                        />
                        <label htmlFor="accept-privacy" className="text-sm text-gray-300">
                          ✓ Acepto la Política de Privacidad de GTR CUBAUTO
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Información adicional */}
                <Card className="bg-blue-900/20 border-blue-700">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-blue-300 mb-2">Compromiso con tu Privacidad</h4>
                        <p className="text-sm text-gray-300">
                          En GTR CUBAUTO nos comprometemos a proteger tu información personal y respetar 
                          tus derechos de privacidad. Puedes cambiar tus preferencias de privacidad en 
                          cualquier momento desde tu perfil de usuario.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </div>

          {/* Botón de continuar */}
          <div className="border-t border-gray-800 p-6">
            <div className="text-center mb-4">
              {!canContinue && (
                <p className="text-yellow-300 text-sm mb-2">
                  ⚠️ Debes leer y aceptar ambos documentos para continuar
                </p>
              )}
              <Button
                onClick={handleAccept}
                disabled={!canContinue}
                className={`w-full max-w-md mx-auto text-lg py-3 ${
                  canContinue 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
                data-testid="continue-button"
              >
                {canContinue ? (
                  <>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Continuar a GTR CUBAUTO
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Complete la lectura para continuar
                  </>
                )}
              </Button>
            </div>
            
            <p className="text-xs text-gray-400 text-center">
              Al hacer clic en "Continuar", confirmas que has leído, entendido y aceptado 
              nuestros Términos y Condiciones y Política de Privacidad.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}