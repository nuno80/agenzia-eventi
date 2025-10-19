"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Calendar, 
  UserCheck, 
  DollarSign, 
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

// WHY: Componente client per gestione interattività dashboard evento
// Segue pattern blueprint con StatusCard components

// Tipi per props (derivati da event-actions.ts)
interface EventSession {
  id: number;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  room: string | null;
  speaker_name: string | null;
  speaker_id: string | null;
  status: 'scheduled' | 'in_progress' | 'completed';
}

interface EventSpeaker {
  id: string;
  name: string;
  email: string;
  sessions_count: number;
  confirmed_sessions: number;
  total_travel_reimbursements: number;
}

interface EventStats {
  totalParticipants: number;
  checkedInParticipants: number;
  registeredOnlyParticipants: number;
  totalSessions: number;
  confirmedSessions: number;
  sessionsToday: number;
  upcomingSessions: number;
  totalSpeakers: number;
  confirmedSpeakers: number;
  speakersToday: number;
  totalBudgeted: number;
  totalSpent: number;
  remainingBudget: number;
}

interface EventInsights {
  occupancyRate: number;
  sessionCompletionRate: number;
  speakerConfirmationRate: number;
  budgetUtilizationRate: number;
}

interface Event {
  id: number;
  title: string;
  start_date: string;
  end_date: string;
  location: string;
  status: string;
}

interface EventDashboardProps {
  event: Event;
  initialStats: EventStats;
  sessions: EventSession[];
  speakers: EventSpeaker[];
  insights: EventInsights;
}

// Helper StatusCard inline (definito nel blueprint)
interface StatusCardProps {
  icon: React.ReactNode;
  title: string;
  metric: string;
  status: 'OK' | 'Warning' | 'Error';
  statusText: string;
  linkHref?: string;
  linkText: string;
}

const statusColors = {
  OK: 'text-green-500',
  Warning: 'text-yellow-500',
  Error: 'text-red-500',
};

