"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, Send, ArrowRight } from "lucide-react";
import { FaInstagram, FaLinkedin } from "react-icons/fa";

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
};

const cardStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const contactChannels = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@careerzeta.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 XXXXX XXXXX",
  },
  {
    icon: FaLinkedin,
    label: "LinkedIn",
    value: "CareerZeta",
  },
  {
    icon: FaInstagram,
    label: "Instagram",
    value: "@careerzeta",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    interest: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic to be wired up
  };

  return (
    <>
      {/* Hero */}
      <motion.section
        className="relative overflow-hidden bg-white px-6 pb-16 pt-16 md:px-10 lg:px-16"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1.5px 1.5px, rgb(226 232 240) 1.5px, transparent 0)",
            backgroundSize: "32px 32px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-sky-200/40 via-indigo-200/30 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.h1
            className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl"
            variants={fadeInUp}
          >
            Let&apos;s{" "}
            <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
              Talk
            </span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl"
            variants={fadeInUp}
          >
            Whether you&apos;re exploring Business Analytics, looking for career guidance or
            simply want to learn more about CareerZeta, we&apos;d love to hear from you.
          </motion.p>
        </div>
      </motion.section>

      {/* Get in Touch */}
      <motion.section
        className="bg-slate-50/60 px-6 py-20 md:px-10 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="mx-auto max-w-7xl">
          <motion.div className="mx-auto max-w-3xl text-center" variants={fadeInUp}>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Get in{" "}
              <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
                Touch
              </span>
            </h2>
          </motion.div>

          <motion.div
            className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            variants={cardStagger}
          >
            {contactChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <motion.div
                  key={channel.label}
                  className="group flex h-full flex-col rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-[0_28px_80px_rgba(15,23,42,0.08)]"
                  variants={fadeInUp}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white transition group-hover:bg-gradient-to-br group-hover:from-sky-500 group-hover:to-indigo-600">
                    <Icon className="h-6 w-6" strokeWidth={1.75} />
                  </div>

                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                    {channel.label}
                  </p>

                  <p className="mt-1 text-base font-semibold tracking-tight text-slate-950">
                    {channel.value}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Form */}
      <motion.section
        className="bg-white px-6 py-24 md:px-10 lg:px-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={stagger}
      >
        <div className="mx-auto max-w-3xl">
          <motion.div className="text-center" variants={fadeInUp}>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Send us a{" "}
              <span className="text-transparent bg-gradient-to-r from-sky-500 via-indigo-600 to-indigo-600 bg-clip-text">
                Message
              </span>
            </h2>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            className="mt-12 rounded-[2rem] border border-slate-200 bg-slate-50 p-8 shadow-sm sm:p-10"
            variants={fadeInUp}
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-slate-900"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-slate-900"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <label
                htmlFor="interest"
                className="text-sm font-semibold text-slate-900"
              >
                Why is Business Analytics important for you?{" "}
                <span className="font-normal text-slate-400">(Optional)</span>
              </label>
              <input
                id="interest"
                name="interest"
                type="text"
                value={formData.interest}
                onChange={handleChange}
                placeholder="A career transition, a current project, curiosity..."
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div className="mt-6 flex flex-col gap-2">
              <label
                htmlFor="message"
                className="text-sm font-semibold text-slate-900"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us a bit about what you're looking for..."
                className="resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <button
              type="submit"
              className="group mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/15 sm:w-fit"
            >
              Talk to Us
              <Send
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                strokeWidth={2.25}
              />
            </button>

            <p className="mt-6 text-sm text-slate-500">
              We usually respond within 24–48 hours.
            </p>
          </motion.form>
        </div>
      </motion.section>
    </>
  );
}