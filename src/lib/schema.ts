import { z } from "zod";

// 1. Event Statuses - Enum per stati evento
export const EVENT_STATUSES = [
  "draft",
  "published",
  "in_progress",
  "completed",
  "cancelled",
  "postponed",
] as const;
export const EventStatusSchema = z.enum(EVENT_STATUSES);
export type EventStatus = z.infer<typeof EventStatusSchema>;

// 2. Event Types - Enum per tipi evento
export const EVENT_TYPES = [
  "conference",
  "workshop",
  "seminar",
  "training",
  "webinar",
] as const;
export const EventTypeSchema = z.enum(EVENT_TYPES);
export type EventType = z.infer<typeof EventTypeSchema>;

// 3. Participant Statuses - Enum per stati partecipanti
export const PARTICIPANT_STATUSES = [
  "registered",
  "checked_in",
  "checked_out",
  "cancelled",
  "no_show",
] as const;
export const ParticipantStatusSchema = z.enum(PARTICIPANT_STATUSES);
export type ParticipantStatus = z.infer<typeof ParticipantStatusSchema>;

// 4. Session Statuses - Enum per stati sessioni
export const SESSION_STATUSES = [
  "scheduled",
  "ongoing",
  "completed",
  "cancelled",
] as const;
export const SessionStatusSchema = z.enum(SESSION_STATUSES);
export type SessionStatus = z.infer<typeof SessionStatusSchema>;

// 5. Budget Categories - Enum per categorie budget
export const BUDGET_CATEGORIES = [
  "venue",
  "catering",
  "equipment",
  "staff",
  "marketing",
  "travel",
  "other",
] as const;
export const BudgetCategorySchema = z.enum(BUDGET_CATEGORIES);
export type BudgetCategory = z.infer<typeof BudgetCategorySchema>;

// 6. Budget Statuses - Enum per stati budget
export const BUDGET_STATUSES = [
  "planned",
  "committed",
  "paid",
  "cancelled",
] as const;
export const BudgetStatusSchema = z.enum(BUDGET_STATUSES);
export type BudgetStatus = z.infer<typeof BudgetStatusSchema>;

// 7. Reimbursement Statuses - Enum per stati rimborsi
export const REIMBURSEMENT_STATUSES = [
  "pending",
  "submitted",
  "approved",
  "rejected",
  "paid",
  "cancelled",
] as const;
export const ReimbursementStatusSchema = z.enum(REIMBURSEMENT_STATUSES);
export type ReimbursementStatus = z.infer<typeof ReimbursementStatusSchema>;

// 8. Target Audience Types - Enum per target comunicazioni
export const TARGET_AUDIENCES = [
  "all",
  "participants",
  "speakers",
  "sponsors",
  "admins",
] as const;
export const TargetAudienceSchema = z.enum(TARGET_AUDIENCES);
export type TargetAudience = z.infer<typeof TargetAudienceSchema>;

// 9. User Roles - Enum per ruoli utente
export const USER_ROLES = ["admin", "manager", "user"] as const;
export const UserRoleSchema = z.enum(USER_ROLES);
export type UserRole = z.infer<typeof UserRoleSchema>;

