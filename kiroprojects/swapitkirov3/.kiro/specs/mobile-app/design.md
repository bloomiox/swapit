# Mobile App Design Document

## Overview

The SwapIt mobile application will be built using Expo SDK 54 with React Native, providing a native mobile experience that shares the same Supabase backend as the web application. The app will implement a mobile-first design approach with native navigation patterns, optimized touch interactions, and platform-specific features like camera integration, push notifications, and location services.

The mobile app will maintain design consistency with the web platform while adapting to mobile interaction patterns and screen constraints. All UI components will be implemented based on provided Figma designs using the Figma MCP integration for accurate design specifications.

## Architecture

### Technology Stack

**Core Framework:**
- Expo SDK 54 with React Native
- TypeScript for type safety
- Expo Router for file-based navigation
- NativeWind for Tailwind CSS styling

**State Management:**
- Zustand for lightweight client state
- React Query (TanStack Query) for server state management
- React Context for authentication and theme state

**Backend Integration:**
- Supabase client for database operations
- Supabase Auth for authentication
- Supabase Realtime for live updates
- Supabase Storage for file uploads

**Native Features:**
- Expo Camera for photo capture
- Expo ImagePicker for gallery selection
- Expo Location for GPS services
- Expo Notifications for push notifications
- Expo SecureStore for secure token storage
- Expo Haptics for tactile feedback

**UI and Styling:**
- NativeWind for consistent styling with web
- React Native Reanimated for smooth animations
- React Native Gesture Handler for touch interactions
- React Native Maps for native map integration

### Project Structure

```
swapit-mobile/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── discover.tsx          # Discover/Browse screen
│   │   ├── requests.tsx          # Swap requests screen
│   │   ├── chat.tsx              # Chat conversations
│   │   └── profile.tsx           # User profile
│   ├── (auth)/                   # Authentication flow
│   │   ├── login.tsx             # Login screen
│   │   ├── signup.tsx            # Sign up screen
│   │   └── onboarding.tsx        # Onboarding flow
│   ├── item/                     # Item-related screens
│   │   ├── [id].tsx              # Item details
│   │   └── add.tsx               # Add item screen
│   ├── chat/                     # Chat screens
│   │   └── [id].tsx              # Chat conversation
│   ├── user/                     # User screens
│   │   └── [id].tsx              # User profile view
│   ├── notifications.tsx         # Notifications screen
│   ├── splash.tsx                # Splash screen
│   └── _layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── shared/                   # Cross-platform components
│   ├── mobile/                   # Mobile-specific components
│   ├── ui/                       # UI component library
│   └── forms/                    # Form components
├── hooks/                        # Custom React hooks
├── services/                     # API and external services
├── stores/                       # Zustand stores
├── utils/                        # Utility functions
├── constants/                    # App constants
└── types/                        # TypeScript type definitions
```

### Navigation Architecture

**Tab Navigation (Bottom Tabs):**
- Discover: Item browsing and search
- Requests: Swap request management
- Add Item: Quick access to item creation
- Chat: Message conversations
- Profile: User profile and settings

**Stack Navigation:**
- Authentication flow (Login → Sign Up → Onboarding)
- Item details and related screens
- Chat conversation screens
- User profile views
- Settings and preferences

**Modal Navigation:**
- Add item flow
- Filter and search modals
- Image gallery and camera
- Confirmation dialogs

## Components and Interfaces

### Shared Component Library

**Cross-Platform Components:**
Components will be structured to share logic while allowing platform-specific styling:

```typescript
// Component structure example
components/
├── shared/
│   ├── Button/
│   │   ├── Button.tsx          # Shared logic and props
│   │   ├── Button.web.tsx      # Web-specific implementation
│   │   └── Button.native.tsx   # Mobile-specific implementation
│   ├── ItemCard/
│   │   ├── ItemCard.tsx
│   │   ├── ItemCard.web.tsx
│   │   └── ItemCard.native.tsx
│   └── Modal/
│       ├── Modal.tsx
│       ├── Modal.web.tsx
│       └── Modal.native.tsx
```

