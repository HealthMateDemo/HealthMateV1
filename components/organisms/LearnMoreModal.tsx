import WellnessCard from "@/components/molecules/WellnessCard";
import { Brain, Heart, X } from "lucide-react";
import React from "react";

interface LearnMoreModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (focus: "health" | "mental") => void;
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ open, onClose, onSelect }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      {/* Modal content */}
      <div className="relative bg-white rounded-3xl p-8 max-w-4xl mx-4 shadow-2xl">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
          <X className="w-6 h-6" />
        </button>
        {/* Modal header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Choose Your Wellness Focus</h2>
          <p className="text-slate-600">Select the area you'd like to explore with our AI assistant</p>
        </div>
        {/* Cards container */}
        <div className="grid md:grid-cols-2 gap-6">
          <WellnessCard
            title="Physical Health"
            description="Get personalized advice on nutrition, exercise, sleep, and physical wellness. Our AI analyzes your symptoms and provides evidence-based recommendations."
            icon={<Heart className="w-8 h-8 text-white" />}
            colorClass="from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-300"
            onClick={() => onSelect("health")}
            ctaText="Explore Health"
            ctaColorClass="text-emerald-600"
          />
          <WellnessCard
            title="Mental Wellness"
            description="Receive support for stress, anxiety, mindfulness, and emotional well-being. Our AI offers coping strategies and mental health guidance."
            icon={<Brain className="w-8 h-8 text-white" />}
            colorClass="from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
            onClick={() => onSelect("mental")}
            ctaText="Explore Wellness"
            ctaColorClass="text-blue-600"
          />
        </div>
        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">Both areas are covered by our comprehensive AI health assistant</p>
        </div>
      </div>
    </div>
  );
};

export default LearnMoreModal;
