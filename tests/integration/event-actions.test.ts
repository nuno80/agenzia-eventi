import { describe, test, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { promises as fs } from "fs";
import { join } from "path";
import {
  getEventDashboardData,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventsList,
  getEventById,
} from "@/actions/event-actions";
import { EventFormSchema } from "@/lib/schema";

// Mock del database per testing
let testDb: Database.Database;
let testDbPath: string;

// Setup e teardown del database di test
beforeEach(async () => {
  // Crea un database temporaneo per ogni test
  testDbPath = join(__dirname, `test-db-${Date.now()}.db`);
  testDb = new Database(testDbPath);
  
  // Applica lo schema completo
  const schemaPath = join(__dirname, "../../../database/schema.sql");
  const schema = await fs.readFile(schemaPath, "utf-8");
  testDb.exec(schema);
  
  // Inserisci dati di test
  testDb.prepare(`
    INSERT INTO users (id, email, first_name, last_name, role) 
    VALUES (?, ?, ?, ?, ?)
  `).run(
    "test-admin-id",
    "admin@test.com",
    "Admin",
    "User",
    "admin"
  );
  
  testDb.prepare(`
    INSERT INTO events (title, description, event_type, location, start_date, end_date, max_participants, price, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "Test Event 1",
    "A test event for integration",
    "conference",
    "Test Location",
    "2024-12-01T09:00:00",
    "2024-12-03T18:00:00",
    100,
    299.99,
    "draft"
  );
});

afterEach(async () => {
  // Chiudi il database e rimuovi il file
  if (testDb) {
    testDb.close();
  }
  if (testDbPath && await fs.access(testDbPath).then(() => true).catch(() => false)) {
    await fs.unlink(testDbPath);
  }
});

// Mock di Clerk currentUser
const mockCurrentUser = (override: any = {}) => ({
  id: "test-admin-id",
  email: "admin@test.com",
  publicMetadata: { role: "admin" },
  ...override,
});

// Mock di getDbInstance per ritornare il test database
const mockGetDbInstance = () => testDb;

describe("Event Actions - Integration Tests", () => {
  
  describe("getEventDashboardData", () => {
    test("should return complete dashboard data for valid event", async () => {
      // Mock delle dipendenze
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      // Ottieni l'ID del primo evento
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      
      const result = await getEventDashboardData(event.id.toString());
      
      expect(result).not.toBeNull();
      expect(result?.event).toMatchObject({
        title: "Test Event 1",
        eventType: "conference",
        location: "Test Location",
        maxParticipants: 100,
        price: 299.99,
        status: "draft",
      });
      
      expect(result?.stats).toHaveProperty("participants");
      expect(result?.stats).toHaveProperty("speakers");
      expect(result?.stats).toHaveProperty("sessions");
      expect(result?.stats).toHaveProperty("budget");
    });
    
    test("should return null for non-existent event", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const result = await getEventDashboardData("99999");
      expect(result).toBeNull();
    });
    
    test("should return null for unauthorized user", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser({ publicMetadata: { role: "user" } })),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      const result = await getEventDashboardData(event.id.toString());
      expect(result).toBeNull();
    });
    
    test("should return null for unauthenticated user", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(null),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      const result = await getEventDashboardData(event.id.toString());
      expect(result).toBeNull();
    });
  });
  
  describe("createEvent", () => {
    test("should create event successfully with valid data", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const eventData = EventFormSchema.parse({
        title: "New Integration Test Event",
        description: "Test event created during integration test",
        eventType: "workshop",
        startDate: new Date("2024-12-15"),
        endDate: new Date("2024-12-17"),
        location: "Integration Test Location",
        maxParticipants: 50,
        price: 199.99,
        status: "draft",
      });
      
      const result = await createEvent(eventData);
      
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data).toMatchObject({
          title: "New Integration Test Event",
          eventType: "workshop",
          location: "Integration Test Location",
          maxParticipants: 50,
          price: 199.99,
          status: "draft",
        });
        
        // Verifica che l'evento sia stato salvato nel database
        const savedEvent = testDb.prepare("SELECT * FROM events WHERE title = ?").get(result.data.title);
        expect(savedEvent).toBeTruthy();
      }
    });
    
    test("should reject event creation with invalid data", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const invalidEventData = {
        title: "NE", // Too short
        eventType: "workshop",
        startDate: new Date("2024-12-15"),
        endDate: new Date("2024-12-17"),
        location: "Test Location",
        maxParticipants: 50,
      };
      
      const result = await createEvent(invalidEventData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toContain("almeno 3 caratteri");
      }
    });
    
    test("should reject event creation for unauthorized user", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser({ publicMetadata: { role: "user" } })),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const validEventData = EventFormSchema.parse({
        title: "Unauthorized Event",
        eventType: "workshop",
        startDate: new Date("2024-12-15"),
        endDate: new Date("2024-12-17"),
        location: "Test Location",
        maxParticipants: 50,
      });
      
      const result = await createEvent(validEventData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("FORBIDDEN");
      }
    });
    
    test("should reject event creation for unauthenticated user", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(null),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const validEventData = EventFormSchema.parse({
        title: "Unauthenticated Event",
        eventType: "workshop",
        startDate: new Date("2024-12-15"),
        endDate: new Date("2024-12-17"),
        location: "Test Location",
        maxParticipants: 50,
      });
      
      const result = await createEvent(validEventData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("UNAUTHORIZED");
      }
    });
  });
  
  describe("updateEvent", () => {
    test("should update event successfully", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      // Ottieni un evento esistente
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      
      const updateData = {
        title: "Updated Test Event",
        description: "Updated description",
        eventType: "seminar" as const,
        startDate: new Date("2024-12-01"),
        endDate: new Date("2024-12-03"),
        location: "Updated Location",
        maxParticipants: 150,
        price: 399.99,
      };
      
      const result = await updateEvent(event.id.toString(), updateData);
      
      expect(result.success).toBe(true);
      
      if (result.success) {
        expect(result.data.title).toBe("Updated Test Event");
        expect(result.data.location).toBe("Updated Location");
        expect(result.data.maxParticipants).toBe(150);
      }
    });
    
    test("should reject update for non-existent event", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const updateData = {
        title: "Updated Non-existent Event",
        eventType: "workshop" as const,
        startDate: new Date("2024-12-15"),
        endDate: new Date("2024-12-17"),
        location: "Test Location",
        maxParticipants: 50,
      };
      
      const result = await updateEvent("99999", updateData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_FOUND");
      }
    });
    
    test("should reject update for unauthorized user", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser({ publicMetadata: { role: "user" } })),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      
      const updateData = {
        title: "Unauthorized Update",
        eventType: "workshop" as const,
        startDate: new Date("2024-12-15"),
        endDate: new Date("2024-12-17"),
        location: "Test Location",
        maxParticipants: 50,
      };
      
      const result = await updateEvent(event.id.toString(), updateData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("FORBIDDEN");
      }
    });
  });
  
  describe("deleteEvent", () => {
    test("should delete event successfully", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      // Crea un evento da eliminare
      const insertEvent = testDb.prepare(`
        INSERT INTO events (title, event_type, location, start_date, end_date, max_participants, price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = insertEvent.run(
        "Event to Delete",
        "conference",
        "Delete Location",
        "2024-12-20T09:00:00",
        "2024-12-22T18:00:00",
        50,
        199.99,
        "draft"
      );
      
      const deleteResult = await deleteEvent(result.lastInsertRowid.toString());
      
      expect(deleteResult.success).toBe(true);
      
      // Verifica che l'evento sia stato eliminato
      const deletedEvent = testDb.prepare("SELECT * FROM events WHERE id = ?").get(result.lastInsertRowid);
      expect(deletedEvent).toBeUndefined();
    });
    
    test("should reject delete for non-existent event", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const result = await deleteEvent("99999");
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_FOUND");
      }
    });
  });
  
  describe("getEventsList", () => {
    test("should return list of events for admin user", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const result = await getEventsList({
        page: 1,
        limit: 10,
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.events).toHaveLength(1);
        expect(result.data.events[0].title).toBe("Test Event 1");
        expect(result.data.pagination).toMatchObject({
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        });
      }
    });
    
    test("should return paginated results", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      // Inserisci più eventi
      for (let i = 2; i <= 25; i++) {
        testDb.prepare(`
          INSERT INTO events (title, event_type, location, start_date, end_date, max_participants, price, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          `Test Event ${i}`,
          "conference",
          `Location ${i}`,
          "2024-12-01T09:00:00",
          "2024-12-03T18:00:00",
          100,
          299.99,
          "draft"
        );
      }
      
      const result = await getEventsList({
        page: 1,
        limit: 5,
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.events).toHaveLength(5);
        expect(result.data.pagination.total).toBe(25);
        expect(result.data.pagination.totalPages).toBe(5);
      }
    });
    
    test("should return empty list for unauthorized user", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser({ publicMetadata: { role: "user" } })),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const result = await getEventsList({
        page: 1,
        limit: 10,
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.events).toHaveLength(0);
        expect(result.data.pagination.total).toBe(0);
      }
    });
  });
  
  describe("getEventById", () => {
    test("should return specific event by ID", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      
      const result = await getEventById(event.id.toString());
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Test Event 1");
        expect(result.data.eventType).toBe("conference");
      }
    });
    
    test("should return error for non-existent event", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: mockGetDbInstance,
      }));
      
      const result = await getEventById("99999");
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_FOUND");
      }
    });
  });
});

describe("Database Connection and Error Handling", () => {
  test("should handle database connection errors gracefully", async () => {
    // Test con un database che non esiste
    const nonExistentDb = new Database("/non-existent/path/test.db");
    
    jest.doMock("@/lib/db", () => ({
      getDbInstance: () => nonExistentDb,
    }));
    
    jest.doMock("@clerk/nextjs/server", () => ({
      currentUser: () => Promise.resolve(mockCurrentUser()),
    }));
    
    const result = await getEventDashboardData("1");
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("INTERNAL_ERROR");
    }
    
    nonExistentDb.close();
  });
  
  test("should handle database query failures", async () => {
    // Mock di un database che lancia eccezioni
    const failingDb = {
      query: () => {
        throw new Error("Query failed");
      },
      prepare: () => {
        throw new Error("Prepare failed");
      },
    };
    
    jest.doMock("@/lib/db", () => ({
      getDbInstance: () => failingDb,
    }));
    
    jest.doMock("@clerk/nextjs/server", () => ({
      currentUser: () => Promise.resolve(mockCurrentUser()),
    }));
    
    const result = await getEventDashboardData("1");
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("INTERNAL_ERROR");
    }
  });
});

describe("Input Validation and Sanitization", () => {
  test("should handle SQL injection attempts", async () => {
    jest.doMock("@clerk/nextjs/server", () => ({
      currentUser: () => Promise.resolve(mockCurrentUser()),
    }));
    
    jest.doMock("@/lib/db", () => ({
      getDbInstance: mockGetDbInstance,
    }));
    
    const maliciousInput = {
      title: "'; DROP TABLE events; --",
      eventType: "conference" as const,
      startDate: new Date("2024-12-15"),
      endDate: new Date("2024-12-17"),
      location: "'; DROP TABLE users; --",
      maxParticipants: 50,
    };
    
    const result = await createEvent(maliciousInput);
    
    expect(result.success).toBe(true);
    
    // Verifica che le tabelle esistano ancora
    const eventsCount = testDb.prepare("SELECT COUNT(*) as count FROM events").get() as { count: number };
    const usersCount = testDb.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
    
    expect(eventsCount.count).toBeGreaterThan(0);
    expect(usersCount.count).toBeGreaterThan(0);
  });
  
  test("should handle extremely long inputs gracefully", async () => {
    jest.doMock("@clerk/nextjs/server", () => ({
      currentUser: () => Promise.resolve(mockCurrentUser()),
    }));
    
    jest.doMock("@/lib/db", () => ({
      getDbInstance: mockGetDbInstance,
    }));
    
    const longString = "a".repeat(1000);
    const veryLongInput = {
      title: longString + "Event",
      eventType: "conference" as const,
      startDate: new Date("2024-12-15"),
      endDate: new Date("2024-12-17"),
      location: longString + "Location",
      maxParticipants: 50,
    };
    
    const result = await createEvent(veryLongInput);
    
    // Dovrebbe fallire per i limiti di lunghezza
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
    }
  });
});
