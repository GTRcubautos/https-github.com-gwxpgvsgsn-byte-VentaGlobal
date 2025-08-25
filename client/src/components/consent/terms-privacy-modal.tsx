import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, 
  FileText, 
  AlertTriangle,
  Lock,
  Eye,
  CheckCircle,
  X,
  Info
} from "lucide-react";

interface TermsPrivacyModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export default function TermsPrivacyModal({ isOpen, onAccept, onReject }: TermsPrivacyModalProps) {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [activeTab, setActiveTab] = useState("terms");

  const canProceed = termsAccepted && privacyAccepted;

  const handleAccept = () => {
    if (canProceed) {
      onAccept();
    }
  };

  const handleReject = () => {
    onReject();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" data-testid="terms-privacy-modal">
      <Card className="w-full max-w-md max-h-[70vh] bg-gray-900 border-gray-700 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <div>
                <CardTitle className="text-lg text-white">Términos y Privacidad</CardTitle>
                <p className="text-gray-400 text-xs">Debes aceptar para continuar</p>
              </div>
            </div>
            <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Obligatorio
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger 
                value="terms" 
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                data-testid="tab-terms"
              >
                <FileText className="h-4 w-4 mr-2" />
                Términos y Condiciones
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="data-[state=active]:bg-gray-700 data-[state=active]:text-white"
                data-testid="tab-privacy"
              >
                <Lock className="h-4 w-4 mr-2" />
                Política de Privacidad
              </TabsTrigger>
            </TabsList>

            <TabsContent value="terms" className="mt-6">
              <ScrollArea className="h-48 w-full rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-400" />
                      Términos y Condiciones
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">1. Aceptación de Términos</h4>
                      <p className="text-sm leading-relaxed">
                        Al acceder y utilizar el sitio web de GTR CUBAUTO, usted acepta estar sujeto a estos 
                        términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, 
                        no debe utilizar nuestro sitio web.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">2. Descripción del Servicio</h4>
                      <p className="text-sm leading-relaxed">
                        GTR CUBAUTO es una plataforma de comercio electrónico especializada en la venta de 
                        repuestos automotrices, accesorios para vehículos, y servicios relacionados con el 
                        sector automotriz.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">3. Registro de Cuenta</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Debe proporcionar información precisa y completa durante el registro</li>
                        <li>Es responsable de mantener la confidencialidad de su cuenta</li>
                        <li>Debe notificar inmediatamente cualquier uso no autorizado</li>
                        <li>Debe ser mayor de 18 años para crear una cuenta</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">4. Compras y Pagos</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Todos los precios están sujetos a cambios sin previo aviso</li>
                        <li>Los pagos se procesan de forma segura a través de Stripe</li>
                        <li>Las transacciones están protegidas con encriptación SSL</li>
                        <li>Conservamos el derecho de rechazar cualquier pedido</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">5. Política de Devoluciones</h4>
                      <p className="text-sm leading-relaxed">
                        Ofrecemos devoluciones dentro de 30 días de la compra para productos en condiciones 
                        originales. Los gastos de envío para devoluciones corren por cuenta del cliente, 
                        excepto en casos de productos defectuosos.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">6. Uso Aceptable</h4>
                      <p className="text-sm leading-relaxed mb-2">
                        Al utilizar nuestro sitio, usted se compromete a NO:
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Usar el sitio para actividades ilegales o no autorizadas</li>
                        <li>Intentar acceder a sistemas o datos no autorizados</li>
                        <li>Enviar contenido ofensivo, difamatorio o inapropiado</li>
                        <li>Interferir con el funcionamiento normal del sitio</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">7. Limitación de Responsabilidad</h4>
                      <p className="text-sm leading-relaxed">
                        GTR CUBAUTO no será responsable por daños indirectos, incidentales, especiales 
                        o consecuentes que resulten del uso de nuestro sitio web o productos, incluso 
                        si hemos sido advertidos de la posibilidad de tales daños.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">8. Modificaciones</h4>
                      <p className="text-sm leading-relaxed">
                        Nos reservamos el derecho de modificar estos términos en cualquier momento. 
                        Las modificaciones entrarán en vigor inmediatamente después de su publicación 
                        en el sitio web. Su uso continuado constituye la aceptación de los términos modificados.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="mt-4 flex items-center space-x-2">
                <Checkbox 
                  id="terms-checkbox" 
                  checked={termsAccepted}
                  onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                  data-testid="checkbox-terms"
                />
                <label 
                  htmlFor="terms-checkbox" 
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  He leído y acepto los Términos y Condiciones de GTR CUBAUTO
                </label>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="mt-6">
              <ScrollArea className="h-48 w-full rounded-lg border border-gray-700 bg-gray-800/50 p-4">
                <div className="space-y-6 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-400" />
                      Política de Privacidad
                    </h3>
                    <p className="text-sm text-gray-400 mb-4">
                      Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">1. Información que Recopilamos</h4>
                      <p className="text-sm leading-relaxed mb-2">
                        Recopilamos información que nos proporciona directamente y de forma automática:
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li><strong>Información personal:</strong> Nombre, email, teléfono, dirección</li>
                        <li><strong>Información de pago:</strong> Procesada de forma segura por Stripe</li>
                        <li><strong>Datos de navegación:</strong> IP, tipo de dispositivo, páginas visitadas</li>
                        <li><strong>Cookies:</strong> Para mejorar su experiencia de usuario</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">2. Cómo Usamos su Información</h4>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Procesar sus pedidos y pagos</li>
                        <li>Enviar confirmaciones y actualizaciones de estado</li>
                        <li>Brindar soporte al cliente</li>
                        <li>Mejorar nuestros productos y servicios</li>
                        <li>Enviar ofertas promocionales (solo con su consentimiento)</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">3. Protección de Datos</h4>
                      <p className="text-sm leading-relaxed mb-2">
                        Implementamos medidas de seguridad de nivel empresarial:
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Encriptación SSL/TLS para todas las transmisiones</li>
                        <li>Cifrado AES-256 para datos almacenados</li>
                        <li>Autenticación de dos factores disponible</li>
                        <li>Monitoreo continuo contra amenazas</li>
                        <li>Copias de seguridad automáticas y seguras</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">4. Sus Derechos de Privacidad</h4>
                      <p className="text-sm leading-relaxed mb-2">
                        Bajo las regulaciones GDPR y CCPA, usted tiene derecho a:
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li><strong>Acceso:</strong> Solicitar copia de sus datos personales</li>
                        <li><strong>Rectificación:</strong> Corregir información inexacta</li>
                        <li><strong>Eliminación:</strong> Solicitar borrado de sus datos</li>
                        <li><strong>Portabilidad:</strong> Obtener sus datos en formato estructurado</li>
                        <li><strong>Oposición:</strong> Objetar ciertos procesamientos</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">5. Compartir Información</h4>
                      <p className="text-sm leading-relaxed mb-2">
                        NO vendemos ni alquilamos su información personal. Solo compartimos datos con:
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Procesadores de pago (Stripe) para transacciones</li>
                        <li>Servicios de envío para entregas</li>
                        <li>Proveedores de servicios bajo estrictos acuerdos de confidencialidad</li>
                        <li>Autoridades legales cuando sea requerido por ley</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">6. Cookies y Tecnologías Similares</h4>
                      <p className="text-sm leading-relaxed mb-2">
                        Utilizamos cookies para:
                      </p>
                      <ul className="text-sm space-y-1 list-disc list-inside">
                        <li>Mantener su sesión activa</li>
                        <li>Recordar sus preferencias</li>
                        <li>Analizar el tráfico del sitio</li>
                        <li>Personalizar contenido y ofertas</li>
                      </ul>
                      <p className="text-sm leading-relaxed mt-2">
                        Puede gestionar sus preferencias de cookies desde su navegador o nuestra página de configuración.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">7. Retención de Datos</h4>
                      <p className="text-sm leading-relaxed">
                        Conservamos su información personal solo el tiempo necesario para cumplir con los 
                        propósitos descritos en esta política, a menos que la ley requiera un período de 
                        retención más largo.
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-white mb-2">8. Contacto</h4>
                      <p className="text-sm leading-relaxed">
                        Para consultas sobre privacidad, contáctenos en:
                      </p>
                      <div className="mt-2 p-3 bg-gray-900/50 rounded-lg">
                        <p className="text-blue-300 font-medium">Oficial de Privacidad GTR CUBAUTO</p>
                        <p className="text-gray-300 text-sm">Email: privacy@gtrcubauto.com</p>
                        <p className="text-gray-300 text-sm">Teléfono: +1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="mt-4 flex items-center space-x-2">
                <Checkbox 
                  id="privacy-checkbox" 
                  checked={privacyAccepted}
                  onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
                  data-testid="checkbox-privacy"
                />
                <label 
                  htmlFor="privacy-checkbox" 
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  He leído y acepto la Política de Privacidad de GTR CUBAUTO
                </label>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="bg-gray-700" />

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <div className="text-center text-gray-400 text-xs">
              <Info className="h-3 w-3 inline mr-1" />
              <span>Debe aceptar ambos documentos</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 w-full">
              <Button
                variant="outline"
                onClick={handleReject}
                size="sm"
                className="border-red-500/30 text-red-300 hover:bg-red-500/10 w-full"
                data-testid="button-reject"
              >
                <X className="h-3 w-3 mr-1" />
                Rechazar
              </Button>
              
              <Button
                onClick={handleAccept}
                disabled={!canProceed}
                size="sm"
                className={`w-full ${
                  canProceed 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                data-testid="button-accept"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {canProceed ? 'Aceptar' : 'Marcar ambos'}
              </Button>
            </div>
          </div>

          {/* Security Badge */}
          <div className="text-center">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
              <Shield className="h-3 w-3 mr-1" />
              Protegido por GDPR, CCPA y SOC 2 Tipo II
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}