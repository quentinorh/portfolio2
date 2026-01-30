"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";

const finalText = "entre écologie et numérique";
const words = finalText.split(" ");

// Caractères organiques pour l'effet de scramble
const organicChars = "~≈∿⌇⌁∾≋≈∿⋯⸪⸫░▒▓█▀▄▌▐";
const leafChars = "🌱🌿🍃☘️🌾✧∗⁕⁂✿❀❁✾";

interface AnimatedTaglineProps {
  onComplete?: () => void;
}

export default function AnimatedTagline({ onComplete }: AnimatedTaglineProps) {
  const [displayText, setDisplayText] = useState<string[]>(() =>
    finalText.split("").map(() => "")
  );
  const [revealed, setRevealed] = useState<boolean[]>(() =>
    finalText.split("").map(() => false)
  );
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const onCompleteRef = useRef(onComplete);
  
  // Garder la ref à jour
  onCompleteRef.current = onComplete;

  const scramble = useCallback(() => {
    const chars = [...organicChars, ...leafChars];
    return chars[Math.floor(Math.random() * chars.length)];
  }, []);

  useEffect(() => {
    // Réinitialiser les états au montage
    setDisplayText(finalText.split("").map(() => ""));
    setRevealed(finalText.split("").map(() => false));
    
    const totalDuration = 3000;
    const letterDelay = totalDuration / finalText.length;

    finalText.split("").forEach((targetChar, index) => {
      const revealTime = index * letterDelay + 300;
      
      // Scramble continu jusqu'à la révélation
      const scrambleInterval = setInterval(() => {
        setDisplayText((prev) => {
          const newText = [...prev];
          newText[index] = scramble();
          return newText;
        });
      }, 60 + Math.random() * 40);

      intervalsRef.current.push(scrambleInterval);

      const revealTimeout = setTimeout(() => {
        clearInterval(scrambleInterval);
        setRevealed((prev) => {
          const newRevealed = [...prev];
          newRevealed[index] = true;
          return newRevealed;
        });
        setDisplayText((prev) => {
          const newText = [...prev];
          newText[index] = targetChar;
          return newText;
        });
        
        // Appeler onComplete quand la dernière lettre est révélée
        if (index === finalText.length - 1 && onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, revealTime);
      
      timeoutsRef.current.push(revealTimeout);
    });

    return () => {
      intervalsRef.current.forEach(clearInterval);
      timeoutsRef.current.forEach(clearTimeout);
      intervalsRef.current = [];
      timeoutsRef.current = [];
    };
  }, [scramble]);

  // Calculer les indices pour chaque mot
  let charIndex = 0;
  const wordData = words.map((word) => {
    const startIndex = charIndex;
    charIndex += word.length + 1; // +1 pour l'espace
    return { word, startIndex };
  });

  return (
    <span className="block relative">
      {/* Texte invisible pour réserver l'espace exact */}
      <span className="invisible" aria-hidden="true">
        {finalText}
      </span>
      
      {/* Animation positionnée par-dessus */}
      <span className="absolute inset-0 text-accent">
        {wordData.map(({ word, startIndex }, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap">
            {word.split("").map((_, letterIndex) => {
              const globalIndex = startIndex + letterIndex;
              const char = displayText[globalIndex];
              const isRevealed = revealed[globalIndex];

              return (
                <motion.span
                  key={letterIndex}
                  className="inline-block"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: char ? 1 : 0,
                  }}
                  transition={{
                    duration: 0.2,
                  }}
                  style={{
                    filter: isRevealed ? "none" : "brightness(1.2)",
                  }}
                >
                  {char}
                </motion.span>
              );
            })}
            {/* Espace entre les mots */}
            {wordIndex < words.length - 1 && (
              <span className="inline-block">&nbsp;</span>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}
