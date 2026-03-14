"use client";

import { motion } from "framer-motion";

type TextRevealProps = {
  text: string;
};

export function TextReveal({ text }: TextRevealProps) {
  return (
    <span aria-label={text} role="text" className="inline-block">
      {text.split("").map((character, index) => (
        <motion.span
          key={`${character}-${index}`}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.03, duration: 0.35 }}
          className="inline-block"
        >
          {character === " " ? "\u00A0" : character}
        </motion.span>
      ))}
    </span>
  );
}
