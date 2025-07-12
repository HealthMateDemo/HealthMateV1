import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";
import GradientIcon from "@/components/atoms/GradientIcon";
import { ThemeMode } from "../molecules/ThemeMode";

interface HeaderProps {
  onGetStarted?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGetStarted }) => (
  <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="container mx-auto px-6 py-6">
    <nav className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <GradientIcon icon={Heart} size="md" />
        <span className="text-xl font-semibold text-slate-800 dark:text-green-700">ZenHealth AI</span>
      </div>
      <div className="flex items-center space-x-2">
        <Button variant="outline" className="bg-white/80 backdrop-blur-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50" onClick={onGetStarted}>
          Get Started
        </Button>
        <ThemeMode />
      </div>
    </nav>
  </motion.header>
);

export default Header;
