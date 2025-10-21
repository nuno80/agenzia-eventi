'use server';

import { z } from 'zod';
import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { 
  InviteFormSchema, 
  ParticipantStatusSchema,
  SpeakerStatusSchema
} from '@/lib/schema';
import { NextResponse } from 'next/server';

// Funzione helper per verificare se l'utente è un admin dell'evento
async function verifyAdminAccess(eventId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Non autorizzato');

  // Converti eventId a number per il database
  const eventIdNum = parseInt(eventId);
  if (isNaN(eventIdNum)) throw new Error('ID evento non valido');

  const adminLink = await db.eventAdmin.findFirst({
    where: { eventId: eventIdNum, userId },
  });
  if (!adminLink) throw new Error('Accesso negato');
  return userId;
}

// --- AZIONE: Recupero della lista di partecipanti ---
export async function getParticipants(
  eventId: string, 
  { 
    page = 1, 
    limit = 10, 
    status, 
    searchQuery 
  }: { 
    page?: number; 
    limit?: number; 
    status?: string; 
    searchQuery?: string 
  }
) {
  await verifyAdminAccess(eventId);
  
  const eventIdNum = parseInt(eventId);
  if (isNaN(eventIdNum)) throw new Error('ID evento non valido');

  // Logica di paginazione e filtri
  const whereClause = {
    eventId: eventIdNum,
    ...(status && { status: status as any }),
    ...(searchQuery && { 
      user: { 
        OR: [
          { firstName: { contains: searchQuery, mode: 'insensitive' as any } },
          { lastName: { contains: searchQuery, mode: 'insensitive' as any } },
          { email: { contains: searchQuery, mode: 'insensitive' as any } }
        ]
      } 
    }),
  };

  const participants = await db.eventParticipant.findMany({
    where: whereClause,
    take: limit,
    skip: (page - 1) * limit,
    include: { 
      user: { 
        select: { 
          id: true, 
          firstName: true, 
          lastName: true, 
          email: true 
        } 
      } 
    },
    orderBy: { createdAt: 'desc' }
  });
  
  const total = await db.eventParticipant.count({ where: whereClause });

  // Transform data to match expected format
  const transformedParticipants = participants.map(p => ({
    id: p.id.toString(),
    user: {
      id: p.userId,
      name: p.firstName ? `${p.firstName} ${p.lastName ?? ''}`.trim() : p.email,
      email: p.email
    },
    status: p.status,
    registeredAt: p.createdAt
  }));

  return { data: transformedParticipants, total };
}

// --- AZIONE: Invito/Aggiunta manuale di un utente a un evento ---
export async function inviteParticipant(eventId: string, formData: z.infer<typeof InviteFormSchema>) {
  const userId = await verifyAdminAccess(eventId);
  
  const validatedFields = InviteFormSchema.safeParse(formData);
  if (!validatedFields.success) {
    return { error: 'Dati non validi.' };
  }
  
  const { email, role } = validatedFields.data;
  
  try {
    // Controlla se l'utente esiste già nel sistema
    let user = await db.user.findFirst({
      where: { email }
    });

    if (!user) {
      // TODO: Implementare la logica di creazione utente in Better Auth se non esiste
      // e l'invio di un'email transazionale (es. con Resend o SendGrid)
      return { error: 'Utente non trovato nel sistema. La registrazione automatica non è ancora implementata.' };
    }

    const eventIdNum = parseInt(eventId);
    if (isNaN(eventIdNum)) {
      return { error: 'ID evento non valido.' };
    }

    if (role === 'PARTICIPANT') {
      // Controlla se l'utente è già un partecipante
      const existingParticipant = await db.eventParticipant.findFirst({
        where: { 
          eventId: eventIdNum,
          userId: user.id 
        }
      });

      if (existingParticipant) {
        return { error: 'L\'utente è già un partecipante a questo evento.' };
      }

      // Aggiungi alla tabella dei partecipanti
      await db.eventParticipant.create({
        data: {
          eventId: eventIdNum,
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: 'REGISTERED'
        }
      });

      revalidatePath(`/admin/events/${eventId}/participants`);
      return { success: `Invito inviato a ${email}.` };
    } else {
      // Controlla se l'utente è già un relatore
      const existingSpeaker = await db.eventSpeaker.findFirst({
        where: { 
          eventId: eventIdNum,
          userId: user.id 
        }
      });

      if (existingSpeaker) {
        return { error: 'L\'utente è già un relatore a questo evento.' };
      }

      // Aggiungi alla tabella dei relatori
      await db.eventSpeaker.create({
        data: {
          eventId: eventIdNum,
          userId: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          status: 'INVITED'
        }
      });

      revalidatePath(`/admin/events/${eventId}/speakers`);
      return { success: `Invito inviato a ${email}.` };
    }

  } catch (error) {
    console.error('Error inviting participant:', error);
    return { error: 'Errore durante l\'invito del partecipante.' };
  }
}

