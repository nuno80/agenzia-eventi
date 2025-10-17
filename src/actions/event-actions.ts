"use server";

import { revalidatePath } from "next/cache";

import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { getDbInstance } from "@/lib/db";
const db = getDbInstance();
import { EVENT_STATUSES, EventFormData, EventFormSchema } from "@/lib/schema";

// Helper function per sincronizzare utenti Clerk con database locale
async function syncUserWithDatabase(clerkUser: any) {
  try {
    // Controlla se l'utente esiste già nel database
    const existingUser = db.query('SELECT id FROM users WHERE id = ?', [clerkUser.id]);
    
    if (existingUser.length === 0) {
      // Crea l'utente nel database locale
      db.execute(
        'INSERT INTO users (id, email, first_name, last_name, role) VALUES (?, ?, ?, ?, ?)',
        [
          clerkUser.id,
          clerkUser.emailAddresses[0]?.emailAddress || '',
          clerkUser.firstName || '',
          clerkUser.lastName || '',
          clerkUser.publicMetadata?.role || 'user'
        ]
      );
      console.log('✅ Utente sincronizzato con database:', clerkUser.id);
    }
  } catch (error) {
    console.error('❌ Errore sincronizzazione utente:', error);
    throw new Error('Impossibile sincronizzare l\'utente con il database');
  }
}

// Helper function per controlli admin
async function requireAdmin() {
  const user = await currentUser();
  if (!user) {
    return {
      success: false,
      error: "Non autorizzato. Effettua il login.",
      user: null,
    };
  }

  if (user.publicMetadata?.role !== "admin") {
    return {
      success: false,
      error: "Non autorizzato. Solo gli admin possono eseguire questa azione.",
      user: null,
    };
  }

  // Sincronizza l'utente con il database locale
  await syncUserWithDatabase(user);

  return {
    success: true,
    user,
    userId: user.id,
  };
}

// --- AZIONE: Creazione di un nuovo evento ---
export async function createEvent(formData: EventFormData) {
  // 1. Sicurezza: Autenticazione + Controllo admin role
  const authResult = await requireAdmin();
  if (!authResult.success) {
    return {
      success: false,
      error: authResult.error,
    };
  }

  const { userId } = authResult;

  // 3. Validazione dell'input con Zod
  const validatedFields = EventFormSchema.safeParse(formData);
  if (!validatedFields.success) {
    return {
      success: false,
      error: "Dati non validi. Controlla i campi e riprova.",
      details: validatedFields.error.issues,
    };
  }
  const data = validatedFields.data;

  // 4. Logica di business
  try {
    const result = db.execute(
      `
      INSERT INTO events (
        title, description, event_type, start_date, end_date, 
        location, max_participants, price, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `,
      [
        data.title,
        data.description || null,
        data.eventType,
        data.startDate.toISOString(),
        data.endDate.toISOString(),
        data.location,
        data.maxParticipants,
        data.price || 0,
        "draft",
      ]
    );

    const eventId = result.lastInsertRowid;

    // Aggiungi l'owner come admin dell'evento
    db.execute(
      `
      INSERT INTO event_admins (event_id, user_id, created_at)
      VALUES (?, ?, datetime('now'))
    `,
      [eventId, userId]
    );

    // 5. Azioni post-esecuzione
    revalidatePath("/admin/events");

    // Recupera l'evento creato per ritornarlo
    const createdEvent = db.query(
      `
      SELECT * FROM events WHERE id = ? LIMIT 1
    `,
      [eventId]
    )[0];

    return {
      success: true,
      data: createdEvent,
      message: "Evento creato con successo!",
    };
  } catch (error) {
    console.error("Failed to create event:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: "Errore del database: Impossibile creare l'evento.",
        details: error.message,
      };
    }

    return {
      success: false,
      error: "Impossibile creare l'evento. Riprova più tardi.",
    };
  }
}

// --- AZIONE: Recupero di tutti gli eventi per l'admin corrente ---
export async function getEvents() {
  const user = await currentUser();
  if (!user) {
    // Se l'utente non è autenticato, restituisce un array vuoto
    return [];
  }

  // Sincronizza l'utente se non esiste nel database
  await syncUserWithDatabase(user);

  try {
    // Query sicura che filtra gli eventi tramite la tabella di join `event_admins`
    const events = db.query(
      `
      SELECT 
        e.*,
        ea.created_at as admin_assigned_at,
        (
          SELECT COUNT(*) FROM sessions s WHERE s.event_id = e.id
        ) as speaker_count,
        (
          SELECT COUNT(*) FROM participants p WHERE p.event_id = e.id
        ) as participant_count
      FROM events e
      JOIN event_admins ea ON e.id = ea.event_id
      WHERE ea.user_id = ?
      ORDER BY e.start_date DESC
    `,
      [user.id]
    );

    return events;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw new Error("Impossibile recuperare gli eventi dal database.");
  }
}

