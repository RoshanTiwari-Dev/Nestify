import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Loader, CheckCheck, Check } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

interface RealtimeChatProps {
  currentUserId: string;
  currentUserName: string;
  otherUserId: string;
  otherUserName: string;
  propertyId?: string;
}

export default function RealtimeChat({
  currentUserId,
  currentUserName,
  otherUserId,
  otherUserName,
  propertyId,
}: RealtimeChatProps) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [sendingMessages, setSendingMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize Socket.io connection
  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_WS_URL ||
      (window.location.hostname === "localhost"
        ? "http://localhost:3000"
        : "https://nestify-1-37nq.onrender.com");

    const socket = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current = socket;

    // Connection events
    socket.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
      setIsConnected(true);

      // Join the chat room
      socket.emit("user:join", {
        userId: currentUserId,
        username: currentUserName,
      });

      socket.emit("chat:join", {
        userId: currentUserId,
        otherUserId: otherUserId,
      });
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from WebSocket server");
      setIsConnected(false);
    });

    // Message events
    socket.on("chat:history", (history: Message[]) => {
      setMessages(
        history.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }))
      );
    });

    socket.on("message:receive", (message: Message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          timestamp: new Date(message.timestamp),
        },
      ]);
    });

    socket.on("message:sent", (data: { messageId: string; status: string }) => {
      setSendingMessages((prev) => {
        const updated = new Set(prev);
        updated.delete(data.messageId);
        return updated;
      });
    });

    socket.on("message:read", (data: { messageId: string }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === data.messageId ? { ...msg, read: true } : msg
        )
      );
    });

    // Typing indicators
    socket.on(
      "typing:indicator",
      (data: { userId: string; isTyping: boolean }) => {
        if (data.userId === otherUserId) {
          setOtherUserTyping(data.isTyping);
        }
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [currentUserId, currentUserName, otherUserId]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socketRef.current) return;

    const messageId = `msg_${Date.now()}`;
    setSendingMessages((prev) => new Set(prev).add(messageId));

    socketRef.current.emit("message:send", {
      senderId: currentUserId,
      senderName: currentUserName,
      receiverId: otherUserId,
      content: inputValue,
      propertyId,
    });

    // Add message to local state immediately
    setMessages((prev) => [
      ...prev,
      {
        id: messageId,
        senderId: currentUserId,
        senderName: currentUserName,
        receiverId: otherUserId,
        content: inputValue,
        timestamp: new Date(),
        read: false,
      },
    ]);

    setInputValue("");
    setIsTyping(false);
  };

  const handleTyping = (value: string) => {
    setInputValue(value);

    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      socketRef.current?.emit("typing:start", {
        userId: currentUserId,
        otherUserId: otherUserId,
      });
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socketRef.current?.emit("typing:stop", {
        userId: currentUserId,
        otherUserId: otherUserId,
      });
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-96 bg-background">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground">{otherUserName || "User"}</h3>
            <p className="text-xs text-muted-foreground">
              {isConnected ? "🟢 Online" : "🔴 Offline"}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p className="text-sm">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderId === currentUserId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                  message.senderId === currentUserId
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p>{message.content}</p>
                <div className="flex items-center justify-end mt-1 space-x-1">
                  <span className="text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {message.senderId === currentUserId && (
                    <>
                      {sendingMessages.has(message.id) ? (
                        <Loader className="w-3 h-3 animate-spin" />
                      ) : message.read ? (
                        <CheckCheck className="w-3 h-3" />
                      ) : (
                        <Check className="w-3 h-3" />
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing indicator */}
        {otherUserTyping && (
          <div className="flex justify-start">
            <div className="bg-muted text-foreground px-4 py-2 rounded-lg text-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={inputValue}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isConnected}
            className="rounded-full"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || !isConnected}
            size="sm"
            className="rounded-full"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {!isConnected && (
          <p className="text-xs text-yellow-600 mt-2">
            ⚠️ Reconnecting to server...
          </p>
        )}
      </div>
    </Card>
  );
}