// 10. Schema validazione per creazione/modifica evento
export const EventFormSchema = z
  .object({
    title: z
      .string()
      .min(3, {
        message: "Il titolo deve contenere almeno 3 caratteri.",
      })
      .max(200, {
        message: "Il titolo non può superare i 200 caratteri.",
      }),
    description: z
      .string()
      .max(2000, {
        message: "La descrizione non può superare i 2000 caratteri.",
      })
      .optional(),
    eventType: EventTypeSchema,
    startDate: z.date({
      required_error: "La data di inizio è richiesta.",
    }),
    endDate: z.date({
      required_error: "La data di fine è richiesta.",
    }),
    location: z
      .string()
      .min(3, {
        message: "La location deve contenere almeno 3 caratteri.",
      })
      .max(500, {
        message: "La location non può superare i 500 caratteri.",
      }),
    maxParticipants: z.coerce.number().int().positive({
      message:
        "Il numero massimo di partecipanti deve essere un numero positivo.",
    }),
    price: z
      .number()
      .nonnegative({
        message: "Il prezzo deve essere un numero non negativo.",
      })
      .optional(),
    status: EventStatusSchema.default("draft").optional(),
  })
  .refine(
    (data) => {
      if (data.startDate >= data.endDate) {
        return {
          code: "INVALID_DATE_RANGE",
          message:
            "La data di fine deve essere successiva alla data di inizio.",
          path: ["endDate"],
        };
      }
      return data;
    },
    {
      errorMap: (issue, ctx) => {
        if (issue.code === "too_small") {
          return { message: "Campo troppo corto" };
        }
        return { message: ctx.defaultError };
      },
    }
  );

export type EventFormData = z.infer<typeof EventFormSchema>;

// 11. Schema validazione per sessione evento
export const SessionFormSchema = z
  .object({
    title: z
      .string()
      .min(3, "Il titolo è troppo corto.")
      .max(200, "Il titolo è troppo lungo."),
    description: z
      .string()
      .max(1000, "La descrizione è troppo lunga.")
      .optional(),
    startTime: z.date({
      required_error: "L'orario di inizio è richiesto.",
    }),
    endTime: z.date({
      required_error: "L'orario di fine è richiesto.",
    }),
    room: z
      .string()
      .max(100, "La sala non può superare 100 caratteri.")
      .optional(),
    speakerId: z.string().uuid("ID relatore non valido.").optional(),
    eventId: z.string().uuid("ID evento non valido."),
  })
  .refine((data) => {
    if (data.startTime >= data.endTime) {
      return {
        code: "INVALID_TIME_RANGE",
        message:
          "L'orario di fine deve essere successivo all'orario di inizio.",
        path: ["endTime"],
      };
    }
    return data;
  });

export type SessionFormData = z.infer<typeof SessionFormSchema>;

// 12. Schema validazione per partecipante
export const ParticipantFormSchema = z.object({
  eventId: z.string().uuid("ID evento non valido."),
  userId: z.string().uuid("ID utente non valido."),
  status: ParticipantStatusSchema.default("registered").optional(),
  notes: z
    .string()
    .max(500, "Le note non possono superare 500 caratteri.")
    .optional(),
});

export type ParticipantFormData = z.infer<typeof ParticipantFormSchema>;

// 13. Schema validazione per budget item
export const BudgetItemFormSchema = z.object({
  eventId: z.string().uuid("ID evento non valido."),
  category: BudgetCategorySchema,
  description: z.string().max(255, "La descrizione è troppo lunga.").optional(),
  budgetedAmount: z.number().positive({
    message: "L'importo budget deve essere un numero positivo.",
  }),
  actualAmount: z
    .number()
    .nonnegative({
      message: "L'importo effettivo non può essere negativo.",
    })
    .default(0),
  status: BudgetStatusSchema.default("planned").optional(),
});

export type BudgetItemFormData = z.infer<typeof BudgetItemFormSchema>;

// 14. Schema validazione per annuncio evento
export const AnnouncementFormSchema = z.object({
  eventId: z.string().uuid("ID evento non valido."),
  title: z
    .string()
    .min(3, "Il titolo deve contenere almeno 3 caratteri.")
    .max(200, "Il titolo è troppo lungo."),
  content: z
    .string()
    .min(10, "Il contenuto è troppo breve.")
    .max(5000, "Il contenuto è troppo lungo."),
  targetAudience: TargetAudienceSchema.default("all").optional(),
  isEmailSent: z.boolean().default(false).optional(),
});

export type AnnouncementFormData = z.infer<typeof AnnouncementFormSchema>;

