"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Clock,
  DollarSign,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { createEvent } from "@/actions/event-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_TYPES, EventFormSchema } from "@/lib/schema";

type EventFormData = z.infer<typeof EventFormSchema>;

export default function CreateEventForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EventFormData>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      eventType: "conference",
      location: "",
      maxParticipants: 50,
      price: 0,
      startDate: undefined,
      endDate: undefined,
    },
  });

  async function onSubmit(values: EventFormData) {
    setIsSubmitting(true);

    try {
      const result = await createEvent(values);
      if (result.success) {
        router.push("/admin/events");
        router.refresh();
      } else {
        // Handle error
        form.setError("root", {
          message: result.error || "Errore durante la creazione dell'evento",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Titolo Evento
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Inserisci un titolo per l'evento"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Il titolo deve essere descrittivo e facile da ricordare.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Event Type */}
            <FormField
              control={form.control}
              name="eventType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Tipo Evento
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona tipo evento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EVENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "conference"
                            ? "Conferenza"
                            : type === "workshop"
                              ? "Workshop"
                              : type === "seminar"
                                ? "Seminario"
                                : type === "training"
                                  ? "Formazione"
                                  : type === "webinar"
                                    ? "Webinar"
                                    : type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Dove si terrà l'evento?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date & Time */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Data Inizio
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        value={
                          field.value
                            ? new Date(field.value).toISOString().slice(0, 16)
                            : ""
                        }
                        onChange={(e) => {
                          const dateStr = e.target.value;
                          if (dateStr) {
                            const date = new Date(dateStr);
                            field.onChange(date);
                          } else {
                            field.onChange(undefined);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Data Fine
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        value={
                          field.value
                            ? new Date(field.value).toISOString().slice(0, 16)
                            : ""
                        }
                        onChange={(e) => {
                          const dateStr = e.target.value;
                          if (dateStr) {
                            const date = new Date(dateStr);
                            field.onChange(date);
                          } else {
                            field.onChange(undefined);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Participants & Price */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="maxParticipants"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Max Partecipanti
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Numero massimo di partecipanti
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Prezzo (€)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        min="0"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Lascia 0 per evento gratuito
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrizione Evento</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrivi il tuo evento in dettaglio..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Fornisci una descrizione dettagliata per attirare
                    partecipanti.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Form Error */}
        {form.formState.errors.root && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700">
            {form.formState.errors.root.message}
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Annulla
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creazione in corso..." : "Crea Evento"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
