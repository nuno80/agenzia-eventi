import { currentUser } from "@clerk/nextjs/server";

export default async function DebugRolesPage() {
  const user = await currentUser();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">🔍 DEBUG ROLES</h1>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold">User Info:</h3>
          <p>User ID: {user?.id}</p>
          <p>Email: {user?.email}</p>
          <p>First Name: {user?.firstName}</p>
          <p>Last Name: {user?.lastName}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Role Check:</h3>
          <p>Role: {user?.publicMetadata?.role || "not set"}</p>
          <p>Metadata: {JSON.stringify(user?.publicMetadata, null, 2)}</p>
        </div>
        
        <div>
          <h3 className="font-semibold">Access Results:</h3>
          <p>Is Admin: {user?.publicMetadata?.role === "admin" ? "✅" : "❌"}</p>
          <p>Is Manager: {user?.publicMetadata?.role === "manager" ? "✅" : "❌"}</p>
          <p>Is User: {!!user ? "✅" : "❌"}</p>
          <p>Can Access Admin: {user?.publicMetadata?.role === "admin" ? "✅" : "❌"}</p>
        </div>
        
        <div className="text-sm text-gray-600">
          <p>💡 Se non vedi il ruolo, fai logout/login completo o attendi sincronizzazione Clerk.</p>
        </div>
      </div>
    </div>
  );
}
