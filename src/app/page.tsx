"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, CheckCircle, Phone, Mail, Calendar, GraduationCap, Sparkles } from "lucide-react";

// Helper: Smooth scroll to id
function useSmoothScroll() {
  return (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };
}

// Reusable Button
const Btn: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { asLink?: boolean }> = ({ className = "", children, ...props }) => (
  <button
    {...props}
    className={`group inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 bg-indigo-600 text-white hover:bg-indigo-700 ${className}`}
  >
    {children}
    <ArrowRight className="h-4 w-4 translate-x-0 transition-transform group-hover:translate-x-0.5" />
  </button>
);

// NavLink
const NavLink: React.FC<{ to: string; onClick?: () => void; label: string }> = ({ to, onClick, label }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 focus:outline-none"
    >
      {label}
    </button>
  );
};



export default function ElevateTutoringPage() {
  // ✅ inside ElevateTutoringPage()
const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  const formEl = e.currentTarget;
  const data = {
    name: (formEl.elements.namedItem("name") as HTMLInputElement)?.value,
    email: (formEl.elements.namedItem("email") as HTMLInputElement)?.value,
    board: (formEl.elements.namedItem("board") as HTMLSelectElement)?.value,
    time: (formEl.elements.namedItem("time") as HTMLSelectElement)?.value,
    message: (formEl.elements.namedItem("message") as HTMLTextAreaElement)?.value,
  };

  setStatus("loading");
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Bad response");
    setStatus("ok");
    formEl.reset();
  } catch {
    setStatus("error");
  }
};

  const [open, setOpen] = useState(false);
  // Close on ESC + lock body scroll when menu is open
