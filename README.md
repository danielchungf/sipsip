# Sipsip ☕

A web application for tracking your daily coffee consumption with beautiful visualizations including a GitHub-style contribution grid.

## Tech Stack

- **Frontend:** React 19, Vite, TypeScript, Tailwind CSS, React Query
- **Backend:** Express, TypeScript, Prisma ORM, PostgreSQL
- **Database:** Supabase (PostgreSQL)
- **Hosting:** Render (frontend & backend)
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
└── packages/
    └── shared/            # Shared types, validators, constants
```

## Prerequisites

- **Node.js** 20+
- **pnpm**
- **Supabase account** (for PostgreSQL database)

## Installation

### 1. Install Dependencies

\`\`\`bash
pnpm install
\`\`\`

### 2. Configure Environment Variables

Create environment files from the examples:

\`\`\`bash
# Backend environment
cp apps/backend/.env.example apps/backend/.env

# Frontend environment
cp apps/frontend/.env.example apps/frontend/.env
\`\`\`

Update `apps/backend/.env` with your Supabase connection string:

\`\`\`env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
JWT_SECRET="your-secret-key"
\`\`\`

Update `apps/frontend/.env`:

\`\`\`env
VITE_API_URL=http://localhost:3000/api
\`\`\`

### 3. Setup the Database

\`\`\`bash
# Run database migrations
pnpm db:migrate

# (Optional) Seed with sample data
pnpm db:seed
\`\`\`

### 4. Start Development Servers

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
- [x] Deployment (Render + Supabase)

## Deployment

### Supabase (Database)

1. Create a new project at [supabase.com](https://supabase.com)
2. Copy the connection string from Settings > Database
3. Add it as `DATABASE_URL` in your environment variables

### Render (Backend)

1. Create a new **Web Service** on [render.com](https://render.com)
2. Connect your repository
3. Configure:
   - **Root Directory:** `apps/backend`
   - **Build Command:** `pnpm install && pnpm db:generate && pnpm build`
   - **Start Command:** `pnpm start`
4. Add environment variables:
   - `DATABASE_URL` - Supabase connection string
   - `JWT_SECRET` - Your secret key

### Render (Frontend)

1. Create a new **Static Site** on Render
2. Connect your repository
3. Configure:
   - **Root Directory:** `apps/frontend`
   - **Build Command:** `pnpm install && pnpm build`
   - **Publish Directory:** `dist`
4. Add environment variables:
   - `VITE_API_URL` - Your backend URL (e.g., `https://your-backend.onrender.com/api`)

## Troubleshooting

### Port Already in Use
If port 3000 (Backend) or 5173 (Frontend) is in use:
\`\`\`bash
# Find and kill process on port
lsof -ti:3000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
\`\`\`

### Prisma Issues
If Prisma commands fail:
\`\`\`bash
# Regenerate Prisma Client
pnpm --filter backend db:generate
\`\`\`

### Supabase Connection Issues
- Ensure your IP is allowed in Supabase Dashboard > Settings > Database > Connection Pooling
- Check that the connection string uses the correct password
- For serverless/Render, use the **pooled connection string** (port 6543)

## Contributing

This is a personal project, but feel free to fork and customize for your own use!

## License

MIT

---

Built with ☕ by Danny
