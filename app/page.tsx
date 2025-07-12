"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Header from "@/components/organisms/Header";
import HeroSection from "@/components/organisms/HeroSection";
import InteractiveChatBox from "@/components/organisms/InteractiveChatBox";
import LearnMoreModal from "@/components/organisms/LearnMoreModal";
import LogoBanner from "@/components/molecules/LogoBanner";
import CTASection from "@/components/organisms/CTASection";
import Footer from "@/components/organisms/Footer";
import AnimatedRoadmap from "@/components/organisms/AnimatedRoadmap";
import MainChatArea from "@/components/organisms/MainChatArea";
import FeaturesSection from "@/components/organisms/FeaturesSection";

// Types for chat functionality
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
}

export default function LandingPage() {
  const [showChat, setShowChat] = useState(false);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("zenhealth-chat-state");
    if (savedState) {
      const parsed = JSON.parse(savedState);

      // Convert string dates back to Date objects
      const conversations =
        parsed.conversations?.map((conv: any) => ({
          ...conv,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          messages: conv.messages?.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          })),
        })) || [];

      const currentConversation = parsed.currentConversation
        ? {
            ...parsed.currentConversation,
            createdAt: new Date(parsed.currentConversation.createdAt),
            updatedAt: new Date(parsed.currentConversation.updatedAt),
            messages: parsed.currentConversation.messages?.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }
        : null;

      setShowChat(parsed.showChat || false);
      setConversations(conversations);
      setCurrentConversation(currentConversation);
    }
  }, []);

  // WebSocket connection only when chat is open
  useEffect(() => {
    if (showChat) {
      // WebSocket connection is now handled in MainChatArea component
    }
  }, [showChat]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const stateToSave = {
      showChat,
      conversations,
      currentConversation,
    };
    localStorage.setItem("zenhealth-chat-state", JSON.stringify(stateToSave));
  }, [showChat, conversations, currentConversation]);

  const handleStartJourney = () => {
    setShowChat(true);
    // Create a new conversation if none exists
    if (!currentConversation) {
      const newConversation: Conversation = {
        id: Date.now().toString(),
        title: "New Wellness Session",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations([newConversation]);
      setCurrentConversation(newConversation);
    }
  };

  const handleLearnMore = () => {
    setShowLearnMoreModal(true);
  };

  const closeLearnMoreModal = () => {
    setShowLearnMoreModal(false);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const floatingAnimation = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 6,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut" as const,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <AnimatePresence>
        {showChat && (
          <MainChatArea
            onClose={() => setShowChat(false)}
            conversations={conversations}
            currentConversation={currentConversation}
            setConversations={setConversations}
            setCurrentConversation={setCurrentConversation}
          />
        )}
        <LearnMoreModal
          open={showLearnMoreModal}
          onClose={closeLearnMoreModal}
          onSelect={(focus: string) => {
            closeLearnMoreModal();
            handleStartJourney();
            // Optionally, handle focus ("health" or "mental")
          }}
        />
      </AnimatePresence>

      {/* Header */}
      <Header onGetStarted={handleStartJourney} />

      {/* Hero Section */}
      <HeroSection
        onStartJourney={handleStartJourney}
        onLearnMore={handleLearnMore}
        fadeInUp={fadeInUp}
        staggerContainer={staggerContainer}
        rightContent={<InteractiveChatBox />}
      />

      {/* Animated Roadmap */}
      <AnimatedRoadmap fadeInUp={fadeInUp} staggerContainer={staggerContainer} />

      {/* Features Section */}
      <FeaturesSection fadeInUp={fadeInUp} staggerContainer={staggerContainer} />

      {/* Logo Banner */}
      <LogoBanner />

      {/* CTA Section */}
      <CTASection onStartJourney={handleStartJourney} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
