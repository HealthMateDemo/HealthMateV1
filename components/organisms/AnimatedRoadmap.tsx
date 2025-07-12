import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Brain, BookOpen } from "lucide-react";

interface AnimatedRoadmapProps {
  fadeInUp: any;
  staggerContainer: any;
}

const AnimatedRoadmap: React.FC<AnimatedRoadmapProps> = ({
  fadeInUp,
  staggerContainer,
}) => (
  <section className="container mx-auto px-6 py-20">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="text-center mb-16"
    >
      <h2 className="text-4xl font-bold text-slate-800 mb-4">
        Your Wellness Journey
      </h2>
      <p className="text-xl text-slate-600 max-w-2xl mx-auto">
        Experience seamless AI-powered health guidance through our intuitive
        multi-modal interface.
      </p>
    </motion.div>
    <div className="max-w-4xl mx-auto">
      {/* Animated Progress Line */}
      <div className="relative">
        <motion.div
          className="absolute left-8 top-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"
          initial={{ height: 0 }}
          whileInView={{ height: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          viewport={{ once: true }}
        />
        <div className="space-y-12">
          {[
            {
              step: "01",
              title: "Share Your Health Concerns",
              description:
                "Express yourself naturally through text, voice messages, or by uploading images of symptoms or medical documents.",
              features: [
                "Natural language processing",
                "Voice recognition",
                "Image analysis",
                "Medical document scanning",
              ],
              icon: MessageCircle,
              delay: 0.2,
            },
            {
              step: "02",
              title: "AI Analysis & Personalized Guidance",
              description:
                "Our advanced AI, powered by sundhed.dk's medical knowledge base, analyzes your input and provides evidence-based recommendations.",
              features: [
                "Evidence-based analysis",
                "Personalized recommendations",
                "Medical knowledge integration",
                "Instant response",
              ],
              icon: Brain,
              delay: 0.4,
            },
            {
              step: "03",
              title: "Follow Your Wellness Plan",
              description:
                "Receive actionable steps, resources, and ongoing support tailored to your specific health and wellness needs.",
              features: [
                "Actionable wellness plans",
                "Resource recommendations",
                "Progress tracking",
                "24/7 support",
              ],
              icon: BookOpen,
              delay: 0.6,
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: item.delay }}
              viewport={{ once: true }}
              className="relative flex items-start space-x-8"
            >
              {/* Animated Step Circle */}
              <motion.div
                className="relative z-10 w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg"
                whileInView={{ scale: [0.8, 1.1, 1] }}
                transition={{ duration: 0.5, delay: item.delay + 0.2 }}
                viewport={{ once: true }}
              >
                <item.icon className="w-7 h-7 text-white" />
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-emerald-300"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0, 0.7] }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: item.delay + 0.5,
                  }}
                />
              </motion.div>
              {/* Content Card */}
              <motion.div
                className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100 relative overflow-hidden group"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.3), transparent)",
                  }}
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                />
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-4xl font-bold text-emerald-500">
                      {item.step}
                    </span>
                    <h3 className="text-2xl font-semibold text-slate-800">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, featureIndex) => (
                      <motion.span
                        key={featureIndex}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{
                          duration: 0.3,
                          delay: item.delay + 0.1 * featureIndex,
                        }}
                        viewport={{ once: true }}
                        className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
                      >
                        {feature}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AnimatedRoadmap;
