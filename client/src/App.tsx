import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import WhatsAppFloat from "@/components/layout/whatsapp-float";
import CartModal from "@/components/cart/cart-modal";
import GameModal from "@/components/games/game-modal";
import WholesaleModal from "@/components/wholesale/wholesale-modal";
import Home from "@/pages/home";
import Products from "@/pages/products";
import Cars from "@/pages/cars";
import Motorcycles from "@/pages/motorcycles";
import Games from "@/pages/games";
import Profile from "@/pages/profile";
import Wholesale from "@/pages/wholesale";
import Admin from "@/pages/admin";
import Subscription from "@/pages/subscription";
import NotFound from "@/pages/not-found";
import { Terms } from "@/pages/terms";
import { Privacy } from "@/pages/privacy";
import Checkout from "@/pages/checkout";
import CheckoutSuccess from "@/pages/checkout-success";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/productos" component={Products} />
      <Route path="/cars" component={Cars} />
      <Route path="/autos" component={Cars} />
      <Route path="/motorcycles" component={Motorcycles} />
      <Route path="/motos" component={Motorcycles} />
      <Route path="/juegos" component={Games} />
      <Route path="/perfil" component={Profile} />
      <Route path="/mayoristas" component={Wholesale} />
      <Route path="/admin" component={Admin} />
      <Route path="/suscripcion" component={Subscription} />
      <Route path="/vip" component={Subscription} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/checkout/success" component={CheckoutSuccess} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Router />
          </main>
          <Footer />
          
          {/* Floating elements */}
          <WhatsAppFloat />
          
          {/* Modals */}
          <CartModal />
          <GameModal />
          <WholesaleModal />
          
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