// 15. Schema validazione per richiesta rimborso
export const ReimbursementFormSchema = z.object({
  eventId: z.string().uuid("ID evento non valido."),
  speakerId: z.string().uuid("ID relatore non valido."),
  description: z
    .string()
    .min(10, "La descrizione è troppo breve.")
    .max(500, "La descrizione è troppo lunga."),
  amount: z.number().positive({
    message: "L'importo deve essere un numero positivo.",
  }),
  currency: z.string().default("EUR").optional(),
  receiptUrl: z.string().url("URL non valido.").optional(),
  status: ReimbursementStatusSchema.default("pending").optional(),
  adminNotes: z
    .string()
    .max(1000, "Le note admin sono troppo lunghe.")
    .optional(),
});

export type ReimbursementFormData = z.infer<typeof ReimbursementFormSchema>;

// 16. Schema validazione per query e filtri
export const EventSearchSchema = z.object({
  search: z.string().optional(),
  eventType: EventTypeSchema.optional(),
  status: EventStatusSchema.optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type EventSearchParams = z.infer<typeof EventSearchSchema>;

export const ParticipantSearchSchema = z.object({
  eventId: z.string().uuid("ID evento non valido."),
  status: ParticipantStatusSchema.optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type ParticipantSearchParams = z.infer<typeof ParticipantSearchSchema>;

// 17. Schema validazione analytics
export const AnalyticsQuerySchema = z.object({
  eventId: z.string().uuid("ID evento non valido."),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export type AnalyticsQueryParams = z.infer<typeof AnalyticsQuerySchema>;

// 18. Types derivati dal database (eventualmente da generare automaticamente da ORM)
// Questi tipi rappresentano la struttura dei dati nel database SQLite

export interface User {
  id: string; // Clerk user ID
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  eventType: EventType;
  startDate: Date;
  endDate: Date;
  location: string;
  maxParticipants: number;
  price: number;
  status: EventStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: number;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  room: string | null;
  speakerId: string | null;
  eventId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Participant {
  id: number;
  eventId: number;
  userId: string; // Clerk user ID
  registrationDate: Date;
  status: ParticipantStatus;
  notes: string | null;
  createdAt: Date;
}

export interface EventAdmin {
  id: number;
  eventId: number;
  userId: string; // Clerk user ID
  createdAt: Date;
}

export interface Budget {
  id: number;
  eventId: number;
  category: BudgetCategory;
  description: string | null;
  budgetedAmount: number;
  actualAmount: number;
  status: BudgetStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface Announcement {
  id: number;
  eventId: number;
  title: string;
  content: string;
  targetAudience: TargetAudience;
  isEmailSent: boolean;
  createdBy: string; // Clerk user ID
  createdAt: Date;
  updatedAt: Date;
}

export interface TravelReimbursement {
  id: number;
  speakerId: string; // Clerk user ID
  eventId: number;
  description: string;
  amount: number;
  currency: string;
  status: ReimbursementStatus;
  receiptUrl: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// 19. Types per Dashboard e API responses

export interface EventDashboardData {
  event: Event;
  stats: {
    participants: {
      registered: number;
      total: number;
      checkedIn: number;
    };
    speakers: {
      confirmed: number;
      pending: number;
    };
    sessions: {
      total: number;
      scheduled: number;
      completed: number;
      cancelled: number;
    };
    budget: {
      totalBudget: number;
      totalSpent: number;
      remaining: number;
    };
  };
}

export interface EventListResponse {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ParticipantListResponse {
  participants: (Participant & {
    user?: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
  })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SessionListResponse {
  sessions: (Session & {
    speaker?: {
      firstName: string | null;
      lastName: string | null;
      email: string;
    };
  })[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

// 20. Costanti e configurazioni
export const PAGINATION_DEFAULTS = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const VALIDATIONS = {
  EVENT_TITLE_MIN: 3,
  EVENT_TITLE_MAX: 200,
  EVENT_DESCRIPTION_MAX: 2000,
  SESSION_TITLE_MIN: 3,
  SESSION_TITLE_MAX: 200,
  SESSION_DESCRIPTION_MAX: 1000,
  PARTICIPIPANT_NOTES_MAX: 500,
  BUDGET_DESCRIPTION_MAX: 255,
  ANNOUNCEMENT_TITLE_MIN: 3,
  ANNOUNCEMENT_TITLE_MAX: 200,
  ANNOUNCEMENT_CONTENT_MIN: 10,
  ANNOUNCEMENT_CONTENT_MAX: 5000,
  REIMBURSEMENT_DESCRIPTION_MIN: 10,
  REIMBURSEMENT_DESCRIPTION_MAX: 500,
  REIMBURSEMENT_ADMIN_NOTES_MAX: 1000,
  LOCATION_MIN: 3,
  LOCATION_MAX: 500,
  EVENT_MAX_PRICE: 999999.99,
} as const;

// 21. Helper functions per validazione
export const validateDateRange = (startDate: Date, endDate: Date) => {
  return startDate < endDate;
};

export const validateEventCapacity = (
  currentParticipants: number,
  maxParticipants: number
) => {
  return currentParticipants <= maxParticipants;
};

export const validateSessionOverlap = (
  existingSessions: Array<{ startTime: Date; endTime: Date }>,
  newSession: { startTime: Date; endTime: Date }
) => {
  return existingSessions.some(
    (session) =>
      session.startTime < newSession.endTime &&
      session.endTime > newSession.startTime
  );
};

// 22. Type guards per runtime type checking
export const isEventStatus = (status: unknown): status is EventStatus =>
  EVENT_STATUSES.includes(status as EventStatus);

export const isEventType = (type: unknown): type is EventType =>
  EVENT_TYPES.includes(type as EventType);

export const isUserRole = (role: unknown): role is UserRole =>
  USER_ROLES.includes(role as UserRole);

export const isValidEventId = (id: unknown): id is string =>
  typeof id === "string" && id.length > 0;

// 23. Utility functions per data transformation
export const formatEventDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("it-IT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const formatDateTime = (date: Date): string => {
  return new Date(date).toLocaleString("it-IT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (
  amount: number,
  currency: string = "EUR"
): string => {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const calculateEventProgress = (
  participants: number,
  maxParticipants: number
): number => {
  if (maxParticipants === 0) return 0;
  return Math.round((participants / maxParticipants) * 100);
};

// 24. Error types per gestione centralizzata
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

export class DatabaseError extends Error {
  constructor(
    message: string,
    public operation?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = "DatabaseError";
  }
}

export class AuthorizationError extends Error {
  constructor(
    message: string,
    public operation?: string,
    public userId?: string
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

// 25. Export di tutti i tipi e schemi per uso esterno
export const Schemas = {
  EventForm: EventFormSchema,
  EventSearch: EventSearchSchema,
  SessionForm: SessionFormSchema,
  ParticipantForm: ParticipantFormSchema,
  BudgetItem: BudgetItemFormSchema,
  Announcement: AnnouncementFormSchema,
  Reimbursement: ReimbursementFormSchema,
  ParticipantSearch: ParticipantSearchSchema,
  AnalyticsQuery: AnalyticsQuerySchema,
} as const;

export const Enums = {
  EventStatus: EVENT_STATUSES,
  EventType: EVENT_TYPES,
  ParticipantStatus: PARTICIPANT_STATUSES,
  SessionStatus: SESSION_STATUSES,
  BudgetCategory: BUDGET_CATEGORIES,
  BudgetStatus: BUDGET_STATUSES,
  ReimbursementStatus: REIMBURSEMENT_STATUSES,
  TargetAudience: TARGET_AUDIENCES,
  UserRole: USER_ROLES,
  Validation: VALIDATIONS,
  Pagination: PAGINATION_DEFAULTS,
} as const;
