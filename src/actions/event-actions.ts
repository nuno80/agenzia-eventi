"use server";

import { revalidatePath } from "next/cache";

import { currentUser } from "@clerk/nextjs/server";
import { z } from "zod";

import { getDbInstance } from "@/lib/db";
const db = getDbInstance();
import { EVENT_STATUSES, EventFormData, EventFormSchema } from "@/lib/schema";
import { isAdminUser } from "@/lib/auth/role-utils";

// --- AZIONE: Recupero dati completi dashboard singolo evento ---
export async function getEventDashboardData(eventId: string) {
  // 1. Sicurezza: Autenticazione + Autorizzazione 
  const user = await currentUser();
  
  if (!user) {
    return null;
  }
  
  // 2. Check autorizzazione admin
  if (user.publicMetadata?.role !== "admin") {
    return null;
  }
  
  const { userId } = user;

  try {
    // Query evento principale
    const eventQuery = db.query(`
      SELECT 
        id,
        title,
        description,
        event_type,
        location,
        start_date,
        end_date,
        max_participants,
        status,
        created_at,
        updated_at
      FROM events 
      WHERE id = ?
    `, [eventId]);

    if (eventQuery.length === 0) {
      return null;
    }

    const event = eventQuery[0];

    // Query statistiche partecipanti
    const participantStats = db.query(`
      SELECT 
        COUNT(*) as total_participants,
        SUM(CASE WHEN status = 'checked_in' THEN 1 ELSE 0 END) as checked_in,
        SUM(CASE WHEN status = 'registered' THEN 1 ELSE 0 END) as registered_only
      FROM participants 
      WHERE event_id = ?
    `, [eventId]);

    // Query statistiche sessioni
    const sessionStats = db.query(`
      SELECT 
        COUNT(*) as total_sessions,
        SUM(CASE WHEN speaker_id IS NOT NULL THEN 1 ELSE 0 END) as confirmed_sessions,
        SUM(CASE WHEN date(start_time) = date('now') THEN 1 ELSE 0 END) as sessions_today,
        SUM(CASE WHEN start_time > datetime('now') THEN 1 ELSE 0 END) as upcoming_sessions
      FROM sessions 
      WHERE event_id = ?
    `, [eventId]);

    // Query statistiche relatori (unici)
    const speakerStats = db.query(`
      SELECT 
        COUNT(DISTINCT speaker_id) as total_speakers,
        COUNT(DISTINCT CASE WHEN speaker_id IS NOT NULL THEN speaker_id END) as confirmed_speakers,
        COUNT(DISTINCT CASE WHEN date(s.start_time) = date('now') AND s.speaker_id IS NOT NULL THEN s.speaker_id END) as speakers_today
      FROM sessions s
      WHERE s.event_id = ?
    `, [eventId]);

    // Query statistiche budget
    const budgetStats = db.query(`
      SELECT 
        COALESCE(SUM(budgeted_amount), 0) as total_budgeted,
        COALESCE(SUM(actual_amount), 0) as total_spent
      FROM event_budgets 
      WHERE event_id = ?
    `, [eventId]);

    // Query sessioni dettagli per dashboard
    const sessionsDetail = db.query(`
      SELECT 
        s.id,
        s.title,
        s.description,
        s.start_time,
        s.end_time,
        s.room,
        s.speaker_id,
        u.first_name || ' ' || u.last_name as speaker_name
      FROM sessions s
      LEFT JOIN users u ON s.speaker_id = u.id
      WHERE s.event_id = ?
      ORDER BY s.start_time ASC
    `, [eventId]);

    // Query relatori dettagli per dashboard
    const speakersDetail = db.query(`
      SELECT DISTINCT
        u.id,
        u.email,
        u.first_name,
        u.last_name,
        COUNT(s.id) as sessions_count,
        SUM(CASE WHEN s.speaker_id = u.id THEN 1 ELSE 0 END) as confirmed_sessions,
        COALESCE(SUM(tr.amount), 0) as total_reimbursements
      FROM users u
      JOIN sessions s ON u.id = s.speaker_id
      LEFT JOIN travel_reimbursements tr ON u.id = tr.speaker_id AND tr.event_id = ?
      WHERE s.event_id = ?
      GROUP BY u.id, u.email, u.first_name, u.last_name
      ORDER BY u.first_name, u.last_name
    `, [eventId, eventId]);

    // Calcolo insights
    const participantStatsData = participantStats[0];
    const sessionStatsData = sessionStats[0];
    const speakerStatsData = speakerStats[0];
    const budgetStatsData = budgetStats[0];

    const insights = {
      occupancyRate: event.max_participants ? Math.round((participantStatsData.total_participants || 0) / event.max_participants * 100) : 0,
      sessionCompletionRate: sessionStatsData.total_sessions ? Math.round((sessionStatsData.confirmed_sessions || 0) / sessionStatsData.total_sessions * 100) : 0,
      speakerConfirmationRate: speakerStatsData.total_speakers ? Math.round((speakerStatsData.confirmed_speakers || 0) / speakerStatsData.total_speakers * 100) : 0,
      budgetUtilizationRate: budgetStatsData.total_budgeted ? Math.round((budgetStatsData.total_spent || 0) / budgetStatsData.total_budgeted * 100) : 0
    };

    // Calcolo status sessioni
    const now = new Date().toISOString();
    const sessionsWithStatus = sessionsDetail.map(session => ({
      ...session,
      status: session.end_time < now 
        ? 'completed' 
        : session.start_time <= now && session.end_time > now
          ? 'in_progress'
          : 'scheduled'
    }));

    return {
      event: {
        ...event,
        start_date: event.start_date,
        end_date: event.end_date,
        location: event.location || "Non specificata"
      },
      stats: {
        totalParticipants: participantStatsData.total_participants || 0,
        checkedInParticipants: participantStatsData.checked_in || 0,
        registeredOnlyParticipants: participantStatsData.registered_only || 0,
        totalSessions: sessionStatsData.total_sessions || 0,
        confirmedSessions: sessionStatsData.confirmed_sessions || 0,
        sessionsToday: sessionStatsData.sessions_today || 0,
        upcomingSessions: sessionStatsData.upcoming_sessions || 0,
        totalSpeakers: speakerStatsData.total_speakers || 0,
        confirmedSpeakers: speakerStatsData.confirmed_speakers || 0,
        speakersToday: speakerStatsData.speakers_today || 0,
        totalBudgeted: budgetStatsData.total_budgeted || 0,
        totalSpent: budgetStatsData.total_spent || 0,
        remainingBudget: (budgetStatsData.total_budgeted || 0) - (budgetStatsData.total_spent || 0)
      },
      sessions: sessionsWithStatus,
      speakers: speakersDetail.map(speaker => ({
        id: speaker.id,
        name: `${speaker.first_name} ${speaker.last_name}`,
        email: speaker.email,
        sessions_count: speaker.sessions_count,
        confirmed_sessions: speaker.confirmed_sessions,
        total_travel_reimbursements: speaker.total_reimbursements || 0
      })),
      insights
    };
  } catch (error) {
    console.error("Failed to get event dashboard data:", error);
    return null;
  }
}

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
