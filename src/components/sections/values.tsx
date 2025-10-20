import Image from "next/image";

import Container from "@/components/ui/container";
import {
  AwardIcon,
  ClockIcon,
  HeartIcon,
  ShieldIcon,
} from "@/components/ui/icon";
import Section from "@/components/ui/section";

export function ValuesSection() {
  const values = [
    {
      title: "SERIETÀ",
      description: "Approccio professionale e responsabile in ogni progetto",
      icon: ShieldIcon,
    },
    {
      title: "CORTESIA",
      description: "Gentilezza e attenzione ai dettagli nel servizio clienti",
      icon: HeartIcon,
    },
    {
      title: "DISPONIBILITÀ",
      description: "Flessibilità totale per soddisfare ogni esigenza",
      icon: ClockIcon,
    },
    {
      title: "PROFESSIONALITÀ",
      description: "Competenza e formazione continua del nostro team",
      icon: AwardIcon,
    },
  ];

  return (
    <Section
      spacing="xl"
      background="gradient"
      className="relative overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -left-24 top-12 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-200/40 via-transparent to-blue-300/30 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-gradient-to-tr from-blue-200/30 via-transparent to-cyan-200/50 blur-3xl" />
      </div>
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Content */}
          <div>
            <h2 className="mb-8 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              I Nostri Valori
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={value.title}
                    className="animate-fade-in flex items-start space-x-4"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="shadow-elevation-2 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600">
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="mb-2 text-xl font-bold text-gray-900">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="shadow-elevation-3 relative overflow-hidden rounded-2xl">
              <Image
                src="/images/swanagency_home_contatti_0001.jpg"
                alt="Nuova Agenzia Team"
                width={600}
                height={400}
                className="object-cover"
              />
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-blue-600/20" />
            </div>

            {/* Floating Cards */}
            <div className="animate-fade-in shadow-elevation-2 absolute -right-8 -top-8 rounded-xl bg-white p-4">
              <div className="flex items-center space-x-3">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                <span className="text-sm font-medium">Team Online</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default ValuesSection;
