'use client';

import { useState } from 'react';
import { EventParticipant } from '@/lib/schema';
import { 
  updateParticipantStatus,
  removeParticipant 
} from '@/actions/participantActions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { MoreHorizontal, Trash2, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ParticipantsTableProps {
  participants: EventParticipant[];
  eventId: string;
  onRefresh: () => void;
}

const STATUS_CONFIG = {
  REGISTERED: { label: 'Registrato', color: 'blue' },
  WAITLISTED: { label: 'Lista Attesa', color: 'yellow' },
  CHECKED_IN: { label: 'Check-in', color: 'green' },
  CHECKED_OUT: { label: 'Check-out', color: 'orange' },
  ABSENT: { label: 'Assente', color: 'red' },
} as const;

const BADGE_VARIANTS = {
  blue: 'default',
  yellow: 'secondary',
  green: 'default', // Changed from 'success' to supported variant
  orange: 'secondary', 
  red: 'destructive',
} as const;

export default function ParticipantsTable({ 
  participants, 
  eventId, 
  onRefresh 
}: ParticipantsTableProps) {
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null);

  const handleStatusUpdate = async (participantId: string, newStatus: string) => {
    setUpdatingStatus(participantId);
    
    try {
      const result = await updateParticipantStatus(eventId, participantId, newStatus);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Stato aggiornato con successo');
        onRefresh();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Errore durante l\'aggiornamento dello stato');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDelete = async (participantId: string) => {
    try {
      const result = await removeParticipant(eventId, participantId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Partecipante rimosso con successo');
        onRefresh();
      }
    } catch (error) {
      console.error('Error removing participant:', error);
      toast.error('Errore durante la rimozione');
    } finally {
      setDeleteDialog(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Partecipante</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Stato</TableHead>
              <TableHead>Data Registrazione</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  Nessun partecipante trovato
                </TableCell>
              </TableRow>
            ) : (
              participants.map((participant) => {
                const statusConfig = STATUS_CONFIG[participant.status];
                const badgeVariant = BADGE_VARIANTS[statusConfig.color as keyof typeof BADGE_VARIANTS];
                
                return (
                  <TableRow key={participant.id}>
                    <TableCell className="font-medium">
                      {participant.user.name || 'Nome non disponibile'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        {participant.user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={participant.status}
                        onValueChange={(value) => handleStatusUpdate(participant.id, value)}
                        disabled={updatingStatus === participant.id}
                      >
                        <SelectTrigger className="w-40">
                          <Badge variant={badgeVariant}>
                            {statusConfig.label}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_CONFIG).map(([value, config]) => (
                            <SelectItem key={value} value={value}>
                              <Badge variant={BADGE_VARIANTS[config.color as keyof typeof BADGE_VARIANTS]}>
                                {config.label}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {formatDate(participant.registeredAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => setDeleteDialog(participant.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Rimuovi
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={!!deleteDialog} 
        onOpenChange={() => setDeleteDialog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Conferma Rimozione</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler rimuovere questo partecipante dall'evento? 
              Questa azione non può essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteDialog && handleDelete(deleteDialog)}
              className="bg-red-600 hover:bg-red-700"
            >
              Rimuovi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
