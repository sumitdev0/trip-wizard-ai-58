/**
 * TripWise engines — cost estimation, constraint filtering, weighted scoring
 * and itinerary generation. Pure functions with no UI or data-source coupling,
 * so the scoring model can later be swapped for a learned ranker.
 */
import {
  DESTINATIONS,
  ORIGINS,
  type Destination,
  type Interest,
  type Origin,
  type TransportMode,
  type TravelStyle,
} from "@/data/destinations";

export interface TripRequest {
  origin: string;
  budget: number;
  days: number;
  travelers: number;
  month: number; // 1-12
  interests: Interest[];
  styles: TravelStyle[];
  transport: TransportMode[];
  maxTravelHours: number;
}

export interface CostBreakdown {
  transport: number;
  accommodation: number;
  food: number;
  localTransport: number;
  activities: number;
  entryFees: number;
  miscellaneous: number;
  emergencyBuffer: number;
  subtotal: number;
  total: number;
  perPerson: number;
}

export interface ScoredDestination {
  destination: Destination;
  score: number;
  cost: CostBreakdown;
  travelHours: number;
  distanceKm: number;
  mode: TransportMode;
  reasons: string[];
  tradeoffs: string[];
  components: Record<string, number>;
}

/** Cost and speed characteristics per long-distance mode (INR per km, km/h). */
const MODE_PROFILE: Record<TransportMode, { perKm: number; kmh: number; minKm: number; maxKm: number }> = {
  train: { perKm: 0.75, kmh: 52, minKm: 100, maxKm: 2600 },
  bus: { perKm: 1.4, kmh: 42, minKm: 40, maxKm: 1100 },
  flight: { perKm: 4.2, kmh: 420, minKm: 500, maxKm: 4000 },
  car: { perKm: 8.5, kmh: 48, minKm: 20, maxKm: 900 },
};

const STYLE_TIER: Record<TravelStyle, "budget" | "comfort" | "luxury"> = {
  budget: "budget",
  backpacking: "budget",
  relaxed: "comfort",
  comfort: "comfort",
  family: "comfort",
  romantic: "comfort",
  adventure: "budget",
  luxury: "luxury",
};

export const SCORE_WEIGHTS = {
  budgetMatch: 0.3,
  interestMatch: 0.25,
  seasonMatch: 0.15,
  travelTimeMatch: 0.1,
  styleMatch: 0.1,
  quality: 0.05,
  offbeat: 0.05,
};

export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function findOrigin(name: string): Origin | undefined {
  const q = name.trim().toLowerCase();
  if (!q) return undefined;
  return (
    ORIGINS.find((o) => o.name.toLowerCase() === q) ??
    ORIGINS.find((o) => o.name.toLowerCase().startsWith(q)) ??
    ORIGINS.find((o) => o.name.toLowerCase().includes(q))
  );
}

export function budgetTier(styles: TravelStyle[]): "budget" | "comfort" | "luxury" {
  if (styles.includes("luxury")) return "luxury";
  if (styles.some((s) => STYLE_TIER[s] === "comfort")) return "comfort";
  return "budget";
}

interface RouteOption {
  mode: TransportMode;
  hours: number;
  farePerPerson: number;
}

/**
 * Picks the cheapest realistic mode that stays inside the traveller's
 * maximum one-way travel time. Falls back to the fastest available mode.
 */
export function chooseRoute(
  distanceKm: number,
  allowed: TransportMode[],
  destination: Destination,
  maxTravelHours: number,
): RouteOption | null {
  const modes = (allowed.length ? allowed : (["train", "bus", "flight", "car"] as TransportMode[])).filter(
    (m) => destination.reachableBy.includes(m),
  );

  const options: RouteOption[] = modes
    .map((mode) => {
      const p = MODE_PROFILE[mode];
      if (distanceKm < p.minKm || distanceKm > p.maxKm) return null;
      // Road/rail distances run longer than straight-line; airports add transfer time.
      const routeFactor = mode === "flight" ? 1 : 1.25;
      const overhead = mode === "flight" ? 4 : mode === "train" ? 1.5 : 1;
      const hours = (distanceKm * routeFactor) / p.kmh + overhead;
      return { mode, hours, farePerPerson: Math.round(distanceKm * routeFactor * p.perKm) };
    })
    .filter((o): o is RouteOption => o !== null);

  if (!options.length) return null;
  const withinTime = options.filter((o) => o.hours <= maxTravelHours);
  const pool = withinTime.length ? withinTime : options;
  return pool.reduce((best, o) => (o.farePerPerson < best.farePerPerson ? o : best));
}

