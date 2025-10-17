import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container py-10">
        <h1 className="text-cyan-color mb-8 text-center text-4xl font-bold">
          Contattaci per un Preventivo
        </h1>

        <div className="mx-auto max-w-4xl">
          <p className="mb-12 text-center text-lg text-black">
            Siamo disponibili 24/7 per aiutare la tua impresa. Compila il form
            qui sotto per richiedere un preventivo personalizzato.
          </p>

          <div className="rounded-lg bg-gray-50 p-8 shadow-md">
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium text-black"
                  >
                    Nome e Cognome (richiesto)
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="company"
                    className="mb-1 block text-sm font-medium text-black"
                  >
                    Nome Azienda (richiesto)
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium text-black"
                  >
                    E-mail (richiesto)
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-sm font-medium text-black"
                  >
                    Numero di telefono (richiesto)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    className="mb-1 block text-sm font-medium text-black"
                  >
                    Città (richiesto)
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="mb-1 block text-sm font-medium text-black"
                  >
                    Servizio richiesto
                  </label>
                  <select
                    id="service"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="">Seleziona un servizio</option>
                    <option value="hostess">Hostess</option>
                    <option value="steward">Steward</option>
                    <option value="modelle">Modelle</option>
                    <option value="modelli">Modelli</option>
                    <option value="promoter">Promoter</option>
                    <option value="altro">Altro</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1 block text-sm font-medium text-black"
                >
                  Descrivi la tua richiesta
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Fornisci tutti i dettagli necessari per il tuo evento: data, luogo, numero di persone richieste, servizi specifici, ecc."
                ></textarea>
              </div>

              <div className="flex items-start">
                <div className="flex h-5 items-center">
                  <input
                    id="privacy"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="privacy" className="text-black">
                    Ho preso visione dell&#39;informativa sulla privacy e
                    acconsento al trattamento dei miei dati personali.
                  </label>
                </div>
              </div>

              <div className="text-center">
                <Button
                  type="submit"
                  className="bg-cyan-color text-teal-color px-8 py-3 text-lg hover:bg-cyan-600"
                >
                  Invia Richiesta
                </Button>
              </div>
            </form>
          </div>

          <div className="mt-12 text-center">
            <h2 className="text-cyan-color mb-6 text-2xl font-bold">
              Informazioni di Contatto
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="text-cyan-color mb-2 text-xl font-semibold">
                  E-MAIL
                </h3>
                <p className="text-blue-600">info@nuovaagenzia.it</p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="text-cyan-color mb-2 text-xl font-semibold">
                  TELEFONO
                </h3>
                <p className="text-blue-600">+39 02 123 4567</p>
              </div>

              <div className="rounded-lg bg-white p-6 shadow-md">
                <h3 className="text-cyan-color mb-2 text-xl font-semibold">
                  INDIRIZZO
                </h3>
                <p className="text-black">
                  Via Roma, 10
                  <br />
                  20100 Milano MI
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
