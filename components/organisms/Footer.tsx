import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const Footer: React.FC = () => (
  <footer className="container mx-auto px-6 py-12 border-t border-emerald-100 relative overflow-hidden">
    {/* Floating Clouds */}
    <motion.div
      className="absolute left-10 top-8 w-16 h-10 bg-white/40 rounded-full"
      animate={{ x: [0, 30, 0], y: [0, -10, 0] }}
      transition={{
        duration: 8,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
    <motion.div
      className="absolute left-20 top-16 w-12 h-8 bg-white/30 rounded-full"
      animate={{ x: [0, -20, 0], y: [0, 15, 0] }}
      transition={{
        duration: 10,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 2,
      }}
    />
    <motion.div
      className="absolute right-10 top-6 w-20 h-12 bg-white/35 rounded-full"
      animate={{ x: [0, -25, 0], y: [0, 12, 0] }}
      transition={{
        duration: 9,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 1,
      }}
    />
    <motion.div
      className="absolute right-32 top-14 w-14 h-9 bg-white/25 rounded-full"
      animate={{ x: [0, 35, 0], y: [0, -8, 0] }}
      transition={{
        duration: 11,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: 3,
      }}
    />
    <div className="text-center text-slate-600 relative z-10">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
          <Heart className="w-3 h-3 text-white" />
        </div>
        <span className="font-semibold">ZenHealth AI</span>
      </div>
      <p className="text-sm">
        Empowering your wellness journey with AI-powered guidance. Always free,
        always private.
      </p>
    </div>
  </footer>
);

export default Footer;