// --- AZIONE: Avvio importazione da CSV ---
export async function importFromCsv(eventId: string, formData: FormData) {
  const userId = await verifyAdminAccess(eventId);
  
  const file = formData.get('csvfile') as File;
  if (!file || file.type !== 'text/csv' || file.size > 5 * 1024 * 1024) {
    return { error: 'File non valido o troppo grande (max 5MB).' };
  }
  
  try {
    // Leggi il contenuto del file CSV
    const csvText = await file.text();
    const lines = csvText.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      return { error: 'Il file CSV è vuoto o contiene solo l\'intestazione.' };
    }

    const eventIdNum = parseInt(eventId);
    if (isNaN(eventIdNum)) {
      return { error: 'ID evento non valido.' };
    }

    // Crea un job nel database
    const job = await db.backupJob.create({
      data: {
        type: 'CSV_IMPORT',
        status: 'PROCESSING',
        createdBy: userId,
        payload: { 
          eventId: eventIdNum, 
          fileName: file.name,
          totalRecords: lines.length - 1 // Exclude header
        },
      },
    });

    // Processa il CSV in background (sincrono per semplicità)
    // TODO: Implementare background worker per processing asincrono
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
      
      if (columns.length < 2) {
        errorCount++;
        errors.push(`Riga ${i + 1}: formato non valido`);
        continue;
      }

      const [name, email, role = 'PARTICIPANT', ...rest] = columns;
      
      if (!email || !email.includes('@')) {
        errorCount++;
        errors.push(`Riga ${i + 1}: email non valida`);
        continue;
      }

      try {
        // Cerca o crea l'utente
        let user = await db.user.findFirst({
          where: { email: email.toLowerCase() }
        });

        if (!user) {
          // Crea utente base
          const [firstName, ...lastNameParts] = name.split(' ');
          user = await db.user.create({
            data: {
              email: email.toLowerCase(),
              firstName: firstName || '',
              lastName: lastNameParts.join(' ') || '',
              role: 'user'
            }
          });
        }

        // Aggiungi come partecipante o relatore
        if (role.toUpperCase() === 'SPEAKER') {
          await db.eventSpeaker.create({
            data: {
              eventId: eventIdNum,
              userId: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              status: 'INVITED'
            }
          });
        } else {
          await db.eventParticipant.create({
            data: {
              eventId: eventIdNum,
              userId: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              status: 'REGISTERED'
            }
          });
        }

        successCount++;
      } catch (error) {
        errorCount++;
        errors.push(`Riga ${i + 1}: errore durante l'elaborazione`);
      }
    }

    // Aggiorna lo stato del job
    await db.backupJob.update({
      where: { id: job.id },
      data: {
        status: 'COMPLETED',
        result: JSON.stringify({
          successCount,
          errorCount,
          errors: errors.slice(0, 10) // Limit error details
        })
      }
    });

    revalidatePath(`/admin/events/${eventId}/participants`);
    revalidatePath(`/admin/events/${eventId}/speakers`);

    return { 
      success: true, 
      jobId: job.id.toString(),
      result: {
        successCount,
        errorCount,
        total: lines.length - 1
      }
    };

  } catch (error) {
    console.error('Error importing CSV:', error);
    return { error: 'Errore durante l\'importazione del file CSV.' };
  }
}