useEffect(() => {
  const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
  window.addEventListener("keydown", onKey);
  if (open) {
    document.documentElement.style.overflow = "hidden";
  } else {
    document.documentElement.style.overflow = "";
  }
  return () => {
    window.removeEventListener("keydown", onKey);
    document.documentElement.style.overflow = "";
  };
}, [open]);

  const scrollTo = useSmoothScroll();

  const links = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "consultation", label: "Consultation" },
    { id: "pricing", label: "Pricing" },
    { id: "gallery", label: "Gallery" },
    { id: "faq", label: "FAQ" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.replace('#','');
      if (id) scrollTo(id);
    };
    onHash();
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  return (
    <div className="relative min-h-[720vh] bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* NAVBAR */}
      {/* NAVBAR */}
<header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
    {/* Brand */}
    <div className="flex items-center gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow-md">
        <GraduationCap className="h-6 w-6" />
      </div>
      <div className="leading-none">
        <p className="text-lg font-bold tracking-tight">Elevate Tutor</p>
        <p className="text-xs text-slate-500">GCSE Maths (AQA · OCR · EDEXCEL)</p>
      </div>
    </div>

    {/* Desktop nav */}
    <nav className="hidden items-center gap-1 md:flex">
      {links.map((l) => (
        <button
          key={l.id}
          onClick={() => scrollTo(l.id)}
          className="rounded-xl px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 focus:outline-none"
        >
          {l.label}
        </button>
      ))}
    </nav>

    {/* Desktop CTA */}
    <div className="hidden md:flex">
      <Btn onClick={() => scrollTo("consultation")}>Book Free Consultation</Btn>
    </div>

    {/* Mobile hamburger */}
    <button
      className="md:hidden grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white shadow-sm text-slate-800"
      onClick={() => setOpen((s) => !s)}
      aria-label="Toggle menu"
      aria-controls="mobile-menu"
      aria-expanded={open}
    >
      {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
  </div>

  {/* Mobile menu (simple, no animation libs) */}
  <div
    id="mobile-menu"
    className={`md:hidden border-t border-slate-200 bg-white transition-[max-height] duration-300 overflow-hidden ${open ? "max-h-[60vh]" : "max-h-0"}`}
  >
    <div className="px-4 py-3">
      <div className="grid gap-1">
        {links.map((l) => (
          <button
            key={l.id}
            onClick={() => { setOpen(false); scrollTo(l.id); }}
            className="w-full rounded-xl px-3 py-3 text-left text-base font-medium hover:bg-slate-100"
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Btn
          className="w-full justify-center"
          onClick={() => { setOpen(false); scrollTo("consultation"); }}
        >
          Book Free Consultation
        </Btn>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <a
          href="tel:+447480454229"
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
        >
          <Phone className="h-4 w-4" /> Call
        </a>
        <a
          href="#contact"
          onClick={(e) => { e.preventDefault(); setOpen(false); scrollTo("contact"); }}
          className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 hover:bg-slate-50"
        >
          <Mail className="h-4 w-4" /> Email
        </a>
      </div>
    </div>
  </div>
</header>

      {/* HERO */}
      <section id="home" className="relative min-h-[110vh]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1513258496099-48168024aec0?q=80&w=2000&auto=format&fit=crop"
            alt="Study desk"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-white/0" />
        </div>
        <div className="relative mx-auto flex min-h-[110vh] max-w-7xl flex-col items-start justify-center px-4 py-24 md:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="max-w-3xl text-white">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> GCSE Maths · Online · UK Exam Boards
            </p>
            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
              GCSE Maths Tutoring that builds <span className="text-indigo-300">confidence</span> and results
            </h1>
            <p className="mt-4 text-base/relaxed text-slate-100 sm:text-lg">
              One‑to‑one online lessons tailored to AQA, OCR, and Edexcel. Learn smarter revision methods and walk into your exams prepared.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Btn onClick={() => scrollTo("consultation")}>Book Free Consultation</Btn>
              <button onClick={() => scrollTo("about")} className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20">
                Learn more
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="min-h-[120vh] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-extrabold md:text-4xl">Hi, I’m Rida 👋</h2>

              <p className="mt-4 text-slate-700">
                I hold a degree in Biomedical Sciences from King’s College London and achieved an A* in GCSE Maths.
                My lessons are practical, calm, and focused on getting you exam-ready — without wasting time.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-800">How I teach</p>
                  <ul className="mt-2 space-y-2 text-slate-700">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-indigo-600" />
                      <span><strong>Review the syllabus</strong> (AQA / OCR / Edexcel), identify weak spots with a quick diagnostic.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-indigo-600" />
                      <span><strong>Targeted past-paper practice</strong> to build confidence exactly where it’s needed.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-indigo-600" />
                      <span><strong>Active recall + repetition</strong> — the fastest way to strengthen neural pathways and retain methods.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-indigo-600" />
                      <span><strong>Revision schedule</strong> you can follow outside tutoring hours, so momentum continues between lessons.</span>
                    </li>
                  </ul>
                </div>

                <ul className="space-y-3 text-slate-700">
                  {[
                    "Clear explanations with step-by-step worked solutions",
                    "Exam technique and time management",
                    "Regular check-ins so you (and parents) see progress",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 text-indigo-600" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex gap-3">
                <Btn onClick={() => scrollTo("consultation")}>Free 20-min consultation</Btn>
                <button
                  onClick={() => scrollTo("pricing")}
                  className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold hover:bg-slate-50"
                >
                  See pricing
                </button>
              </div>
            </motion.div>


            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="relative">
              <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-2xl ring-1 ring-black/5">
                <img
                  src="\20250421_174250.jpg"
                  alt="Tutor portrait"
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONSULTATION CTA */}
      <section id="consultation" className="relative min-h-[110vh]">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=2000&auto=format&fit=crop" alt="Notebook and laptop" className="h-full w-full object-cover"/>
          <div className="absolute inset-0 bg-indigo-900/70" />
        </div>
        <div className="relative mx-auto flex min-h-[110vh] max-w-7xl items-center px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="max-w-2xl rounded-3xl bg-white/95 p-8 shadow-2xl ring-1 ring-black/5">
            <h3 className="flex items-center gap-2 text-2xl font-extrabold md:text-3xl"><Calendar className="h-6 w-6 text-indigo-600"/> Book a Free 20‑Minute Consultation</h3>
            <p className="mt-3 text-slate-700">
              Every student learns differently. Let’s chat, get to know each other, and pick the best approach for your learning style.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-semibold">What you get</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> Mini skills assessment</li>
                  <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> Exam board mapping (AQA/OCR/Edexcel)</li>
                  <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> Personalised study plan</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-semibold">How it works</p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> 20‑min video call</li>
                  <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> Q&A + next steps</li>
                  <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> No obligation</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Btn onClick={() => scrollTo("contact")}>Request your slot</Btn>
              <a href="#pricing" onClick={(e)=>{e.preventDefault(); scrollTo('pricing')}} className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50">See prices</a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="min-h-[120vh] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-3xl font-extrabold md:text-4xl">Booking & Pricing</h3>
            <p className="mt-3 text-slate-700">Simple, transparent options—pay as you go or save with bundles.</p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Hourly */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-semibold text-indigo-600">Single Lesson</p>
              <h4 className="mt-1 text-3xl font-black">£35<span className="text-base font-semibold text-slate-500"> / hour</span></h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> 1‑to‑1 online tutoring</li>
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> Past paper focus</li>
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> Homework support</li>
              </ul>
              <div className="mt-6"><Btn onClick={() => scrollTo("contact")} className="w-full justify-center">Book now</Btn></div>
            </div>

            {/* Bundles */}
            <div className="rounded-3xl border-2 border-indigo-600 bg-white p-6 shadow-md">
              <p className="text-sm font-semibold text-indigo-600">Best Value</p>
              <h4 className="mt-1 text-3xl font-black">Bundles</h4>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> 10 hours — <span className="font-semibold">£298</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> 20 hours — <span className="font-semibold">£560</span></li>
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> 50 hours — <span className="font-semibold">£1,225</span></li>
              </ul>
              <div className="mt-6"><Btn onClick={() => scrollTo("contact")} className="w-full justify-center">Reserve hours</Btn></div>
            </div>

            {/* Personal Statement */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <p className="text-sm font-semibold text-indigo-600">Uni Support</p>
              <h4 className="mt-1 text-3xl font-black">PS Review</h4>
              <p className="mt-1 text-2xl font-bold">£60</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> Online video meeting</li>
                <li className="flex items-start gap-2"><CheckCircle className="mt-0.5 h-4 w-4 text-indigo-600"/> Revisions & edits</li>
              </ul>
              <div className="mt-6"><Btn onClick={() => scrollTo("contact")} className="w-full justify-center">Get feedback</Btn></div>
            </div>
          </div>

          {/* Payment note */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Payments are handled securely after the consultation. Flexible scheduling to suit school commitments.
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section id="faq" className="min-h-[110vh]">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h3 className="text-3xl font-extrabold md:text-4xl">Frequently Asked Questions</h3>
            <p className="mt-3 text-slate-700">If you can’t find an answer, just reach out.</p>
          </div>
          <div className="mx-auto mt-8 max-w-3xl divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
            {[
              { q: "Which exam boards do you cover?", a: "AQA, OCR, and Edexcel for GCSE Maths." },
              { q: "How are lessons delivered?", a: "Online via video call with interactive whiteboard and shared resources." },
              { q: "Do you set homework?", a: "Yes—targeted practice between sessions to reinforce learning." },
              { q: "What technology do I need?", a: "A stable internet connection, a laptop or tablet, and Google Docs/Drive access." },
            ].map((f, i) => (
              <details key={i} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                  <span className="text-left text-lg font-semibold">{f.q}</span>
                  <span className="rounded-full border border-slate-300 px-2 py-0.5 text-xs text-slate-500 group-open:bg-slate-50">Open</span>
                </summary>
                <p className="mt-3 text-slate-700">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="min-h-[120vh] bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6">
          <div className="grid items-start gap-8 md:grid-cols-2">
            <div>
              <h3 className="text-3xl font-extrabold md:text-4xl">Get in touch</h3>
              <p className="mt-3 text-slate-700">Ready to boost your GCSE Maths confidence? Request your free consultation or ask a question.</p>

              <div className="mt-6 grid gap-3">
                <a href="tel:+447480454229" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100"><Phone className="h-5 w-5 text-indigo-600"/> <span className="font-semibold">+44 7480 454229</span></a>
                <a href="mailto:info@elevatetutor.co.uk" className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 hover:bg-slate-100"><Mail className="h-5 w-5 text-indigo-600"/> <span className="font-semibold">info@elevatetutor.co.uk</span></a>
              </div>

              <div className="mt-10 rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-700">Accreditations & Boards</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="rounded-xl border border-slate-200 bg-white px-3 py-1">AQA</span>
                  <span className="rounded-xl border border-slate-200 bg-white px-3 py-1">OCR</span>
                  <span className="rounded-xl border border-slate-200 bg-white px-3 py-1">Edexcel</span>
                </div>
              </div>
            </div>

            {/* Simple (non-functional) form scaffold */}
            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="grid gap-4">
                <div>
                  <label className="text-sm font-medium">Your name</label>
                  <input name="name" required className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-indigo-600/30 focus:ring" placeholder="Jane Doe"/>
                </div>
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <input name="email" type="email" required className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-indigo-600/30 focus:ring" placeholder="jane@email.com"/>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Exam board</label>
                    <select name="board" className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-indigo-600/30 focus:ring">
                      <option>AQA</option>
                      <option>OCR</option>
                      <option>Edexcel</option>
                      <option>Not sure</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Preferred time</label>
                    <select name="time" className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-indigo-600/30 focus:ring">
                      <option>Weekday evening</option>
                      <option>Weekend morning</option>
                      <option>Weekend afternoon</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Message</label>
                  <textarea name="message" rows={5} className="mt-1 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none ring-indigo-600/30 focus:ring" placeholder="Tell me about your goals…"/>
                </div>

                <Btn className="justify-center" disabled={status === "loading"}>
                  {status === "loading" ? "Sending…" : "Send request"}
                </Btn>

                {status === "ok" && (
                  <p className="text-sm font-semibold text-emerald-600">Thanks! I’ll be in touch shortly.</p>
                )}
                {status === "error" && (
                  <p className="text-sm font-semibold text-rose-600">Something went wrong. Please try again or email me directly.</p>
                )}
              </div>
            </form>

          </div>
        </div>
      </section>

      {/* FOOTER */}
{/* FOOTER */}
<footer className="border-t border-slate-200 bg-slate-50">
  <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
    <div className="grid gap-10 md:grid-cols-4">
      {/* Brand */}
      <div>
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-indigo-600 text-white shadow">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-lg font-bold">Elevate Tutor</p>
            <p className="text-xs text-slate-500">GCSE Maths · AQA · OCR · Edexcel</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600">
          One-to-one online lessons that build confidence, exam technique, and real results.
        </p>
      </div>

      {/* Quick Links */}
      <div>
        <p className="text-sm font-semibold text-slate-800">Quick links</p>
        <ul className="mt-3 grid gap-2 text-sm text-slate-600">
          <li><a className="hover:underline" href="#about" onClick={(e)=>{e.preventDefault(); scrollTo('about')}}>About</a></li>
          <li><a className="hover:underline" href="#consultation" onClick={(e)=>{e.preventDefault(); scrollTo('consultation')}}>Free Consultation</a></li>
          <li><a className="hover:underline" href="#pricing" onClick={(e)=>{e.preventDefault(); scrollTo('pricing')}}>Pricing</a></li>
          <li><a className="hover:underline" href="#faq" onClick={(e)=>{e.preventDefault(); scrollTo('faq')}}>FAQ</a></li>
          <li><a className="hover:underline" href="#contact" onClick={(e)=>{e.preventDefault(); scrollTo('contact')}}>Contact</a></li>
        </ul>
      </div>

      {/* Services */}
      <div>
        <p className="text-sm font-semibold text-slate-800">Services</p>
        <ul className="mt-3 grid gap-2 text-sm text-slate-600">
          <li>GCSE Maths Tutoring (Online)</li>
          <li>Past-Paper Practice & Exam Strategy</li>
          <li>Study Plans & Revision Coaching</li>
          <li>University Personal Statement Review</li>
        </ul>
      </div>

      {/* Contact */}
      <div>
        <p className="text-sm font-semibold text-slate-800">Contact</p>
        <div className="mt-3 grid gap-2 text-sm text-slate-600">
          <a href="tel:+447480454229" className="flex items-center gap-2 hover:underline">
            <Phone className="h-4 w-4 text-indigo-600" />
            +447480454229
          </a>
          <a href="mailto:info@elevatetutor.co.uk" className="flex items-center gap-2 hover:underline">
            <Mail className="h-4 w-4 text-indigo-600" />
            info@elevatetutor.co.uk
          </a>
          <p className="text-xs text-slate-500">Mon–Sat · 09:00–19:00 (UK)</p>
        </div>
        <div className="mt-4">
          <Btn onClick={() => scrollTo("consultation")} className="w-full justify-center">Book Free Consultation</Btn>
        </div>
      </div>
    </div>

    <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-500">
      © {new Date().getFullYear()} Elevate Tutor. All rights reserved.
    </div>
  </div>
</footer>

    </div>
  );
}