// --- AZIONE: Recupero dati aggregati per la dashboard di un singolo evento ---
export async function getEventDashboardData(eventId: string) {
  // 1. Sicurezza: Autenticazione
  const user = await currentUser();
  if (!user) {
    return null;
  }

  const { userId } = user;

  // 2. Logica di business e accesso ai dati
  try {
    const events = db.query(
      `
      SELECT 
        e.*,
        (
          SELECT COUNT(*) FROM participants p WHERE p.event_id = e.id AND p.status = 'checked_in'
        ) as checked_in_count,
        (
          SELECT COUNT(*) as participant_total
          FROM participants p
          WHERE p.event_id = e.id
        ) as participant_total,
        (
          SELECT COUNT(*) as session_count
          FROM sessions s
          WHERE s.event_id = e.id
        ) as session_count,
        (
          SELECT SUM(b.budgeted_amount) as budgeted_total,
          COUNT(b.id) as budget_items_count
          FROM event_budgets b
          WHERE b.event_id = e.id
        ) as budgeted_total,
        (
          SUM(b.actual_amount) as spent_total
          FROM event_budgets b
          WHERE b.event_id = e.id
        ) as spent_total,
        (
          SELECT COUNT(*) as announcement_count
          FROM event_announcements ea
          WHERE ea.event_id = e.id
        ) as announcement_count,
        (
          SELECT COUNT(*) AS admin_count
          FROM event_admins ea
          WHERE ea.event_id = e.id
        ) as admin_count
      FROM events e
      WHERE e.id = ?
    `,
      [eventId]
    );

    const event = events[0];

    // Controlla che l'evento esista
    if (!event) {
      return null;
    }

    // 3. Costruzione dell'oggetto di risposta aggregato
    const dashboardData = {
      event: event,
      stats: {
        participants: {
          registered: event.participant_total,
          total: event.max_participants,
          checkedIn: event.checked_in_count,
        },
        speakers: {
          confirmed: 0, // TODO: Implementare dopo tabella speakers
          pending: 0,
        },
        sessions: {
          total: event.session_count,
          scheduled: 0, // TODO: Calcolare in base a status field
          completed: 0,
          cancelled: 0,
        },
        budget: {
          totalBudget: event.budgeted_total || 0,
          totalSpent: event.spent_total || 0,
          remaining: (event.budgeted_total || 0) - (event.spent_total || 0),
        },
        announcements: event.announcement_count,
        admins: event.admin_count,
      },
    };

    return dashboardData;
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    throw new Error(
      "Errore del database durante il recupero dei dati della dashboard."
    );
  }
}

// --- AZIONE: Aggiornamento stato evento ---
export async function updateEventStatus(
  eventId: string,
  status: (typeof EVENT_STATUSES)[number]
) {
  // 1. Sicurezza: Autenticazione + Controllo admin role
  const authResult = await requireAdmin();
  if (!authResult.success) {
    return { success: false, error: authResult.error };
  }

  const { userId } = authResult;

  // Verifica se l'utente è admin di questo evento
  const isAdmin = await db.query(
    `
    SELECT 1 FROM event_admins ea
    WHERE ea.event_id = ? AND ea.user_id = ?
    LIMIT 1
  `,
    [eventId, userId]
  );

  if (!isAdmin) {
    return {
      success: false,
      error: "Solo gli admin possono modificare questo evento.",
    };
  }

  try {
    const result = db.execute(
      `
      UPDATE events SET status = ?, updated_at = datetime('now')
      WHERE id = ?
    `,
      [status, eventId]
    );

    if (result.changes === 0) {
      return { success: false, error: "Evento non trovato." };
    }

    const event = db.query(
      `
      SELECT * FROM events WHERE id = ? LIMIT 1
    `,
      [eventId]
    )[0];

    revalidatePath(`/admin/events/${eventId}`);

    return {
      success: true,
      data: event,
    };
  } catch (error) {
    console.error("Failed to update event status:", error);
    return {
      success: false,
      error: "Impossibile aggiornare lo stato dell'evento.",
    };
  }
}

