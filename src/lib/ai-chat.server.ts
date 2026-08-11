/** Server-only helpers for the TripWise AI planning chat. */
import { ORIGINS, INTEREST_OPTIONS, STYLE_OPTIONS } from "@/data/destinations";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const SYSTEM_PROMPT = `You are TripWise's travel planning assistant for trips within India.

Your job is to collect the traveller's hard constraints through a short, friendly conversation, then hand them to TripWise's deterministic engine. You never invent prices, distances or destinations — the app computes those.

Collect: starting city, total budget in INR, number of days, number of travellers, travel month, interests and travel style.

Rules:
- Ask at most TWO short follow-up questions per reply, and only for information you still genuinely need.
- Keep replies under 70 words, warm and concrete.
- Once you know at least the starting city, budget and days, stop asking and emit the plan block.
- The plan block is a fenced code block tagged \`plan\` containing ONLY JSON:

\`\`\`plan
{"origin":"Kolkata","budget":20000,"days":4,"travelers":2,"month":11,"interests":["mountains"],"styles":["budget"],"transport":["train","bus","flight","car"],"maxTravelHours":16}
\`\`\`

- Before the block, write one short sentence like "Here's what fits your constraints:". Never list destinations or costs yourself.
- Valid starting cities: ${ORIGINS.map((o) => o.name).join(", ")}. If the user names another city, pick the nearest one from this list and say so.
- Valid interests: ${INTEREST_OPTIONS.join(", ")}.
- Valid styles: ${STYLE_OPTIONS.join(", ")}.
- month is 1-12, maxTravelHours between 4 and 40, transport a subset of train, bus, flight, car.`;

export async function callGateway(messages: ChatMessage[]): Promise<string> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet.");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "google/gemini-3.5-flash",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (res.status === 429) throw new Error("Too many requests right now — try again in a moment.");
  if (res.status === 402) throw new Error("AI credits are exhausted. Add credits to keep planning.");
  if (!res.ok) throw new Error(`AI request failed (${res.status}).`);

  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content ?? "Sorry, I didn't catch that. Could you rephrase?";
}
