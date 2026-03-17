# ShopNova Next

Premium Next.js commerce platform with immersive 3D presentation, authenticated checkout, admin operations tooling, transactional email flows, and local SQLite development support.

## Highlights

- Next.js 14 App Router storefront with premium animated UI
- NextAuth authentication with Google, GitHub, and Resend magic links
- Stripe checkout flow with hosted checkout, payment intents, and webhooks
- Prisma ORM with local SQLite development database
- Admin command center with inventory, orders, users, and email transport health
- Account dashboard with WebGL-driven anti-gravity visual design
- Redis-backed cart session and rate limiting support
- Resend-powered transactional emails and custom magic-link template
- CI workflow, Husky hooks, and lint-staged for development quality

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Prisma
- NextAuth v5 beta
- Stripe
- Resend
- Upstash Redis
- Tailwind CSS
- Framer Motion
- React Three Fiber / Drei

## Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` and fill in the values you want enabled.

Required for local app startup:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="change-this-to-a-long-random-secret"
```

Optional services:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=""
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
RESEND_API_KEY=""
EMAIL_FROM_DEFAULT=""
EMAIL_FROM_AUTH=""
EMAIL_FROM_ORDERS=""
EMAIL_FROM_SHIPPING=""
EMAIL_REPLY_TO=""
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""
NEXT_PUBLIC_SPLINE_SCENE_URL=""
```

### 3. Generate Prisma client and seed data

```bash
npm run prisma:generate
npx prisma db push
npm run prisma:seed
```

### 4. Start the app

```bash
npm run dev -- --port 3001
```

Open `http://localhost:3001`.

## Seeded Accounts

- Admin: `admin@shopnova.dev`
- User: `user@shopnova.dev`

Magic-link and transactional emails require a valid `RESEND_API_KEY` and sender addresses.

## Useful Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run check
npm run ci:check
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

## Project Structure

```text
app/                Routes, pages, APIs
components/         UI, cart, checkout, 3D scenes
emails/             React Email templates
lib/                Auth, email, Prisma, Stripe, Redis utilities
prisma/             Schema and seed script
store/              Zustand client stores
.github/workflows/  CI pipeline
.husky/             Git hooks
```

## Quality Notes

- `main` is configured with CI validation workflow
- pre-commit runs `lint-staged`
- pre-push runs `npm run typecheck`
- local SQLite database file is ignored from git

## Repository

Published to:

`https://github.com/nishant2-1/Ecom`
