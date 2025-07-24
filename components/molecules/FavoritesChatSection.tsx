import CategoryBadge from "@/components/atoms/CategoryBadge";
import NumberBadge from "@/components/atoms/NumberBadge";
import TemplateCategory from "@/components/atoms/TemplateCategory";
import LikedMessagesList from "@/components/molecules/LikedMessagesList";
import { Heart as HeartIcon } from "lucide-react";
import React from "react";

interface Conversation {
  id: string;
  title: string;
  messages: any[];
  createdAt: Date;
  updatedAt: Date;
  category?: string;
  isSaved?: boolean;
  template?: "global" | "health" | "mindfull";
}

interface FavoritesChatSectionProps {
  validFavoriteIds: string[];
  displayedFavorites: string[];
  conversations: Conversation[];
  handleSelectFavorite: (fid: string) => void;
  hasMoreFavorites: boolean;
  showAllFavorites: boolean;
  showMoreFavorites: () => void;
  showLessFavorites: () => void;
  aiFeedback: { [id: string]: "like" | "dislike" | undefined };
}

const FavoritesChatSection: React.FC<FavoritesChatSectionProps> = ({
  validFavoriteIds,
  displayedFavorites,
  conversations,
  handleSelectFavorite,
  hasMoreFavorites,
  showAllFavorites,
  showMoreFavorites,
  showLessFavorites,
  aiFeedback,
}) => {
  return (
    <div className="mb-6">
      <span className="text-xs text-slate-500 font-semibold mb-2 flex items-center gap-2">
        Favorites
        <NumberBadge count={validFavoriteIds.length} variant="emerald" />
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
                  <span className="truncate font-medium text-slate-800 flex text-xs items-center gap-1">
                    {favConv.title}
                    <CategoryBadge category={favConv.category} size="sm" />
                    <TemplateCategory template={favConv.template || "global"} className="text-xs">
                      {favConv.template || "global"}
                    </TemplateCategory>
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
  );
};

export default FavoritesChatSection;
