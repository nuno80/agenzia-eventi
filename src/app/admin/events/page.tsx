import Link from "next/link";
import { PlusCircle, Calendar, Users, Clock, DollarSign } from "lucide-react";

import { getEvents } from "@/actions/event-actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <div className="dashboard-container">
      <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestione Eventi</h1>
          <p className="text-gray-600">
            Crea e gestisci tutti gli tuoi eventi dalla dashboard admin.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/events/create" className="flex items-center gap-2">
            <PlusCircle className="h-5 w-5" />
            Nuovo Evento
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Totale Eventi</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              Eventi registrati nel sistema
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partecipanti Totali</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((sum, event) => sum + (event.participant_count || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Utenti iscritti agli eventi
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessioni Programmate</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((sum, event) => sum + (event.session_count || 0), 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Sessioni in programma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valore Eventi</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              €{events.reduce((sum, event) => sum + (event.price || 0), 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Valore totale degli eventi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Elenco Eventi</CardTitle>
          <CardDescription>
            Visualizza e gestisci tutti gli eventi creati.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-semibold">Nessun evento trovato</h3>
              <p className="mt-2 text-gray-600">
                Inizia creando il tuo primo evento per gestire la tua agenda.
              </p>
              <Button asChild className="mt-4">
                <Link href="/admin/events/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Crea il tuo primo evento
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                    <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.start_date).toLocaleDateString('it-IT')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {event.participant_count || 0}/{event.max_participants}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {event.session_count || 0} sessioni
                      </span>
                      {event.price && event.price > 0 && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          €{event.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                      event.status === 'published' ? 'bg-green-100 text-green-800' :
                      event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                      event.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      event.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                      event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status === 'published' ? 'Pubblicato' :
                       event.status === 'draft' ? 'Bozza' :
                       event.status === 'in_progress' ? 'In Corso' :
                       event.status === 'completed' ? 'Completato' :
                       event.status === 'cancelled' ? 'Cancellato' :
                       event.status === 'postponed' ? 'Rimandato' : event.status}
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/events/${event.id}`}>
                        Dettagli
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
