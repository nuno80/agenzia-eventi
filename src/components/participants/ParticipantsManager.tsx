'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getParticipants } from '@/actions/participantActions';
import { EventParticipant } from '@/lib/schema';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Users, 
  Upload, 
  Download, 
  Mail, 
  UserPlus,
  Trash2,
  RefreshCw,
  Search
} from 'lucide-react';
import ParticipantsTable from './ParticipantsTable';
import ImportModal from './ImportModal';
import InviteParticipantForm from './InviteParticipantForm';

interface ParticipantsManagerProps {
  eventId: string;
  initialData: { data: EventParticipant[]; total: number };
}

const PARTICIPANT_STATUSES = [
  { value: 'REGISTERED', label: 'Registrati', color: 'blue' },
  { value: 'WAITLISTED', label: 'In Lista', color: 'yellow' },
  { value: 'CHECKED_IN', label: 'Check-in', color: 'green' },
  { value: 'CHECKED_OUT', label: 'Check-out', color: 'orange' },
  { value: 'ABSENT', label: 'Assenti', color: 'red' },
];

export default function ParticipantsManager({ 
  eventId, 
  initialData 
}: ParticipantsManagerProps) {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // TanStack Query gestisce il data fetching, caching e re-fetching
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['participants', eventId, page, searchQuery, statusFilter],
    queryFn: () => getParticipants(eventId, { 
      page, 
      searchQuery: searchQuery || undefined, 
      status: statusFilter || undefined 
    }),
    initialData: initialData,
    placeholderData: (previousData) => previousData,
    enabled: true,
  });

  const totalPages = Math.ceil((data?.total ?? 0) / 10);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1); // Reset page to 1 when searching
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setPage(1); // Reset page to 1 when filtering
  };

  return (
    <div className="space-y-6">
      {/* Header Stats and Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partecipanti</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.total ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Check-in</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.data?.filter(p => p.status === 'CHECKED_IN').length ?? 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lista Attesa</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data?.data?.filter(p => p.status === 'WAITLISTED').length ?? 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cerca partecipanti..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select 
            value={statusFilter} 
            onValueChange={handleStatusFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filtra per stato" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tutti gli stati</SelectItem>
              {PARTICIPANT_STATUSES.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{status.label}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => setIsInviteModalOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Invita
          </Button>
          <Button variant="secondary" onClick={() => setIsImportModalOpen(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importa CSV
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Esporta
          </Button>
        </div>
      </div>

      {/* Participants Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista Partecipanti</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <ParticipantsTable 
              participants={data?.data ?? []} 
              eventId={eventId}
              onRefresh={refetch}
            />
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Pagina {page} di {totalPages} ({data?.total ?? 0} totali)
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
            >
              Precedente
            </Button>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
            >
              Successivo
            </Button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ImportModal 
        isOpen={isImportModalOpen} 
        onClose={() => setIsImportModalOpen(false)}
        eventId={eventId}
        onSuccess={() => refetch()}
      />

      <InviteParticipantForm
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        eventId={eventId}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
