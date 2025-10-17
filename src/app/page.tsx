"use client";

import Link from "next/link";

import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section with Full Width Image */}
      <section className="relative flex h-[70vh] w-full items-center justify-center bg-gray-900">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 px-4 text-center text-white">
          <h1 className="mb-4 text-4xl font-bold md:text-6xl">Nuova agenzia</h1>
          <p className="mx-auto max-w-3xl text-xl md:text-2xl">
            Siamo una giovane agenzia di Hostess, Steward, Modelle e Promoter
            specializzata nel servizio di accoglienza e promozione che opera a
            Milano e nelle principali città italiane ed europee.
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-first-color mb-4 text-3xl font-bold md:text-4xl">
              di cosa ci occupiamo
            </h2>
            <h3 className="text-second-color text-xl font-semibold md:text-2xl">
              Siamo specializzati in accoglienza e promozione
            </h3>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-transform duration-300 hover:scale-105">
              <img
                src="/images/Hostess.jpg"
                alt="Hostess"
                className="h-64 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  HOSTESS
                </h3>
                <p className="text-gray-700">
                  Le Hostess hanno la funzione di accogliere i visitatori,
                  accreditare i clienti e rappresentare l&#39;immagine
                  dell&#39;azienda.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-transform duration-300 hover:scale-105">
              <img
                src="/images/Modella.jpg"
                alt="Modelle/I"
                className="h-64 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  MODELLE/I
                </h3>
                <p className="text-gray-700">
                  Ragazzi e ragazze con la massima espressione di bellezza ed
                  eleganza selezionati in base a canoni estetici.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-transform duration-300 hover:scale-105">
              <img
                src="/images/promoter.jpg"
                alt="Promoter"
                className="h-64 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="mb-2 text-2xl font-bold text-gray-900">
                  PROMOTER
                </h3>
                <p className="text-gray-700">
                  La funzione principale delle Promoter è di promozione che
                  avviene attraverso la presentazione del brand aziendale.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button className="bg-cyan-color text-teal-color px-8 py-3 text-lg hover:bg-cyan-600">
              Leggi di più sulla nostra storia e sulle nostre modalità
              operative.
            </Button>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-first-color mb-6 text-3xl font-bold md:text-4xl">
                I NOSTRI VALORI
              </h2>
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-gray-800">
                  SERIETÀ
                </h3>
                <h3 className="text-2xl font-semibold text-gray-800">
                  CORTESIA
                </h3>
                <h3 className="text-2xl font-semibold text-gray-800">
                  DISPONIBILITÀ
                </h3>
                <h3 className="text-2xl font-semibold text-gray-800">
                  PROFESSIONALITÀ
                </h3>
              </div>
              <p className="mt-6 text-lg text-gray-700">
                Questi sono i valori che ci contraddistinguono e con i quali
                garantiamo l&#39;efficienza dei nostri servizi e della vostra
                promozione.
              </p>
            </div>
            <div>
              <img
                src="/images/swanagency_home_contatti_0001.jpg"
                alt="Nuova agenzia Team"
                className="w-full rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Offered Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-first-color mb-4 text-3xl font-bold md:text-4xl">
              I NOSTRI SERVIZI
            </h2>
            <p className="mx-auto max-w-3xl text-xl text-gray-700">
              Siamo a tua disposizione per rispondere a qualsiasi esigenza, in
              modo rapido e professionale. In particolare ci occupiamo della
              fornitura di: Hostess, Steward, Modelle, Modelli, Tour Leader e
              Promoter in occasione di:
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <img
                src="/images/Swan-Agency-steward_hostess_0.jpg"
                alt="Fiere e Congressi"
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="mb-4 text-center text-xl font-bold text-gray-900">
                  FIERE, MEETING AZIENDALI, CONVENTION, INTERPRETARIATO
                  FIERISTICO
                </h3>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Contattaci
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
                <h3 className="mb-4 text-center text-xl font-bold text-gray-900">
                  LANCIO DI PRODOTTI, TOUR PROMOZIONALI, ROADSHOW, SAMPLING,
                  DISTRIBUZIONE GADGET
                </h3>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Contattaci
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
                <h3 className="mb-4 text-center text-xl font-bold text-gray-900">
                  SFILATE, SHOWROOM, FITTING, SHOOTING FOTOGRAFICI, SPOT
                  PUBBLICITARI
                </h3>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Contattaci
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <img
                src="/images/Swan-Agency-steward_congressi.jpg"
                alt="Congressi"
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="mb-4 text-center text-xl font-bold text-gray-900">
                  CONGRESSI, CONFERENZE, ECM, ATTIVITÀ PROMOZIONALI
                </h3>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Contattaci
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
              <img
                src="/images/Swan-Agency-steward_hostess_02.jpg"
                alt="Premiazioni"
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <h3 className="mb-4 text-center text-xl font-bold text-gray-900">
                  PREMIAZIONI, CENE DI GALA, INAUGURAZIONI
                </h3>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Contattaci
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
                <h3 className="mb-4 text-center text-xl font-bold text-gray-900">
                  EVENTI: AZIENDALI, SPORTIVI, TEATRALI, FASHION
                </h3>
                <div className="text-center">
                  <Button className="bg-cyan-color text-teal-color hover:bg-cyan-600">
                    Contattaci
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contatti" className="bg-gray-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-first-color mb-4 text-3xl font-bold md:text-4xl">
              Contattaci e saremo lieti di aiutare la tua azienda
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-second-color mb-6 text-2xl font-bold">
                LAVORIAMO PER IL TUO SUCCESSO
              </h2>
              <img
                src="/images/logo_agenzia.png"
                alt="Nuova agenzia Logo"
                className="mb-6 max-w-md"
              />
              <h3 className="text-second-color mb-6 text-center text-xl font-semibold">
                Siamo disponibili 24/7 per aiutare la tua impresa
              </h3>
              <p className="mb-6 text-center text-lg">
                Promuoviamo e valorizziamo l&#39;immagine della tua azienda
              </p>
              <p className="mb-6 text-center text-gray-300">
                | Privacy Policy | Via Milano, 1/25, 20081 Abbiategrasso MI
              </p>
              <h2 className="text-second-color mb-6 text-center text-2xl font-bold">
                Seguici sui principali social!
              </h2>
              <div className="mb-8 flex justify-center space-x-6">
                <Link href="#" className="text-white hover:text-blue-400">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-8 w-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
                <Link href="#" className="text-white hover:text-blue-400">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-8 w-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.456 0 2.784.011 3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.055-.058 1.37-.058 4.041v.08c0 2.597-.01 2.917-.058 3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
              <Button className="bg-cyan-color text-teal-color w-full py-3 hover:bg-cyan-600">
                Desideri lavorare con noi? Contattaci subito!
              </Button>
            </div>

            <div className="rounded-lg bg-gray-800 p-8">
              <h2 className="text-second-color mb-6 text-center text-2xl font-bold">
                Scrivici per un preventivo!
              </h2>
              <form className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block text-sm font-medium"
                  >
                    Nome e Cognome (richiesto)
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="company"
                    className="mb-1 block text-sm font-medium"
                  >
                    Nome Azienda (richiesto)
                  </label>
                  <input
                    type="text"
                    id="company"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block text-sm font-medium"
                  >
                    E-mail (richiesto)
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1 block text-sm font-medium"
                  >
                    Numero di telefono (richiesto)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="city"
                    className="mb-1 block text-sm font-medium"
                  >
                    Città (richiesto)
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="service"
                    className="mb-1 block text-sm font-medium"
                  >
                    Servizio richiesto
                  </label>
                  <input
                    type="text"
                    id="service"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1 block text-sm font-medium"
                  >
                    Descrivi la tua richiesta
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900"
                  ></textarea>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="privacy"
                    className="mr-2"
                    required
                  />
                  <label htmlFor="privacy" className="text-sm">
                    Ho preso visione dell&#39;informativa sulla privacy.
                  </label>
                </div>
                <Button
                  type="submit"
                  className="bg-cyan-color text-teal-color w-full py-3 hover:bg-cyan-600"
                >
                  Invia
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-4 md:mb-0">
              <p>
                © Copyright 2021 - Nuova agenzia Srls - P.IVA 10465640968. All
                rights reserved - designed by: onlylobo.com
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.064.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <a href="/feed/" className="text-gray-400 hover:text-white">
                <span className="sr-only">RSS</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15.5v-5.5H6.5v5.5H11zm0-7.5V6.5H6.5v3.5H11zm7.5 7.5h-3.5v-5.5H19v5.5zm0-7.5h-3.5V6.5H19v3.5z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
