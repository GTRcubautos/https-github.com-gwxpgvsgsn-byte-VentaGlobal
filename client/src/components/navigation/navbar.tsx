import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { Search, ShoppingCart, User, Menu, X, Star, Zap, Car, Bike } from "lucide-react";
import SearchBar from "@/components/products/search-bar";

export function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [location] = useLocation();
  const { cart } = useStore();
  
  const totalItems = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const navigation = [
    { name: "Inicio", href: "/", icon: Star },
    { name: "Autos", href: "/cars", icon: Car },
    { name: "Motos", href: "/motorcycles", icon: Bike },
    { name: "Productos", href: "/productos", icon: ShoppingCart },
  ];

  const isActive = (path: string) => {
    if (path === "/" && location === "/") return true;
    if (path !== "/" && location.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <div className="w-8 h-8 bg-foreground rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="h-5 w-5 text-background" />
              </div>
              <span className="text-xl font-bold text-foreground tracking-tight">
                TiendaOnline
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className={`text-sm font-medium transition-colors ${
                    isActive(item.href) 
                      ? "bg-foreground text-background" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`nav-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Hidden on mobile */}
            <div className="hidden lg:block w-64">
              <SearchBar onSearch={() => {}} placeholder="Buscar productos..." />
            </div>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              data-testid="cart-button"
            >
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-foreground text-background">
                  {totalItems}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            <Link href="/admin">
              <Button variant="ghost" size="icon" data-testid="user-button">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="py-4 space-y-2">
              {/* Mobile Search */}
              <div className="px-2 mb-4">
                <SearchBar onSearch={() => {}} placeholder="Buscar productos..." />
              </div>
              
              {/* Mobile Navigation */}
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start text-left ${
                      isActive(item.href) 
                        ? "bg-foreground text-background" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                    data-testid={`mobile-nav-${item.name.toLowerCase()}`}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}