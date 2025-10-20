import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";

import { Navbar } from "@/components/navbar";

import AdminUserManagementClient from "./admin-user-management-client";

export default async function AdminUserManagement() {
  // 1. Check autenticazione
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }

  // 2. Check ruolo admin - Pattern conforme alla guida
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin) {
    redirect("/no-access");
  }

  // 3. Passa al client component per gestione interattiva
  return (
    <div className="dashboard-container">
      <Navbar />
      <AdminUserManagementClient />
    </div>
  );
}
