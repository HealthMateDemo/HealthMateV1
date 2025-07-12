"use client"

import { motion } from "framer-motion"

interface ProgressLineProps {
  progress: number
  className?: string
}

export function ProgressLine({ progress, className = "" }: ProgressLineProps) {
  return (
    <div className={`relative h-1 bg-emerald-100 rounded-full overflow-hidden ${className}`}>
      <motion.div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        animate={{
          x: ["-100%", "100%"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
      />
    </div>
  )
}
