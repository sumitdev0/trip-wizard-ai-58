import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SiteFooter, SiteHeader } from "@/components/tripwise/SiteHeader";
import { ORIGINS } from "@/data/destinations";
import { getProfile, listTrips, updateProfile } from "@/lib/trips.functions";
import { useAuth } from "@/hooks/useAuth";
import { formatINR } from "@/lib/trip-engine";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Your profile — TripWise" },
      {
        name: "description",
        content: "Manage your TripWise display name and home city, and see your saved trip activity.",
      },
      { property: "og:title", content: "Your profile — TripWise" },
      { property: "og:description", content: "Your TripWise account details and travel activity." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();
  const fetchProfile = useServerFn(getProfile);
  const fetchTrips = useServerFn(listTrips);
  const save = useServerFn(updateProfile);
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({ queryKey: ["profile"], queryFn: () => fetchProfile() });
  const { data: trips = [] } = useQuery({ queryKey: ["saved-trips"], queryFn: () => fetchTrips() });

  const [displayName, setDisplayName] = useState("");
  const [homeCity, setHomeCity] = useState("");

  useEffect(() => {
    if (!profile) return;
    setDisplayName(profile.display_name ?? "");
    setHomeCity(profile.home_city ?? "");
  }, [profile]);

  const mutation = useMutation({
    mutationFn: () =>
      save({ data: { display_name: displayName || null, home_city: homeCity || null } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated.");
    },
    onError: () => toast.error("Could not update your profile."),
  });

  const totalPlanned = trips.reduce((sum, t) => sum + t.estimated_cost, 0);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl sm:text-4xl">Your profile</h1>
        <p className="mt-2 text-muted-foreground">
          Signed in as <span className="text-foreground">{user?.email}</span>
        </p>

        <form
          className="surface-card mt-8 space-y-5 p-6"
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate();
          }}
        >
          <div>
            <label htmlFor="displayName" className="mb-1.5 block text-sm font-medium">
              Display name
            </label>
            <input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="homeCity" className="mb-1.5 block text-sm font-medium">
              Home city
            </label>
            <input
              id="homeCity"
              list="profile-origins"
              value={homeCity}
              onChange={(e) => setHomeCity(e.target.value)}
              className={inputClass}
              placeholder="Used as your default starting point"
            />
            <datalist id="profile-origins">
              {ORIGINS.map((o) => (
                <option key={o.name} value={o.name} />
              ))}
            </datalist>
          </div>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="h-11 rounded-lg bg-primary px-6 font-medium text-primary-foreground disabled:opacity-60"
          >
            Save changes
          </button>
        </form>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat label="Saved trips" value={String(trips.length)} />
          <Stat label="Planned spend" value={formatINR(totalPlanned)} />
          <Stat
            label="Destinations"
            value={String(new Set(trips.map((t) => t.destination_id)).size)}
          />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";
