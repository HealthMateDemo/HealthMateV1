"use client";

import { useState, useEffect } from "react";
import { Brain, Heart, X, Plus, Search, MoreVertical, Send, Save, FolderOpen, Settings, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { websocketService, WebSocketMessage } from "@/lib/websocket";
import GradientIcon from "@/components/atoms/GradientIcon";
import TypingIndicator from "@/components/atoms/TypingIndicator";
import ReactDOM from "react-dom";
import { useRef } from "react";

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
  const [websocketError, setWebsocketError] = useState<string | null>(null);

  // Add state for category filter
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [categoryInput, setCategoryInput] = useState("");

  // Add state for search functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  // Add state for new category creation
  const [newCategory, setNewCategory] = useState("");

  // Add state for settings panel
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Define default categories
  const defaultCategories = ["all", "saved"];

  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  // WebSocket connection
  useEffect(() => {
    websocketService.connect();
    const unsubscribe = websocketService.onMessage(handleWebSocketMessage);
    return () => {
      unsubscribe(); // Remove the handler on unmount
      websocketService.disconnect();
    };
  }, []);

  // Helper to get the latest conversation object by id
  const getConversationById = (id: string | undefined | null) => conversations.find((c) => c.id === id) || null;

  // When switching conversations, always set currentConversation to the object from conversations array
  const handleSelectConversation = (conversationId: string) => {
    setCurrentConversation(getConversationById(conversationId));
  };

  // In handleSendMessage, after updating conversations, set currentConversation to the updated object from conversations
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !currentConversation) return;

    const userMessage: Message = {
      id: generateId(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      type: "text",
    };

    setConversations((prev) => {
      // Find the correct conversation by id
      const updated = prev.map((conv) => (conv.id === currentConversation.id ? { ...conv, messages: [...conv.messages, userMessage], updatedAt: new Date() } : conv));
      // Set currentConversation to the updated object from the new array
      const updatedCurrent = updated.find((c) => c.id === currentConversation.id) || null;
      setCurrentConversation(updatedCurrent);
      console.log("After send, currentConversation.messages:", updatedCurrent?.messages);
      return updated;
    });

    setInputMessage("");
    setIsTyping(true);

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
      id: generateId(),
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

  const generateId = () => (window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString());

  // Add a function to update the category of the current conversation
  const updateConversationCategory = (category: string) => {
    if (!currentConversation) return;
    const updatedConversation = { ...currentConversation, category };
    setCurrentConversation(updatedConversation);
    setConversations((prev) => prev.map((conv) => (conv.id === currentConversation.id ? updatedConversation : conv)));
  };

  // Update conversation title
  const handleTitleEdit = () => {
    if (!currentConversation || !editedTitle.trim()) return;
    const updatedConversation = { ...currentConversation, title: editedTitle.trim() };
    setCurrentConversation(updatedConversation);
    setConversations((prev) => prev.map((conv) => (conv.id === currentConversation.id ? updatedConversation : conv)));
    setIsEditingTitle(false);
  };

  // Helper to get unique, trimmed, case-insensitive categories (no nulls)
  const categories = Array.from(
    new Set(conversations.map((c) => (typeof c.category === "string" ? c.category.trim().toLowerCase() : null)).filter((cat): cat is string => Boolean(cat))),
  );

  // Add a new category
  const handleAddCategory = () => {
    const cat = newCategory.trim().toLowerCase();
    if (cat && !categories.includes(cat)) {
      categories.push(cat);
    }
    setNewCategory("");
  };

  // Assign a category to the current conversation
  const handleAssignCategory = (cat: string) => {
    if (!currentConversation) return;
    const updatedConversation = { ...currentConversation, category: cat };
    setCurrentConversation(updatedConversation);
    setConversations((prev) => prev.map((conv) => (conv.id === currentConversation.id ? updatedConversation : conv)));
  };

  // Filter conversations by category and search term
  const filteredConversations = conversations.filter((c) => {
    let matchesCategory = true;
    if (categoryFilter && categoryFilter !== "all") {
      matchesCategory = (typeof c.category === "string" ? c.category.trim().toLowerCase() : "") === categoryFilter.trim().toLowerCase();
    }
    const matchesSearch =
      searchTerm.trim() === "" || c.title.toLowerCase().includes(searchTerm.toLowerCase()) || c.messages.some((m) => m.content.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  console.log(
    "Conversation keys:",
    filteredConversations.map((c, idx) => (typeof c.id === "string" && c.id.trim().length > 0 ? c.id : `conv-fallback-${idx}`)),
  );
  if (currentConversation) {
    console.log(
      "Message keys:",
      currentConversation.messages.map((m, idx) => (typeof m.id === "string" && m.id.trim().length > 0 ? m.id : `msg-fallback-${idx}`)),
    );
  }

  // DEBUG: Log all conversation categories and their values
  console.log(
    "All conversation categories:",
    conversations.map((c) => ({ id: c.id, category: c.category })),
  );

  const activeConversation = conversations.find((conv) => conv.id === currentConversation?.id) || currentConversation;

  // In handleWebSocketMessage, after updating conversations, set currentConversation to the updated object from conversations
  const handleWebSocketMessage = (message: WebSocketMessage) => {
    if (message.type === "message" && message.sender === "ai" && message.conversationId) {
      setConversations((prev) => {
        // Always use the latest messages array from state
        const updated = prev.map((conv) => {
          if (conv.id === message.conversationId) {
            const aiMessage: Message = {
              id: generateId(),
              content: message.content || "No content received",
              sender: "ai",
              timestamp: message.timestamp || new Date(),
              type: "text",
            };
            return {
              ...conv,
              messages: [...conv.messages, aiMessage],
              updatedAt: new Date(),
            };
          }
          return conv;
        });
        // If the user is viewing this conversation, update currentConversation as well
        if (currentConversation?.id === message.conversationId) {
          const updatedCurrent = updated.find((c) => c.id === message.conversationId) || null;
          setCurrentConversation(updatedCurrent);
        }
        return updated;
      });
      setIsTyping(false);
    } else if (message.type === "typing") {
      setIsTyping(true);
    } else if (message.type === "error") {
      console.error("WebSocket error:", message.content);
      setIsTyping(false);
    }
  };

  const handleResetAll = () => {
    localStorage.removeItem("zenhealth-chat-state");
    window.location.reload();
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
            <div className="flex items-center gap-2">
              <button ref={settingsButtonRef} onClick={() => setSettingsOpen((v) => !v)} className="text-slate-500 hover:text-slate-700 p-1 rounded-full focus:outline-none">
                <Settings className="w-5 h-5" />
              </button>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-500 hover:text-slate-700">
                <X className="w-4 h-4" />
              </Button>
            </div>
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
            <Input placeholder="Search conversations..." className="pl-10 bg-white border-slate-200" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {filteredConversations.map((conversation, idx) => (
              <div
                key={typeof conversation.id === "string" && conversation.id.trim().length > 0 ? conversation.id : `conv-fallback-${idx}`}
                onClick={() => handleSelectConversation(conversation.id)}
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
          <div className="flex flex-wrap gap-2 mb-2">
            {["all", ...categories].map((cat) => (
              <button
                key={cat}
                className={`px-2 py-1 rounded text-xs flex items-center gap-1 ${categoryFilter === cat ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-700"}`}
                onClick={() => setCategoryFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                {defaultCategories.includes(cat) ? (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">Default</span>
                ) : (
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold">Created</span>
                )}
              </button>
            ))}
          </div>
          {/* Create new category */}
          <div className="flex items-center gap-2 mb-2">
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Create category..."
              className="border rounded px-2 py-1 text-xs"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddCategory();
              }}
            />
            <button className="bg-emerald-500 text-white px-2 py-1 rounded text-xs" onClick={handleAddCategory} disabled={!newCategory.trim()}>
              Add
            </button>
          </div>
          {currentConversation && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                placeholder="Set category..."
                className="border rounded px-2 py-1 text-xs"
              />
              <button
                className="bg-emerald-500 text-white px-2 py-1 rounded text-xs"
                onClick={() => {
                  updateConversationCategory(categoryInput);
                  setCategoryInput("");
                }}
              >
                Set
              </button>
            </div>
          )}
          <div className="space-y-2 mt-4 overflow-y-auto max-h-48 pr-1">
            <div className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-800 cursor-pointer">
              <FolderOpen className="w-4 h-4" />
              <span>All Conversations</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">Default</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-800 cursor-pointer">
              <Save className="w-4 h-4" />
              <span>Saved</span>
              <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">Default</span>
            </div>
            {/* User-created categories */}
            {categories
              .filter((cat) => !defaultCategories.includes(cat))
              .map((cat) => (
                <div key={cat} className="flex items-center space-x-2 text-sm text-slate-600 hover:text-slate-800 cursor-pointer">
                  <MessageCircle className="w-4 h-4" />
                  <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold">Created</span>
                </div>
              ))}
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
                {isEditingTitle ? (
                  <input
                    className="font-semibold text-slate-800 text-lg border-b border-emerald-400 outline-none bg-transparent"
                    value={editedTitle}
                    autoFocus
                    onChange={(e) => setEditedTitle(e.target.value)}
                    onBlur={handleTitleEdit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleTitleEdit();
                      } else if (e.key === "Escape") {
                        setIsEditingTitle(false);
                      }
                    }}
                  />
                ) : (
                  <h2
                    className="font-semibold text-slate-800 cursor-pointer"
                    title="Click to edit title"
                    onClick={() => {
                      setIsEditingTitle(true);
                      setEditedTitle(currentConversation?.title || "");
                    }}
                  >
                    {currentConversation?.title || "New Conversation"}
                  </h2>
                )}
                <p className="text-sm text-slate-500">AI Health Assistant • Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Category assignment dropdown */}
              {currentConversation && (
                <select
                  className="border rounded px-2 py-1 text-xs mr-2"
                  value={typeof currentConversation.category === "string" ? currentConversation.category.trim().toLowerCase() : ""}
                  onChange={(e) => handleAssignCategory(e.target.value)}
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              )}
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
            {currentConversation?.messages.map((message, idx) => (
              <div
                key={typeof message.id === "string" && message.id.trim().length > 0 ? message.id : `msg-fallback-${idx}`}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] rounded-2xl p-4 ${message.sender === "user" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-800"}`}>
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-2 ${message.sender === "user" ? "text-emerald-100" : "text-slate-500"}`}>
                    {(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp)).toLocaleTimeString()}
                  </p>
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

      {/* Settings Portal Dropdown */}
      {settingsOpen &&
        typeof window !== "undefined" &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50" onClick={() => setSettingsOpen(false)} style={{ pointerEvents: "auto" }}>
            <div
              className="absolute bg-white rounded-2xl shadow-xl p-6 w-64 transition-all duration-300 ease-out"
              style={{
                top: settingsButtonRef.current ? settingsButtonRef.current.getBoundingClientRect().bottom + 8 : 80,
                left: settingsButtonRef.current ? settingsButtonRef.current.getBoundingClientRect().left : 80,
                opacity: settingsOpen ? 1 : 0,
                transform: settingsOpen ? "scale(1)" : "scale(0.95)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Settings</h2>
              <div className="mt-6">
                <span className="text-xs text-slate-400">Danger Zone</span>
                <button
                  onClick={handleResetAll}
                  className="w-full mt-2 px-3 py-2 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                  title="Clear all conversations and messages"
                >
                  Reset All
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
