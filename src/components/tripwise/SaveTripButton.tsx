import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { BookmarkPlus, Check } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { saveTrip } from "@/lib/trips.functions";
import type { ScoredDestination, TripRequest } from "@/lib/trip-engine";

export function SaveTripButton({
  result,
  request,
}: {
  result: ScoredDestination;
  request: TripRequest;
}) {
  const { isAuthenticated } = useAuth();
  const save = useServerFn(saveTrip);
  const queryClient = useQueryClient();
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  if (!isAuthenticated) {
    return (
      <Link
        to="/auth"
        className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary"
      >
        <BookmarkPlus className="h-4 w-4" aria-hidden="true" /> Sign in to save
      </Link>
    );
  }

  async function handleSave() {
    setState("saving");
    try {
      await save({
        data: {
          title: `${result.destination.name} from ${request.origin}`,
          destination_id: result.destination.id,
          destination_name: result.destination.name,
          origin: request.origin,
          budget: Math.round(request.budget),
          days: request.days,
          travelers: request.travelers,
          month: request.month,
          interests: request.interests,
          styles: request.styles,
          estimated_cost: Math.round(result.cost.total),
          score: Math.round(result.score),
          notes: null,
          plan: {
            cost: result.cost,
            reasons: result.reasons,
            tradeoffs: result.tradeoffs,
            mode: result.mode,
            travelHours: result.travelHours,
            distanceKm: result.distanceKm,
            state: result.destination.state,
          },
        },
      });
      await queryClient.invalidateQueries({ queryKey: ["saved-trips"] });
      setState("saved");
      toast.success("Trip saved to your account.");
    } catch (error) {
      setState("idle");
      toast.error(error instanceof Error ? error.message : "Could not save this trip.");
    }
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={state !== "idle"}
      className="inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-70"
    >
      {state === "saved" ? (
        <>
          <Check className="h-4 w-4 text-accent" aria-hidden="true" /> Saved
        </>
      ) : (
        <>
          <BookmarkPlus className="h-4 w-4" aria-hidden="true" />{" "}
          {state === "saving" ? "Saving…" : "Save trip"}
        </>
      )}
    </button>
  );
}
