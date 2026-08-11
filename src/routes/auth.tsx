import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SiteFooter, SiteHeader } from "@/components/tripwise/SiteHeader";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — TripWise" },
      {
        name: "description",
        content:
          "Sign in to TripWise to save trip plans, revisit itineraries and compare options across devices.",
      },
      { property: "og:title", content: "Sign in — TripWise" },
      {
        property: "og:description",
        content: "Save, revisit and compare your budget-first trip plans on any device.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sentConfirmation, setSentConfirmation] = useState(false);

  useEffect(() => {
    if (!loading && isAuthenticated) navigate({ to: "/trips", replace: true });
  }, [loading, isAuthenticated, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: displayName || email.split("@")[0] },
          },
        });
        if (error) throw error;
        if (!data.session) {
          setSentConfirmation(true);
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setBusy(false);
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    setBusy(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-md flex-col px-4 py-16">
        <h1 className="text-3xl">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Save trip plans, revisit itineraries and compare options from any device.
        </p>

        {sentConfirmation ? (
          <div className="surface-card mt-8 p-6">
            <h2 className="text-lg">Check your email</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We sent a confirmation link to {email}. Click it to finish creating your account.
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="surface-card mt-8 space-y-4 p-6">
              {mode === "signup" && (
                <div>
                  <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                    Display name
                  </label>
                  <input
                    id="name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className={inputClass}
                    autoComplete="name"
                  />
                </div>
              )}
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  autoComplete="email"
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClass}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="h-11 w-full rounded-lg bg-primary font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {mode === "signin" ? "Sign in" : "Create account"}
              </button>
            </form>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="mt-4 h-11 w-full rounded-lg border border-border bg-card font-medium transition-colors hover:bg-secondary disabled:opacity-60"
            >
              Continue with Google
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="mt-6 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {mode === "signin"
                ? "New to TripWise? Create an account"
                : "Already have an account? Sign in"}
            </button>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent";
