"use client";

import { motion } from "framer-motion";
import { FEATURES } from "@/lib/constants";
import GradientIcon from "@/components/atoms/GradientIcon";

interface FeaturesSectionProps {
  fadeInUp: {
    initial: { opacity: number; y: number };
    animate: { opacity: number; y: number };
    transition: { duration: number; ease: string };
  };
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: number;
      };
    };
  };
}

export default function FeaturesSection({
  fadeInUp,
  staggerContainer,
}: FeaturesSectionProps) {
  return (
    <section className="container mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl font-bold text-slate-800 mb-4">
          Why Choose ZenHealth AI?
        </h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Experience the future of personalized healthcare with our AI-powered
          platform designed for your privacy and convenience.
        </p>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        className="grid md:grid-cols-3 gap-6"
      >
        {FEATURES.map((feature, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/80 transition-all duration-300 border border-emerald-100 h-full flex flex-col">
              <div className="mx-auto mb-4">
                <GradientIcon icon={feature.icon} size="lg" className="rounded-xl" />
              </div>
              <h3 className="font-semibold text-slate-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-slate-600 flex-grow">
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
} 