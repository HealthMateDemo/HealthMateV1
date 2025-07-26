"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import useShowMore from "@/hooks/useShowMore";
import { WebSocketMessage, websocketService } from "@/lib/websocket";
import { getImagesCount } from "@/util/imagesNumber";
import { getInfoCount } from "@/util/infoNumber";
import { getNotesCount } from "@/util/notesNumber";
import { useCallback, useEffect, useRef, useState } from "react";
import CategoryCreate from "../atoms/CategoryCreate";
import ChatInput from "../atoms/ChatInput";
import CategoryFilterSection from "../molecules/CategoryFilterSection";
import CategoryListSection from "../molecules/CategoryListSection";
import ChatHeader from "../molecules/ChatHeader";
import ChatSidebarHeader from "../molecules/ChatSidebarHeader";
import ImagesSidebar from "../molecules/ImagesSidebar";
import InfoSidebar from "../molecules/InfoSidebar";
import NotesSidebar from "../molecules/NotesSidebar";
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

interface SavedImage {
  id: string;
  src: string;
  name: string;
  timestamp: Date;
  conversationId?: string;
}

interface SavedUrl {
  id: string;
  url: string;
  title: string;
  timestamp: Date;
  conversationId?: string;
}

interface SavedEmail {
  id: string;
  email: string;
  title: string;
  timestamp: Date;
  conversationId?: string;
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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [notes, setNotes] = useState<{ [conversationId: string]: string }>({});
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const notesLoadedRef = useRef(false);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [isImagesOpen, setIsImagesOpen] = useState(false);
  const [savedUrls, setSavedUrls] = useState<SavedUrl[]>([]);
  const [savedEmails, setSavedEmails] = useState<SavedEmail[]>([]);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  // Load notes, images, and sidebar state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Load notes
        const storedNotes = localStorage.getItem("zenhealth-notes");
        if (storedNotes) {
          const parsedNotes = JSON.parse(storedNotes);
          setNotes(parsedNotes);
        }

        // Load images
        const storedImages = localStorage.getItem("zenhealth-images-history");
        if (storedImages) {
          const parsedImages = JSON.parse(storedImages);
          // Convert timestamp strings back to Date objects
          const imagesWithDates = parsedImages.map((image: any) => ({
            ...image,
            timestamp: new Date(image.timestamp),
          }));
          setSavedImages(imagesWithDates);
        }

        // Load URLs
        const storedUrls = localStorage.getItem("zenhealth-urls-history");
        if (storedUrls) {
          const parsed = JSON.parse(storedUrls);
          const urlsWithDates = parsed.map((url: any) => ({
            ...url,
            timestamp: new Date(url.timestamp),
          }));
          setSavedUrls(urlsWithDates);
        }

        // Load emails
        const storedEmails = localStorage.getItem("zenhealth-emails-history");
        if (storedEmails) {
          const parsed = JSON.parse(storedEmails);
          const emailsWithDates = parsed.map((email: any) => ({
            ...email,
            timestamp: new Date(email.timestamp),
          }));
          setSavedEmails(emailsWithDates);
        }

        // Load sidebar state
        const storedSidebarState = localStorage.getItem("zenhealth-notes-sidebar-open");
        if (storedSidebarState) {
          const isOpen = JSON.parse(storedSidebarState);
          setIsNotesOpen(isOpen);
        }

