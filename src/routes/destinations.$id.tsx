import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarRange, Mountain, Users } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/tripwise/SiteHeader";
import { DESTINATIONS, getDestination, type Destination } from "@/data/destinations";
import { buildItinerary, formatINR, monthName } from "@/lib/trip-engine";

export const Route = createFileRoute("/destinations/$id")({
  validateSearch: (search: Record<string, unknown>) => {
    const days = Number(search["days"]);
    const travelers = Number(search["travelers"]);
    const out: { days?: number; travelers?: number } = {};
    if (days > 0) out.days = days;
    if (travelers > 0) out.travelers = travelers;
    return out;
  },
  loader: ({ params }): { destination: Destination } => {
    const destination = getDestination(params.id);
    if (!destination) throw notFound();
    return { destination };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Destination unavailable — TripWise" }, { name: "robots", content: "noindex" }] };
    }
    const d = loaderData.destination;
    const title = `${d.name}, ${d.state} — costs, best time & itinerary | TripWise`;
    return {
      meta: [
        { title },
        { name: "description", content: d.shortDescription },
        { property: "og:title", content: title },
        { property: "og:description", content: d.shortDescription },
      ],
    };
  },
  component: DestinationPage,
});

function DestinationPage() {
  const { destination } = Route.useLoaderData();
  const search = Route.useSearch();
  const [days, setDays] = useState(search.days ?? destination.averageStayDays);
  const [travelers, setTravelers] = useState(search.travelers ?? 2);
  const [tier, setTier] = useState<"budget" | "comfort" | "luxury">("budget");

  const itinerary = buildItinerary(destination, days, travelers, tier);
  const itineraryTotal = itinerary.reduce((s, d) => s + d.estimatedCost, 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
          <Link to="/destinations" className="hover:text-accent">
            Destinations
          </Link>
          <span aria-hidden="true"> / </span>
          <span className="text-foreground">{destination.name}</span>
        </nav>

        <header className="mt-4">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            {destination.state}, {destination.country}
          </p>
          <h1 className="mt-1 text-4xl">{destination.name}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{destination.description}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {destination.tags.map((t) => (
              <li
                key={t}
                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs capitalize text-secondary-foreground"
              >
                {t}
              </li>
            ))}
          </ul>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat icon={CalendarRange} label="Best months">
            {destination.bestMonths.map((m) => monthName(m).slice(0, 3)).join(", ")}
          </Stat>
          <Stat icon={Users} label="Typical stay">
            {destination.averageStayDays} days
          </Stat>
          <Stat icon={Mountain} label="Difficulty">
            <span className="capitalize">{destination.difficulty}</span>
          </Stat>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl">Build an itinerary</h2>
          <div className="surface-card mt-4 flex flex-wrap items-end gap-4 p-5">
            <div>
              <label htmlFor="days" className="mb-1.5 block text-sm font-medium">
                Days
              </label>
              <input
                id="days"
                type="number"
                min={1}
                max={14}
                value={days}
                onChange={(e) => setDays(Math.min(14, Math.max(1, Number(e.target.value) || 1)))}
                className="h-10 w-24 rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="travelers" className="mb-1.5 block text-sm font-medium">
                Travellers
              </label>
              <input
                id="travelers"
                type="number"
                min={1}
                max={12}
                value={travelers}
                onChange={(e) => setTravelers(Math.min(12, Math.max(1, Number(e.target.value) || 1)))}
                className="h-10 w-24 rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
            </div>
            <div>
              <label htmlFor="tier" className="mb-1.5 block text-sm font-medium">
                Style
              </label>
              <select
                id="tier"
                value={tier}
                onChange={(e) => setTier(e.target.value as typeof tier)}
                className="h-10 rounded-md border border-input bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <option value="budget">Budget</option>
                <option value="comfort">Comfort</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <p className="ml-auto text-sm text-muted-foreground">
              On-ground estimate:{" "}
              <span className="font-display text-lg text-foreground">{formatINR(itineraryTotal)}</span>
              <span className="block text-xs">excludes travel to {destination.name}</span>
            </p>
          </div>

          <ol className="mt-6 space-y-4">
            {itinerary.map((day) => (
              <li key={day.day} className="surface-card p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl">
                    Day {day.day} · {day.title}
                  </h3>
                  <span className="text-sm text-muted-foreground">
                    approx. {formatINR(day.estimatedCost)}
                  </span>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                  <Slot title="Morning" items={day.morning} />
                  <Slot title="Afternoon" items={day.afternoon} />
                  <Slot title="Evening" items={day.evening} />
                </div>
                {day.notes.length > 0 && (
                  <ul className="mt-4 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                    {day.notes.map((n) => (
                      <li key={n}>{n}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="surface-card p-6">
            <h2 className="text-xl">Local tips</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {destination.localTips.map((t) => (
                <li key={t} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    →
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-6">
            <h2 className="text-xl">Daily cost per person</h2>
            <dl className="mt-3 divide-y divide-border text-sm">
              {(["budget", "comfort", "luxury"] as const).map((k) => (
                <div key={k} className="flex justify-between py-2">
                  <dt className="capitalize text-muted-foreground">{k}</dt>
                  <dd className="font-medium">{formatINR(destination.dailyCost[k])}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <SimilarDestinations current={destination} />
      </main>
      <SiteFooter />
    </div>
  );
}

function Slot({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-accent">{title}</h4>
      {items.length ? (
        <ul className="mt-2 space-y-1.5 text-sm">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Free time</p>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card p-5">
      <Icon className="h-4 w-4 text-accent" aria-hidden={true} />
      <p className="mt-2 text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-medium">{children}</p>
    </div>
  );
}

function SimilarDestinations({ current }: { current: Destination }) {
  const similar = DESTINATIONS.filter((d) => d.id !== current.id)
    .map((d) => ({ d, overlap: d.tags.filter((t) => current.tags.includes(t)).length }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3);

  return (
    <section className="mt-10">
      <h2 className="text-2xl">Similar destinations</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {similar.map(({ d }) => (
          <Link
            key={d.id}
            to="/destinations/$id"
            params={{ id: d.id }}
            className="surface-card group p-5 transition-shadow hover:shadow-lg"
          >
            <span className="text-xs uppercase tracking-wider text-muted-foreground">{d.state}</span>
            <h3 className="mt-1 text-lg group-hover:text-accent">{d.name}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d.shortDescription}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}