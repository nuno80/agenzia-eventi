# Guida Completa al Design System per Next.js 15 con TypeScript e shadcn/ui

## Introduzione

Questa guida fornisce un framework completo per creare design system scalabili e performanti utilizzando Next.js 15, TypeScript e shadcn/ui. Ogni sezione presenta principi generali da adattare al tuo progetto specifico, con implementazioni concrete e production-ready.

## Setup Iniziale

### Installazione shadcn/ui

```bash
# 1. Crea progetto Next.js 15
npx create-next-app@latest my-app --typescript --tailwind --app

# 2. Installa shadcn/ui
npx shadcn@latest init

# Rispondi alle domande:
# - Style: Default
# - Base color: Slate (o il tuo preferito)
# - CSS variables: Yes

# 3. Installa Lucide React per le icone
npm install lucide-react
```

### Configurazione Design Tokens

```typescript
// app/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* Design tokens personalizzati */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;

    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;

    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;

    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;

    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;

    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;

    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;

    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;

    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... altri token per dark mode */
  }
}
```

## 1. Sistema Tipografico con Next.js Font Optimization

### Principi Generali

La tipografia è la base di ogni interfaccia web. Un sistema tipografico coerente migliora la leggibilità e crea una gerarchia visiva chiara.

**Regole fondamentali:**

- Limitare a 1-2 famiglie di font per progetto
- Stabilire una scala tipografica modulare
- Definire pesi e varianti prima di iniziare
- Considerare performance (Next.js Font Optimization)
- Accessibilità: contrasto minimo 4.5:1 per body text

### Implementazione con Google Fonts

```typescript
// app/fonts.ts
import { Inter, Playfair_Display } from "next/font/google";

// Font primario per UI e testo - sans-serif moderno
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

// Font secondario per titoli - serif elegante (opzionale)
export const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
});
```

```typescript
// app/layout.tsx
import { inter, playfair } from './fonts'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
```

### Componente Typography con shadcn/ui

```typescript
// components/ui/typography.tsx
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 font-display text-4xl font-bold tracking-tight lg:text-5xl xl:text-6xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight lg:text-4xl xl:text-5xl",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight lg:text-3xl",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight lg:text-2xl",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight lg:text-xl",
      h6: "scroll-m-20 text-base font-semibold tracking-tight lg:text-lg",
      body: "leading-7 [&:not(:first-child)]:mt-6",
      lead: "text-xl text-muted-foreground leading-relaxed",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "body",
  },
})

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div"
}

export function Typography({
  className,
  variant,
  as,
  ...props
}: TypographyProps) {
  const Comp = as || (variant?.startsWith("h") ? variant : "p")

  return (
    <Comp
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  )
}
```

### Uso pratico SEO-friendly

```typescript
// app/page.tsx
import { Typography } from "@/components/ui/typography"

export default function Page() {
  return (
    <article>
      {/* H1 - Solo uno per pagina */}
      <Typography variant="h1" as="h1">
        Guida Completa al Design System Next.js
      </Typography>

      {/* Lead paragraph */}
      <Typography variant="lead" as="p">
        Impara a costruire design system professionali con Next.js 15,
        TypeScript e shadcn/ui.
      </Typography>

      {/* Gerarchia corretta */}
      <Typography variant="h2" as="h2">
        Perché usare un Design System?
      </Typography>

      <Typography variant="body">
        Un design system garantisce coerenza visiva e migliora
        la velocità di sviluppo del 40-60%.
      </Typography>
    </article>
  )
}
```

## 2. Sistema Icone con Lucide React

### Perché Lucide React

**Lucide React** è la scelta migliore per Next.js perché:

- ✅ **1000+ icone** open-source, consistenti e moderne
- ✅ **Tree-shakeable**: importi solo le icone che usi (bundle size ottimale)
- ✅ **Customizzabile**: size, color, strokeWidth tramite props
- ✅ **Accessibile**: supporto per aria-label e title
- ✅ **TypeScript-native**: autocomplete perfetto
- ✅ **Zero config**: funziona out-of-the-box con shadcn/ui

**Alternative e quando usarle:**

- **Heroicons**: Se preferisci lo stile Tailwind UI (più minimale)
- **React Icons**: Per icone di brand (social media, loghi)
- **Custom SVG**: Per icone brand-specific uniche

### Setup e Best Practices

