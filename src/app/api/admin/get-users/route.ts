// src/app/api/admin/get-users/route.ts
import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs/server";

import { getDbInstance } from "@/lib/db";

const db = getDbInstance();

// Interfaccia per la risposta
interface SimplifiedUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string | null;
}

export async function GET() {
  // WHY: API route usa pattern corretto secondo guida
  // currentUser() è il modo corretto per accedere a publicMetadata in API routes

  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: "Non autorizzato: Login richiesto." },
      { status: 401 }
    );
  }

  // Controllo admin diretto con publicMetadata
  const isAdmin = user.publicMetadata?.role === "admin";

  if (!isAdmin) {
    console.warn(
      `Accesso API negato per get-users per l'utente ${user.id}. Ruolo: ${user.publicMetadata?.role}`
    );
    return NextResponse.json(
      { error: "Accesso negato: Privilegi insufficienti." },
      { status: 403 }
    );
  }

  try {
    console.log(`Admin ${user.id} autorizzato. Recupero lista utenti...`);

    // Verifica database connection
    if (!db) {
      console.error("Database instance non disponibile");
      return NextResponse.json(
        { error: "Errore di connessione al database" },
        { status: 500 }
      );
    }

    // Query utenti dal database locale (pattern consistente con event-actions.ts)
    const usersQuery = db.query(`
      SELECT 
        id,
        email,
        first_name,
        last_name,
        role,
        created_at
      FROM users 
      ORDER BY created_at DESC
    `);

    console.log(
      `Query result type: ${typeof usersQuery}, length: ${Array.isArray(usersQuery) ? usersQuery.length : "not array"}`
    );

    const users = usersQuery.map((row: any) => ({
      id: row.id,
      email: row.email,
      firstName: row.first_name, // WHY: SQLite non mappa correttamente gli alias, usa nomi originali
      lastName: row.last_name,
      role: row.role,
    }));

    console.log(`Recuperati ${users.length} utenti.`);
    console.log(`Sample user:`, users[0]);

    return NextResponse.json({ users });
  } catch (error: unknown) {
    console.error("Errore API nel caricare gli utenti:", error);
    let errorMessage =
      "Errore interno del server durante il caricamento degli utenti.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
