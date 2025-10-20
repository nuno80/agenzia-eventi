# Task: Restyling Homepage - Agenzia Eventi

## Obiettivo

Trasformare la homepage attuale in un design moderno, accattivante e performante seguendo le best practices di web design e le architetture definite in AGENTS.MD.

## Stato Attuale

- Homepage funzionante ma con design datato
- CSS con classi undefined (`text-first-color`, `bg-cyan-color`, ecc.)
- Design anni 2010 con bordi grigi e hover effects basic
- Hero section poco impattante

## Design System Proposto

### Color Palette

```css
/* Primary Variables */
--.primary-start: #0ea5e9; /* Sky Blue */
--primary-end: #6366f1; /* Indigo */
--primary: linear-gradient(135deg, var(--primary-start), var(--primary-end));

/* Secondary Colors */
--dark-50: #f9fafb;
--dark-100: #f3f4f6;
--dark-900: #111827;
--dark-800: #1f2937;

/* Accent Colors */
--accent-cyan: #06b6d4;
--accent-blue: #3b82f6;

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
```

### Tipografia

- **Headlines**: Inter o SF Pro Display (Google Fonts)
- **Body**: Inter o system-ui
- **Weights**: 300 (Light), 400 (Regular), 600 (Semi-bold), 700 (Bold), 800 (Extra-bold)

### Spaziature

- **Scale**: 4px base → 8px, 16px, 24px, 32px, 48px, 64px, 96px, 128px
- **Container**: Max-width 1440px con padding responsive

---

## Fasi di Implementazione

### FASE 1: Setup Configurazione Base

#### 1.1 Aggiornare Tailwind Config

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
      gradient: {
        primary: 'linear-gradient(135deg, #0EA5E9 0%, #6366F1 100%)',
        secondary: 'linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)',
      }
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Inter', 'system-ui', 'sans-serif'],
    },
    animation: {
      'fade-in': 'fadeIn 0.8s ease-out',
      'slide-up': 'slideUp 0.6s ease-out',
      'bounce-slow': 'bounce 2s infinite',
    }
  }
}
```

#### 1.2 Creare CSS Custom Properties

```css
/* src/app/globals.css */
:root {
  --gradient-primary: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%);
  --gradient-secondary: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
  --shadow-elevation-1: 0 2px 4px -1px rgb(0 0 0 / 0.1);
  --shadow-elevation-2: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --shadow-elevation-3: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}