**Mobile-Specific Components:**

1. **Native Navigation Components:**
   - TabBar: Custom bottom tab navigation
   - Header: Native header with platform-specific styling
   - BackButton: Platform-appropriate back navigation

2. **Touch Interaction Components:**
   - SwipeableCard: Swipeable item cards with actions
   - PullToRefresh: Native pull-to-refresh implementation
   - TouchableCard: Optimized touch feedback for cards

3. **Camera and Media Components:**
   - CameraView: Native camera interface
   - ImagePicker: Gallery and camera selection
   - ImageCropper: Basic image editing tools
   - MediaUploader: Optimized image upload with progress

4. **Location Components:**
   - MapView: Native map integration
   - LocationPicker: GPS-enabled location selection
   - NearbyItems: Location-based item discovery

### Screen Components

**Authentication Screens:**

1. **Splash Screen:**
   - SwapIt branding and logo
   - Loading animation
   - App initialization

2. **Login Screen:**
   - Email/password form
   - Social authentication buttons
   - Biometric login option
   - "Forgot password" link

3. **Sign Up Screen:**
   - Registration form
   - Terms acceptance
   - Social sign-up options
   - Email verification flow

4. **Onboarding Screen:**
   - Multi-step guided tour
   - Profile setup
   - Interest selection
   - Location permissions

**Main Application Screens:**

1. **Discover Screen:**
   - Personalized item recommendations
   - Search and filter functionality
   - Category browsing
   - Map view toggle
   - Infinite scroll with pull-to-refresh

2. **Requests Screen:**
   - Tabbed interface (Received, Sent, Dropzone)
   - Swipeable request cards
   - Quick action buttons
   - Status indicators

3. **Add Item Screen:**
   - Camera integration
   - Multi-image selection
   - Form with native inputs
   - Location picker
   - Category selection

4. **Chat Screen:**
   - Conversation list
   - Real-time messaging
   - Typing indicators
   - Message status indicators

5. **Profile Screen:**
   - User information display
   - Settings access
   - Item management
   - Statistics and ratings

### Form Components

**Native Form Elements:**
- TextInput: Platform-optimized text inputs
- Picker: Native picker components
- Switch: Platform-appropriate toggles
- Slider: Native range sliders
- DatePicker: Platform date/time selection

**Validation and Feedback:**
- Real-time form validation
- Error message display
- Success feedback
- Loading states

## Data Models

### Shared Data Models

The mobile app will use the same TypeScript interfaces as the web application to ensure data consistency:

```typescript
// Shared interfaces from web app
interface User {
  id: string
  email: string
  full_name: string | null
  bio: string | null
  avatar_url: string | null
  location_name: string | null
  location_coordinates: any | null
  phone: string | null
  is_verified: boolean
  is_active: boolean
  rating_average: number
  rating_count: number
  successful_swaps: number
  created_at: string
  updated_at: string
}

interface Item {
  id: string
  user_id: string
  category_id: string | null
  title: string
  description: string
  condition: 'like_new' | 'good' | 'fair' | 'poor'
  is_free: boolean
  images: string[] | null
  location_name: string | null
  location_coordinates: any | null
  is_available: boolean
  is_boosted: boolean
  boost_expires_at: string | null
  view_count: number
  save_count: number
  created_at: string
  updated_at: string
  // Joined data
  category?: Category
  user?: User
}

interface SwapRequest {
  id: string
  requester_id: string
  owner_id: string
  requested_item_id: string
  offered_item_id: string | null
  message: string | null
  status: 'pending' | 'accepted' | 'declined' | 'cancelled' | 'completed'
  is_claim_request: boolean
  meetup_location: string | null
  meetup_coordinates: any | null
  meetup_time: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
}
```

### Mobile-Specific Data Models

