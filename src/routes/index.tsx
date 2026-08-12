import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Search, Sparkles, Wallet, Route as RouteIcon, CalendarDays } from "lucide-react";

import heroImage from "@/assets/hero-valley.jpg";
import { SiteFooter, SiteHeader } from "@/components/tripwise/SiteHeader";
import { DESTINATIONS } from "@/data/destinations";
import { formatINR } from "@/lib/trip-engine";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TripWise — Where can you go with your budget?" },
      {
        name: "description",
        content:
          "Enter your budget, days and starting city. TripWise ranks destinations you can realistically afford and builds a day-by-day itinerary.",
      },
      { property: "og:title", content: "TripWise — Where can you go with your budget?" },
      {
        property: "og:description",
        content: "Realistic trips built around your budget, time and interests.",
      },
    ],
  }),
  component: Home,
});

const EXAMPLES = [
  "4 days from Kolkata under ₹15000",
  "Offbeat mountain trip under ₹20000",
  "Romantic trip for two from Delhi",
  "5 days of wildlife from Guwahati",
];

function Home() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const submit = (value: string) => {
    const q = value.trim();
    navigate({ to: "/plan", search: q ? { q } : {} });
  };

  const weekend = DESTINATIONS.filter((d) => d.averageStayDays <= 3).slice(0, 3);
  const hidden = [...DESTINATIONS].sort((a, b) => b.offbeatScore - a.offbeatScore).slice(0, 3);
  const popular = [...DESTINATIONS].sort((a, b) => b.popularityScore - a.popularityScore).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="relative isolate overflow-hidden">
          <img
            src={heroImage}
            alt="Mist filling a Himalayan valley at sunrise with tea terraces in the foreground"
            width={1920}
            height={1088}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-pine/90 via-pine/75 to-pine/95" />
          <div className="relative mx-auto max-w-3xl px-4 py-24 text-center text-pine-foreground sm:py-32">
            <p className="inline-flex items-center gap-2 rounded-full border border-pine-foreground/25 px-3 py-1 text-xs uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Budget-first trip planning
            </p>
            <h1 className="mt-6 text-4xl leading-tight sm:text-6xl">Where can you go with your budget?</h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-pine-foreground/85 sm:text-lg">
              Tell us where you're starting, how much you want to spend and how many days you have.
              We'll find trips that actually fit.
            </p>

            <form
              className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-2 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                submit(query);
              }}
            >
              <label htmlFor="nl-search" className="sr-only">
                Describe your trip
              </label>
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <input
                  id="nl-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="4 days from Kolkata under ₹15000"
                  className="h-12 w-full rounded-lg border border-border bg-card pl-9 pr-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>
              <button
                type="submit"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-accent px-6 font-medium text-accent-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sun"
              >
                Plan my trip <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>

            <ul className="mx-auto mt-4 flex max-w-xl flex-wrap justify-center gap-2">
              {EXAMPLES.map((ex) => (
                <li key={ex}>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery(ex);
                      submit(ex);
                    }}
                    className="rounded-full border border-pine-foreground/25 px-3 py-1.5 text-xs text-pine-foreground/90 transition-colors hover:bg-pine-foreground/10"
                  >
                    {ex}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { icon: Wallet, title: "Honest cost estimates", body: "Transport, stay, food, entry fees and a buffer — itemised, never invented." },
              { icon: RouteIcon, title: "Constraint-first ranking", body: "Anything that breaks your budget, days or travel time is filtered out before scoring." },
              { icon: CalendarDays, title: "Realistic itineraries", body: "Sights grouped geographically, capped at a sane number of hours per day." },
            ].map(({ icon: Icon, title, body }) => (
              <article key={title} className="surface-card p-6">
                <Icon className="h-5 w-5 text-accent" aria-hidden="true" />
                <h2 className="mt-4 text-lg">{title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        {[
          { title: "Weekend getaways", items: weekend },
          { title: "Hidden gems", items: hidden },
          { title: "Popular destinations", items: popular },
        ].map((section) => (
          <section key={section.title} className="mx-auto max-w-6xl px-4 pb-16">
            <div className="flex items-end justify-between">
              <h2 className="text-2xl">{section.title}</h2>
              <Link to="/destinations" className="text-sm font-medium text-accent hover:underline">
                View all
              </Link>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((d) => (
                <Link
                  key={d.id}
                  to="/destinations/$id"
                  params={{ id: d.id }}
                  className="surface-card group flex flex-col p-5 transition-shadow hover:shadow-lg"
                >
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {d.state}
                  </span>
                  <h3 className="mt-1 text-xl group-hover:text-accent">{d.name}</h3>
                  <p className="mt-2 flex-1 text-sm text-muted-foreground">{d.shortDescription}</p>
                  <span className="mt-4 text-sm font-medium">
                    From {formatINR(d.dailyCost.budget)}/day per person
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </div>
  );
}