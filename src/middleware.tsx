// src/middleware.ts
import { NextResponse } from "next/server";

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";



const isPublicRoute = createRouteMatcher([
  //aggiungi qui la lista aggiornata delle pagine pubbliche
  "/",
  "/about",
  "/pricing",
  "/devi-autenticarti",
  "/no-access",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

const isAdminRoute = createRouteMatcher([
  //aggiungi qui le pagine accessibili solo agli admin
  "/admin(.*)",
  "/dashboard(.*)",
  "/api/admin/(.*)",
]);
const isAuthenticatedRoute = createRouteMatcher(["/features(.*)"]);
//aggiungi qui le pagine accessibili solo agli utenti registrati

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Per debug, puoi decommentare le seguenti righe per vedere i log
  //console.log("\n--- CLERK MIDDLEWARE DEBUG ---");
  //console.log(`[REQ] ${req.method} ${req.url}`);
  //console.log(`[AUTH] User ID: ${userId}`);

  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

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

  // Check admin routes - se sessionClaims non ha i metadati, permettiamo passare alla pagina
  // e la pagina stessa farà il controllo con currentUser() che ha accesso a publicMetadata
  if (isAdminRoute(req)) {
    // Per semplicità e affidabilità, lasciamo che la pagina stessa faccia il controllo admin
    // usando currentUser() che ha accesso completo a publicMetadata
    return NextResponse.next();
  }

  if (isAuthenticatedRoute(req)) {
    return NextResponse.next();
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
