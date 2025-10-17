# Guida Completa: Middleware Clerk e Gestione Ruoli in Next.js

## 🎯 Scopo della Guida

Questa guida risolve il problema più comune con Clerk Next.js: **discrepanza tra i dati accessibili nel middleware vs nelle pagine** specialmente per i ruoli utente (RBAC).

---

## 🚨 Problema Principale

### Il Problema Fondamentale

```typescript
// Nelle pagine (funziona)
const user = await currentUser();
const isAdmin = user?.publicMetadata?.role === "admin"; // ✅ Funziona

// Nel middleware (NON funziona)
const { sessionClaims } = await auth();
const isAdmin = sessionClaims?.publicMetadata?.role === "admin"; // ❌ undefined
```

### Perché Succede?

- **`currentUser()`**: Ha accesso completo a tutti i metadati dell'utente
- **`sessionClaims`**: Contiene solo i dati inclusi nel JWT token (molto limitato)
- **Public Metadata**: Incluso in `currentUser()` ma spesso NON in `sessionClaims`
- **Sessione Browser**: Non include automaticamente public metadata nel token JWT

---

## 🔧 Soluzioni Implementate

### Soluzione 1: Page-Level Protection (RACCOMANDATA)

Delega il controllo dei ruoli alle pagine invece che al middleware:

```typescript
// middleware.ts - Semplice e affidabile
if (isAdminRoute(req)) {
  // Permetti il passaggio, la pagina farà il controllo
  return NextResponse.next();
}

// dashboard/page.tsx - Controlli completi
export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) {
    redirect("/sign-in");
  }
  
  // currentUser() ha accesso completo a publicMetadata
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin) {
    redirect("/no-access");
  }
  
  // ... contenuto dashboard
}
```

**✅ Vantaggi:**
- Funziona sempre con public metadata
- Codice più semplice e manutenibile
- Accesso a tutti i dati utente

---

## 👥 Sistema Multi-Ruoli Completo

### Definizione Ruoli

```typescript
// src/types/globals.d.ts
export type AppRole = "admin" | "manager" | "user";

declare global {
  interface CustomJwtSessionClaims {
    // Per token JWT template
    publicMetadata?: {
      role?: AppRole;
    };
  }
}
```

### Middleware Multi-Ruoli

```typescript
// src/middleware.ts
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isManagerRoute = createRouteMatcher(["/manager(.*)"]);
const isUserRoute = createRouteMatcher(["/dashboard"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (!userId && !isPublicRoute(req)) {
    const signInUrl = new URL("/sign-in", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Rotte Admin - delegation to page
  if (isAdminRoute(req)) {
    return NextResponse.next();
  }

  // Rotte Manager - delegation to page  
  if (isManagerRoute(req)) {
    return NextResponse.next();
  }

  return NextResponse.next();
});
```

### Pagina Admin

```typescript
// app/admin/page.tsx
export default async function AdminPage() {
  const user = await currentUser();
  
  if (!user) redirect("/sign-in");
  if (user?.publicMetadata?.role !== "admin") redirect("/no-access");
  
  return <div>Admin Dashboard</div>;
}
```

### Pagina Manager

```typescript
// app/manager/page.tsx  
export default async function ManagerPage() {
  const user = await currentUser();
  
  if (!user) redirect("/sign-in");
  
  // Manager può accedere anche admin (verifica gerarchica)
  const role = user?.publicMetadata?.role;
  if (role !== "admin" && role !== "manager") redirect("/no-access");
  
  return <div>Manager Dashboard</div>;
}
```

### Pagina Utente Base

```typescript
// app/dashboard/page.tsx
export default async function DashboardPage() {
  const user = await currentUser();
  
  if (!user) redirect("/sign-in");
  // Tutti gli utenti autenticati possono accedere
  
  const role = user?.publicMetadata?.role;
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Role: {role || "user"}</p>
      {role === "admin" && <AdminOnlySection />}
      {role === "manager" && <ManagerOnlySection />}
    </div>
  );
}
```

---

## 🛠️ Funzioni Helper Riutilizzabili

### Check Multi-Ruoli

```typescript
// utils/role-utils.ts
import { currentUser } from "@clerk/nextjs/server";

export type AppRole = "admin" | "manager" | "user";

export async function checkRole(requiredRole: AppRole): Promise<boolean> {
  const user = await currentUser();
  const role = user?.publicMetadata?.role;
  
  switch (requiredRole) {
    case "admin":
      return role === "admin";
    case "manager":
      return role === "admin" || role === "manager"; // Gerarchia
    case "user":
      return !!role; // Qualsiasi utente autenticato
    default:
      return false;
  }
}

export async function getCurrentUserRole(): Promise<AppRole | null> {
  const user = await currentUser();
  return user?.publicMetadata?.role || null;
}

export async function hasMinimumRole(minimumRole: AppRole): Promise<boolean> {
  const role = await getCurrentUserRole();
  
  const hierarchy = ["user", "manager", "admin"];
  const currentIndex = hierarchy.indexOf(minimumRole);
  const userIndex = role ? hierarchy.indexOf(role) : -1;
  
  return userIndex >= currentIndex;
}
```

### Uso nelle Pagine

