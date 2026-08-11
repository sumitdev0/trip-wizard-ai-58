import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { SiteFooter, SiteHeader } from "@/components/tripwise/SiteHeader";
import { deleteTrip, listTrips, updateTripNotes } from "@/lib/trips.functions";
import { formatINR, monthName } from "@/lib/trip-engine";

export const Route = createFileRoute("/_authenticated/trips")({
  head: () => ({
    meta: [
      { title: "My saved trips — TripWise" },
      {
        name: "description",
        content: "Revisit, annotate and compare the trip plans you saved to your TripWise account.",
      },
      { property: "og:title", content: "My saved trips — TripWise" },
      { property: "og:description", content: "Your saved TripWise plans, side by side." },
    ],
  }),
  component: TripsPage,
});

type Trip = Awaited<ReturnType<typeof listTrips>>[number];

function TripsPage() {
  const fetchTrips = useServerFn(listTrips);
  const removeTrip = useServerFn(deleteTrip);
  const saveNotes = useServerFn(updateTripNotes);
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState<string[]>([]);

  const { data: trips = [], isPending } = useQuery({
    queryKey: ["saved-trips"],
    queryFn: () => fetchTrips(),
  });

  const del = useMutation({
    mutationFn: (id: string) => removeTrip({ data: { id } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["saved-trips"] });
      toast.success("Trip removed.");
    },
    onError: () => toast.error("Could not remove that trip."),
  });

  const notes = useMutation({
    mutationFn: (vars: { id: string; notes: string }) => saveNotes({ data: vars }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["saved-trips"] });
      toast.success("Notes saved.");
    },
    onError: () => toast.error("Could not save notes."),
  });

  const compared = trips.filter((t) => selected.includes(t.id));

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 3 ? prev : [...prev, id],
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl sm:text-4xl">My saved trips</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Everything here is stored on your account, so it follows you across devices. Tick up to three
          trips to compare them side by side.
        </p>

        {isPending ? (
          <p className="mt-8 text-sm text-muted-foreground">Loading your trips…</p>
        ) : trips.length === 0 ? (
          <div className="surface-card mt-8 p-8 text-center">
            <h2 className="text-lg">No saved trips yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Plan a trip and hit “Save trip” on any recommendation.
            </p>
            <Link
              to="/chat"
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
            >
              Start with the AI planner
            </Link>
          </div>
        ) : (
          <>
            {compared.length >= 2 && <CompareTable trips={compared} />}

            <ul className="mt-8 space-y-4">
              {trips.map((trip) => (
                <li key={trip.id} className="surface-card p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <input
                          type="checkbox"
                          checked={selected.includes(trip.id)}
                          onChange={() => toggle(trip.id)}
                          className="accent-accent"
                        />
                        Compare
                      </label>
                      <h2 className="mt-2 text-2xl">{trip.title}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {trip.days} days · {trip.travelers} travellers · {monthName(trip.month)} · budget{" "}
                        {formatINR(trip.budget)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-2xl">{formatINR(trip.estimated_cost)}</p>
                      <p className="text-xs text-muted-foreground">estimated total · score {trip.score}</p>
                    </div>
                  </div>

                  <NotesEditor
                    initial={trip.notes ?? ""}
                    saving={notes.isPending}
                    onSave={(value) => notes.mutate({ id: trip.id, notes: value })}
                  />

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      to="/destinations/$id"
                      params={{ id: trip.destination_id }}
                      search={{ days: trip.days, travelers: trip.travelers }}
                      className="inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-medium text-accent-foreground"
                    >
                      Open itinerary
                    </Link>
                    <button
                      type="button"
                      onClick={() => del.mutate(trip.id)}
                      className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function NotesEditor({
  initial,
  saving,
  onSave,
}: {
  initial: string;
  saving: boolean;
  onSave: (value: string) => void;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div className="mt-4">
      <label className="mb-1.5 block text-sm font-medium">Notes</label>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={2}
        placeholder="Booking ideas, who's coming, what to check…"
        className="w-full rounded-md border border-input bg-card p-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
      {value !== initial && (
        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(value)}
          className="mt-2 h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-60"
        >
          Save notes
        </button>
      )}
    </div>
  );
}

function CompareTable({ trips }: { trips: Trip[] }) {
  const rows: { label: string; value: (t: Trip) => string }[] = [
    { label: "Destination", value: (t) => t.destination_name },
    { label: "From", value: (t) => t.origin },
    { label: "Estimated total", value: (t) => formatINR(t.estimated_cost) },
    { label: "Budget", value: (t) => formatINR(t.budget) },
    {
      label: "Headroom",
      value: (t) => formatINR(Math.max(0, t.budget - t.estimated_cost)),
    },
    { label: "Per person", value: (t) => formatINR(t.estimated_cost / Math.max(1, t.travelers)) },
    { label: "Days", value: (t) => String(t.days) },
    { label: "Travellers", value: (t) => String(t.travelers) },
    { label: "Month", value: (t) => monthName(t.month) },
    { label: "Match score", value: (t) => `${t.score}/100` },
  ];

  return (
    <div className="surface-card mt-8 overflow-x-auto p-6">
      <h2 className="text-xl">Comparing {trips.length} trips</h2>
      <table className="mt-4 w-full min-w-[520px] text-sm">
        <thead>
          <tr className="text-left">
            <th className="py-2 pr-4 font-medium text-muted-foreground">Metric</th>
            {trips.map((t) => (
              <th key={t.id} className="py-2 pr-4 font-semibold">
                {t.destination_name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-border">
              <td className="py-2 pr-4 text-muted-foreground">{row.label}</td>
              {trips.map((t) => (
                <td key={t.id} className="py-2 pr-4">
                  {row.value(t)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
