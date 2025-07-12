import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { MessageCircle, Brain, BookOpen, CheckCircle } from "lucide-react";
import GradientIcon from "@/components/atoms/GradientIcon";

interface AnimatedRoadmapProps {
  fadeInUp: any;
  staggerContainer: any;
}

const steps = [
  {
    step: "01",
    title: "Share Your Health Concerns",
    description: "Express yourself naturally through text, voice messages, or by uploading images of symptoms or medical documents.",
    features: ["Natural language processing", "Voice recognition", "Image analysis", "Medical document scanning"],
    icon: MessageCircle,
    delay: 0.2,
  },
  {
    step: "02",
    title: "AI Analysis & Personalized Guidance",
    description: "Our advanced AI, powered by sundhed.dk's medical knowledge base, analyzes your input and provides evidence-based recommendations.",
    features: ["Evidence-based analysis", "Personalized recommendations", "Medical knowledge integration", "Instant response"],
    icon: Brain,
    delay: 0.4,
  },
  {
    step: "03",
    title: "Follow Your Wellness Plan",
    description: "Receive actionable steps, resources, and ongoing support tailored to your specific health and wellness needs.",
    features: ["Actionable wellness plans", "Resource recommendations", "Progress tracking", "24/7 support"],
    icon: BookOpen,
    delay: 0.6,
  },
  {
    step: "04",
    title: "Track Your Progress",
    description: "Monitor your improvements and adjust your plan with ongoing AI support.",
    features: ["Progress analytics", "Goal adjustments", "Personalized feedback", "Continuous improvement"],
    icon: CheckCircle,
    delay: 0.8,
  },
];

const AnimatedRoadmap: React.FC<AnimatedRoadmapProps> = ({ fadeInUp, staggerContainer }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  // Animate the line height from 0% to 100% as the section scrolls into view
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section className="container mx-auto px-6 py-20">
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">Your Wellness Journey</h2>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">Experience seamless AI-powered health guidance through our intuitive multi-modal interface.</p>
      </motion.div>
      <div className="max-w-4xl mx-auto" ref={sectionRef}>
        {/* Animated Progress Line */}
        <div className="relative">
          <motion.div className="absolute left-8 top-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" style={{ height: lineHeight }} />
          <div className="space-y-24">
            {steps.map((item, index) => (
              <RoadmapStep key={index} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

function RoadmapStep({ item, index }: { item: (typeof steps)[0]; index: number }) {
  const iconRef = useRef<HTMLDivElement>(null);
  const inView = useInView(iconRef, { once: true, margin: "-100px" });
  const [animateBorder, setAnimateBorder] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (inView) {
      setAnimateBorder(true);
      timeout = setTimeout(() => setAnimateBorder(false), 10000); // 10 seconds
    }
    return () => clearTimeout(timeout);
  }, [inView]);

  return (
    <div className="relative flex items-stretch min-h-[120px]">
      {/* Icon and line alignment */}
      <div className="flex flex-col items-center justify-center min-w-[64px] relative">
        <div ref={iconRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
          <div className="relative">
            <GradientIcon icon={item.icon} size="lg" />
            {animateBorder && (
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-emerald-300 pointer-events-none"
                animate={{
                  opacity: [0.7, 0.2, 0.7],
                  boxShadow: ["0 0 0px 0px #34d39955", "0 0 16px 8px #34d39933", "0 0 0px 0px #34d39955"],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}
          </div>
        </div>
        {/* The vertical line is behind the icon, so no extra markup needed here */}
      </div>
      {/* Content Card */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: item.delay }}
        viewport={{ once: true }}
        className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-emerald-100 relative overflow-hidden group ml-8"
        style={{ minHeight: 120 }}
        whileHover={{ y: -5 }}
      >
        {/* Subtle shimmer border animation */}
        {animateBorder && (
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.12), transparent)",
            }}
            animate={{ x: ["-100%", "100%"] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-4xl font-bold text-emerald-500">{item.step}</span>
            <h3 className="text-2xl font-semibold text-slate-800">{item.title}</h3>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed">{item.description}</p>
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
    </div>
  );
}

export default AnimatedRoadmap;
