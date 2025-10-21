'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { inviteParticipant } from '@/actions/participantActions';
import { InviteFormSchema } from '@/lib/schema';
import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mail, UserPlus, Loader2 } from 'lucide-react';

interface InviteParticipantFormProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  onSuccess: () => void;
}

export default function InviteParticipantForm({
  isOpen,
  onClose,
  eventId,
  onSuccess,
}: InviteParticipantFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'PARTICIPANT' as 'PARTICIPANT' | 'SPEAKER'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    try {
      const result = await inviteParticipant(eventId, formData);
      
      if (result.error) {
        toast.error(result.error);
        setErrors({ general: result.error });
      } else if (result.success) {
        toast.success(result.success);
        setFormData({ email: '', role: 'PARTICIPANT' });
        onSuccess();
        
        // Invalidate related queries to refresh data
        queryClient.invalidateQueries(['participants', eventId]);
        queryClient.invalidateQueries(['speakers', eventId]);
        
        onClose();
      }
    } catch (error) {
      console.error('Error inviting participant:', error);
      toast.error('Errore durante l\'invito');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleClose = () => {
    setFormData({ email: '', role: 'PARTICIPANT' });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Invita Partecipante
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="mario.rossi@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={isSubmitting}
              required
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Ruolo</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleInputChange('role', value)}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona ruolo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PARTICIPANT">
                  <div className="flex flex-col">
                    <span>Partecipante</span>
                    <span className="text-sm text-gray-500">Può partecipare all'evento</span>
                  </div>
                </SelectItem>
                <SelectItem value="SPEAKER">
                  <div className="flex flex-col">
                    <span>Relatore</span>
                    <span className="text-sm text-gray-500">Può presentare sessioni</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.role && (
              <p className="text-sm text-red-600">{errors.role}</p>
            )}
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          {/* Role Description */}
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
            <p className="font-medium mb-1">Note sull'invito:</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>L'utente deve esistere nel sistema per poter essere invitato</li>
              <li>I partecipanti potranno registrarsi e partecipare all'evento</li>
              <li>I relatori potranno essere assegnati alle sessioni</li>
              <li>L'invito verrà inviato via email (da implementare)</li>
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annulla
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Invio in corso...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invita
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
