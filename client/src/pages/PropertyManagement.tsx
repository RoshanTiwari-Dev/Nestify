import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit2, Trash2, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

/**
 * Property Management Page - For Landlords/Hosts
 * Features: List, add, edit, delete properties with multiple photos
 * Design: Warm Hospitality
 */

interface PropertyForm {
  name: string;
  location: string;
  city: string;
  price: string;
  type: "boys" | "girls" | "co-ed";
  description: string;
  rooms: string;
  bathrooms: string;
  food: boolean;
  ac: boolean;
  wifi: boolean;
  parking: boolean;
  laundry: boolean;
  studyRoom: boolean;
  commonArea: boolean;
  images: string[];
}

export default function PropertyManagement() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  
  const [formData, setFormData] = useState<PropertyForm>({
    name: "",
    location: "",
    city: "Jaipur",
    price: "",
    type: "boys",
    description: "",
    rooms: "",
    bathrooms: "",
    food: false,
    ac: false,
    wifi: true,
    parking: false,
    laundry: false,
    studyRoom: false,
    commonArea: false,
    images: [],
  });

  useEffect(() => {
    if (user) {
      fetchProperties();
    }
  }, [user]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/properties/landlord/${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error("Failed to load your properties");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = () => {
    if (!imageUrl) return;
    if (formData.images.length >= 6) {
      toast.error("Maximum 6 images allowed");
      return;
    }
    setFormData({
      ...formData,
      images: [...formData.images, imageUrl]
    });
    setImageUrl("");
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSaveProperty = async () => {
    if (!formData.name || !formData.location || !formData.price || !formData.city) {
      toast.error("Please fill in required fields");
      return;
    }

    try {
      setIsSubmitting(true);
      const url = editingId ? `/api/properties/${editingId}` : "/api/properties";
      const method = editingId ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          rooms: parseInt(formData.rooms) || 0,
          bathrooms: parseInt(formData.bathrooms) || 0,
          landlordId: user?.id,
        }),
      });

      if (response.ok) {
        toast.success(editingId ? "Property updated!" : "Property added successfully!");
        fetchProperties();
        resetForm();
      } else {
        const error = await response.json();
        toast.error(error.error || "Operation failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      location: "",
      city: "Jaipur",
      price: "",
      type: "boys",
      description: "",
      rooms: "",
      bathrooms: "",
      food: false,
      ac: false,
      wifi: true,
      parking: false,
      laundry: false,
      studyRoom: false,
      commonArea: false,
      images: [],
    });
    setEditingId(null);
    setShowAddForm(false);
    setImageUrl("");
  };

  const handleEdit = (property: any) => {
    setFormData({
      name: property.name,
      location: property.location,
      city: property.city || "Jaipur",
      price: property.price.toString(),
      type: property.type,
      description: property.description || "",
      rooms: property.rooms?.toString() || "",
      bathrooms: property.bathrooms?.toString() || "",
      food: property.food || false,
      ac: property.ac || false,
      wifi: property.wifi || false,
      parking: property.parking || false,
      laundry: property.laundry || false,
      studyRoom: property.studyRoom || false,
      commonArea: property.commonArea || false,
      images: property.images || [],
    });
    setEditingId(property._id);
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;
    
    try {
      const response = await fetch(`/api/properties/${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("Property deleted");
        setProperties(properties.filter((p) => p._id !== id));
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">
              My Properties
            </h1>
            <p className="text-muted-foreground">Manage your listed PGs and hostels</p>
          </div>
          <Button
            className="rounded-full bg-primary hover:bg-primary/90"
            onClick={() => {
              if (showAddForm) resetForm();
              else setShowAddForm(true);
            }}
          >
            {showAddForm ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {showAddForm ? "Cancel" : "Add Property"}
          </Button>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <Card className="p-6 rounded-2xl mb-8 shadow-lg border-primary/10">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">
              {editingId ? "Edit Property" : "Add New Property"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Property Name *
                </label>
                <Input
                  placeholder="e.g., Sunrise PG"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  City *
                </label>
                <Input
                  placeholder="e.g., Jaipur"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="rounded-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Area/Location *
                </label>
                <Input
                  placeholder="e.g., Malviya Nagar"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="rounded-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Price (₹/month) *
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 4000"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="rounded-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Property Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as "boys" | "girls" | "co-ed",
                    })
                  }
                  className="w-full px-4 py-2 rounded-full border border-border bg-background text-foreground"
                >
                  <option value="boys">Boys</option>
                  <option value="girls">Girls</option>
                  <option value="co-ed">Co-ed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Rooms
                  </label>
                  <Input
                    type="number"
                    placeholder="8"
                    value={formData.rooms}
                    onChange={(e) => setFormData({ ...formData, rooms: e.target.value })}
                    className="rounded-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Bathrooms
                  </label>
                  <Input
                    type="number"
                    placeholder="4"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="rounded-full"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-foreground mb-2">
                Description
              </label>
              <Textarea
                placeholder="Describe your property, rules, and surroundings..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="rounded-xl"
                rows={3}
              />
            </div>

            {/* Photos Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Property Photos (Add 4-5 photos)
              </label>
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Paste image URL here..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="rounded-full flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddImage}
                  className="rounded-full"
                  variant="secondary"
                >
                  Add URL
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {formData.images.map((url, index) => (
                  <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-border">
                    <img src={url} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {formData.images.length < 6 && (
                  <div className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-6 h-6 mb-1 opacity-20" />
                    <span className="text-[10px]">Photo {formData.images.length + 1}</span>
                  </div>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 italic">
                Tip: You can use public image URLs from Unsplash or other hosting services.
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-foreground mb-3">
                Amenities
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "food", label: "Food Included" },
                  { key: "ac", label: "AC" },
                  { key: "wifi", label: "WiFi" },
                  { key: "parking", label: "Parking" },
                  { key: "laundry", label: "Laundry" },
                  { key: "studyRoom", label: "Study Room" },
                  { key: "commonArea", label: "Common Area" },
                ].map((amenity) => (
                  <label key={amenity.key} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[amenity.key as keyof PropertyForm] as boolean}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [amenity.key]: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-foreground">{amenity.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                className="flex-1 rounded-full bg-primary hover:bg-primary/90"
                onClick={handleSaveProperty}
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editingId ? "Update Property" : "List Property"}
              </Button>
              <Button
                variant="outline"
                className="flex-1 rounded-full"
                onClick={resetForm}
              >
                Cancel
              </Button>
            </div>
          </Card>
        )}

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.length > 0 ? (
            properties.map((property) => (
              <Card key={property._id} className="p-0 rounded-2xl hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                <div className="aspect-video w-full bg-muted relative">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-8 h-8 opacity-20" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] uppercase font-bold px-3 py-1 rounded-full shadow-sm ${
                      property.type === 'boys' ? 'bg-blue-500 text-white' : 
                      property.type === 'girls' ? 'bg-pink-500 text-white' : 'bg-purple-500 text-white'
                    }`}>
                      {property.type}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display text-xl font-bold text-foreground">
                      {property.name}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{property.location}, {property.city}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                    <div className="bg-muted/30 p-2 rounded-lg">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Price</p>
                      <p className="font-bold text-foreground">₹{property.price}</p>
                    </div>
                    <div className="bg-muted/30 p-2 rounded-lg">
                      <p className="text-[10px] text-muted-foreground uppercase font-semibold">Photos</p>
                      <p className="font-bold text-foreground">{property.images?.length || 0}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full"
                      onClick={() => handleEdit(property)}
                    >
                      <Edit2 className="w-3 h-3 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-full text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      onClick={() => handleDelete(property._id)}
                    >
                      <Trash2 className="w-3 h-3 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted-foreground/10">
              <ImageIcon className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground">No properties yet</h3>
              <p className="text-muted-foreground mb-6">List your first property to start hosting</p>
              <Button 
                onClick={() => setShowAddForm(true)}
                className="rounded-full"
              >
                Add Property
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
