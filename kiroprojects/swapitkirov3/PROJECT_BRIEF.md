# SwapIt - Sustainable Barter Marketplace

## 🎯 Project Overview

**SwapIt** is a modern, community-driven barter marketplace that enables users to exchange items sustainably through two primary mechanisms:
- **Swap It**: Traditional item-for-item exchanges between users
- **Drop It**: Free item donations to the community

The platform promotes circular economy principles, reduces waste, and builds stronger communities through local item sharing.

## 🏗️ Architecture & Tech Stack

### Web Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Maps**: Leaflet (OpenStreetMap integration)
- **State Management**: React hooks and context

### Mobile App (Expo SDK 54)
- **Framework**: Expo React Native with SDK 54
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (Tailwind for React Native)
- **Icons**: Expo Vector Icons + Lucide React Native
- **Maps**: React Native Maps with Google Maps/Apple Maps
- **State Management**: Zustand + React Query

### Shared Architecture
- **Component Library**: Shared UI components between web and mobile
- **API Layer**: Unified API client for both platforms
- **Type Definitions**: Shared TypeScript interfaces
- **Utilities**: Common helper functions and constants

### Design System
- **Primary Color**: #119C21 (SwapIt Green)
- **Typography**: DM Sans font family (web) / System fonts (mobile)
- **Components**: Cross-platform responsive, accessible UI components
- **Theme**: Light/Dark mode support across platforms

## ✅ Completed Features

### 🏠 Core Pages
- **Landing Page** (`/`) - Hero, How It Works, Featured Items, Why Choose SwapIt
- **Browse Page** (`/browse`) - Item discovery with advanced filtering system
- **Item Details** (`/item/[id]`) - Detailed item view with location map and save functionality
- **Profile Page** (`/profile`) - User profile management with edit functionality
- **Requests Page** (`/requests`) - Swap request management with tabs (Received, Sent, Dropzone)
- **Notifications** (`/notifications`) - Notification center
- **Chat Page** (`/chat`) - Messaging interface
- **User Profile** (`/user/[id]`) - Public user profiles with report/block functionality
- **About Page** (`/about`) - Company information
- **Contact Page** (`/contact`) - Contact form
- **Terms & Conditions** (`/terms`) - Legal terms and conditions
- **Privacy Policy** (`/privacy`) - Privacy policy and data protection information

### 🔐 Authentication System
- **Login Modal** - User authentication
- **Sign Up Modal** - New user registration
- **Onboarding Modal** - First-time user experience
- **Auth Hooks** - Centralized authentication state management

### 📱 Core Functionality
- **Item Management**
  - Add Item Modal with category selection
  - Edit Item Modal for item owners
  - Item Added Success Modal
  - Support for both "Swap" and "Drop it" (free) items
  - Image upload and item details
  - Location-based item discovery
  - Save/Favorite items functionality
  - Boost Item Modal for promoting listings

- **Swap System**
  - Swap Request Modal for initiating exchanges
  - Swap Request Success Modal
  - Request management (Received, Sent, Dropzone tabs)
  - Different UI for sent vs received requests
  - Support for claim requests (free items)
  - Post-swap review system

- **User Management**
  - Edit Profile Modal with full profile customization
  - User safety features (Report/Block users)
  - Review and rating system for completed swaps

- **Advanced Filtering**
  - Comprehensive filter system with modal-based interface
  - Category filter (multi-select with checkboxes)
  - Condition filter (Like New, Good, Fair, Poor)
  - Distance filter (range slider 1-100km with quick select)
  - Sorting options (Newest, Oldest, Distance, Alphabetical)
  - Item type filter (All, Free Only, Swap Only)
  - Filter state persistence with localStorage

- **Communication**
  - Notifications Panel with smart navigation
  - Different notification types (swap_request, claim_request, message, system)
  - Real-time notification indicators

