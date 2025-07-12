"use client";

import { useState, useEffect } from "react";
import { Brain, Heart, X, Plus, Search, MoreVertical, Send, Save, FolderOpen, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { websocketService, WebSocketMessage } from "@/lib/websocket";
import GradientIcon from "@/components/atoms/GradientIcon";
import TypingIndicator from "@/components/atoms/TypingIndicator";

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

interface MainChatAreaProps {
  onClose: () => void;
  conversations: Conversation[];
  currentConversation: Conversation | null;
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setCurrentConversation: React.Dispatch<React.SetStateAction<Conversation | null>>;
}

export default function MainChatArea({ onClose, conversations, currentConversation, setConversations, setCurrentConversation }: MainChatAreaProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // WebSocket connection
  useEffect(() => {
    websocketService.connect();
    websocketService.onMessage(handleWebSocketMessage);
    return () => {
      websocketService.disconnect();
    };
  }, []);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    if (message.type === "message" && message.sender === "ai" && currentConversation) {
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
      setConversations((prev) => prev.map((conv) => (conv.id === currentConversation.id ? updatedConversation : conv)));
      setIsTyping(false);
    } else if (message.type === "typing") {
      setIsTyping(true);
    } else if (message.type === "error") {
      console.error("WebSocket error:", message.content);
      setIsTyping(false);
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
    setConversations((prev) => prev.map((conv) => (conv.id === currentConversation.id ? updatedConversation : conv)));
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
    setConversations((prev) => prev.map((conv) => (conv.id === currentConversation.id ? updatedConversation : conv)));
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex">
      {/* Left Sidebar */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <GradientIcon icon={Heart} size="md" />
              <span className="font-semibold text-slate-800">ZenHealth AI</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-500 hover:text-slate-700">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <Button onClick={createNewConversation} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Conversation
          </Button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input placeholder="Search conversations..." className="pl-10 bg-white border-slate-200" />
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
                  currentConversation?.id === conversation.id ? "bg-emerald-100 border border-emerald-200" : "hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-slate-800 truncate">{conversation.title}</h4>
                  {conversation.isSaved && <Save className="w-3 h-3 text-emerald-500" />}
                </div>
                <p className="text-xs text-slate-500">{conversation.messages.length} messages</p>
                <p className="text-xs text-slate-400">{conversation.updatedAt.toLocaleDateString()}</p>
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
              <GradientIcon icon={Brain} size="lg" />
              <div>
                <h2 className="font-semibold text-slate-800">{currentConversation?.title || "New Conversation"}</h2>
                <p className="text-sm text-slate-500">AI Health Assistant • Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={saveConversation} disabled={currentConversation?.isSaved} className="text-slate-500 hover:text-slate-700">
                <Save className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentConversation?.messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl p-4 ${message.sender === "user" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-800"}`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.sender === "user" ? "text-emerald-100" : "text-slate-500"}`}>{message.timestamp.toLocaleTimeString()}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <TypingIndicator color="bg-slate-400" />
                    <span className="text-sm text-slate-500">AI is typing...</span>
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
}
