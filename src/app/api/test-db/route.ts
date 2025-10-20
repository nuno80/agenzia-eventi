import { NextResponse } from "next/server";
import dbInstance from "@/lib/db";

const db = dbInstance(); // IMPORTANTE: Invocare la funzione

export async function GET() {
  try {
    console.log("🔍 API TEST: Checking db type:", typeof db);
    console.log("🔍 API TEST: Checking db.query type:", typeof db?.query);
    
    // Test query
    const events = db.query("SELECT id, title FROM events LIMIT 3");
    const sessions = db.query("SELECT id, title FROM sessions WHERE event_id = 3");
    
    console.log("🔍 API TEST: Events found:", events.length);
    console.log("🔍 API TEST: Sessions found:", sessions.length);
    
    return NextResponse.json({
      success: true,
      data: {
        dbType: typeof db,
        dbQueryType: typeof db?.query,
        events: events.length,
        sessions: sessions.length,
        eventsData: events,
        sessionsData: sessions
      }
    });
  } catch (error) {
    console.error("🔍 API TEST: Error:", error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
