import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function Referenze() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container py-10">
        <h1 className="text-cyan-color mb-8 text-center text-4xl font-bold">
          Le Nostre Referenze
        </h1>

        <div className="mx-auto max-w-4xl">
          <p className="mb-12 text-center text-lg text-black">
            Negli anni abbiamo collaborato con numerose aziende leader nei loro
            settori, fornendo personale qualificato per eventi di ogni tipo e
            dimensione.
          </p>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <div className="p-6">
                <h3 className="text-cyan-color mb-4 text-xl font-bold">
                  Fiera Internazionale del Mobile
                </h3>
                <p className="mb-4 text-black">
                  Fornitura di hostess per l&#39;accoglienza e l&#39;assistenza
                  ai visitatori durante la prestigiosa fiera di Milano.
                </p>
                <div className="text-sm text-gray-500">2023</div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <div className="p-6">
                <h3 className="text-cyan-color mb-4 text-xl font-bold">
                  Lancio Prodotto Tech
                </h3>
                <p className="mb-4 text-black">
                  Promoter specializzati nel presentare nuovi prodotti di una
                  nota marca tecnologica.
                </p>
                <div className="text-sm text-gray-500">2023</div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <div className="p-6">
                <h3 className="text-cyan-color mb-4 text-xl font-bold">
                  Sfilata Alta Moda
                </h3>
                <p className="mb-4 text-black">
                  Selezione di modelle per una prestigiosa sfilata di alta moda
                  a Milano Fashion Week.
                </p>
                <div className="text-sm text-gray-500">2022</div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <div className="p-6">
                <h3 className="text-cyan-color mb-4 text-xl font-bold">
                  Congresso Medico
                </h3>
                <p className="mb-4 text-black">
                  Hostess e steward per l&#39;organizzazione di un congresso
                  medico internazionale a Roma.
                </p>
                <div className="text-sm text-gray-500">2022</div>
              </div>
            </div>
          </div>

          <div className="mb-12 text-center">
            <h2 className="text-cyan-color mb-6 text-2xl font-bold">
              Clienti Soddisfatti
            </h2>
            <p className="mb-8 text-lg text-black">
              La nostra professionalit&#224; e dedizione hanno portato alla
              collaborazione con aziende leader nei loro settori. Ecco alcuni
              dei nostri partner:
            </p>

            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 p-4">
                <span className="font-semibold text-gray-700">Marca A</span>
              </div>
              <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 p-4">
                <span className="font-semibold text-gray-700">Marca B</span>
              </div>
              <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 p-4">
                <span className="font-semibold text-gray-700">Marca C</span>
              </div>
              <div className="flex h-24 items-center justify-center rounded-lg bg-gray-100 p-4">
                <span className="font-semibold text-gray-700">Marca D</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-blue-50 p-8">
            <h2 className="text-cyan-color mb-6 text-center text-2xl font-bold">
              Diventa una nostra referenza
            </h2>
            <p className="mb-6 text-center text-lg text-black">
              Se hai collaborato con noi e sei soddisfatto del nostro servizio,
              saremmo felici di includerti tra le nostre referenze.
            </p>
            <div className="text-center">
              <Button className="bg-cyan-color text-teal-color px-8 py-3 hover:bg-cyan-600">
                Contattaci per una testimonianza
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
