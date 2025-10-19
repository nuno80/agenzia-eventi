// Debug page per verificare ruoli secondo guida
import { currentUser } from "@clerk/nextjs/server";
import { getCurrentUserRole } from "@/lib/auth/role-utils";

export default async function DebugRolesPage() {
  const user = await currentUser();
  const role = await getCurrentUserRole();
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Debug Ruoli Utente</h1>
      
      <div className="space-y-4 font-mono">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p><strong>User ID:</strong> {user?.id || "Not logged in"}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p><strong>Email:</strong> {user?.primaryEmailAddress?.emailAddress || "N/A"}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p><strong>Role:</strong> {role || "No role"}</p>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p><strong>Raw publicMetadata:</strong></p>
          <pre className="text-sm">
            {JSON.stringify(user?.publicMetadata, null, 2) || "null"}
          </pre>
        </div>
        
        <div className="p-4 bg-gray-50 rounded-lg">
          <p><strong>Role Check Results:</strong></p>
          <ul className="mt-2 space-y-1">
            <li>currentUser().publicMetadata.role: {String(user?.publicMetadata?.role)}</li>
            <li>getCurrentUserRole(): {String(role)}</li>
            <li>Is Admin: {role === "admin" ? "✅" : "❌"}</li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Access Test Links:</h2>
        <ul className="space-y-2">
          <li><a href="/admin/events" className="text-blue-600 hover:underline">/admin/events (should work if admin)</a></li>
          <li><a href="/admin/users" className="text-blue-600 hover:underline">/admin/users (should work if admin)</a></li>
          <li><a href="/dashboard" className="text-blue-600 hover:underline">/dashboard (should work if logged in)</a></li>
        </ul>
      </div>
    </div>
  );
}
