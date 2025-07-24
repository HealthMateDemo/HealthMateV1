"use client";

import LogoBanner from "@/components/molecules/LogoBanner";
import AnimatedRoadmap from "@/components/organisms/AnimatedRoadmap";
import CTASection from "@/components/organisms/CTASection";
import FeaturesSection from "@/components/organisms/FeaturesSection";
import Footer from "@/components/organisms/Footer";
import Header from "@/components/organisms/Header";
import HeroSection from "@/components/organisms/HeroSection";
import InteractiveChatBox from "@/components/organisms/InteractiveChatBox";
import LearnMoreModal from "@/components/organisms/LearnMoreModal";
import MainChatArea from "@/components/organisms/MainChatArea";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

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
  template?: "global" | "health" | "mindfull";
}

export default function LandingPage() {
  const [showChat, setShowChat] = useState(false);
  const [showLearnMoreModal, setShowLearnMoreModal] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

  const generateId = () => (window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString());

  // Load state from localStorage on component mount
  useEffect(() => {
    const savedState = localStorage.getItem("zenhealth-chat-state");
    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Defensive conversion for conversations and messages
      const conversations =
        parsed.conversations?.map((conv: any) => ({
          ...conv,
          id: conv.id && typeof conv.id === "string" && conv.id.length > 0 ? conv.id : generateId(),
          createdAt: conv.createdAt ? new Date(conv.createdAt) : new Date(),
          updatedAt: conv.updatedAt ? new Date(conv.updatedAt) : new Date(),
          messages:
            conv.messages?.map((msg: any) => ({
              ...msg,
              id: msg.id && typeof msg.id === "string" && msg.id.length > 0 ? msg.id : generateId(),
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            })) || [],
        })) || [];
      const currentConversation = parsed.currentConversation
        ? {
            ...parsed.currentConversation,
            id:
              parsed.currentConversation.id && typeof parsed.currentConversation.id === "string" && parsed.currentConversation.id.length > 0
                ? parsed.currentConversation.id
                : generateId(),
            createdAt: parsed.currentConversation.createdAt ? new Date(parsed.currentConversation.createdAt) : new Date(),
            updatedAt: parsed.currentConversation.updatedAt ? new Date(parsed.currentConversation.updatedAt) : new Date(),
            messages:
              parsed.currentConversation.messages?.map((msg: any) => ({
                ...msg,
                id: msg.id && typeof msg.id === "string" && msg.id.length > 0 ? msg.id : generateId(),
                timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
              })) || [],
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

  useBodyScrollLock(showChat);

  const handleStartJourney = () => {
    setShowChat(true);
    // Create a new conversation if none exists
    if (!currentConversation) {
      const newConversation: Conversation = {
        id: generateId(),
        title: "New Chat",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        template: "global", // Set default template to global
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <AnimatePresence>
        {showChat && (
          <MainChatArea
            key="main-chat-area"
            onClose={() => setShowChat(false)}
            conversations={conversations}
            currentConversation={currentConversation}
            setConversations={setConversations}
            setCurrentConversation={setCurrentConversation}
          />
        )}
        <LearnMoreModal
          key="learn-more-modal"
          open={showLearnMoreModal}
          onClose={closeLearnMoreModal}
          onSelect={(_focus: string) => {
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
