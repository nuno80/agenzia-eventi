import Link from "next/link";

import {
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  StarIcon,
} from "@/components/ui/icon";
import Section from "@/components/ui/section";

const navigationLinks = [
  { label: "Servizi", href: "#servizi" },
  { label: "Valori", href: "#valori" },
  { label: "Contatti", href: "#contatti" },
];

const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com" },
  { label: "LinkedIn", href: "https://www.linkedin.com" },
  { label: "Facebook", href: "https://www.facebook.com" },
];

export function FooterSection() {
  return (
    <Section
      background="dark"
      spacing="lg"
      className="border-t border-white/10"
    >
      <div className="grid gap-12 md:grid-cols-3">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200">
            <StarIcon className="h-3 w-3" /> Nuova Agenzia
          </div>
          <p className="text-balance text-lg font-semibold text-white">
            Eleganza, accoglienza e performance per eventi memorabili.
          </p>
          <p className="text-sm text-slate-300">
            Dal brief al follow-up post evento, il nostro team gestisce ogni
            fase con precisione e stile.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-200">
            Navigazione
          </h3>
          <ul className="space-y-3 text-slate-300">
            {navigationLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-cyan-200"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-200">
            Contatti
          </h3>
          <p className="flex items-center gap-3">
            <MailIcon className="h-4 w-4 text-cyan-300" /> info@nuovaagenzia.it
          </p>
          <p className="flex items-center gap-3">
            <PhoneIcon className="h-4 w-4 text-cyan-300" /> +39 02 12345678
          </p>
          <p className="flex items-center gap-3">
            <MapPinIcon className="h-4 w-4 text-cyan-300" /> Via Milano 1/25,
            Abbiategrasso (MI)
          </p>

          <div className="pt-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">
              Seguici
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-200 transition-colors hover:border-cyan-300 hover:text-cyan-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Nuova Agenzia. Tutti i diritti
          riservati.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/privacy"
            className="transition-colors hover:text-cyan-200"
          >
            Privacy Policy
          </Link>
          <Link
            href="/cookie"
            className="transition-colors hover:text-cyan-200"
          >
            Cookie Policy
          </Link>
          <span>P.IVA 00000000000</span>
        </div>
      </div>
    </Section>
  );
}

export default FooterSection;
