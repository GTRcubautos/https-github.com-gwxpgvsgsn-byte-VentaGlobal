import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';

export default function Header() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const cart = useStore((state) => state.cart);
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navigation = [
    { name: 'Inicio', href: '/', id: 'inicio' },
    { name: 'Productos', href: '/productos', id: 'productos' },
    { name: 'Autos', href: '/autos', id: 'autos' },
    { name: 'Motos', href: '/motos', id: 'motos' },
    { name: 'Juegos', href: '/juegos', id: 'juegos' },
    { name: 'Mayoristas', href: '/mayoristas', id: 'mayoristas' },
    { name: 'Admin', href: '/admin', id: 'admin' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/productos?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const openCartModal = () => {
    // Cart modal will be handled by the CartModal component
    const event = new CustomEvent('openCart');
    window.dispatchEvent(event);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-medium" data-testid="header">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex items-center justify-between w-full lg:w-auto mb-4 lg:mb-0">
            <Link href="/" className="text-automotive-black text-3xl font-bold font-display" data-testid="logo">
              🏎️ GTR CUBAUTO
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-gray-700 hover:text-red-600 hover:bg-gray-100"
              onClick={toggleMobileMenu}
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
          
          <nav className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:flex w-full lg:w-auto`} data-testid="navigation">
            <ul className="flex flex-col lg:flex-row space-y-3 lg:space-y-0 lg:space-x-8">
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={`automotive-link font-semibold block ${
                      location === item.href ? 'text-automotive-red' : 'text-gray-700'
                    }`}
                    data-testid={`nav-${item.id}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="flex items-center space-x-4 w-full lg:w-auto mt-4 lg:mt-0">
            <form onSubmit={handleSearch} className="flex flex-1 lg:flex-none">
              <Input
                type="text"
                placeholder="🔍 Buscar repuestos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="automotive-input rounded-r-none flex-1 lg:w-64"
                data-testid="search-input"
              />
              <Button
                type="submit"
                className="rounded-l-none px-6"
                data-testid="search-button"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
            
            <Button
              variant="ghost"
              size="sm"
              className="relative text-gray-700 hover:text-red-600 hover:bg-gray-100"
              onClick={openCartModal}
              data-testid="cart-button"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span 
                  className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  data-testid="cart-count"
                >
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