        notesLoadedRef.current = true;
      } catch (error) {
        console.error("Error loading data from localStorage:", error);
        notesLoadedRef.current = true;
      }
    }
  }, []);

  // Extract images from existing conversations and add to saved images
  useEffect(() => {
    if (notesLoadedRef.current && savedImages.length === 0) {
      const extractedImages: SavedImage[] = [];

      conversations.forEach((conversation) => {
        conversation.messages.forEach((message) => {
          if (message.type === "image") {
            const [imageSrc, imageName] = message.content.split("|");
            if (imageSrc && imageName) {
              extractedImages.push({
                id: generateId(),
                src: imageSrc,
                name: imageName,
                timestamp: message.timestamp,
                conversationId: conversation.id,
              });
            }
          }
        });
      });

      if (extractedImages.length > 0) {
        setSavedImages(extractedImages);
        localStorage.setItem("zenhealth-images-history", JSON.stringify(extractedImages));
      }
    }
  }, [conversations, savedImages.length]);

  // Ensure notes are available when currentConversation changes
  useEffect(() => {
    if (currentConversation && notesLoadedRef.current) {
      // Only initialize empty notes if this conversation doesn't have any notes at all
      // Don't overwrite existing notes that were loaded from localStorage
      if (notes[currentConversation.id] === undefined) {
        setNotes((prev) => ({
          ...prev,
          [currentConversation.id]: "",
        }));
      }
    }
  }, [currentConversation]);

  // Persist notes to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("zenhealth-notes", JSON.stringify(notes));
    }
  }, [notes]);

  // Persist sidebar state to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("zenhealth-notes-sidebar-open", JSON.stringify(isNotesOpen));
    }
  }, [isNotesOpen]);

  // Add state for category filter
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Add state for search functionality
  const [searchTerm, setSearchTerm] = useState("");

  // Add state for new category creation
  const [newCategory, setNewCategory] = useState("");

  // Add state for settings panel
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Add state for sidebar view toggle (conversations vs recent messages)
  const [sidebarView, setSidebarView] = useState<"conversations" | "messages">("conversations");

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
    if ((!inputMessage.trim() && !uploadedImage) || !currentConversation || isLoading) return;
    setIsLoading(true);

    let messageContent = inputMessage;
    let messageType: "text" | "image" = "text";

    // If there's an uploaded image, create an image message
    if (uploadedImage) {
      // Store both the base64 data and filename in the content
      messageContent = `${uploadedImage}|${uploadedImageName || "Unknown file"}`;
      messageType = "image";
    }

    const userMessage: Message = {
      id: generateId(),
      content: messageContent,
      sender: "user",
      timestamp: new Date(),
      type: messageType,
    };

    setConversations((prev) => {
      // Find the correct conversation by id
      const updated = prev.map((conv) => (conv.id === currentConversation.id ? { ...conv, messages: [...conv.messages, userMessage], updatedAt: new Date() } : conv));
      // Set currentConversation to the updated object from the new array
      const updatedCurrent = updated.find((c) => c.id === currentConversation.id) || null;
      setCurrentConversation(updatedCurrent);
      return updated;
    });

    // Save image to images history if it's an image message
    if (messageType === "image" && uploadedImage) {
      const newSavedImage: SavedImage = {
        id: generateId(),
        src: uploadedImage,
        name: uploadedImageName || "Unknown file",
        timestamp: new Date(),
        conversationId: currentConversation.id,
      };

      // Get all images from localStorage and add the new one
      const allImages = [...savedImages];
      const updatedImages = [newSavedImage, ...allImages.slice(0, 9)]; // Keep last 10 images
      setSavedImages(updatedImages);
      localStorage.setItem("zenhealth-images-history", JSON.stringify(updatedImages));
    }

    setInputMessage("");
    // Clear the uploaded image after sending
    if (uploadedImage) {
      setUploadedImage(null);
      setUploadedImageName(null);
    }
    setIsTyping(true);

    // Send message to WebSocket
    websocketService.sendMessage({
      type: "message",
      content: messageType === "image" ? "Image uploaded for analysis" : inputMessage,
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

  // Image upload handlers
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    // Check file size (limit to 5MB to prevent localStorage issues)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("Image file is too large. Please upload an image smaller than 5MB.");
      return;
    }

    setIsProcessingImage(true);

    // Compress image if it's larger than 1MB
    if (file.size > 1024 * 1024) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 800px width/height)
        const maxDimension = 800;
        let { width, height } = img;

        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);

        setUploadedImage(compressedDataUrl);
        setUploadedImageName(file.name);
        setIsProcessingImage(false);

        // Clean up the temporary blob URL
        URL.revokeObjectURL(img.src);
      };

      img.src = URL.createObjectURL(file);
    } else {
      // Convert file to base64 for persistence (no compression needed)
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        setUploadedImage(base64Data);
        setUploadedImageName(file.name);
        setIsProcessingImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    if (uploadedImage) {
      // No need to revoke URL since we're using base64 data
      setUploadedImage(null);
      setUploadedImageName(null);
    }
  };

  // Notes handlers
  const handleNotesToggle = () => {
    setIsNotesOpen(!isNotesOpen);
  };

  const handleNotesChange = (newNotes: string) => {
    if (!currentConversation) return;
    setNotes((prev) => ({
      ...prev,
      [currentConversation.id]: newNotes,
    }));
  };

  // Get current conversation's notes
  const getCurrentNotes = () => {
    const currentNotes = currentConversation ? notes[currentConversation.id] || "" : "";
    return currentNotes;
  };

  // Get current conversation's notes count
  const getCurrentNotesCount = () => {
    return getNotesCount(currentConversation?.id);
  };

  // Images handlers
  const handleImagesToggle = () => {
    setIsImagesOpen(!isImagesOpen);
  };

  const handleImagesChange = (newImages: SavedImage[]) => {
    setSavedImages(newImages);
  };

  // Get current images count
  const getCurrentImagesCount = () => {
    return getImagesCount(currentConversation?.id);
  };

  // Info handlers
  const handleInfoToggle = () => {
    setIsInfoOpen(!isInfoOpen);
  };

  const handleUrlsChange = (newUrls: SavedUrl[]) => {
    setSavedUrls(newUrls);
  };

  const handleEmailsChange = (newEmails: SavedEmail[]) => {
    setSavedEmails(newEmails);
  };

  // Get current info count
  const getCurrentInfoCount = () => {
    return getInfoCount(currentConversation?.id);
  };

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

  // Extract URLs and emails from text content
  const extractUrlsAndEmails = (content: string) => {
    const urls: SavedUrl[] = [];
    const emails: SavedEmail[] = [];

    // Extract URLs
    const urlRegex = /https?:\/\/[^\s]+/g;
    const urlMatches = content.match(urlRegex);
    if (urlMatches) {
      urlMatches.forEach((url) => {
        // Clean up URL (remove trailing punctuation)
        const cleanUrl = url.replace(/[.,;!?]+$/, "");
        urls.push({
          id: generateId(),
          url: cleanUrl,
          title: `URL from AI response`,
          timestamp: new Date(),
          conversationId: currentConversation?.id,
        });
      });
    }

    // Extract emails
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emailMatches = content.match(emailRegex);
    if (emailMatches) {
      emailMatches.forEach((email) => {
        emails.push({
          id: generateId(),
          email: email,
          title: `Email from AI response`,
          timestamp: new Date(),
          conversationId: currentConversation?.id,
        });
      });
    }

    return { urls, emails };
  };

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
    localStorage.removeItem("zenhealth-notes");
    localStorage.removeItem("zenhealth-notes-sidebar-open");
    localStorage.removeItem("zenhealth-notes-history"); // Clear notes history
    localStorage.removeItem("zenhealth-images-history"); // Clear images history
    localStorage.removeItem("zenhealth-urls-history"); // Clear URLs history
    localStorage.removeItem("zenhealth-emails-history"); // Clear emails history
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

        {/* Sidebar Content */}
        <ScrollArea className="flex-1">
          {sidebarView === "conversations" ? (
            <ConversationList
              filteredConversations={filteredConversations}
              currentConversation={currentConversation}
              handleSelectConversation={handleSelectConversation}
              aiFeedback={aiFeedback}
              favorites={favorites}
              toggleFavorite={toggleFavorite}
              handleArchive={handleArchive}
              sidebarView={sidebarView}
              setSidebarView={setSidebarView}
            />
          ) : (
            <RecentMessagesSection conversations={conversations} sidebarView={sidebarView} setSidebarView={setSidebarView} onSelectConversation={handleSelectConversation} />
          )}
        </ScrollArea>

        {/* Categories */}
        <div className="p-4 border-t border-slate-200 max-h-[254px] overflow-y-auto">
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
          notesCount={getCurrentNotesCount()}
          imagesCount={getCurrentImagesCount()}
          infoCount={getCurrentInfoCount()}
          onClose={onClose}
          setConversations={setConversations}
          setCurrentConversation={setCurrentConversation}
          handleAssignCategory={handleAssignCategory}
          handleAssignTemplate={handleAssignTemplate}
          isNotesOpen={isNotesOpen}
          onNotesToggle={handleNotesToggle}
          isImagesOpen={isImagesOpen}
          onImagesToggle={handleImagesToggle}
          isInfoOpen={isInfoOpen}
          onInfoToggle={handleInfoToggle}
        />

        {/* Messages Area */}
        <MessageArea currentConversation={currentConversation} aiFeedback={aiFeedback} handleFeedback={handleFeedback} isTyping={isTyping} />

        {/* Input Area */}
        <ChatInput
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
          handleImageUpload={handleImageUpload}
          isLoading={isLoading}
          isProcessingImage={isProcessingImage}
          uploadedImage={uploadedImage}
          uploadedImageName={uploadedImageName}
          onRemoveImage={handleRemoveImage}
        />
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

      {/* Notes Sidebar */}
      <NotesSidebar
        key={`notes-${currentConversation?.id || "no-conversation"}-${notesLoadedRef.current}`}
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        notes={getCurrentNotes()}
        onNotesChange={handleNotesChange}
        conversationId={currentConversation?.id}
      />

      {/* Images Sidebar */}
      <ImagesSidebar
        key={`images-${currentConversation?.id || "no-conversation"}`}
        isOpen={isImagesOpen}
        onClose={() => setIsImagesOpen(false)}
        images={savedImages}
        onImagesChange={handleImagesChange}
        conversationId={currentConversation?.id}
      />

      {/* Info Sidebar */}
      <InfoSidebar
        key={`info-${currentConversation?.id || "no-conversation"}`}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        urls={savedUrls}
        emails={savedEmails}
        onUrlsChange={handleUrlsChange}
        onEmailsChange={handleEmailsChange}
        conversationId={currentConversation?.id}
      />
    </div>
  );
}
