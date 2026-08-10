import { formatINR, type CostBreakdown } from "@/lib/trip-engine";

const LABELS: [keyof CostBreakdown, string][] = [
  ["transport", "Long-distance transport (return)"],
  ["accommodation", "Accommodation"],
  ["food", "Food"],
  ["localTransport", "Local transport"],
  ["activities", "Activities"],
  ["entryFees", "Entry fees"],
  ["miscellaneous", "Miscellaneous"],
];

export function CostTable({ cost, travelers }: { cost: CostBreakdown; travelers: number }) {
  return (
    <div className="text-sm">
      <dl className="divide-y divide-border">
        {LABELS.map(([key, label]) => (
          <div key={key} className="flex items-center justify-between py-2">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-medium tabular-nums">{formatINR(cost[key])}</dd>
          </div>
        ))}
        <div className="flex items-center justify-between py-2">
          <dt className="text-muted-foreground">Emergency buffer (8%)</dt>
          <dd className="font-medium tabular-nums">{formatINR(cost.emergencyBuffer)}</dd>
        </div>
        <div className="flex items-center justify-between py-3">
          <dt className="font-display text-base font-semibold">Estimated total</dt>
          <dd className="font-display text-base font-semibold tabular-nums">{formatINR(cost.total)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-xs text-muted-foreground">
        {formatINR(cost.perPerson)} per person for {travelers} {travelers === 1 ? "traveller" : "travellers"}.
        Estimates, not quoted prices.
      </p>
    </div>
  );
}