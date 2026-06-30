import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { delete_code } = await req.json();

  const { data: ride, error: fetchError } = await supabaseAdmin
    .from("rides")
    .select("delete_code")
    .eq("id", id)
    .single();

  if (fetchError || !ride) {
    return NextResponse.json({ error: "Ride not found" }, { status: 404 });
  }

  if (ride.delete_code !== delete_code) {
    return NextResponse.json({ error: "Invalid delete code" }, { status: 403 });
  }

  const { error } = await supabaseAdmin.from("rides").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
