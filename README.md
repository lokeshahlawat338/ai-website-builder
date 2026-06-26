# SiteBuilder AI

A full-stack AI website builder — describe a website idea in plain English and get a complete, generated site in seconds. Built on the **PERN stack** (PostgreSQL, Express, React, Node) with Clerk authentication, Gemini AI generation, and Stripe-powered credit purchases.

**Live app:** https://ai-website-builder-gamma-bice.vercel.app/

---

## Features

- 🔐 **Authentication** — sign up / sign in via [Clerk](https://clerk.com)
- 🤖 **AI generation** — describe a site, get working HTML/CSS generated via Google Gemini
- 💳 **Credits & payments** — free signup credits, paid top-up packages via [Stripe](https://stripe.com)
- 📁 **Project management** — save, view, regenerate, refine, and delete generated projects
- ⚡ **Modern stack** — React 19 + Vite client, Express API, Prisma ORM, PostgreSQL database

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, Tailwind CSS, Axios |
| Backend | Node.js, Express |
| Database | PostgreSQL (via Prisma ORM) |
| Auth | Clerk |
| AI | Google Gemini API |
| Payments | Stripe |
| Hosting (frontend) | Vercel |
| Hosting (backend + DB) | Railway |

---

## Project Structure

```
ai-website-builder/
├── client/              # React + Vite frontend
│   ├── src/
│   │   ├── components/  # Navbar, shared UI
│   │   ├── context/     # AppContext (auth, credits, projects state)
│   │   ├── lib/         # api.js — Axios client + API calls
│   │   └── pages/       # Landing, Dashboard, Builder, Pricing, Project pages
│   └── vercel.json      # SPA rewrite rules for client-side routing
│
├── server/              # Express backend
│   ├── controllers/     # generate, payment, project controllers
│   ├── routes/          # /api/v1/user, /generate, /projects, /payment
│   ├── middleware/      # Clerk auth + auto user-provisioning
│   ├── lib/              # Prisma client, Gemini client
│   ├── prisma/          # schema.prisma + migrations
│   └── railway.json     # Railway build/deploy config
│
└── package.json         # root scripts to run client + server concurrently in dev
```

---

## Local Development

### Prerequisites
- Node.js 18+
- A PostgreSQL database (local or hosted, e.g. [Neon](https://neon.tech))
- API keys: [Clerk](https://dashboard.clerk.com), [Google Gemini](https://ai.google.dev), [Stripe](https://dashboard.stripe.com)

### Setup

```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

Create `server/.env` (see `server/.env.example` for the full list):

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=
GEMINI_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NODE_ENV=development
```

Create `client/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=
```

Run migrations and start both apps:

```bash
cd server && npx prisma migrate deploy
cd ..
npm run dev   # runs client (Vite) + server (nodemon) together
```

- Client: http://localhost:5173
- Server: http://localhost:5000
- Health check: http://localhost:5000/health

---

## Deployment

### Backend — Railway
1. New project → Deploy from GitHub → set **Root Directory** to `server`.
2. Add a PostgreSQL database in the same project; reference its `DATABASE_URL` in the server service variables.
3. Set environment variables: `CLERK_SECRET_KEY`, `GEMINI_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NODE_ENV=production`, `CLIENT_URL` (your Vercel URL).
4. `railway.json` start command runs migrations automatically before starting the server:
   ```
   npx prisma migrate deploy && node index.js
   ```
5. Generate a public domain under **Settings → Networking**.

### Frontend — Vercel
1. New project → import the repo → set **Root Directory** to `client`.
2. Framework auto-detected as Vite.
3. Set environment variables: `VITE_API_BASE_URL` (Railway backend URL), `VITE_CLERK_PUBLISHABLE_KEY`.
4. Deploy. `vercel.json` handles SPA routing so client-side routes don't 404 on refresh.

### Final wiring
- Set `CLIENT_URL` on Railway to the live Vercel URL (CORS).
- Register a Stripe webhook pointing at `https://<railway-domain>/api/v1/payment/webhook`, listening for `checkout.session.completed`, and set `STRIPE_WEBHOOK_SECRET` on Railway.

---

## API Overview

All routes are prefixed `/api/v1`.

| Route | Method | Description |
|---|---|---|
| `/user/profile` | GET | Get current user profile + credits |
| `/user/profile` | PATCH | Update user profile |
| `/user/credits` | GET | Get current credit balance |
| `/generate` | POST | Generate a new website from a prompt (costs 1 credit) |
| `/projects` | GET | List the user's saved projects |
| `/projects/:id` | GET / PATCH / DELETE | View, update, or delete a project |
| `/projects/:id/regenerate` | POST | Regenerate a project from a new prompt |
| `/projects/:id/refine` | POST | Refine an existing project with an instruction |
| `/payment/checkout` | POST | Create a Stripe checkout session for a credit package |
| `/payment/webhook` | POST | Stripe webhook — credits user on successful payment |

---

## Roadmap / Known Next Steps

- [ ] Switch Clerk from development to production instance before public launch
- [ ] Switch Stripe to live mode keys/webhook before accepting real payments
- [ ] Add rate limiting on `/generate` to control AI API costs
- [ ] Sanitize error responses in production (avoid leaking internal error messages)
- [ ] Attach a custom domain
- [ ] Add error monitoring (e.g. Sentry)

---

## License

This project is for personal/educational use.