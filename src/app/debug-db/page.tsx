import dbInstance from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

const db = dbInstance();

export default async function DebugDbPage() {
  try {
    const { userId } = await auth();
    
    console.log("🔍 DEBUG: DebugDbPage called");
    console.log("🔍 DEBUG: db type:", typeof db);
    console.log("🔍 DEBUG: db.query type:", typeof db?.query);
    
    // Test query per vedere se db funziona
    const events = db.query("SELECT id, title FROM events LIMIT 3");
    const sessions = db.query("SELECT id, title FROM sessions WHERE event_id = 3");
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">DEBUG DATABASE</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold">User Status</h2>
            <p>Logged in: {userId ? "Yes" : "No"}</p>
            <p>User ID: {userId}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold">Database Connection</h2>
            <p>db type: {typeof db}</p>
            <p>db.query type: {typeof db?.query}</p>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold">Events ({events.length} total)</h2>
            <ul className="list-disc list-inside">
              {events.map((event, i) => (
                <li key={i}>
                  ID: {event.id} - {event.title}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="text-lg font-semibold">Sessions for Event 3 ({sessions.length} total)</h2>
            <ul className="list-disc list-inside">
              {sessions.map((session, i) => (
                <li key={i}>
                  ID: {session.id} - {session.title} - Event ID: {session.event_id}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-green-100 p-4 rounded">
            <h3 className="font-semibold text-green-800">✅ SUCCESS</h3>
            <p className="text-green-700">Database connection is working!</p>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">DEBUG DATABASE - ERROR</h1>
        <div className="bg-red-100 p-4 rounded">
          <h3 className="font-semibold text-red-800">❌ ERROR</h3>
          <pre className="text-red-700 text-sm overflow-auto">
            {error.message}
            {error.stack}
          </pre>
        </div>
      </div>
    );
  }
}
