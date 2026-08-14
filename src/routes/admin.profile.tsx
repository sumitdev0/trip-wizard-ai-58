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
      <div className="flex">
        <Sidebar mobileOpen={mobileMobileClosePlaceholder} />
      </div>
    </div>
  );
}
