import { describe, test, expect, beforeEach, afterEach } from "vitest";
import Database from "better-sqlite3";
import { promises as fs } from "fs";
import { join } from "path";
import {
  createSession,
  updateSession,
  deleteSession,
  getEventSessions,
  getSessionById,
  checkSpeakerAvailability,
} from "@/actions/session-actions";
import { SessionFormSchema } from "@/lib/schema";

let testDb: Database.Database;
let testDbPath: string;

beforeEach(async () => {
  testDbPath = join(__dirname, `test-db-${Date.now()}.db`);
  testDb = new Database(testDbPath);
  
  const schemaPath = join(__dirname, "../../../database/schema.sql");
  const schema = await fs.readFile(schemaPath, "utf-8");
  testDb.exec(schema);
  
  // Setup test data
  testDb.prepare(`
    INSERT INTO users (id, email, first_name, last_name, role) 
    VALUES (?, ?, ?, ?, ?)
  `).run(
    "speaker-1",
    "speaker@test.com",
    "John",
    "Speaker",
    "user"
  );
  
  testDb.prepare(`
    INSERT INTO users (id, email, first_name, last_name, role) 
    VALUES (?, ?, ?, ?, ?)
  `).run(
    "admin-1",
    "admin@test.com",
    "Admin",
    "User",
    "admin"
  );
  
  const eventResult = testDb.prepare(`
    INSERT INTO events (title, description, event_type, location, start_date, end_date, max_participants, price, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "Test Event",
    "A test event",
    "conference",
    "Test Location",
    "2024-12-01T09:00:00",
    "2024-12-03T18:00:00",
    100,
    299.99,
    "published"
  );
  
  // Aggiungi una session esistente per test overlap
  testDb.prepare(`
    INSERT INTO sessions (title, description, start_time, end_time, room, speaker_id, event_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    "Existing Session",
    "An existing session",
    "2024-12-01T10:00:00",
    "2024-12-01T11:30:00",
    "Room 201",
    "speaker-1",
    eventResult.lastInsertRowid
  );
});

afterEach(async () => {
  if (testDb) {
    testDb.close();
  }
  if (testDbPath && await fs.access(testDbPath).then(() => true).catch(() => false)) {
    await fs.unlink(testDbPath);
  }
});

const mockCurrentUser = (override: any = {}) => ({
  id: "admin-1",
  email: "admin@test.com",
  publicMetadata: { role: "admin" },
  ...override,
});

describe("Session Actions - Integration Tests", () => {
  
  describe("createSession", () => {
    test("should create session successfully with valid data", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      
      const sessionData = SessionFormSchema.parse({
        title: "New Test Session",
        description: "A new test session",
        startTime: new Date("2024-12-01T14:00:00"),
        endTime: new Date("2024-12-01T15:30:00"),
        room: "Room 202",
        speakerId: "speaker-1",
        eventId: event.id.toString(),
      });
      
      const result = await createSession(sessionData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("New Test Session");
        expect(result.data.room).toBe("Room 202");
        expect(result.data.speakerId).toBe("speaker-1");
      }
    });
    
    test("should reject session with time overlap for same speaker", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      
      // This session overlaps with the existing one (10:00-11:30)
      const overlappingSession = {
        title: "Overlapping Session",
        startTime: new Date("2024-12-01T10:30:00"), // Overlaps at 10:30-11:30
        endTime: new Date("2024-12-01T12:00:00"),
        speakerId: "speaker-1",
        eventId: event.id.toString(),
      };
      
      const result = await createSession(overlappingSession);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("SPEAKER_CONFLICT");
        expect(result.error.message).toContain("occupato in questo orario");
      }
    });
    
    test("allow session for same speaker in different time slot", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      
      // This session doesn't overlap with existing one (10:00-11:30)
      const nonOverlappingSession = {
        title: "Non-overlapping Session",
        startTime: new Date("2024-12-01T12:00:00"), // Starts after existing session ends
        endTime: new Date("2024-12-01T13:30:00"),
        speakerId: "speaker-1",
        eventId: event.id.toString(),
      };
      
      const result = await createSession(nonOverlappingSession);
      
      expect(result.success).toBe(true);
    });
    
    test("should reject session with end time before start time", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      
      const invalidSession = {
        title: "Invalid Time Session",
        startTime: new Date("2024-12-01T14:00:00"),
        endTime: new Date("2024-12-01T13:00:00"), // End before start
        eventId: event.id.toString(),
      };
      
      const result = await createSession(invalidSession);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("VALIDATION_ERROR");
        expect(result.error.message).toContain("successivo all'orario di inizio");
      }
    });
    
    test("should reject session creation for non-existent event", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const sessionData = SessionFormSchema.parse({
        title: "Session for Non-existent Event",
        startTime: new Date("2024-12-01T14:00:00"),
        endTime: new Date("2024-12-01T15:30:00"),
        eventId: "99999", // Non-existent event ID
      });
      
      const result = await createSession(sessionData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_FOUND");
      }
    });
    
    test("should reject session creation for unauthorized user", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser({ publicMetadata: { role: "user" } })),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      
      const sessionData = SessionFormSchema.parse({
        title: "Unauthorized Session",
        startTime: new Date("2024-12-01T14:00:00"),
        endTime: new Date("2024-12-01T15:30:00"),
        eventId: event.id.toString(),
      });
      
      const result = await createSession(sessionData);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("FORBIDDEN");
      }
    });
  });
  
  describe("updateSession", () => {
    test("should update session successfully", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const session = testDb.prepare("SELECT id FROM sessions LIMIT 1").get() as { id: number };
      
      const updateData = {
        title: "Updated Session Title",
        description: "Updated description",
        startTime: new Date("2024-12-02T09:00:00"),
        endTime: new Date("2024-12-02T10:30:00"),
        room: "Updated Room",
      };
      
      const result = await updateSession(session.id.toString(), updateData);
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Updated Session Title");
        expect(result.data.room).toBe("Updated Room");
      }
    });
    
    test("should detect conflicts during session update", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      // Create a second session that doesn't overlap
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      const insertResult = testDb.prepare(`
        INSERT INTO sessions (title, description, start_time, end_time, room, speaker_id, event_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        "Second Session",
        "Another session",
        "2024-12-01T14:00:00",
        "2024-12-01T15:30:00",
        "Room 202",
        "speaker-1",
        event.id
      );
      
      // Try to update the original session to conflict with the new one
      const conflictingUpdate = {
        startTime: new Date("2024-12-01T14:30:00"), // Overlaps with second session
        endTime: new Date("2024-12-01T16:00:00"),
      };
      
      const result = await updateSession(insertResult.lastInsertRowid.toString(), conflictingUpdate);
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("SPEAKER_CONFLICT");
      }
    });
  });
  
  describe("deleteSession", () => {
    test("should delete session successfully", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const session = testDb.prepare("SELECT id FROM sessions LIMIT 1").get() as { id: number };
      
      const result = await deleteSession(session.id.toString());
      
      expect(result.success).toBe(true);
      
      // Verify session is deleted
      const deletedSession = testDb.prepare("SELECT * FROM sessions WHERE id = ?").get(session.id);
      expect(deletedSession).toBeUndefined();
    });
    
    test("should reject delete for non-existent session", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const result = await deleteSession("99999");
      
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.code).toBe("NOT_FOUND");
      }
    });
  });
  
  describe("getEventSessions", () => {
    test("should return all sessions for an event", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      
      const result = await getEventSessions(event.id.toString(), {
        page: 1,
        limit: 10,
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sessions).toHaveLength(1);
        expect(result.data.sessions[0].title).toBe("Existing Session");
        expect(result.data.pagination.total).toBe(1);
      }
    });
    
    test("should return paginated sessions", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
      
      // Add more sessions
      for (let i = 2; i <= 15; i++) {
        testDb.prepare(`
          INSERT INTO sessions (title, description, start_time, end_time, room, event_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          `Session ${i}`,
          `Description for session ${i}`,
          "2024-12-01T14:00:00",
          "2024-12-01T15:30:00",
          `Room ${200 + i}`,
          event.id
        );
      }
      
      const result = await getEventSessions(event.id.toString(), {
        page: 1,
        limit: 5,
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sessions).toHaveLength(5);
        expect(result.data.pagination.total).toBe(15);
        expect(result.data.pagination.totalPages).toBe(3);
      }
    });
    
    test("should return empty result for event with no sessions", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      // Create a new event with no sessions
      const eventResult = testDb.prepare(`
        INSERT INTO events (title, description, event_type, location, start_date, end_date, max_participants, price, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        "Empty Event",
        "Event with no sessions",
        "conference",
        "Empty Location",
        "2024-12-15T09:00:00",
        "2024-12-17T18:00:00",
        50,
        199.99,
        "draft"
      );
      
      const result = await getEventSessions(eventResult.lastInsertRowid.toString(), {
        page: 1,
        limit: 10,
      });
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sessions).toHaveLength(0);
        expect(result.data.pagination.total).toBe(0);
      }
    });
  });
  
  describe("checkSpeakerAvailability", () => {
    test("should return availability for speaker with no conflicts", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const result = await checkSpeakerAvailability(
        "speaker-1",
        new Date("2024-12-01T14:00:00"),
        new Date("2024-12-01T15:30:00")
      );
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isAvailable).toBe(true);
        expect(result.data.conflicts).toHaveLength(0);
      }
    });
    
    test("should detect conflicts for speaker", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      // This time overlaps with existing session (10:00-11:30)
      const result = await checkSpeakerAvailability(
        "speaker-1",
        new Date("2024-12-01T10:30:00"),
        new Date("2024-12-01T12:00:00")
      );
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isAvailable).toBe(false);
        expect(result.data.conflicts).toHaveLength(1);
        expect(result.data.conflicts[0].title).toBe("Existing Session");
      }
    });
    
    test("should return availability for speaker with no existing sessions", async () => {
      jest.doMock("@clerk/nextjs/server", () => ({
        currentUser: () => Promise.resolve(mockCurrentUser()),
      }));
      
      jest.doMock("@/lib/db", () => ({
        getDbInstance: () => testDb,
      }));
      
      const result = await checkSpeakerAvailability(
        "non-existent-speaker", // Speaker with no sessions
        new Date("2024-12-01T14:00:00"),
        new Date("2024-12-01T15:30:00")
      );
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isAvailable).toBe(true);
        expect(result.data.conflicts).toHaveLength(0);
      }
    });
  });
});

describe("Session Validation and Edge Cases", () => {
  test("should handle sessions with different room assignments", async () => {
    jest.doMock("@clerk/nextjs/server", () => ({
      currentUser: () => Promise.resolve(mockCurrentUser()),
    }));
    
    jest.doMock("@/lib/db", () => ({
      getDbInstance: () => testDb,
    }));
    
    const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
    
    // Create sessions in different rooms with same time (should be allowed)
    const session1Data = {
      title: "Room 201 Session",
      startTime: new Date("2024-12-02T09:00:00"),
      endTime: new Date("2024-12-02T10:30:00"),
      room: "Room 201",
      speakerId: "speaker-1",
      eventId: event.id.toString(),
    };
    
    const session2Data = {
      title: "Room 202 Session",
      startTime: new Date("2024-12-02T09:00:00"), // Same time
      endTime: new Date("2024-12-02T10:30:00"),
      room: "Room 202",
      eventId: event.id.toString(),
    };
    
    const result1 = await createSession({ ...session1Data, title: session1Data.title, speakerId: session1Data.speakerId });
    const result2 = await createSession({ ...session2Data, title: session2Data.title });
    
    expect(result1.success).toBe(true);
    expect(result2.success).toBe(true);
  });
  
  test("should handle sessions immediately adjacent in time", async () => {
    jest.doMock("@clerk/nextjs/server", () => ({
      currentUser: () => Promise.resolve(mockCurrentUser()),
    }));
    
    jest.doMock("@/lib/db", () => ({
      getDbInstance: () => testDb,
    }));
    
    const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
    
    // Session that ends exactly when another starts for same speaker (should be allowed)
    const adjacentSession = {
      title: "Adjacent Session",
      startTime: new Date("2024-12-01T11:30:00"), // Exactly when existing session ends
      endTime: new Date("2024-12-01T13:00:00"),
      speakerId: "speaker-1",
      eventId: event.id.toString(),
    };
    
    const result = await createSession(adjacentSession);
    
    expect(result.success).toBe(true);
  });
  
  test("should handle sessions with no speaker assigned", async () => {
    jest.doMock("@clerk/nextjs/server", () => ({
      currentUser: () => Promise.resolve(mockCurrentUser()),
    }));
    
    jest.doMock("@/lib/db", () => ({
      getDbInstance: () => testDb,
    }));
    
    const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
    
    // Session without speaker (optional field)
    const noSpeakerSession = {
      title: "No Speaker Session",
      startTime: new Date("2024-12-01T10:30:00"),
      endTime: new Date("2024-12-01T12:00:00"),
      room: "Room 203",
      eventId: event.id.toString(),
    };
    
    const result = await createSession(noSpeakerSession);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.speakerId).toBeNull();
    }
  });
  
  test("should handle sessions with extremely long titles/descriptions", async () => {
    jest.doMock("@clerk/nextjs/server", () => ({
      currentUser: () => Promise.resolve(mockCurrentUser()),
    }));
    
    jest.doMock("@/lib/db", () => ({
      getDbInstance: () => testDb,
    }));
    
    const event = testDb.prepare("SELECT id FROM events LIMIT 1").get() as { id: number };
    const longTitle = "a".repeat(300); // Exceeds 200 char limit
    const longDescription = "a".repeat(1500); // Exceeds 1000 char limit
    
    const longSession = {
      title: longTitle,
      description: longDescription,
      startTime: new Date("2024-12-01T14:00:00"),
      endTime: new Date("2024-12-01T15:30:00"),
      eventId: event.id.toString(),
    };
    
    const result = await createSession(longSession);
    
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
    }
  });
});
