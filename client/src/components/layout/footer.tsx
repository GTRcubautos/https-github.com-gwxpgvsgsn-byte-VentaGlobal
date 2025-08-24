import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-automotive-black text-white py-16" data-testid="footer">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-automotive-red text-2xl font-bold mb-6 font-display">GTR CUBAUTO</h3>
            <p className="text-gray-300 leading-relaxed">
              Tu tienda de confianza para repuestos automotrices de calidad. Servicio profesional desde 2020.
            </p>
          </div>
          
          <div>
            <h4 className="text-automotive-red text-lg font-semibold mb-6">Categorías</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/cars" 
                  className="automotive-link text-gray-300"
                  data-testid="footer-link-cars"
                >
                  Repuestos para Autos
                </Link>
              </li>
              <li>
                <Link 
                  href="/motorcycles" 
                  className="automotive-link text-gray-300"
                  data-testid="footer-link-motorcycles"
                >
                  Repuestos para Motos
                </Link>
              </li>
              <li>
                <Link 
                  href="/electronics" 
                  className="automotive-link text-gray-300"
                  data-testid="footer-link-electronics"
                >
                  Accesorios
                </Link>
              </li>
              <li>
                <Link 
                  href="/ofertas" 
                  className="automotive-link text-gray-300"
                  data-testid="footer-link-ofertas"
                >
                  Ofertas
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-300">
              <li data-testid="footer-phone">
                <i className="fas fa-phone mr-2"></i>+1 (555) 123-4567
              </li>
              <li data-testid="footer-email">
                <i className="fas fa-envelope mr-2"></i>info@tiendaonline.com
              </li>
              <li data-testid="footer-address">
                <i className="fas fa-map-marker-alt mr-2"></i>123 Calle Principal
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-300 hover:text-primary transition-colors text-xl"
                data-testid="footer-social-facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-primary transition-colors text-xl"
                data-testid="footer-social-instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-primary transition-colors text-xl"
                data-testid="footer-social-twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a 
                href="#" 
                className="text-gray-300 hover:text-primary transition-colors text-xl"
                data-testid="footer-social-youtube"
              >
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-300">
            <div className="mb-4 md:mb-0">
              <p data-testid="footer-copyright">
                &copy; 2024 GTR CUBAUTO. Todos los derechos reservados.
              </p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
              <Link 
                href="/politica-privacidad" 
                className="automotive-link text-gray-300"
                data-testid="footer-link-privacy-policy"
              >
                Política de Privacidad
              </Link>
              <Link 
                href="/terminos-condiciones" 
                className="automotive-link text-gray-300"
                data-testid="footer-link-terms"
              >
                Términos y Condiciones
              </Link>
              <Link 
                href="/configuracion-privacidad" 
                className="automotive-link text-gray-300 font-medium"
                data-testid="footer-link-privacy-settings"
              >
                ⚙️ Mi Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