function StatusCard({ icon, title, metric, status, statusText, linkHref, linkText }: StatusCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
          {icon}
          <span>{title}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-gray-900">{metric}</p>
        <div className="flex items-center gap-2 mt-1">
            <span className={cn(
              "w-2 h-2 rounded-full",
              statusColors[status].replace('text-', 'bg-')
            )}></span>
            <span className={cn("text-sm font-medium", statusColors[status])}>{statusText}</span>
        </div>
        <div className="mt-4">
            {linkHref ? (
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href={linkHref}>{linkText}</a>
                </Button>
            ) : (
                <Button variant="link" className="p-0 h-auto">{linkText}</Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function EventDashboard({ 
  event, 
  initialStats, 
  sessions, 
  speakers, 
  insights
}: EventDashboardProps) {
  // Helper per formattare currency (Client-side)
  const formatCurrency = (amount: number) => {
    return `€${amount.toLocaleString('it-IT', { 
      minimumFractionDigits: 2,
      maximumFractionDigits: 2 
    })}`;
  };

  // Helper per formattare orari sessioni
  const formatSessionTime = (startTime: string, endTime: string) => {
    const start = new Date(startTime).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const end = new Date(endTime).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
    return `${start} - ${end}`;
  };

  // Helper per colore badge sessione
  const getSessionBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in_progress': return 'secondary';
      case 'scheduled': return 'outline';
      default: return 'outline';
    }
  };

  // Determinazione stati basata su insights
  const getStatusFromRate = (rate: number, threshold: { warn: number; error: number }) => {
    if (rate >= threshold.error) return 'Error';
    if (rate >= threshold.warn) return 'Warning';
    return 'OK';
  };

  const participantStatus = getStatusFromRate(insights.occupancyRate, { warn: 70, error: 90 });
  const sessionStatus = getStatusFromRate(100 - insights.sessionCompletionRate, { warn: 20, error: 50 });
  const speakerStatus = getStatusFromRate(100 - insights.speakerConfirmationRate, { warn: 20, error: 50 });
  const budgetStatus = getStatusFromRate(insights.budgetUtilizationRate, { warn: 70, error: 90 });

  return (
    <div className="space-y-6">
      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard
          icon={<Calendar />}
          title="PROGRAMMA"
          metric={`${initialStats.totalSessions} sessioni definite`}
          status={sessionStatus}
          statusText={sessionStatus === 'OK' ? 'Completo' : sessionStatus === 'Warning' ? 'Attenzione' : 'Critico'}
          linkHref={`/admin/events/${event.id}/program`}
          linkText="→ Gestisci Programma"
        />
        
        <StatusCard
          icon={<UserCheck />}
          title="RELATORI"
          metric={`${initialStats.confirmedSpeakers} confermati, ${initialStats.totalSpeakers - initialStats.confirmedSpeakers} in attesa`}
          status={speakerStatus}
          statusText={speakerStatus === 'OK' ? 'Tutti confermati' : 'In corso'}
          linkText="+ Invita Relatore"
        />
        
        <StatusCard
          icon={<Users />}
          title="PARTECIPANTI"
          metric={`${initialStats.totalParticipants} / ${event.max_participants || '∞'} iscritti`}
          status={participantStatus}
          statusText={`${insights.occupancyRate}% capacidade`}
          linkText="→ Gestisci Iscritti"
        />
        
        <StatusCard
          icon={<DollarSign />}
          title="BUDGET"
          metric={`${formatCurrency(initialStats.totalSpent)} / ${formatCurrency(initialStats.totalBudgeted)}`}
          status={budgetStatus}
          statusText={`${insights.budgetUtilizationRate}% utilizzato`}
          linkText="→ Gestisci Budget"
        />
        
        <StatusCard
          icon={<Clock />}
          title="SESSIONI OGGI"
          metric={`${initialStats.sessionsToday}`}
          status="OK"
          statusText={`${initialStats.upcomingSessions} in programma`}
          linkText="→ Vedi Programma"
        />
        
        <StatusCard
          icon={<CheckCircle />}
          title="CHECK-IN RATE"
          metric={`${initialStats.totalParticipants > 0 ? Math.round((initialStats.checkedInParticipants / initialStats.totalParticipants) * 100) : 0}%`}
          status="OK"
          statusText={`${initialStats.checkedInParticipants} di ${initialStats.totalParticipants} presenti`}
          linkText="→ Gestisci Check-in"
        />
      </div>

      {/* Sezioni Dettaglio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sessioni del Giorno */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sessioni di Oggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sessions
                .filter(session => {
                  const today = new Date().toISOString().split('T')[0];
                  return session.start_time.split('T')[0] === today;
                })
                .slice(0, 5)
                .map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{session.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatSessionTime(session.start_time, session.end_time)}
                        {session.room && ` • ${session.room}`}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {session.speaker_name || "TBA"}
                      </div>
                    </div>
                    <Badge variant={getSessionBadgeVariant(session.status)}>
                      {session.status === 'completed' && 'Completata'}
                      {session.status === 'in_progress' && 'In corso'}
                      {session.status === 'scheduled' && 'Programmata'}
                    </Badge>
                  </div>
                ))}
              
              {sessions.filter(session => {
                const today = new Date().toISOString().split('T')[0];
                return session.start_time.split('T')[0] === today;
              }).length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Nessuna sessione programmata per oggi
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Relatori Attivi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Relatori Attivi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {speakers
                .slice(0, 5)
                .map((speaker) => (
                  <div key={speaker.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{speaker.name}</div>
                      <div className="text-sm text-muted-foreground">{speaker.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {speaker.sessions_count} sessioni • {formatCurrency(speaker.total_travel_reimbursements)} rimborsi
                      </div>
                    </div>
                    <Badge variant="outline">
                      {speaker.confirmed_sessions === speaker.sessions_count ? 'Completo' : 'In corso'}
                    </Badge>
                  </div>
                ))}
              
              {speakers.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  Nessun relatore assegnato
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
