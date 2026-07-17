import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const secretKey = process.env.SUPABASE_SECRET_KEY!;

// Anon-key client: safe to use from client components, respects RLS.
export const supabase = createClient(url, publishableKey);

// Service-role client: bypasses RLS, so it must stay server-only (API routes).
// The app has no user accounts — this is what lets route handlers read/write
// any ride row and enforce the delete_code check themselves in app code.
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
