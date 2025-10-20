"use client";

import { type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

import Container from "./container";

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
  containerSize?: "sm" | "md" | "lg" | "xl" | "full";
  background?: "default" | "muted" | "accent" | "gradient" | "dark";
}

const spacingMap = {
  none: "",
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-24 md:py-32",
  xl: "py-32 md:py-40 lg:py-48",
};

const backgroundMap = {
  default: "bg-background",
  muted: "bg-muted/50",
  accent: "bg-accent/50",
  gradient: "bg-gradient-to-b from-white to-gray-50",
  dark: "bg-slate-950 text-slate-50",
};

export function Section({
  spacing = "lg",
  containerSize = "lg",
  background = "default",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(spacingMap[spacing], backgroundMap[background], className)}
      {...props}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  );
}

export default Section;