// --- AZIONE: Eliminazione evento ---
export async function deleteEvent(eventId: string) {
  // 1. Sicurezza: Autenticazione + Controllo admin role
  const authResult = await requireAdmin();
  if (!authResult.success) {
    return { success: false, error: authResult.error };
  }

  const { userId } = authResult;

  // Verifica se l'utente è admin di questo evento
  const isAdmin = db.query(
    `
    SELECT 1 FROM event_admins ea
    WHERE ea.event_id = ? AND ea.user_id = ?
    LIMIT 1
  `,
    [eventId, userId]
  );

  if (!isAdmin) {
    return {
      success: false,
      error: "Solo gli admin possono eliminare questo evento.",
    };
  }

  try {
    // Le foreign keys con ON DELETE CASCADE gestiranno la pulizia automatica
    db.execute("DELETE FROM events WHERE id = ?", [eventId]);

    revalidatePath("/admin/events");

    return {
      success: true,
      message: "Evento eliminato con successo.",
    };
  } catch (error) {
    console.error("Failed to delete event:", error);
    return {
      success: false,
      error: "Impossibile eliminare l'evento.",
    };
  }
}

// --- AZIONE: Duplicazione di un evento ---
export async function duplicateEvent(eventId: string) {
  // 1. Sicurezza: Autenticazione + Controllo admin role
  const authResult = await requireAdmin();
  if (!authResult.success) {
    return {
      success: false,
      error: authResult.error,
    };
  }

  const { userId } = authResult;

  // Verifica se l'utente è admin dell'evento originale
  const isAdmin = db.query(
    `
    SELECT 1 FROM event_admins ea
    WHERE ea.event_id = ? AND ea.user_id = ?
    LIMIT 1
  `,
    [eventId, userId]
  );

  if (!isAdmin) {
    return {
      success: false,
      error: "Solo gli admin possono duplicare questo evento.",
    };
  }

  try {
    // Recupera evento originale
    const originalEvents = db.query(
      `
      SELECT * FROM events WHERE id = ? LIMIT 1
    `,
      [eventId]
    );

    const originalEvent = originalEvents[0];
    if (!originalEvent) {
      return { success: false, error: "Evento non trovato." };
    }

    // Crea copia dell'evento
    const result = db.execute(
      `
      INSERT INTO events (
        title, description, event_type, location, start_date, end_date, 
        max_participants, price, status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `,
      [
        `${originalEvent.title} (Copia)`,
        originalEvent.description,
        originalEvent.event_type,
        originalEvent.location,
        originalEvent.start_date,
        originalEvent.end_date,
        originalEvent.max_participants,
        originalEvent.price,
        "draft",
      ]
    );

    const newEventId = result.lastInsertRowid;

    // Assegna il creator come admin all'evento copiato
    db.execute(
      `
      INSERT INTO event_admins (event_id, user_id, created_at)
      VALUES (?, ?, datetime('now'))
    `,
      [newEventId, userId]
    );

    revalidatePath("/admin/events");

    return {
      success: true,
      data: {
        eventId: newEventId,
        message: "Evento duplicato con successo!",
      },
    };
  } catch (error) {
    console.error("Failed to duplicate event:", error);
    return {
      success: false,
      error: "Impossibile duplicare l'evento.",
    };
  }
}

// --- AZIONE: Recupero eventi per ricerca/filtri ---
export async function searchEvents(
  params: z.infer<typeof import("@/lib/schema").EventSearchParams>
) {
  try {
    let query = `
      SELECT 
        e.*,
        (
          SELECT COUNT(*) FROM participants p WHERE p.event_id = e.id AND p.status = 'checked_in'
        ) as checked_in_count,
        (
          SELECT COUNT(*) FROM sessions s WHERE s.event_id = e.id
        ) as session_count,
        (
          SELECT COALESCE(SUM(b.budgeted_amount), 0) FROM event_budgets b WHERE b.event_id = e.id
        ) as budgeted_total,
        (
          SELECT COALESCE(SUM(b.actual_amount), 0) FROM event_budgets b WHERE b.event_id = e.id
        ) as spent_total
      FROM events e
    `;

    const conditions = [];
    const paramsArray = [];

    // Filtro di ricerca
    if (params.search) {
      conditions.push(`e.title LIKE ?`);
      paramsArray.push(`%${params.search}%`);
    }

    // Filtro per tipo evento
    if (params.eventType) {
      conditions.push(`e.event_type = ?`);
      paramsArray.push(params.eventType);
    }

    // Filtro per stato
    if (params.status) {
      conditions.push(`e.status = ?`);
      paramsArray.push(params.status);
    }

    // Filtro per date
    if (params.startDate) {
      conditions.push(`e.start_date >= ?`);
      paramsArray.push(params.startDate.toISOString());
    }

    if (params.endDate) {
      conditions.push(`e.end_date <= ?`);
      paramsArray.push(params.endDate.toISOString());
    }

    // Aggiungi condizioni WHERE se presenti
    if (conditions.length > 0) {
      query += ` WHERE ${conditions.join(" AND ")}`;
    }

    // Ordinamento
    query += ` ORDER BY e.start_date DESC`;

    const events = db.query(query, paramsArray);

    // Paginazione frontend
    const page = Number(params.page || 1);
    return events;
  } catch (error) {
    console.error("Failed to search events:", error);
    throw new Error("Impossibile recuperare gli eventi dalla ricerca.");
  }
}

