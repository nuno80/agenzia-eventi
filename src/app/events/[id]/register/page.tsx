import { Metadata } from 'next';
import { getPublicEvent } from '@/actions/participantActions';
import PublicRegistrationForm from '@/components/auth/PublicRegistrationForm';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const event = await getPublicEvent(params.id);
  
  if (!event) {
    return {
      title: 'Evento non trovato',
      description: 'L\'evento richiesto non è disponibile.',
    };
  }

  return {
    title: `Registrazione - ${event.title}`,
    description: event.description ? 
      `Registrati all'evento: ${event.description.substring(0, 160)}` : 
      `Registrati all'evento ${event.title}`,
  };
}

export default async function EventRegistrationPage({ params }: PageProps) {
  const event = await getPublicEvent(params.id);

  if (!event) {
    notFound();
  }

  const eventId = params.id;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Registrazione Evento
            </h1>
            <p className="text-gray-600 mt-1">
              Compila il modulo di seguito per registrarti all'evento
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Event Details */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Dettagli Evento
              </h2>
              
              <div className="space-y-4">
                {/* Event Title */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {event.title}
                  </h3>
                  {event.description && (
                    <p className="text-gray-600 mt-2 line-clamp-3">
                      {event.description}
                    </p>
                  )}
                </div>

                {/* Event Information */}
                <div className="border-t pt-4 space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900">Data e Ora</h4>
                    <div className="text-sm text-gray-600 mt-1">
                      <div>
                        Inizio: {new Date(event.startDate).toLocaleString('it-IT', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      <div>
                        Fine: {new Date(event.endDate).toLocaleString('it-IT', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Location</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.location}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Tipo Evento</h4>
                    <p className="text-sm text-gray-600 mt-1 capitalize">
                      {event.eventType.replace('_', ' ')}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900">Partecipanti</h4>
                    <div className="mt-2">
                      <div className="relative">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>{event.participantsCount} iscritti</span>
                          <span>{event.maxParticipants} totali</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((event.participantsCount / event.maxParticipants) * 100, 100)}%` 
                            }}
                          />
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {Math.round((event.participantsCount / event.maxParticipants) * 100)}% completo
                          </span>
                          {event.participantsCount >= event.maxParticipants && (
                            <span className="text-xs text-red-600 font-medium">
                              Pieno
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {event.price && event.price > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-900">Costo</h4>
                      <p className="text-lg font-semibold text-blue-600 mt-1">
                        €{event.price}
                      </p>
                    </div>
                  )}
                </div>

                {/* Registration Status */}
                {event.participantsCount >= event.maxParticipants && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-medium text-red-800">
                      Evento al completo
                    </h4>
                    <p className="text-sm text-red-600 mt-1">
                      L'evento ha raggiunto il numero massimo di partecipanti. 
                      Non è più possibile registrarsi.
                    </p>
                  </div>
                )}

                {event.participantsCount < event.maxParticipants && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-medium text-green-800">
                      Posti disponibili
                    </h4>
                    <p className="text-sm text-green-600 mt-1">
                      Ci sono ancora {event.maxParticipants - event.participantsCount} posti disponibili.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="lg:col-span-2">
            <PublicRegistrationForm 
              eventId={eventId}
              eventData={{
                title: event.title,
                description: event.description || undefined,
                startDate: event.startDate,
                endDate: event.endDate,
                location: event.location,
                maxParticipants: event.maxParticipants,
                participantsCount: event.participantsCount,
                price: event.price || undefined
              }}
              onSuccess={() => {
                // We'll add success handling here
                console.log('Registration successful');
              }}
            />
          </div>
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": event.title,
            "description": event.description,
            "startDate": event.startDate.toISOString(),
            "endDate": event.endDate.toISOString(),
            "location": {
              "@type": "Place",
              "name": event.location
            },
            "eventStatus": "https://schema.org/EventScheduled",
            "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          }),
        }}
      />
    </div>
  );
}
