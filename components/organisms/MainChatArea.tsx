"use client";

import { useState, useEffect } from "react";
import { Brain, Heart, X, Plus, Search, MoreVertical, Send, Save, FolderOpen, Settings, MessageCircle, User, ThumbsUp, ThumbsDown, Heart as HeartIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { websocketService, WebSocketMessage } from "@/lib/websocket";
import GradientIcon from "@/components/atoms/GradientIcon";
import TypingIndicator from "@/components/atoms/TypingIndicator";
import ReactDOM from "react-dom";
import { useRef } from "react";
import { useCallback } from "react";
import LoadingSpinner from "../atoms/LoadingSpinner";
import LikedMessagesList from "../molecules/LikedMessagesList";
import ConversationDropdown from "../atoms/ConversationDropdown";
import useShowMore from "@/hooks/useShowMore";
import CategoryBadge from "@/components/atoms/CategoryBadge";
import ChatSidebarHeader from "../molecules/ChatSidebarHeader";
import ChatSidebarSearchBar from "../atoms/ChatSidebarSearchBar";
import ConversationList from "./ConversationList";
import CategoryFilterSection from "../molecules/CategoryFilterSection";
import CategoryListSection from "../molecules/CategoryListSection";
import CategoryCreate from "../atoms/CategoryCreate";

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
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
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

  // Add state for user-created categories
  const [userCategories, setUserCategories] = useState<string[]>(() => {
    // Initialize from conversations on mount
    const initial = Array.from(
      new Set(
        conversations
          .map((c) => (typeof c.category === "string" ? c.category.trim().toLowerCase() : undefined))
          .filter((cat): cat is string => typeof cat === "string" && !!cat && !["all", "saved"].includes(cat)),
      ),
    );
    return initial;
  });

  // Like/dislike state: { [messageId: string]: 'like' | 'dislike' | undefined }
  const [aiFeedback, setAiFeedback] = useState<{ [id: string]: "like" | "dislike" | undefined }>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("zenhealth-ai-feedback");
        return stored ? JSON.parse(stored) : {};
      } catch {
        return {};
      }
    }
    return {};
  });

  // Persist feedback to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("zenhealth-ai-feedback", JSON.stringify(aiFeedback));
    }
  }, [aiFeedback]);

  // Favorite conversations state (persisted in localStorage)
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("zenhealth-favorites");
        if (stored) return JSON.parse(stored);
      } catch {}
    }
    return [];
  });
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("zenhealth-favorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const toggleFavorite = (conversationId: string) => {
    setFavorites((prev) => (prev.includes(conversationId) ? prev.filter((id) => id !== conversationId) : [...prev, conversationId]));
  };

  const handleSelectFavorite = (conversationId: string) => {
    handleSelectConversation(conversationId);
    setSettingsOpen(false);
  };

  // Count likes/dislikes for current conversation
  const aiMessages = currentConversation?.messages.filter((m) => m.sender === "ai") || [];
  const likeCount = aiMessages.filter((m) => aiFeedback[m.id] === "like").length;
  const dislikeCount = aiMessages.filter((m) => aiFeedback[m.id] === "dislike").length;

  // Handler for like/dislike
  const handleFeedback = useCallback((msgId: string, type: "like" | "dislike") => {
    setAiFeedback((prev) => {
      if (prev[msgId] === type) {
        // Toggle off
        const { [msgId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [msgId]: type };
    });
  }, []);

  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  // WebSocket connection
  useEffect(() => {
    websocketService.connect();
    const unsubscribe = websocketService.onMessage(handleWebSocketMessage);
    return () => {
      unsubscribe(); // Remove the handler on unmount
      // Removed websocketService.disconnect() to keep the connection alive
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
    if (!inputMessage.trim() || !currentConversation || isLoading) return;
    setIsLoading(true);

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
    setConversations((prev) => {
      const updated = [newConversation, ...prev];
      setCurrentConversation(updated[0]);
      return updated;
    });
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
  const categories = [...userCategories];

  // Add a new category
  const handleAddCategory = () => {
    const cat = newCategory.trim().toLowerCase();
    if (cat && !userCategories.includes(cat) && !defaultCategories.includes(cat)) {
      setUserCategories((prev) => [...prev, cat]);
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

  // Remove a category and update conversations
  const handleRemoveCategory = (cat: string) => {
    setUserCategories((prev) => prev.filter((c) => c !== cat));
    setConversations((prev) => prev.map((conv) => (typeof conv.category === "string" && conv.category.trim().toLowerCase() === cat ? { ...conv, category: undefined } : conv)));
    // If currentConversation was in this category, update it too
    if (currentConversation && typeof currentConversation.category === "string" && currentConversation.category.trim().toLowerCase() === cat) {
      setCurrentConversation({ ...currentConversation, category: undefined });
    }
    // If the filter was on this category, reset to 'all'
    if (categoryFilter === cat) setCategoryFilter("all");
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
        // Always set currentConversation to the updated object from the new array
        setCurrentConversation(updated.find((c) => c.id === message.conversationId) || null);
        return updated;
      });
      setIsTyping(false);
      setIsLoading(false);
    } else if (message.type === "typing") {
      setIsTyping(true);
    } else if (message.type === "error") {
      setIsLoading(false);
      console.error("WebSocket error:", message.content);
      setIsTyping(false);
    }
  };

  const handleResetAll = () => {
    localStorage.removeItem("zenhealth-chat-state");
    window.location.reload();
  };

  const [isLoading, setIsLoading] = useState(false);

  // Compute only valid favorite conversation IDs
  const validFavoriteIds = favorites.filter((fid) => conversations.some((c) => c.id === fid));
  const {
    displayedItems: displayedFavorites,
    showAll: showAllFavorites,
    showMore: showMoreFavorites,
    showLess: showLessFavorites,
    total: totalFavorites,
    hasMore: hasMoreFavorites,
  } = useShowMore(validFavoriteIds, 3);

  // Helper for rendering a small category badge
  const renderSmallCategoryBadge = (cat: string | undefined) => {
    const c = typeof cat === "string" ? cat.trim().toLowerCase() : "";
    if (!c) return <span className="ml-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold">Default</span>;
    if (c === "saved") return <span className="ml-1 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold">Saved</span>;
    return <span className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[9px] font-semibold">{c.charAt(0).toUpperCase() + c.slice(1)}</span>;
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
        {/* Header */}
        <ChatSidebarHeader
          onClose={onClose}
          onToggleSettings={() => setSettingsOpen((v) => !v)}
          settingsOpen={settingsOpen}
          settingsButtonRef={settingsButtonRef}
          createNewConversation={createNewConversation}
        />

        {/* Search */}
        <ChatSidebarSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <ConversationList
            filteredConversations={filteredConversations}
            currentConversation={currentConversation}
            handleSelectConversation={handleSelectConversation}
            aiFeedback={aiFeedback}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        </ScrollArea>

        {/* Categories */}
        <div className="p-4 border-t border-slate-200">
          <h3 className="font-medium text-slate-700 mb-3">Categories</h3>

          {/* Create new category at the top */}
          <CategoryCreate newCategory={newCategory} setNewCategory={setNewCategory} handleAddCategory={handleAddCategory} />

          {/* Filter by Category section */}
          <CategoryFilterSection
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            userCategories={userCategories}
            defaultCategories={defaultCategories}
            handleRemoveCategory={handleRemoveCategory}
          />

          {/* Category List section */}
          <CategoryListSection userCategories={userCategories} defaultCategories={defaultCategories} />
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
                  <div className="flex items-center gap-2">
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
                    {currentConversation && (
                      <HeartIcon className={`w-5 h-5 ${favorites.includes(currentConversation.id) ? "fill-emerald-500 text-emerald-500" : "text-slate-400"}`} />
                    )}
                  </div>
                )}
                <p className="text-sm text-slate-500">AI Health Assistant • Online</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {/* Category assignment dropdown */}
              {currentConversation && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Category:</span>
                  <select
                    className="border rounded px-2 py-1 text-xs mr-2"
                    value={typeof currentConversation.category === "string" ? currentConversation.category.trim().toLowerCase() : ""}
                    onChange={(e) => handleAssignCategory(e.target.value)}
                  >
                    <option value="">Default</option>
                    <option value="saved">Saved</option>
                    {userCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                  {/* Category badge */}
                  {(() => {
                    const cat = typeof currentConversation.category === "string" ? currentConversation.category.trim().toLowerCase() : "";
                    if (!cat) {
                      return <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">Default</span>;
                    }
                    if (cat === "saved") {
                      return <span className="ml-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-semibold">Saved</span>;
                    }
                    return <span className="ml-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-semibold">{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>;
                  })()}
                  {/* Like/Dislike counts */}
                  <span className="flex items-center gap-1 ml-2">
                    <ThumbsUp className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs text-emerald-700 font-semibold">{likeCount}</span>
                    <ThumbsDown className="w-4 h-4 text-red-500 ml-2" />
                    <span className="text-xs text-red-700 font-semibold">{dislikeCount}</span>
                  </span>
                </div>
              )}
              <ConversationDropdown
                onDelete={() => {
                  if (!currentConversation) return;
                  setConversations((prev) => {
                    const updated = prev.filter((c) => c.id !== currentConversation.id);
                    setCurrentConversation(updated[0] || null);
                    if (updated.length === 0) onClose();
                    return updated;
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {currentConversation?.messages.map((message, idx) => (
              <div
                key={typeof message.id === "string" && message.id.trim().length > 0 ? message.id : `msg-fallback-${idx}`}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} items-center`}
              >
                {message.sender === "ai" ? (
                  <>
                    <span className="mr-2 flex items-center justify-center self-center">
                      <Brain className="w-5 h-5 text-emerald-400" />
                    </span>
                    <div className="flex flex-col">
                      <div className={`max-w-[70vw] rounded-2xl p-4 bg-slate-100 text-slate-800`}>
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs mt-2 text-slate-500">
                          {format(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp), "yyyy-MM-dd HH:mm:ss")}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-2" style={{ marginLeft: 0 }}>
                        <button
                          className={`p-1 rounded-full ${aiFeedback[message.id] === "like" ? "bg-emerald-100 text-emerald-600" : "text-slate-400 hover:text-emerald-500"}`}
                          onClick={() => handleFeedback(message.id, "like")}
                          aria-label="Like"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </button>
                        <button
                          className={`p-1 rounded-full ${aiFeedback[message.id] === "dislike" ? "bg-red-100 text-red-600" : "text-slate-400 hover:text-red-500"}`}
                          onClick={() => handleFeedback(message.id, "dislike")}
                          aria-label="Dislike"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`max-w-[70%] rounded-2xl p-4 bg-emerald-500 text-white`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-2 text-emerald-100">
                        {format(message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp), "yyyy-MM-dd HH:mm:ss")}
                      </p>
                    </div>
                    <span className="ml-2 flex items-center justify-center self-center">
                      <User className="w-5 h-5 text-white bg-emerald-500 rounded-full p-0.5" />
                    </span>
                  </>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 text-slate-800 rounded-2xl p-4">
                  <div className="flex items-center space-x-2">
                    <TypingIndicator dotColorClass="bg-slate-400" />
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
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              {isLoading ? <LoadingSpinner /> : <Send className="w-4 h-4" />}
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
              {/* Favorites section */}
              <div className="mb-6">
                <span className="text-xs text-slate-500 font-semibold mb-2 flex items-center gap-2">
                  Favorites
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold min-w-[18px] h-[18px]">
                    {validFavoriteIds.length}
                  </span>
                </span>
                {validFavoriteIds.length === 0 && <div className="text-xs text-slate-400">No favorites yet.</div>}
                <ul className="space-y-2">
                  {displayedFavorites
                    .map((fid) => {
                      const favConv = conversations.find((c) => c.id === fid);
                      if (!favConv) return null;
                      return (
                        <li key={fid}>
                          <button className="w-full text-left flex items-center gap-2 px-2 py-1 rounded hover:bg-emerald-50" onClick={() => handleSelectFavorite(fid)}>
                            <HeartIcon className="w-4 h-4 fill-emerald-500 text-emerald-500 flex-shrink-0" />
                            <span className="truncate font-medium text-slate-800 flex items-center gap-1">
                              {favConv.title}
                              <CategoryBadge category={favConv.category} size="sm" />
                            </span>
                            <span className="text-xs text-slate-400 ml-auto">{favConv.updatedAt instanceof Date ? favConv.updatedAt.toLocaleDateString("en-US") : ""}</span>
                          </button>
                        </li>
                      );
                    })
                    .filter(Boolean)}
                </ul>
                {hasMoreFavorites && !showAllFavorites && (
                  <button className="mt-2 text-xs text-emerald-600 hover:underline focus:outline-none" onClick={showMoreFavorites}>
                    Show more
                  </button>
                )}
                {hasMoreFavorites && showAllFavorites && (
                  <button className="mt-2 text-xs text-emerald-600 hover:underline focus:outline-none" onClick={showLessFavorites}>
                    Show less
                  </button>
                )}
                {/* Liked messages preview */}
                <LikedMessagesList conversations={conversations} aiFeedback={aiFeedback} onSelectConversation={handleSelectFavorite} />
              </div>
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