### 🎨 UI Components
- **Navigation**: Responsive navbar with theme switcher
- **Cards**: Item cards, swap request cards, sent request cards
- **Modals**: Comprehensive modal system with proper z-index management
  - Edit Profile Modal
  - Edit Item Modal
  - Review Modal (post-swap rating system)
  - Report User Modal (safety features)
  - Filter Modal (unified filtering interface)
- **Forms**: Location picker, category dropdowns, advanced filter controls
- **Maps**: OpenStreetMap integration with markers
- **Buttons**: Consistent button system with variants
- **Notifications**: Panel and full-page notification views
- **Filters**: Advanced filter chips with modal-based selection
- **Interactive Elements**: Save/favorite buttons, rating stars, range sliders

### 🌍 Location Features
- **OpenStreetMap Integration**: Interactive maps with custom markers
- **Location Picker**: Address selection and geolocation
- **Distance Calculation**: "X km away" indicators
- **User Location**: Current location detection

### 📱 Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Mobile gesture support
- **Progressive Enhancement**: Works without JavaScript
- **Consistent Theming**: Light/Dark mode support with CSS variables
- **Accessibility**: WCAG compliant components with proper ARIA labels
- **Cross-Platform Consistency**: Shared design system between web and mobile

### 🆕 Recently Completed Features (Latest Updates)

#### **Legal & Compliance Pages**
- **Terms & Conditions Page** - Comprehensive legal terms covering user responsibilities, prohibited items, safety guidelines, and liability limitations
- **Privacy Policy Page** - Detailed privacy policy covering data collection, usage, sharing, user rights, and GDPR compliance
- Both pages feature consistent navigation, responsive design, and proper typography hierarchy

#### **Enhanced User Profile Management**
- **Edit Profile Modal** - Complete profile editing functionality with:
  - Full name editing (with automatic initials update)
  - Bio editing with character limits
  - Location editing with GPS icon
  - Email field (read-only for security)
  - Real-time profile updates

#### **Advanced Item Management**
- **Edit Item Modal** - Item owners can modify their listings:
  - Title, description, condition, and category editing
  - Location updates with map integration
  - Free item toggle functionality
  - Image preview with upload capability
  - Form validation and error handling

- **Save/Favorite Items** - Users can bookmark items:
  - Heart icon on item details page
  - Toggle save/unsave functionality
  - Visual feedback with filled/outline states
  - Integration with profile "Saved Items" section

#### **User Safety & Community Features**
- **Report User System** - Comprehensive reporting functionality:
  - Multiple report categories (Inappropriate behavior, Fraud, Spam, Harassment, Other)
  - Optional detailed description field
  - Block user option within report flow
  - User-friendly modal interface

- **Block User Functionality** - Direct blocking capability:
  - Accessible from user profile dropdown menu
  - Immediate effect on user visibility
  - Separate from reporting system

- **Review & Rating System** - Post-swap feedback mechanism:
  - 5-star rating system with hover effects
  - Optional text reviews (500 character limit)
  - User profile integration
  - Swap completion tracking

#### **Advanced Browse & Filter System**
- **Unified Filter Modal System** - Consistent filtering experience:
  - **Category Filter**: Multi-select with checkboxes, "All Categories" option with indeterminate state
  - **Condition Filter**: Single-select radio buttons (All, Like New, Good, Fair, Poor)
  - **Distance Filter**: Range slider (1-100km) with quick select buttons (5, 10, 25, 50km)
  - **Sorting Filter**: Multiple options (Newest, Oldest, Distance, Alphabetical)
  - **Item Type Filter**: All Items, Free Only, Swap Only

- **Enhanced Filter Experience**:
  - Visual feedback with green styling for active filters
  - Filter state persistence with localStorage
  - Dynamic filter labels showing current selections
  - Clear all functionality
  - Consistent modal design across all filter types

#### **Item Owner Controls**
- **Owner-Specific Actions** on item details:
  - Edit Item button and modal
  - Boost Item functionality
  - Owner menu with dropdown actions
  - Hide save button for own items

