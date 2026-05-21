import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import RealtimeChat from "./RealtimeChat";

/**
 * Live Chat Component - Real-time messaging with landlords
 * Design: Warm Hospitality
 */

interface LiveChatProps {
  property: any;
  onClose?: () => void;
}

export default function LiveChat({ property, onClose }: LiveChatProps) {
  const { user } = useAuth();
  
  // Handle both static landlord and API landlordId
  const landlord = property.landlord || property.landlordId || { 
    name: "Unknown", 
    verified: false,
    _id: property.landlordId?._id || property.landlordId
  };
  
  const landlordId = landlord._id || landlord.id;

  if (!user) {
    return (
      <Card className="h-full rounded-2xl flex flex-col items-center justify-center p-8 bg-card shadow-xl text-center">
        <p className="text-muted-foreground mb-4">Please login to chat with the owner.</p>
        {onClose && (
          <Button onClick={onClose} variant="outline" className="rounded-full">
            Close
          </Button>
        )}
      </Card>
    );
  }

  if (!landlordId) {
    return (
      <Card className="h-full rounded-2xl flex flex-col items-center justify-center p-8 bg-card shadow-xl text-center">
        <p className="text-muted-foreground mb-4">Owner information not available for this property.</p>
        {onClose && (
          <Button onClick={onClose} variant="outline" className="rounded-full">
            Close
          </Button>
        )}
      </Card>
    );
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="p-3 border-b border-border flex justify-between items-center bg-muted/50">
        <h3 className="font-bold text-sm">Chat with {landlord.name}</h3>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-full">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <RealtimeChat
          currentUserId={user.id}
          currentUserName={user.name}
          otherUserId={landlordId}
          otherUserName={landlord.name}
          propertyId={property.id || property._id}
        />
      </div>
    </div>
  );
}
