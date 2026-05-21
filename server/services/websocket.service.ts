import { Server as SocketIOServer, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import mongoose from "mongoose";

interface ActiveUser {
  userId: string;
  socketId: string;
  username: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

class WebSocketService {
  private io: SocketIOServer;
  private activeUsers: Map<string, ActiveUser> = new Map();
  private chatRooms: Map<string, ChatMessage[]> = new Map();

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
      },
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.io.on("connection", (socket: Socket) => {
      console.log(`✅ User connected: ${socket.id}`);

      // User joins
      socket.on("user:join", (data: { userId: string; username: string }) => {
        const { userId, username } = data;
        this.activeUsers.set(userId, {
          userId,
          socketId: socket.id,
          username,
        });

        // Broadcast online users
        this.io.emit("users:online", Array.from(this.activeUsers.values()));
        console.log(`👤 User ${username} (${userId}) joined`);
      });

      // Send message
      socket.on(
        "message:send",
        async (data: {
          senderId: string;
          senderName: string;
          receiverId: string;
          content: string;
          propertyId?: string;
        }) => {
          const { senderId, senderName, receiverId, content, propertyId } = data;
          
          try {
            // Save to Database
            const MessageModel = mongoose.model("Message");
            const dbMessage = new MessageModel({
              senderId,
              receiverId,
              content,
              read: false
            });
            await dbMessage.save();

            const message: ChatMessage = {
              id: dbMessage._id.toString(),
              senderId,
              senderName,
              receiverId,
              content,
              timestamp: dbMessage.createdAt || new Date(),
              read: false,
            };

            // Create room ID (sorted to ensure consistency)
            const roomId = [senderId, receiverId].sort().join("_");

            // Store message in-memory for quick access
            if (!this.chatRooms.has(roomId)) {
              this.chatRooms.set(roomId, []);
            }
            this.chatRooms.get(roomId)!.push(message);

            // Send to receiver
            const receiver = this.activeUsers.get(receiverId);
            if (receiver) {
              this.io.to(receiver.socketId).emit("message:receive", {
                ...message,
                propertyId,
              });
            }

            // Send confirmation to sender
            socket.emit("message:sent", {
              messageId: message.id,
              status: "delivered",
            });

            console.log(`💬 Message from ${senderName} to ${receiverId} saved to DB`);
          } catch (error) {
            console.error("❌ Error saving message to DB:", error);
            socket.emit("error", { message: "Failed to save message" });
          }
        }
      );

      // Join chat room
      socket.on(
        "chat:join",
        (data: { userId: string; otherUserId: string }) => {
          const { userId, otherUserId } = data;
          const roomId = [userId, otherUserId].sort().join("_");

          socket.join(roomId);

          // Send chat history
          const messages = this.chatRooms.get(roomId) || [];
          socket.emit("chat:history", messages);

          console.log(`📍 User ${userId} joined room ${roomId}`);
        }
      );

      // Mark message as read
      socket.on(
        "message:read",
        (data: { messageId: string; roomId: string }) => {
          const { messageId, roomId } = data;
          const messages = this.chatRooms.get(roomId);

          if (messages) {
            const message = messages.find((m) => m.id === messageId);
            if (message) {
              message.read = true;
              this.io.to(roomId).emit("message:read", { messageId });
            }
          }
        }
      );

      // Typing indicator
      socket.on(
        "typing:start",
        (data: { userId: string; otherUserId: string }) => {
          const { userId, otherUserId } = data;
          const receiver = this.activeUsers.get(otherUserId);

          if (receiver) {
            this.io.to(receiver.socketId).emit("typing:indicator", {
              userId,
              isTyping: true,
            });
          }
        }
      );

      socket.on(
        "typing:stop",
        (data: { userId: string; otherUserId: string }) => {
          const { userId, otherUserId } = data;
          const receiver = this.activeUsers.get(otherUserId);

          if (receiver) {
            this.io.to(receiver.socketId).emit("typing:indicator", {
              userId,
              isTyping: false,
            });
          }
        }
      );

      // User disconnects
      socket.on("disconnect", () => {
        // Find and remove user
        let disconnectedUserId: string | null = null;
        for (const [userId, user] of Array.from(this.activeUsers.entries())) {
          if (user.socketId === socket.id) {
            disconnectedUserId = userId;
            this.activeUsers.delete(userId);
            break;
          }
        }

        if (disconnectedUserId) {
          this.io.emit("users:online", Array.from(this.activeUsers.values()));
          console.log(`❌ User disconnected: ${disconnectedUserId}`);
        }
      });

      // Error handling
      socket.on("error", (error) => {
        console.error(`❌ Socket error: ${error}`);
      });
    });
  }

  public getIO(): SocketIOServer {
    return this.io;
  }

  public getActiveUsers(): ActiveUser[] {
    return Array.from(this.activeUsers.values());
  }

  public getChatHistory(userId1: string, userId2: string): ChatMessage[] {
    const roomId = [userId1, userId2].sort().join("_");
    return this.chatRooms.get(roomId) || [];
  }
}

export default WebSocketService;
