import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRightIcon } from "@/components/ui/icon";
import Section from "@/components/ui/section";

export function ServicesSection() {
  const services = [
    {
      title: "HOSTESS",
      description:
        "Le Hostess hanno la funzione di accogliere i visitatori, accreditare i clienti e rappresentare l'immagine dell'azienda.",
      image: "/images/Hostess.jpg",
      features: [
        "Accoglienza clienti",
        "Registrazione presenze",
        "Supporto eventi",
      ],
    },
    {
      title: "MODELLE/I",
      description:
        "Ragazzi e ragazze con la massima espressione di bellezza ed eleganza selezionati in base a canoni estetici.",
      image: "/images/Modella.jpg",
      features: ["Shooting fotografici", "Sfilate moda", "Eventi premium"],
    },
    {
      title: "PROMOTER",
      description:
        "La funzione principale delle Promoter è di promozione che avviene attraverso la presentazione del brand aziendale.",
      image: "/images/promoter.jpg",
      features: ["Promozione attiva", "Sampling prodotti", "Brand awareness"],
    },
  ];

  return (
    <Section
      spacing="xl"
      background="gradient"
      className="relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-300/40 via-transparent to-blue-400/30 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-200/20 via-transparent to-cyan-300/30 blur-3xl" />
      </div>
      {/* Header */}
      <div className="relative z-10 mb-16 text-center">
        <h2 className="mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Di Cosa Ci Occupiamo
        </h2>
        <p className="mx-auto max-w-3xl text-xl text-gray-600">
          Specializzati in accoglienza e promozione per garantire il successo
          del tuo evento
        </p>
      </div>

      {/* Service Cards */}
      <div className="relative z-10 grid gap-8 md:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title} hover className="group">
            {/* Image Container */}
            <div className="relative h-64 overflow-hidden rounded-t-xl">
              <Image
                src={service.image}
                alt={service.title}
                width={400}
                height={256}
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-6">
                <h3 className="text-3xl font-bold text-white">
                  {service.title}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="mb-6 leading-relaxed text-gray-600">
                {service.description}
              </p>

              {/* Features */}
              <ul className="mb-6 space-y-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-700">
                    <div className="mr-3 h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button className="w-full transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-600">
                Scopri di più
                <ChevronRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export default ServicesSection;