**Local Storage Models:**
```typescript
interface CachedItem extends Item {
  cached_at: string
  is_offline_available: boolean
}

interface QueuedAction {
  id: string
  type: 'create_item' | 'send_message' | 'swap_request'
  data: any
  created_at: string
  retry_count: number
}

interface AppSettings {
  notifications_enabled: boolean
  location_enabled: boolean
  biometric_enabled: boolean
  theme: 'light' | 'dark' | 'system'
  language: string
}
```

**Navigation State:**
```typescript
interface NavigationState {
  current_tab: string
  previous_screen: string
  deep_link_data?: any
}
```

## Error Handling

### Error Boundaries

**Global Error Boundary:**
- Catches unhandled JavaScript errors
- Provides fallback UI
- Logs errors for debugging
- Offers app restart option

**Screen-Level Error Boundaries:**
- Isolates errors to specific screens
- Provides contextual error messages
- Allows partial app functionality

### Network Error Handling

**Connection States:**
- Online: Full functionality
- Offline: Cached content and queued actions
- Poor connection: Optimized requests and timeouts

**Error Recovery:**
- Automatic retry with exponential backoff
- Manual retry options
- Graceful degradation
- User-friendly error messages

### Validation Errors

**Form Validation:**
- Real-time field validation
- Clear error messaging
- Accessibility-compliant error states
- Prevention of invalid submissions

**API Validation:**
- Server-side error handling
- Conflict resolution
- Data consistency checks

## Testing Strategy

### Unit Testing

**Component Testing:**
- Jest and React Native Testing Library
- Component behavior testing
- Props and state validation
- Accessibility testing

**Hook Testing:**
- Custom hook functionality
- State management testing
- Side effect validation

**Utility Testing:**
- Pure function testing
- Data transformation validation
- Error handling verification

### Integration Testing

**API Integration:**
- Supabase client testing
- Authentication flow testing
- Real-time subscription testing
- File upload testing

**Navigation Testing:**
- Screen navigation flows
- Deep link handling
- Tab navigation behavior
- Modal presentation

### End-to-End Testing

**User Flow Testing:**
- Complete user journeys
- Cross-screen interactions
- Authentication flows
- Critical business processes

**Device Testing:**
- iOS and Android compatibility
- Different screen sizes
- Performance on various devices
- Platform-specific features

### Performance Testing

**Metrics Monitoring:**
- App startup time
- Screen transition performance
- Memory usage optimization
- Battery consumption

**Load Testing:**
- Large dataset handling
- Image loading performance
- Real-time message handling
- Offline sync performance

## Platform-Specific Considerations

### iOS Specific Features

**Design Guidelines:**
- iOS Human Interface Guidelines compliance
- Native iOS navigation patterns
- iOS-specific animations and transitions
- Safe area handling

**Platform Features:**
- Face ID / Touch ID integration
- iOS share sheet integration
- Background app refresh
- iOS notification styles

### Android Specific Features

**Design Guidelines:**
- Material Design principles
- Android navigation patterns
- Android-specific animations
- Status bar and navigation bar handling

**Platform Features:**
- Fingerprint authentication
- Android share intents
- Background processing
- Android notification channels

### Cross-Platform Optimization

**Shared Business Logic:**
- Platform-agnostic data layer
- Shared validation logic
- Common utility functions
- Unified error handling

**Platform Adaptations:**
- Native UI components
- Platform-specific styling
- Different interaction patterns
- Optimized performance per platform

## Security Considerations

### Data Protection

**Secure Storage:**
- Expo SecureStore for sensitive data
- Token encryption and rotation
- Biometric authentication
- Secure communication protocols

**Privacy Protection:**
- Location data encryption
- Image metadata removal
- User consent management
- Data minimization practices

### Authentication Security

**Token Management:**
- Secure token storage
- Automatic token refresh
- Session timeout handling
- Multi-factor authentication support

