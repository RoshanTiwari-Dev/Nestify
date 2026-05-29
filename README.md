# Nestify - PG & Hostel Finder Web Application

A modern, responsive web application built with React, TypeScript, and TailwindCSS that helps users find perfect PG accommodations and hostels based on their preferences.

## 🎯 Project Overview

Nestify is a comprehensive platform designed to centralize scattered PG information into one clean, interactive interface. It addresses the common challenges students and working professionals face when searching for accommodation.

APP Link - https://nestify-9zty.vercel.app

### Key Features

- **Property Listings**: Browse and search through hundreds of PG and hostel properties
- **Advanced Filtering**: Filter by location, price range, and property type (boys, girls, co-ed)
- **Property Details**: Comprehensive property information with amenities, landlord details, and reviews
- **User Authentication**: Secure login and signup system for both tenants and landlords
- **Booking Management**: Easy booking and cancellation of properties
- **Messaging System**: Direct communication with landlords and property owners
- **Reviews & Ratings**: Read and write authentic reviews from residents
- **Landlord Dashboard**: Property management interface for hosts to manage listings
- **User Dashboard**: Personal dashboard with booking history and preferences

## 🎨 Design System

### Warm Hospitality Design Philosophy

Nestify uses a warm, welcoming design approach that reflects the concept of "home away from home."

**Color Palette:**
- **Primary Coral**: `#ff6b6b` - Energy and approachability
- **Soft Gold**: `#ffd93d` - Premium feel
- **Sage Green**: `#6bcf7f` - Trust and growth
- **Cream Background**: `#fffbf0` - Warmth and comfort

**Typography:**
- **Display Font**: Poppins (700) - Headlines and emphasis
- **Body Font**: Nunito (400/500) - Content and descriptions

**Key Design Elements:**
- Rounded corners (16px) throughout for friendliness
- Organic, flowing layouts
- Gradient overlays for visual interest
- Smooth transitions and hover effects
- Accessible color contrasts

## 📁 Project Structure

```
nestify/
├── client/
│   ├── public/
│   │   ├── favicon.ico
│   │   └── robots.txt
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx                 # Homepage with listings
│   │   │   ├── PropertyDetail.tsx       # Property detail page
│   │   │   ├── Login.tsx                # User login
│   │   │   ├── Signup.tsx               # User registration
│   │   │   ├── Dashboard.tsx            # User dashboard
│   │   │   ├── PropertyManagement.tsx   # Landlord property management
│   │   │   ├── Bookings.tsx             # Booking management
│   │   │   ├── Messages.tsx             # Messaging interface
│   │   │   ├── Reviews.tsx              # Reviews management
│   │   │   └── NotFound.tsx             # 404 page
│   │   ├── components/
│   │   │   ├── Header.tsx               # Navigation header
│   │   │   ├── PropertyCard.tsx         # Reusable property card
│   │   │   ├── SearchBar.tsx            # Search and filter component
│   │   │   └── ErrorBoundary.tsx        # Error handling
│   │   ├── contexts/
│   │   │   ├── ThemeContext.tsx         # Theme management
│   │   │   └── AuthContext.tsx          # Authentication context
│   │   ├── lib/
│   │   │   └── propertyData.ts          # Property data service
│   │   ├── App.tsx                      # Main app component
│   │   ├── main.tsx                     # React entry point
│   │   └── index.css                    # Global styles
│   ├── index.html                       # HTML template
│   └── package.json
├── server/
│   └── index.ts                         # Express server (placeholder)
├── shared/
│   └── const.ts                         # Shared constants
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 22.13.0+
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nestify
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm check` - TypeScript type checking
- `pnpm format` - Format code with Prettier

## 📋 Core Functionality

### 1. Property Listings & Search

Users can browse properties with advanced filtering:
- **Location Search**: Real-time search by city or area
- **Price Filtering**: Low (< ₹5000), Mid (₹5000-7000), High (> ₹7000)
- **Type Filtering**: Boys, Girls, or Co-ed accommodations

### 2. Property Details

Comprehensive property information including:
- Full property description
- Amenities list (food, AC, WiFi, parking, laundry, study room, common area)
- Landlord contact information
- User reviews and ratings
- Booking interface

### 3. User Authentication

- **Login**: Email and password authentication
- **Signup**: Role-based registration (Tenant or Landlord)
- **Profile Management**: User profile and preferences

### 4. Booking System

- View available properties
- Create bookings with check-in/check-out dates
- Track booking status (confirmed, pending, cancelled)
- View booking details and landlord contact

### 5. Messaging

- Direct messaging with landlords
- Real-time conversation history
- Search conversations
- Unread message indicators

### 6. Reviews & Ratings

- Write reviews for properties
- Rate properties (1-5 stars)
- View reviews from other users
- Manage your own reviews

### 7. Landlord Features

- Add and manage properties
- Edit property details
- Delete properties
- Track bookings for each property
- Respond to tenant inquiries

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: TailwindCSS 4 with shadcn/ui components
- **Routing**: Wouter (lightweight routing)
- **State Management**: React Context API
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: shadcn/ui (Radix UI + Tailwind)

## 📱 Responsive Design

Nestify is fully responsive and works seamlessly on:
- Desktop (1920px and above)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

All components use mobile-first design approach with appropriate breakpoints.

## 🔐 Security Features

- Input validation on all forms
- Error handling and boundary components
- Secure password fields
- Protected routes (future implementation)
- CSRF protection (future implementation)

## 🎯 User Flows

### Tenant Flow

1. **Browse** → Search and filter properties
2. **View Details** → Check property information and reviews
3. **Book** → Create booking with dates
4. **Message** → Communicate with landlord
5. **Review** → Leave feedback after stay

### Landlord Flow

1. **Add Property** → Create new property listing
2. **Manage** → Edit or delete properties
3. **Respond** → Message interested tenants
4. **Track** → Monitor bookings and inquiries

## 🚀 Future Enhancements

- **Backend Integration**: Connect to Node.js/Express API
- **Database**: Implement MongoDB for persistent storage
- **Payment Processing**: Stripe integration for online payments
- **Google Maps**: Show property locations on interactive map
- **Real-time Updates**: WebSocket for live messaging
- **Admin Dashboard**: Moderation and analytics
- **Mobile App**: React Native version for iOS/Android
- **Advanced Search**: ML-based recommendations
- **Verification System**: ID verification for landlords
- **Rating System**: Algorithm-based property ranking

## 📝 Mock Data

The application currently uses mock data for demonstration. In production, this would be replaced with API calls to a backend server.

**Mock Data Includes:**
- 6 sample properties across different cities
- User authentication (any email/password works)
- Sample bookings and messages
- Review data

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👥 Team

Built with ❤️ by the Nestify team.

## 📞 Support

For support, email support@nestify.com or open an issue in the repository.

## 🙏 Acknowledgments

- React and TypeScript communities
- shadcn/ui for excellent component library
- TailwindCSS for utility-first CSS
- All contributors and users

---

**Happy Nesting! 🏠**
