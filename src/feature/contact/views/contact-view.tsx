"use client";

import { useState } from "react";
import { toast } from "sonner";

import { trpc } from "@/lib/trpc/client";
import heroImage from "@/assets/hero-pattachitra.jpg";

export function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success("Thank you — a curator will be in touch shortly.");
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: (error) => {
      toast.error(error.message || "Could not send your message.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit.mutate({ name, email, message });
  };

  return (
    <>
      <section className="relative h-[38vh] min-h-[260px] max-h-[420px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage.src}
          alt="Handcrafted Indian art in the ArtiSun studio"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/30 to-background/90" />
        <div className="relative z-10 mx-auto flex h-full max-w-[1200px] flex-col justify-end px-6 pb-10 md:px-10">
          <div className="eyebrow">Concierge</div>
          <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight md:text-5xl">
            Get in touch.
          </h1>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1200px] gap-16 px-6 py-16 md:grid-cols-2 md:px-10 md:py-20">
        <div>
          <p className="text-muted-foreground">
            For provenance questions, custom commissions, gifting, or trade
            enquiries, write to us. We reply within one business day.
          </p>
          <dl className="mt-10 space-y-6 text-sm">
            <div>
              <dt className="eyebrow">Our Studio</dt>
              <dd className="mt-1 leading-relaxed">
                Sector 9, Rohini
                <br />
                Delhi 110085, India
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Phone</dt>
              <dd className="mt-1 leading-relaxed">
                <a href="tel:+919565366555" className="hover:text-accent">
                  +91 95653 66555
                </a>
                <br />
                <a href="tel:+919078936696" className="hover:text-accent">
                  +91 90789 36696
                </a>
                <div className="mt-1 text-xs text-muted-foreground">
                  Mon – Sat · 10 AM to 6 PM IST
                </div>
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Email</dt>
              <dd className="mt-1">
                <a
                  href="mailto:artisun.in@gmail.com"
                  className="hover:text-accent"
                >
                  artisun.in@gmail.com
                </a>
                <div className="mt-1 text-xs text-muted-foreground">
                  We reply within 24 hours
                </div>
              </dd>
            </div>
          </dl>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="eyebrow" htmlFor="contact-name">
              Your name
            </label>
            <input
              id="contact-name"
              required
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={submit.isPending}
              className="mt-2 w-full border-b border-foreground/30 bg-transparent py-2 focus:border-accent focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="eyebrow" htmlFor="contact-email">
              Email
            </label>
            <input
              id="contact-email"
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submit.isPending}
              className="mt-2 w-full border-b border-foreground/30 bg-transparent py-2 focus:border-accent focus:outline-none disabled:opacity-50"
            />
          </div>
          <div>
            <label className="eyebrow" htmlFor="contact-message">
              How can we help?
            </label>
            <textarea
              id="contact-message"
              required
              name="message"
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submit.isPending}
              className="mt-2 w-full border-b border-foreground/30 bg-transparent py-2 focus:border-accent focus:outline-none disabled:opacity-50"
            />
          </div>
          <button
            type="submit"
            disabled={submit.isPending}
            className="bg-foreground px-8 py-4 text-xs uppercase tracking-[0.24em] text-background transition-colors hover:bg-accent disabled:opacity-50"
          >
            {submit.isPending ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>

      <section className="mx-auto max-w-[1200px] px-6 pb-24 md:px-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="eyebrow">Find us</div>
            <h2 className="mt-2 font-display text-2xl md:text-3xl">
              Sector 9, Rohini · Delhi
            </h2>
          </div>
          <a
            href="https://www.google.com/maps/place/Sector+9,+Rohini,+Delhi,+110085/@28.7148319,77.1185471,16z"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-accent pb-1 text-xs uppercase tracking-[0.22em] hover:text-accent"
          >
            Open in Maps →
          </a>
        </div>
        <div className="aspect-[16/9] overflow-hidden border border-border/60">
          <iframe
            title="ArtiSun studio location — Sector 9, Rohini, Delhi"
            src="https://www.google.com/maps?q=Sector+9,+Rohini,+Delhi+110085&z=15&output=embed"
            className="h-full w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
      </section>
    </>
  );
}
