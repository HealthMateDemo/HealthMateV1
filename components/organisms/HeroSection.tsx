import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle, Shield, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onStartJourney: () => void;
  onLearnMore: () => void;
  fadeInUp: any;
  staggerContainer: any;
  rightContent?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  onStartJourney,
  onLearnMore,
  fadeInUp,
  staggerContainer,
  rightContent = null,
}) => (
  <section className="container mx-auto px-6 py-20">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-8"
      >
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="inline-flex items-center space-x-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Wellness Guidance</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold text-slate-800 leading-tight">
            Your Personal
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {" "}
              AI Health{" "}
            </span>
            Companion
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            Get instant, personalized health and mental wellness guidance
            through our AI assistant. Free, private, and available 24/7 to
            support your journey to better well-being.
          </p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button
            size="lg"
            onClick={onStartJourney}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-6 text-lg"
          >
            Start Your Wellness Journey
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={onLearnMore}
            className="bg-white/80 backdrop-blur-sm border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg"
          >
            Learn More
          </Button>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex items-center space-x-6 text-sm text-slate-500"
        >
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <span>100% Free</span>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>No Login Required</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-emerald-500" />
            <span>Partnered with Sundhed.dk</span>
          </div>
        </motion.div>
      </motion.div>
      {/* Right column: Chat preview or illustration */}
      {rightContent && <div>{rightContent}</div>}
    </div>
  </section>
);

export default HeroSection;
