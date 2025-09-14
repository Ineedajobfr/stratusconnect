# StratusConnect Mobile Shell

## Overview

The StratusConnect Mobile Shell provides a LinkedIn-style mobile experience while keeping the desktop unchanged. This mobile-first interface is designed to feel familiar and intuitive on mobile devices.

## Features

### 🎨 LinkedIn-Style Design
- **Card-first layouts** for easy mobile consumption
- **Bottom tab navigation** with 5 main sections
- **Floating action button** for primary actions
- **Sticky header** with search functionality
- **Clean, professional aesthetic** with deep navy and gold accents

### 📱 Mobile-Optimized Components
- **Home**: Dashboard with live opportunities and quick stats
- **Market**: Jet marketplace with filters and search
- **Requests**: RFQ management and quote tracking
- **Messages**: Secure operator communications
- **Wallet**: Escrow and payment management

### 🎯 Key Features
- **Starfield header** maintaining StratusConnect branding
- **Large tap targets** meeting Apple accessibility guidelines
- **Responsive design** optimized for mobile screens
- **Real-time search** with instant filtering
- **Demo data integration** ready for real API connections

## Usage

### Environment Configuration

The mobile shell is controlled by the `VITE_MOBILE_V2` environment variable:

```bash
# Enable mobile shell (default)
VITE_MOBILE_V2=true

# Disable mobile shell
VITE_MOBILE_V2=false
```

### Conditional Rendering

The mobile shell automatically renders when:
1. Screen width is ≤ 767px (mobile breakpoint)
2. `VITE_MOBILE_V2` is not set to `false`

Desktop experience remains completely unchanged.

## File Structure

```
src/mobile/
├── StratusMobile.tsx     # Main mobile shell component
├── index.ts              # Export wrapper
├── __tests__/            # Unit tests
└── README.md             # This file
```

## Testing

Run the mobile shell tests:

```bash
npm test src/mobile
```

## Integration

The mobile shell is integrated into the main App.tsx with conditional rendering:

```tsx
// Mobile detection and feature flag
const [isMobile, setIsMobile] = useState(false);
const mobileV2 = import.meta.env.VITE_MOBILE_V2 !== "false";

// Render mobile shell if conditions are met
if (mobileV2 && isMobile) {
  return <StratusMobile />;
}
```

## Design System

### Color Palette
- **Background**: `#0A0F1F` (deep night blue)
- **Accent**: `#E0C072` (StratusConnect gold)
- **Text**: White with opacity variations
- **Cards**: White with 5% opacity

### Typography
- **Headers**: Bold, white text
- **Body**: White with 90% opacity
- **Muted**: White with 60% opacity

### Components
- **Cards**: Rounded corners with subtle backgrounds
- **Buttons**: Gold accent buttons for primary actions
- **Tabs**: Icon + label with active state highlighting
- **Search**: Full-width input with search icon

## Accessibility

- **Screen reader support** with proper ARIA labels
- **Large tap targets** (minimum 44px)
- **High contrast** text and backgrounds
- **Keyboard navigation** support
- **VoiceOver** compatible

## Performance

- **Lazy loading** of mobile components
- **Optimized rendering** with React.memo
- **Minimal bundle size** impact
- **Fast initial load** on mobile devices

## Future Enhancements

1. **Real data integration** - Replace demo data with API calls
2. **Push notifications** - Real-time alerts for quotes and messages
3. **Offline support** - Cache critical data for offline use
4. **Progressive Web App** - Add PWA capabilities
5. **Gesture support** - Swipe navigation and actions

## Brand Guidelines

The mobile shell maintains StratusConnect's elite aviation branding:
- **Professional tone** throughout
- **Aviation terminology** in all labels
- **Trust indicators** prominently displayed
- **Security emphasis** in messaging
- **Performance focus** in metrics

Remember: "You are building a cockpit, not a social feed. Use LinkedIn patterns only where they reduce friction, and keep the terminal DNA for real work."
