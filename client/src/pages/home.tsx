import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SearchBar from "@/components/products/search-bar";
import ProductCard from "@/components/products/product-card";
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredProducts = filteredProducts.slice(0, 6);

  const categories = [
    {
      id: "cars",
      name: "Autos",
      icon: Car,
      count: products.filter(p => p.category === "cars").length,
      description: "Vehículos premium y de lujo",
      path: "/cars",
      gradient: "from-slate-900 to-slate-700"
    },
    {
      id: "motorcycles", 
      name: "Motocicletas",
      icon: Bike,
      count: products.filter(p => p.category === "motorcycles").length,
      description: "Motos deportivas y urbanas",
      path: "/motorcycles",
      gradient: "from-gray-900 to-gray-700"
    },
    {
      id: "electronics",
      name: "Electrónicos",
      icon: Smartphone,
      count: products.filter(p => p.category === "electronics").length,
      description: "Tecnología de vanguardia",
      path: "/electronics",
      gradient: "from-zinc-900 to-zinc-700"
    },
  ];

  const features = [
    {
      icon: Award,
      title: "Calidad Premium",
      description: "Solo productos de las mejores marcas certificadas",
      stat: "99.9%",
      statLabel: "Satisfacción"
    },
    {
      icon: Zap,
      title: "Entrega Express",
      description: "Envío rápido y seguro en 24-48 horas",
      stat: "24h",
      statLabel: "Entrega"
    },
    {
      icon: Shield,
      title: "Garantía Total",
      description: "Protección completa y soporte técnico",
      stat: "100%",
      statLabel: "Garantía"
    }
  ];

  const stats = [
    { icon: Users, value: "10K+", label: "Clientes Satisfechos" },
    { icon: ShoppingBag, value: "50K+", label: "Productos Vendidos" },
    { icon: TrendingUp, value: "98%", label: "Recomendación" },
    { icon: Star, value: "4.9", label: "Calificación" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background" data-testid="home-loading">
        <div className="text-center">
          <div className="animate-spin w-12 h-12 border-2 border-foreground border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden" data-testid="hero-section">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/10 to-background"></div>
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 text-sm px-4 py-2 bg-foreground text-background" data-testid="hero-badge">
              ✨ Bienvenido a la nueva experiencia de compra
            </Badge>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 tracking-tight" data-testid="hero-title">
              <span className="text-foreground">Tienda</span>
              <span className="text-muted-foreground">Online</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto" data-testid="hero-subtitle">
              Descubre productos premium con un diseño minimalista. 
              <br className="hidden md:block" />
              Calidad, elegancia y simplicidad en cada compra.
            </p>
            <div className="max-w-lg mx-auto mb-12">
              <SearchBar onSearch={setSearchTerm} />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border" data-testid="stats-section">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group" data-testid={`stat-${index}`}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-muted/50 mb-4 group-hover:bg-foreground group-hover:text-background transition-colors">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20" data-testid="categories-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Categorías Principales</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra selección curada de productos premium
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {categories.map((category) => (
              <Link key={category.id} href={category.path}>
                <Card className="group cursor-pointer transition-all duration-500 hover:scale-[1.02] border-2 border-border hover:border-foreground overflow-hidden shadow-soft hover:shadow-strong" data-testid={`category-${category.id}`}>
                  <div className={`h-32 bg-gradient-to-br ${category.gradient} relative`}>
                    <div className="absolute inset-0 bg-black/20"></div>
                    <div className="absolute bottom-4 left-6">
                      <category.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-foreground transition-colors">{category.name}</h3>
                    <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {category.count} productos
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-muted/20" data-testid="featured-products-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-foreground text-background">Productos Destacados</Badge>
            <h2 className="text-4xl font-bold mb-4 text-foreground">Lo Mejor de Nuestra Colección</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Productos seleccionados por nuestros expertos
            </p>
          </div>
          
          {featuredProducts.length === 0 ? (
            <div className="text-center py-16" data-testid="no-products">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-lg">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product.id} className="group">
                  <Card className="overflow-hidden transition-all duration-500 hover:scale-[1.02] border border-border hover:border-foreground shadow-soft hover:shadow-strong">
                    <div className="aspect-square bg-muted/30 relative overflow-hidden">
                      {product.imageUrl && (
                        <img 
                          src={product.imageUrl} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      )}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-foreground/90 text-background">
                          <Star className="h-3 w-3 mr-1 fill-current" />
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
            <h2 className="text-4xl font-bold mb-4 text-foreground">¿Por Qué Elegirnos?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprometidos con la excelencia en cada aspecto
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group text-center p-8 border border-border hover:border-foreground transition-all duration-500 hover:scale-[1.02] shadow-soft hover:shadow-strong" data-testid={`feature-${index}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-muted/50 group-hover:bg-foreground group-hover:text-background transition-all duration-300 mb-6 mx-auto">
                  <feature.icon className="h-8 w-8" />
                </div>
                <div className="text-3xl font-bold text-foreground mb-2">{feature.stat}</div>
                <div className="text-sm text-muted-foreground mb-4">{feature.statLabel}</div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-foreground text-background" data-testid="cta-section">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">Comienza Tu Experiencia</h2>
          <p className="text-xl mb-8 opacity-80 max-w-2xl mx-auto">
            Únete a nuestra comunidad de clientes que valoran la calidad y el diseño
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cars">
              <Button size="lg" variant="outline" className="min-w-[160px] border-background text-background hover:bg-background hover:text-foreground" data-testid="explore-cars-button">
                Explorar Autos
              </Button>
            </Link>
            <Link href="/motorcycles">
              <Button size="lg" variant="secondary" className="min-w-[160px] bg-background text-foreground hover:bg-background/90" data-testid="view-motorcycles-button">
                Ver Motocicletas
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