```typescript
// components/icons.tsx - Centralizza le icone usate
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Github,
  Heart,
  Home,
  Info,
  Linkedin,
  Loader2,
  Lock,
  LogIn,
  LogOut,
  type LucideIcon,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Phone,
  Plus,
  Search,
  Settings,
  Share2,
  ShoppingCart,
  Star,
  Trash2,
  Twitter,
  Unlock,
  Upload,
  User,
  X,
} from "lucide-react";

// Export organizzato per categoria
export const Icons = {
  // Navigation
  menu: Menu,
  close: X,
  chevronDown: ChevronDown,
  arrowRight: ArrowRight,
  externalLink: ExternalLink,

  // UI Actions
  search: Search,
  plus: Plus,
  minus: Minus,
  edit: Edit,
  trash: Trash2,
  settings: Settings,
  copy: Copy,
  share: Share2,
  download: Download,
  upload: Upload,

  // User & E-commerce
  user: User,
  cart: ShoppingCart,
  heart: Heart,
  star: Star,

  // Communication
  mail: Mail,
  phone: Phone,
  mapPin: MapPin,

  // Status & Feedback
  check: Check,
  alert: AlertCircle,
  info: Info,
  loader: Loader2,

  // Content
  home: Home,
  package: Package,
  file: FileText,
  calendar: Calendar,
  clock: Clock,

  // Visibility
  eye: Eye,
  eyeOff: EyeOff,
  lock: Lock,
  unlock: Unlock,

  // Auth
  login: LogIn,
  logout: LogOut,

  // Social
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
};

export type Icon = LucideIcon;
```

### Componente Icon Wrapper

```typescript
// components/ui/icon.tsx
import { cn } from "@/lib/utils"
import { type LucideIcon } from "lucide-react"

interface IconProps extends React.HTMLAttributes<SVGElement> {
  icon: LucideIcon
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeMap = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
}

export function Icon({
  icon: IconComponent,
  size = "md",
  className,
  ...props
}: IconProps) {
  return (
    <IconComponent
      className={cn(sizeMap[size], className)}
      {...props}
    />
  )
}
```

### Uso pratico con shadcn/ui Button

```typescript
// Esempio: Button con icone
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

export function ActionButtons() {
  return (
    <div className="flex gap-4">
      {/* Icon + Text */}
      <Button>
        <Icons.arrowRight className="mr-2 h-4 w-4" />
        Continua
      </Button>

      {/* Icon only - ricorda aria-label */}
      <Button variant="ghost" size="icon" aria-label="Carrello">
        <Icons.cart className="h-5 w-5" />
      </Button>

      {/* Loading state */}
      <Button disabled>
        <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
        Caricamento...
      </Button>
    </div>
  )
}
```

### Icon Grid con Search (Pattern Comune)

```typescript
// components/icon-picker.tsx
import { Input } from "@/components/ui/input"
import { Icons } from "@/components/icons"
import { useState } from "react"

export function IconPicker() {
  const [search, setSearch] = useState("")

  const iconEntries = Object.entries(Icons)
  const filtered = iconEntries.filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="relative mb-6">
        <Icons.search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cerca icona..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {filtered.map(([name, Icon]) => (
          <button
            key={name}
            className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-muted transition-colors"
            onClick={() => console.log(name)}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs text-muted-foreground">{name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

## 3. Componenti shadcn/ui Essenziali

### Setup Componenti Base

```bash
# Installa i componenti più usati
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sheet
npx shadcn@latest add tabs
npx shadcn@latest add badge
npx shadcn@latest add avatar
npx shadcn@latest add separator
npx shadcn@latest add skeleton
```

### Button - Esteso con tue varianti

```typescript
// components/ui/button.tsx (modifica del file generato)
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",

        // ✨ Tue varianti custom
        success: "bg-green-600 text-white shadow hover:bg-green-700",
        gradient: "bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-11 rounded-md px-8",
        xl: "h-14 rounded-lg px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

### Card - Con effetti hover avanzati

```typescript
// components/ui/card.tsx (estensione)
import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    hover?: boolean
    gradient?: boolean
  }
>(({ className, hover = false, gradient = false, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm",
      hover && "transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
      gradient && "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-primary/5 before:to-transparent",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
```

### Esempio pratico: Feature Cards

```typescript
// components/feature-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Icons } from "@/components/icons"
import { type LucideIcon } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: LucideIcon
}

export function FeatureCard({ title, description, icon: Icon }: FeatureCardProps) {
  return (
    <Card hover gradient className="group">
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="ghost" size="sm" asChild>
          <a href="#" className="group-hover:translate-x-1 transition-transform">
            Scopri di più
            <Icons.arrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  )
}

// Uso
export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <FeatureCard
        icon={Icons.star}
        title="Performance"
        description="Ottimizzato per Core Web Vitals e SEO"
      />
      <FeatureCard
        icon={Icons.lock}
        title="Sicurezza"
        description="Best practices di sicurezza integrate"
      />
      <FeatureCard
        icon={Icons.settings}
        title="Personalizzabile"
        description="Ogni componente è completamente customizzabile"
      />
    </div>
  )
}
```