// --- AZIONE: Esportazione in CSV ---
export async function exportToCsv(eventId: string) {
  await verifyAdminAccess(eventId);
  
  try {
    const eventIdNum = parseInt(eventId);
    if (isNaN(eventIdNum)) {
      return { error: 'ID evento non valido.' };
    }

    const participants = await db.eventParticipant.findMany({
      where: { eventId: eventIdNum },
      include: { user: true },
      orderBy: { createdAt: 'asc' }
    });

    // Logica per convertire JSON in CSV
    const csvHeader = "Nome,Cognome,Email,Stato,Data Iscrizione\n";
    const csvBody = participants.map(p => {
      const name = p.firstName || '';
      const lastName = p.lastName || '';
      const email = p.email || '';
      const status = p.status;
      const registrationDate = p.createdAt.toISOString().split('T')[0];
      
      return `"${name}","${lastName}","${email}","${status}","${registrationDate}"`;
    }).join('\n');
    
    const csvContent = csvHeader + csvBody;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="participants_${eventId}.csv"`,
      },
    });

  } catch (error) {
    console.error('Error exporting CSV:', error);
    return { error: 'Errore durante l\'esportazione dei dati.' };
  }
}

// --- AZIONE: Eliminazione partecipante ---
export async function removeParticipant(eventId: string, participantId: string) {
  await verifyAdminAccess(eventId);
  
  try {
    const participantIdNum = parseInt(participantId);
    if (isNaN(participantIdNum)) {
      return { error: 'ID partecipante non valido.' };
    }

    const participant = await db.eventParticipant.findFirst({
      where: { 
        id: participantIdNum,
        event: { id: parseInt(eventId) }
      }
    });

    if (!participant) {
      return { error: 'Partecipante non trovato.' };
    }

    await db.eventParticipant.delete({
      where: { id: participantIdNum }
    });

    revalidatePath(`/admin/events/${eventId}/participants`);
    return { success: 'Partecipante rimosso con successo.' };

  } catch (error) {
    console.error('Error removing participant:', error);
    return { error: 'Errore durante la rimozione del partecipante.' };
  }
}

// --- AZIONE: Aggiornamento stato partecipante ---
export async function updateParticipantStatus(
  eventId: string, 
  participantId: string, 
  status: string
) {
  await verifyAdminAccess(eventId);
  
  try {
    const participantIdNum = parseInt(participantId);
    if (isNaN(participantIdNum)) {
      return { error: 'ID partecipante non valido.' };
    }

    const validatedStatus = ParticipantStatusSchema.safeParse(status);
    if (!validatedStatus.success) {
      return { error: 'Stato non valido.' };
    }

    const participant = await db.eventParticipant.findFirst({
      where: { 
        id: participantIdNum,
        event: { id: parseInt(eventId) }
      }
    });

    if (!participant) {
      return { error: 'Partecipante non trovato.' };
    }

    await db.eventParticipant.update({
      where: { id: participantIdNum },
      data: { status: validatedStatus.data }
    });

    revalidatePath(`/admin/events/${eventId}/participants`);
    return { success: 'Stato aggiornato con successo.' };

  } catch (error) {
    console.error('Error updating participant status:', error);
    return { error: 'Errore durante l\'aggiornamento dello stato.' };
  }
}

// --- AZIONE: Registrazione pubblica evento ---
export async function registerForEvent(
  eventId: string, 
  formData: { name: string; email: string; company?: string }
) {
  const { userId } = auth();
  
  try {
    const eventIdNum = parseInt(eventId);
    if (isNaN(eventIdNum)) {
      return { error: 'ID evento non valido.' };
    }

    // Verifica che l'evento esista e sia pubblicato
    const event = await db.event.findFirst({
      where: { id: eventIdNum, status: 'published' }
    });

    if (!event) {
      return { error: 'Evento non trovato o non disponibile alla registrazione.' };
    }

    // Controlla se l'utente è già autenticato
    if (userId) {
      const existingUser = await db.user.findUnique({
        where: { id: userId }
      });

      if (existingUser) {
        // Controlla se è già registrato
        const existingParticipant = await db.eventParticipant.findFirst({
          where: { 
            eventId: eventIdNum,
            userId: userId 
          }
        });

        if (existingParticipant) {
          return { error: 'Sei già registrato a questo evento.' };
        }

        // Registra l'utente esistente
        await db.eventParticipant.create({
          data: {
            eventId: eventIdNum,
            userId: userId,
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            status: 'REGISTERED'
          }
        });

        return { success: 'Registrazione completata con successo!' };
      }
    }

    // Per utenti non autenticati, crea un record temporaneo
    // TODO: Implementare la creazione di utente con Better Auth
    const [firstName, ...lastNameParts] = formData.name.split(' ');
    
    await db.eventParticipant.create({
      data: {
        eventId: eventIdNum,
        userId: 'temp-' + Date.now(), // Temporary ID, will be updated after auth
        email: formData.email,
        firstName: firstName || '',
        lastName: lastNameParts.join(' ') || '',
        status: 'REGISTERED'
      }
    });

    return { 
      success: 'Registrazione completata! Riceverai email di conferma.' 
    };

  } catch (error) {
    console.error('Error registering for event:', error);
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return { error: 'Sei già registrato a questo evento.' };
    }
    return { error: 'Errore durante la registrazione.' };
  }
}

// --- AZIONE: Recupero informazioni evento pubblico ---
export async function getPublicEvent(eventId: string) {
  try {
    const eventIdNum = parseInt(eventId);
    if (isNaN(eventIdNum)) {
      return null;
    }

    const event = await db.event.findFirst({
      where: { id: eventIdNum, status: 'published' },
      include: {
        participants: {
          select: { id: true }
        }
      }
    });

    if (!event) return null;

    return {
      ...event,
      participantsCount: event.participants.length,
      maxParticipants: event.maxParticipants
    };

  } catch (error) {
    console.error('Error getting public event:', error);
    return null;
  }
}
