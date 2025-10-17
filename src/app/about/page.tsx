import { Navbar } from "@/components/navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container py-10">
        <h1 className="text-cyan-color mb-8 text-center text-4xl font-bold">
          Chi Siamo
        </h1>

        <div className="mx-auto max-w-4xl">
          <p className="mb-6 text-lg text-black">
            Nuova agenzia nasce dall&#39;esperienza pluriennale e la passione
            verso il mondo degli eventi.
          </p>

          <p className="mb-6 text-lg text-black">
            Siamo una giovane agenzia di Hostess, Steward, Modelle e Promoter
            specializzata nel servizio di accoglienza e promozione che opera a
            Milano e nelle principali città italiane ed europee.
          </p>

          <h2 className="text-cyan-color mb-6 mt-12 text-2xl font-bold">
            I Nostri Valori
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-cyan-color mb-4 text-xl font-semibold">
                SERIETÀ
              </h3>
              <p className="text-black">
                La serietà è uno dei nostri principi fondamentali. Ogni progetto
                viene affrontato con la massima attenzione ai dettagli e con un
                approccio professionale.
              </p>
            </div>

            <div>
              <h3 className="text-cyan-color mb-4 text-xl font-semibold">
                CORTESIA
              </h3>
              <p className="text-black">
                La cortesia nei confronti di clienti, collaboratori e partners è
                una priorità che caratterizza ogni nostro rapporto.
              </p>
            </div>

            <div>
              <h3 className="text-cyan-color mb-4 text-xl font-semibold">
                DISPONIBILITÀ
              </h3>
              <p className="text-black">
                Siamo disponibili 24/7 per rispondere a qualsiasi esigenza,
                garantendo un servizio sempre attento e reattivo.
              </p>
            </div>

            <div>
              <h3 className="text-cyan-color mb-4 text-xl font-semibold">
                PROFESSIONALITÀ
              </h3>
              <p className="text-black">
                La professionalit├á del nostro team ├¿ il risultato di una
                continua formazione e di un&#39;esperienza consolidata nel
                settore.
              </p>
            </div>
          </div>

          <h2 className="text-cyan-color mb-6 mt-12 text-2xl font-bold">
            La Nostra Storia
          </h2>

          <p className="mb-6 text-lg text-black">
            Fondata da professionisti con anni di esperienza nel settore degli
            eventi e della promozione, Nuova agenzia nasce con l&#39;obiettivo
            di offrire servizi di alta qualit├á nel campo dell&#39;accoglienza e
            della promozione aziendale.
          </p>

          <p className="mb-6 text-lg text-black">
            La nostra mission ├¿ quella di valorizzare l&#39;immagine aziendale
            dei nostri clienti attraverso personale altamente qualificato e
            selezionato con cura, in grado di rappresentare al meglio i valori e
            l&#39;identit├á del brand.
          </p>

          <div className="mt-12">
            <img
              src="/images/swanagency_home_contatti_0001.jpg"
              alt="Il nostro team"
              className="w-full rounded-lg shadow-lg"
            />
          </div>
        </div>
      </main>
    </div>
  );
}
