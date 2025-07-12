import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  onStartJourney: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartJourney }) => (
  <section className="container mx-auto px-6 py-20">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl p-12 text-center text-white relative overflow-hidden"
    >
      <div className="relative z-10">
        <h2 className="text-4xl font-bold mb-4">
          Ready to Transform Your Wellness Journey?
        </h2>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Join thousands who have already discovered the power of AI-guided
          health and wellness support.
        </p>
        <Button
          size="lg"
          onClick={onStartJourney}
          className="bg-white text-emerald-600 hover:bg-emerald-50 px-8 py-6 text-lg font-semibold"
        >
          Start Your Free Session Now
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20"></div>
    </motion.div>
  </section>
);

export default CTASection;
