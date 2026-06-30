# 🚗 Rides — Student Ride Board

A simple, no-login web app for students to post and find shared rides within their local community. Built to replace the chaos of scrolling through a WhatsApp group looking for someone going your way.

**Live app:** [rides-three-pi.vercel.app](https://rides-three-pi.vercel.app/)

## Why

International students often rely on a WhatsApp group to coordinate rides, since cabs aren't always affordable. The problem: ride posts get buried under unrelated messages, old posts (for rides weeks away) clutter the chat, and there's no easy way to filter by destination or date. Rides solves this with a single, organized board.

## Features

- **Post a ride** — offer a ride or request one, with destination, date, time, seats, and a WhatsApp contact number
- **Browse and filter** — filter by ride type (offering / looking) or search by destination
- **No login required** — post and browse instantly, no account needed
- **Self-serve delete** — each post gets a unique delete code so the poster can remove it later
- **Auto-hides past rides** — only upcoming rides are shown
- **WhatsApp integration** — one tap to message the poster directly

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) with TypeScript
- [Supabase](https://supabase.com/) for the database
- Tailwind CSS for styling
- Deployed on [Vercel](https://vercel.com/)

## Getting started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com/) project

### Setup

1. Clone the repo
   ```bash
   git clone https://github.com/ajayvardhan03/Rides.git
   cd Rides
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `rides` table in Supabase with the following columns:

   | Column | Type |
   |---|---|
   | id | uuid (primary key, default `gen_random_uuid()`) |
   | type | text (`offering` or `looking`) |
   | name | text |
   | destination | text |
   | date | date |
   | time | time |
   | seats | int4 |
   | whatsapp | text |
   | delete_code | text |
   | created_at | timestamptz (default `now()`) |

4. Create a `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   SUPABASE_SECRET_KEY=your-supabase-service-role-key
   ```

5. Run the dev server
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view it.

## Deployment

The easiest way to deploy is on [Vercel](https://vercel.com/):

1. Push your repo to GitHub
2. Import the project on Vercel
3. Add the same three environment variables in **Settings → Environment Variables**
4. Deploy

## Roadmap

- [ ] Destination autocomplete
- [ ] Automatic cleanup of expired rides
- [ ] Notifications when a matching ride is posted

## Contributing

Issues and pull requests are welcome. This project started as a small fix for a local community problem — contributions that keep it simple and accessible are especially appreciated.

## License

MIT
