# Clippy Helper

An AI-powered assistant that provides answers structured as lists.

## 🚀 Developer quick start (in terminal)

1. Install dependencies

```
bun install
```

2. Set up environment variables

```
cp .env.example .env
```

3. Add your OpenAI API key and database URL to the .env file (or copy in provided values)

4. Push the database schema (required if the database hasn't already been setup)

```
bun run db:push
```

5. Start development server

```
bun run dev
```

6. Visit `http://localhost:3000` to view the app.

### 📋 Required Software

**1. Node.js (v18 or higher)**

- Download from [nodejs.org](https://nodejs.org/)
- Verify installation: `node --version`

**2. Bun (v1.0.0 or higher)**

- Install via curl: `curl -fsSL https://bun.sh/install | bash`
- Or via npm: `npm install -g bun`
- Verify installation: `bun --version`

**3. Git**

- Download from [git-scm.com](https://git-scm.com/)
- Verify installation: `git --version`

**4. PostgreSQL Database**
This project is developed assuming Neon Postgres. Configuration is done via the .env file.

### Required API Keys

**OpenAI API Key**
Open AI API key is configured via the .env file.

- Sign up at [platform.openai.com](https://platform.openai.com/)
- Create an API key in your dashboard
- Ensure you have credits/billing set up

## About the project

### 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Bun
- **Database**: PostgreSQL with Drizzle ORM
- **AI**: OpenAI GPT-4 with structured outputs
- **Styling**: Tailwind CSS
- **State**: React Query (TanStack Query)
- **Types**: TypeScript with strict mode

### 📁 Structure

```
src/
├── app/                      # Next.js App Router
│ ├── api/                    # API routes
│ │ ├── conversations/        # Conversation management
│ │ ├── llm/                  # AI processing
│ │ └── health/               # Health checks
│ └── conversations/          # Chat UI pages
├── components/               # React components
│ ├── features/               # Feature-specific components
│ ├── ui/                     # Reusable UI components
│ └── layout/                 # Layout components
├── services/                 # Business logic
├── hooks/                    # Custom React hooks
├── utils/                    # Utility functions
├── types/                    # TypeScript definitions
├── constants/                # Configuration constants
└── db/                       # Database schema and config
```

### ✨ Features

#### AI Prompting

- **Natural Chat Interface**: Clean, intuitive conversation flow
- **Structured Advice**: AI responses organized into actionable excerpts
- **Message Editing**: Edit any message and regenerate conversation from that point
- **Conversation History**: Persistent chat sessions with full context

#### Data Management

- **Smart Caching**: React Query optimizes data fetching and updates
- **Real-time Updates**: Optimistic updates for smooth UX

#### Developer Experience

- **Type Safety**: Full TypeScript coverage with strict typing

### 🔌 API Endpoints

| Method           | Endpoint                                       | Purpose                   |
| ---------------- | ---------------------------------------------- | ------------------------- |
| `GET`            | `/api/health`                                  | System health check       |
| `POST`           | `/api/llm`                                     | Generate AI responses     |
| `GET/POST`       | `/api/conversations`                           | List/create conversations |
| `GET/PUT/DELETE` | `/api/conversations/[id]`                      | Manage conversation       |
| `GET/POST`       | `/api/conversations/[id]/messages`             | Conversation messages     |
| `DELETE`         | `/api/conversations/[id]/messages/[messageId]` | Delete message            |
| `GET/PUT`        | `/api/excerpts/[id]`                           | Manage excerpts           |

### 🗄 Database Schema

```sql
-- Conversations
conversations: id, title, created_at, updated_at

-- Messages (user prompts and AI responses)
messages: id, conversation_id, role, content, created_at

-- Excerpts (structured AI advice items)
excerpts: id, message_id, title, content, order
```

### ⚙️ Configuration

#### Environment Variables (.env)

```bash
# Database
DATABASE_URL=postgresql://...

# OpenAI
OPENAI_API_KEY=sk-...
```

### 🏗 Development Workflow

#### Running the App

```bash
# Development
bun run dev

# Production build
bun run build
bun run start

# Type checking
bun run type-check

# Linting
bun run lint
```

#### Database Management

```bash
# Push schema to db
bun run db:push

# Generate migrations
bun run db:generate

# Apply migrations
bun run db:migrate

# View database
bun run db:studio
```

## 🎯 Architecture Decisions

### AI Response Flow

1. **User Input** → Validation → Database storage
2. **Context Building** → Filter user messages for AI context
3. **AI Processing** → Structured output with title + advice list
4. **Response Storage** → Message + individual excerpts
5. **UI Updates** → Real-time cache invalidation

### Message Editing

- **Conversation Branching**: Editing creates new conversation path
- **Cascade Deletion**: Remove edited message and all messages after edited point
- **Context Regeneration**: Fresh AI response based on new state

## 🚀 Deployment

### Build Process

```bash
# Install dependencies
bun install

# Build application
bun run build

# Start production server
bun run start
```

### Environment Setup

1. Set up PostgreSQL database
2. Run migrations: `bun run db:migrate`
3. Configure environment variables
4. Deploy to your platform of choice

### Health Monitoring

- **Health Check**: `GET /api/health`
- **Error Tracking**: Comprehensive error logging
- **Performance**: Built-in Next.js analytics
