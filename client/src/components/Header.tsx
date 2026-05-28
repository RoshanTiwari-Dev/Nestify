import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, LogOut, LogIn } from "lucide-react";
import { useState } from "react";
import NotificationBell from "./NotificationBell";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Header Component - Warm Hospitality Design
 * Features: Logo, navigation menu, user actions, theme toggle, authentication
 * Design: Rounded corners, warm coral accent, responsive mobile menu
 */

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleAuthAction = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border shadow-sm dark:bg-slate-950">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center gap-2 no-underline">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663490327936/TzN54ThndsQfyZ4yvrXWYy/nestify-logo-new-XhSiiisGWjWosbbbN2nk93.webp"
              alt="Nestify"
              className="w-10 h-10"
            />
            <span className="font-display text-xl font-bold text-foreground hidden sm:inline">
              Nestify
            </span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/">
            <a className="text-foreground hover:text-primary transition-colors font-body">
              Browse
            </a>
          </Link>
          <Link href="/dashboard">
            <a className="text-foreground hover:text-primary transition-colors font-body">
              Dashboard
            </a>
          </Link>
          {user?.role === "landlord" && (
            <Link href="/my-properties">
              <a className="text-foreground hover:text-primary transition-colors font-body">
                My Properties
              </a>
            </Link>
          )}
          <Link href="/messages">
            <a className="text-foreground hover:text-primary transition-colors font-body">
              Messages
            </a>
          </Link>
        </nav>

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link href="/wishlist">
            <a className="p-2 hover:bg-muted rounded-full transition-colors">
              <Heart className="w-6 h-6 text-foreground" />
            </a>
          </Link>
          <NotificationBell />
          <ThemeToggle />
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-muted">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground hidden sm:inline">
                  {user.name}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={handleAuthAction}
                className="rounded-full"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </Button>
            </>
          ) : (
            <Button
              onClick={handleAuthAction}
              className="rounded-full bg-primary hover:bg-primary/90 shadow-sm"
              size="sm"
            >
              <LogIn className="w-4 h-4 mr-1" />
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background dark:bg-slate-950">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link href="/">
              <a className="text-foreground hover:text-primary transition-colors font-body">
                Browse
              </a>
            </Link>
            <Link href="/dashboard">
              <a className="text-foreground hover:text-primary transition-colors font-body">
                Dashboard
              </a>
            </Link>
            {user?.role === "landlord" && (
              <Link href="/my-properties">
                <a className="text-foreground hover:text-primary transition-colors font-body">
                  My Properties
                </a>
              </Link>
            )}
            <Link href="/messages">
              <a className="text-foreground hover:text-primary transition-colors font-body">
                Messages
              </a>
            </Link>
            <Link href="/wishlist">
              <a className="text-foreground hover:text-primary transition-colors font-body flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Wishlist
              </a>
            </Link>
            <div className="border-t border-border pt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="px-3 py-2 rounded-lg bg-muted">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleAuthAction}
                    className="w-full rounded-full"
                    size="sm"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleAuthAction}
                  className="w-full rounded-full bg-primary hover:bg-primary/90"
                  size="sm"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
