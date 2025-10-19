"use server";
// NOTA: Questo file è server-only. Contiene logica business per dashboard eventi.
// WHY: Separazione della logica orchestrazione dal puro data access

import { 
  getEventDashboardStats, 
  getEventSessionsForDashboard,
  getEventSpeakersForDashboard,
  type EventDashboardStats,
  type EventSession,
  type EventSpeaker 
} from "@/data/events/dashboard-queries";
import { requireUser } from "@/lib/auth/require-user";

// WHY: Service layer orchestra le query DAL e applica regole business
// Type per il risultato completo della dashboard
export interface EventDashboardData {
  stats: EventDashboardStats;
  sessions: EventSession[];
  speakers: EventSpeaker[];
  insights: {
    occupancyRate: number;
    sessionCompletionRate: number;
    speakerConfirmationRate: number;
    budgetUtilizationRate: number;
  };
}

// Regola business: calcolo tasso occupazione evento
const calculateOccupancyRate = (stats: EventDashboardStats): number => {
  if (!stats.event.max_participants || stats.event.max_participants === 0) {
    return 0;
  }
  
  return Math.round((stats.totalParticipants / stats.event.max_participants) * 100);
};

// Regola business: calcolo tasso completamento sessioni
const calculateSessionCompletionRate = (stats: EventDashboardStats): number => {
  if (stats.totalSessions === 0) {
    return 0;
  }
  
  return Math.round((stats.confirmedSessions / stats.totalSessions) * 100);
};

// Regola business: calcolo tasso conferma relatori
const calculateSpeakerConfirmationRate = (stats: EventDashboardStats): number => {
  if (stats.totalSpeakers === 0) {
    return 0;
  }
  
  return Math.round((stats.confirmedSpeakers / stats.totalSpeakers) * 100);
};

// Regola business: calcolo tasso utilizzo budget
const calculateBudgetUtilizationRate = (stats: EventDashboardStats): number => {
  if (stats.totalBudgeted === 0) {
    return 0;
  }
  
  return Math.round((stats.totalSpent / stats.totalBudgeted) * 100);
};

// Service principale: orchestrazione dati dashboard completo
export const getEventDashboardData = async (
  eventId: number,
  requestingUserId: string
): Promise<EventDashboardData> => {
  // WHY: Verifica autorizzazione utente
  const user = await requireUser();
  
  // WHY: Chiamate parallele per ottimizzare performance
  const [stats, sessions, speakers] = await Promise.all([
    getEventDashboardStats(eventId, user.id),
    getEventSessionsForDashboard(eventId, user.id),
    getEventSpeakersForDashboard(eventId, user.id)
  ]);
  
  // WHY: Calcoliamo insights basati su regole business
  const insights = {
    occupancyRate: calculateOccupancyRate(stats),
    sessionCompletionRate: calculateSessionCompletionRate(stats),
    speakerConfirmationRate: calculateSpeakerConfirmationRate(stats),
    budgetUtilizationRate: calculateBudgetUtilizationRate(stats)
  };
  
  return {
    stats,
    sessions,
    speakers,
    insights
  };
};

// Service per validare accesso utente all'evento
export const validateEventDashboardAccess = async (
  eventId: number,
  requestingUserId: string
): Promise<boolean> => {
  // WHY: Solo admin possono vedere dashboard dettagliata eventi
  const user = await requireUser();
  return user.role === 'admin';
};

// Service per suggerimenti automatici base sulla dashboard
export interface DashboardRecommendation {
  type: 'warning' | 'info' | 'success';
  message: string;
  action?: string;
}

export const getDashboardRecommendations = async (
  dashboardData: EventDashboardData
): Promise<DashboardRecommendation[]> => {
  const recommendations: DashboardRecommendation[] = [];
  const { stats, insights } = dashboardData;
  
  // WHY: Suggerimenti proattivi basati su dati reali
  
  // Occupazione alta
  if (insights.occupancyRate >= 90) {
    recommendations.push({
      type: 'warning',
      message: `L'evento è quasi al completo (${insights.occupancyRate}%). Considera di aumentare capacità o creare lista d'attesa.`,
      action: 'Gestire partecipanti'
    });
  }
  
  // Occupazione bassa
  if (insights.occupancyRate < 30 && stats.event.start_date > new Date().toISOString()) {
    recommendations.push({
      type: 'info',
      message: `L'evento ha bassa occupazione (${insights.occupancyRate}%). Potrebbe servire più marketing.`,
      action: 'Promozione evento'
    });
  }
  
  // Sessioni non confermate
  if (insights.sessionCompletionRate < 80) {
    recommendations.push({
      type: 'warning',
      message: `${stats.totalSessions - stats.confirmedSessions} sessioni mancano relatori confermati.`,
      action: 'Assegnare relatori'
    });
  }
  
  // Budget esaurito
  if (insights.budgetUtilizationRate >= 95) {
    recommendations.push({
      type: 'warning',
      message: `Budget quasi esaurito (${insights.budgetUtilizationRate}% usato).`,
      action: 'Revisionare budget'
    });
  }
  
  // Successo check-in alto
  if (stats.checkedInParticipants > 0 && insights.occupancyRate > 0) {
    const checkInRate = Math.round((stats.checkedInParticipants / stats.totalParticipants) * 100);
    if (checkInRate >= 80) {
      recommendations.push({
        type: 'success',
        message: `Ottimo tasso di check-in: ${checkInRate}% dei partecipanti presenti.`
      });
    }
  }
  
  return recommendations;
};
