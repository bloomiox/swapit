# SwapIt - Sustainable Item Exchange Platform

A modern web application built with Next.js 14, TypeScript, and Tailwind CSS that enables users to swap, share, and sustain through community-driven item exchange.

## 🌟 Features

- **Swap Items**: Exchange items you no longer need with community members
- **Community Driven**: Connect with like-minded people in your neighborhood  
- **Sustainable**: Reduce waste through circular economy principles
- **Easy to Use**: Simple, intuitive interface for seamless item swapping
- **Mobile Ready**: Responsive design that works on all devices

## 🚀 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Design System**: Custom components based on Figma design

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── layout/            # Layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/          # Page sections
│   │   ├── Hero.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── FeaturedItems.tsx
│   │   ├── WhyChooseSwapIt.tsx
│   │   └── DownloadApp.tsx
│   └── ui/                # Reusable UI components
│       ├── Button.tsx
│       ├── Link.tsx
│       └── ItemCard.tsx
└── lib/
    └── utils.ts           # Utility functions
```

## 🎨 Design System

The project implements a comprehensive design system based on the Figma design:

### Colors
- **Primary**: #119C21 (SwapIt Green)
- **Primary Dark**: #416B40
- **Primary Light**: #D8F7D7
- **General Primary**: #021229 (Dark Blue)
- **General Secondary**: #6E6D7A (Gray)
- **Background**: #F7F5EC (Light Beige)

### Typography
- **Font Family**: DM Sans
- **Headings**: H1 (60px), H2 (52px), H4 (32px)
- **Body Text**: Large (20px), Normal (16px), Small (14px)
- **Caption**: 12px

## 🛠️ Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Sections

### 1. Navigation
- SwapIt logo
- Navigation links (Browse, About, Contact)
- Theme toggle
- Authentication buttons (Login, Get Started)

### 2. Hero Section
- Main headline: "Swap. Share. Sustain."
- Call-to-action buttons
- Hero image with floating category icons

### 3. How It Works
- 3-step process explanation
- Visual icons for each step
- Clear descriptions

### 4. Featured Items
- Grid of available items
- Item cards with images, titles, and locations
- "FREE" badges for free items

### 5. Why Choose SwapIt
- Three key benefits: Sustainable, Community, Easy to Use
- Icon-based presentation

### 6. Download App
- App store buttons (coming soon)
- Mobile app preview

### 7. Footer
- Company information
- Quick links
- Social media icons
- Copyright notice

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- Tailwind CSS for styling
- Component-based architecture
- Responsive design principles

## 📄 License

This project is private and proprietary.

---

Built with ❤️ for sustainability and community.