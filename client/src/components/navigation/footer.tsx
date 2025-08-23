import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  FileText,
  Zap,
  Heart
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: "Sobre Nosotros", href: "/about" },
      { name: "Contacto", href: "/contact" },
      { name: "Carreras", href: "/careers" },
      { name: "Blog", href: "/blog" },
    ],
    products: [
      { name: "Autos", href: "/cars" },
      { name: "Motocicletas", href: "/motorcycles" },
      { name: "Electrónicos", href: "/productos" },
      { name: "Ofertas", href: "/deals" },
    ],
    support: [
      { name: "Centro de Ayuda", href: "/help" },
      { name: "Seguimiento de Pedidos", href: "/tracking" },
      { name: "Devoluciones", href: "/returns" },
      { name: "Garantías", href: "/warranty" },
    ],
    legal: [
      { name: "Términos y Condiciones", href: "/terms" },
      { name: "Política de Privacidad", href: "/privacy" },
      { name: "Políticas de Envío", href: "/shipping" },
      { name: "Política de Cookies", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/tiendaonline" },
    { name: "Twitter", icon: Twitter, href: "https://twitter.com/tiendaonline" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/tiendaonline" },
  ];

  const features = [
    { icon: Shield, text: "Compra 100% Segura" },
    { icon: Zap, text: "Entrega Express" },
    { icon: Heart, text: "Atención Premium" },
  ];

  return (
    <footer className="bg-muted/20 border-t border-border">
      {/* Trust Badges */}
      <div className="border-b border-border py-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center justify-center space-x-3 text-sm text-muted-foreground">
                <feature.icon className="h-5 w-5 text-foreground" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-background" />
                </div>
                <span className="text-xl font-bold text-foreground">TiendaOnline</span>
              </div>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Tu destino para productos premium con diseño minimalista. 
              Calidad, elegancia y simplicidad en cada compra.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4" />
                <span>contacto@tiendaonline.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4" />
                <span>123 Commerce St, Ciudad, País</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Compañía</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                      {link.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Productos</h3>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                      {link.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Soporte</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                      {link.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>
                    <Button variant="link" className="h-auto p-0 text-muted-foreground hover:text-foreground">
                      {link.name}
                    </Button>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-muted-foreground">
            © {currentYear} TiendaOnline. Todos los derechos reservados.
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground mr-2">Síguenos:</span>
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`social-${social.name.toLowerCase()}`}
              >
                <social.icon className="h-5 w-5" />
                <span className="sr-only">{social.name}</span>
              </a>
            ))}
          </div>

          {/* Security Badge */}
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Sitio Seguro SSL
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
}