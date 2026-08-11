/** Parses the assistant's fenced `plan` block into a validated TripRequest. */
import {
  INTEREST_OPTIONS,
  STYLE_OPTIONS,
  TRANSPORT_OPTIONS,
  type Interest,
  type TransportMode,
  type TravelStyle,
} from "@/data/destinations";
import { findOrigin, type TripRequest } from "@/lib/trip-engine";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function extractPlan(reply: string): { text: string; plan: TripRequest | null } {
  const match = reply.match(/```(?:plan|json)\s*([\s\S]*?)```/i);
  const text = reply.replace(/```(?:plan|json)[\s\S]*?```/gi, "").trim();
  if (!match?.[1]) return { text: text || reply.trim(), plan: null };

  try {
    const raw = JSON.parse(match[1]) as Record<string, unknown>;
    const origin = findOrigin(String(raw["origin"] ?? ""));
    const budget = Number(raw["budget"]);
    const days = Number(raw["days"]);
    if (!origin || !Number.isFinite(budget) || !Number.isFinite(days)) {
      return { text: text || reply.trim(), plan: null };
    }

    const list = <T extends string>(value: unknown, allowed: readonly T[]): T[] =>
      Array.isArray(value) ? (value.filter((v) => allowed.includes(v as T)) as T[]) : [];

    const transport = list<TransportMode>(raw["transport"], TRANSPORT_OPTIONS);

    const plan: TripRequest = {
      origin: origin.name,
      budget: Math.round(clamp(budget, 2000, 5_000_000)),
      days: Math.round(clamp(days, 1, 21)),
      travelers: Math.round(clamp(Number(raw["travelers"]) || 1, 1, 12)),
      month: Math.round(clamp(Number(raw["month"]) || new Date().getMonth() + 1, 1, 12)),
      interests: list<Interest>(raw["interests"], INTEREST_OPTIONS),
      styles: list<TravelStyle>(raw["styles"], STYLE_OPTIONS),
      transport: transport.length ? transport : [...TRANSPORT_OPTIONS],
      maxTravelHours: Math.round(clamp(Number(raw["maxTravelHours"]) || 16, 4, 40)),
    };
    return { text: text || "Here's what fits your constraints:", plan };
  } catch {
    return { text: text || reply.trim(), plan: null };
  }
}
