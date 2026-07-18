import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { randomBytes } from "crypto";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabaseAdmin
    .from("rides")
    .select("*")
    .gte("date", today)
    .order("date", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { type, name, destination, date, time, seats, whatsapp } = body;

  if (!type || !name || !destination || !date || !time || !seats || !whatsapp) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  // Rides has no accounts, so this code is the only proof of ownership a poster
  // has. It's returned once in the response below and never shown again — the
  // client is expected to save it (see the "Screenshot This!" modal in the UI).
  const delete_code = randomBytes(4).toString("hex").toUpperCase();

  const { data, error } = await supabaseAdmin
    .from("rides")
    .insert([{ type, name, destination, date, time, seats, whatsapp, delete_code }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
