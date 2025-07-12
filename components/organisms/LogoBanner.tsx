import React from "react";
import { motion } from "framer-motion";
import { Heart, Shield, CheckCircle, Brain, Sparkles } from "lucide-react";

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
          {/* Dummy Logo 1 - Sundhed.dk */}
          <div className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-700">Sundhed.dk</span>
          </div>
          {/* Dummy Logo 2 */}
          <div className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-700">HealthCert</span>
          </div>
          {/* Dummy Logo 3 */}
          <div className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-700">
              MedTech Alliance
            </span>
          </div>
          {/* Dummy Logo 4 */}
          <div className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-purple-500 rounded flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-700">
              AI Health Council
            </span>
          </div>
          {/* Dummy Logo 5 */}
          <div className="flex items-center space-x-2 opacity-60 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 bg-teal-500 rounded flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-700">WellnessTech</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  </section>
);

export default LogoBanner;