// --- AZIONE: Recupero singolo evento per dettagli ---
export async function getEventById(eventId: string) {
  const user = await currentUser();
  if (!user) {
    return null;
  }

  try {
    const events = db.query(
      `
      SELECT e.*, 
        (
          SELECT COUNT(*) FROM participants p WHERE p.event_id = e.id
        ) as participant_count
      FROM events e
      WHERE e.id = ?
      LIMIT 1
    `,
      [eventId]
    );

    return events[0];
  } catch (error) {
    console.error("Failed to get event by ID:", error);
    return null;
  }
}

// --- AZIONE: Recupero sessioni per evento ---
export async function getEventSessions(
  eventId: string,
  includeSpeaker = false
) {
  try {
    let query = `
      SELECT 
        s.*`;

    if (includeSpeaker) {
      query += `,
        u.first_name || '' as speaker_first_name,
        u.last_name || '' as speaker_last_name,
        u.email as speaker_email`;
    }

    query += `
      FROM sessions s
      LEFT JOIN users u ON u.id = s.speaker_id
      WHERE s.event_id = ?
      ORDER BY s.start_time ASC
    `;

    const sessions = db.query(query, [eventId]);

    return sessions;
  } catch (error) {
    console.error("Failed to get event sessions:", error);
    throw new Error("Impossibile recuperare le sessioni dell'evento.");
  }
}

// --- AZIONE: Recupero partecipanti per evento ---
export async function getEventParticipants(
  eventId: string,
  status?: ParticipantStatus
) {
  try {
    let query = `
      SELECT 
        p.*,
        u.first_name || '' as participant_first_name,
        u.last_name || '' as participant_last_name,
        u.email as participant_email,
        p.registration_date,
        p.status
      FROM participants p
      LEFT JOIN users u ON u.id = p.user_id
      WHERE p.event_id = ?
    `;

    const params = [eventId];

    if (status) {
      query += ` AND p.status = ?`;
      params.push(status);
    }

    const participants = db.query(query, params);
    return participants;
  } catch (error) {
    console.error("Failed to get event participants:", error);
    throw new Error("Impossibile recuperare i partecipanti dell'evento.");
  }
}

// --- AZIONE: Verifica se evento può essere modificato da utente ---
export async function canUserEditEvent(eventId: string): Promise<boolean> {
  const user = await currentUser();
  if (!user) {
    return false;
  }

  const { userId } = user;

  try {
    const adminCheck = db.query(
      `
      SELECT 1
      FROM event_admins ea
      WHERE ea.event_id = ? AND ea.user_id = ?
      LIMIT 1
    `,
      [eventId, userId]
    );

    return adminCheck.length > 0;
  } catch (error) {
    console.error("Error checking edit permissions:", error);
    return false;
  }
}

// --- AZIONE: Verifica se utente può leggere evento ---
export async function canUserViewEvent(eventId: string): Promise<boolean> {
  const user = await currentUser();
  if (!user) {
    return false;
  }

  const { userId } = user;

  try {
    const checkAdmin = db.query(
      `
      SELECT 1 FROM event_admins ea
      WHERE ea.event_id = ? AND ea.user_id = ?
      LIMIT 1
    `,
      [eventId, userId]
    );

    return checkAdmin.length > 0;
  } catch (error) {
    console.error("Error checking view permissions:", error);
    return false;
  }
}

// --- AZIONE: Calcolo statistiche eventi admin dashboard ---
export async function getAdminStats() {
  // 1. Sicurezza: Autenticazione + Controllo admin role
  const authResult = await requireAdmin();
  if (!authResult.success) {
    return null;
  }

  try {
    const stats = db.query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(CASE WHEN e.status = 'draft') as draft_events,
        COUNT(CASE WHEN e.status = 'published') as published_events,
        COUNT(CASE WHEN e.status = 'in_progress') as in_progress_events,
        COUNT(CASE WHEN e.status = 'completed') as completed_events,
        COUNT(CASE WHEN e.status = 'cancelled') as cancelled_events,
        COUNT(CASE WHEN e.status = 'postponed') as postponed_events
      FROM events e
    `);

    return stats[0];
  } catch (error) {
    console.error("Failed to get admin stats:", error);
    return null;
  }
}
