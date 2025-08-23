import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Shield, Scale, Clock, Mail, Phone } from "lucide-react";
import { Link } from "wouter";

export function Terms() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-foreground text-background">
              <FileText className="h-3 w-3 mr-1" />
              Términos y Condiciones
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Términos y Condiciones de Uso
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Última actualización: 23 de agosto de 2025
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Introduction */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Scale className="h-5 w-5" />
                1. Introducción
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Bienvenido a TiendaOnline. Al acceder y utilizar nuestro sitio web y servicios, 
                usted acepta estar sujeto a estos términos y condiciones de uso.
              </p>
              <p>
                Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestros servicios.
              </p>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5" />
                2. Cuentas de Usuario
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Para realizar compras, debe crear una cuenta proporcionando información precisa y actualizada.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Es responsable de mantener la confidencialidad de su cuenta</li>
                <li>Debe notificar inmediatamente cualquier uso no autorizado</li>
                <li>Solo puede tener una cuenta activa</li>
                <li>Debe ser mayor de 18 años para crear una cuenta</li>
              </ul>
            </CardContent>
          </Card>

          {/* Products and Services */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5" />
                3. Productos y Servicios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Ofrecemos una amplia gama de productos incluyendo electrónicos, automóviles y motocicletas.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Todos los precios están sujetos a cambios sin previo aviso</li>
                <li>Los precios mayoristas requieren códigos de acceso específicos</li>
                <li>La disponibilidad de productos puede variar</li>
                <li>Nos reservamos el derecho de limitar cantidades</li>
              </ul>
            </CardContent>
          </Card>

          {/* Payment Terms */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Clock className="h-5 w-5" />
                4. Términos de Pago
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Aceptamos múltiples métodos de pago para su conveniencia:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Tarjetas de crédito y débito (Visa, MasterCard, American Express)</li>
                <li>PayPal y otros monederos digitales</li>
                <li>Transferencias bancarias y Zelle</li>
                <li>Criptomonedas seleccionadas</li>
              </ul>
              <p>
                Todos los pagos deben completarse en el momento de la compra. 
                Los precios incluyen impuestos aplicables.
              </p>
            </CardContent>
          </Card>

          {/* Shipping and Delivery */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5" />
                5. Envío y Entrega
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Envío express disponible en 24-48 horas para productos en stock</li>
                <li>Los costos de envío se calculan según destino y peso</li>
                <li>Entregamos a nivel nacional e internacional</li>
                <li>Se requiere firma para productos de alto valor</li>
                <li>No somos responsables por retrasos causados por terceros</li>
              </ul>
            </CardContent>
          </Card>

          {/* Returns and Refunds */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Scale className="h-5 w-5" />
                6. Devoluciones y Reembolsos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Ofrecemos una política de devolución de 30 días para la mayoría de productos:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Los productos deben estar en condición original</li>
                <li>Se requiere comprobante de compra</li>
                <li>Los gastos de envío de devolución corren por cuenta del cliente</li>
                <li>Algunos productos pueden tener restricciones especiales</li>
                <li>Los reembolsos se procesan en 5-10 días hábiles</li>
              </ul>
            </CardContent>
          </Card>

          {/* Privacy and Security */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5" />
                7. Privacidad y Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Protegemos su información personal con las mejores prácticas de seguridad:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Encriptación SSL en todas las transacciones</li>
                <li>Almacenamiento seguro de datos personales</li>
                <li>No compartimos información con terceros sin consentimiento</li>
                <li>Cumplimiento con regulaciones de protección de datos</li>
                <li>Auditorías de seguridad regulares</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border border-border shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Mail className="h-5 w-5" />
                8. Información de Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                Si tiene preguntas sobre estos términos, puede contactarnos:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>legal@tiendaonline.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+1 (555) 123-4567</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/privacy">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Ver Política de Privacidad
              </Button>
            </Link>
            <Link href="/">
              <Button size="lg" className="min-w-[200px]">
                Volver al Inicio
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}