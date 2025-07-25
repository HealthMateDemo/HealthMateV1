import React from "react";
import ReactDOM from "react-dom";
import FavoritesChatSection from "../molecules/FavoritesChatSection";
import ArchiveConversation from "./ArchiveConversation";

interface Conversation {
  id: string;
  title: string;
  messages: any[];
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  isSaved?: boolean;
}

interface SettingsPortalProps {
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  settingsButtonRef: React.RefObject<HTMLButtonElement | null>;
  validFavoriteIds: string[];
  displayedFavorites: string[];
  conversations: Conversation[];
  handleSelectFavorite: (fid: string) => void;
  hasMoreFavorites: boolean;
  showAllFavorites: boolean;
  showMoreFavorites: () => void;
  showLessFavorites: () => void;
  aiFeedback: { [id: string]: "like" | "dislike" | undefined };
  handleResetAll: () => void;
  archivedConversations: Conversation[];
  handleUnarchive: (conversationId: string) => void;
}

const SettingsPortal: React.FC<SettingsPortalProps> = ({
  settingsOpen,
  setSettingsOpen,
  settingsButtonRef,
  validFavoriteIds,
  displayedFavorites,
  conversations,
  handleSelectFavorite,
  hasMoreFavorites,
  showAllFavorites,
  showMoreFavorites,
  showLessFavorites,
  aiFeedback,
  handleResetAll,
  archivedConversations,
  handleUnarchive,
}) => {
  if (!settingsOpen || typeof window === "undefined") return null;

  // Calculate portal position based on settings button
  const getPortalPosition = () => {
    const buttonRect = settingsButtonRef.current?.getBoundingClientRect();
    const top = buttonRect ? buttonRect.bottom + 8 : 80;
    const left = buttonRect ? buttonRect.left : 80;

    return { top, left };
  };

  // Portal styles
  const portalStyles = {
    overlay: {
      position: "fixed" as const,
      inset: 0,
      zIndex: 50,
      pointerEvents: "auto" as const,
    },
    container: {
      position: "absolute" as const,
      backgroundColor: "white",
      borderRadius: "1rem",
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      padding: "1.5rem",
      width: "360px",
      transition: "all 0.3s ease-out",
      opacity: settingsOpen ? 1 : 0,
      transform: settingsOpen ? "scale(1)" : "scale(0.95)",
      ...getPortalPosition(),
    },
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50" style={portalStyles.overlay} onClick={() => setSettingsOpen(false)}>
      <div style={portalStyles.container} onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-4 border-b border-slate-200 pb-2 text-center">Overview</h2>

        <FavoritesChatSection
          validFavoriteIds={validFavoriteIds}
          displayedFavorites={displayedFavorites}
          conversations={conversations}
          handleSelectFavorite={handleSelectFavorite}
          hasMoreFavorites={hasMoreFavorites}
          showAllFavorites={showAllFavorites}
          showMoreFavorites={showMoreFavorites}
          showLessFavorites={showLessFavorites}
          aiFeedback={aiFeedback}
        />

        <div className="mt-6 border-t border-slate-200 pt-4">
          <ArchiveConversation archivedConversations={archivedConversations} handleUnarchive={handleUnarchive} aiFeedback={aiFeedback} />
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
  );
};

export default SettingsPortal;
