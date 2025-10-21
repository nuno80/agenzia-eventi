import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";

import ProgramManager from "@/components/events/ProgramManager";
import dbInstance from "@/lib/db";
import { Event, Session, User } from "@/lib/schema";

const db = dbInstance(); // IMPORTANTE: Invocare la funzione per ottenere l'istanza

// Server Action per recuperare i dati del programma
async function getProgramData(eventId: string): Promise<{
  event: Event | null;
  sessions: (Session & { speaker?: User })[];
}> {
  try {
    // Converti eventId da stringa a numero per il database (INTEGER)
    const eventIdNum = parseInt(eventId, 10);
    
    // Recupera l'evento
    const event = db.query(
      /*sql*/ `
      SELECT * FROM events 
      WHERE id = ?
    `,
      [eventIdNum]
    ) as Event[];

    if (!event.length) {
      return { event: null, sessions: [] };
    }

    // Recupera le sessioni con i relativi speaker
    const sessions = db.query(
      /*sql*/ `
      SELECT 
        s.*,
        u.id as speaker_id,
        u.first_name as speaker_first_name,
        u.last_name as speaker_last_name,
        u.email as speaker_email
      FROM sessions s
      LEFT JOIN users u ON s.speaker_id = u.id
      WHERE s.event_id = ?
      ORDER BY s.start_time ASC
    `,
      [eventIdNum]
    ) as (Session & {
      speaker_id?: string;
      speaker_first_name?: string | null;
      speaker_last_name?: string | null;
      speaker_email?: string;
    })[];

    // Formatta i dati con conversione date
    const formattedSessions = sessions.map((session) => ({
      ...session,
      // Converti le stringhe date in oggetti Date
      startTime: new Date(session.start_time),
      endTime: new Date(session.end_time),
      createdAt: new Date(session.created_at),
      updatedAt: new Date(session.updated_at),
      speaker: session.speaker_id
        ? {
            id: session.speaker_id,
            firstName: session.speaker_first_name,
            lastName: session.speaker_last_name,
            email: session.speaker_email,
          }
        : null,
    }));

    return {
      event: event[0],
      sessions: formattedSessions,
    };
  } catch (error) {
    console.error("Failed to fetch program data:", error);
    throw new Error("Impossibile caricare i dati del programma");
  }
}

// Server Action per verificare se l'utente è admin dell'evento
async function isEventAdmin(eventId: string, userId: string): boolean {
  try {
    // Converti eventId da stringa a numero per il database (INTEGER)
    const eventIdNum = parseInt(eventId, 10);
    
    const adminCheck = db.query(
      /*sql*/ `
      SELECT 1 FROM event_admins 
      WHERE event_id = ? AND user_id = ?
      LIMIT 1
    `,
      [eventIdNum, userId]
    );

    return adminCheck.length > 0;
  } catch (error) {
    console.error("Failed to check admin status:", error);
    return false;
  }
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 🔥 Page-Level Protection Pattern (come da guida Clerk)
  const user = await currentUser();
  
  // 1. Check autenticazione
  if (!user) {
    redirect("/sign-in");
  }

  // 2. Check ruolo admin con currentUser()
  if (user?.publicMetadata?.role !== "admin") {
    redirect("/no-access");
  }

  // 3. In Next.js 15, params is a Promise that must be awaited
  const awaitedParams = await params;
  const id = awaitedParams.id;

  // 4. Check autorizzazione specifica evento (admin di questo evento)
  const isAdmin = await isEventAdmin(id, user.id);
  if (!isAdmin) {
    redirect("/no-access");
  }

  // 5. Recupera dati
  const { event, sessions } = await getProgramData(id);

  // 6. Se l'evento non esiste
  if (!event) {
    notFound();
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <Link
          href={`/admin/events/${id}`}
          className="mb-4 inline-flex items-center text-sm text-blue-600 transition-colors hover:text-blue-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Torna alla Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Gestione Programma</h1>
        <p className="mt-2 text-lg text-gray-600">{event.title}</p>
        <div className="mt-1 text-sm text-gray-500">
          {sessions.length} session{sessions.length === 1 ? "e" : "i"}{" "}
          configurat{sessions.length === 1 ? "a" : "e"}
        </div>
      </header>

      <main>
        <ProgramManager eventId={id} initialSessions={sessions} />
      </main>
    </div>
  );
}
