import WellnessCard from "@/components/molecules/WellnessCard";
import { TEMPLATE_AI_RESPONSES } from "@/constants/templateAIResponse";
import { useSectionAnimation } from "@/hooks/use-section-animation";
import { motion } from "framer-motion";
import { Brain, Heart, X } from "lucide-react";
import React from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
  type: "text" | "image" | "voice";
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  isSaved?: boolean;
  template?: "global" | "health" | "mindfull";
}

interface LearnMoreModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (focus: "health" | "mental") => void;
  setShowChat: (show: boolean) => void;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setCurrentConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
}

const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ open, onClose, onSelect, setShowChat, setConversations, setCurrentConversation }) => {
  const generateId = () => (window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString());

  const { containerVariants, itemVariants, modalVariants, overlayVariants, buttonVariants, footerVariants } = useSectionAnimation();

  const handleFocusSelection = (focus: "health" | "mental") => {
    setShowChat(true);

    // Create a new conversation with specific title and template based on focus
    const template = focus === "mental" ? "mindfull" : "health";
    const aiResponse = TEMPLATE_AI_RESPONSES[template];

    const newConversation: Conversation = {
      id: generateId(),
      title: focus === "mental" ? "Mental Chat" : "Health Chat",
      messages: [
        {
          id: generateId(),
          content: aiResponse,
          sender: "ai",
          timestamp: new Date(),
          type: "text",
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      template: template,
    };

    // Add the new conversation to the existing list and set it as current
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversation(newConversation);

    // Close the modal
    onClose();

    // Call the original onSelect for any additional parent logic
    onSelect(focus);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Dark overlay */}
      <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} variants={overlayVariants} initial="hidden" animate="visible" exit="exit" />
      {/* Modal content */}
      <motion.div className="relative bg-white rounded-3xl p-8 max-w-4xl mx-4 shadow-2xl" variants={modalVariants} initial="hidden" animate="visible" exit="exit">
        {/* Close button */}
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        >
          <X className="w-6 h-6" />
        </motion.button>
        {/* Modal header */}
        <motion.div className="text-center mb-8" variants={containerVariants} initial="hidden" animate="visible">
          <motion.h2 className="text-3xl font-bold text-slate-800 mb-2" variants={itemVariants}>
            Choose Your Wellness Focus
          </motion.h2>
          <motion.p className="text-slate-600" variants={itemVariants}>
            Select the area you'd like to explore with our AI assistant
          </motion.p>
        </motion.div>
        {/* Cards container */}
        <motion.div className="grid md:grid-cols-2 gap-6" initial="hidden" animate="visible">
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
            <WellnessCard
              title="Physical Health"
              description="Get personalized advice on nutrition, exercise, sleep, and physical wellness. Our AI analyzes your symptoms and provides evidence-based recommendations."
              icon={<Heart className="w-8 h-8 text-white" />}
              colorClass="from-emerald-50 to-teal-50 border-emerald-200 hover:border-emerald-300"
              onClick={() => handleFocusSelection("health")}
              ctaText="Explore Health"
              ctaColorClass="text-emerald-600"
            />
          </motion.div>
          <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
            <WellnessCard
              title="Mental Wellness"
              description="Receive support for stress, anxiety, mindfulness, and emotional well-being. Our AI offers coping strategies and mental health guidance."
              icon={<Brain className="w-8 h-8 text-white" />}
              colorClass="from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300"
              onClick={() => handleFocusSelection("mental")}
              ctaText="Explore Wellness"
              ctaColorClass="text-blue-600"
            />
          </motion.div>
        </motion.div>
        {/* Footer */}
        <motion.div className="text-center mt-8 pt-6 border-t border-slate-200" variants={footerVariants} initial="hidden" animate="visible">
          <p className="text-sm text-slate-500">Both areas are covered by our comprehensive AI health assistant</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LearnMoreModal;