## 4. Sistema di Spaziatura e Layout

### Container Component

```typescript
// components/ui/container.tsx
import { cn } from "@/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

const sizeMap = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  xl: "max-w-[1400px]",
  full: "max-w-full",
}

export function Container({
  size = "lg",
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

### Section Component con Spaziature

```typescript
// components/ui/section.tsx
import { cn } from "@/lib/utils"
import { Container } from "./container"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "none" | "sm" | "md" | "lg" | "xl"
  containerSize?: "sm" | "md" | "lg" | "xl" | "full"
  background?: "default" | "muted" | "accent"
}

const spacingMap = {
  none: "",
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-24 md:py-32",
  xl: "py-32 md:py-40 lg:py-48",
}

const backgroundMap = {
  default: "bg-background",
  muted: "bg-muted/50",
  accent: "bg-accent/50",
}

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
      className={cn(
        spacingMap[spacing],
        backgroundMap[background],
        className
      )}
      {...props}
    >
      <Container size={containerSize}>{children}</Container>
    </section>
  )
}
```

## 5. Componente Hero Ottimizzato

```typescript
// components/hero.tsx
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { Icons } from "@/components/icons"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center overflow-hidden">
      {/* Background con Next.js Image optimization */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-background.jpg"
          alt=""
          fill
          priority
          quality={90}
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/50 to-background" />
      </div>

      {/* Decorative blur elements */}
      <div className="absolute top-20 right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-20 left-20 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

      <Container className="relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted px-4 py-1.5 text-sm">
            <Icons.star className="h-4 w-4 text-primary" />
            <span>Nuovo: Next.js 15 supportato</span>
          </div>

          {/* H1 - Solo uno per pagina */}
          <Typography variant="h1" className="mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Costruisci Design System Professionali
          </Typography>

          <Typography variant="lead" className="mb-8 mx-auto max-w-2xl">
            Framework completo per Next.js 15, TypeScript e shadcn/ui.
            Ottimizzato per performance, SEO e accessibilità.
          </Typography>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" variant="gradient">
              Inizia Gratis
              <Icons.arrowRight className="h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              <Icons.github className="h-5 w-5" />
              Vedi su GitHub
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icons.star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>1000+ stelle</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.download className="h-4 w-4" />
              <span>50k+ download</span>
            </div>
            <div className="flex items-center gap-2">
              <Icons.users className="h-4 w-4" />
              <span>500+ progetti</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
```

## 6. Navigation con shadcn/ui

```typescript
// components/navbar.tsx
"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Icons } from "@/components/icons"
import { Container } from "@/components/ui/container"

const navigation = [
  { name: "Home", href: "/" },
  { name: "Prodotti", href: "/prodotti" },
  { name: "Documentazione", href: "/docs" },
  { name: "Blog", href: "/blog" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <nav className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Icons.package className="h-6 w-6" />
            <span className="font-bold text-lg">TuoBrand</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link href={item.href} legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      {item.name}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Icons.login className="mr-2 h-4 w-4" />
              Accedi
            </Button>
            <Button size="sm">
              Inizia Gratis
            </Button>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Icons.menu className="h-5 w-5" />
                <span className="sr-only">Apri menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="mt-6 flex flex-col gap-2">
                  <Button variant="outline" className="w-full">
                    <Icons.login className="mr-2 h-4 w-4" />
                    Accedi
                  </Button>
                  <Button className="w-full">
                    Inizia Gratis
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </nav>
      </Container>
    </header>
  )
}
```

## 7. Form con Validazione e shadcn/ui

### Setup React Hook Form + Zod

```bash
npm install react-hook-form zod @hookform/resolvers
npx shadcn@latest add form
```

### Form Component Completo

```typescript
// components/contact-form.tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Icons } from "@/components/icons"
import { useState } from "react"

// Schema validazione
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Il nome deve contenere almeno 2 caratteri.",
  }),
  email: z.string().email({
    message: "Inserisci un'email valida.",
  }),
  subject: z.string().min(5, {
    message: "L'oggetto deve contenere almeno 5 caratteri.",
  }),
  message: z.string().min(10, {
    message: "Il messaggio deve contenere almeno 10 caratteri.",
  }).max(500, {
    message: "Il messaggio non può superare 500 caratteri.",
  }),
})

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)

    try {
      // Simula API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // In produzione: await fetch('/api/contact', { method: 'POST', body: JSON.stringify(values) })

      toast.success("Messaggio inviato con successo!", {
        description: "Ti risponderemo entro 24 ore.",
      })

      form.reset()
    } catch (error) {
      toast.error("Errore nell'invio del messaggio", {
        description: "Riprova più tardi o contattaci via email.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <Input placeholder="Mario Rossi" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="mario.rossi@example.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Non condivideremo mai la tua email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Subject Field */}
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Oggetto</FormLabel>
              <FormControl>
                <Input placeholder="Di cosa vuoi parlare?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Message Field */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Messaggio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Scrivi qui il tuo messaggio..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                {field.value.length}/500 caratteri
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? (
            <>
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
              Invio in corso...
            </>
          ) : (
            <>
              <Icons.mail className="mr-2 h-4 w-4" />
              Invia Messaggio
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}
```

## 8. Toast Notifications con Sonner

```bash
npm install sonner
```

```typescript
// app/providers.tsx
"use client"

import { Toaster } from "sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
      />
    </>
  )
}

