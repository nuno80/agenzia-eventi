"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import Container from "@/components/ui/container";
import {
  ChevronRightIcon,
  MailIcon,
  StarIcon,
  UsersIcon,
} from "@/components/ui/icon";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Image + Overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900/80" />
        <div className="from-primary/20 absolute inset-0 bg-gradient-to-r to-transparent" />
      </div>

      {/* Decorative blur elements */}
      <div className="bg-primary/20 absolute right-20 top-20 h-72 w-72 rounded-full blur-3xl" />
      <div className="bg-accent.cyan/20 absolute bottom-20 left-20 h-72 w-72 rounded-full blur-3xl" />

      {/* Content */}
      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/80 px-4 py-1.5 text-sm backdrop-blur-sm">
            <StarIcon className="h-4 w-4 text-cyan-500" />
            <span className="text-white">Leader nel settore eventi</span>
          </div>

          {/* H1 - Solo uno per pagina */}
          <h1 className="gradient-text-primary mb-6 text-4xl font-bold text-white md:text-6xl lg:text-7xl">
            Nuova Agenzia
          </h1>

          {/* Lead paragraph */}
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-200 md:text-xl lg:text-2xl">
            Siamo una giovane agenzia di Hostess, Steward, Modelle e Promoter
            specializzati nel servizio di accoglienza e promozione che opera a
            Milano e nelle principali città italiane ed europee.
          </p>

          {/* CTA Buttons */}
          <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="xl" className="group">
              Scopri i Nostri Servizi
              <ChevronRightIcon className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="xl" variant="gradientOutline">
              <MailIcon className="mr-2 h-5 w-5" />
              Richiedi Preventivo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-300">
            <div className="flex items-center gap-2">
              <StarIcon className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>100% Clienti Soddisfatti</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="h-4 w-4" />
              <span>+500 Eventi Gestionati</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
              <span>Team Sempre Disponibile</span>
            </div>
          </div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transform">
        <Link href="#servizi" className="block">
          <div className="flex flex-col items-center gap-2 text-white/60 transition-colors hover:text-white">
            <span className="text-xs uppercase tracking-wider">
              Scopri di più
            </span>
            <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/30">
              <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

export default HeroSection;