#### **Technical Improvements**
- **CSS Variables System** - Comprehensive theming with CSS custom properties
- **Error Handling** - Robust error boundaries and validation
- **State Management** - Improved state persistence and synchronization
- **Performance Optimization** - Efficient re-renders and memory management
- **Type Safety** - Enhanced TypeScript interfaces and type checking

## 📱 Mobile App Development Plan (Expo SDK 54)

### 🎯 Mobile App Architecture

**Project Structure**:
```
swapit-mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation
│   ├── auth/              # Authentication screens
│   ├── item/              # Item-related screens
│   └── _layout.tsx        # Root layout
├── components/
│   ├── shared/            # Cross-platform components
│   ├── mobile/            # Mobile-specific components
│   └── ui/                # UI component library
├── hooks/                 # Custom React hooks
├── services/              # API and external services
├── stores/                # State management (Zustand)
├── utils/                 # Utility functions
└── constants/             # App constants
```

### 🔧 Expo SDK 54 Features Integration

**Core Expo Modules**:
- `expo-router` - File-based navigation
- `expo-camera` - Photo capture for item listings
- `expo-image-picker` - Gallery image selection
- `expo-location` - GPS and location services
- `expo-notifications` - Push notifications
- `expo-secure-store` - Secure token storage
- `expo-sharing` - Native sharing functionality
- `expo-haptics` - Tactile feedback
- `expo-local-authentication` - Biometric auth

**Third-Party Libraries**:
- `react-native-maps` - Native map integration
- `react-native-reanimated` - Smooth animations
- `react-native-gesture-handler` - Touch gestures
- `nativewind` - Tailwind CSS for React Native
- `zustand` - Lightweight state management
- `react-query` - Server state management

### 📱 Mobile-Specific Features

**Enhanced User Experience**:
- Native navigation with smooth transitions
- Pull-to-refresh on item lists
- Swipe gestures for item actions
- Haptic feedback for interactions
- Native share sheet integration
- Biometric login (Face ID/Touch ID)

**Camera & Media**:
- In-app camera for item photos
- Multiple photo selection
- Image cropping and editing
- Photo compression and optimization
- Gallery integration

**Location Services**:
- Real-time location tracking
- Background location updates
- Geofencing for nearby items
- Turn-by-turn directions to meetup points

**Push Notifications**:
- New swap requests
- Message notifications
- Item status updates
- Nearby item alerts
- Promotional notifications

### 🔄 Cross-Platform Component Strategy

**Shared Components** (70% code reuse):
```typescript
// Shared component structure
components/
├── shared/
│   ├── Button/
│   │   ├── Button.tsx          # Shared logic
│   │   ├── Button.web.tsx      # Web-specific styling
│   │   └── Button.native.tsx   # Mobile-specific styling
│   ├── ItemCard/
│   ├── Modal/
│   └── Form/
```

**Platform-Specific Adaptations**:
- Navigation patterns (web vs mobile)
- Input methods (mouse/keyboard vs touch)
- Layout constraints (viewport vs screen)
- Performance optimizations

## 🚧 Pending Implementation

### 🔧 Backend & Database (Supabase)
**Priority: HIGH**
- [ ] **Database Schema Design**
  - Users table (profiles, authentication)
  - Items table (listings, categories, location data)
  - Swap_requests table (request management)
  - Messages table (chat functionality)
  - Notifications table (notification system)
  - Categories table (item categorization)

- [ ] **Authentication Integration**
  - Supabase Auth integration
  - Social login providers (Google, Facebook)
  - Email verification
  - Password reset functionality

- [ ] **Real-time Features**
  - Real-time chat using Supabase Realtime
  - Live notification updates
  - Real-time request status updates

- [ ] **File Storage**
  - Image upload to Supabase Storage
  - Image optimization and resizing
  - CDN integration for fast image delivery

### 💳 Payment Integration (Payrexx)
**Priority: MEDIUM**
- [ ] **Boost Item Payments**
  - Payrexx payment gateway integration
  - Boost pricing tiers
  - Payment success/failure handling
  - Transaction history

