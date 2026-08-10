import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-primary">
          <Compass className="h-5 w-5 text-accent" aria-hidden="true" />
          <span className="font-display text-xl font-semibold tracking-tight">TripWise</span>
        </Link>
        <nav aria-label="Main" className="flex items-center gap-1 text-sm">
          <Link
            to="/destinations"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            activeProps={{ className: "rounded-md px-3 py-2 bg-secondary text-foreground" }}
          >
            Destinations
          </Link>
          <Link
            to="/plan"
            className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Plan a trip
          </Link>
        </nav>
      </div>
    </header>
  );
}

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