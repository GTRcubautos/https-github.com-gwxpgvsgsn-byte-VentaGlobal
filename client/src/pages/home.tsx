import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/products/search-bar";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { Car, Bike, Smartphone, Award, Zap, Shield, Star, ArrowRight, TrendingUp, Users, ShoppingBag } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const { addToCart } = useStore();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredProducts = filteredProducts.slice(0, 6);

  const categories = [
    {
      id: "cars",
      name: "Autos GTR",
      icon: Car,
      count: products.filter(p => p.category === "cars").length,
      description: "Deportivos de alta performance y lujo",
      path: "/cars",
      gradient: "from-blue-600 via-blue-700 to-blue-800",
      offer: "ENVÍO GRATIS"
    },
    {
      id: "motorcycles", 
      name: "Motocicletas",
      icon: Bike,
      count: products.filter(p => p.category === "motorcycles").length,
      description: "Superbikes y motos eléctricas",
      path: "/motorcycles",
      gradient: "from-purple-600 via-purple-700 to-purple-800",
      offer: "FINANCIAMIENTO 0%"
    },
    {
      id: "electronics",
      name: "Auto Tech",
      icon: Smartphone,
      count: products.filter(p => p.category === "electronics").length,
      description: "Tecnología automotriz avanzada",
      path: "/electronics",
      gradient: "from-cyan-600 via-cyan-700 to-cyan-800",
      offer: "HASTA 50% OFF"
    },
  ];

  const features = [
    {
      icon: Award,
      title: "Calidad Premium",
      description: "Productos certificados con los más altos estándares de calidad",
      stat: "100%",
      statLabel: "Garantía"
    },
    {
      icon: Zap,
      title: "Entrega Rápida",
      description: "Envío express en 24-48 horas a todo el país",
      stat: "24h",
      statLabel: "Entrega"
    },
    {
      icon: Shield,
      title: "Compra Segura",
      description: "Transacciones protegidas y datos completamente seguros",
      stat: "SSL",
      statLabel: "Seguridad"
    }
  ];

  const stats = [
    { icon: Users, value: "25K+", label: "Clientes GTR" },
    { icon: Car, value: "5K+", label: "Vehículos Vendidos" },
    { icon: TrendingUp, value: "99%", label: "Satisfacción" },
    { icon: Star, value: "4.9", label: "Calificación" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" data-testid="home-loading">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-background"></div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 text-sm px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 rounded-full" data-testid="hero-badge">
              🚗 ENVÍO GRATIS en compras +$500
            </Badge>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tight" data-testid="hero-title">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent">GTR</span>
              <span className="text-foreground"> CUBAUTOS</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto" data-testid="hero-subtitle">
              Vehículos premium y tecnología de vanguardia. 
              <br className="hidden md:block" />
              El futuro del automovilismo está aquí.
            </p>
            <div className="max-w-lg mx-auto mb-12">
              <SearchBar onSearch={setSearchTerm} />
            </div>
          </div>
        </div>
      </section>

      {/* Promociones Banner */}
      <section className="py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-500 text-white" data-testid="promo-banner">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center space-x-8 text-sm font-medium animate-pulse">
            <span>🚚 ENVÍO GRATIS +$500</span>
            <span>•</span>
            <span>⚡ FINANCIAMIENTO 0%</span>
            <span>•</span>
            <span>🎯 OFERTAS LIMITADAS</span>
            <span>•</span>
            <span>🔧 GARANTÍA EXTENDIDA</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/20" data-testid="stats-section">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const StatIcon = stat.icon;
              return (
                <div key={index} className="text-center group" data-testid={`stat-${index}`}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 mb-4 group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300 backdrop-blur-sm border border-blue-200/20">
                    <StatIcon className="h-7 w-7" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 relative overflow-hidden" data-testid="categories-section">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-cyan-50/50"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              CATEGORÍAS PREMIUM
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Vehículos de Élite
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Desde deportivos de alta gama hasta tecnología automotriz de vanguardia
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link key={category.id} href={category.path}>
                  <Card className="group cursor-pointer transition-all duration-700 hover:scale-105 border-0 overflow-hidden shadow-2xl hover:shadow-3xl bg-white/80 backdrop-blur-sm" data-testid={`category-${category.id}`}>
                    <div className={`h-40 bg-gradient-to-br ${category.gradient} relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                          {category.offer}
                        </Badge>
                      </div>
                      <div className="absolute bottom-4 left-6">
                        <IconComponent className="h-10 w-10 text-white drop-shadow-lg" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-all duration-700"></div>
                    </div>
                    <CardContent className="p-6 bg-gradient-to-b from-white to-gray-50/50">
                      <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{category.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 text-xs px-3 py-1">
                          {category.count} modelos
                        </Badge>
                        <div className="flex items-center text-blue-600 group-hover:text-purple-600 transition-colors">
                          <span className="text-sm font-medium mr-1">Explorar</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20" data-testid="featured-products-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Productos Destacados</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Selección premium de vehículos y tecnología
            </p>
          </div>
          
          {featuredProducts.length === 0 ? (
            <div className="text-center py-12" data-testid="no-products-message">
              <p className="text-xl text-muted-foreground">
                {searchTerm ? "No se encontraron productos que coincidan con tu búsqueda." : "No hay productos disponibles."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group">
                  <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="aspect-square overflow-hidden relative">
                      <img
                        src={product.imageUrl || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        data-testid={`product-image-${product.id}`}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500 text-white border-0">
                          Destacado
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2 text-foreground">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">${product.retailPrice}</span>
                        <Button 
                          onClick={() => addToCart(product)} 
                          size="sm"
                          className="bg-foreground text-background hover:bg-foreground/90"
                        >
                          Agregar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" data-testid="features-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">¿Por Qué GTR CUBAUTOS?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Líderes en innovación automotriz y experiencia premium
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <Card key={index} className="group text-center p-8 border border-border hover:border-foreground transition-all duration-500 hover:scale-105 shadow-soft hover:shadow-strong" data-testid={`feature-${index}`}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 group-hover:bg-foreground group-hover:text-background transition-all duration-300 mb-6 mx-auto">
                    <FeatureIcon className="h-8 w-8" />
                  </div>
                  <div className="text-3xl font-bold text-foreground mb-2">{feature.stat}</div>
                  <div className="text-sm text-muted-foreground mb-4">{feature.statLabel}</div>
                  <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden" data-testid="cta-section">
        <div className="absolute inset-0 bg-black/5"></div>
        <div className="relative container mx-auto px-6 text-center">
          <Badge className="mb-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 px-4 py-2">
            OFERTAS LIMITADAS
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            El Futuro del <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Automovilismo</span>
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Únete a GTR CUBAUTOS y experimenta la próxima generación de vehículos premium
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars">
              <Button size="lg" className="min-w-[200px] bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300" data-testid="explore-cars-button">
                🚗 Explorar GTR Autos
              </Button>
            </Link>
            <Link href="/motorcycles">
              <Button size="lg" variant="outline" className="min-w-[200px] border-white/30 text-white hover:bg-white hover:text-gray-900 backdrop-blur-sm" data-testid="view-motorcycles-button">
                🏍️ Ver Motocicletas
              </Button>
            </Link>
          </div>
          
          {/* Promotion Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-2xl mb-2">🚚</div>
              <h3 className="font-semibold mb-2">Envío Gratis</h3>
              <p className="text-sm opacity-80">En compras superiores a $500</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-semibold mb-2">Financiamiento 0%</h3>
              <p className="text-sm opacity-80">Hasta 36 meses sin intereses</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-2xl mb-2">🔧</div>
              <h3 className="font-semibold mb-2">Garantía Extendida</h3>
              <p className="text-sm opacity-80">Protección total hasta 5 años</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}