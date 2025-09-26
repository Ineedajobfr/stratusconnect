# Component Reference

This document provides a comprehensive reference for all components in the StratusConnect platform.

## Table of Contents

- [Job Board Components](#job-board-components)
- [Security Components](#security-components)
- [Analytics Components](#analytics-components)
- [UI Components](#ui-components)
- [Community Components](#community-components)
- [Contract Components](#contract-components)
- [Document Components](#document-components)

## Job Board Components

### JobBoard

A comprehensive job board interface for pilots and crew to browse and apply for aviation jobs.

**Props:**
- `userRole: 'pilot' | 'crew' | 'broker' | 'operator'` - The role of the current user

**Features:**
- Job listing with filtering and search
- Category and location filtering
- Job type filtering (Full-time, Part-time, Contract)
- Salary range filtering
- Application submission
- Real-time job updates

**Usage:**
```tsx
import JobBoard from '@/components/job-board/JobBoard';

<JobBoard userRole="pilot" />
```

### JobApplication

Component for pilots and crew to apply for specific jobs.

**Props:**
- `jobId: string` - The ID of the job to apply for
- `onClose: () => void` - Callback when application is closed

**Features:**
- Application form with required fields
- Skill matching display
- Cover letter submission
- Resume upload
- Application status tracking

### SavedCrews

Component for brokers to save and manage their favorite crew members.

**Props:**
- `brokerId: string` - The ID of the broker

**Features:**
- Crew member profiles
- Skill and experience display
- Availability status
- Contact information
- Rating and reviews

## Security Components

### SecurityMonitor

Real-time security event monitoring and threat detection system.

**Features:**
- Security event tracking
- Threat severity classification
- IP address monitoring
- User activity tracking
- Alert management
- Security score calculation

**Usage:**
```tsx
import SecurityMonitor from '@/components/security/SecurityMonitor';

<SecurityMonitor />
```

### RateLimiter

API rate limiting monitoring and management system.

**Features:**
- Endpoint rate limit tracking
- Usage percentage display
- Reset time countdown
- Rate limit testing
- Alert notifications

### DataEncryption

Data encryption status and key management system.

**Features:**
- Encryption status monitoring
- Key management
- Compliance tracking
- Algorithm selection
- Key rotation

## Analytics Components

### AnalyticsDashboard

Comprehensive platform performance metrics and analytics.

**Features:**
- User growth metrics
- Job performance analytics
- Revenue tracking
- Conversion rate monitoring
- Top performer identification
- Time series data visualization

**Usage:**
```tsx
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

<AnalyticsDashboard />
```

### PerformanceMonitor

Real-time system performance and health monitoring.

**Features:**
- System resource monitoring
- Response time tracking
- Error rate monitoring
- Throughput measurement
- Alert management
- Performance metrics

## UI Components

### LoadingSpinner

Animated loading spinner with customizable size and text.

**Props:**
- `size?: 'sm' | 'md' | 'lg' | 'xl'` - Size of the spinner
- `className?: string` - Additional CSS classes
- `text?: string` - Optional loading text

**Usage:**
```tsx
import LoadingSpinner from '@/components/ui/LoadingSpinner';

<LoadingSpinner size="lg" text="Loading..." />
```

### AnimatedCard

Card component with hover animations and entrance effects.

**Props:**
- `children: React.ReactNode` - Card content
- `className?: string` - Additional CSS classes
- `hover?: boolean` - Enable hover effects
- `delay?: number` - Animation delay in milliseconds
- `title?: string` - Card title
- `header?: React.ReactNode` - Custom header content

**Usage:**
```tsx
import AnimatedCard from '@/components/ui/AnimatedCard';

<AnimatedCard title="My Card" hover delay={100}>
  <p>Card content</p>
</AnimatedCard>
```

### NotificationToast

Toast notification component with different types and actions.

**Props:**
- `id: string` - Unique identifier
- `type: 'success' | 'error' | 'warning' | 'info'` - Notification type
- `title: string` - Notification title
- `message: string` - Notification message
- `duration?: number` - Auto-dismiss duration (0 = no auto-dismiss)
- `onClose: (id: string) => void` - Close callback
- `action?: { label: string; onClick: () => void }` - Optional action button

**Usage:**
```tsx
import NotificationToast from '@/components/ui/NotificationToast';

<NotificationToast
  id="1"
  type="success"
  title="Success!"
  message="Operation completed successfully"
  onClose={(id) => console.log('Closed:', id)}
/>
```

### ProgressRing

Circular progress indicator with customizable appearance.

**Props:**
- `value: number` - Current progress value
- `max?: number` - Maximum value (default: 100)
- `size?: number` - Ring size in pixels (default: 120)
- `strokeWidth?: number` - Stroke width (default: 8)
- `className?: string` - Additional CSS classes
- `showValue?: boolean` - Show percentage value (default: true)
- `label?: string` - Optional label
- `color?: string` - Ring color (default: 'terminal-accent')

**Usage:**
```tsx
import ProgressRing from '@/components/ui/ProgressRing';

<ProgressRing value={75} label="Progress" color="green" />
```

### FloatingActionButton

Floating action button with expandable menu support.

**Props:**
- `icon?: React.ReactNode` - Button icon
- `label?: string` - Button label
- `position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'` - Button position
- `size?: 'sm' | 'md' | 'lg'` - Button size
- `color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error'` - Button color
- `onClick?: () => void` - Click handler
- `children?: React.ReactNode` - Expandable menu content
- `className?: string` - Additional CSS classes

**Usage:**
```tsx
import FloatingActionButton from '@/components/ui/FloatingActionButton';

<FloatingActionButton
  icon={<Plus />}
  label="Add"
  position="bottom-right"
  onClick={() => console.log('Clicked!')}
>
  <div>Menu content</div>
</FloatingActionButton>
```

## Community Components

### CommunityForums

Community discussion forums for pilots, crew, brokers, and operators.

**Props:**
- `userRole: 'pilot' | 'crew' | 'broker' | 'operator'` - User role

**Features:**
- Forum categories
- Post creation and editing
- Comment system
- User profiles
- Moderation tools
- Search functionality

## Contract Components

### ContractGenerator

PDF contract generation system with customizable templates.

**Props:**
- `dealId: string` - Deal ID for contract generation
- `onClose: () => void` - Close callback

**Features:**
- Template selection
- Custom field editing
- Digital signature support
- PDF generation
- Contract preview
- Version control

### ReceiptGenerator

PDF receipt generation for completed deals.

**Props:**
- `dealId: string` - Deal ID for receipt generation
- `onClose: () => void` - Close callback

**Features:**
- Receipt type selection
- Payment details
- Tax calculations
- PDF generation
- Receipt preview
- Download functionality

## Document Components

### DocumentStorage

Centralized document storage and management system.

**Props:**
- `userRole: 'pilot' | 'crew' | 'broker' | 'operator' | 'admin'` - User role

**Features:**
- Document upload and download
- File type filtering
- Search functionality
- Document preview
- Version control
- Access permissions

## Styling and Theming

All components use the terminal theme system with the following CSS variables:

- `--terminal-bg`: Background color
- `--terminal-fg`: Foreground color
- `--terminal-muted`: Muted text color
- `--terminal-accent`: Accent color
- `--terminal-border`: Border color
- `--terminal-warning`: Warning color
- `--terminal-error`: Error color
- `--terminal-success`: Success color

## Accessibility

All components are built with accessibility in mind:

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Color contrast compliance

## Performance

Components are optimized for performance:

- React.memo for preventing unnecessary re-renders
- useCallback for stable function references
- Lazy loading where appropriate
- Efficient state management
- Minimal re-renders

## Testing

All components include comprehensive test coverage:

- Unit tests for individual components
- Integration tests for component interactions
- Accessibility tests
- Performance tests
- Visual regression tests
