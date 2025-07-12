import React from "react";
import { motion } from "framer-motion";
import { Heart, Shield, CheckCircle, Brain, Sparkles } from "lucide-react";
import PartnerLogo from "@/components/atoms/PartnerLogo";

const LogoBanner: React.FC = () => (
  <section className="container mx-auto px-6 py-16">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-12"
    >
      <p className="text-lg text-slate-600 mb-8">
        Trusted by healthcare professionals and partnered with leading
        organizations
      </p>
      <div className="relative overflow-hidden">
        <motion.div
          className="flex items-center justify-center space-x-12 md:space-x-16"
          animate={{ x: [0, -50, 0] }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          <PartnerLogo icon={Heart} name="Sundhed.dk" bgColor="bg-red-500" />
          <PartnerLogo icon={Shield} name="HealthCert" bgColor="bg-blue-500" />
          <PartnerLogo icon={CheckCircle} name="MedTech Alliance" bgColor="bg-emerald-500" />
          <PartnerLogo icon={Brain} name="AI Health Council" bgColor="bg-purple-500" />
          <PartnerLogo icon={Sparkles} name="WellnessTech" bgColor="bg-teal-500" />
        </motion.div>
      </div>
    </motion.div>
  </section>
);

export default LogoBanner; 