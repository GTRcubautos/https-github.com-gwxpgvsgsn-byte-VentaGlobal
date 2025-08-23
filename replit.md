# Overview

TiendaOnline is a full-stack e-commerce application built with React and Express.js, featuring a comprehensive product catalog with separate sections for electronics, cars, and motorcycles. The application supports both retail and wholesale customer types with differentiated pricing, includes a gamification system with points and rewards, and provides administrative tools for managing products, orders, and marketing campaigns.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client application is built with **React 18** using **TypeScript** and modern development tools:

- **Vite** as the build tool and development server for fast compilation and hot module replacement
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management, data fetching, and caching
- **Zustand** with persistence middleware for client-side state management (cart, user session, points)
- **Tailwind CSS** with **shadcn/ui** component library for consistent, customizable UI components
- **React Hook Form** with **Zod** validation for type-safe form handling

The architecture follows a component-based approach with clear separation between UI components, business logic, and data management. Custom hooks handle cross-cutting concerns like mobile detection and toast notifications.

## Backend Architecture
The server is built with **Express.js** using **TypeScript** in ES module format:

- **RESTful API** design with clear endpoint structure (`/api/products`, `/api/orders`, etc.)
- **In-memory storage implementation** (`MemStorage`) that implements a well-defined `IStorage` interface, making it easy to swap for database persistence later
- **Modular route organization** with separate concerns for products, authentication, orders, games, and admin functionality
- **Middleware integration** for request logging, JSON parsing, and error handling
- **Development-optimized** with Vite middleware integration for seamless full-stack development

## Data Storage Strategy
Currently uses **in-memory storage** with a clear abstraction layer:

- **Drizzle ORM** configured for **PostgreSQL** with schema definitions ready for database migration
- **Neon Database** integration configured but not yet implemented
- Well-defined TypeScript interfaces and Zod schemas ensure type safety across the stack
- Database schema supports users, products, orders, rewards configuration, game results, and campaign management

## Authentication & Authorization
Implements a **simple authentication system**:

- **Wholesale access** via access codes rather than traditional username/password
- **User type differentiation** (retail, wholesale, admin) affects pricing visibility and feature access
- **Session-based** user state management with persistent storage
- Ready for expansion to more robust authentication mechanisms

## Gamification System
Features a **comprehensive points and rewards system**:

- **Multiple point earning mechanisms**: daily visits, purchases, social sharing, cart additions, and mini-games
- **Interactive games**: trivia questions, roulette wheel, and puzzle challenges
- **Points-to-discount conversion** system for customer retention
- **Configurable rewards** through admin interface

## Business Logic Features
Supports **multi-tier commerce** with distinct customer experiences:

- **Dual pricing structure** showing both retail and wholesale prices to appropriate users
- **Category-based organization** (electronics, cars, motorcycles) with dedicated pages
- **Advanced search functionality** with URL parameter handling for bookmarkable searches
- **Shopping cart** with persistent state and multiple payment method support

# External Dependencies

## Database & Storage
- **Neon Database** (PostgreSQL) - Configured via `@neondatabase/serverless` for production data persistence
- **Drizzle ORM** - Type-safe database queries and migrations with PostgreSQL dialect
- **connect-pg-simple** - PostgreSQL session store for Express sessions

## UI & Styling
- **Radix UI** - Comprehensive set of unstyled, accessible React components forming the foundation of the design system
- **Tailwind CSS** - Utility-first CSS framework with custom design tokens and dark mode support
- **Lucide React** - Icon library providing consistent iconography
- **Font Awesome** - Additional icons, particularly for social media integration

## Development & Build Tools
- **Vite** - Fast build tool and development server with HMR
- **TypeScript** - Type safety across the entire application
- **ESBuild** - Fast JavaScript bundler for production builds
- **Replit Integration** - Custom plugins for Replit-specific development features

## State Management & Data Fetching
- **TanStack React Query** - Server state management with intelligent caching and background updates
- **Zustand** - Lightweight state management for client-side application state

## Form Handling & Validation
- **React Hook Form** - Performant form library with minimal re-renders
- **Zod** - TypeScript-first schema validation integrated with Drizzle for end-to-end type safety
- **@hookform/resolvers** - Integration between React Hook Form and Zod validation

## Communication & Marketing
- **WhatsApp Business API** - Customer support integration via floating WhatsApp button
- **Social Media Platforms** - Sharing integration for points-based rewards system

The application is designed for easy deployment on Replit with development-specific optimizations and error handling, while maintaining production-ready architecture patterns.