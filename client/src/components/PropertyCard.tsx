import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Star,
  Wifi,
  Wind,
  UtensilsCrossed,
  ParkingCircle,
  Zap,
  MessageSquare,
  Heart,
  Check,
  BookOpen,
  Train,
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { Property } from "@/lib/propertyData";

/**
 * PropertyCard Component - Warm Hospitality Design
 * Displays individual property with key information and quick actions
 * Enhanced with better layout, landlord info, and interactive elements
 */

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  // Handle both static landlord and API landlordId
  const landlord = property.landlord || property.landlordId || { name: "Unknown", rating: 0, verified: false };
  const propertyId = property.id || property._id;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "boys":
        return "bg-blue-100 text-blue-700";
      case "girls":
        return "bg-pink-100 text-pink-700";
      case "co-ed":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 rounded-2xl bg-card hover:scale-105 flex flex-col h-full">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-muted">
        <img
          src={property.image || (property.images && property.images.length > 0 ? property.images[0] : "https://via.placeholder.com/400x300?text=No+Image+Available")}
          alt={property.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />

        {/* Type Badge */}
        <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${getTypeColor(property.type)}`}>
          {property.type.charAt(0).toUpperCase() + property.type.slice(1)}
        </div>

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`}
          />
        </button>

        {/* Price Badge */}
        <div className="absolute bottom-4 left-4 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg">
          ₹{property.price.toLocaleString()}/mo
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Property Name & Location */}
        <h3 className="font-display text-lg font-bold text-foreground mb-1 line-clamp-2">
          {property.name}
        </h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">{property.location}</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 font-semibold text-foreground text-sm">{property.rating}</span>
          </div>
          <span className="text-xs text-muted-foreground">({property.reviews} reviews)</span>
        </div>

        {/* Amenities Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex flex-col items-center text-center">
            {property.wifi ? (
              <>
                <Wifi className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs font-medium text-foreground">WiFi</span>
              </>
            ) : (
              <>
                <Wifi className="w-5 h-5 text-gray-300 mb-1" />
                <span className="text-xs text-gray-300">No WiFi</span>
              </>
            )}
          </div>
          <div className="flex flex-col items-center text-center">
            {property.ac ? (
              <>
                <Wind className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs font-medium text-foreground">AC</span>
              </>
            ) : (
              <>
                <Wind className="w-5 h-5 text-gray-300 mb-1" />
                <span className="text-xs text-gray-300">No AC</span>
              </>
            )}
          </div>
          <div className="flex flex-col items-center text-center">
            {property.food ? (
              <>
                <UtensilsCrossed className="w-5 h-5 text-primary mb-1" />
                <span className="text-xs font-medium text-foreground">Food</span>
              </>
            ) : (
              <>
                <UtensilsCrossed className="w-5 h-5 text-gray-300 mb-1" />
                <span className="text-xs text-gray-300">No Food</span>
              </>
            )}
          </div>
        </div>

        {/* Quick Info */}
        <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg">
          <div className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-primary" />
            <span>{property.rooms} Rooms</span>
          </div>
          <div className="flex items-center gap-1">
            {property.parking ? (
              <>
                <ParkingCircle className="w-4 h-4 text-primary" />
                <span>Parking</span>
              </>
            ) : (
              <>
                <ParkingCircle className="w-4 h-4 text-gray-300" />
                <span>No Parking</span>
              </>
            )}
          </div>
        </div>

        {/* Proximity Info */}
        <div className="space-y-2 mb-4">
          {property.nearCollege && (
            <div className="flex items-center gap-2 text-xs bg-blue-50 text-blue-700 p-2 rounded-lg">
              <BookOpen className="w-3 h-3 flex-shrink-0" />
              <div className="flex-1 truncate">
                <span className="font-semibold">{property.nearCollege.distance}</span> from {property.nearCollege.name.split(' ').slice(0, 2).join(' ')}
              </div>
            </div>
          )}
          {property.nearMetro && (
            <div className="flex items-center gap-2 text-xs bg-purple-50 text-purple-700 p-2 rounded-lg">
              <Train className="w-3 h-3 flex-shrink-0" />
              <div className="flex-1 truncate">
                <span className="font-semibold">{property.nearMetro.distance}</span> from {property.nearMetro.name}
              </div>
            </div>
          )}
        </div>

        {/* Landlord Info */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-3 mb-4 border border-primary/10">
          <p className="text-xs text-muted-foreground font-semibold mb-2">Landlord</p>
          <div className="flex items-start justify-between">
            <div className="flex-1">
                <p className="font-semibold text-sm text-foreground">{landlord.name}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-muted-foreground">{landlord.rating || "New"}</span>
                {(landlord.verified || property.verified) && (
                  <span className="ml-1 flex items-center gap-0.5 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    <Check className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <Link href={`/property/${propertyId}`} className="flex-1">
            <a className="no-underline">
              <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
                View Details
              </Button>
            </a>
          </Link>
          <Link href={`/property/${propertyId}`} className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-full border-primary/30 hover:bg-primary/10"
              onClick={(e) => {
                // Let the Link handle navigation, but we could pass a state to open chat
                // For now, navigating to detail page is better than a broken alert
              }}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Message
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
