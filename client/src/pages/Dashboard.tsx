import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { BookOpen, MessageSquare, Star, Home, LogOut, Settings, Heart, UserCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";

/**
 * Dashboard Page - Compact User Profile and Activity
 * Features: User info, quick stats, quick links, recent activity
 * Guest Mode: Shows login prompt and limited information
 */

export default function Dashboard() {
  const { user, isGuest, logout } = useAuth();
  const [propertyCount, setPropertyCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (user) {
      // Fetch user-specific stats
      if (user.role === "landlord") {
        fetch(`/api/properties/landlord/${user.id}`)
          .then((res) => res.json())
          .then((data) => setPropertyCount(data.length || 0))
          .catch(console.error);
      }
      
      fetch(`/api/messages/${user.id}`)
        .then((res) => res.json())
        .then((data) => setMessageCount(data.length || 0))
        .catch(console.error);
    }
  }, [user]);

  // Guest Dashboard View
  if (isGuest && !user) {
    return (
      <div className="min-h-screen bg-background py-6">
        <div className="container mx-auto px-4">
          {/* Guest Welcome Header */}
          <Card className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20 mb-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md">
                <UserCircle className="w-12 h-12 text-primary/40" />
              </div>
              <div className="flex-1">
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome, Guest!</h1>
                <p className="text-muted-foreground mb-4">You're browsing Nestify in guest mode. Login or create an account to book properties, message owners, and save your favorites.</p>
                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <Button asChild className="rounded-full px-8">
                    <Link href="/">Sign In / Register</Link>
                  </Button>
                  <Button variant="outline" className="rounded-full px-8" onClick={logout}>
                    Exit Guest Mode
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Guest Stats (Placeholder) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8 opacity-60 grayscale">
            {[
              { icon: BookOpen, label: "Bookings", value: "0", color: "blue" },
              { icon: MessageSquare, label: "Messages", value: "0", color: "purple" },
              { icon: Home, label: "Properties", value: "0", color: "yellow" },
              { icon: Heart, label: "Saved", value: "0", color: "pink" },
            ].map((stat, i) => (
              <Card key={i} className={`p-4 rounded-xl bg-${stat.color}-50`}>
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  <div>
                    <p className="text-xs font-semibold">{stat.label}</p>
                    <p className="font-display text-xl font-bold">{stat.value}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Guest Quick Links */}
          <h2 className="font-display text-xl font-bold text-foreground mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Link href="/">
              <a className="no-underline">
                <Card className="p-6 rounded-xl text-center hover:shadow-md transition-shadow cursor-pointer border-primary/10">
                  <Home className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="font-semibold text-sm text-foreground">Browse Homes</p>
                </Card>
              </a>
            </Link>
            <div className="opacity-50 cursor-not-allowed">
              <Card className="p-6 rounded-xl text-center border-dashed">
                <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-sm text-muted-foreground">My Bookings</p>
              </Card>
            </div>
            <div className="opacity-50 cursor-not-allowed">
              <Card className="p-6 rounded-xl text-center border-dashed">
                <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-sm text-muted-foreground">Messages</p>
              </Card>
            </div>
            <div className="opacity-50 cursor-not-allowed">
              <Card className="p-6 rounded-xl text-center border-dashed">
                <Heart className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="font-semibold text-sm text-muted-foreground">Wishlist</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container mx-auto px-4">
        {/* Header with Profile */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <p className="text-xs font-semibold px-2 py-0.5 bg-primary/10 text-primary rounded-full inline-block mt-1 uppercase">
                {user.role}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="rounded-full" onClick={logout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Card className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-blue-600 font-semibold">Bookings</p>
                <p className="font-display text-xl font-bold text-blue-900">
                  {user.role === "landlord" ? "Real-time" : "3"}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-purple-600 font-semibold">Messages</p>
                <p className="font-display text-xl font-bold text-purple-900">{messageCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200/50">
            <div className="flex items-center gap-3">
              <Home className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-yellow-600 font-semibold">Properties</p>
                <p className="font-display text-xl font-bold text-yellow-900">{propertyCount}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200/50">
            <div className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-pink-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-pink-600 font-semibold">Saved</p>
                <p className="font-display text-xl font-bold text-pink-900">12</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <Link href="/bookings">
            <a className="no-underline">
              <Card className="p-4 rounded-xl text-center hover:shadow-md transition-shadow cursor-pointer">
                <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="font-semibold text-sm text-foreground">Bookings</p>
              </Card>
            </a>
          </Link>
          <Link href="/messages">
            <a className="no-underline">
              <Card className="p-4 rounded-xl text-center hover:shadow-md transition-shadow cursor-pointer">
                <MessageSquare className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="font-semibold text-sm text-foreground">Messages</p>
              </Card>
            </a>
          </Link>
          {user.role === "landlord" && (
            <Link href="/my-properties">
              <a className="no-underline">
                <Card className="p-4 rounded-xl text-center hover:shadow-md transition-shadow cursor-pointer">
                  <Home className="w-6 h-6 text-secondary mx-auto mb-2" />
                  <p className="font-semibold text-sm text-foreground">My Properties</p>
                </Card>
              </a>
            </Link>
          )}
          <Link href="/wishlist">
            <a className="no-underline">
              <Card className="p-4 rounded-xl text-center hover:shadow-md transition-shadow cursor-pointer">
                <Heart className="w-6 h-6 text-pink-600 mx-auto mb-2" />
                <p className="font-semibold text-sm text-foreground">Wishlist</p>
              </Card>
            </a>
          </Link>
        </div>

        {/* Recent Activity & Profile Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <Card className="p-4 rounded-xl">
            <h3 className="font-display font-bold text-foreground mb-3 text-sm">Recent Activity</h3>
            <div className="space-y-2">
              {[
                { title: "Welcome to Nestify!", time: "Just now" },
                { title: "Profile updated", time: "1 day ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Profile Settings */}
          <Card className="p-4 rounded-xl">
            <h3 className="font-display font-bold text-foreground mb-3 text-sm">Profile Settings</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full rounded-lg text-sm h-9 justify-start">
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full rounded-lg text-sm h-9 justify-start">
                Change Password
              </Button>
              <Button variant="outline" className="w-full rounded-lg text-sm h-9 justify-start">
                Notification Settings
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
