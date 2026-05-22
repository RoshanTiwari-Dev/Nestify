import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Search, Loader2, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import RealtimeChat from "@/components/RealtimeChat";

/**
 * Messages Page - Messaging with landlords and other users
 * Design: Warm Hospitality
 */

export default function Messages() {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/messages/${user?.id}`);
      if (response.ok) {
        const messages = await response.json();
        
        // Group messages by conversation partner
        const conversationMap = new Map();
        
        // Sort messages by creation time (newest last for processing)
        const sortedMessages = [...messages].sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        sortedMessages.forEach((msg: any) => {
          if (!msg.senderId || !msg.receiverId) return;
          
          const partner = msg.senderId._id === user?.id ? msg.receiverId : msg.senderId;
          const partnerId = partner._id;
          
          if (!conversationMap.has(partnerId)) {
            conversationMap.set(partnerId, {
              id: partnerId,
              name: partner.name || "Unknown User",
              avatar: (partner.name || "U").charAt(0),
              lastMessage: msg.content,
              lastMessageTime: new Date(msg.createdAt).getTime(),
              unread: msg.read ? 0 : (msg.receiverId._id === user?.id ? 1 : 0),
              partner: partner
            });
          } else {
            const existing = conversationMap.get(partnerId);
            existing.lastMessage = msg.content;
            existing.lastMessageTime = new Date(msg.createdAt).getTime();
            if (!msg.read && msg.receiverId._id === user?.id) {
              existing.unread += 1;
            }
          }
        });
        
        // Sort conversations by the latest message time (newest first)
        const sortedChats = Array.from(conversationMap.values()).sort(
          (a, b) => b.lastMessageTime - a.lastMessageTime
        );
        
        setChats(sortedChats);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredChats = chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="font-display text-3xl font-bold text-foreground mb-8">
          Messages
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <div className="lg:col-span-1 h-full">
            <Card className="rounded-2xl overflow-hidden flex flex-col h-full shadow-sm">
              <div className="p-4 border-b border-border bg-muted/10">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 rounded-full"
                  />
                </div>
              </div>
              <div className="divide-y divide-border overflow-y-auto flex-1">
                {isLoading ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  </div>
                ) : filteredChats.length > 0 ? (
                  filteredChats.map((chat) => (
                    <button
                      key={chat.id}
                      onClick={() => setSelectedChat(chat)}
                      className={`w-full p-4 text-left transition-colors ${
                        selectedChat?.id === chat.id
                          ? "bg-primary/10"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-primary">
                            {chat.avatar}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-foreground">
                              {chat.name}
                            </p>
                            {chat.unread > 0 && (
                              <span className="bg-primary text-white text-[10px] font-bold rounded-full px-2 py-0.5">
                                {chat.unread}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {chat.lastMessage}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No conversations found
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Chat Window */}
          <div className="lg:col-span-2 h-full">
            {selectedChat ? (
              <Card className="rounded-2xl overflow-hidden flex flex-col h-full shadow-md border-primary/10">
                <RealtimeChat
                  currentUserId={user.id}
                  currentUserName={user.name}
                  otherUserId={selectedChat.id}
                  otherUserName={selectedChat.name}
                />
              </Card>
            ) : (
              <Card className="p-8 rounded-2xl text-center flex flex-col items-center justify-center h-full bg-muted/5 border-dashed border-2">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">Your Conversations</h3>
                <p className="text-muted-foreground max-w-xs">
                  Select a chat from the left to start messaging with property owners or tenants.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
