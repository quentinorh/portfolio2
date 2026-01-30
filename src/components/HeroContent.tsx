"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AnimatedTagline from "./AnimatedTagline";

export default function HeroContent() {
  const [taglineComplete, setTaglineComplete] = useState(false);

  return (
    <div className="full-width">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 tracking-tight leading-[1.1] mb-6">
        Maker et développeur
        <AnimatedTagline onComplete={() => setTaglineComplete(true)} />
      </h1>
      <motion.p
        className="text-lg text-stone-600 leading-relaxed max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={taglineComplete ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Je conçois des projets à l'intersection du faire et du code, 
        avec une approche low-tech et responsable. Je suis disponible 
        pour des projets de prototypage, programmation, médiation 
        et créations artistiques.
      </motion.p>
    </div>
  );
}
