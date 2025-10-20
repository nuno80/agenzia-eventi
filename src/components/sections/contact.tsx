"use client";

import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Container from "@/components/ui/container";
import {
  AlertCircleIcon,
  CheckIcon,
  LoadingIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/ui/icon";
import Section from "@/components/ui/section";

interface ContactFormData {
  name: string;
  company: string;
  email: string;
  phone: string;
  city: string;
  service: string;
  message: string;
  privacy: boolean;
}

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    company: "",
    email: "",
    phone: "",
    city: "",
    service: "",
    message: "",
    privacy: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Campo obbligatorio";
    if (!formData.company.trim()) newErrors.company = "Campo obbligatorio";
    if (!formData.email.trim()) {
      newErrors.email = "Campo obbligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email non valida";
    }
    if (!formData.phone.trim()) newErrors.phone = "Campo obbligatorio";
    if (!formData.city.trim()) newErrors.city = "Campo obbligatorio";
    if (!formData.privacy) newErrors.privacy = "Accettazione privacy richiesta";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simula API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setIsSubmitted(true);
      setFormData({
        name: "",
        company: "",
        email: "",
        phone: "",
        city: "",
        service: "",
        message: "",
        privacy: false,
      });
      setErrors({});
    } catch (error) {
      console.error("Errore nell'invio del form:", error);
      setErrors({ submit: "Si è verificato un errore. Riprova più tardi." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    field: keyof ContactFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  if (isSubmitted) {
    return (
      <Section spacing="xl" background="muted" id="contatti">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-6">
              <CheckIcon className="mx-auto h-16 w-16 text-green-500" />
            </div>
            <h2 className="gradient-text-primary mb-4 text-3xl font-bold">
              Grazie per averci contattato!
            </h2>
            <p className="mb-8 text-lg text-gray-600">
              Ti risponderemo il prima possibile. Il nostro team è già al lavoro
              per elaborare la tua richiesta.
            </p>
            <Button
              size="lg"
              onClick={() => setIsSubmitted(false)}
              className="gradient-bg-primary"
            >
              Invia un altro messaggio
            </Button>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section spacing="xl" background="muted" id="contatti">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Contact Info & Logo */}
          <div>
            <h2 className="gradient-text-primary mb-8 text-4xl font-bold md:text-5xl">
              Contattaci
            </h2>

            <Card elevated className="mb-8">
              <CardContent className="p-6">
                <Image
                  src="/images/logo_agenzia.png"
                  alt="Nuova agenzia Logo"
                  width={200}
                  height={80}
                  className="mb-6"
                />
                <h3 className="mb-4 text-xl font-semibold">
                  Lavoriamo per il tuo successo
                </h3>
                <p className="mb-6 text-gray-600">
                  Siamo disponibili 24/7 per aiutare la tua impresa e promuovere
                  valorizziamo l'immagine della tua azienda.
                </p>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MailIcon className="h-5 w-5 text-cyan-500" />
                    <span className="text-gray-700">info@nuovaagenzia.it</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-cyan-500" />
                    <span className="text-gray-700">+39 02 12345678</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPinIcon className="h-5 w-5 text-cyan-500" />
                    <span className="text-gray-700">
                      Via Milano, 1/25, 20081 Abbiategrasso MI
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <h3 className="mb-4 text-lg font-semibold">
                Seguici sui principali social!
              </h3>
              <p className="text-sm text-gray-500">
                | Privacy Policy | Via Milano, 1/25, 20081 Abbiategrasso MI
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card elevated>
              <CardHeader>
                <CardTitle className="gradient-text-primary text-2xl">
                  Scrivici per un preventivo!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Nome e Cognome <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={`w-full rounded-md border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Nome Azienda <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                        className={`w-full rounded-md border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          errors.company ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.company && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        E-mail <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className={`w-full rounded-md border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium">
                        Telefono <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className={`w-full rounded-md border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                        disabled={isSubmitting}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Città <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                      className={`w-full rounded-md border px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-500">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Servizio richiesto
                    </label>
                    <input
                      type="text"
                      value={formData.service}
                      onChange={(e) =>
                        handleInputChange("service", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Es: Hostess per evento"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium">
                      Descrivi la tua richiesta
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        handleInputChange("message", e.target.value)
                      }
                      className="w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      placeholder="Dettaglia il tuo evento o esigenza..."
                      disabled={isSubmitting}
                    ></textarea>
                  </div>

                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      id="privacy"
                      checked={formData.privacy}
                      onChange={(e) =>
                        handleInputChange("privacy", e.target.checked)
                      }
                      className="mr-2 mt-1"
                      disabled={isSubmitting}
                    />
                    <label htmlFor="privacy" className="text-sm text-gray-600">
                      Ho preso visione dell'informativa sulla privacy.
                    </label>
                  </div>
                  {errors.privacy && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.privacy}
                    </p>
                  )}

                  {errors.submit && (
                    <div className="flex items-center text-red-500">
                      <AlertCircleIcon className="mr-2 h-4 w-4" />
                      <span className="text-sm">{errors.submit}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="gradient-bg-primary w-full py-3 font-semibold text-white"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <LoadingIcon className="mr-2" />
                        Invio in corso...
                      </span>
                    ) : (
                      "Invia Richiesta Preventivo"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  );
}

export default ContactSection;
