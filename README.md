# Harbor

A Next.js template with server-side rendering, email/password authentication, and a signup flow where users join as **candidates** or **providers**.

## Features

- App Router pages rendered on the server
- Landing page with candidate and provider paths
- Sign up, log in, and log out via Server Actions
- Role choice during signup (`CANDIDATE` or `PROVIDER`)
- Signed httpOnly session cookies
- Role-specific dashboard rendered from the current session

## Setup

```bash
cp .env.example .env
npx prisma migrate dev --name init
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`SESSION_SECRET` should be a long random string. Generate one with:

```bash
openssl rand -base64 32
```
