"use client";

import { useState } from "react";

import { Calendar, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Session, User } from "@/lib/schema";

import SessionForm from "./SessionForm";
import SessionsTable from "./SessionsTable";

interface ProgramManagerProps {
  eventId: string;
  initialSessions: (Session & { speaker?: User })[];
}

export default function ProgramManager({
  eventId,
  initialSessions,
}: ProgramManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessions, setSessions] = useState(initialSessions);

  const handleSessionCreated = (newSession: Session & { speaker?: User }) => {
    setSessions((prev) =>
      [...prev, newSession].sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      )
    );
    toast.success("Sessione aggiunta con successo!");
  };

  const handleSessionDeleted = (sessionId: number) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    toast.success("Sessione eliminata con successo!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold text-gray-900">
            <Calendar className="h-6 w-6" />
            Programma Sessioni
          </h2>
          <p className="mt-1 text-gray-600">
            Gestisci le sessioni del tuo evento
          </p>
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Aggiungi Sessione
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crea una Nuova Sessione</DialogTitle>
            </DialogHeader>
            <SessionForm
              eventId={eventId}
              onFormSubmit={() => setIsModalOpen(false)}
              onSessionCreated={handleSessionCreated}
            />
          </DialogContent>
        </Dialog>
      </div>

      {sessions.length > 0 ? (
        <SessionsTable
          sessions={sessions}
          onSessionDeleted={handleSessionDeleted}
        />
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <Calendar className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            Nessuna sessione programmata
          </h3>
          <p className="mx-auto mb-6 max-w-md text-gray-600">
            Inizia ad aggiungere sessioni al tuo programma per definire la
            struttura dell&apos;evento.
          </p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Crea la prima sessione
          </Button>
        </div>
      )}
    </div>
  );
}
