// src/middleware.ts
// WHY: Middleware configurato secondo guida Clerk - page-level protection pattern
// Delega controllo ruoli alle pagine invece di sessionClaims
import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  // Rotte pubbliche accessibili senza autenticazione
  "/",
  "/about",
  "/pricing",
  "/devi-autenticarti",
  "/no-access",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/debug-db(.*)",
  "/api/test-db(.*)",
  "/debug-roles(.*)",
  "/test-program(.*)",
  "/test-program-simple(.*)",
]);

const isAdminRoute = createRouteMatcher([
  // Rotte admin - delega controllo ruoli alla pagina con currentUser()
  "/admin", // Solo la pagina principale admin, non le subroute
  "/api/admin/(.*)", // API routes admin
]);

const isAuthenticatedRoute = createRouteMatcher([
  // Rotte per utenti autenticati
  "/dashboard(.*)",
  "/user-dashboard(.*)",
  "/features(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // 1. Rotte pubbliche - accesso libero
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // 2. Utente non autenticato su rotte protette - redirect
  if (!userId) {
    if (req.url.startsWith("/api")) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set(
      "redirect_url",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(signInUrl);
  }

  // 3. Rotte admin - DELEGA controllo ruoli alla pagina
  // WHY: Segue pattern guida che usa currentUser() invece di sessionClaims
  // currentUser() ha accesso completo a publicMetadata
  if (isAdminRoute(req)) {
    // La pagina farà il controllo con currentUser() nei server components
    return NextResponse.next();
  }

  // 4. Rotte autenticate - permetti passaggio
  if (isAuthenticatedRoute(req)) {
    return NextResponse.next();
  }

  // 5. Default - permetti passaggio
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
