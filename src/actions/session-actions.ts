"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@clerk/nextjs/server";

import dbInstance from "@/lib/db";
const db = dbInstance;
import { Session, SessionFormData, SessionFormSchema } from "@/lib/schema";

// --- AZIONE: Creazione di una nuova sessione per un evento ---
export async function createSession(
  eventId: string,
  formData: SessionFormData
): Promise<{
  success: boolean;
  data?: { sessionId: number };
  error?: string;
  errorCode?: string;
}> {
  // 1. Autenticazione e Autorizzazione
  const { userId } = await auth();
  if (!userId) {
    return { success: false, error: "Non autorizzato." };
  }

  // 2. Controllo se l'utente è admin di questo specifico evento
  const isAdmin = db.query(
    `
    SELECT 1 FROM event_admins ea
    WHERE ea.event_id = ? AND ea.user_id = ?
    LIMIT 1
  `,
    [eventId, userId]
  );

  if (!isAdmin) {
    return { success: false, error: "Accesso negato a questo evento." };
  }

  // 3. Validazione
  try {
    const validatedFields = SessionFormSchema.safeParse(formData);
    if (!validatedFields.success) {
      return {
        success: false,
        error: "Dati del form non validi.",
        details: validatedFields.error.issues,
      };
    }

    const data = validatedFields.data;

    // 4. Logica di Business: Controllo Conflitto Relatore
    if (data.speakerId) {
      const existingSession = db.query(
        `
        SELECT s.id, s.start_time, s.end_time
        FROM sessions s
        WHERE s.speaker_id = ? 
          AND (
            (s.start_time < ?) AND
            (s.end_time > ?)
          )
        LIMIT 1
      `,
        [data.endTime.toISOString(), data.startTime.toISOString()]
      );

      if (existingSession.length > 0) {
        return {
          success: false,
          error:
            "Conflitto di programmazione: il relatore è già occupato in questo orario.",
          errorCode: "SPEAKER_CONFLICT",
        };
      }
    }

    // 5. Creazione nel database
    const result = db.execute(
      `
      INSERT INTO sessions (
        title, description, start_time, end_time, room, speaker_id, event_id, created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `,
      [
        data.title,
        data.description || null,
        data.startTime.toISOString(),
        data.endTime.toISOString(),
        data.room || null,
        data.speakerId || null,
        eventId,
      ]
    );

    // 6. Azioni post-esecuzione
    revalidatePath(`/admin/events/${eventId}/program`);

    return {
      success: true,
      data: { sessionId: result.lastInsertRowid },
    };
  } catch (error) {
    console.error("Failed to create session:", error);

    if (error instanceof Error) {
      if (error.message.includes("UNIQUE constraint failed")) {
        return {
          success: false,
          error:
            "Conflitto di programmazione: il relatore è già occupato in questo orario.",
          errorCode: "SESSION_CONFLICT",
        };
      } else if (error.message.includes("NOT NULL constraint failed")) {
        return {
          success: false,
          error: "Sessione già esiste per questo evento.",
        };
      } else if (error.message.includes("FOREIGN KEY constraint failed")) {
        return {
          success: false,
          error:
            "Violazione del database. Controllare che tutte le foreign keys siano correttamente configurate.",
        };
      } else {
        return { success: false, error: "Impossibile creare la sessione." };
      }
    }

    return {
      success: false,
      error: "Impossibile salvare la sessione.",
    };
  }
}

// --- AZIONE: Aggiornamento stato sessione ---
export async function updateSession(): Promise<{
  success: boolean;
  data?: Session;
  error?: string;
}> {
  // TODO: Implementare updateSession correttamente
  return {
    success: false,
    error: "Funzione updateSession in sviluppo.",
  };
}
