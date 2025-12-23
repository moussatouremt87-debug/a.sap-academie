# A.SAP Platform

## Overview
A.SAP Platform is a professional consulting website for a digital transformation, SAP, and training firm based in Senegal. The platform features an AI-powered chat agent, service pages, training catalog, and FAQ system.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI GPT-4o via Replit AI Integrations
- **Routing**: Wouter (client-side)
- **State**: TanStack Query (React Query)

## Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── header.tsx  # Main navigation header
│   │   │   ├── footer.tsx  # Site footer
│   │   │   └── theme-toggle.tsx
│   │   ├── pages/          # Page components
│   │   │   ├── home.tsx    # Landing page
│   │   │   ├── agent.tsx   # AI Chat interface
│   │   │   ├── expertises.tsx # Services overview
│   │   │   ├── formations.tsx # Training catalog
│   │   │   ├── faq.tsx     # FAQ page
│   │   │   └── pourquoi-asap.tsx # About page
│   │   ├── lib/            # Utilities
│   │   │   ├── queryClient.ts
│   │   │   ├── theme-provider.tsx
│   │   │   └── utils.ts
│   │   ├── App.tsx         # Main app component
│   │   └── index.css       # Global styles + Tailwind
│   └── index.html
├── server/                 # Backend Express server
│   ├── db.ts               # Database connection
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database operations
│   ├── seed.ts             # Sample data seeding
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Drizzle ORM schemas
└── design_guidelines.md    # UI/UX design specifications
```

## Key Features
1. **AI Agent Chat** (`/agent`) - ChatGPT-style interface with streaming responses
2. **Service Pages** (`/expertises`) - 5 categories of consulting services
3. **Training Catalog** (`/formations`) - Filterable SAP training courses
4. **FAQ System** (`/faq`) - Searchable accordion FAQ
5. **Dark Mode** - Full theme support via ThemeProvider

## Database Schema
- `users` - User accounts (for future auth)
- `conversations` - AI chat conversations
- `messages` - Chat messages
- `formations` - Training courses catalog
- `faqs` - FAQ entries (French/English)
- `leads` - CRM leads

## API Endpoints
- `POST /api/chat` - AI chat with streaming (SSE)
- `GET /api/formations` - List all formations
- `GET /api/formations/:id` - Get single formation
- `GET /api/faqs` - List all FAQs
- `POST /api/leads` - Create new lead

## Design System
- **Primary Blue**: #0070F3 (SAP blue)
- **Gold Accent**: #F4AB3A 
- **Dark Blue**: #003366
- **Font**: Inter for UI, JetBrains Mono for code

## Running the Project
The application runs on port 5000 with `npm run dev`. The database is automatically seeded with sample formations and FAQs on first run.

## Recent Changes
- Initial MVP implementation (December 2024)
- AI Agent with OpenAI GPT-4o integration
- Full responsive design with dark mode
- French as primary language

## User Preferences
- Professional B2B aesthetic
- Clean, modern design
- Mobile-first responsive
- Accessibility WCAG 2.1 AA compliant