**Biometric Security:**
- Face ID / Touch ID integration
- Fallback authentication methods
- Security level validation
- User preference management

### Network Security

**API Security:**
- Certificate pinning
- Request/response encryption
- API key protection
- Rate limiting compliance

**Data Transmission:**
- HTTPS enforcement
- Request signing
- Payload encryption
- Man-in-the-middle protection

## Performance Optimization

### App Performance

**Startup Optimization:**
- Lazy loading of non-critical components
- Optimized bundle splitting
- Efficient initialization sequence
- Splash screen optimization

**Runtime Performance:**
- Memory management
- Efficient re-renders
- Image optimization and caching
- Background task optimization

### Network Performance

**Data Optimization:**
- Request batching
- Response caching
- Image compression
- Offline-first architecture

**Real-time Performance:**
- Efficient WebSocket usage
- Selective data synchronization
- Optimized subscription management
- Connection pooling

### UI Performance

**Smooth Animations:**
- Native driver usage
- 60fps target maintenance
- Gesture responsiveness
- Transition optimization

**List Performance:**
- Virtualized lists for large datasets
- Efficient item rendering
- Smooth scrolling
- Memory-efficient pagination

## Accessibility

### Screen Reader Support

**VoiceOver/TalkBack:**
- Proper accessibility labels
- Semantic markup
- Navigation order
- Content descriptions

**Voice Control:**
- Voice command support
- Accessible action names
- Clear interaction patterns

### Visual Accessibility

**Color and Contrast:**
- High contrast mode support
- Color-blind friendly design
- Sufficient color contrast ratios
- Alternative visual indicators

**Text and Typography:**
- Dynamic type support
- Scalable font sizes
- Readable font choices
- Proper text hierarchy

### Motor Accessibility

**Touch Targets:**
- Minimum 44pt touch targets
- Adequate spacing between elements
- Alternative input methods
- Gesture alternatives

**Interaction Patterns:**
- Simple gesture requirements
- Alternative navigation methods
- Customizable interaction settings

## Internationalization

### Multi-Language Support

**Supported Languages:**
- English (default)
- German (Deutsch)
- Italian (Italiano)
- French (Français)

**Implementation:**
- React Native i18n integration
- Dynamic language switching
- RTL language support preparation
- Cultural adaptation considerations

### Localization Features

**Content Localization:**
- Text translation
- Date and time formatting
- Number and currency formatting
- Image and media localization

**Cultural Adaptation:**
- Local business practices
- Regional preferences
- Cultural color meanings
- Local legal requirements

## Deployment Strategy

### Development Environment

**Local Development:**
- Expo CLI development server
- Hot reloading and fast refresh
- Device testing with Expo Go
- Simulator/emulator testing

**Testing Environment:**
- Expo development builds
- Internal testing distribution
- Beta testing with TestFlight/Play Console
- Staging environment integration

### Production Deployment

**Build Process:**
- EAS Build for production builds
- Code signing and certificates
- Environment variable management
- Build optimization

**App Store Distribution:**
- iOS App Store submission
- Google Play Store submission
- App store optimization (ASO)
- Release management

### Over-the-Air Updates

**EAS Update:**
- JavaScript bundle updates
- Asset updates
- Rollback capabilities
- Staged rollout support

**Update Strategy:**
- Critical bug fixes
- Feature updates
- Performance improvements
- Security patches

## Monitoring and Analytics

### Performance Monitoring

**Crash Reporting:**
- Expo crash reporting
- Error tracking and analysis
- Performance metrics
- User experience monitoring

**Analytics Integration:**
- User behavior tracking
- Feature usage analytics
- Conversion funnel analysis
- Retention metrics

### Business Metrics

**Key Performance Indicators:**
- User acquisition and retention
- Feature adoption rates
- Swap completion rates
- User engagement metrics

**A/B Testing:**
- Feature flag implementation
- Experiment tracking
- Statistical significance testing
- Performance impact analysis