```

---

### FASE 2: Componenti UI Moderni

#### 2.1 Componenti Base Riutilizzabili

```typescript
// src/components/ui/gradient-button.tsx
export function GradientButton({
  children,
  variant = "primary",
  size = "md",
  className = ""
}: ButtonProps) {
  return (
    <button className={cn(
      "relative overflow-hidden rounded-full font-semibold transition-all duration-300",
      "before:absolute before:inset-0 before:opacity-0 hover:before:opacity-100",
      "before:transition-opacity before:duration-300",
      variant === "primary" && "bg-gradient-primary text-white hover:shadow-lg",
      variant === "outline" && "border-2 border-white text-white hover:bg-white hover:text-gray-900",
      className
    )}>
      {children}
    </button>
  );
}
```

#### 2.2 Componente Hero Moderno

```typescript
// src/components/sections/hero.tsx
export function HeroSection() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image + Overlay */}
      <div className="absolute inset-0">
        {/* <Image src="/hero-bg.jpg" fill className="object-cover" /> */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          Nuova Agenzia
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-gray-200"
        >
          Siamo una giovane agenzia di Hostess, Steward, Modelle e Promoter
          specializzata nel servizio di accoglienza e promozione che opera a
          Milano e nelle principali città italiane ed europee.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <GradientButton size="lg">
            Scopri i Nostri Servizi
          </GradientButton>
          <GradientButton variant="outline" size="lg">
            Richiedi Preventivo
          </GradientButton>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </motion.div>
    </section>
  );
}
```

---

### FASE 3: Sezioni Principali

#### 3.1 Services Section Redesign

```typescript
// src/components/sections/services.tsx
export function ServicesSection() {
  const services = [
    {
      title: "HOSTESS",
      description: "Accoglienza, accreditamento e rappresentanza dell'immagine aziendale con professionalità ed eleganza.",
      image: "/images/Hostess.jpg",
      features: ["Accoglienza clienti", "Registrazione presenze", "Supporto eventi"]
    },
    {
      title: "MODELLE/I",
      description: "Ragazzi e ragazze selezionati per bellezza ed eleganza, perfetti per shooting, sfilate e eventi fashion.",
      image: "/images/Modella.jpg",
      features: ["Shooting fotografici", "Sfilate moda", "Eventi premium"]
    },
    {
      title: "PROMOTER",
      description: "Promozione del brand attraverso presentazione diretta e distribuzione di materiali informativi.",
      image: "/images/promoter.jpg",
      features: ["Promozione attiva", "Sampling prodotti", "Brand awareness"]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
            Di Cosa Ci Occupiamo
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Specializzati in accoglienza e promozione per garantire il successo del tuo evento
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Title Overlay */}
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-3xl font-bold text-white">{service.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button className="w-full group-hover:bg-gradient-primary transition-all duration-300">
                  Scopri di più
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### 3.2 Values Section con Icons

```typescript
// src/components/sections/values.tsx
export function ValuesSection() {
  const values = [
    {
      title: "SERIETÀ",
      description: "Approccio professionale e responsabile in ogni progetto",
      icon: Shield
    },
    {
      title: "CORTESIA",
      description: "Gentilezza e attenzione ai dettagli nel servizio clienti",
      icon: Heart
    },
    {
      title: "DISPONIBILITÀ",
      description: "Flessibilità totale per soddisfare ogni esigenza",
      icon: Clock
    },
    {
      title: "PROFESSIONALITÀ",
      description: "Competenza e formazione continua del nostro team",
      icon: Award
    }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
              I Nostri Valori
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-start space-x-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
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
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-8 -right-8 bg-white rounded-xl shadow-lg p-4"
            >
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">Team Online</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

---

### FASE 4: Form Contatto Moderno

#### 4.1 Contact Section con Validation

```typescript
// src/components/sections/contact-form.tsx
export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    company: '',
    email: '',
    phone: '',
    city: '',
    service: '',
    message: '',
    privacy: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Campo obbligatorio';
    if (!formData.company.trim()) newErrors.company = 'Campo obbligatorio';
    if (!formData.email.trim()) newErrors.email = 'Campo obbligatorio';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email non valida';
    if (!formData.phone.trim()) newErrors.phone = 'Campo obbligatorio';
    if (!formData.city.trim()) newErrors.city = 'Campo obbligatorio';
    if (!formData.privacy) newErrors.privacy = 'Accettazione privacy richiesta';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // API call submission
      await ContactService.submitForm(formData);
      // Success handling
    } catch (error) {
      // Error handling
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <FormField
          label="Nome e Cognome"
          id="name"
          value={formData.name}
          onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
          error={errors.name}
          required
        />

        <FormField
          label="Nome Azienda"
          id="company"
          value={formData.company}
          onChange={(value) => setFormData(prev => ({ ...prev, company: value }))}
          error={errors.company}
          required
        />
      </div>

      {/* Additional form fields... */}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <span className="flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Invio in corso...
          </span>
        ) : (
          'Invia Richiesta Preventivo'
        )}
      </Button>
    </form>
  );
}
```

---

### FASE 5: Animazioni e Micro-interactions

#### 5.1 Setup Framer Motion

```typescript
// package.json additions
{
  "dependencies": {
    "framer-motion": "^10.16.4",
    "@formkit/auto-animate": "^1.0.0-beta.6"
  }
}
```

#### 5.2 AOS (Animate On Scroll) Implementation

```typescript
// src/hooks/use-scroll-reveal.ts
export function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -100px 0px" }
    );

    document.querySelectorAll("[data-reveal]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);
}
```

---

### FASE 6: Performance Optimization

#### 6.1 Image Optimization

```typescript
// src/components/optimized-image.tsx
export function OptimizedImage({
  src,
  alt,
  priority = false,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
}: OptimizedImageProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-opacity duration-300"
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
        onLoad={(e) => {
          (e.target as HTMLImageElement).style.opacity = '1';
        }}
      />
    </div>
  );
}
```

#### 6.2 Lazy Loading Components

```typescript
// src/components/lazy-section.tsx
export function LazySection({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : <SectionSkeleton />}
    </div>
  );
}
```

---

### FASE 7: Mobile Optimization

#### 7.1 Responsive Breakpoints

```css
/* Mobile-first approach */
/* Mobile: 320px - 768px */
/* Tablet: 768px - 1024px */
/* Desktop: 1024px - 1440px */
/* Large Desktop: 1440px+ */

.container {
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 0 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1024px;
  }
}

@media (min-width: 1440px) {
  .container {
    max-width: 1440px;
  }
}
```

#### 7.2 Touch-friendly Interactions

```typescript
// Mobile-optimized button
<Button className="min-h-[44px] min-w-[44px] touch-manipulation">
  Tap Target
</Button>

// Mobile navigation
<MobileNav>
  <HamburgerMenu onClick={() => setIsOpen(!isOpen)} />
  <AnimatePresence>
    {isOpen && (
      <motion.nav
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Navigation items */}
      </motion.nav>
    )}
  </AnimatePresence>
</MobileNav>
```

---

### FASE 8: Accessibility & SEO

#### 8.1 Semantic HTML5 Structure

```html
<main role="main">
  <section aria-labelledby="hero-heading">
    <h1 id="hero-heading">Nuova Agenzia Eventi</h1>
  </section>

  <section aria-labelledby="services-heading">
    <h2 id="services-heading">I Nostri Servizi</h2>
  </section>

  <section aria-labelledby="contact-heading">
    <h2 id="contact-heading">Contattaci</h2>
  </section>
