import React from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import AnimatedCloud from "@/components/atoms/AnimatedCloud";
import GradientIcon from "@/components/atoms/GradientIcon";

const Footer: React.FC = () => (
  <footer className="container mx-auto px-6 py-12 border-t border-emerald-100 relative overflow-hidden">
    {/* Floating Clouds */}
    <AnimatedCloud 
      className="absolute left-10 top-8 w-16 h-10"
      xRange={[0, 30, 0]}
      yRange={[0, -10, 0]}
      duration={8}
    />
    <AnimatedCloud 
      className="absolute left-20 top-16 w-12 h-8 bg-white/30"
      xRange={[0, -20, 0]}
      yRange={[0, 15, 0]}
      duration={10}
      delay={2}
    />
    <AnimatedCloud 
      className="absolute right-10 top-6 w-20 h-12 bg-white/35"
      xRange={[0, -25, 0]}
      yRange={[0, 12, 0]}
      duration={9}
      delay={1}
    />
    <AnimatedCloud 
      className="absolute right-32 top-14 w-14 h-9 bg-white/25"
      xRange={[0, 35, 0]}
      yRange={[0, -8, 0]}
      duration={11}
      delay={3}
    />
    <div className="text-center text-slate-600 relative z-10">
      <div className="flex items-center justify-center space-x-2 mb-4">
        <GradientIcon icon={Heart} size="sm" />
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
