# A.SAP Platform - Design Guidelines

## Design System Foundation

**Framework**: Tailwind CSS + shadcn/ui components
**Approach**: Professional B2B SaaS with modern, clean aesthetic

## Color Palette (SAP Brand)

```
Primary Blue: #0070F3
Gold Accent: #F4AB3A
Dark Blue: #003366
Light Blue: #E3F2FD
Gray: #697386
```

## Typography

- **Primary Font**: System font stack via Tailwind defaults
- **Hierarchy**: Clear distinction between headings (bold, larger) and body text
- **Sizes**: Use Tailwind scale (text-sm, text-base, text-lg, text-xl, text-2xl, text-3xl, text-4xl)

## Layout System

**Spacing**: Tailwind units of 4, 6, 8, 12, 16, 20, 24 (p-4, m-8, gap-6, etc.)
**Max-widths**: 
- Container: max-w-7xl
- Content sections: max-w-6xl
- Text content: max-w-4xl

## Core Components

### Homepage
- **Hero**: Full-width gradient background (blue SAP gradient), centered content, prominent CTA buttons
- **Problem Cards**: 2x2 grid on desktop (grid-cols-1 md:grid-cols-2), cards with icons, hover effects
- **CTAs**: Primary (gold background) and secondary (blue outline) buttons

### Agent IA Page (/agent)
- **Chat Interface**: ChatGPT-style layout, full-height viewport
- **Messages**: Alternating left (user) and right (AI) alignment
- **Input**: Fixed bottom bar with text input, quick action buttons
- **Avatar**: Professional icon for AI agent

### Expertises Page
- **Cards Grid**: Grid layout (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- **Service Cards**: Icon top, title, bullet list, CTA button bottom
- **Sections**: 5 distinct service categories with visual separation

### Formations Page
- **Filters Sidebar**: Left sidebar on desktop, collapsible on mobile
- **Formation Cards**: Grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- **Badges**: Color-coded (Certifiant, Nouveau, Populaire)
- **Detail Page**: Single column, detailed sections with clear hierarchy

### FAQ Page
- **Accordion**: Elegant collapse/expand with smooth transitions
- **Search Bar**: Prominent top placement
- **Categories**: Clear visual grouping with headers

### Admin Dashboard
- **Layout**: Sidebar navigation (fixed left), main content area
- **KPI Cards**: 4-column grid at top with metrics
- **Tables**: Full-width with alternating row colors, action buttons right-aligned
- **Kanban Board**: Column-based drag-drop interface for leads

## Animations & Interactions

- **Minimal & Purposeful**: Subtle hover states on cards/buttons
- **Transitions**: 200-300ms duration for smooth feel
- **Micro-interactions**: Button press feedback, loading states
- **NO**: Excessive scroll animations, parallax, or distracting effects

## Images

**Hero Section**: 
- Homepage: Use background gradient overlay (no image required, gradient only)
- Service pages: Optional background patterns or abstract shapes in brand colors

**Service/Formation Cards**: Icons (from Heroicons or similar CDN) instead of images

**About/Why ASAP**: Optional team or office photos if available, otherwise use iconography

## Mobile-First Responsive

- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Navigation**: Hamburger menu on mobile, full nav on desktop
- **Grids**: Stack to single column on mobile, expand on larger screens
- **Touch Targets**: Minimum 44x44px for buttons/links

## Accessibility

- **Contrast**: WCAG 2.1 AA compliant (4.5:1 minimum)
- **Focus States**: Visible ring on keyboard navigation
- **ARIA Labels**: All interactive elements properly labeled
- **Form Inputs**: Clear labels, error states in red with messages

## PWA Optimization

- **App-like Feel**: Full viewport usage, minimal chrome
- **Loading States**: Skeleton screens for async content
- **Offline**: Graceful degradation with friendly message
- **Icons**: 192x192 and 512x512 favicon variants