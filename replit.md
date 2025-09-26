# Financial Tycoon Game

## Overview
Financial Tycoon is a full-stack React and Node.js business simulation game where players build their financial empire starting with $100,000. The game features real-time market data, WebSocket communication, and a comprehensive dashboard for managing companies, stocks, and business relationships.

## Current State
- ✅ **Server**: Running successfully on port 5000
- ✅ **WebSocket**: Real-time market updates working
- ✅ **Frontend**: React app with Vite dev server operational
- ✅ **Market Simulation**: Live stock price updates every second
- ✅ **Host Configuration**: Properly configured for Replit proxy environment

## Recent Changes
- **2025-09-26**: Initial project setup and configuration for Replit environment
- **2025-09-26**: Configured workflow to use `npx tsx server/index.ts` for compatibility
- **2025-09-26**: Verified WebSocket connections and real-time market data flow
- **2025-09-26**: Set up proper host configuration for Replit frontend proxy

## Project Architecture

### Backend (Express + WebSocket)
- **Server**: `server/index.ts` - Main Express server with Vite integration
- **Game Server**: `server/gameServer.ts` - WebSocket server for real-time game communication
- **Routes**: `server/routes.ts` - API endpoints for game actions and market data
- **Vite Integration**: `server/vite.ts` - Development server setup with hot reload

### Frontend (React + Vite)
- **Main App**: `client/src/App.tsx` - Main game application with QueryClient
- **Components**: 
  - `GameDashboard.tsx` - Main game interface
  - `TaskTracker.tsx` - Game progress tracking
  - `StockChart.tsx` - Market visualization
  - `CompanyManager.tsx` - Business management
  - `ContactNetwork.tsx` - Relationship management
  - `LegalSystem.tsx` - Legal affairs handling
- **Stores**: Zustand-based state management for game state and market data
- **Game Engine**: WebSocket client and message handling

### Configuration Files
- **package.json**: Dependencies and scripts (uses `npx tsx` for dev server)
- **vite.config.ts**: Frontend build configuration with aliases and asset support
- **tailwind.config.ts**: Styling configuration
- **tsconfig.json**: TypeScript configuration

## Key Features
1. **Real-time Market Simulation**: 6 stocks with dynamic pricing and market events
2. **WebSocket Communication**: Live data updates between client and server
3. **Business Management**: Company creation, employee hiring, stock trading
4. **Legal System**: Lawsuits and legal affairs management
5. **Contact Network**: Relationship building with key business figures
6. **Financial Dashboard**: Comprehensive view of portfolio and performance

## Development Workflow
- **Start Development**: `npm run dev` (configured in workflow)
- **Build Production**: `npm run build`
- **Start Production**: `npm run start`
- **Type Checking**: `npm run check`

## Environment Configuration
- **Frontend Host**: 0.0.0.0:5000 (required for Replit proxy)
- **Backend Host**: localhost (internal server communication)
- **WebSocket**: Configured for both HTTP and HTTPS protocols
- **Vite Settings**: `allowedHosts: true` for Replit compatibility

## Game Mechanics
- **Starting Capital**: $100,000
- **Market Updates**: Every 1 second
- **Stock Symbols**: APEX, NOVA, ZETA, LUNA, VEGA, ORION
- **Market Events**: News, earnings, merger rumors, regulatory changes
- **Employee Management**: Hiring with competence and loyalty metrics
- **Legal System**: Lawsuit handling with settlement/trial options

## User Preferences
- **Development Setup**: Prefers existing project structure and conventions
- **Technology Stack**: React, Express, WebSocket, Zustand state management
- **Styling**: Tailwind CSS with dark theme
- **Build System**: Vite for frontend, esbuild for backend production builds

## Dependencies
### Key Runtime Dependencies
- **Frontend**: React 18, @react-three/fiber, framer-motion, zustand, tailwindcss
- **Backend**: Express, WebSocket (ws), @neondatabase/serverless
- **Development**: tsx, vite, typescript, tailwindcss
- **UI Components**: Comprehensive Radix UI component library

## Database
- **ORM**: Drizzle ORM with PostgreSQL support
- **Configuration**: `drizzle.config.ts`
- **Commands**: `npm run db:push`

## Assets
- **Textures**: Located in `client/public/textures/` (asphalt, grass, sand, sky, wood)
- **Sounds**: Background music and effects in `client/public/sounds/`
- **Fonts**: Inter font configuration
- **3D Models**: Heart geometry in `client/public/geometries/`

## Next Steps
- Deploy configuration verification
- Final testing of all game features
- Production deployment setup