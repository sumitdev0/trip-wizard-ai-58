import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Clock, MapPin, TrainFront } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/tripwise/SiteHeader";
import { ScoreRing } from "@/components/tripwise/ScoreRing";
import { CostTable } from "@/components/tripwise/CostTable";
import {
  INTEREST_OPTIONS,
  ORIGINS,
  STYLE_OPTIONS,
  TRANSPORT_OPTIONS,
  type Interest,
  type TransportMode,
  type TravelStyle,
} from "@/data/destinations";
import {
  MONTHS,
  formatHours,
  formatINR,
  parseQuery,
  recommend,
  type TripRequest,
} from "@/lib/trip-engine";

export const Route = createFileRoute("/plan")({
  validateSearch: (search: Record<string, unknown>): { q?: string } => {
    const raw = search["q"];
    return typeof raw === "string" && raw ? { q: raw } : {};
  },
  head: () => ({
    meta: [
      { title: "Plan your trip — TripWise" },
      {
        name: "description",
        content:
          "Set your budget, days, starting city and interests. TripWise filters out impossible trips and ranks what's left.",
      },
      { property: "og:title", content: "Plan your trip — TripWise" },
      {
        property: "og:description",
        content: "Budget-aware destination recommendations with itemised cost estimates.",
      },
    ],
  }),
  component: PlanPage,
});

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function PlanPage() {
  const { q } = Route.useSearch();
  const parsed = useMemo(() => parseQuery(q ?? ""), [q]);

  const [form, setForm] = useState<TripRequest>({
    origin: parsed.origin ?? "Kolkata",
    budget: parsed.budget ?? 20000,
    days: parsed.days ?? 4,
    travelers: parsed.travelers ?? 2,
    month: new Date().getMonth() + 1,
    interests: parsed.interests.length ? parsed.interests : ["mountains", "photography"],
    styles: parsed.styles.length ? parsed.styles : ["budget"],
    transport: ["train", "bus", "flight", "car"],
    maxTravelHours: 16,
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [request, setRequest] = useState<TripRequest | null>(form);

  const { results, rejected } = useMemo(
    () => (request ? recommend(request) : { results: [], rejected: 0 }),
    [request],
  );

  const validate = (r: TripRequest) => {
    const errs: string[] = [];
    if (!r.origin.trim()) errs.push("Add a starting city.");
    if (r.budget < 2000) errs.push("Budget should be at least ₹2,000.");
    if (r.days < 1 || r.days > 21) errs.push("Days must be between 1 and 21.");
    if (r.travelers < 1 || r.travelers > 12) errs.push("Travellers must be between 1 and 12.");
    if (!r.transport.length) errs.push("Pick at least one transport mode.");
    return errs;
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-3xl sm:text-4xl">Plan your trip</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Hard constraints — budget, days and travel time — remove destinations first. What survives is
          scored on how well it matches you.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[360px_1fr]">
          <form
            className="surface-card h-fit space-y-5 p-6 lg:sticky lg:top-24"
            onSubmit={(e) => {
              e.preventDefault();
              const errs = validate(form);
              setErrors(errs);
              setRequest(errs.length ? null : { ...form });
            }}
          >
            <Field label="Starting location" htmlFor="origin">
              <input
                id="origin"
                list="origin-list"
                value={form.origin}
                onChange={(e) => setForm({ ...form, origin: e.target.value })}
                className={inputClass}
              />
              <datalist id="origin-list">
                {ORIGINS.map((o) => (
                  <option key={o.name} value={o.name} />
                ))}
              </datalist>
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Total budget (₹)" htmlFor="budget">
                <input
                  id="budget"
                  type="number"
                  min={2000}
                  step={500}
                  value={form.budget}
                  onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
                  className={inputClass}
                />
              </Field>
              <Field label="Days" htmlFor="days">
                <input
                  id="days"
                  type="number"
                  min={1}
                  max={21}
                  value={form.days}
                  onChange={(e) => setForm({ ...form, days: Number(e.target.value) })}
                  className={inputClass}
                />
              </Field>
              <Field label="Travellers" htmlFor="travelers">
                <input
                  id="travelers"
                  type="number"
                  min={1}
                  max={12}
                  value={form.travelers}
                  onChange={(e) => setForm({ ...form, travelers: Number(e.target.value) })}
                  className={inputClass}
                />
              </Field>
              <Field label="Travel month" htmlFor="month">
                <select
                  id="month"
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: Number(e.target.value) })}
                  className={inputClass}
                >
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i + 1}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label={`Max travel time one way: ${form.maxTravelHours}h`} htmlFor="maxTravel">
              <input
                id="maxTravel"
                type="range"
                min={4}
                max={40}
                step={1}
                value={form.maxTravelHours}
                onChange={(e) => setForm({ ...form, maxTravelHours: Number(e.target.value) })}
                className="w-full accent-accent"
              />
            </Field>

            <ChipGroup
              legend="Interests"
              options={INTEREST_OPTIONS}
              selected={form.interests}
              onToggle={(v) => setForm({ ...form, interests: toggle<Interest>(form.interests, v) })}
            />
            <ChipGroup
              legend="Travel style"
              options={STYLE_OPTIONS}
              selected={form.styles}
              onToggle={(v) => setForm({ ...form, styles: toggle<TravelStyle>(form.styles, v) })}
            />
            <ChipGroup
              legend="Transport"
              options={TRANSPORT_OPTIONS}
              selected={form.transport}
              onToggle={(v) => setForm({ ...form, transport: toggle<TransportMode>(form.transport, v) })}
            />

            {errors.length > 0 && (
              <ul role="alert" className="space-y-1 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            )}

            <button
              type="submit"
              className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Find my trips
            </button>
          </form>

          <section aria-live="polite">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl">
                {results.length} {results.length === 1 ? "trip fits" : "trips fit"}
              </h2>
              {rejected > 0 && (
                <p className="text-sm text-muted-foreground">
                  {rejected} destinations filtered out by your budget, days or travel time.
                </p>
              )}
            </div>

            {results.length === 0 ? (
              <div className="surface-card mt-5 p-8 text-center">
                <h3 className="text-lg">Nothing fits yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try raising the budget, adding a day, allowing more travel time, or checking the
                  starting city name.
                </p>
              </div>
            ) : (
              <ol className="mt-5 space-y-5">
                {results.map((r) => (
                  <li key={r.destination.id} className="surface-card p-6">
                    <div className="flex items-start gap-4">
                      <ScoreRing score={r.score} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">
                          {r.destination.state}
                        </p>
                        <h3 className="text-2xl">{r.destination.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {r.destination.shortDescription}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-accent" aria-hidden="true" /> {r.distanceKm} km
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-accent" aria-hidden="true" />{" "}
                            {formatHours(r.travelHours)} each way
                          </span>
                          <span className="inline-flex items-center gap-1.5 capitalize">
                            <TrainFront className="h-4 w-4 text-accent" aria-hidden="true" /> by {r.mode}
                          </span>
                        </div>
                      </div>
                      <div className="hidden text-right sm:block">
                        <p className="font-display text-2xl">{formatINR(r.cost.total)}</p>
                        <p className="text-xs text-muted-foreground">estimated total</p>
                      </div>
                    </div>

                    <div className="mt-5 grid gap-5 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-semibold">Why this is recommended</h4>
                        <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                          {r.reasons.map((reason) => (
                            <li key={reason} className="flex gap-2">
                              <span aria-hidden="true" className="text-accent">
                                ✓
                              </span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                        {r.tradeoffs.length > 0 && (
                          <>
                            <h4 className="mt-4 text-sm font-semibold">Trade-offs</h4>
                            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                              {r.tradeoffs.map((t) => (
                                <li key={t} className="flex gap-2">
                                  <span aria-hidden="true">•</span>
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                      <div className="rounded-lg bg-sand p-4">
                        <CostTable cost={r.cost} travelers={request?.travelers ?? form.travelers} />
                      </div>
                    </div>

                    <div className="mt-5">
                      <Link
                        to="/destinations/$id"
                        params={{ id: r.destination.id }}
                        search={{
                          days: request?.days ?? form.days,
                          travelers: request?.travelers ?? form.travelers,
                        }}
                        className="inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
                      >
                        See itinerary & details
                      </Link>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
    </div>
  );
}

function ChipGroup<T extends string>({
  legend,
  options,
  selected,
  onToggle,
}: {
  legend: string;
  options: readonly T[];
  selected: T[];
  onToggle: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-medium">{legend}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => {
          const active = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(o)}
              className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-accent/50"
              }`}
            >
              {o.replace("_", " ")}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}