import { getParticipants } from '@/actions/participantActions';
import ParticipantsManager from '@/components/participants/ParticipantsManager';

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ParticipantsPage({ params, searchParams }: PageProps) {
  // Parsing dei parametri di ricerca per la prima chiamata
  const page = typeof searchParams.page === 'string' ? Number(searchParams.page) : 1;
  const limit = typeof searchParams.limit === 'string' ? Number(searchParams.limit) : 10;
  
  // Carica i dati iniziali sul server
  const initialData = await getParticipants(params.id, { page, limit });
  const eventId = params.id;

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestione Partecipanti</h1>
        <p className="text-gray-600 mt-2">
          Gestisci i partecipanti e relatori dell'evento
        </p>
      </header>
      <main>
        {/* Componente client per gestire l'interattività */}
        <ParticipantsManager eventId={eventId} initialData={initialData} />
      </main>
    </div>
  );
}