</main>
```

#### 8.2 ARIA Labels & Roles

```typescript
<button
  aria-label="Invia richiesta di preventivo"
  aria-describedby="form-help-text"
>
  Invia Richiesta
</button>

<div
  role="img"
  aria-label="Hostess professionale in abito elegante"
  className="image-container"
>
  <Image src="/hostess.jpg" alt="" />
</div>
```

#### 8.3 SEO Meta Tags

```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  title: "Nuova Agenzia - Hostess, Steward, Modelle e Promoter",
  description:
    "Agenzia specializzata in servizi di accoglienza e promozione. Hostess, steward, modelle e promoter per eventi a Milano e in tutta Italia.",
  keywords:
    "hostess, steward, modelle, promoter, agenzia eventi, milano, accoglienza",
  openGraph: {
    title: "Nuova Agenzia - Servizi per Eventi",
    description:
      "Professionisti dell'accoglienza e promozione per il tuo evento",
    images: ["/og-image.jpg"],
  },
};
```

---

## File Structure

```
src/
├── app/
│   ├── page.tsx                    # Main homepage
│   ├── layout.tsx                  # Updated with fonts, meta
│   └── globals.css                 # Updated custom properties
├── components/
│   ├── ui/                         # Reusable components
│   │   ├── gradient-button.tsx
│   │   ├── form-field.tsx
│   │   ├── optimized-image.tsx
│   │   └── lazy-section.tsx
│   ├── sections/                   # Page sections
│   │   ├── hero.tsx
│   │   ├── services.tsx
│   │   ├── values.tsx
│   │   └── contact-form.tsx
│   ├── layout/
│   │   └── navbar.tsx             # Updated with modern styling
│   └── animations/
│       └── scroll-reveal.tsx
├── lib/
│   ├── utils/
│   │   ├── animations.ts
│   │   └── validation.ts
│   └── types/
│       └── contact.ts
└── styles/
    └── animations.css               # Custom keyframes
```

---

## Implementation Priority

### Phase 1 (Critical) - Week 1

- [x] Setup Tailwind config with new color palette
- [x] Create base UI components (Button, Card, Form Field)
- [x] Update Navbar with modern design
- [x] Implement Hero section with animations

### Phase 2 (Important) - Week 2

- [ ] Redesign Services section with modern cards
- [ ] Implement Values section with icons
- [ ] Add scroll reveal animations
- [ ] Optimize image loading

### Phase 3 (Enhancement) - Week 3

- [ ] Modern contact form with validation
- [ ] Mobile navigation overhaul
- [ ] Performance optimization
- [ ] Accessibility improvements

### Phase 4 (Polish) - Week 4

- [ ] Micro-interactions and hover states
- [ ] Loading states and skeleton screens
- [ ] SEO optimization
- [ ] Testing and bug fixes

---

## Success Metrics

### Performance

- Lighthouse score: >90 (Performance, Accessibility, Best Practices, SEO)
- Page load time: <2 seconds (mobile), <1 second (desktop)
- First Contentful Paint: <1 second

### User Experience

- Mobile conversion rate improvement: 25%+
- Average session duration: +40%
- Bounce rate reduction: 30%

### Technical

- Core Web Vitals within thresholds
- Zero console errors
- 100% responsive across all devices

---

## Documentation Required

1. **Component Storybook** - Document all new components
2. **Design System Guide** - Colors, typography, spacing
3. **Animation Guidelines** - When and how to use animations
4. **Mobile Development Guide** - Responsive patterns and best practices
5. **Performance Audit Report** - Before and after optimization

---

## Testing Strategy

### Unit Tests

- Form validation logic
- Component rendering
- Utility functions

### Integration Tests

- Form submission flow
- Navigation interactions
- Image loading behavior

### E2E Tests

- Complete user journey from landing to contact form submission
- Mobile vs desktop experience parity
- Accessibility compliance (screen readers, keyboard navigation)

### Performance Tests

- Lighthouse audits
- Bundle size analysis
- Image optimization verification

---

## Launch Checklist

- [ ] All components built and tested
- [ ] Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile device testing (iOS, Android)
- [ ] Accessibility audit completed
- [ ] Performance targets met
- [ ] SEO meta tags implemented
- [ ] Forms have CSRF protection
- [ ] Error handling implemented
- [ ] Analytics tracking set up
- [ ] Documentation completed

---

## Next Steps After Launch

1. **Analytics Setup** - Track user behavior and conversion metrics
2. **A/B Testing** - Test different CTAs and layouts
3. **Performance Monitoring** - Set up alerts for performance degradation
4. **User Feedback Collection** - Implement feedback mechanism
5. **Continuous Optimization** - Based on data-driven insights

---

_Questo documento dettaglia l'intero processo di restyling della homepage, dalla strategia all'implementazione tecnica. Ogni fase è progettata per essere implementata_incrementalmente con validazione continua._
