import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStore } from '@/lib/store';

export default function Header() {
  const [location, setLocation] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const cart = useStore((state) => state.cart);
  
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const navigation = [
    { name: 'Inicio', href: '/', id: 'inicio' },
    { name: 'Productos', href: '/productos', id: 'productos' },
    { name: 'Autos', href: '/autos', id: 'autos' },
    { name: 'Motos', href: '/motos', id: 'motos' },
    { name: 'Juegos', href: '/juegos', id: 'juegos' },
    { name: 'Mi Perfil', href: '/perfil', id: 'perfil' },
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
    <header className="bg-black border-b border-gray-800 sticky top-0 z-50 shadow-strong" data-testid="header">
      <div className="container mx-auto px-6 py-4">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="flex items-center space-x-8" data-testid="left-navigation">
            {navigation.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`text-sm font-semibold transition-all duration-300 ${
                  location === item.href 
                    ? 'text-red-500 scale-105' 
                    : 'text-white hover:text-red-400 hover:scale-105'
                }`}
                data-testid={`nav-${item.id}`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Center Logo */}
          <Link href="/" className="text-white text-4xl font-bold font-display hover:text-red-400 transition-colors duration-300" data-testid="logo">
            GTR CUBAUTO
          </Link>

          {/* Right Navigation + Search + Cart */}
          <div className="flex items-center space-x-6">
            {/* Right Navigation */}
            <nav className="flex items-center space-x-8" data-testid="right-navigation">
              {navigation.slice(4).map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`text-sm font-semibold transition-all duration-300 ${
                    location === item.href 
                      ? 'text-red-500 scale-105' 
                      : 'text-white hover:text-red-400 hover:scale-105'
                  }`}
                  data-testid={`nav-${item.id}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Retractable Search */}
            <div className="flex items-center">
              <div className={`overflow-hidden transition-all duration-300 ${isSearchExpanded ? 'w-64' : 'w-0'}`}>
                <form onSubmit={handleSearch} className="flex">
                  <Input
                    type="text"
                    placeholder="Buscar repuestos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 rounded-r-none"
                    data-testid="search-input"
                  />
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 rounded-l-none"
                    data-testid="search-button"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </form>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-red-400 hover:bg-gray-900 ml-2"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                data-testid="search-toggle"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="sm"
              className="relative text-white hover:text-red-400 hover:bg-gray-900"
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

        {/* Mobile Header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-white text-2xl font-bold font-display" data-testid="mobile-logo">
              GTR CUBAUTO
            </Link>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-red-400"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                data-testid="mobile-search-toggle"
              >
                <Search className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="relative text-white hover:text-red-400"
                onClick={openCartModal}
                data-testid="mobile-cart-button"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-red-400"
                onClick={toggleMobileMenu}
                data-testid="mobile-menu-toggle"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchExpanded && (
            <div className="mt-4">
              <form onSubmit={handleSearch} className="flex">
                <Input
                  type="text"
                  placeholder="Buscar repuestos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-900 border-gray-700 text-white placeholder-gray-400 rounded-r-none flex-1"
                  data-testid="mobile-search-input"
                />
                <Button
                  type="submit"
                  className="bg-red-600 hover:bg-red-700 rounded-l-none"
                  data-testid="mobile-search-button"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          )}

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="mt-4 pb-4 border-t border-gray-800 pt-4" data-testid="mobile-navigation">
              <div className="grid grid-cols-2 gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`block py-2 px-4 rounded-lg text-center font-semibold transition-all duration-300 ${
                      location === item.href
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                    data-testid={`mobile-nav-${item.id}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
