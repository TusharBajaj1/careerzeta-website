"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
};

/**
 * Section wrapper that fades its contents up once, the first time it scrolls
 * into view. Renders a <section> so anchor ids land on the scroll target.
 */
export default function Reveal({
  children,
  className,
  id,
  delay = 0,
}: RevealProps) {
  return (
    <motion.section
      id={id}
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
    >
      {children}
    </motion.section>
  );
}