- [ ] **Premium Features** (Future)
  - Premium user subscriptions
  - Enhanced listing features
  - Priority support

### 🌐 Internationalization (i18n)
**Priority: MEDIUM**
- [ ] **Multi-language Support**
  - English (default) ✅
  - German (Deutsch)
  - Italian (Italiano)
  - French (Français)

- [ ] **Implementation Tasks**
  - Next.js i18n configuration
  - Translation key extraction
  - Language switcher component
  - RTL support consideration
  - Date/time localization
  - Currency localization

### 🔍 Search & Discovery
**Priority: MEDIUM**
- [x] **Advanced Search**
  - Category filtering ✅
  - Condition filtering ✅
  - Distance-based filtering ✅
  - Item type filtering (Free/Swap) ✅
  - Sorting options ✅
  - [ ] Full-text search implementation
  - [ ] Price range filtering (for future paid features)

- [ ] **Recommendation Engine**
  - User preference learning
  - Similar item suggestions
  - Location-based recommendations

### 📊 Analytics & Monitoring
**Priority: LOW**
- [ ] **User Analytics**
  - User behavior tracking
  - Conversion metrics
  - Popular items/categories

- [ ] **Performance Monitoring**
  - Error tracking (Sentry)
  - Performance metrics
  - User experience monitoring

### 🔒 Security & Compliance
**Priority: HIGH**
- [x] **Data Protection**
  - GDPR compliance ✅
  - Privacy policy implementation ✅
  - Terms and conditions implementation ✅
  - [ ] Cookie consent management (web) / App privacy (mobile)
  - [ ] Data encryption (at rest and in transit)
  - [ ] Secure token storage (Expo SecureStore)

- [x] **Content Moderation**
  - User reporting system ✅
  - User blocking functionality ✅
  - [ ] Inappropriate content detection
  - [ ] Admin moderation tools
  - [ ] Image content filtering

- [ ] **Mobile Security**
  - Certificate pinning
  - Root/jailbreak detection
  - Biometric authentication
  - Secure API communication

### 📱 Mobile App (Expo SDK 54)
**Priority: HIGH**
- [ ] **Expo React Native App**
  - iOS and Android applications using Expo SDK 54
  - Shared component library with web version
  - Native navigation with Expo Router
  - Cross-platform UI consistency

- [ ] **Mobile-Specific Features**
  - Push notifications (Expo Notifications)
  - Camera integration for item photos (Expo Camera)
  - Image picker and cropping (Expo ImagePicker)
  - Location services (Expo Location)
  - Offline functionality with local storage
  - Biometric authentication (Expo LocalAuthentication)

- [ ] **Native Integrations**
  - Deep linking for item sharing
  - Share functionality (Expo Sharing)
  - Haptic feedback (Expo Haptics)
  - Device contacts integration
  - Calendar integration for meetups

- [ ] **Performance Optimizations**
  - Image caching and optimization
  - Lazy loading for item lists
  - Background sync for messages
  - Efficient map rendering

## 🎯 Development Roadmap

### Phase 1: Backend Foundation (4-6 weeks)
1. **Supabase Setup & Configuration**
2. **Database Schema Implementation**
3. **Authentication Integration**
4. **Basic CRUD Operations**

### Phase 2: Core Features (6-8 weeks)
1. **Real-time Chat Implementation**
2. **Notification System**
3. **Image Upload & Management**
4. **Search & Filtering**

### Phase 3: Mobile App Development (8-10 weeks)
1. **Expo SDK 54 Setup & Configuration**
   - Project initialization with Expo CLI
   - Development environment setup
   - Build configuration for iOS/Android

2. **Cross-Platform Component Library**
   - Migrate web components to shared library
   - Implement platform-specific adaptations
   - Create mobile-optimized UI components

3. **Native Feature Integration**
   - Camera and image picker implementation
   - Location services and maps
   - Push notifications setup
   - Biometric authentication

