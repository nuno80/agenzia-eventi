import { NextRequest, NextResponse } from "next/server";

import { auth } from "@clerk/nextjs/server";

import dbInstance from "@/lib/db";

const db = dbInstance(); // IMPORTANTE: Invocare la funzione per ottenere l'istanza

export async function DELETE(
  request: NextRequest,
  context: { params: { sessionId: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Autenticazione richiesta" },
        { status: 401 }
      );
    }

    const sessionId = context.params.sessionId;

    // Recupera la sessione e verifica i permessi
    const session = db.query(
      /*sql*/ `
      SELECT s.event_id 
      FROM sessions s
      WHERE s.id = ?
      LIMIT 1
    `,
      [sessionId]
    );

    if (!session.length) {
      return NextResponse.json(
        { error: "Sessione non trovata" },
        { status: 404 }
      );
    }

    const eventId = session[0].event_id;

    // Verifica che l'utente sia admin dell'evento
    const isAdmin = db.query(
      /*sql*/ `
      SELECT 1 FROM event_admins ea
      WHERE ea.event_id = ? AND ea.user_id = ?
      LIMIT 1
    `,
      [eventId, userId]
    );

    if (!isAdmin.length) {
      return NextResponse.json({ error: "Accesso negato" }, { status: 403 });
    }

    // Elimina la sessione
    const result = db.execute(
      /*sql*/ `
      DELETE FROM sessions 
      WHERE id = ?
    `,
      [sessionId]
    );

    if (result.changes === 0) {
      return NextResponse.json(
        { error: "Impossibile eliminare la sessione" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Sessione eliminata con successo" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete session error:", error);
    return NextResponse.json(
      { error: "Errore durante l'eliminazione della sessione" },
      { status: 500 }
    );
  }
}
