"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Heart,
  Shield,
  Sparkles,
  X,
  Plus,
  Search,
  MoreVertical,
  Send,
  Save,
  FolderOpen,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { websocketService, WebSocketMessage } from "@/lib/websocket";
import Header from "@/components/organisms/Header";
import HeroSection from "@/components/organisms/HeroSection";
import InteractiveChatBox from "@/components/organisms/InteractiveChatBox";
import LearnMoreModal from "@/components/organisms/LearnMoreModal";
import LogoBanner from "@/components/organisms/LogoBanner";
import CTASection from "@/components/organisms/CTASection";
import Footer from "@/components/organisms/Footer";
import AnimatedRoadmap from "@/components/organisms/AnimatedRoadmap";

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
  const [currentConversation, setCurrentConversation] =
    useState<Conversation | null>(null);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

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
      websocketService.connect();
      websocketService.onMessage(handleWebSocketMessage);
      return () => {
        websocketService.disconnect();
      };
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

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    if (
      message.type === "message" &&
      message.sender === "ai" &&
      currentConversation
    ) {
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: message.content || "No content received",
        sender: "ai",
        timestamp: message.timestamp || new Date(),
        type: "text",
      };

      const updatedConversation = {
        ...currentConversation,
        messages: [...currentConversation.messages, aiMessage],
        updatedAt: new Date(),
      };

      setCurrentConversation(updatedConversation);
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === currentConversation.id ? updatedConversation : conv
        )
      );
      setIsTyping(false);
    } else if (message.type === "typing") {
      setIsTyping(true);
    } else if (message.type === "error") {
      console.error("WebSocket error:", message.content);
      setIsTyping(false);
    }
  };

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentConversation) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    // Add user message to conversation
    const updatedConversation = {
      ...currentConversation,
      messages: [...currentConversation.messages, userMessage],
      updatedAt: new Date(),
    };

    setCurrentConversation(updatedConversation);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversation.id ? updatedConversation : conv
      )
    );
    setInputMessage("");
    setIsTyping(true);

    // Send message via WebSocket
    websocketService.sendMessage({
      type: "message",
      content: inputMessage,
      sender: "user",
      conversationId: currentConversation.id,
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Wellness Session",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [newConversation, ...prev]);
    setCurrentConversation(newConversation);
  };

  const saveConversation = () => {
    if (!currentConversation) return;
    const updatedConversation = { ...currentConversation, isSaved: true };
    setCurrentConversation(updatedConversation);
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === currentConversation.id ? updatedConversation : conv
      )
    );
  };

  const handleLearnMore = () => {
    setShowLearnMoreModal(true);
  };

  const closeLearnMoreModal = () => {
    setShowLearnMoreModal(false);
  };

  // Chat Interface Component
  const ChatInterface = () => (
    <div className="fixed inset-0 bg-white z-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-slate-800">ZenHealth AI</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChat(false)}
              className="text-slate-500 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={createNewConversation}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Conversation
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-white border-slate-200"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setCurrentConversation(conversation)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  currentConversation?.id === conversation.id
                    ? "bg-emerald-100 border border-emerald-200"
                    : "hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-slate-800 truncate">
                    {conversation.title}
                  </h4>
                  {conversation.isSaved && (
                    <Save className="w-3 h-3 text-emerald-500" />
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {conversation.messages.length} messages
                </p>
                <p className="text-xs text-slate-400">
                  {conversation.updatedAt.toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Categories */}
        <div className="p-4 border-t border-slate-200">
          <h3 className="font-medium text-slate-700 mb-3">Categories</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-800 cursor-pointer">
              <FolderOpen className="w-4 h-4" />
              <span>All Conversations</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-800 cursor-pointer">
              <Save className="w-4 h-4" />
              <span>Saved</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-800 cursor-pointer">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-800">
                  {currentConversation?.title || "New Conversation"}
                </h2>
                <p className="text-sm text-slate-500">
                  AI Health Assistant • Online
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={saveConversation}
                disabled={currentConversation?.isSaved}
                className="text-slate-500 hover:text-slate-700"
              >
                <Save className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-500 hover:text-slate-700"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentConversation?.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl p-4 ${
                    message.sender === "user"
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-800"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.sender === "user"
                        ? "text-emerald-100"
                        : "text-slate-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-500">
                      AI is typing...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your health question..."
                className="min-h-[44px] resize-none"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

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
        {showChat && <ChatInterface />}
        <LearnMoreModal
          open={showLearnMoreModal}
          onClose={closeLearnMoreModal}
          onSelect={(focus) => {
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

      <AnimatedRoadmap
        fadeInUp={fadeInUp}
        staggerContainer={staggerContainer}
      />

      {/* Features Section */}
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
          {[
            {
              icon: Shield,
              title: "100% Private",
              description:
                "No personal information required. Your conversations are confidential and secure.",
            },
            {
              icon: Sparkles,
              title: "Always Free",
              description:
                "Access premium AI health guidance without any cost or subscription fees.",
            },
            {
              icon: Heart,
              title: "24/7 Available",
              description:
                "Get instant support whenever you need it, day or night, from anywhere.",
            },
          ].map((feature, index) => (
            <motion.div key={index} variants={fadeInUp}>
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/80 transition-all duration-300 border border-emerald-100 h-full flex flex-col">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
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

      {/* Logo Banner */}
      <LogoBanner />

      {/* CTA Section */}
      <CTASection onStartJourney={handleStartJourney} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
