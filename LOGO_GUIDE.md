# 🎨 Food Casino Logo System

This document describes the logo and branding system for the Food Casino Roulette app.

## Logo Components

### 1. AppLogo Component (`src/components/AppLogo.js`)
The main scalable SVG logo component that displays a casino roulette wheel with "FOOD CASINO" text.

**Features:**
- Scalable to any size (default: 1024px)
- Casino-themed roulette wheel design
- Gold and red color scheme
- SVG-based for crisp display
- Includes roulette ball animation

**Usage:**
```jsx
import { AppLogo } from './src/components/AppLogo';

// Default size (1024px)
<AppLogo />

// Custom size
<AppLogo size={200} />
```

### 2. LogoHeader Component (`src/components/LogoHeader.js`)
A reusable header component that combines the logo with text content.

**Props:**
- `title` - Main title text
- `subtitle` - Subtitle text  
- `logoSize` - Size of the logo (default: 60)
- `showTitle` - Whether to show "Food Casino" title (default: true)

**Usage:**
```jsx
import { LogoHeader } from './src/components/LogoHeader';

<LogoHeader 
  title="🏠 Home Food Casino"
  subtitle="Spin the wheel to decide what to cook!"
  logoSize={80}
/>
```

### 3. WelcomeScreen Component (`src/components/WelcomeScreen.js`)
A full-screen welcome component featuring the logo prominently.

## Logo Files

### Source Files
- `assets/food-casino-logo.svg` - Master SVG logo file
- `assets/app-icon.svg` - Alternative icon format
- `assets/icon.svg` - Another icon variant

### Generated Icons
All icons are generated from the master SVG using `generate-icons.js`:

- `assets/icon.png` (1024x1024) - Main app icon for iOS/Android
- `assets/adaptive-icon.png` (1024x1024) - Android adaptive icon foreground
- `assets/splash-icon.png` (512x512) - Splash screen logo
- `assets/favicon.png` (32x32) - Web favicon

## Icon Generation

To regenerate all icons from the master SVG:

```bash
# Ensure sharp is installed
npm install sharp

# Generate all icon sizes
node generate-icons.js
```

This will create all required icon formats and sizes for:
- iOS app icon
- Android app icon
- Android adaptive icon
- Splash screen
- Web favicon

## Design Specifications

### Logo Design
- **Style**: Casino roulette wheel with text
- **Colors**: 
  - Gold accents: `#FFD700`
  - Red segments: `#dc2626` to `#991b1b` gradient
  - Black segments: `#374151` to `#1f2937` gradient  
  - Green segments: `#059669` to `#047857` gradient
  - Background: `#1a1a2e` to `#0f0f1e` gradient
- **Typography**: Bold, casino-style fonts
- **Elements**: Roulette wheel, ball, segments, center text

### Branding Usage
- Used in all screen headers via `LogoHeader` component
- App icon for all platforms
- Splash screen branding
- Navigation header logo
- Consistent sizing and spacing

## Implementation

The logo system is implemented throughout the app:

1. **App.js** - Navigation header with logo
2. **HomeRouletteScreen.js** - LogoHeader with home branding
3. **RestaurantRouletteScreen.js** - LogoHeader with restaurant branding  
4. **ManageItemsScreen.js** - LogoHeader with management branding
5. **app.json** - Icon configuration for all platforms

## Customization

To customize the logo:

1. Edit `assets/food-casino-logo.svg` with your preferred SVG editor
2. Update colors in `src/components/AppLogo.js` if needed
3. Run `node generate-icons.js` to regenerate all icons
4. Update app.json if new icon paths are needed

The logo system is designed to be maintainable and consistent across the entire application.
