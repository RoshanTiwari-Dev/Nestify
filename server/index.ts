import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { createServer } from "http";
import WebSocketService from "./services/websocket.service";

// Load environment variables
dotenv.config();

const appRoot = process.cwd();

const app: Express = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/nestify";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    // Don't exit in development, allow server to run without DB
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  });

// ============================================
// MongoDB Schemas and Models
// ============================================

// User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ["tenant", "landlord"], required: true },
    phone: { type: String },
    avatar: { type: String },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Property Schema
const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    city: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["boys", "girls", "co-ed"], required: true },
    description: { type: String },
    amenities: [String],
    images: [String],
    rooms: { type: Number },
    bathrooms: { type: Number },
    parking: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
    studyRoom: { type: Boolean, default: false },
    commonArea: { type: Boolean, default: false },
    food: { type: Boolean, default: false },
    ac: { type: Boolean, default: false },
    wifi: { type: Boolean, default: true },
    landlordId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    nearCollege: {
      name: String,
      distance: String,
    },
    nearMetro: {
      name: String,
      distance: String,
    },
    coordinates: {
      latitude: Number,
      longitude: Number,
    },
  },
  { timestamps: true }
);

// Booking Schema
const bookingSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    guestCount: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  },
  { timestamps: true }
);

// Message Schema
const messageSchema = new mongoose.Schema(
  {
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
  },
  { timestamps: true }
);

// Create Models
const User = mongoose.model("User", userSchema);
const Property = mongoose.model("Property", propertySchema);
const Booking = mongoose.model("Booking", bookingSchema);
const Message = mongoose.model("Message", messageSchema);
const Review = mongoose.model("Review", reviewSchema);

// ============================================
// Authentication Routes
// ============================================

// Helper function to generate a simple JWT token
function generateToken(userId: string): string {
  // Simple token generation (In production, use a proper JWT library)
  const payload = {
    userId,
    iat: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

// Registration endpoint
app.post("/api/users/register", async (req: Request, res: Response) => {
  try {
    const { email, password, name, role, phone } = req.body;

    // Validation
    if (!email || !password || !name || !role) {
      return res.status(400).json({ 
        message: "Missing required fields: email, password, name, role" 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create new user (Note: In production, hash the password)
    const user = new User({
      email,
      password, // TODO: Hash password before saving
      name,
      role,
      phone: phone || "",
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Registration failed",
      error: error.message || "Unknown error"
    });
  }
});

// Login endpoint
app.post("/api/users/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // TODO: Verify password hash
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate token
    const token = generateToken(user._id.toString());

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ 
      message: "Login failed",
      error: error.message || "Unknown error"
    });
  }
});

// Get current user endpoint
app.get("/api/users/me", async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Decode token (simple base64 decoding for demo)
    const payload = JSON.parse(Buffer.from(token, "base64").toString());
    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      verified: user.verified,
    });
  } catch (error: any) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// ============================================
// Property Routes
// ============================================

app.get("/api/properties", async (req: Request, res: Response) => {
  try {
    const { city, type, minPrice, maxPrice, sort } = req.query;

    let query: any = {};
    if (city) query.city = city;
    if (type) query.type = type;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "price-low") sortOption = { price: 1 };
    if (sort === "price-high") sortOption = { price: -1 };
    if (sort === "rating") sortOption = { rating: -1 };

    const properties = await Property.find(query).sort(sortOption).limit(50);
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties", details: error });
  }
});

app.get("/api/properties/:id", async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id).populate("landlordId");
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch property", details: error });
  }
});

app.post("/api/properties", async (req: Request, res: Response) => {
  try {
    const { name, location, city, price, type, landlordId, ...rest } = req.body;

    if (!landlordId) {
      return res.status(400).json({ error: "landlordId is required" });
    }

    const property = new Property({
      name,
      location,
      city,
      price,
      type,
      landlordId,
      ...rest,
    });

    await property.save();
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ error: "Failed to create property", details: error });
  }
});

app.delete("/api/properties/:id", async (req: Request, res: Response) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ error: "Property not found" });
    }
    res.json({ message: "Property deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete property", details: error });
  }
});

app.get("/api/properties/landlord/:landlordId", async (req: Request, res: Response) => {
  try {
    const properties = await Property.find({ landlordId: req.params.landlordId });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch landlord properties", details: error });
  }
});

// ============================================
// Booking Routes
// ============================================

app.post("/api/bookings", async (req: Request, res: Response) => {
  try {
    const { propertyId, tenantId, checkInDate, checkOutDate, guestCount, totalPrice } = req.body;

    const booking = new Booking({
      propertyId,
      tenantId,
      checkInDate,
      checkOutDate,
      guestCount,
      totalPrice,
    });

    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: "Failed to create booking", details: error });
  }
});

app.get("/api/bookings/:userId", async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ tenantId: req.params.userId }).populate("propertyId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings", details: error });
  }
});

// ============================================
// Message Routes
// ============================================

app.post("/api/messages", async (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, content } = req.body;

    const message = new Message({
      senderId,
      receiverId,
      content,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message", details: error });
  }
});

app.get("/api/messages/:userId", async (req: Request, res: Response) => {
  try {
    const messages = await Message.find({
      $or: [{ senderId: req.params.userId }, { receiverId: req.params.userId }],
    }).populate("senderId receiverId");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages", details: error });
  }
});

// ============================================
// Review Routes
// ============================================

app.post("/api/reviews", async (req: Request, res: Response) => {
  try {
    const { propertyId, userId, rating, comment } = req.body;

    const review = new Review({
      propertyId,
      userId,
      rating,
      comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to create review", details: error });
  }
});

app.get("/api/reviews/:propertyId", async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find({ propertyId: req.params.propertyId }).populate("userId");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews", details: error });
  }
});

// ============================================
// Health Check
// ============================================

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Nestify API is running" });
});

// ============================================
// Static Files
// ============================================

app.use(express.static(path.join(appRoot, "dist/public")));

// SPA Routing Fix: Serve index.html for all non-API routes
app.get("*", (req: Request, res: Response) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(appRoot, "dist/public/index.html"));
  }
});

// ============================================
// Server Start with WebSocket Support
// ============================================

const httpServer = createServer(app);
const wsService = new WebSocketService(httpServer);

// Make WebSocket service available globally
app.locals.wsService = wsService;

// Example API endpoint to get active users
app.get("/api/users/active", (req: Request, res: Response) => {
  const activeUsers = wsService.getActiveUsers();
  res.json(activeUsers);
});

// Example API endpoint to get chat history
app.get("/api/messages/history/:userId1/:userId2", (req: Request, res: Response) => {
  const { userId1, userId2 } = req.params;
  const history = wsService.getChatHistory(userId1, userId2);
  res.json(history);
});

httpServer.listen(PORT, () => {
  console.log(`🚀 Nestify Server with WebSocket running on http://localhost:${PORT}`);
  console.log(`📦 MongoDB URI: ${MONGODB_URI}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;
