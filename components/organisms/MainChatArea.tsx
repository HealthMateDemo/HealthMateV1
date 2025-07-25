"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import useShowMore from "@/hooks/useShowMore";
import { WebSocketMessage, websocketService } from "@/lib/websocket";
import { useCallback, useEffect, useRef, useState } from "react";
import CategoryCreate from "../atoms/CategoryCreate";
import ChatInput from "../atoms/ChatInput";
import CategoryFilterSection from "../molecules/CategoryFilterSection";
import CategoryListSection from "../molecules/CategoryListSection";
import ChatHeader from "../molecules/ChatHeader";
import ChatSidebarHeader from "../molecules/ChatSidebarHeader";
import RecentMessagesSection from "../molecules/RecentMessagesSection";
import ConversationList from "./ConversationList";
import MessageArea from "./MessageArea";
import SettingsPortal from "./SettingsPortal";

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

  // Add state for category filter
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Add state for search functionality
  const [searchTerm, setSearchTerm] = useState("");

  // Add state for new category creation
  const [newCategory, setNewCategory] = useState("");

  // Add state for settings panel
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Define default categories
  const defaultCategories = ["all", "saved"];

  // Add state for user-created categories (persisted in localStorage)
  const [userCategories, setUserCategories] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("zenhealth-user-categories");
        if (stored) {
          const storedCategories = JSON.parse(stored);
          // Also include categories from existing conversations to ensure consistency
          const conversationCategories = Array.from(
            new Set(
              conversations
                .map((c) => (typeof c.category === "string" ? c.category.trim().toLowerCase() : undefined))
                .filter((cat): cat is string => typeof cat === "string" && !!cat && !["all", "saved"].includes(cat)),
            ),
          );
          // Merge stored categories with conversation categories, removing duplicates
          const mergedCategories = Array.from(new Set([...storedCategories, ...conversationCategories]));
          return mergedCategories;
        }
      } catch {}
    }
    // Fallback: Initialize from conversations on mount
    const initial = Array.from(
      new Set(
        conversations
          .map((c) => (typeof c.category === "string" ? c.category.trim().toLowerCase() : undefined))
          .filter((cat): cat is string => typeof cat === "string" && !!cat && !["all", "saved"].includes(cat)),
      ),
    );
    return initial;
  });

  // Persist user categories to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("zenhealth-user-categories", JSON.stringify(userCategories));
    }
  }, [userCategories]);

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

  // Archived conversations state (persisted in localStorage)
  const [archivedConversations, setArchivedConversations] = useState<Conversation[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("zenhealth-archived-conversations");
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed.map((conv: any) => ({
            ...conv,
            createdAt: new Date(conv.createdAt),
            updatedAt: new Date(conv.updatedAt),
            messages:
              conv.messages?.map((msg: any) => ({
                ...msg,
                timestamp: new Date(msg.timestamp),
              })) || [],
          }));
        }
      } catch {}
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("zenhealth-archived-conversations", JSON.stringify(archivedConversations));
    }
  }, [archivedConversations]);

  const handleArchive = (conversationId: string) => {
    const conversationToArchive = conversations.find((c) => c.id === conversationId);
    if (conversationToArchive) {
      setArchivedConversations((prev) => [...prev, conversationToArchive]);
      setConversations((prev) => prev.filter((c) => c.id !== conversationId));
      if (currentConversation?.id === conversationId) {
        setCurrentConversation(null);
      }
    }
  };

  const handleUnarchive = (conversationId: string) => {
    const conversationToUnarchive = archivedConversations.find((c) => c.id === conversationId);
    if (conversationToUnarchive) {
      setConversations((prev) => [conversationToUnarchive, ...prev]);
      setArchivedConversations((prev) => prev.filter((c) => c.id !== conversationId));
    }
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
      template: currentConversation.template || "global",
    });
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: generateId(),
      title: "New Chat",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      template: "global", // Set default template to global
    };
    setConversations((prev) => {
      const updated = [newConversation, ...prev];
      setCurrentConversation(updated[0]);
      return updated;
    });
  };

  const generateId = () => (window.crypto?.randomUUID ? window.crypto.randomUUID() : Date.now().toString());

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

  // Assign a template to the current conversation
  const handleAssignTemplate = (template: "global" | "health" | "mindfull") => {
    if (!currentConversation) return;
    const updatedConversation = { ...currentConversation, template };
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
    localStorage.removeItem("zenhealth-user-categories");
    localStorage.removeItem("zenhealth-ai-feedback");
    localStorage.removeItem("zenhealth-favorites");
    localStorage.removeItem("zenhealth-archived-conversations");
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
    hasMore: hasMoreFavorites,
  } = useShowMore(validFavoriteIds, 3);

  return (
    <div className="fixed inset-0 bg-white z-50 flex overflow-hidden">
      {/* Left Sidebar */}
      <div className="max-w-[340px] bg-slate-50 border-r border-slate-200 flex flex-col">
        {/* Header */}
        <ChatSidebarHeader
          onClose={onClose}
          onToggleSettings={() => setSettingsOpen((v) => !v)}
          settingsOpen={settingsOpen}
          settingsButtonRef={settingsButtonRef}
          createNewConversation={createNewConversation}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <ConversationList
            filteredConversations={filteredConversations}
            currentConversation={currentConversation}
            handleSelectConversation={handleSelectConversation}
            aiFeedback={aiFeedback}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            handleArchive={handleArchive}
          />
        </ScrollArea>

        {/* Recent Messages */}
        <ScrollArea className="flex-1">
          <RecentMessagesSection conversations={conversations} />
        </ScrollArea>

        {/* Categories */}
        <div className="p-4 border-t border-slate-200 max-h-[220px] overflow-y-auto">
          <div className="flex items-center justify-between gap-4">
            <h3 className=" text-slate-700">Categories</h3>
            {/* Create new category at the top */}
            <CategoryCreate newCategory={newCategory} setNewCategory={setNewCategory} handleAddCategory={handleAddCategory} />
          </div>

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
        <ChatHeader
          currentConversation={currentConversation}
          favorites={favorites}
          userCategories={userCategories}
          likeCount={likeCount}
          dislikeCount={dislikeCount}
          onClose={onClose}
          setConversations={setConversations}
          setCurrentConversation={setCurrentConversation}
          handleAssignCategory={handleAssignCategory}
          handleAssignTemplate={handleAssignTemplate}
        />

        {/* Messages Area */}
        <MessageArea currentConversation={currentConversation} aiFeedback={aiFeedback} handleFeedback={handleFeedback} isTyping={isTyping} />

        {/* Input Area */}
        <ChatInput inputMessage={inputMessage} setInputMessage={setInputMessage} handleSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>

      {/* Settings Portal Dropdown */}
      <SettingsPortal
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        settingsButtonRef={settingsButtonRef}
        validFavoriteIds={validFavoriteIds}
        displayedFavorites={displayedFavorites}
        conversations={conversations}
        handleSelectFavorite={handleSelectFavorite}
        hasMoreFavorites={hasMoreFavorites}
        showAllFavorites={showAllFavorites}
        showMoreFavorites={showMoreFavorites}
        showLessFavorites={showLessFavorites}
        aiFeedback={aiFeedback}
        handleResetAll={handleResetAll}
        archivedConversations={archivedConversations}
        handleUnarchive={handleUnarchive}
      />
    </div>
  );
}
