import { Button } from "@/components/ui/button";
import { Heart, Shield, CheckCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import React from "react";

interface HeaderProps {
  onGetStarted?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetStarted }) => (
  <motion.header
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="container mx-auto px-6 py-6"
  >
    <nav className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
          <Heart className="w-4 h-4 text-white" />
        </div>
        <span className="text-xl font-semibold text-slate-800">
          ZenHealth AI
        </span>
      </div>
      <Button
        variant="outline"
        className="bg-white/80 backdrop-blur-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50"
        onClick={onGetStarted}
      >
        Get Started
      </Button>
    </nav>
  </motion.header>
);

export default Header;
