"use client"

import { motion } from "framer-motion"
import type { ReactNode } from "react"

interface AnimatedBorderProps {
  children: ReactNode
  className?: string
  borderClassName?: string
}

export function AnimatedBorder({ children, className = "", borderClassName = "" }: AnimatedBorderProps) {
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`}>
      <motion.div
        className={`absolute inset-0 ${borderClassName}`}
        style={{
          background: "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent)",
        }}
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
      <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl border border-emerald-100">{children}</div>
    </div>
  )
}
