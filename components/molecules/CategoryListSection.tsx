import React from "react";
import { FolderOpen, Save, MessageCircle } from "lucide-react";

interface CategoryListSectionProps {
  userCategories: string[];
  defaultCategories: string[];
}

const CategoryListSection: React.FC<CategoryListSectionProps> = ({ userCategories, defaultCategories }) => {
  return (
    <div className="mt-4">
      <span className="block text-xs text-slate-500 font-semibold mb-1">Category List</span>
      <div className="space-y-1 overflow-y-auto max-h-48 pr-1">
        <div className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-800 cursor-pointer">
          <FolderOpen className="w-3 h-3" />
          <span>All Conversations</span>
          <span className="ml-1 px-1 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold">Default</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-800 cursor-pointer">
          <Save className="w-3 h-3" />
          <span>Saved</span>
          <span className="ml-1 px-1 py-0.5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold">Default</span>
        </div>
        {/* User-created categories (no X button here) */}
        {userCategories
          .filter((cat) => !defaultCategories.includes(cat))
          .map((cat) => (
            <div key={cat} className="flex items-center space-x-1 text-xs text-slate-600 hover:text-slate-800 cursor-pointer">
              <MessageCircle className="w-3 h-3" />
              <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
              <span className="ml-1 px-1 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[9px] font-semibold">Created</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CategoryListSection;
