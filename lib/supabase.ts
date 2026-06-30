import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;
const secretKey = process.env.SUPABASE_SECRET_KEY!;

export const supabase = createClient(url, publishableKey);
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
