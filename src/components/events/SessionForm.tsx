"use client";

import { useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { useForm } from "react-hook-form";

import { createSession } from "@/actions/session-actions";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { SessionFormData, SessionFormSchema } from "@/lib/schema";

interface SessionFormProps {
  eventId: string;
  onFormSubmit: () => void;
  onSessionCreated?: (session: Session) => void;
}

export default function SessionForm({
  eventId,
  onFormSubmit,
  onSessionCreated,
}: SessionFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<SessionFormData>({
    resolver: zodResolver(SessionFormSchema),
    defaultValues: {
      title: "",
      description: "",
      room: "",
      speakerId: "",
      eventId: eventId,
      startTime: undefined,
      endTime: undefined,
    },
  });

  const processForm = async (data: SessionFormData) => {
    startTransition(async () => {
      const result = await createSession(eventId, data);

      if (result.success) {
        onFormSubmit();
        if (onSessionCreated) {
          // In una implementazione reale, dovresti recuperare la sessione completa dal DB
          onSessionCreated({
            id: result.data?.sessionId,
            ...data,
          });
        }
      } else {
        // Gestisci l'errore di business logic specifico
        if (result.errorCode === "SPEAKER_CONFLICT") {
          form.setError("speakerId", {
            type: "custom",
            message: result.error,
          });
        } else {
          form.setError("root", {
            type: "custom",
            message: result.error,
          });
        }
      }
    });
  };

  // Lista mock di speaker - in una implementazione reale, recupereresti dal DB
  const mockSpeakers = [
    { id: "1", name: "Mario Rossi" },
    { id: "2", name: "Giulia Verdi" },
    { id: "3", name: "Paolo Bianchi" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(processForm)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titolo Sessione *</FormLabel>
              <FormControl>
                <Input
                  placeholder="Es: Introduzione a React Hooks"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrizione</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descrizione dettagliata della sessione..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orario Inizio *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy HH:mm", {
                            locale: it,
                          })
                        ) : (
                          <span>Scegli orario...</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          // Imposta l'orario di default alle 9:00
                          const newDate = new Date(date);
                          newDate.setHours(9, 0, 0, 0);
                          field.onChange(newDate);
                        }
                      }}
                      initialFocus
                    />
                    <div className="border-t p-3">
                      <Input
                        type="time"
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const date = field.value || new Date();
                          date.setHours(parseInt(hours), parseInt(minutes));
                          field.onChange(date);
                        }}
                        defaultValue={
                          field.value ? format(field.value, "HH:mm") : "09:00"
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orario Fine *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy HH:mm", {
                            locale: it,
                          })
                        ) : (
                          <span>Scegli orario...</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        if (date) {
                          // Imposta l'orario di default alle 10:00
                          const newDate = new Date(date);
                          newDate.setHours(10, 0, 0, 0);
                          field.onChange(newDate);
                        }
                      }}
                      initialFocus
                    />
                    <div className="border-t p-3">
                      <Input
                        type="time"
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value.split(":");
                          const date = field.value || new Date();
                          date.setHours(parseInt(hours), parseInt(minutes));
                          field.onChange(date);
                        }}
                        defaultValue={
                          field.value ? format(field.value, "HH:mm") : "10:00"
                        }
                      />
                    </div>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sala</FormLabel>
                <FormControl>
                  <Input placeholder="Es: Sala A, Auditorium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="speakerId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Relatore</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona relatore" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Nessun relatore</SelectItem>
                    {mockSpeakers.map((speaker) => (
                      <SelectItem key={speaker.id} value={speaker.id}>
                        {speaker.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.formState.errors.root && (
          <div className="mt-2 text-sm text-red-600">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex justify-end border-t pt-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvataggio..." : "Salva Sessione"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