4. **Mobile-Specific Features**
   - Native navigation with Expo Router
   - Offline functionality
   - Background sync
   - Deep linking

5. **Testing & Optimization**
   - Cross-platform testing
   - Performance optimization
   - App store preparation

### Phase 4: Payments & Localization (4-6 weeks)
1. **Payrexx Integration** (Web + Mobile)
2. **Multi-language Support** (4 languages)
3. **Advanced Search Features**
4. **Cross-platform payment flows**

### Phase 5: Enhancement & Deployment (4-6 weeks)
1. **Performance Optimization**
2. **Security Hardening**
3. **Analytics Implementation**
4. **App Store Deployment** (iOS App Store + Google Play Store)
5. **Web Production Deployment**

## 🛠️ Technical Debt & Improvements

### Code Quality
- [ ] **Testing Implementation**
  - Unit tests (Jest)
  - Integration tests
  - E2E tests (Playwright)

- [ ] **Code Organization**
  - API layer abstraction
  - Custom hooks for data fetching
  - Error boundary implementation

### Performance
- [ ] **Optimization**
  - Image optimization
  - Code splitting
  - Bundle size optimization
  - SEO improvements

### Accessibility
- [ ] **A11y Compliance**
  - WCAG 2.1 AA compliance
  - Screen reader support
  - Keyboard navigation
  - Color contrast improvements

## 📈 Success Metrics

### User Engagement
- Monthly Active Users (MAU) - Web + Mobile
- Items listed per user
- Successful swap completion rate
- User retention rate (1-day, 7-day, 30-day)
- Cross-platform usage patterns
- Item save/favorite rates
- Filter usage and preferences
- Review completion rates
- Profile edit frequency

### Platform Health
- Average time to complete swap
- User satisfaction scores (via review system)
- Platform safety metrics (report/block usage)
- Community growth rate
- Geographic expansion metrics
- Content moderation effectiveness
- User trust and safety ratings

### Mobile-Specific Metrics
- App store ratings and reviews
- Download and install rates
- Push notification engagement
- Camera usage for item photos
- Location-based feature adoption
- Offline usage patterns

### Technical Performance
- App crash rates (mobile)
- Page load times (web)
- API response times
- Image upload success rates
- Real-time message delivery rates

## 🎨 Design Assets

The application follows a comprehensive design system based on Figma designs with:
- Consistent color palette
- Typography hierarchy
- Component library
- Responsive breakpoints
- Accessibility guidelines

## 🚀 Deployment Strategy

### Web Application
- **Development**: Local development with Next.js dev server
- **Build**: Next.js static generation and SSR
- **Hosting**: Vercel deployment
- **CDN**: Image and asset delivery

### Mobile Application (Expo SDK 54)
- **Development**: Expo CLI with local development server
- **Build Service**: Expo Application Services (EAS Build)
- **Distribution**: 
  - iOS: Apple App Store
  - Android: Google Play Store
  - Internal: Expo Go for testing

### Production Requirements
- **Web Frontend**: Vercel or similar JAMstack hosting
- **Mobile Apps**: 
  - EAS Build for production builds
  - EAS Submit for app store submissions
  - EAS Update for over-the-air updates
- **Backend**: Supabase cloud hosting
- **CDN**: Image and asset delivery
- **Monitoring**: 
  - Web: Vercel Analytics + Sentry
  - Mobile: Expo Analytics + Crashlytics
  - Backend: Supabase monitoring

### App Store Requirements
- **iOS App Store**:
  - Apple Developer Account ($99/year)
  - App Store Review Guidelines compliance
  - Privacy policy and terms of service
  - App Store Connect configuration

- **Google Play Store**:
  - Google Play Developer Account ($25 one-time)
  - Play Console setup
  - Content rating and privacy policy
  - Release management

---

**SwapIt** represents a modern approach to sustainable commerce, combining cutting-edge web technologies with community-driven values to create a platform that benefits both users and the environment.