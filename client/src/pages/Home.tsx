import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, BookOpen, MapPin, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import {
  getAllProperties,
  CITIES,
  CITY_LOCATIONS,
  getPropertiesNearColleges,
  COLLEGES,
} from "@/lib/propertyData";
import PropertyCard from "@/components/PropertyCard";

/**
 * Home Page - Warm Hospitality Design
 * Features: Hero section, search bar, advanced sorting, pagination, property listings with filters
 * Design: Warm colors, rounded cards, organic layout
 */

type SortOption = "newest" | "price-low" | "price-high" | "rating" | "distance";

export default function Home() {
  const [searchLocation, setSearchLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceFilter, setPriceFilter] = useState<"all" | "low" | "mid" | "high">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "boys" | "girls" | "co-ed">("all");
  const [showNearColleges, setShowNearColleges] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const allProperties = getAllProperties();
  const locations = selectedCity ? CITY_LOCATIONS[selectedCity] || [] : [];

  const [realProperties, setRealProperties] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/properties")
      .then((res) => res.json())
      .then((data) => setRealProperties(data))
      .catch(console.error);
  }, []);

  const filteredProperties = useMemo(() => {
    // Combine static properties with real ones from API
    let filtered = [...allProperties, ...realProperties];

    // Filter by city if selected
    if (selectedCity) {
      filtered = filtered.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase());
    }

    // Filter by location if selected
    if (selectedLocation) {
      filtered = filtered.filter((p) => p.location.toLowerCase() === selectedLocation.toLowerCase());
    }

    // Filter by search location
    if (searchLocation) {
      const search = searchLocation.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.location.toLowerCase().includes(search) ||
          p.city.toLowerCase().includes(search)
      );
    }

    // Filter by price range
    if (priceFilter !== "all") {
      if (priceFilter === "low") {
        filtered = filtered.filter((p) => p.price < 5000);
      } else if (priceFilter === "mid") {
        filtered = filtered.filter((p) => p.price >= 5000 && p.price <= 7000);
      } else if (priceFilter === "high") {
        filtered = filtered.filter((p) => p.price > 7000);
      }
    }

    // Filter by property type
    if (typeFilter !== "all") {
      filtered = filtered.filter((p) => p.type === typeFilter);
    }

    // Apply sorting (create a new array to avoid mutating state)
    const sorted = [...filtered];
    if (sortBy === "price-low") {
      sorted.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      sorted.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "distance") {
      sorted.sort((a, b) => {
        const distA = a.nearMetro ? parseInt(a.nearMetro.distance) : 999;
        const distB = b.nearMetro ? parseInt(b.nearMetro.distance) : 999;
        return distA - distB;
      });
    }

    return sorted;
  }, [searchLocation, selectedCity, selectedLocation, priceFilter, typeFilter, sortBy, allProperties, realProperties]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + itemsPerPage);

  const nearCollegeProperties = useMemo(() => {
    if (!selectedCity) return [];
    return getPropertiesNearColleges(selectedCity);
  }, [selectedCity]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div
        className="relative h-96 bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663490327936/TzN54ThndsQfyZ4yvrXWYy/nestify-hero-MypPbgT6S6Y4WWu5X8Nsnd.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="font-display text-5xl font-bold mb-4">Find Your Perfect Home</h1>
          <p className="text-xl">
            Discover comfortable PG accommodations and hostels tailored to your needs
          </p>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white border-b border-border sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* City Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setSelectedCity(e.target.value);
                  setSelectedLocation("");
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-full border border-border bg-background text-foreground font-medium text-sm"
              >
                <option value="">All Cities</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Dropdown */}
            {selectedCity && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => {
                    setSelectedLocation(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 rounded-full border border-border bg-background text-foreground font-medium text-sm"
                >
                  <option value="">All Locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Search Location */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Area or PG name..."
                  value={searchLocation}
                  onChange={(e) => {
                    setSearchLocation(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 rounded-full border-border text-sm"
                />
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Price
              </label>
              <select
                value={priceFilter}
                onChange={(e) => {
                  setPriceFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-full border border-border bg-background text-foreground font-medium text-sm"
              >
                <option value="all">All Prices</option>
                <option value="low">Under ₹5000</option>
                <option value="mid">₹5000 - ₹7000</option>
                <option value="high">Above ₹7000</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => {
                  setTypeFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 rounded-full border border-border bg-background text-foreground font-medium text-sm"
              >
                <option value="all">All Types</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="co-ed">Co-ed</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                className="w-full rounded-full text-sm h-9"
                onClick={() => {
                  setSelectedCity("");
                  setSelectedLocation("");
                  setSearchLocation("");
                  setPriceFilter("all");
                  setTypeFilter("all");
                  setSortBy("newest");
                  setCurrentPage(1);
                }}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Near Colleges Section */}
      {selectedCity && nearCollegeProperties.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 py-6">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-display font-bold text-foreground">
                    PGs Near Colleges & Universities
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {nearCollegeProperties.length} properties near educational institutions
                  </p>
                </div>
              </div>
              <Button
                variant={showNearColleges ? "default" : "outline"}
                className="rounded-full text-sm"
                onClick={() => setShowNearColleges(!showNearColleges)}
              >
                {showNearColleges ? "Hide" : "Show"} Near Colleges
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Near Colleges Properties */}
      {showNearColleges && selectedCity && nearCollegeProperties.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <h2 className="font-display text-2xl font-bold text-foreground mb-6">
            Student-Friendly PGs Near Top Colleges
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {nearCollegeProperties.slice(0, 6).map((property) => (
              <PropertyCard key={property.id || property._id} property={property} />
            ))}
          </div>
        </div>
      )}

      {/* Properties Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">
              Available Properties
            </h2>
            <p className="text-muted-foreground text-sm">
              {filteredProperties.length} properties found
              {selectedCity && ` in ${selectedCity}`}
              {selectedLocation && ` • ${selectedLocation}`}
            </p>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as SortOption);
                setCurrentPage(1);
              }}
              className="px-3 py-2 rounded-full border border-border bg-background text-foreground font-medium text-sm"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="distance">Closest to Metro</option>
            </select>
          </div>
        </div>

        {paginatedProperties.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedProperties.map((property) => (
                <PropertyCard key={property.id || property._id} property={property} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className="rounded-full min-w-10"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No properties found matching your criteria.
            </p>
            <Button
              className="rounded-full bg-primary hover:bg-primary/90"
              onClick={() => {
                setSelectedCity("");
                setSelectedLocation("");
                setSearchLocation("");
                setPriceFilter("all");
                setTypeFilter("all");
                setSortBy("newest");
                setCurrentPage(1);
              }}
            >
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
