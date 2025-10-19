"use server";
// NOTA: Questo file è server-only. Contiene funzioni helper per gestione ruoli.

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type AppRole = "admin" | "manager" | "user";

// WHY: Funzioni helper per validazione ruoli seguendo pattern guida
// currentUser() è il modo corretto per accedere a publicMetadata

/**
 * Controlla se l'utente attuale ha un ruolo specifico
 */
export async function checkRole(requiredRole: AppRole): Promise<boolean> {
  const user = await currentUser();
  const role = user?.publicMetadata?.role as AppRole | undefined;
  
  switch (requiredRole) {
    case "admin":
      return role === "admin";
    case "manager":
      return role === "admin" || role === "manager"; // Gerarchia: admin può accedere anche manager
    case "user":
      return !!role; // Qualsiasi utente autenticato con almeno ruolo "user"
    default:
      return false;
  }
}

/**
 * Ottiene il ruolo dell'utente attuale
 */
export async function getCurrentUserRole(): Promise<AppRole | null> {
  const user = await currentUser();
  return (user?.publicMetadata?.role as AppRole) || null;
}

/**
 * Verifica se l'utente ha almeno un livello di ruolo minimo (hierarchy)
 */
export async function hasMinimumRole(minimumRole: AppRole): Promise<boolean> {
  const role = await getCurrentUserRole();
  
  const hierarchy: AppRole[] = ["user", "manager", "admin"];
  const currentIndex = hierarchy.indexOf(minimumRole);
  const userIndex = role ? hierarchy.indexOf(role) : -1;
  
  return userIndex >= currentIndex;
}

/**
 * Helper richiede autenticazione e ruolo specifico (redirect automatico)
 * WHY: Simplifica la logica di protezione pagina
 */
export async function requireAuthAndRole(requiredRole: AppRole = "user"): Promise<void> {
  const user = await currentUser();
  
  // 1. Check autenticazione
  if (!user) {
    redirect("/sign-in");
    return; // TypeScript richiede return dopo redirect
  }
  
  // 2. Check ruolo
  const hasRole = await checkRole(requiredRole);
  if (!hasRole) {
    redirect("/no-access");
    return;
  }
}

/**
 * Helper richiede solo autenticazione senza controllo ruolo
 */
export async function requireAuth(): Promise<void> {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
}

/**
 * Helper richiede ruolo admin
 */
export async function requireAdmin(): Promise<void> {
  await requireAuthAndRole("admin");
}

/**
 * Helper che verifica se utente è admin senza fare redirect
 * Utile per API che hanno bisogno di risposte custom
 */
export async function isAdminUser(): Promise<boolean> {
  return await checkRole("admin");
}