export function estimateCost(
  destination: Destination,
  req: TripRequest,
  route: RouteOption,
): CostBreakdown {
  const tier = budgetTier(req.styles);
  const daily = destination.dailyCost[tier];
  const nights = Math.max(1, req.days - 1);
  const people = req.travelers;

  // Daily cost is split into the usual on-ground components.
  const accommodation = Math.round(daily * 0.42 * nights * people);
  const food = Math.round(daily * 0.28 * req.days * people);
  const localTransport = Math.round(daily * 0.16 * req.days * people);
  const activities = Math.round(daily * 0.14 * req.days * people);

  const avgEntry =
    destination.attractions.reduce((s, a) => s + a.entryFee, 0) /
    Math.max(1, destination.attractions.length);
  const entryFees = Math.round(avgEntry * Math.min(destination.attractions.length, req.days * 2) * people);

  const transport = route.farePerPerson * 2 * people; // return journey
  const miscellaneous = Math.round((transport + accommodation + food) * 0.05);
  const subtotal = transport + accommodation + food + localTransport + activities + entryFees + miscellaneous;
  const emergencyBuffer = Math.round(subtotal * 0.08);

  return {
    transport,
    accommodation,
    food,
    localTransport,
    activities,
    entryFees,
    miscellaneous,
    emergencyBuffer,
    subtotal,
    total: subtotal + emergencyBuffer,
    perPerson: Math.round((subtotal + emergencyBuffer) / people),
  };
}

function seasonScore(destination: Destination, month: number): number {
  if (destination.bestMonths.includes(month)) return 1;
  const shoulder = destination.bestMonths.some((m) => Math.abs(m - month) === 1 || Math.abs(m - month) === 11);
  return shoulder ? 0.6 : 0.2;
}

function interestScore(destination: Destination, interests: Interest[]): number {
  if (!interests.length) return 0.6;
  const hits = interests.filter((i) => destination.tags.includes(i)).length;
  return Math.min(1, hits / Math.min(interests.length, 3));
}

function styleScore(destination: Destination, styles: TravelStyle[]): number {
  if (!styles.length) return 0.6;
  const hits = styles.filter((s) => destination.styles.includes(s)).length;
  return hits / styles.length;
}

export function recommend(req: TripRequest): { results: ScoredDestination[]; rejected: number } {
  const origin = findOrigin(req.origin);
  if (!origin) return { results: [], rejected: 0 };

  let rejected = 0;
  const scored: ScoredDestination[] = [];

  for (const destination of DESTINATIONS) {
    const distanceKm = Math.round(haversineKm(origin, destination));
    if (distanceKm < 40) {
      rejected++;
      continue;
    }

    const route = chooseRoute(distanceKm, req.transport, destination, req.maxTravelHours);
    if (!route) {
      rejected++;
      continue;
    }

    // Hard constraint: enough days left on the ground after travelling both ways.
    const groundDays = req.days - (route.hours * 2) / 24;
    if (groundDays < 1) {
      rejected++;
      continue;
    }
    if (route.hours > req.maxTravelHours * 1.5) {
      rejected++;
      continue;
    }

    const cost = estimateCost(destination, req, route);
    if (cost.total > req.budget) {
      rejected++;
      continue;
    }

    const usage = cost.total / req.budget;
    // Best score for using 60-90% of the budget: cheap enough to be safe,
    // rich enough to actually do things.
    const budgetMatch = usage < 0.6 ? 0.7 + usage / 2 : usage <= 0.9 ? 1 : 1 - (usage - 0.9) * 4;
    const interest = interestScore(destination, req.interests);
    const season = seasonScore(destination, req.month);
    const timeMatch = Math.max(0, 1 - route.hours / Math.max(1, req.maxTravelHours));
    const style = styleScore(destination, req.styles);
    const quality = destination.popularityScore / 100;
    const wantsOffbeat = req.interests.includes("offbeat") || req.styles.includes("backpacking");
    const offbeat = wantsOffbeat ? destination.offbeatScore / 100 : 1 - destination.offbeatScore / 200;

    const components = {
      budgetMatch: clamp01(budgetMatch),
      interestMatch: interest,
      seasonMatch: season,
      travelTimeMatch: timeMatch,
      styleMatch: style,
      quality,
      offbeat,
    };

    const score = Math.round(
      (components.budgetMatch * SCORE_WEIGHTS.budgetMatch +
        components.interestMatch * SCORE_WEIGHTS.interestMatch +
        components.seasonMatch * SCORE_WEIGHTS.seasonMatch +
        components.travelTimeMatch * SCORE_WEIGHTS.travelTimeMatch +
        components.styleMatch * SCORE_WEIGHTS.styleMatch +
        components.quality * SCORE_WEIGHTS.quality +
        components.offbeat * SCORE_WEIGHTS.offbeat) *
        100,
    );

    const reasons: string[] = [];
    const tradeoffs: string[] = [];

    const leftover = req.budget - cost.total;
    if (usage <= 0.9) reasons.push(`Fits your budget with about ${formatINR(leftover)} to spare`);
    const matched = req.interests.filter((i) => destination.tags.includes(i));
    if (matched.length) reasons.push(`Strong match for ${matched.join(", ")}`);
    if (season === 1) reasons.push(`${monthName(req.month)} is one of the best months to visit`);
    else if (season < 0.5) tradeoffs.push(`${monthName(req.month)} is off-season here`);
    reasons.push(`About ${formatHours(route.hours)} each way by ${route.mode}`);
    if (destination.offbeatScore > 65) reasons.push("Genuinely offbeat — low crowd levels");
    if (destination.popularityScore > 85) tradeoffs.push("Popular, so expect crowds at the main sights");
    if (destination.difficulty === "hard") tradeoffs.push("Physically demanding — needs fitness and acclimatisation");
    if (req.days < destination.averageStayDays)
      tradeoffs.push(`Most travellers spend ${destination.averageStayDays} days here — you'd be rushing`);
    if (usage > 0.9) tradeoffs.push("Uses almost all of your budget");

    scored.push({
      destination,
      score,
      cost,
      travelHours: route.hours,
      distanceKm,
      mode: route.mode,
      reasons,
      tradeoffs,
      components,
    });
  }

  scored.sort((a, b) => b.score - a.score);
  return { results: diversify(scored), rejected };
}

