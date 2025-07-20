import { BookOpen, Brain, CheckCircle, MessageCircle } from "lucide-react";

export const steps = [
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
