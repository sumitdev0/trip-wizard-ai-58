import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Compass, LogOut, Sparkles, UserRound } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ThemeToggle } from "@/components/tripwise/ThemeToggle";

export function SiteHeader() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Compass className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="font-display text-xl font-semibold tracking-tight">TripWise</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm">
          <Link to="/destinations" className={navLink} activeProps={{ className: navLinkActive }}>
            Destinations
          </Link>
          <Link to="/chat" className={navLink} activeProps={{ className: navLinkActive }}>
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-accent" aria-hidden="true" /> AI planner
            </span>
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/trips" className={navLink} activeProps={{ className: navLinkActive }}>
                My trips
              </Link>
              <Link
                to="/profile"
                className={navLink}
                activeProps={{ className: navLinkActive }}
                title={user?.email ?? "Profile"}
              >
                <span className="inline-flex items-center gap-1.5">
                  <UserRound className="h-4 w-4 text-accent" aria-hidden="true" /> Profile
                </span>
              </Link>
              <button onClick={handleSignOut} className={navLink} type="button">
                <span className="inline-flex items-center gap-1.5">
                  <LogOut className="h-4 w-4" aria-hidden="true" /> Sign out
                </span>
              </button>
            </>
          ) : (
            <Link to="/auth" className={navLink} activeProps={{ className: navLinkActive }}>
              Sign in
            </Link>
          )}
          <Link
            to="/plan"
            className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Plan a trip
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

const navLink =
  "rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";
const navLinkActive = "rounded-md px-3 py-2 bg-secondary text-foreground";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-sand">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        <p className="max-w-2xl">
          All costs on TripWise are transparent estimates calculated from distance, travel style and
          typical on-ground spending. They are not quoted prices and should be verified before booking.
        </p>
        <p className="mt-4">© {new Date().getFullYear()} TripWise</p>
      </div>
    </footer>
  );
}