/** Keeps the ranking from returning six versions of the same trip. */
function diversify(list: ScoredDestination[]): ScoredDestination[] {
  const seenStates = new Map<string, number>();
  const out: ScoredDestination[] = [];
  const deferred: ScoredDestination[] = [];
  for (const item of list) {
    const count = seenStates.get(item.destination.state) ?? 0;
    if (count >= 2) {
      deferred.push(item);
      continue;
    }
    seenStates.set(item.destination.state, count + 1);
    out.push(item);
  }
  return [...out, ...deferred];
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

/* ------------------------------- Itinerary -------------------------------- */

export interface ItineraryDay {
  day: number;
  title: string;
  morning: string[];
  afternoon: string[];
  evening: string[];
  estimatedCost: number;
  notes: string[];
}

/**
 * Greedy day allocation: attractions are grouped by geographic cluster,
 * clusters are filled in order, and each day is capped at ~8 active hours.
 */
export function buildItinerary(
  destination: Destination,
  days: number,
  travelers: number,
  tier: "budget" | "comfort" | "luxury",
): ItineraryDay[] {
  const clusters = new Map<number, typeof destination.attractions>();
  for (const a of destination.attractions) {
    const list = clusters.get(a.cluster) ?? [];
    list.push(a);
    clusters.set(a.cluster, list);
  }
  const queue = [...clusters.keys()].sort((x, y) => x - y).flatMap((k) => clusters.get(k)!);

  const result: ItineraryDay[] = [];
  const dailyBase = destination.dailyCost[tier] * travelers;

  for (let day = 1; day <= days; day++) {
    const morning: string[] = [];
    const afternoon: string[] = [];
    const evening: string[] = [];
    const notes: string[] = [];
    let hours = 0;
    let fees = 0;

    if (day === 1) notes.push("Arrival day — keep the schedule light after the journey.");
    if (day === days && days > 1) notes.push("Departure day — leave a buffer before your return trip.");

    const capacity = day === 1 || (day === days && days > 1) ? 5 : 8;

    while (queue.length && hours < capacity) {
      const a = queue[0]!;
      if (hours + a.durationHours > capacity + 1) break;
      queue.shift();
      hours += a.durationHours;
      fees += a.entryFee * travelers;
      const slot = a.bestPartOfDay === "any" ? "afternoon" : a.bestPartOfDay;
      const line = `${a.name} · ${a.durationHours}h${a.entryFee ? ` · ${formatINR(a.entryFee)}/person` : " · free"}`;
      if (slot === "morning") morning.push(line);
      else if (slot === "evening") evening.push(line);
      else afternoon.push(line);
      if (a.note) notes.push(`${a.name}: ${a.note}`);
    }

    if (!morning.length && !afternoon.length && !evening.length) {
      afternoon.push("Free day — cafés, local markets or a return visit to your favourite spot");
      notes.push("You have more days than core sights; this is a good day to slow down.");
    }

    result.push({
      day,
      title: dayTitle(day, days, destination.name),
      morning,
      afternoon,
      evening,
      estimatedCost: Math.round(dailyBase * 0.86 + fees),
      notes,
    });
  }

  return result;
}

function dayTitle(day: number, days: number, name: string) {
  if (day === 1) return `Arrive in ${name}`;
  if (day === days && days > 1) return `Last morning in ${name}`;
  return `Day ${day} in ${name}`;
}

/* --------------------------- Natural language ----------------------------- */

const INTEREST_KEYWORDS: Record<string, Interest> = {
  mountain: "mountains",
  hill: "mountains",
  himalaya: "mountains",
  snow: "mountains",
  beach: "beaches",
  sea: "beaches",
  coast: "beaches",
  wildlife: "wildlife",
  safari: "wildlife",
  rhino: "wildlife",
  tiger: "wildlife",
  history: "history",
  heritage: "history",
  ruins: "history",
  temple: "spiritual",
  spiritual: "spiritual",
  peaceful: "nature",
  quiet: "offbeat",
  offbeat: "offbeat",
  hidden: "offbeat",
  photography: "photography",
  photo: "photography",
  food: "food",
  culture: "culture",
  adventure: "adventure",
  trek: "adventure",
  rafting: "adventure",
  nightlife: "nightlife",
  party: "nightlife",
  nature: "nature",
  forest: "nature",
  architecture: "architecture",
};

const STYLE_KEYWORDS: Record<string, TravelStyle> = {
  romantic: "romantic",
  honeymoon: "romantic",
  couple: "romantic",
  family: "family",
  kids: "family",
  luxury: "luxury",
  backpack: "backpacking",
  budget: "budget",
  cheap: "budget",
  relax: "relaxed",
  peaceful: "relaxed",
  adventure: "adventure",
};

export interface ParsedQuery {
  origin?: string;
  budget?: number;
  days?: number;
  travelers?: number;
  interests: Interest[];
  styles: TravelStyle[];
}

/**
 * Deterministic entity extraction for the homepage search box. The AI layer
 * later replaces this, but the extracted fields stay the same shape.
 */
export function parseQuery(input: string): ParsedQuery {
  const text = input.toLowerCase();
  const parsed: ParsedQuery = { interests: [], styles: [] };

  const budgetMatch: string[] =
    text.match(/(?:₹|rs\.?|inr)?\s*([\d,]+(?:\.\d+)?)\s*(k|thousand)?/g) ?? [];
  for (const raw of budgetMatch) {
    const numeric = Number(raw.replace(/[^\d.]/g, ""));
    if (!numeric) continue;
    const isK = /k|thousand/.test(raw);
    const value = isK ? numeric * 1000 : numeric;
    if (value >= 1500) {
      parsed.budget = Math.round(value);
      break;
    }
  }

  const dayMatch = text.match(/(\d+)\s*(?:-|\s)?\s*(?:day|days|nights?)/);
  if (dayMatch?.[1]) parsed.days = Number(dayMatch[1]);
  if (/weekend/.test(text) && !parsed.days) parsed.days = 3;

  const peopleMatch = text.match(/(\d+)\s*(?:people|persons|travellers|travelers|of us|friends)/);
  if (peopleMatch?.[1]) parsed.travelers = Number(peopleMatch[1]);
  if (/couple|two of us|for two/.test(text) && !parsed.travelers) parsed.travelers = 2;

  const fromMatch = text.match(/from\s+([a-z ]+?)(?:\s+for|\s+under|\s+with|\s+in|,|$)/);
  if (fromMatch?.[1]) {
    const guess = findOrigin(fromMatch[1].trim());
    if (guess) parsed.origin = guess.name;
  }
  if (!parsed.origin) {
    const named = ORIGINS.find((o) => text.includes(o.name.toLowerCase()));
    if (named) parsed.origin = named.name;
  }

  for (const [keyword, interest] of Object.entries(INTEREST_KEYWORDS)) {
    if (text.includes(keyword) && !parsed.interests.includes(interest)) parsed.interests.push(interest);
  }
  for (const [keyword, style] of Object.entries(STYLE_KEYWORDS)) {
    if (text.includes(keyword) && !parsed.styles.includes(style)) parsed.styles.push(style);
  }

  return parsed;
}

/* --------------------------------- Format --------------------------------- */

export function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h >= 24) return `${Math.round((hours / 24) * 10) / 10} days`;
  return m >= 10 ? `${h}h ${m}m` : `${h}h`;
}

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function monthName(month: number): string {
  return MONTHS[Math.min(11, Math.max(0, month - 1))] ?? "January";
}