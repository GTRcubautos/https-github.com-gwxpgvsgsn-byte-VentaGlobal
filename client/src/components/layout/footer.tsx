import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-12" data-testid="footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-primary text-xl font-bold mb-4">TiendaOnline</h3>
            <p className="text-gray-300">
              Tu tienda de confianza para productos de calidad a precios increíbles.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/productos" 
                  className="text-gray-300 hover:text-primary transition-colors"
                  data-testid="footer-link-productos"
                >
                  Productos
                </Link>
              </li>
              <li>
                <Link 
                  href="/autos" 
                  className="text-gray-300 hover:text-primary transition-colors"
                  data-testid="footer-link-autos"
                >
                  Autos
                </Link>
              </li>
              <li>
                <Link 
                  href="/motos" 
                  className="text-gray-300 hover:text-primary transition-colors"
                  data-testid="footer-link-motos"
                >
                  Motos
                </Link>
              </li>
              <li>
                <Link 
                  href="/juegos" 
                  className="text-gray-300 hover:text-primary transition-colors"
                  data-testid="footer-link-juegos"
                >
                  Juegos
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
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
          <p data-testid="footer-copyright">
            &copy; 2024 TiendaOnline. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
