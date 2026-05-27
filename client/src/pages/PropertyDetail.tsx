import { useRoute } from "wouter";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, MessageSquare, Share2, Heart, MessageCircle, BookOpen, Loader2 } from "lucide-react";
import { getPropertyById } from "@/lib/propertyData";
import { useWishlist } from "@/contexts/WishlistContext";
import LiveChat from "@/components/LiveChat";
import VirtualTour from "@/components/VirtualTour";
import InstantBooking from "@/components/InstantBooking";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/**
 * Property Detail Page - Warm Hospitality Design
 * Features: Virtual tours, instant booking, live chat, wishlist, full property information
 */

export default function PropertyDetail() {
  const { user } = useAuth();
  const [, params] = useRoute("/property/:id");
  const propertyIdStr = params?.id;
  
  const [property, setProperty] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyIdStr) return;
      
      setIsLoading(true);
      try {
        // First try fetching from API (for real properties)
        const response = await fetch(`/api/properties/${propertyIdStr}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        } else {
          // Fallback to static data (for default properties)
          const staticProp = getPropertyById(parseInt(propertyIdStr));
          if (staticProp) {
            setProperty(staticProp);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        const staticProp = getPropertyById(parseInt(propertyIdStr));
        if (staticProp) setProperty(staticProp);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyIdStr]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Property Not Found
          </h1>
          <p className="text-muted-foreground">
            The property you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const isSaved = isInWishlist(property.id || property._id);
  const landlord = property.landlord || property.landlordId || { name: "Unknown", phone: "N/A", email: "N/A" };

  const handleDirectMessage = () => {
    if (!user) {
      toast.error("Please login to message the owner");
      return;
    }
    setShowChat(true);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Virtual Tour */}
            <div className="mb-6">
              <VirtualTour property={property} />
            </div>

            {/* Details */}
            <Card className="p-6 rounded-2xl mb-6 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <h1 className="font-display text-3xl font-bold text-foreground">
                  {property.name}
                </h1>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase">
                  {property.type}
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground mb-4">
                <MapPin className="w-5 h-5" />
                {property.location}, {property.city}
              </div>

              {/* Proximity Info */}
              {(property.nearCollege || property.nearMetro) && (
                <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  {property.nearCollege && (
                    <div className="text-sm">
                      <p className="text-blue-600 font-semibold">{property.nearCollege.distance}</p>
                      <p className="text-blue-700 text-xs">{property.nearCollege.name}</p>
                    </div>
                  )}
                  {property.nearMetro && (
                    <div className="text-sm">
                      <p className="text-purple-600 font-semibold">{property.nearMetro.distance}</p>
                      <p className="text-purple-700 text-xs">{property.nearMetro.name}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="prose prose-sm max-w-none mb-6">
                <p className="text-foreground leading-relaxed">{property.description}</p>
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {(property.amenities || []).map((amenity: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span className="text-foreground text-sm">{amenity}</span>
                  </div>
                ))}
                {property.wifi && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div><span className="text-foreground text-sm">WiFi</span></div>}
                {property.ac && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div><span className="text-foreground text-sm">AC</span></div>}
                {property.food && <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary"></div><span className="text-foreground text-sm">Food</span></div>}
              </div>

              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Property Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted/30 p-3 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Rooms</p>
                  <p className="font-bold text-foreground">{property.rooms || "N/A"}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Bathrooms</p>
                  <p className="font-bold text-foreground">{property.bathrooms || "N/A"}</p>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Parking</p>
                  <p className="font-bold text-foreground">
                    {property.parking ? "Available" : "No"}
                  </p>
                </div>
                <div className="bg-muted/30 p-3 rounded-xl">
                  <p className="text-xs text-muted-foreground uppercase font-bold">Laundry</p>
                  <p className="font-bold text-foreground">{property.laundry ? "Yes" : "No"}</p>
                </div>
              </div>
            </Card>

            {/* Reviews Section */}
            <Card className="p-6 rounded-2xl shadow-sm">
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                Reviews ({property.reviews || 0})
              </h2>
              <div className="space-y-4">
                {property.reviews > 0 ? (
                  [1, 2].map((i) => (
                    <div key={i} className="border-b border-border pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">Happy Resident</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, j) => (
                            <span key={j} className="text-yellow-400">★</span>
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Great place to stay with friendly landlord and good amenities.
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">No reviews yet for this property.</p>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div>
            {/* Price Card */}
            <Card className="p-6 rounded-2xl mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 sticky top-8 shadow-md border-primary/5">
              <div className="text-3xl font-bold text-primary mb-2">
                ₹{(property.price || 0).toLocaleString()}
              </div>
              <p className="text-muted-foreground mb-4 font-medium">per month</p>
              <Button
                className="w-full rounded-full bg-primary hover:bg-primary/90 mb-3 font-bold h-12 shadow-sm"
                onClick={() => {
                  if (!user) {
                    toast.error("Please login to book this property");
                    return;
                  }
                  setShowBooking(true);
                }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Book Now
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-full mb-3 h-12 border-primary/20 hover:bg-primary/5"
                onClick={handleDirectMessage}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Message Owner
              </Button>
              <Button
                variant="ghost"
                className="w-full rounded-full h-12"
                onClick={() =>
                  isSaved ? removeFromWishlist(property.id || property._id) : addToWishlist(property)
                }
              >
                <Heart
                  className={`w-4 h-4 mr-2 ${
                    isSaved ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                {isSaved ? "Saved to Wishlist" : "Save to Wishlist"}
              </Button>
            </Card>

            {/* Live Chat */}
            {showChat && (
              <Card className="p-0 rounded-2xl mb-6 overflow-hidden h-96 shadow-xl border-primary/20">
                <LiveChat property={property} onClose={() => setShowChat(false)} />
              </Card>
            )}

            {/* Landlord Card */}
            <Card className="p-6 rounded-2xl mb-6 shadow-sm">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                Owner Details
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-lg font-bold text-primary">
                    {(landlord.name || "U").charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {landlord.name}
                  </p>
                  {(landlord.verified || property.verified) && (
                    <p className="text-xs text-accent font-bold">✓ Verified Owner</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <a
                  href={`tel:${landlord.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 text-foreground hover:bg-primary/10 hover:text-primary transition-all group"
                >
                  <Phone className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{landlord.phone}</span>
                </a>
                <a
                  href={`mailto:${landlord.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 text-foreground hover:bg-primary/10 hover:text-primary transition-all group"
                >
                  <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">{landlord.email}</span>
                </a>
              </div>
            </Card>

            {/* Share Card */}
            <Card className="p-6 rounded-2xl shadow-sm">
              <h3 className="font-display text-lg font-bold text-foreground mb-4">
                Share
              </h3>
              <Button variant="outline" className="w-full rounded-full border-dashed" onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
              }}>
                <Share2 className="w-4 h-4 mr-2" />
                Copy Link
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {/* Instant Booking Modal */}
      <InstantBooking
        property={property}
        isOpen={showBooking}
        onClose={() => setShowBooking(false)}
      />
    </div>
  );
}