// app/layout.tsx
import { Providers } from "./providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

## 9. Loading States e Skeleton

```typescript
// components/ui/skeleton-card.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[125px] w-full rounded-xl" />
      </CardContent>
    </Card>
  )
}

// Uso pratico
export function ProductGrid({ products }: { products?: Product[] }) {
  if (!products) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

## 10. Dark Mode Implementation

```bash
npx shadcn@latest add mode-toggle
npm install next-themes
```

```typescript
// components/theme-provider.tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// components/mode-toggle.tsx (viene generato da shadcn)
// Aggiungilo alla navbar
import { ModeToggle } from "@/components/mode-toggle"

// In navbar:
<ModeToggle />
```

## 11. SEO Component Avanzato

```typescript
// components/seo.tsx
import { Metadata } from "next";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = "/og-default.jpg",
  noIndex = false,
}: SEOProps): Metadata {
  const siteName = "TuoSito";
  const siteUrl = "https://tuosito.com";

  return {
    title: {
      default: title,
      template: `%s | ${siteName}`,
    },
    description,
    keywords: keywords.join(", "),
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "it_IT",
      url: siteUrl,
      title,
      description,
      siteName,
      images: [
        {
          url: `${siteUrl}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}${image}`],
      creator: "@tuoaccount",
    },
    alternates: {
      canonical: siteUrl,
    },
  };
}

// app/page.tsx - Uso
export const metadata = generateMetadata({
  title: "Design System Next.js 15",
  description:
    "Guida completa per creare design system professionali con Next.js 15, TypeScript e shadcn/ui",
  keywords: ["next.js", "design system", "shadcn/ui", "typescript", "react"],
  image: "/og-homepage.jpg",
});
```

## 12. Structured Data per SEO

```typescript
// lib/structured-data.ts
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TuoSito",
    url: "https://tuosito.com",
    logo: "https://tuosito.com/logo.png",
    sameAs: [
      "https://twitter.com/tuoaccount",
      "https://github.com/tuoaccount",
      "https://linkedin.com/company/tuoaccount",
    ],
  }
}

export function generateArticleSchema(article: {
  title: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  authorName: string
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      "@type": "Person",
      name: article.authorName,
    },
  }
}

// app/layout.tsx - Aggiungi allo script
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(generateOrganizationSchema()),
  }}
/>
```

## 13. Performance Optimization

### Image Component Wrapper

```typescript
// components/optimized-image.tsx
import Image from "next/image"
import { cn } from "@/lib/utils"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  priority?: boolean
  className?: string
  aspectRatio?: "square" | "video" | "portrait"
}

const aspectRatioMap = {
  square: "aspect-square",
  video: "aspect-video",
  portrait: "aspect-[3/4]",
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  priority = false,
  className,
  aspectRatio,
}: OptimizedImageProps) {
  const containerClasses = cn(
    "relative overflow-hidden rounded-lg",
    aspectRatio && aspectRatioMap[aspectRatio],
    className
  )

  if (fill) {
    return (
      <div className={containerClasses}>
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          quality={90}
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    )
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      quality={90}
      className={cn("rounded-lg object-cover", className)}
    />
  )
}
```

### Dynamic Imports

```typescript
// components/heavy-component-loader.tsx
import dynamic from "next/dynamic"
import { Skeleton } from "@/components/ui/skeleton"

// Component pesante caricato solo quando necessario
const Chart = dynamic(() => import("@/components/chart"), {
  loading: () => <Skeleton className="h-[400px] w-full" />,
  ssr: false,
})

