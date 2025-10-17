import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function Features() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="container py-10">
        <h1 className="text-cyan-color mb-8 text-center text-4xl font-bold">
          I Nostri Servizi
        </h1>

        <div className="mx-auto max-w-4xl">
          <p className="mb-12 text-center text-lg text-black">
            Siamo a tua disposizione per rispondere a qualsiasi esigenza, in
            modo rapido e professionale. In particolare ci occupiamo della
            fornitura di: Hostess, Steward, Modelle, Modelli, Tour Leader e
            Promoter in occasione di:
          </p>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <img
                src="/images/Swan-Agency-steward_hostess_0.jpg"
                alt="Fiere e Congressi"
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-cyan-color mb-4 text-xl font-bold">
                  FIERE, MEETING AZIENDALI, CONVENTION, INTERPRETARIATO
                  FIERISTICO
                </h3>
                <p className="mb-4 text-black">
                  Personale qualificato per l&#39;accoglienza e l&#39;assistenza
                  durante fiere, con particolare attenzione
                  all&#39;interpretariato e alla gestione delle comunicazioni.
                </p>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Richiedi Informazioni
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <img
                src="/images/Swan-Agency-steward_lancio-prodotti.jpg"
                alt="Lancio Prodotti"
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-cyan-color mb-4 text-xl font-bold">
                  LANCIO DI PRODOTTI, TOUR PROMOZIONALI, ROADSHOW, SAMPLING,
                  DISTRIBUZIONE GADGET
                </h3>
                <p className="mb-4 text-black">
                  Promoter specializzati nel presentare nuovi prodotti, con
                  focus sull&#39;interazione diretta con il pubblico e la
                  distribuzione di campioni e gadget.
                </p>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Richiedi Informazioni
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <img
                src="/images/Swan-Agency-steward_hostess_03.jpg"
                alt="Sfilate e Shooting"
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-cyan-color mb-4 text-xl font-bold">
                  SFILATE, SHOWROOM, FITTING, SHOOTING FOTOGRAFICI, SPOT
                  PUBBLICITARI
                </h3>
                <p className="mb-4 text-black">
                  Modelli e modelle selezionati per sfilate, showroom e sessioni
                  fotografiche, con attenzione all&#39;eleganza e alla
                  professionalit&#224;.
                </p>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Richiedi Informazioni
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <img
                src="/images/Swan-Agency-steward_congressi.jpg"
                alt="Congressi"
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-cyan-color mb-4 text-xl font-bold">
                  CONGRESSI, CONFERENZE, ECM, ATTIVITÀ PROMOZIONALI
                </h3>
                <p className="mb-4 text-black">
                  Hostess e steward per la gestione di congressi e conferenze,
                  con supporto logistico e accoglienza professionale per i
                  partecipanti.
                </p>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Richiedi Informazioni
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <img
                src="/images/Swan-Agency-steward_hostess_02.jpg"
                alt="Premiazioni"
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-cyan-color mb-4 text-xl font-bold">
                  PREMIAZIONI, CENE DI GALA, INAUGURAZIONI
                </h3>
                <p className="mb-4 text-black">
                  Personale selezionato per eventi speciali come premiazioni,
                  cene di gala e inaugurazioni, con attenzione all&#39;eleganza
                  e alla professionalit&#224;.
                </p>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Richiedi Informazioni
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <img
                src="/images/Swan-Agency-steward_heventi_2020.jpg"
                alt="Eventi"
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="text-cyan-color mb-4 text-xl font-bold">
                  EVENTI: AZIENDALI, SPORTIVI, TEATRALI, FASHION
                </h3>
                <p className="mb-4 text-black">
                  Soluzioni complete per ogni tipo di evento,
                  dall&#39;organizzazione alla fornitura di personale
                  specializzato per garantire il successo dell&#39;occasione.
                </p>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Richiedi Informazioni
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
