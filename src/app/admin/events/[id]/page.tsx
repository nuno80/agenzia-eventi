import { notFound } from "next/navigation";
import { getEventDashboardData } from "@/actions/event-actions";
import EventDashboard from "@/components/events/EventDashboard";
import { Navbar } from "@/components/navbar";

// WHY: Server Component che recupera dati evento gestendo 404 per autorizzazione mancante
// Segue pattern blueprint con data fetching diretto, non Promise pattern

export const experimental_ppr = true;

// Page Server Component principale
export default async function EventDashboardPage({
  params,
}: {
  params: { id: string };
}) {
  // 1. Recupero dati dashboard (include interno controllo autorizzazione)
  const dashboardData = await getEventDashboardData(params.id);

  // 2. Se l'evento non esiste o utente non autorizzato, mostra 404
  if (!dashboardData) {
    notFound();
  }

  // WHY: Passiamo dati diretti al componente client che gestirà UI
  return (
    <div className="dashboard-container">
      <Navbar />
      <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{dashboardData.event.title}</h1>
        <p className="text-lg text-gray-600">
          {new Date(dashboardData.event.start_date).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric'
          })} - {new Date(dashboardData.event.end_date).toLocaleDateString('it-IT', {
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric'
          })}
        </p>
        <div className="mt-4 flex gap-2">
          {/* TODO: Aggiungere bottoni azione quando pronti */}
        </div>
      </header>
      <EventDashboard 
        event={dashboardData.event} 
        initialStats={dashboardData.stats} 
        sessions={dashboardData.sessions} 
        speakers={dashboardData.speakers} 
        insights={dashboardData.insights} 
      />
      </div>
    </div>
  );
}
