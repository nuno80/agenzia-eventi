import Link from "next/link";
import { redirect } from "next/navigation";

import { currentUser } from "@clerk/nextjs/server";
import { Activity, BarChart, DollarSign, Users } from "lucide-react";

import { Navbar } from "@/components/navbar";

export default async function AdminPage() {
  const user = await currentUser();

  // Redirect to sign in if not authenticated
  if (!user) {
    redirect("/sign-in");
  }

  // Check if user is admin - ORA CORRETTAMENTE in publicMetadata!
  const isAdmin = user?.publicMetadata?.role === "admin";
  if (!isAdmin) {
    redirect("/no-access");
  }

  const adminFirstName = user?.firstName || "Admin";

  // Mock data for the dashboard
  const mockKpiData = [
    {
      id: 1,
      title: "Utenti Registrati",
      value: "1,234",
      icon: Users,
      change: "+5% ultimi 7g",
    },
    {
      id: 2,
      title: "Entrate Mensili",
      value: "€ 8,765",
      icon: DollarSign,
      change: "+12% mese prec.",
    },
    {
      id: 3,
      title: "Ordini Recenti",
      value: "56",
      icon: Activity,
      change: "-2% ieri",
    },
    {
      id: 4,
      title: "Sessioni Attive",
      value: "78",
      icon: BarChart,
      change: "+8% ultima ora",
    },
  ];

  const mockRecentActivities = [
    { id: 1, user: "Mario Rossi", action: "si è registrato", time: "2 ore fa" },
    {
      id: 2,
      user: "Luigi Verdi",
      action: "ha effettuato un ordine (#123)",
      time: "3 ore fa",
    },
    {
      id: 3,
      user: "Peach Gialli",
      action: "ha aggiornato il profilo",
      time: "5 ore fa",
    },
    {
      id: 4,
      user: "Admin User",
      action: "ha effettuato l'accesso",
      time: "1 giorno fa",
    },
  ];

  const mockTopProducts = [
    { id: 101, name: "Prodotto A", sales: 150, revenue: "€ 1,500" },
    { id: 102, name: "Prodotto B", sales: 120, revenue: "€ 2,400" },
    { id: 103, name: "Prodotto C", sales: 95, revenue: "€ 950" },
    { id: 104, name: "Prodotto D", sales: 80, revenue: "€ 1,200" },
  ];

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Dashboard Amministrazione
            {adminFirstName && (
              <span className="text-xl font-normal">
                , Benvenuto {adminFirstName}!
              </span>
            )}
          </h1>
          <p className="text-gray-600">
            Gestisci il tuo sito e i tuoi utenti dal pannello di controllo.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/users"
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg"
          >
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <h2 className="ml-4 text-xl font-semibold">Gestione Utenti</h2>
            </div>
            <p className="mt-4 text-gray-600">
              Visualizza e gestisci tutti gli utenti registrati sulla piattaforma.
            </p>
          </Link>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex items-center">
              <BarChart className="h-8 w-8 text-green-500" />
              <h2 className="ml-4 text-xl font-semibold">Statistiche</h2>
            </div>
            <p className="mt-4 text-gray-600">
              Analizza le metriche e le performance del tuo sito.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-500" />
              <h2 className="ml-4 text-xl font-semibold">Report Attività</h2>
            </div>
            <p className="mt-4 text-gray-600">
              Visualizza i report sulle attività recenti degli utenti.
            </p>
          </div>
        </div>

        {/* KPI Section */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-semibold">Indicatori Chiave (KPI)</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mockKpiData.map((kpi) => (
              <div
                key={kpi.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-md"
              >
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">
                    {kpi.title}
                  </h3>
                  <kpi.icon className="h-5 w-5 text-gray-400" />
                </div>
                <p className="mb-1 text-3xl font-semibold">{kpi.value}</p>
                <p className="text-xs text-gray-500">{kpi.change}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities and Top Products */}
        <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Activities */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Attività Recenti</h2>
            <ul className="space-y-4">
              {mockRecentActivities.map((activity) => (
                <li
                  key={activity.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-gray-600"> {activity.action}</span>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Top Products */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Prodotti Top</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 font-medium text-gray-600">
                      Prodotto
                    </th>
                    <th className="px-4 py-2 font-medium text-gray-600">
                      Vendite
                    </th>
                    <th className="px-4 py-2 font-medium text-gray-600">
                      Entrate
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {mockTopProducts.map((product) => (
                    <tr key={product.id}>
                      <td className="px-4 py-2">{product.name}</td>
                      <td className="px-4 py-2">{product.sales}</td>
                      <td className="px-4 py-2">{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
