import { notFound } from "next/navigation";
import Link from "next/link";

import { getEventById } from "@/actions/event-actions";
import { ArrowLeft, Calendar, MapPin, Users, Clock, DollarSign, Edit, Trash2, Copy } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const event = await getEventById(resolvedParams.id);

  if (!event) {
    notFound();
  }

  const formattedStartDate = new Date(event.start_date).toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedEndDate = new Date(event.end_date).toLocaleDateString('it-IT', {
    weekday: 'long', 
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const eventTypeLabel = {
    conference: 'Conferenza',
    workshop: 'Workshop', 
    seminar: 'Seminario',
    training: 'Formazione',
    webinar: 'Webinar'
  }[event.event_type] || event.event_type;

  const statusConfig = {
    draft: { label: 'Bozza', color: 'bg-gray-100 text-gray-800' },
    published: { label: 'Pubblicato', color: 'bg-green-100 text-green-800' },
    in_progress: { label: 'In Corso', color: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Completato', color: 'bg-purple-100 text-purple-800' },
    cancelled: { label: 'Cancellato', color: 'bg-red-100 text-red-800' },
    postponed: { label: 'Rimandato', color: 'bg-yellow-100 text-yellow-800' }
  }[event.status] || { label: event.status, color: 'bg-gray-100 text-gray-800' };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Navigation */}
      <div className="mb-8">
        <div className="mb-4">
          <Button asChild variant="ghost" className="mb-4">
            <Link href="/admin/events" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Torna agli Eventi
            </Link>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="mb-4 flex items-center gap-4">
              <h1 className="text-3xl font-bold">{event.title}</h1>
              <Badge className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex flex-wrap gap-4 text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {eventTypeLabel}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {event.location}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {event.participant_count || 0}/{event.max_participants} partecipanti
              </span>
              {event.price && event.price > 0 && (
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  €{event.price}
                </span>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex gap-2 md:mt-0">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/events/${event.id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Modifica
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/events/${event.id}/duplicate`}>
                <Copy className="mr-2 h-4 w-4" />
                Duplica
              </Link>
            </Button>
            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
              <Trash2 className="mr-2 h-4 w-4" />
              Elimina
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Description */}
          {event.description && (
            <Card>
              <CardHeader>
                <CardTitle>Descrizione</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Date & Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Date e Orari
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900">Inizio</h4>
                <p className="text-gray-600">{formattedStartDate}</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Fine</h4>
                <p className="text-gray-600">{formattedEndDate}</p>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{event.location}</p>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Statistiche Evento</CardTitle>
              <CardDescription>
                Panoramica delle metriche principali
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  Partecipanti
                </span>
                <span className="font-semibold">
                  {event.participant_count || 0}/{event.max_participants}
                </span>
              </div>
              
              {/* Progress bar for participants */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((event.participant_count || 0) / event.max_participants * 100, 100)}%` 
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                {((event.participant_count || 0) / event.max_participants * 100).toFixed(1)}% completato
              </p>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Prezzo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">
                {event.price && event.price > 0 ? `€${event.price}` : 'Gratuito'}
              </p>
              {event.price && event.price > 0 && (
                <p className="text-sm text-gray-500 mt-1">
                  Prezzo per partecipante
                </p>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Azioni Rapide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full">
                <Link href={`/admin/events/${event.id}/program`}>
                  Gestisci Programma
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/admin/events/${event.id}/participants`}>
                  Gestisci Partecipanti
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/admin/events/${event.id}/announcements`}>
                  Invia Comunicazioni
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
