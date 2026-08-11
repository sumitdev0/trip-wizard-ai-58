import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { Clock, MapPin, Send, Sparkles, TrainFront } from "lucide-react";

import { SiteFooter, SiteHeader } from "@/components/tripwise/SiteHeader";
import { ScoreRing } from "@/components/tripwise/ScoreRing";
import { CostTable } from "@/components/tripwise/CostTable";
import { SaveTripButton } from "@/components/tripwise/SaveTripButton";
import { chatWithPlanner } from "@/lib/ai-chat.functions";
import {
  formatHours,
  formatINR,
  recommend,
  type ScoredDestination,
  type TripRequest,
} from "@/lib/trip-engine";
import { extractPlan } from "@/lib/chat-plan";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI trip planner — TripWise" },
      {
        name: "description",
        content:
          "Chat with the TripWise planner. It asks a few follow-up questions, then filters and ranks destinations against your real budget and time.",
      },
      { property: "og:title", content: "AI trip planner — TripWise" },
      {
        property: "og:description",
        content: "Conversational planning backed by TripWise's constraint filtering and scoring.",
      },
    ],
  }),
  component: ChatPage,
});

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Msg = {
  role: "assistant",
  content:
    "Hi! Tell me where you're starting from, roughly what you can spend and how many days you have — I'll ask a couple of questions and then find trips that actually fit.",
};

function ChatPage() {
  const send = useServerFn(chatWithPlanner);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<TripRequest | null>(null);
  const [results, setResults] = useState<ScoredDestination[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, results]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const { reply } = await send({ data: { messages: next } });
      const { text: visible, plan } = extractPlan(reply);
      setMessages([...next, { role: "assistant", content: visible }]);
      if (plan) {
        setRequest(plan);
        setResults(recommend(plan).results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "The planner is unavailable right now.");
      setMessages(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="flex items-center gap-2 text-3xl sm:text-4xl">
          <Sparkles className="h-7 w-7 text-accent" aria-hidden="true" /> AI trip planner
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          The assistant only gathers your constraints. Every destination, cost and ranking below comes
          from the same deterministic engine that powers the planner form.
        </p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[420px_1fr]">
          <div className="surface-card flex h-[600px] flex-col p-4 lg:sticky lg:top-24">
            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={
                    m.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                      : "mr-auto max-w-[90%] rounded-2xl rounded-bl-sm bg-sand px-4 py-2.5 text-sm"
                  }
                >
                  {m.content}
                </div>
              ))}
              {busy && (
                <p className="mr-auto rounded-2xl bg-sand px-4 py-2.5 text-sm text-muted-foreground">
                  Thinking…
                </p>
              )}
              {error && (
                <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                  {error}
                </p>
              )}
              <div ref={endRef} />
            </div>
            <form onSubmit={submit} className="mt-3 flex gap-2">
              <label htmlFor="chat-input" className="sr-only">
                Message the planner
              </label>
              <input
                id="chat-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="₹25,000 for 5 days from Delhi…"
                className="h-11 flex-1 rounded-lg border border-input bg-card px-3 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              />
              <button
                type="submit"
                disabled={busy}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-accent px-4 text-accent-foreground disabled:opacity-60"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </div>

          <section aria-live="polite">
            {!request ? (
              <div className="surface-card p-8">
                <h2 className="text-lg">Results appear here</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Once the assistant has your starting city, budget and days, TripWise filters out every
                  destination you can't realistically reach and ranks the rest.
                </p>
              </div>
            ) : results.length === 0 ? (
              <div className="surface-card p-8">
                <h2 className="text-lg">Nothing fits those constraints yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tell the assistant you can raise the budget, add a day, or allow longer travel time.
                </p>
              </div>
            ) : (
              <ol className="space-y-5">
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
                      </div>
                      <div className="rounded-lg bg-sand p-4">
                        <CostTable cost={r.cost} travelers={request.travelers} />
                      </div>
                    </div>

                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link
                        to="/destinations/$id"
                        params={{ id: r.destination.id }}
                        search={{ days: request.days, travelers: request.travelers }}
                        className="inline-flex h-10 items-center rounded-lg bg-accent px-5 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
                      >
                        See itinerary & details
                      </Link>
                      <SaveTripButton result={r} request={request} />
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
