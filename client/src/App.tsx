import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Home from "./pages/Home";
import PropertyDetail from "./pages/PropertyDetail";
import Dashboard from "./pages/Dashboard";
import PropertyManagement from "./pages/PropertyManagement";
import Bookings from "./pages/Bookings";
import Messages from "./pages/Messages";
import Reviews from "./pages/Reviews";
import Header from "./components/Header";
import Chatbot from "./components/Chatbot";
import Wishlist from "./pages/Wishlist";
import Footer from "./components/Footer";
import { WishlistProvider } from "./contexts/WishlistContext";
import Login from "./components/Login";

/**
 * Nestify - PG & Hostel Finder
 * Design: Warm Hospitality - Organic shapes, warm colors (coral, gold, sage green), rounded corners
 * Typography: Poppins (display), Nunito (body)
 * Color Palette: Coral (#ff6b6b), Gold (#ffd93d), Sage Green (#6bcf7f), Cream (#fffbf0)
 */

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated, isGuest, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not in guest mode, show login
  if (!isAuthenticated && !isGuest) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Chatbot />
      <main>
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/property/:id"} component={PropertyDetail} />
          <Route path={"/dashboard"} component={Dashboard} />
          
          {/* Protected Routes - only for authenticated users */}
          <Route path="/my-properties">
            <ProtectedRoute component={PropertyManagement} />
          </Route>
          <Route path="/bookings">
            <ProtectedRoute component={Bookings} />
          </Route>
          <Route path="/messages">
            <ProtectedRoute component={Messages} />
          </Route>
          <Route path="/wishlist">
            <ProtectedRoute component={Wishlist} />
          </Route>
          <Route path="/reviews">
            <ProtectedRoute component={Reviews} />
          </Route>
          
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable={true}>
        <AuthProvider>
          <WishlistProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </WishlistProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
