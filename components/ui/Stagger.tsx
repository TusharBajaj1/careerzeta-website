"use client";

import { motion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul";
};

/**
 * Wraps a list/grid so its children animate in one after another instead
 * of the whole block appearing at once. Pair every child with StaggerItem.
 * Uses the same wide viewport margin as Reveal so fast scrolling can't
 * skip the trigger.
 */
export function StaggerGroup({
  children,
  className,
  as = "div",
}: StaggerGroupProps) {
  const MotionTag = as === "ul" ? motion.ul : motion.div;
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0, margin: "300px 0px 300px 0px" }}
      variants={container}
    >
      {children}
    </MotionTag>
  );
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
  style?: CSSProperties;
};

export function StaggerItem({
  children,
  className,
  as = "div",
  style,
}: StaggerItemProps) {
  const MotionTag = as === "li" ? motion.li : motion.div;
  return (
    <MotionTag className={className} style={style} variants={item}>
      {children}
    </MotionTag>
  );
}
