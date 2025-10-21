'use server';

import { auth } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { Job } from '@/lib/schema';

// --- AZIONE: Recupero dello stato di un job di importazione ---
export async function getJobStatus(jobId: string) {
  const { userId } = auth();
  if (!userId) throw new Error('Non autorizzato');
  
  try {
    const jobIdNum = parseInt(jobId);
    if (isNaN(jobIdNum)) return null;

    const job = await db.backupJob.findFirst({
      where: {
        id: jobIdNum,
        // Sicurezza: solo l'utente che ha creato il job può vederne lo stato
        createdBy: userId, 
      },
    });

    if (!job) return null;

    // Parse result if exists
    let result = null;
    if (job.result) {
      try {
        result = JSON.parse(job.result);
      } catch (e) {
        console.error('Error parsing job result:', e);
      }
    }

    return {
      id: job.id.toString(),
      status: job.status,
      result,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };

  } catch (error) {
    console.error('Error getting job status:', error);
    return null;
  }
}

// --- AZIONE: Lista jobs dell'utente ---
export async function getUserJobs({ limit = 10 }: { limit?: number } = {}) {
  const { userId } = auth();
  if (!userId) return { data: [], total: 0 };

  try {
    const jobs = await db.backupJob.findMany({
      where: { createdBy: userId },
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        type: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        result: true,
      }
    });

    const total = await db.backupJob.count({
      where: { createdBy: userId }
    });

    const transformedJobs = jobs.map(job => {
      let result = null;
      if (job.result) {
        try {
          result = JSON.parse(job.result);
        } catch (e) {
          console.error('Error parsing job result:', e);
        }
      }

      return {
        id: job.id.toString(),
        type: job.type,
        status: job.status,
        result,
        createdAt: job.createdAt,
        updatedAt: job.updatedAt,
      };
    });

    return { data: transformedJobs, total };

  } catch (error) {
    console.error('Error getting user jobs:', error);
    return { data: [], total: 0 };
  }
}

// --- AZIONE: Pulizia jobs completati/failed vecchi ---
export async function cleanupOldJobs(daysOld = 7) {
  const { userId } = auth();
  if (!userId) return { success: false, error: 'Non autorizzato' };

  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const deletedCount = await db.backupJob.deleteMany({
      where: {
        createdBy: userId,
        status: { in: ['COMPLETED', 'FAILED'] },
        createdAt: { lt: cutoffDate }
      }
    });

    return { 
      success: true, 
      message: `Puliti ${deletedCount.count} job vecchi di ${daysOld}+ giorni.` 
    };

  } catch (error) {
    console.error('Error cleaning up old jobs:', error);
    return { success: false, error: 'Errore durante la pulizia dei job.' };
  }
}
