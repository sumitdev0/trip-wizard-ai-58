import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  CreditCard,
  FileBarChart,
  Store,
  Tag,
  Bike,
  FileText,
  Mail,
  Info,
  ChevronDown,
  Search,
  MessageCircle,
  Bell,
  Pencil,
  Menu,
  X,
  Leaf,
  type LucideIcon,
} from "lucide-react";

export const Route = createFileRoute("/admin/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Grocery Admin" },
      {
        name: "description",
        content:
          "Manage your grocery admin account profile, personal information and address details.",
      },
      { property: "og:title", content: "My Profile — Grocery Admin" },
      {
        property: "og:description",
        content: "Grocery e-commerce admin dashboard profile page.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: AdminProfilePage,
});

type NavEntry = {
  label: string;
  icon: LucideIcon;
  sub?: string[];
};

const NAV: NavEntry[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingBag, sub: ["All Orders", "Pending", "Completed"] },
  { label: "E-commerce", icon: ShoppingCart, sub: ["Products", "Inventory", "Categories"] },
  { label: "Transactions", icon: CreditCard },
  { label: "Reports", icon: FileBarChart },
  { label: "Vendor Management", icon: Store },
  { label: "Promotions", icon: Tag },
  { label: "Riders Management", icon: Bike },
  { label: "Pages", icon: FileText, sub: ["Landing", "About", "FAQ"] },
  { label: "Contact", icon: Mail },
  { label: "About", icon: Info },
];

const AVATAR_URL = "https://randomuser.me/api/portraits/men/32.jpg";

function AdminProfilePage() {
  const [today, setToday] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setToday(
      new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
    );
  }, []);

  return (
    <div className="min-h-screen bg-admin-bg font-admin text-admin-text">
      <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="lg:pl-64">
        <TopBar date={today || "Tuesday, 18 July"} onMenu={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
          <h1 className="font-admin text-2xl font-semibold text-admin-green">My Profile</h1>

          <ProfileHeaderCard />

          <InfoCard
            title="Personal Information"
            editVariant="orange"
            fields={[
              { label: "First Name", value: "Sobuj" },
              { label: "Last Name", value: "Ahmed" },
              { label: "Date of Birth", value: "12 May 1990" },
              { label: "Email Address", value: "sobuj.ahmed@example.com" },
              { label: "Phone Number", value: "+44 7700 900123" },
              { label: "User Role", value: "Admin" },
            ]}
          />

          <InfoCard
            title="Address"
            editVariant="white"
            fields={[
              { label: "Country", value: "United Kingdom" },
              { label: "City", value: "Leeds" },
              { label: "Postal Code", value: "LS1 4AP" },
            ]}
          />
        </main>
      </div>
    </div>
  );
}

/* ------------------------------- Sidebar ------------------------------- */

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [expanded, setExpanded] = useState<string | null>("Orders");

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-64 flex-col bg-admin-card shadow-lg transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="flex h-16 items-center gap-2.5 bg-admin-green px-5 text-white">
          <Leaf className="h-7 w-7" strokeWidth={2.2} />
          <span className="text-xl font-bold tracking-tight">grocery</span>
          <button
            className="ml-auto text-white/80 lg:hidden"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {NAV.map((entry) => {
              const Icon = entry.icon;
              const isExpanded = expanded === entry.label;
              const active = entry.label === "Dashboard";
              return (
                <li key={entry.label}>
                  <button
                    onClick={() =>
                      entry.sub && setExpanded(isExpanded ? null : entry.label)
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      active
                        ? "bg-admin-green-soft text-admin-green"
                        : "text-admin-text hover:bg-admin-green-soft/60 hover:text-admin-green"
                    }`}
                  >
                    <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
                    <span className="text-left">{entry.label}</span>
                    {entry.sub && (
                      <ChevronDown
                        className={`ml-auto h-4 w-4 text-admin-muted transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>
                  {entry.sub && isExpanded && (
                    <ul className="mt-1 mb-1 space-y-0.5 border-l border-admin-border pl-9">
                      {entry.sub.map((s) => (
                        <li key={s}>
                          <button className="w-full rounded-lg px-3 py-2 text-[13px] text-admin-muted transition-colors hover:bg-admin-green-soft/60 hover:text-admin-green">
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

/* ------------------------------- Top bar ------------------------------- */

function TopBar({ date, onMenu }: { date: string; onMenu: () => void }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 pb-0">
      <div className="flex items-center gap-3 rounded-full bg-admin-green px-4 py-2.5 text-white shadow-md sm:gap-5 sm:px-6 sm:py-3">
        <button
          className="text-white/90 lg:hidden"
          onClick={onMenu}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-full rounded-full bg-white/15 pl-10 pr-4 text-sm text-white placeholder:text-white/60 focus:bg-white/25 focus:outline-none"
          />
        </div>

        {/* Date */}
        <span className="hidden whitespace-nowrap text-sm font-medium text-white/90 sm:inline">
          {date}
        </span>

        {/* Action buttons */}
        <div className="ml-auto flex items-center gap-2.5">
          <IconButton label="Messages">
            <MessageCircle className="h-[18px] w-[18px]" />
          </IconButton>
          <IconButton label="Notifications">
            <Bell className="h-[18px] w-[18px]" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function IconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      aria-label={label}
      className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-white transition-colors hover:bg-white/25"
    >
      {children}
      <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-admin-badge ring-2 ring-admin-green" />
    </button>
  );
}

/* ------------------------------- Cards ------------------------------- */

function ProfileHeaderCard() {
  return (
    <section className="flex flex-col items-start gap-5 rounded-2xl bg-admin-card p-6 shadow-sm sm:flex-row sm:items-center sm:p-7">
      <img
        src={AVATAR_URL}
        alt="Sobuj Ahmed"
        className="h-20 w-20 rounded-2xl object-cover shadow-sm sm:h-24 sm:w-24"
      />
      <div className="min-w-0 flex-1">
        <h2 className="font-admin text-xl font-bold text-admin-green sm:text-2xl">Sobuj Ahmed</h2>
        <p className="mt-0.5 text-sm font-medium text-admin-muted">Admin</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-admin-muted">
          <Info className="h-4 w-4" />
          Leeds, United Kingdom
        </p>
      </div>
      <EditButton variant="white" />
    </section>
  );
}

type Field = { label: string; value: string };

function InfoCard({
  title,
  fields,
  editVariant,
}: {
  title: string;
  fields: Field[];
  editVariant: "orange" | "white";
}) {
  return (
    <section className="rounded-2xl bg-admin-card p-6 shadow-sm sm:p-7">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-admin text-lg font-semibold text-admin-green">{title}</h3>
        <EditButton variant={editVariant} />
      </div>
      <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((f) => (
          <div key={f.label}>
            <p className="text-xs font-medium uppercase tracking-wide text-admin-muted">
              {f.label}
            </p>
            <p className="mt-1.5 text-sm font-semibold text-admin-text">{f.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function EditButton({ variant }: { variant: "orange" | "white" }) {
  const base =
    "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-colors";
  if (variant === "orange") {
    return (
      <button className={`${base} bg-admin-orange text-white hover:brightness-95`}>
        <Pencil className="h-3.5 w-3.5" />
        Edit
      </button>
    );
  }
  return (
    <button
      className={`${base} border border-admin-border bg-admin-card text-admin-green hover:bg-admin-green-soft`}
    >
      <Pencil className="h-3.5 w-3.5" />
      Edit
    </button>
  );
}
