# SwapIt Mobile App

A React Native mobile application built with Expo SDK 54 for the SwapIt platform.

## Features

- Cross-platform mobile app (iOS & Android)
- Native navigation with Expo Router
- Shared backend with web application (Supabase)
- Real-time messaging and notifications
- Camera integration for item photos
- Location-based item discovery
- Offline functionality
- Animated splash screen with app initialization
- Deep link processing and navigation

## Tech Stack

- **Framework**: Expo SDK 54 with React Native
- **Language**: TypeScript
- **Navigation**: Expo Router
- **Styling**: NativeWind (Tailwind CSS)
- **State Management**: Zustand + React Query
- **Backend**: Supabase (shared with web app)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Update the `.env` file with your Supabase credentials

### Development

Start the development server:
```bash
npm start
```

Run on specific platforms:
```bash
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

### Building

Build for production:
```bash
npm run build:ios     # iOS build
npm run build:android # Android build
npm run build:all     # Both platforms
```

## Project Structure

```
swapit-mobile/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   ├── (auth)/            # Authentication flow
│   └── _layout.tsx        # Root layout
├── src/
│   ├── components/        # Reusable components
│   │   ├── shared/        # Cross-platform components
│   │   ├── mobile/        # Mobile-specific components
│   │   ├── ui/            # UI component library
│   │   └── forms/         # Form components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and external services
│   ├── stores/            # Zustand stores
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript definitions
│   └── constants/         # App constants
└── assets/                # Static assets
```

## Development Guidelines

- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write tests for critical functionality
- Follow React Native best practices
- Maintain cross-platform compatibility

## Contributing

1. Create a feature branch
2. Make your changes
3. Run linting and tests
4. Submit a pull request