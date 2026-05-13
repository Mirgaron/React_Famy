import { redirect } from "next/navigation";

export default function DashboardLayout() {
  // Redirect old dashboard routes to new mobile routes
  redirect("/dashboard");
}