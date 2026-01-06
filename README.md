# Coffee Intake Tracker

A web application for tracking your daily coffee consumption with beautiful visualizations including a GitHub-style contribution grid.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, React Query
- **Backend:** Express, TypeScript, Prisma ORM, PostgreSQL
- **Monorepo:** pnpm workspaces

## Features

- User authentication (register/login with JWT)
- Log coffee entries (type, size, time, notes)
- View coffee history with pagination
- Daily calendar view
- GitHub-style contribution grid (365 days)
- Statistics dashboard (daily, weekly, monthly stats)

## Project Structure

```
coffee/
├── apps/
│   ├── frontend/          # React application
│   └── backend/           # Express API
├── packages/
│   └── shared/            # Shared types, validators, constants
└── docker-compose.yml     # PostgreSQL database
```

## Prerequisites

- **Node.js** 20+ (you have v20.18.3 ✓)
- **pnpm** (installed ✓)
- **Docker** (required for PostgreSQL database - NOT YET INSTALLED)

## Installation

### 1. Install Docker Desktop

Since Docker is not installed on your system, you'll need to install it to run PostgreSQL:

**macOS:**
- Download Docker Desktop from: https://www.docker.com/products/docker-desktop
- Install and start Docker Desktop
- Verify installation: `docker --version`

### 2. Install Dependencies

Dependencies are already installed! If you need to reinstall:

\`\`\`bash
pnpm install
\`\`\`

### 3. Start the Database

\`\`\`bash
# Start PostgreSQL container
docker compose up -d

# Check if database is running
docker ps
\`\`\`

### 4. Setup the Database

\`\`\`bash
# Run database migrations
pnpm db:migrate

# (Optional) Seed with sample data
pnpm db:seed
\`\`\`

### 5. Configure Environment Variables

Frontend and backend .env.example files are already created. Copy them:

\`\`\`bash
# Backend environment
cp apps/backend/.env.example apps/backend/.env
# (Already created with default values)

# Frontend environment
cp apps/frontend/.env.example apps/frontend/.env
# Add: VITE_API_URL=http://localhost:3000/api
\`\`\`

### 6. Start Development Servers

\`\`\`bash
# Start both frontend and backend
pnpm dev

# Or start individually:
pnpm --filter frontend dev  # Frontend: http://localhost:5173
pnpm --filter backend dev   # Backend: http://localhost:3000
\`\`\`

## Development

### Running Migrations

\`\`\`bash
# Create and run a new migration
pnpm db:migrate

# Push schema changes without migration (dev only)
pnpm db:push

# Open Prisma Studio (database GUI)
pnpm db:studio
\`\`\`

### Building for Production

\`\`\`bash
# Build all packages
pnpm build

# Build individual packages
pnpm --filter frontend build
pnpm --filter backend build
\`\`\`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Coffee Entries
- `POST /api/entries` - Log coffee
- `GET /api/entries` - List entries
- `GET /api/entries/:id` - Get entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry

### Statistics
- `GET /api/stats/daily` - Daily stats
- `GET /api/stats/aggregated` - Aggregated stats
- `GET /api/stats/contribution` - Contribution grid data

## Database Schema

### User
- id, email, username, password (hashed)
- One-to-many with CoffeeEntry

### CoffeeEntry
- id, userId, type, size, caffeine, notes, consumedAt
- Types: Espresso, Latte, Cappuccino, Cold Brew, etc.
- Sizes: Small, Medium, Large, Extra Large

## Next Steps

Now that the project structure is set up, here's what comes next:

### Phase 1: Backend Implementation (Current)
- [x] Project setup and database schema
- [ ] Implement authentication endpoints
- [ ] Implement coffee entry CRUD endpoints
- [ ] Implement statistics endpoints

### Phase 2: Frontend Implementation
- [ ] Setup routing and auth context
- [ ] Create login/register pages
- [ ] Create coffee entry form
- [ ] Create dashboard with stats
- [ ] Implement contribution grid component

### Phase 3: Polish
- [ ] Error handling and loading states
- [ ] Responsive design
- [ ] Testing
- [ ] Deployment

## Troubleshooting

### Docker Not Running
If you see "command not found: docker":
1. Install Docker Desktop (see Prerequisites)
2. Make sure Docker Desktop is running
3. Restart your terminal

### Port Already in Use
If port 5432 (Postgres) or 3000 (Backend) is in use:
\`\`\`bash
# Find and kill process on port
lsof -ti:5432 | xargs kill -9
lsof -ti:3000 | xargs kill -9
\`\`\`

### Prisma Issues
If Prisma commands fail:
\`\`\`bash
# Regenerate Prisma Client
pnpm --filter backend db:generate
\`\`\`

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT

---

Built with ☕ by Danny
