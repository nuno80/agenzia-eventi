import { Card, CardContent } from "@/components/ui/card";
import Container from "@/components/ui/container";
import { StarIcon, UsersIcon } from "@/components/ui/icon";
import Section from "@/components/ui/section";

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  initials: string;
}

const testimonials: TestimonialItem[] = [
  {
    quote:
      "Team impeccabile: hostess preparate e un coordinamento perfetto dall'inizio alla fine dell'evento.",
    name: "Elena Mariani",
    role: "Marketing Manager · Milano Fashion Week",
    initials: "EM",
  },
  {
    quote:
      "Abbiamo notato un aumento del 35% delle interazioni durante la fiera. Promoter sempre sorridenti e proattivi.",
    name: "Claudio Rossi",
    role: "Field Manager · Tech Expo Europe",
    initials: "CR",
  },
  {
    quote:
      "Professionalità, eleganza e disponibilità continua. I feedback dei nostri ospiti sono stati entusiasti.",
    name: "Giulia Ferri",
    role: "Events Director · Luxury Brands Group",
    initials: "GF",
  },
];

export function TestimonialsSection() {
  return (
    <Section
      background="dark"
      spacing="xl"
      className="relative overflow-hidden"
      containerSize="xl"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-10 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-blue-500/10 via-transparent to-cyan-500/30 blur-3xl" />
      </div>

      <Container className="relative z-10">
        <div className="mb-12 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-[0.35em] text-cyan-200 ring-1 ring-white/20">
            <UsersIcon className="h-4 w-4" /> Dicono di noi
          </span>
          <h2 className="text-balance text-4xl font-bold text-white md:text-5xl">
            La fiducia costruita sul campo
          </h2>
          <p className="mt-4 max-w-2xl text-base text-muted-foreground text-slate-300">
            Collaboriamo con brand internazionali, curando in ogni dettaglio
            accoglienza, stile e performance. Ecco cosa raccontano di noi.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <Card
              key={item.name}
              className="flex h-full flex-col justify-between border-white/10 bg-white/5 p-6 ring-white/10 backdrop-blur-xl"
            >
              <div>
                <div className="mb-4 flex items-center gap-1 text-cyan-200">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <StarIcon key={index} className="h-4 w-4" />
                  ))}
                </div>
                <p className="text-lg leading-relaxed text-slate-100">
                  “{item.quote}”
                </p>
              </div>
              <CardContent className="mt-6 flex items-center gap-4 px-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-gradient-to-br from-cyan-400 to-blue-500 text-sm font-bold uppercase text-slate-900">
                  {item.initials}
                </div>
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-sm text-slate-300">{item.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default TestimonialsSection;
