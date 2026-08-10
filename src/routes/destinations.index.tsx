import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { SiteFooter, SiteHeader } from "@/components/tripwise/SiteHeader";
import { DESTINATIONS, INTEREST_OPTIONS, type Interest } from "@/data/destinations";
import { formatINR, monthName } from "@/lib/trip-engine";

export const Route = createFileRoute("/destinations/")({
  head: () => ({
    meta: [
      { title: "Explore destinations — TripWise" },
      {
        name: "description",
        content:
          "Browse TripWise destinations by interest, with typical daily costs, best months and how long people usually stay.",
      },
      { property: "og:title", content: "Explore destinations — TripWise" },
      {
        property: "og:description",
        content: "Destinations with daily cost ranges, best seasons and typical trip lengths.",
      },
    ],
  }),
  component: DestinationsIndex,
});

function DestinationsIndex() {
  const [filter, setFilter] = useState<Interest | "all">("all");
  const [query, setQuery] = useState("");

  const list = DESTINATIONS.filter(
    (d) =>
      (filter === "all" || d.tags.includes(filter)) &&
      (d.name + d.state).toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl sm:text-4xl">Explore destinations</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Every destination carries typical daily costs, the months it's actually good in, and the
          length of stay most travellers need.
        </p>

        <div className="mt-6">
          <label htmlFor="dest-search" className="sr-only">
            Search destinations
          </label>
          <input
            id="dest-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or state"
            className="h-11 w-full max-w-sm rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {(["all", ...INTEREST_OPTIONS] as const).map((tag) => (
            <button
              key={tag}
              type="button"
              aria-pressed={filter === tag}
              onClick={() => setFilter(tag as Interest | "all")}
              className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                filter === tag
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-accent/50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d) => (
            <Link
              key={d.id}
              to="/destinations/$id"
              params={{ id: d.id }}
              className="surface-card group flex flex-col p-5 transition-shadow hover:shadow-lg"
            >
              <span className="text-xs uppercase tracking-wider text-muted-foreground">{d.state}</span>
              <h2 className="mt-1 text-xl group-hover:text-accent">{d.name}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.shortDescription}</p>
              <dl className="mt-4 space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Daily cost</dt>
                  <dd>{formatINR(d.dailyCost.budget)}–{formatINR(d.dailyCost.luxury)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Typical stay</dt>
                  <dd>{d.averageStayDays} days</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Best from</dt>
                  <dd>{monthName(d.bestMonths[0] ?? 1)}</dd>
                </div>
              </dl>
            </Link>
          ))}
        </div>
        {list.length === 0 && (
          <p className="mt-10 text-center text-muted-foreground">No destinations match that filter yet.</p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}