import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, Calendar, MapPin, Users, DollarSign } from "lucide-react";

import { EVENT_TYPES, EVENT_STATUSES } from "@/lib/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CreateEventForm from "@/components/events/create-event-form";

export default async function CreateEventPage() {
  const { userId } = await auth();
  
  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
          <div>
            <h1 className="text-3xl font-bold">Crea Nuovo Evento</h1>
            <p className="text-gray-600">
              Compila il form per creare un nuovo evento nella tua agenda.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <CreateEventForm />
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Event Types Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Tipi di Evento
              </CardTitle>
              <CardDescription>
                Scegli il tipo più adatto al tuo evento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {EVENT_TYPES.map((type) => (
                <div key={type} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium capitalize">
                    {type === 'conference' ? 'Conferenza' :
                     type === 'workshop' ? 'Workshop' :
                     type === 'seminar' ? 'Seminario' :
                     type === 'training' ? 'Formazione' :
                     type === 'webinar' ? 'Webinar' : type}
                  </span>
                  <span className="text-sm text-gray-500 capitalize">{type}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Event Status Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5" />
                Stati Evento
              </CardTitle>
              <CardDescription>
                Comprendi il ciclo di vita di un evento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {EVENT_STATUSES.map((status) => (
                <div key={status} className="flex items-center justify-between rounded-lg border p-3">
                  <span className="font-medium">
                    {status === 'draft' ? 'Bozza' :
                     status === 'published' ? 'Pubblicato' :
                     status === 'in_progress' ? 'In Corso' :
                     status === 'completed' ? 'Completato' :
                     status === 'cancelled' ? 'Cancellato' :
                     status === 'postponed' ? 'Rimandato' : status}
                  </span>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                    status === 'published' ? 'bg-green-100 text-green-800' :
                    status === 'draft' ? 'bg-gray-100 text-gray-800' :
                    status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    status === 'completed' ? 'bg-purple-100 text-purple-800' :
                    status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {status}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle>💡 Consigli Utili</CardTitle>
              <CardDescription>
                Suggerimenti per creare eventi efficaci
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-blue-500" />
                <span>
                  Scegli una location chiara e facilmente raggiungibile.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Calendar className="mt-0.5 h-4 w-4 text-green-500" />
                <span>
                  Imposta date realistiche con sufficiente preavviso.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Users className="mt-0.5 h-4 w-4 text-purple-500" />
                <span>
                  Definisci il numero massimo di partecipanti.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="mt-0.5 h-4 w-4 text-orange-500" />
                <span>
                  Prezzo a 0 per eventi gratuiti.
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