```typescript
// app/some-protected-page/page.tsx
import { checkRole, hasMinimumRole } from "@/utils/role-utils";

export default async function ProtectedPage() {
  // Check singolo ruolo
  const isAdmin = await checkRole("admin");
  
  // Check gerarchico
  const canAccessManager = await hasMinimumRole("manager");
  
  if (!canAccessManager) {
    redirect("/no-access");
  }
  
  return <div>Content for managers and above</div>;
}
```

---

## 🔍 Troubleshooting Guida

### Problema: `public_metadata` non disponibile in sessionClaims

**Sintomi:**
```typescript
// Nella pagina mostra
currentUser().publicMetadata.role: "admin"
auth().sessionClaims.publicMetadata.role: undefined
```

**Cause:**
1. Sessione creata prima di aggiungere public metadata
2. Clerk non include public metadata nei token di sessione standard
3. Cache token scaduto

**Soluzioni:**
```bash
# 1. Logout completo e nuovo login
# 2. Cancella cookies del browser
# 3. Aspetta scadenza naturale della sessione (1 ora default)
```

### Problema: Middleware error "clerkMiddleware() not detected"

**Sintomi:**
```
Clerk: auth() was called but Clerk can't detect usage of clerkMiddleware()
```

**Cause:**
- Tentare di usare `currentUser()` nel middleware
- Middleware non configurato correttamente

**Soluzione:**
```typescript
// ❌ NON fare questo nel middleware
const user = await currentUser(); // ERRORE!

// ✅ USA auth() nel middleware  
const { sessionClaims } = await auth();

// ✅ USA currentUser() solo nelle pagine/server components
```

### Problema: Ruoli non funzionano dopo update su Clerk

**Sintomi:**
- Ruolo aggiornato in Clerk Dashboard
- Utente ancora vedo old role

**Soluzioni:**
1. **Logout e login completo**
2. **Attesa 5-10 minuti** per sincronizzazione Clerk
3. **Verifica di avere messo il ruolo in PUBLIC metadata**

---

## 📋 Checklist Pre-Sviluppo

### ✅ Configurazione Clerk Dashboard

1. **Vai a Users → Select User → Metadata**
2. **IMPORTANTE:** Usa **Public metadata**, non Private
   ```json
   {
     "role": "admin"  // o "manager", user"
   }
   ```
3. **Non usare Private metadata** per ruoli accessibili da frontend

### ✅ Check Rapido

Crea questa pagina di test per debug:

```typescript
// app/debug-roles/page.tsx
export default async function DebugRolesPage() {
  const user = await currentUser();
  
  return (
    <div>
      <h3>Role Check:</h3>
      <p>User ID: {user?.id}</p>
      <p>Role: {user?.publicMetadata?.role}</p>
      <p>Is Admin: {user?.publicMetadata?.role === "admin" ? "✅" : "❌"}</p>
    </div>
  );
}
```

### ✅ Pattern da Seguire

```typescript
// ✅ PATTERN CORRETTO
export default function ProtectedPage() {
  const user = await currentUser();
  
  // 1. Check autenticazione
  if (!user) redirect("/sign-in");
  
  // 2. Check ruolo con currentUser()
  const role = user?.publicMetadata?.role;
  if (role !== "admin") redirect("/no-access");
  
  // 3. Renderizza pagina
  return <AdminContent />;
}

// ❌ PATTERN ERRATO
export default function BadProtectedPage() {
  // Non fare проверки solo nel middleware!
  // Usa sempre currentUser() nelle pagine
}
```

---

## 🚀 Esempi Pratici Avanzati

### Componente Protetto Riutilizzabile

```typescript
// components/ProtectedRoute.tsx
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole: AppRole;
  fallback?: string;
}

export default async function ProtectedRoute({ 
  children, 
  requiredRole, 
  fallback = "/no-access" 
}: ProtectedRouteProps) {
  const user = await currentUser();
  
  if (!user) redirect("/sign-in");
  
  const role = user?.publicMetadata?.role;
  
  switch (requiredRole) {
    case "admin":
      if (role !== "admin") redirect(fallback);
      break;
    case "manager":
      if (!["admin", "manager"].includes(role!)) redirect(fallback);
      break;
    case "user":
      if (!role) redirect("/sign-in"); // Richiede solo autenticazione
      break;
  }
  
  return <>{children}</>;
}

// Uso:
export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}
```

### API Route Protected

```typescript
// app/api/admin/users/route.ts
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  const user = await currentUser();
  
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  if (user.publicMetadata?.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  
  // Logica admin...
  return Response.json({ users: [] });
}
```

---

## 📚 Riferimenti

- [Clerk: Session Claims](https://clerk.com/docs/reference/backend/session-state)
- [Clerk: Metadata](https://clerk.com/docs/users/sync-data)
- [Next.js: Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)

---

## ⚠️ Note Importanti

1. **Sempre usa Public metadata** per ruoli accessibili da frontend
2. **Non usare currentUser() nel middleware** - usa solo nelle pagine/components
3. **Page-level protection è più affidabile** che middleware-level per ruoli complessi
4. **Crea pagine di debug** per risolvere problemi rapidamente
5. **Testa con utenti reali** - non fidarti solo dell'ambiente di sviluppo

---

**Con questa guida, i problemi di autenticazione e ruoli in Clerk Next.js dovrebbero essere facilmente diagnosticati e risolti!** 🎯
