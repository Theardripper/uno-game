"use client";

import { motion } from "framer-motion";

export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = "",
  yOffset = 20,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
