import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const secretKey = process.env.SUPABASE_SECRET_KEY!;

// Anon/publishable key: safe to use in client components, subject to Row Level Security.
export const supabase = createClient(url, publishableKey);
// Service-role key: bypasses Row Level Security. Server-only — used by the route
// handlers under app/api, never import this into client components.
export const supabaseAdmin = createClient(url, secretKey);

export type Ride = {
  id: string;
  type: "offering" | "looking";
  name: string;
  destination: string;
  date: string;
  time: string;
  seats: number;
  whatsapp: string;
  delete_code: string;
  created_at: string;
};
