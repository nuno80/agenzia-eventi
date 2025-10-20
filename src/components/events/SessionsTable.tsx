"use client";

import { format } from "date-fns";
import { it } from "date-fns/locale";
import {
  Clock,
  Edit2,
  MapPin,
  MoreHorizontal,
  Trash2,
  User as UserIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Session, User } from "@/lib/schema";

interface SessionsTableProps {
  sessions: (Session & { speaker?: User })[];
  onSessionDeleted?: (sessionId: number) => void;
}

export default function SessionsTable({
  sessions,
  onSessionDeleted,
}: SessionsTableProps) {
  const handleDeleteSession = async (sessionId: number) => {
    if (!confirm("Sei sicuro di voler eliminare questa sessione?")) {
      return;
    }

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Impossibile eliminare la sessione");
      }

      onSessionDeleted?.(sessionId);
    } catch (error) {
      console.error("Delete session error:", error);
      alert("Errore durante l'eliminazione della sessione");
    }
  };

  const formatDateTime = (date: Date | string) => {
    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      
      // Verifica che la data sia valida
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date:", date);
        return "Invalid date";
      }
      
      return format(dateObj, "dd/MM HH:mm", { locale: it });
    } catch (error) {
      console.error("Error formatting date:", error, "Input:", date);
      return "Date Error";
    }
  };

  const getStatusColor = (startTime: Date | string, endTime: Date | string) => {
    try {
      const now = new Date();
      const start =
        typeof startTime === "string" ? new Date(startTime) : startTime;
      const end = typeof endTime === "string" ? new Date(endTime) : endTime;

      // Verifica che le date siano valide
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "bg-red-100 text-red-800";
      }

      if (now < start) {
        return "bg-blue-100 text-blue-800";
      } else if (now >= start && now <= end) {
        return "bg-green-100 text-green-800";
      } else {
        return "bg-gray-100 text-gray-800";
      }
    } catch (error) {
      return "bg-red-100 text-red-800";
    }
  };

  const getStatusText = (startTime: Date | string, endTime: Date | string) => {
    try {
      const now = new Date();
      const start =
        typeof startTime === "string" ? new Date(startTime) : startTime;
      const end = typeof endTime === "string" ? new Date(endTime) : endTime;

      // Verifica che le date siano valide
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return "Data non valida";
      }

      if (now < start) {
        return "Programmata";
      } else if (now >= start && now <= end) {
        return "In Corso";
      } else {
        return "Completata";
      }
    } catch (error) {
      return "Errore status";
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center">
        <div className="text-gray-500">
          <div className="mb-2 text-lg font-medium">
            Nessuna sessione programmata
          </div>
          <div className="text-sm">
            Aggiungi la prima sessione per iniziare a strutturare il programma.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Sessione</TableHead>
            <TableHead className="w-[200px]">Orario</TableHead>
            <TableHead>Sala</TableHead>
            <TableHead>Relatore</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead className="text-right">Azioni</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.id}>
              <TableCell>
                <div>
                  <div className="font-medium text-gray-900">
                    {session.title}
                  </div>
                  {session.description && (
                    <div className="mt-1 line-clamp-2 text-sm text-gray-500">
                      {session.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="mr-1 h-3 w-3" />
                  {formatDateTime(session.startTime)} -{" "}
                  {formatDateTime(session.endTime)}
                </div>
              </TableCell>
              <TableCell>
                {session.room ? (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="mr-1 h-3 w-3" />
                    {session.room}
                  </div>
                ) : (
                  <span className="text-gray-400">Non definita</span>
                )}
              </TableCell>
              <TableCell>
                {session.speaker ? (
                  <div className="flex items-center text-sm text-gray-900">
                    <UserIcon className="mr-1 h-3 w-3" />
                    {session.speaker.firstName} {session.speaker.lastName}
                  </div>
                ) : (
                  <span className="text-gray-400">Nessun relatore</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  className={getStatusColor(session.startTime, session.endTime)}
                >
                  {getStatusText(session.startTime, session.endTime)}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Modifica
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Duplica
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleDeleteSession(session.id)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Elimina
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
