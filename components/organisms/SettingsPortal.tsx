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
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50" onClick={() => setSettingsOpen(false)} style={{ pointerEvents: "auto" }}>
      <div
        className="absolute bg-white rounded-2xl shadow-xl p-6 w-[360px] transition-all duration-300 ease-out"
        style={{
          top: settingsButtonRef.current ? settingsButtonRef.current.getBoundingClientRect().bottom + 8 : 80,
          left: settingsButtonRef.current ? settingsButtonRef.current.getBoundingClientRect().left : 80,
          opacity: settingsOpen ? 1 : 0,
          transform: settingsOpen ? "scale(1)" : "scale(0.95)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
