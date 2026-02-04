# HomeManager

A modern household management application built with Next.js. Organize your home life with meal planning, chore scheduling, and household member management.

## Features

- **Meal Planning** - Plan weekly meals with daily views and AI-assisted suggestions
- **Chore Scheduling** - Create and assign chores with weekly tracking
- **Household Members** - Manage family members and assign responsibilities
- **Google Authentication** - Secure sign-in with Google OAuth

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **AI**: OpenAI integration for smart suggestions
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Tamen-NMA/HomeManager.git
   cd HomeManager
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env.local
   ```
   Fill in your database URL, Google OAuth credentials, and OpenAI API key.

4. Run database migrations
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── auth/         # Authentication components
│   ├── chores/       # Chore management
│   ├── household/    # Household member management
│   ├── meals/        # Meal planning
│   ├── layout/       # Layout components
│   └── ui/           # Reusable UI components
├── lib/              # Utilities and configurations
└── providers/        # React context providers
```

## License

MIT
