import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { openWholesaleModal } from '@/components/wholesale/wholesale-modal';
import { openGameModal } from '@/components/games/game-modal';
import { useStore } from '@/lib/store';
import { useEffect } from 'react';

export default function Home() {
  const { addPoints } = useStore();

  useEffect(() => {
    // Award daily visit points
    addPoints(10);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative bg-cover bg-center py-32"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1607082350899-7e105aa886ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
        }}
        data-testid="hero-section"
      >
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn" data-testid="hero-title">
            Bienvenido a TiendaOnline
          </h1>
          <p className="text-xl lg:text-2xl mb-8 animate-fadeIn" data-testid="hero-subtitle">
            Los mejores productos al mejor precio - Mayoristas y Minoristas
          </p>
          <div className="space-x-4 animate-fadeIn">
            <Link href="/productos">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 font-semibold"
                data-testid="view-products-button"
              >
                Ver Productos
              </Button>
            </Link>
            <Button
              onClick={openWholesaleModal}
              variant="outline"
              className="border-2 border-primary hover:bg-primary text-white px-8 py-3 font-semibold"
              data-testid="wholesale-access-button"
            >
              Acceso Mayoristas
            </Button>
          </div>
          
          {/* Games Advertisement */}
          <div className="mt-12 bg-black bg-opacity-50 rounded-lg p-6 max-w-md mx-auto" data-testid="games-ad">
            <h3 className="text-primary text-xl font-bold mb-2">🎮 ¡Juega y Gana!</h3>
            <p className="text-sm mb-4">
              Participa en nuestros juegos y obtén descuentos increíbles. ¡1 punto = $0.01!
            </p>
            <Link href="/juegos">
              <Button 
                className="bg-primary hover:bg-primary/90 text-white px-6 py-2 font-semibold"
                data-testid="play-games-button"
              >
                Jugar Ahora
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 bg-white" data-testid="quick-access">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-secondary mb-2">
            Categorías Destacadas
          </h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-12"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link href="/productos">
              <div className="group cursor-pointer">
                <div className="bg-accent rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                  <i className="fas fa-mobile-alt text-4xl text-primary mb-4"></i>
                  <h3 className="text-xl font-bold text-secondary mb-2">Electrónicos</h3>
                  <p className="text-gray-600">Smartphones, laptops y más</p>
                </div>
              </div>
            </Link>
            
            <Link href="/autos">
              <div className="group cursor-pointer">
                <div className="bg-accent rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                  <i className="fas fa-car text-4xl text-primary mb-4"></i>
                  <h3 className="text-xl font-bold text-secondary mb-2">Autos</h3>
                  <p className="text-gray-600">Vehículos para todas las necesidades</p>
                </div>
              </div>
            </Link>
            
            <Link href="/motos">
              <div className="group cursor-pointer">
                <div className="bg-accent rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                  <i className="fas fa-motorcycle text-4xl text-primary mb-4"></i>
                  <h3 className="text-xl font-bold text-secondary mb-2">Motos</h3>
                  <p className="text-gray-600">Motocicletas deportivas y de calle</p>
                </div>
              </div>
            </Link>
            
            <Link href="/juegos">
              <div className="group cursor-pointer">
                <div className="bg-accent rounded-lg p-8 text-center hover:shadow-lg transition-shadow">
                  <i className="fas fa-gamepad text-4xl text-primary mb-4"></i>
                  <h3 className="text-xl font-bold text-secondary mb-2">Juegos</h3>
                  <p className="text-gray-600">Gana puntos y descuentos</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-accent" data-testid="features">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shipping-fast text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Envío Rápido</h3>
              <p className="text-gray-600">Entrega en 24-48 horas</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-shield-alt text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Compra Segura</h3>
              <p className="text-gray-600">Transacciones 100% seguras</p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-trophy text-white text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-secondary mb-2">Sistema de Puntos</h3>
              <p className="text-gray-600">Gana descuentos con cada compra</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
