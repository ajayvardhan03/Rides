"use client";

import { useEffect, useState } from "react";
import type { Ride } from "@/lib/supabase";

type FormData = {
  type: "offering" | "looking";
  name: string;
  destination: string;
  date: string;
  time: string;
  seats: string;
  whatsapp: string;
};

const initialForm: FormData = {
  type: "offering",
  name: "",
  destination: "",
  date: "",
  time: "",
  seats: "",
  whatsapp: "",
};

export default function Home() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [newRide, setNewRide] = useState<{ id: string; delete_code: string } | null>(null);
  const [filterType, setFilterType] = useState<"all" | "offering" | "looking">("all");
  const [filterDest, setFilterDest] = useState("");
  const [deleteModal, setDeleteModal] = useState<{ id: string } | null>(null);
  const [deleteCode, setDeleteCode] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function fetchRides() {
    setLoading(true);
    const res = await fetch("/api/rides");
    const data = await res.json();
    setRides(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  useEffect(() => {
    fetchRides();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/rides", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, seats: parseInt(form.seats) }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok) {
      setNewRide({ id: data.id, delete_code: data.delete_code });
      setForm(initialForm);
      setShowForm(false);
      fetchRides();
    }
  }

  async function handleDelete() {
    if (!deleteModal) return;
    setDeleting(true);
    setDeleteError("");
    const res = await fetch(`/api/rides/${deleteModal.id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ delete_code: deleteCode }),
    });
    const data = await res.json();
    setDeleting(false);
    if (res.ok) {
      setDeleteModal(null);
      setDeleteCode("");
      fetchRides();
    } else {
      setDeleteError(data.error || "Invalid code");
    }
  }

  const filtered = rides.filter((r) => {
    const typeMatch = filterType === "all" || r.type === filterType;
    const destMatch = !filterDest || r.destination.toLowerCase().includes(filterDest.toLowerCase());
    return typeMatch && destMatch;
  });

  function formatDate(dateStr: string) {
    return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">🚗 Rides</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Student ride board</p>
          </div>
          <button
            onClick={() => { setShowForm(!showForm); setNewRide(null); }}
            className="bg-white text-black text-sm font-medium px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
          >
            {showForm ? "Cancel" : "+ Post a Ride"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* Success banner */}
        {newRide && (
          <div className="bg-green-950 border border-green-700 rounded-2xl p-4 text-sm">
            <p className="text-green-400 font-medium mb-1">Ride posted successfully!</p>
            <p className="text-zinc-300">
              Your delete code is:{" "}
              <span className="font-mono font-bold text-white bg-zinc-800 px-2 py-0.5 rounded">
                {newRide.delete_code}
              </span>
            </p>
            <p className="text-zinc-500 text-xs mt-1">Save this — you'll need it to remove your post.</p>
            <button onClick={() => setNewRide(null)} className="text-zinc-600 text-xs mt-2 hover:text-zinc-400">dismiss</button>
          </div>
        )}

        {/* Post form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-2xl p-5 space-y-4">
            <h2 className="font-semibold text-base">Post a ride</h2>

            {/* Type toggle */}
            <div className="flex gap-2">
              {(["offering", "looking"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                    form.type === t ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                  }`}
                >
                  {t === "offering" ? "🚗 Offering a ride" : "🙋 Looking for a ride"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <input
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder-zinc-500 outline-none focus:border-white/30"
                />
              </div>
              <div className="col-span-2">
                <input
                  required
                  placeholder="Destination (e.g. Dallas, TX)"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder-zinc-500 outline-none focus:border-white/30"
                />
              </div>
              <input
                required
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-white/30 text-zinc-300"
              />
              <input
                required
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-white/30 text-zinc-300"
              />
              <input
                required
                type="number"
                min="1"
                max="8"
                placeholder="Seats"
                value={form.seats}
                onChange={(e) => setForm({ ...form, seats: e.target.value })}
                className="bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder-zinc-500 outline-none focus:border-white/30"
              />
              <input
                required
                placeholder="WhatsApp number"
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm placeholder-zinc-500 outline-none focus:border-white/30"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-white text-black font-medium py-2.5 rounded-xl text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              {submitting ? "Posting..." : "Post Ride"}
            </button>
          </form>
        )}

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          {(["all", "offering", "looking"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterType === t ? "bg-white text-black" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
              }`}
            >
              {t === "all" ? "All" : t === "offering" ? "🚗 Offering" : "🙋 Looking"}
            </button>
          ))}
          <input
            placeholder="Filter by destination..."
            value={filterDest}
            onChange={(e) => setFilterDest(e.target.value)}
            className="flex-1 min-w-[160px] bg-zinc-800 border border-white/10 rounded-full px-4 py-1.5 text-sm placeholder-zinc-500 outline-none focus:border-white/30"
          />
        </div>

        {/* Ride feed */}
        {loading ? (
          <div className="text-center text-zinc-600 py-16 text-sm">Loading rides...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-zinc-600 py-16 text-sm">
            No rides found. Be the first to post one!
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((ride) => (
              <div key={ride.id} className="bg-zinc-900 border border-white/10 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      ride.type === "offering"
                        ? "bg-blue-950 text-blue-400 border border-blue-800"
                        : "bg-purple-950 text-purple-400 border border-purple-800"
                    }`}>
                      {ride.type === "offering" ? "🚗 Offering" : "🙋 Looking"}
                    </span>
                    <span className="text-sm font-medium">{ride.name}</span>
                  </div>
                  <button
                    onClick={() => { setDeleteModal({ id: ride.id }); setDeleteCode(""); setDeleteError(""); }}
                    className="text-zinc-600 hover:text-red-400 text-xs transition-colors"
                  >
                    remove
                  </button>
                </div>

                <div className="mt-3 space-y-1">
                  <p className="text-base font-semibold">{ride.destination}</p>
                  <p className="text-sm text-zinc-400">
                    {formatDate(ride.date)} · {ride.time} · {ride.seats} seat{ride.seats !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="mt-3">
                  <a
                    href={`https://wa.me/${ride.whatsapp.replace(/\D/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-950 border border-green-800 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full hover:bg-green-900 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm space-y-4">
            <h3 className="font-semibold">Remove your post</h3>
            <p className="text-sm text-zinc-400">Enter the delete code you received when posting.</p>
            <input
              placeholder="Delete code (e.g. A1B2C3D4)"
              value={deleteCode}
              onChange={(e) => setDeleteCode(e.target.value.toUpperCase())}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono placeholder-zinc-600 outline-none focus:border-white/30"
            />
            {deleteError && <p className="text-red-400 text-sm">{deleteError}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => { setDeleteModal(null); setDeleteCode(""); setDeleteError(""); }}
                className="flex-1 bg-zinc-800 text-zinc-300 py-2.5 rounded-xl text-sm hover:bg-zinc-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={!deleteCode || deleting}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
