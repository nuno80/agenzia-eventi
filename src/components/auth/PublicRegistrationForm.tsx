'use client';

import { useState } from 'react';
import { registerForEvent } from '@/actions/participantActions';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  User, 
  Mail, 
  Building, 
  CheckCircle,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';

interface PublicRegistrationFormProps {
  eventId: string;
  eventData?: {
    title: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    location: string;
    maxParticipants: number;
    participantsCount: number;
    price?: number;
  };
  onSuccess: () => void;
}

export default function PublicRegistrationForm({
  eventId,
  eventData,
  onSuccess,
}: PublicRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Il nome è richiesto.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Il nome deve contenere almeno 2 caratteri.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'L\'email è richiesta.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Inserisci un indirizzo email valido.';
    }

    if (!termsAccepted) {
      newErrors.terms = 'Devi accettare i termini e le condizioni.';
    }

    if (eventData && eventData.participantsCount >= eventData.maxParticipants) {
      newErrors.capacity = 'L\'evento ha raggiunto il numero massimo di partecipanti.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const result = await registerForEvent(eventId, formData);
      
      if (result.error) {
        toast.error(result.error);
        setErrors({ general: result.error });
      } else if (result.success) {
        toast.success(result.success);
        setFormData({ name: '', email: '', company: '' });
        setTermsAccepted(false);
        onSuccess();
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast.error('Errore durante la registrazione');
      setErrors({ general: 'Errore durante la registrazione. Riprova più tardi.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateCapacityPercentage = () => {
    if (!eventData) return 0;
    return Math.round((eventData.participantsCount / eventData.maxParticipants) * 100);
  };

  const getCapacityColor = () => {
    const percentage = calculateCapacityPercentage();
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Registrazione Evento</CardTitle>
          {eventData && (
            <div className="space-y-2 text-sm text-gray-600">
              <h3 className="font-semibold text-lg text-gray-900">{eventData.title}</h3>
              {eventData.description && (
                <p className="line-clamp-2">{eventData.description}</p>
              )}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(eventData.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{eventData.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className={getCapacityColor()}>
                    {eventData.participantsCount}/{eventData.maxParticipants} partecipanti
                  </span>
                </div>
                {eventData.price && eventData.price > 0 && (
                  <div className="font-semibold">
                    Costo: €{eventData.price}
                  </div>
                )}
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                <User className="h-4 w-4 mr-1 inline" />
                Nome Completo
              </Label>
              <Input
                id="name"
                placeholder="Mario Rossi"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={isSubmitting}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="h-4 w-4 mr-1 inline" />
                Email
              </Label>
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
              <Label htmlFor="company">
                <Building className="h-4 w-4 mr-1 inline" />
                Azienda (opzionale)
              </Label>
              <Input
                id="company"
                placeholder="Nome azienda"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={(checked) => {
                    setTermsAccepted(checked as boolean);
                    if (errors.terms) {
                      setErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors.terms;
                        return newErrors;
                      });
                    }
                  }}
                  disabled={isSubmitting}
                />
                <div className="grid gap-1.5 leading-none">
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accetto i termini e le condizioni
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Accettando dichiari di aver letto e compreso le condizioni di partecipazione all'evento.
                  </p>
                </div>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            {/* Capacity Warning */}
            {eventData && eventData.participantsCount >= eventData.maxParticipants && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ L'evento ha raggiunto il numero massimo di partecipanti. 
                  Non è più possibile registrarsi.
                </p>
              </div>
            )}

            {/* General Error */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting || !termsAccepted}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                  Registrazione in corso...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Registrati all'evento
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