const InteractiveMap = dynamic(() => import("@/components/map"), {
  loading: () => (
    <div className="flex h-[500px] items-center justify-center bg-muted rounded-lg">
      <Icons.loader className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
  ssr: false,
})
```

## 14. Accessibility Best Practices

### Focus Visible Utilities

```typescript
// lib/focus-utilities.ts
export const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"

export const focusInput = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

// Uso nei componenti
<button className={cn("rounded-lg px-4 py-2", focusRing)}>
  Click me
</button>
```

### Skip to Content Link

```typescript
// components/skip-to-content.tsx
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
    >
      Salta al contenuto principale
    </a>
  )
}

// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body>
        <SkipToContent />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

## 15. Testing dei Componenti

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom
```

```typescript
// __tests__/button.test.tsx
import { render, screen } from "@testing-library/react"
import { Button } from "@/components/ui/button"
import "@testing-library/jest-dom"

describe("Button", () => {
  it("renders with correct text", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button")).toHaveTextContent("Click me")
  })

  it("applies variant classes correctly", () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole("button")
    expect(button).toHaveClass("bg-destructive")
  })

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole("button")).toBeDisabled()
  })
})
```

## 16. Storybook per Documentazione Componenti

```bash
npx storybook@latest init
```

```typescript
// stories/Button.stories.tsx
import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "outline", "secondary", "ghost", "link"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "xl", "icon"],
    },
  },
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Icons.mail className="mr-2 h-4 w-4" />
        Email
      </>
    ),
  },
}

export const Loading: Story = {
  args: {
    disabled: true,
    children: (
      <>
        <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
        Loading...
      </>
    ),
  },
}
```

## 17. Configurazione next.config.js Ottimizzata

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Strict mode per best practices React
  reactStrictMode: true,

  // Compressione output
  compress: true,

  // Ottimizzazione immagini
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },

  // Headers per sicurezza e caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
      {
        source: "/images/:all*(svg|jpg|png|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Webpack ottimizzazioni
  webpack: (config, { dev, isServer }) => {
    // Ottimizza bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          commons: {
            name: "commons",
            chunks: "all",
            minChunks: 2,
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
```

## 18. Checklist Finale Pre-Deploy

### Performance

- ✅ Tutte le immagini usano Next.js `<Image>`
- ✅ Font ottimizzati con `next/font`
- ✅ Componenti pesanti con dynamic import
- ✅ Bundle analyzer eseguito (`npm run analyze`)
- ✅ Lighthouse score > 90 su tutte le metriche

### SEO

- ✅ Meta tags su tutte le pagine
- ✅ Structured data implementato
- ✅ Sitemap generata (`/sitemap.xml`)
- ✅ robots.txt configurato
- ✅ Un solo H1 per pagina
- ✅ Alt text su tutte le immagini

### Accessibilità

- ✅ Contrasto colori WCAG AA (4.5:1)
- ✅ Navigazione da tastiera funzionante
- ✅ ARIA labels dove necessario
- ✅ Skip to content link presente
- ✅ Focus visible su tutti gli elementi interattivi

### TypeScript

- ✅ Nessun errore TypeScript (`npm run type-check`)
- ✅ Strict mode abilitato
- ✅ Props tipizzate su tutti i componenti

### Testing

- ✅ Unit test per componenti critici
- ✅ Test di accessibilità con jest-axe
- ✅ E2E test per user flows principali (Playwright/Cypress)

## Conclusione

Questa guida fornisce un framework completo e production-ready per costruire design system professionali con Next.js 15, TypeScript e shadcn/ui.

### Vantaggi chiave di questo stack:

- **shadcn/ui**: Controllo totale, accessibilità integrata, zero vendor lock-in
- **Lucide React**: Icone moderne, tree-shakeable, TypeScript-native
- **Next.js 15**: Performance ottimali, SEO-friendly, developer experience eccellente
- **TypeScript**: Type-safety, autocomplete, manutenibilità

### Prossimi passi:

1. Inizializza il progetto con i comandi di setup
2. Installa i componenti shadcn/ui di cui hai bisogno
3. Personalizza i design tokens in `globals.css`
4. Costruisci i tuoi componenti basandoti sui pattern di questa guida
5. Testa performance e accessibilità
6. Deploy su Vercel o altra piattaforma

### Risorse aggiuntive:

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)

---

**Keywords per SEO**: Next.js 15 design system, shadcn/ui tutorial, TypeScript React components, Lucide React icons, Tailwind CSS best practices, accessible web design, SEO optimization Next.js, React component library, design tokens TypeScript, modern web development
